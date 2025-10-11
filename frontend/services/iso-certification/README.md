# ISO Certification Sub-site

This directory contains the pages and assets for the ISO Certification micro-site within the main SEESL frontend.

## Overview

This section functions as a semi-independent part of the website, with its own set of pages, styles, and scripts. It is dedicated to ISO-related services like Certification, Training, and Auditing.

## Key Peculiarities

### Smart Form Component

A key feature of this sub-site is the use of a reusable "smart form" component.

- **Master Component**: The master form markup is located in `_form-component.html`.
- **Dynamic Loading**: The script at `js/iso-smart-form.js` is responsible for fetching this master component and injecting it into different pages (e.g., `audit.html`, `contact.html`).
- **Customization**: The form is customized based on `data-*` attributes set on the container div (`<div id="iso-form-container" ...>`) in each host page. This allows the same form component to be used for different purposes (e.g., "Schedule an Audit" vs. "General Inquiry") by dynamically showing/hiding fields and changing the form title.

### Structure

- **HTML Pages**: `index.html` (ISO Home), `certification.html`, `training.html`, `audit.html`, `process.html`, and `contact.html`.
- **Styling**: Specific styles for this section are in `styles.css`.
- **JavaScript**:
    - `scripts.js`: Contains general interactivity for this sub-site (e.g., carousels).
    - `js/iso-smart-form.js`: Contains the logic for the dynamic form loading and submission.
