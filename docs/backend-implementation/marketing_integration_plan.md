
# Marketing Integration Plan (Facebook Pixel & Landing Page)

**Version:** 1.0
**Date:** October 5, 2025
**Status:** <span style="color:blue; font-weight:bold;">IN PROGRESS</span>

## 1. Introduction & Objective

This document outlines the plan to integrate marketing and conversion tracking tools into the SEESL website. The primary objectives are:

1.  To create a high-conversion, reusable landing page for paid ad campaigns.
2.  To implement Facebook Pixel tracking to measure campaign performance and user behavior.

This work can be performed in parallel while awaiting backend server credentials.

---

## 2. Facebook Pixel Integration Plan

**Objective:** To install the Facebook Pixel across the entire website and implement event tracking for lead conversions.

### **Phase 1: Prerequisites (Action Required by User)**

- [ ] **Task 1.1: Provide Pixel Base Code.**
    -   **Action:** You will need to log in to your Facebook Business/Ads Manager, create a new Pixel for the `solutionenergylimited.com` domain, and provide me with the complete JavaScript snippet for the base code. This code includes your unique Pixel ID.

### **Phase 2: Implementation (To be done by Gemini)**

- [ ] **Task 2.1: Embed Base Code.**
    -   **Action:** I will edit all relevant HTML files (including all main pages, service pages, and the new landing page) to include the Facebook Pixel base code in the `<head>` section. This will enable `PageView` tracking on every page.

- [ ] **Task 2.2: Implement 'Lead' Event Tracking.**
    -   **Action:** I will modify the success-handling functions within the relevant JavaScript files (`js/contact.js` and `services/iso-certification/js/iso-smart-form.js`).
    -   **Logic:** Upon a successful form submission (after receiving a positive response from our backend), I will add the following JavaScript snippet to fire the event: `fbq('track', 'Lead');`.
    -   **Justification:** This provides a clear signal to Facebook Ads Manager that a conversion has occurred, which is essential for calculating cost-per-lead and optimizing ad delivery.

---

## 3. Campaign Landing Page Plan

**Objective:** To design and build a reusable, high-conversion landing page template (`campaign-landing.html`) that can be easily adapted for various ad campaigns.

### Actionable Checklist:

- [x] **Task 3.1: Create HTML Structure.**
    -   **Action:** Create a new file: `campaign-landing.html`.
    -   **Content Structure:** The page will be designed with a single, focused goal and will include:
        1.  A compelling, benefit-driven **Headline Section**.
        2.  A **Brief Introduction** that expands on the headline.
        3.  A **Key Benefits Section** (e.g., using icons and short text).
        4.  A **Social Proof Section** (e.g., a client testimonial or key statistics).
        5.  A prominent **Contact Form Section** that will utilize our "Smart Form" component.

- [x] **Task 3.2: Create CSS Stylesheet.**
    -   **Action:** Create a new file: `css/campaign.css`.
    -   **Styling:** This stylesheet will contain specific styles to ensure the landing page is clean, professional, and free of distracting elements (like a main navigation bar) to keep the user focused on the call-to-action.

- [x] **Task 3.3: Implement Form & Tracking.**
    -   **Action:** The landing page will include the placeholder `<div>` to load the "Smart Form" component, just like the ISO pages.
    -   **Action:** The page will also include the Facebook Pixel base code in its `<head>`.
    -   **Customization:** The form will be configured using `data-` attributes to pre-select the service relevant to a specific ad campaign (e.g., `data-service-interest="iso-certification"`).

---

## 4. Verification Checklist

- [x] **Verification 4.1:** The `campaign-landing.html` and `css/campaign.css` files are created.
- [x] **Verification 4.2:** The landing page is visually distinct, professional, and conversion-focused.
- [x] **Verification 4.3:** The landing page correctly loads and configures the "Smart Form" component.
- [ ] **Verification 4.4:** The Facebook Pixel code is present on the landing page and other site pages (pending user providing the code).
- [ ] **Verification 4.5:** The `Lead` event tracking code is correctly added to the form submission success logic in the JavaScript files.
