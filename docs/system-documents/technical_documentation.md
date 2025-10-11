# SEESL Website - Technical Documentation

## 1. Introduction

This document provides a comprehensive technical overview of the SEESL website project. It is intended for developers and system administrators responsible for maintaining, troubleshooting, and extending the application.

The project is architected as a monorepo containing two primary components:
-   **Frontend**: A static website built with HTML, CSS, and vanilla JavaScript.
-   **Backend**: A Node.js API server responsible for handling form submissions, the blog, and other dynamic content.

---

## 2. Frontend Architecture

The frontend is designed as a classic static website without a modern JavaScript framework or build system. This makes it simple to deploy but requires manual management of dependencies and assets.

### 2.1. Core Technologies
-   **HTML5**: Used for structuring the web pages.
-   **CSS3**: Used for styling. The project utilizes CSS variables for theming (light/dark modes).
-   **JavaScript (ES6+)**: Used for client-side interactivity, form handling, and API communication.

### 2.2. Styling (CSS)
The project's styling is organized into several key files located in `frontend/css/`:
-   **`variables.css`**: Defines CSS variables for colors, fonts, spacing, etc. This is the central file for controlling the site's visual theme. It includes definitions for both light and dark modes under the `[data-theme="dark"]` selector.
-   **`styles.css`**: The main stylesheet containing global styles for layout, components (header, footer, buttons, cards), and page-specific components.
-   **`contact.css`, `legal-styles.css`, etc.**: Component-specific stylesheets that are loaded on their respective pages.
-   **Font Awesome**: Used for icons, loaded via a CDN link in the HTML headers.

### 2.3. Client-Side Logic (JavaScript)
The frontend JavaScript is modular, with different files handling specific concerns. All are located in `frontend/js/`.

-   **`config.js`**: This is a critical configuration file.
    -   **Function**: It centralizes frontend-specific variables, most importantly the `BACKEND_URL`. It dynamically sets this URL to `http://localhost:3000` for local development or `https://solutionenergylimited.onrender.com` for the live site.
    -   **Troubleshooting**: If the frontend cannot connect to the backend, this is the first file to check. Ensure the production URL is correct.
-   **`main.js`**: This is the main script for global interactivity.
    -   **Function**: Handles the mobile menu toggle, the theme (dark/light) switcher, the back-to-top button, and the lightbox for images.
-   **`update-contact-info.js`**:
    -   **Function**: Dynamically populates contact details like phone numbers and email addresses throughout the site using the values from `config.js`. This is excellent for maintainability.
-   **`forms.js`**:
    -   **Function**: Provides a unified submission handler for most forms on the site. It captures form data, shows a "Submitting..." state, sends the data to the backend, and displays a success modal.
-   **`blog/blogList.js` & `blog/singleBlogPost.js`**:
    -   **Function**: These scripts fetch and render blog posts from the backend API, handling pagination, individual post views, comments, and likes.

### 2.4. ISO Certification Sub-site
The `frontend/services/iso-certification/` directory operates as a semi-independent micro-site with a unique "smart form" architecture.

-   **`_form-component.html`**: A master HTML file containing the structure for all ISO-related forms.
-   **`js/iso-smart-form.js`**: This script dynamically loads the `_form-component.html` into pages (`audit.html`, `contact.html`, etc.). It then customizes the form (e.g., changing the title, showing/hiding fields) based on `data-*` attributes on the container element in the host HTML page. This allows for a single, reusable form component across the entire sub-site.

### 2.5. Frontend Troubleshooting
-   **Forms not submitting**:
    1.  Check the browser's developer console (F12) for network errors.
    2.  Verify the `BACKEND_URL` in `frontend/js/config.js` is correct and the backend server is running.
    3.  Check for CORS errors in the console. If they appear, the `CORS_ORIGIN` variable in the backend's `.env` file may need to be updated to include the frontend's URL.
-   **Styling issues**:
    1.  Check `frontend/css/variables.css` for base color and spacing definitions.
    2.  Inspect the element in the browser to see which styles from `frontend/css/styles.css` (or other CSS files) are being applied.
