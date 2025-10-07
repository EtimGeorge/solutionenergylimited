# Deployment Guide: Node.js Backend with PostgreSQL

This guide provides instructions for deploying your Node.js backend with a PostgreSQL database, focusing on Render and exploring alternative free-tier hosting options.

## Part 1: Deploying to Render

### Render Free Tier Limitations (Important!)
*   Free Web Services spin down after 15 minutes of inactivity.
*   Free PostgreSQL Databases expire 30 days after creation (with a 14-day grace period).
*   Limited to 1 GB storage for PostgreSQL.
*   Only one Free PostgreSQL database per workspace.
*   No backups for free databases.

### Prerequisites
1.  A Node.js Application ready for deployment.
2.  Git Repository (GitHub, GitLab, or Bitbucket).
3.  Node.js and npm/yarn installed locally.

### Step-by-Step Deployment to Render

#### 1. Prepare Your Node.js Application
*   **`package.json` Scripts**: Ensure a `start` script exists (e.g., `"start": "node server.js"`).
*   **Dynamic Port**: Your app must listen on `process.env.PORT`.
*   **Database Connection**: Use environment variables (e.g., `DATABASE_URL`) for PostgreSQL connection.

#### 2. Create a Render Account
*   Sign up at [render.com](https://render.com/).

#### 3. Create a PostgreSQL Database on Render
*   From Dashboard, click "New +" -> "PostgreSQL".
*   Configure: Name, Region (note this!), Instance Type: "Free".
*   Click "Create Database".
*   **Save Credentials**: Copy the "Internal Database URL" and other credentials.

#### 4. Create a Web Service for Your Node.js App
*   From Dashboard, click "New +" -> "Web Service".
*   Connect your Git repository.
*   Configure:
    *   Name
    *   Region (same as DB)
    *   Branch (e.g., `main`)
    *   Root Directory: `backend/` (for our project)
    *   Runtime: "Node"
    *   Build Command: `npm install`
    *   Start Command: `npm start` (or `node server.js`)
    *   Instance Type: "Free"
*   Click "Create Web Service".

#### 5. Configure Environment Variables
*   In your Web Service dashboard, go to the "Environment" tab.
*   Add PostgreSQL credentials (e.g., `DATABASE_URL`, `PGUSER`, `PGPASSWORD`, etc.).
*   Add other necessary environment variables (e.g., `RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY`, `SMTP_HOST`, etc.).
*   Click "Save Changes".

#### 6. Deploy and Verify
*   Render will automatically build and deploy. Monitor progress in "Events" and "Logs".
*   Access your live application at the `onrender.com` URL.
*   Test frontend-backend communication.

## Part 2: Alternative Free-Tier Hosting Options

Here are some alternative platforms that offer free tiers for both Node.js application hosting and PostgreSQL databases, or can be combined for a free solution.

### Platforms Offering Both Node.js and PostgreSQL Free Tiers

1.  **Heroku**
    *   **Pros**: Long-standing, free tier for Node.js ("dynos") and PostgreSQL add-on.
    *   **Cons**: Free dynos sleep after 30 mins inactivity.

2.  **Fly.io**
    *   **Pros**: Good for Dockerized apps, generous free tier for VMs and PostgreSQL.
    *   **Cons**: Requires Docker knowledge.

3.  **Qovery**
    *   **Pros**: Deploy Node.js with PostgreSQL for free, includes SSL and CDN.

4.  **Railway**
    *   **Pros**: Developer-friendly, $5/month free credit for services and databases.
    *   **Cons**: Credit-based, can incur charges if exceeded.

### Combining Node.js Hosting with Dedicated Free PostgreSQL Hosting

This approach offers more flexibility and potentially more generous PostgreSQL free tiers.

#### Node.js Hosting Options (for static frontend compatibility)
*   **Vercel**: Excellent for static frontends and serverless functions (Node.js).
*   **Netlify**: Similar to Vercel, static sites and serverless functions (Node.js).
*   **Google Cloud Platform (GCP) / App Engine / Cloud Run**: Free tier with 12-month trial, suitable for Node.js.
*   **Amazon Web Services (AWS) / Elastic Beanstalk / Lambda**: Free tier, Node.js deployment.
*   **Koyeb**: Serverless cloud platform with a free plan for applications.

#### Dedicated Free Tier PostgreSQL Hosting Options
*   **Neon.tech**: Fully managed serverless PostgreSQL, 10GB storage, 3 projects free.
*   **ElephantSQL**: Free tier with 20MB data, 5 concurrent connections.
*   **Aiven for PostgreSQL**: Free plan with 1 CPU, 1 GB RAM, 5 GB disk.
*   **Supabase**: Open-source Firebase alternative, PostgreSQL with a free tier.
*   **Amazon RDS**: Free tier includes 20GB storage, 750 hours DB usage.

### Recommendation for Our Project

Given our current setup (static HTML/CSS/JS frontend, Node.js backend with PostgreSQL), and the temporary nature of Render's free PostgreSQL, here's a recommendation:

*   **Frontend**: Continue with Namecheap for static hosting.
*   **Backend (Node.js)**:
    *   **For short-term testing/development**: Render's free web service is a good option, but be mindful of the PostgreSQL database expiration.
    *   **For longer-term free usage**: Consider **Heroku** (if dyno sleeping is acceptable) or **Railway** (if usage stays within the $5 credit).
    *   **For more robust free PostgreSQL**: Combine a Node.js hosting platform (like Vercel/Netlify for serverless functions, or Fly.io for containerized Node.js) with a dedicated free PostgreSQL provider like **Neon.tech** or **Supabase**. This offers a more sustainable free PostgreSQL solution.

The choice depends on the expected usage, the need for persistent data, and comfort with different deployment models (serverless vs. containerized).

---