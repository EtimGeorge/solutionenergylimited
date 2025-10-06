# Product Requirements Document: SEESL Website Form Backend

**Author:** Gemini Agent
**Version:** 1.1
**Date:** June 30, 2025
**Status:** Finalized

## 1. Product Vision & Business Objectives

### 1.1. Vision
To transform the SEESL website from a passive digital brochure into a reliable and efficient engine for business development, ensuring that every potential client inquiry is captured, managed, and acted upon seamlessly.

### 1.2. Business Objectives
*   **Increase Lead Capture Reliability:** Eliminate the risk of lost leads by creating a centralized, persistent storage system.
*   **Improve Operational Efficiency:** Reduce the administrative overhead for handling new client inquiries by establishing a single source of truth for all contact data.
*   **Establish Full Data Ownership:** Gain complete control over website-generated lead data by removing the dependency on third-party services.
*   **Create a Foundation for Future Growth:** Build a scalable backend that can support future enhancements like CRM integration or lead analytics.

## 2. Target User Personas

### Persona 1: David Chen, Project Manager (Corporate Client)
*   **Goals:** Find a reliable, full-service engineering firm for a major project. Needs to see a proven track record and clear, detailed information quickly.
*   **Pain Points:** Dealing with multiple vendors; firms that over-promise; wasting time on phone calls for basic info.

### Persona 2: Fatima Adebayo, Operations Manager (SME Client)
*   **Goals:** Find cost-effective solutions to reduce operational costs (e.g., diesel generators). Needs a trustworthy partner who understands the local environment and provides reliable support.
*   **Pain Points:** Unreliable power grids; overly technical jargon; worries about long-term maintenance of new technologies.

### Persona 3: Samuel Okoro, Independent Consultant/Auditor
*   **Goals:** Find a credible engineering firm to recommend to his own clients. Needs to quickly verify technical competence, credentials (especially ISO), and professionalism.
*   **Pain Points:** His reputation depends on the quality of his recommendations; gets frustrated by vague marketing language.

## 3. Core Features & Functional Requirements (Version 1.0)

### 3.1. Backend Form Processing
*   **User Story:** "As a site administrator, I want form submissions to be saved to a central, persistent location so that I can easily track and manage all customer inquiries."
*   **Acceptance Criteria:**
    *   A `POST /submit` API endpoint is created on a Node.js/Express server.
    *   The backend successfully parses incoming JSON data from the form.
    *   The submission data, including a server-generated timestamp and a unique ID, is appended to a `submissions.json` file.
    *   The server returns a `200 OK` status on success and a `500` status on failure.

### 3.2. Frontend Integration
*   **User Story:** "As a potential client, when I fill out the contact form, I want my inquiry to be sent to the new, reliable backend system."
*   **Acceptance Criteria:**
    *   The `contact.html` form's `action` attribute is updated to point to the new `http://localhost:3000/submit` endpoint.
    *   The form submission is handled by JavaScript to send the data via an AJAX `fetch` call.

### 3.3. User Feedback
*   **User Story:** "As a user, I want clear feedback on whether my message was sent successfully or if there was an error, so I know if I need to try again."
*   **Acceptance Criteria:**
    *   The "Submit" button is disabled and shows a "Submitting..." state after being clicked.
    *   On a successful submission, the "Message Sent!" modal is displayed, and the form fields are cleared.
    *   On a server error, a user-friendly error message (e.g., "Sorry, something went wrong.") is displayed near the submit button.

## 4. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Performance** | API response time for form submission should be under 500ms. |
| **Security** | The backend will only be accessible locally. CORS will be configured to only allow requests from the website's domain. |
| **Scalability** | The JSON file storage is suitable for low-to-moderate traffic (up to ~100 submissions/day). |
| **Usability** | The form submission process should remain unchanged from the user's perspective. |
| **Maintainability** | The backend code will be self-contained in the `/backend` directory with a `README.md` explaining its setup and operation. |
| **Reliability** | The server process must be manually kept running to ensure form submissions are captured. |
| **Portability** | The backend can be run on any system with Node.js installed. |

## 5. Assumptions, Constraints & Dependencies

### 5.1. Assumptions
*   A stable Node.js environment is available on the local machine.
*   The server process will be kept running manually for the form to be functional.
*   Submission volume will be low enough for a JSON file to be a sufficient storage solution.

### 5.2. Constraints
*   **Scope:** The project is strictly limited to replacing the Formspree functionality. It will not include a database, automated emails, or an admin dashboard in this version.
*   **Technology:** The implementation is constrained to Node.js and Express.js.
*   **Hosting:** The server is hosted and run on the user's local machine (`localhost`).

### 5.3. Dependencies
*   **Software:** Node.js, npm.
*   **NPM Libraries:** `express`, `cors`, `body-parser`.
*   **Infrastructure:** The user's local computer.

## 6. Success Metrics & KPIs

| Metric ID | KPI (Key Performance Indicator) | Target / Goal |
| :--- | :--- | :--- |
| KPI-01 | **Submission Capture Rate** | 100% of valid form submissions are successfully received and stored in `submissions.json`. |
| KPI-02 | **Data Integrity** | 0% of submissions are lost or corrupted during the submission process. |
| KPI-03 | **Formspree Dependency** | The Formspree URL is completely removed from the codebase. |
| KPI-04 | **System Uptime** | The backend server process maintains availability whenever the user is actively expecting submissions. |

---