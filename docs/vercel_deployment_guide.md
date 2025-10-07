# Vercel Backend Deployment Guide

**Version:** 1.0
**Date:** October 6, 2025

## 1. Objective

This guide provides step-by-step instructions to deploy our Node.js backend (located in the `/backend` directory) to the Vercel hosting platform. This will give us a live, public URL that our website's forms can connect to.

---

## 2. Prerequisites

*   You have a Vercel account (if not, you will create one).
*   All of our latest code changes have been pushed to your GitHub repository.

---

## 3. Step-by-Step Deployment Instructions

### **Step 1: Sign Up or Log In to Vercel**

1.  Open your web browser and navigate to [vercel.com](https://vercel.com).
2.  Click **"Sign Up"** or **"Log In"**.
3.  **IMPORTANT:** Choose the option to **"Continue with GitHub"** (or GitLab/Bitbucket, whichever you use). This is the easiest way, as it will automatically connect Vercel to your code repositories.

### **Step 2: Import Your Project**

1.  Once you are logged into your Vercel dashboard, click the **"Add New..."** button (usually black and near the top right) and select **"Project"** from the dropdown menu.
2.  Vercel will now display a list of your Git repositories. Find your `solutionenergylimited` repository in this list.
3.  Click the **"Import"** button next to your repository's name.

### **Step 3: Configure the Project Settings**

This is the most important part. We need to tell Vercel how to build and run our project.

1.  **Root Directory:**
    *   You will see a section called **"Root Directory"**.
    *   By default, it will be set to the top level of your project.
    *   Click the **"Edit"** button next to it.
    *   A popup will show the folders in your repository. Select the **`backend`** folder.
    *   The setting should now show `backend` as the root directory. This tells Vercel that all the code it needs to run is inside this folder.

2.  **Framework Preset:**
    *   Vercel should automatically detect this as a **"Node.js"** project. You shouldn't need to change anything here.

3.  **Environment Variables:**
    *   This is where we will securely add all our secret keys.
    *   Find the section named **"Environment Variables"** and expand it.
    *   You will now copy the keys and values from your local `backend/.env` file one by one.
    *   For each variable, do the following:
        *   In the **"Name"** field, enter the variable name (e.g., `DATABASE_URL`).
        *   In the **"Value"** field, paste the corresponding value from your `.env` file (e.g., `postgresql://...`).
        *   Click the **"Add"** button.
    *   Repeat this process for all five required variables:
        *   `DATABASE_URL`
        *   `RESEND_API_KEY`
        *   `RECIPIENT_EMAIL`
        *   `RECAPTCHA_SITE_KEY`
        *   `RECAPTCHA_SECRET_KEY`

### **Step 4: Deploy**

1.  After configuring the Root Directory and adding all five environment variables, double-check that everything is correct.
2.  Click the **"Deploy"** button.
3.  Vercel will now start the deployment process. You will see a log of the build steps. This usually takes about a minute.
4.  When it's finished, you will see a "Congratulations!" message and some confetti.

---

## 4. Final Step: Get the URL

After the deployment is successful, Vercel will assign your project a public URL.

*   You will see this URL on the deployment summary page. It will look something like `your-project-name.vercel.app`.

**Please copy this URL and provide it to me.**

Once I have this live URL, I will perform the final step of updating the `contact.js` and `iso-smart-form.js` files to point to this address, which will make all your website forms fully functional.
