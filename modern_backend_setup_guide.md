# Modern Backend Setup Guide (Neon & Resend)

**Version:** 1.0
**Date:** October 6, 2025

## 1. Overview

This guide replaces the previous cPanel implementation plan. We will use modern, cloud-based services to deploy our backend. This is simpler, more reliable, and avoids the issues we've faced with the traditional hosting environment.

### **Our New Stack:**

*   **Database:** Neon (Serverless PostgreSQL)
*   **Email Sending:** Resend (Transactional Email API)

### **Credentials We Need:**

1.  **Neon Database Connection String**
2.  **Resend API Key**

---

## 2. Guide Part A: Get Your Neon Database Credentials

**Step 1: Create a Neon Account**

1.  Go to the [Neon website](https://neon.tech).
2.  Sign up for a new account. You can sign up with a Google, GitHub, or email account. The free tier is very generous and more than enough for our needs.

**Step 2: Create a New Project**

1.  After signing up, you will be taken to the Neon dashboard. Click the **"Create a project"** button.
2.  Give your project a name, for example, `seesl-backend`.
3.  The database will be created automatically with the project. The default database name is usually `neondb`.

**Step 3: Find Your Database Connection String**

1.  On your project's dashboard, you will see a **"Connection Details"** card.
2.  Make sure the dropdown selects **"Postgres URL"**.
3.  The connection string will be displayed. It looks like this:
    `postgres://<user>:<password>@<host>.neon.tech/neondb?sslmode=require`
4.  Click the copy icon to copy the entire URL.

**What to Provide Me:**

*   The full **Postgres URL** connection string.

---

## 3. Guide Part B: Get Your Resend API Key

**Step 1: Create a Resend Account**

1.  Go to the [Resend website](https://resend.com).
2.  Sign up for a new account. The free plan allows you to send emails from your own domain.

**Step 2: Add and Verify Your Domain**

This is a crucial step to prove you own `solutionenergylimited.com` and can send emails from it.

1.  In the Resend dashboard, go to the **"Domains"** section from the left-hand menu.
2.  Click **"Add Domain"** and enter `solutionenergylimited.com`.
3.  Resend will provide you with a few DNS records (usually 2 or 3 `TXT` or `CNAME` records) that you need to add to your domain's DNS settings.
4.  You will need to log in to where you manage your domain's DNS (this is often with your domain registrar, like GoDaddy, Namecheap, or possibly within your cPanel) and add these records.
5.  Once added, go back to Resend and click the **"Verify"** button. It may take some time for DNS changes to propagate, but it's often quick.

**Step 3: Create an API Key**

1.  Once your domain is verified, go to the **"API Keys"** section from the left-hand menu.
2.  Click **"Create API Key"**.
3.  Give the key a name, like `seesl-backend-key`.
4.  Set the **Permission** to **"Full access"**.
5.  Click **"Add"**.
6.  **CRITICAL:** Resend will show you the API key **only once**. Copy it immediately and save it somewhere secure.

**What to Provide Me:**

*   The **Resend API Key**.

---

Once you have both the **Neon Connection String** and the **Resend API Key**, please provide them, and I will reconfigure the backend and prepare it for final deployment.
