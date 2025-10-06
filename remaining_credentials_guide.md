# Guide to Obtaining All Remaining Credentials

**Version:** 1.0
**Date:** October 6, 2025

## 1. Overview & Checklist

This document provides a complete list of all credentials still required to continue the backend implementation. Below the checklist, you will find a detailed, step-by-step guide for obtaining each item.

### **Master Checklist of Missing Credentials:**

- [ ] **SSH Access:**
  - [ ] SSH Username
  - [ ] SSH Port
  - [ ] SSH Key Password

- [ ] **PostgreSQL Database:**
  - [ ] Database Password

- [ ] **SMTP Credentials (for sending emails):**
  - [ ] SMTP Host
  - [ ] SMTP Port
  - [ ] SMTP User
  - [ ] SMTP Password

- [ ] **Google reCAPTCHA v3 Keys:**
  - [ ] Site Key
  - [ ] Secret Key

---

## 2. Detailed Guides

### **Guide A: How to Find Your SSH Credentials**

You have already generated the SSH key. Here is how to find the remaining details.

1.  **Log in to cPanel.**
2.  Navigate to **Security > SSH Access**.
3.  On this page, you will find the **SSH Username** and **SSH Port**. The username is typically your cPanel username.
4.  The **SSH Key Password** is the password you created when you generated the key. You must remember this password; it cannot be retrieved. If you have forgotten it, you must generate a new SSH key pair by following the previous guide and provide me with the new private key and its new password.

### **Guide B: How to Get Your Database Password**

You have already created the database user `soluaveo_saencrystal`. If you have forgotten the password you saved, the most secure option is to reset it.

1.  **Log in to cPanel.**
2.  Navigate to **Databases > PostgreSQL Databases**.
3.  Scroll down to the **"Current Users"** section.
4.  Find the user `soluaveo_saencrystal` in the list.
5.  In the same row, click on **"Change Password"**.
6.  Use the **"Password Generator"** to create a new, strong password.
7.  **CRITICAL:** Copy this new password and save it somewhere secure.
8.  Click the **"Change Password"** button to finalize.
9.  Provide me with this new password.

### **Guide C: How to Find Your SMTP Credentials**

These credentials allow the backend to send email notifications (e.g., when a form is submitted). We will use the settings for your `enquiries@solutionenergylimited.com` email address.

1.  **Log in to cPanel.**
2.  Navigate to **Email > Email Accounts**.
3.  Find `enquiries@solutionenergylimited.com` in the list of email accounts.
4.  In the same row, click the **"Connect Devices"** button.
5.  On the next page, look for the blue box titled **"Mail Client Manual Settings"**.
6.  You will find all the necessary information there. Look for the **Secure SSL/TLS Settings** (this is the recommended option).
7.  From this section, please copy and provide:
    *   **SMTP Host:** (Listed as "Outgoing Server")
    *   **SMTP Port:** (Listed as "Outgoing Port")
    *   **SMTP User:** (This is the full email address: `enquiries@solutionenergylimited.com`)
    *   **SMTP Password:** (This is the password for the `enquiries@solutionenergylimited.com` email account).

### **Guide D: How to Get Google reCAPTCHA v3 Keys**

These keys are essential for protecting your forms from spam bots.

1.  Go to the [Google reCAPTCHA website](https://www.google.com/recaptcha/about/).
2.  Click on **"v3 Admin Console"** in the top right corner. You will need to be logged into a Google account.
3.  Click the **`+` (Create)** icon to register a new site.
4.  Fill out the form:
    *   **Label:** Give it a clear name, like `Solution Energy Website`.
    *   **reCAPTCHA type:** Select **"reCAPTCHA v3"**.
    *   **Domains:** Add your domain: `solutionenergylimited.com` (do not include `http://` or `www`).
    *   **Owners:** Your Google account email will be listed.
5.  Accept the reCAPTCHA Terms of Service.
6.  Click **"Submit"**.
7.  The next page will display your keys. Please copy and provide both the **"Site Key"** and the **"Secret Key"**.

---

**IMPORTANT SECURITY NOTICE:** Please provide all passwords and secret keys through a secure channel and not directly in this chat. Once I have all the items from the checklist, I can resume the backend implementation immediately.
