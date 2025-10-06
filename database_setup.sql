-- SEESL Database Setup Script
-- Version 1.1 (Corrected)
-- Date: October 6, 2025

-- This script creates the necessary tables for the form submission system.
-- To execute, log in to cPanel, open phpPgAdmin, select the 'soluaveo_seel_form' database,
-- click the 'SQL' tab, paste the content of this file, and click 'Execute'.

-- Create the table for storing all form submissions
CREATE TABLE form_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    service_interest VARCHAR(100),
    standards TEXT,
    region VARCHAR(100),
    how_did_you_hear VARCHAR(100),
    employees VARCHAR(50),
    form_origin VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    recaptcha_score REAL,
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Create the table for storing newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT NOW()
);

-- End of script