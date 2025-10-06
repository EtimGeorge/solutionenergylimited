# SEESL Website Backend

This directory contains a simple Node.js server built with Express.js to handle form submissions from the main SEESL website.

## 1. Purpose

The primary purpose of this backend is to provide a reliable and scalable solution for capturing and storing contact form inquiries. It replaces the previous dependency on the third-party service Formspree, giving SEESL full ownership and control over its user data.

Initially, all submissions are stored in a `submissions.json` file within this directory.

## 2. Setup and Installation

To run this server, you need to have Node.js and npm installed on your machine.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    This command reads the `package.json` file and installs the necessary libraries (Express, body-parser, cors).
    ```bash
    npm install
    ```

## 3. Running the Server

To start the server, run the following command from within the `backend` directory:

```bash
npm start
```

The server will start and listen on `http://localhost:3000`.

## 4. API Endpoint

The server exposes a single API endpoint to handle form submissions.

*   **Endpoint:** `POST /submit`
*   **Description:** Receives form data submitted from the website's contact form.
*   **Request Body:** Expects a JSON object containing the form fields (e.g., `name`, `email`, `service`, `message`).
*   **Success Response:**
    *   **Status Code:** `200 OK`
    *   **Body:** `Submission successful!`
*   **Error Response:**
    *   **Status Code:** `500 Internal Server Error`
    *   **Body:** A message indicating the nature of the error (e.g., "Error saving submission.").

## 5. Data Storage

All form submissions are stored in a file named `submissions.json` in this directory. Each submission is saved as a JSON object with the following structure:

```json
{
  "id": 1678886400000,
  "timestamp": "2025-03-15T12:00:00.000Z",
  "data": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "service": "engineering",
    "message": "This is a test submission."
  }
}
```

## 6. Email Notification Configuration

The backend is configured to send email notifications for every form submission using Nodemailer. To enable this functionality, you need to set up the following environment variables in a `.env` file in the `backend/` directory.

**Important:** Do NOT commit your `.env` file to version control. Use `.env.example` as a template.

### Required Environment Variables:

*   **`SMTP_HOST`**: The hostname of your SMTP server (e.g., `smtp.gmail.com`, `smtp.mailgun.org`).
*   **`SMTP_PORT`**: The port for your SMTP server (e.g., `587` for TLS, `465` for SSL).
*   **`SMTP_SECURE`**: Set to `true` if your SMTP server uses SSL (typically port 465), otherwise set to `false`.
*   **`SMTP_USER`**: The email address used to authenticate with the SMTP server (this will be the "from" address for the emails).
*   **`SMTP_PASS`**: The password or app-specific password for the `SMTP_USER`.
*   **`EMAIL_FROM_NAME`**: The name that will appear as the sender in the email (e.g., `"SEESL Website Forms"`).
*   **`EMAIL_FROM_ADDRESS`**: The email address that will appear as the sender (should generally match `SMTP_USER`).
*   **`EMAIL_TO`**: **The dedicated email address where you want to receive all form submissions.**

### Example `.env` file:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_sending_email@example.com
SMTP_PASS=your_email_password_or_app_password
EMAIL_FROM_NAME="SEESL Website Forms"
EMAIL_FROM_ADDRESS=your_sending_email@example.com
EMAIL_TO=your_receiving_email@example.com
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### After Configuration:

After setting up your `.env` file, you must restart the backend server for the changes to take effect.

```bash
npm restart
```