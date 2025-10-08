require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { Pool } = require('pg');
const fetch = require('node-fetch');
const winston = require('winston');

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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
app.use(helmet()); // Use Helmet!
const port = process.env.PORT || 3000;

// Apply rate limiting to all requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(options.statusCode).send(options.message);
    }
});

// Apply the rate limiting middleware to API calls only
app.use(apiLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
        logger.debug(`CORS: Request Origin: ${origin}`);
        logger.debug(`CORS: Allowed Origins: ${allowedOrigins.join(', ')}`);
        if (!origin || allowedOrigins.includes(origin)) {
            logger.debug(`CORS: Origin ${origin} allowed.`);
            callback(null, true);
        } else {
            logger.warn(`CORS: Origin ${origin} not allowed.`);
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));

// --- Database & Email Setup ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
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
        formOrigin 
    } = req.body;

    // 1. Server-Side Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, Email, and Message are required fields.' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // reCAPTCHA is completely bypassed for now
    logger.warn('reCAPTCHA is completely bypassed on server.');

    try {
        // 3. Database Insertion
        const standardsArray = Array.isArray(standard) ? standard : (standard ? [standard] : []);
        if (standard_other) {
            standardsArray.push(`Other: ${standard_other}`);
        }

        const query = `
            INSERT INTO form_submissions(name, email, phone, company, subject, message, service_interest, standards, region, how_did_you_hear, employees, form_origin)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id;
        `;
        const values = [
            name, email, phone, company, `New Inquiry from ${formOrigin}`,
            message, service_interest, standardsArray, region, how_did_you_hear, 
            employees, formOrigin
        ];

        const result = await pool.query(query, values);
        logger.info('Submission saved to database', { submissionId: result.rows[0].id });

        // 4. Email Notification
        const emailHtml = generateEmailHtml(`New Website Inquiry: ${formOrigin}`, {
            name, email, phone, company, service_interest, 
            standards: standardsArray.join(', '),
            region, how_did_you_hear, employees, message
        });

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: process.env.RECIPIENT_EMAIL,
            subject: `New Inquiry from ${formOrigin}`,
            html: emailHtml
        });

        logger.info('Email notification sent', { to: process.env.RECIPIENT_EMAIL });

        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        logger.error('Form submission processing error:', { message: error.message, stack: error.stack });
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