# SEESL Backend & Forms Implementation Plan

**Version:** 1.1
**Date:** October 5, 2025
**Status:** <span style="color:orange; font-weight:bold;">PAUSED - PENDING CREDENTIALS</span>

---

## 1. Project Status (As of End of Session, Oct 5, 2025)

*   **COMPLETED:** All frontend development is complete. This includes the refactoring of the main contact form and the implementation of the unified "Smart Form" system for the ISO sub-site.
*   **COMPLETED:** All backend application code (`server.js`) has been written. This includes logic for database connection, validation, reCAPTCHA, form processing, and email notifications.
*   **CURRENT BLOCKER:** We cannot proceed with deploying and activating the backend. The project is paused pending receipt of the necessary server credentials.
*   **NEXT STEP:** Once credentials are provided, we will immediately begin **Phase 1: Backend Setup & Database**.

---

## 2. Pre-implementation Requirements Checklist (PENDING)

To proceed, I will require the following credentials. Please provide these through a secure channel.

*   [ ] **SSH Access:**
    *   [ ] Hostname
    *   [ ] Username
    *   [ ] Password or SSH Key
*   [ ] **PostgreSQL Database Credentials** (To be created in cPanel):
    *   [ ] Database Name
    *   [ ] Database User
    *   [ ] Database Password
*   [ ] **SMTP Credentials** (For sending email notifications):
    *   [ ] SMTP Host
    *   [ ] SMTP Port
    *   [ ] SMTP User
    *   [ ] SMTP Password
*   [ ] **Designated Recipient Email:** The SEESL email address that should receive all form submission notifications.
*   [ ] **Google reCAPTCHA v3 Keys:**
    *   [ ] Site Key
    *   [ ] Secret Key

---

## 3. Implementation Plan: Actionable Checklist

### **Phase 1: Backend Setup & Database (NEXT STEP - BLOCKED)**
- [ ] **Step 1.1:** Set up the Node.js application environment in cPanel.
- [ ] **Step 1.2:** Create the PostgreSQL database and a dedicated user with appropriate permissions.
- [ ] **Step 1.3:** Finalize and execute the database schema. The following tables will be created:

  **`form_submissions` Table:**
  ```sql
  CREATE TABLE form_submissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      service_interest VARCHAR(100),
      standards TEXT[],
      region VARCHAR(100),
      how_did_you_hear VARCHAR(100),
      employees VARCHAR(50),
      form_origin VARCHAR(100) NOT NULL,
      ip_address VARCHAR(45),
      recaptcha_score REAL,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

  **`newsletter_subscribers` Table:**
  ```sql
  CREATE TABLE newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      subscribed_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] **Step 1.4:** Securely configure all database, SMTP, and reCAPTCHA credentials as environment variables on the cPanel server.
- [ ] **Step 1.5:** Write and run a test script within the Node.js app to confirm a successful connection to the PostgreSQL database.

### **Phase 2: API Endpoint Development (COMPLETED)**
- [x] **Step 2.1:** Enhanced `backend/server.js` to use a PostgreSQL connection and handle dynamic fields.
- [x] **Step 2.2:** Implemented robust server-side validation for required fields.
- [x] **Step 2.3:** Integrated Google reCAPTCHA v3 server-side verification logic.
- [x] **Step 2.4:** Wrote the logic to insert validated form data into the `form_submissions` table.
- [x] **Step 2.5:** Implemented the Nodemailer logic to send a detailed, well-formatted email notification.
- [x] **Step 2.6:** Created the `POST /subscribe-newsletter` endpoint.
- [x] **Step 2.7:** Configured the Winston logging library for effective debugging.

### **Phase 3: Frontend Integration (PENDING DEPLOYMENT)**
- [ ] **Step 3.1:** Create a new, unified `js/form-handler.js` script. (This has been done via `iso-smart-form.js` and the updated `contact.js`)
- [ ] **Step 3.2:** Update all HTML forms to point to the final, live backend URL (once deployed).
- [ ] **Step 3.3:** Add a newsletter signup form to the footer.
- [ ] **Step 3.4:** Test all forms end-to-end against the live, deployed backend.

### **Phase 4: Code Cleanup & Final Deployment (PENDING)**
- [ ] **Step 4.1:** Remove any old or redundant JS files after final verification.
- [ ] **Step 4.2:** Consolidate any redundant CSS related to forms.
- [ ] **Step 4.3:** Deploy the final backend code to the cPanel server.
- [ ] **Step 4.4:** Final verification of the live website's form functionality.