# SEESL Website Backend

This directory contains the Node.js and Express.js server that powers the SEESL website's dynamic features, including form submissions and the blog.

## 1. Features

-   **Form Handling**: Securely processes submissions from various forms on the frontend.
-   **Blog API**: A complete RESTful API for creating, reading, updating, and deleting blog posts, comments, and likes.
-   **Database Integration**: Uses PostgreSQL for persistent data storage.
-   **Email Notifications**: Sends email notifications for form submissions using the Resend API.
-   **Security**: Includes basic security measures using `helmet`, `cors`, and `express-rate-limit`.
-   **Logging**: Utilizes `winston` to log application events and errors to files.

## 2. Setup and Installation

To run this server, you need to have Node.js and npm installed on your machine.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    This command reads the `package.json` file and installs the necessary libraries.
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `backend/` directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and fill in the required values for your database, email service, and API keys. See the "Environment Variables" section below for details.

## 3. Running the Server

To start the server for development, run the following command from within the `backend` directory:

```bash
npm start
```

The server will start and listen on the port defined in your `.env` file, which defaults to `http://localhost:3000`.

## 4. API Endpoints

The server exposes the following API endpoints.

### Form Endpoints
-   `POST /submit-form`: Receives and processes data from contact forms.
-   `POST /subscribe-newsletter`: Adds an email to the newsletter subscriber list.

### Blog Endpoints (`/api/blog`)
-   `GET /posts`: Retrieves a paginated list of all published blog posts.
-   `GET /posts/:slug`: Retrieves a single blog post by its slug.
-   `POST /posts`: Creates a new blog post. **(Admin only)**
-   `PUT /posts/:id`: Updates an existing blog post. **(Admin only)**
-   `DELETE /posts/:id`: Deletes a blog post. **(Admin only)**
-   `GET /posts/:postId/comments`: Retrieves all comments for a specific post.
-   `POST /posts/:postId/comments`: Adds a new comment to a post.
-   `POST /posts/:postId/likes`: Likes a post.
-   `DELETE /posts/:postId/likes`: Unlikes a post.

**Note**: Admin-only routes require a valid `x-api-key` header matching the `BLOG_ADMIN_API_KEY` environment variable.

## 5. Data Storage

The application uses a **PostgreSQL** database for all data storage, including form submissions, newsletter subscribers, and all blog-related content. The connection is configured via the `DATABASE_URL` environment variable.

## 6. Environment Variables

The following variables must be set in your `.env` file. Refer to `.env.example` for a template.

-   **`PORT`**: The port for the server to run on (e.g., `3000`).
-   **`DATABASE_URL`**: The full connection string for your PostgreSQL database.
    -   Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME`
-   **`BLOG_ADMIN_API_KEY`**: A strong, secret key for securing the blog admin API endpoints.
-   **`CORS_ORIGIN`**: A comma-separated list of frontend URLs that are permitted to access the API (e.g., `http://127.0.0.1:5500,https://your-live-site.com`).
-   **`RESEND_API_KEY`**: Your API key from the Resend email service.
-   **`RESEND_FROM_EMAIL`**: The "from" email address configured in your Resend account.
-   **`RECIPIENT_EMAIL`**: The email address where form submission notifications will be sent.

After setting up your `.env` file, you must restart the backend server for the changes to take effect.