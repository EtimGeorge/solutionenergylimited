
# Frontend Form Enhancement Plan (v2.0)

**Version:** 2.0
**Date:** October 5, 2025
**Status:** <span style="color:green; font-weight:bold;">COMPLETED</span>

## 1. Introduction & Objective

This document details the plan to refactor and enhance the website's HTML forms. The goal is to improve data capture, user experience, and accessibility **before** backend development begins. A well-structured frontend ensures that we capture the right data efficiently and reduces future rework.

This plan has been fully executed.

---

## 2. Main Contact Form (`contact.html`)

**Objective:** To improve accessibility for all users and introduce a field for marketing intelligence.

### Actionable Checklist:

- [x] **Task 1.1: Link Labels to Inputs.**
    -   **Action:** Edited the `contact.html` file. For every `<label>`, added a `for` attribute that matches the `id` of its corresponding `<input>`, `<select>`, or `<textarea>` field.

- [x] **Task 1.2: Add "How did you hear about us?" Field.**
    -   **Action:** Inserted a new, optional `<select>` dropdown field into the form.

---

## 3. ISO Sub-Site Forms (Unified Strategy)

**Objective:** To replace all disparate forms across the `services/iso-certification/` sub-site with a single, reusable "Smart Form" component that is customized via JavaScript on each page.

### Actionable Checklist:

- [x] **Task 2.1: Create the Master Form Component.**
    -   **Action:** Created the `services/iso-certification/_form-component.html` file containing the master HTML structure.

- [x] **Task 2.2: Create a New, Unified Form Handler Script.**
    -   **Action:** Created the new `services/iso-certification/js/iso-smart-form.js` file. This script loads the component, customizes it, and handles submission.

- [x] **Task 2.3: Refactor All ISO Pages.**
    -   **Action:** For all relevant pages (`index.html`, `certification.html`, `training.html`, `audit.html`, `contact.html`), the existing forms were deleted and replaced with a placeholder `<div>` that loads the Smart Form.

- [x] **Task 2.4: Link JavaScript to Pages.**
    -   **Action:** For all relevant pages, the old script tags were removed and a new `<script>` tag linking to `iso-smart-form.js` was added.

---

## 4. Verification Checklist

- [x] **Verification 3.1:** The `contact.html` page correctly displays the new field, and labels are linked.
- [x] **Verification 3.2:** The `services/iso-certification/` pages now correctly display the new, unified forms.
- [x] **Verification 3.3:** The form on each ISO page correctly pre-selects the relevant "Service of Interest" and shows/hides the appropriate fields.
- [x] **Verification 3.4:** All new form elements are styled correctly and are visually consistent with the site design.
