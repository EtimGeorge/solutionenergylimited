require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { Pool } = require('pg');
const fetch = require('node-fetch');
const winston = require('winston');

const cors = require('cors');

// --- Winston Logger Setup ---
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'seesl-backend' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// --- App & Middleware Setup ---
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
    'https://solutionenergylimited.com', 
    'https://www.solutionenergylimited.com',
    'https://etimgeorge.github.io', // Keep for existing pages if they are still in use
    'http://127.0.0.1:5500', // For local development
    'http://localhost:5500' // For local development
];
app.use(cors({ 
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// --- Database & Email Setup ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Helper Functions ---
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const generateEmailHtml = (title, data) => {
    let body = `<h2>${title}</h2><table border="1" cellpadding="5" cellspacing="0">`;
    for (const [key, value] of Object.entries(data)) {
        if (value) { // Only add rows for fields that have a value
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            body += `<tr><td style="font-weight: bold;">${formattedKey}</td><td>${value}</td></tr>`;
        }
    }
    body += '</table>';
    return body;
};

// --- API Endpoints ---

// Main Form Submission Endpoint
app.post('/submit-form', async (req, res) => {
    const { 
        name, email, phone, company, message, service_interest, 
        standard, standard_other, region, how_did_you_hear, employees, 
        recaptchaToken, formOrigin 
    } = req.body;

    // 1. Server-Side Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, Email, and Message are required fields.' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // 2. reCAPTCHA Verification
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}&remoteip=${ipAddress}`;

    try {
        const googleResponse = await fetch(googleVerifyUrl, { method: 'POST' }).then(res => res.json());
        if (!googleResponse.success || googleResponse.score < 0.5) {
            logger.warn('reCAPTCHA verification failed or low score', { ...googleResponse, ip: ipAddress, origin: formOrigin });
            return res.status(403).json({ success: false, message: 'Spam detection: reCAPTCHA verification failed.' });
        }

        logger.info('reCAPTCHA verification successful', { score: googleResponse.score, ip: ipAddress });

        // 3. Database Insertion
        const standardsArray = Array.isArray(standard) ? standard : (standard ? [standard] : []);
        if (standard_other) {
            standardsArray.push(`Other: ${standard_other}`);
        }

        const query = `
            INSERT INTO form_submissions(name, email, phone, company, subject, message, service_interest, standards, region, how_did_you_hear, employees, recaptcha_score, ip_address, form_origin)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id;
        `;
        const values = [
            name, email, phone, company, `New Inquiry from ${formOrigin}`,
            message, service_interest, standardsArray, region, how_did_you_hear, 
            employees, googleResponse.score, ipAddress, formOrigin
        ];

        const result = await pool.query(query, values);
        logger.info('Submission saved to database', { submissionId: result.rows[0].id });

        // 4. Email Notification
        const emailHtml = generateEmailHtml(`New Website Inquiry: ${formOrigin}`, {
            name, email, phone, company, service_interest, 
            standards: standardsArray.join(', '),
            region, how_did_you_hear, employees, message,
            ip_address: ipAddress,
            recaptcha_score: googleResponse.score
        });

        await resend.emails.send({
            from: 'noreply@solutionenergylimited.com',
            to: process.env.RECIPIENT_EMAIL,
            subject: `New Inquiry from ${formOrigin}`,
            html: emailHtml
        });

        logger.info('Email notification sent', { to: process.env.EMAIL_TO });

        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        logger.error('Form submission error:', { message: error.message, stack: error.stack, ip: ipAddress });
        res.status(500).json({ success: false, message: 'Failed to process your request. Please try again later.' });
    }
});

// Newsletter Subscription Endpoint
app.post('/subscribe-newsletter', async (req, res) => {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }

    try {
        const query = 'INSERT INTO newsletter_subscribers(email) VALUES($1) ON CONFLICT (email) DO NOTHING RETURNING id;';
        const result = await pool.query(query, [email]);

        if (result.rowCount > 0) {
            logger.info('New newsletter subscriber added', { email });
        } else {
            logger.info('Email already subscribed to newsletter', { email });
        }

        res.status(200).json({ success: true, message: 'Thank you for subscribing!' });

    } catch (error) {
        logger.error('Newsletter subscription error:', { message: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Subscription failed. Please try again.' });
    }
});


// --- Server Start ---
app.listen(port, () => {
    logger.info(`Backend server listening on port ${port}`);
});