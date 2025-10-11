# Frontend Deployment Guide: cPanel Hosting

This guide provides step-by-step instructions for deploying the static frontend of this project to a standard cPanel web hosting environment.

## Overview

This deployment process involves uploading only the contents of the `/frontend` directory. The backend API is hosted separately on Render and the frontend is already configured in `frontend/js/config.js` to communicate with it.

**Do not upload the `backend`, `node_modules`, or `docs` folders to your cPanel host.**

---

## Step-by-Step Deployment

### Step 1: Prepare Your Frontend Files

This is the most important step to get right. You must create a `.zip` file containing the *contents* of the `frontend` directory, not the directory itself.

1.  On your computer, navigate **inside** the `frontend` directory.
2.  You will see your files and folders: `index.html`, `about.html`, `css/`, `js/`, `images/`, etc.
3.  Select **all** of these items.
4.  Right-click on the selected files and choose **"Send to > Compressed (zipped) folder"** (on Windows) or **"Compress"** (on macOS).
5.  Name the resulting file `website.zip`.

> **Important**: Ensure that when you open the `.zip` file, you immediately see `index.html` and the other folders, not another folder named `frontend`.

### Step 2: Log in to cPanel

Log in to your hosting provider's cPanel dashboard for the `solutionenergylimited.com` domain.

### Step 3: Open File Manager

In the cPanel dashboard, find the "Files" section and click on the **"File Manager"** icon.

### Step 4: Navigate to the Web Root (`public_html`)

The File Manager will open in a new tab.

1.  In the directory tree on the left, find and click on the `public_html` folder. This is the root directory for your primary domain.
2.  **Action**: If you see any default placeholder files from your host (like `index.html`, `index.php`, or `default.html`), it is safe to delete them.

### Step 5: Upload the ZIP File

1.  In the File Manager's top toolbar, click the **"Upload"** icon.
2.  On the new upload page, click **"Select File"** and choose the `website.zip` file you created in Step 1.
3.  Wait for the upload progress bar to reach 100%.

### Step 6: Extract the Files

1.  Return to the File Manager tab. You should now see `website.zip` in your `public_html` directory.
2.  Click on the `website.zip` file once to select it.
3.  In the top-right of the toolbar, find and click the **"Extract"** icon.
4.  A confirmation box will appear. Ensure the extraction path is `public_html`.
5.  Click **"Extract File(s)"**.

### Step 7: Verify and Clean Up

1.  **Verify**: Open your website by navigating to **https://solutionenergylimited.com** in your browser. The site should be live.
2.  **Test**: Click through several pages and, most importantly, **submit a test message** through one of the contact forms to ensure the frontend is successfully communicating with the backend on Render.
3.  **Clean Up**: Once you confirm the site is working correctly, you can delete the `website.zip` file from `public_html` to save server space.

Your website is now deployed.