-   **Interactivity not working (e.g., mobile menu)**:
    1.  Check the browser console for JavaScript errors.
    2.  Ensure `frontend/js/main.js` is being loaded correctly in the HTML file.

---

## 3. Backend Architecture

The backend is a Node.js server using the Express.js framework. Its primary roles are to serve a blog API and handle form submissions from the frontend.

### 3.1. Core Technologies & Key Dependencies
The backend's dependencies are listed in `backend/package.json`.

-   **`express`**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
-   **`pg`**: The PostgreSQL client for Node.js. Used for all database communication. It supports parameterized queries, which are used in this project to prevent SQL injection.
-   **`dotenv`**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`. This is crucial for keeping secrets (like database URLs and API keys) out of source code.
-   **`cors`**: A Node.js package for providing an Express middleware that can be used to enable CORS with various options.
-   **`helmet`**: Helps secure Express apps by setting various HTTP headers. It's a fundamental security best practice.
-   **`express-rate-limit`**: A basic rate-limiting middleware for Express. Used to limit repeated requests to public APIs and form endpoints, thereby preventing brute-force attacks.
-   **`body-parser`**: Middleware for parsing incoming request bodies. It's essential for handling POST requests with JSON payloads from the frontend forms.
-   **`winston`**: A versatile logging library. In this project, it's configured to log errors and combined information to `error.log` and `combined.log` respectively.
-   **`resend`**: A library for the Resend email API, used for sending email notifications for form submissions.
-   **`node-fetch`**: For making HTTP requests from the backend (used in seeding scripts).
-   **`jsdom`**: A JavaScript-based implementation of the WHATWG DOM and HTML standards, for use in Node.js. It is not used in the provided server code but may be part of an unlisted utility or testing script for parsing HTML content.

### 3.2. Project Structure
-   **`server.js`**: The application's entry point. It initializes the Express app, sets up all middleware (security, CORS, rate limiting), defines form submission and newsletter endpoints, and starts the server.
-   **`routes/blog/blogRoutes.js`**: Defines all API endpoints related to the blog, including creating, reading, updating, and deleting posts, as well as handling comments and likes.
-   **`middleware/blogAuth.js`**: A simple authentication middleware that protects blog admin routes by checking for a valid API key in the `x-api-key` header.
-   **`scripts/`**: Contains Node.js scripts for administrative tasks.
    -   `seedBlogPosts.js`: A script to populate the database with initial blog post data.
    -   `temp_add_blog_post.js`: A temporary script for adding a single blog post, likely used for testing.

### 3.3. Environment Variables
The backend configuration is managed via a `.env` file. The `backend/.env.example` file serves as a template.

-   `PORT`: The port on which the server will run (e.g., 3000).
-   `DATABASE_URL`: The connection string for the PostgreSQL database.
-   `BLOG_ADMIN_API_KEY`: A secret key required to access protected blog admin routes (POST, PUT, DELETE).
-   `CORS_ORIGIN`: A comma-separated list of URLs that are allowed to make requests to this backend.
-   `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RECIPIENT_EMAIL`: Credentials and settings for the Resend email service.

### 3.4. Backend Troubleshooting
-   **Server fails to start**:
    1.  Run `npm install` in the `backend` directory to ensure all dependencies are installed.
    2.  Check for a `.env` file and ensure all required variables (especially `DATABASE_URL`) are present.
-   **Database connection errors**:
    1.  Verify the `DATABASE_URL` in the `.env` file is correct.
    2.  Ensure the PostgreSQL database server is running and accessible from where the backend is hosted. Check firewall rules.
-   **Form submissions fail (500 Internal Server Error)**:
    1.  Check the `backend/error.log` and `backend/combined.log` files for detailed error messages from Winston.
    2.  Common causes include incorrect email credentials (`RESEND_*` variables) or database issues.
-   **Blog admin actions are forbidden (403 error)**:
    1.  Ensure the `x-api-key` header is being sent with the request.
    2.  Verify the key matches the `BLOG_ADMIN_API_KEY` value in the `.env` file.
