# SEESL Website - Frontend

This directory contains the static frontend for the SEESL website.

## Overview

The frontend is built with static HTML, CSS, and vanilla JavaScript. It does not currently use a package manager or a build system.

## How to Run

1.  **Using a Live Server:** The easiest way to run the frontend locally is to use a live server extension in your code editor (like "Live Server" for VS Code). Right-click on `frontend/index.html` and open it with the live server.
2.  **Directly in Browser:** You can also open the `index.html` file directly in your web browser, but be aware that some functionalities, especially those involving API calls to the backend, may be restricted by browser CORS policies when running from a `file:///` URL. Using a live server is recommended.

## Structure

- **HTML Files**: Root HTML files (e.g., `index.html`, `about.html`) are in the main `frontend/` directory. Service-specific pages are located in subdirectories like `frontend/services/`.
- **CSS**: Global styles are in `frontend/css/styles.css`. Variables for theming are in `frontend/css/variables.css`.
- **JavaScript**: Global scripts are in `frontend/js/main.js`. Form handling logic is in `frontend/js/forms.js`, and site-wide configuration (like the backend URL) is in `frontend/js/config.js`.
- **Images**: All static image assets are located in `frontend/images/`.
