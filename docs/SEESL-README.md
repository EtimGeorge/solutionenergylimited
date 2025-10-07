# SEESL Website

This repository contains the website for Solution Energy and Engineering Services Limited (SEESL), a company providing a variety of world-class engineering and technical services.

## Overview

The SEESL website is designed to showcase the company's services, expertise, and projects. It features a modern, responsive design with a clean user interface that adapts to all device sizes. The site includes information about the company's services, mission, vision, team, projects, and contact information. It also features a dedicated sub-section for ISO Certification services.

## Website Structure

The website follows this structure:

```
SEESL-Website/
│
├── index.html                      # Home page
├── about.html                      # About page
├── contact.html                    # Contact page
├── process.html                    # Our Process page
├── privacy-policy.html             # Privacy policy (Main site - Consolidated)
├── terms-of-service.html           # Terms of service (Main site - Consolidated)
├── ad-test.html                    # Ad parameter testing utility (Moved to root, enhanced scope)
│
├── css/                            # CSS directory
│   ├── variables.css               # CSS variables for theme
│   ├── styles.css                  # Main global stylesheet
│   ├── contact.css                 # Styles specific to contact.html (Externalized)
│   ├── legal-styles.css            # Common styles for privacy-policy.html & terms-of-service.html (New)
│   └── services/                   # CSS for specific service pages
│       └── asset-management.css    # Styles for services/asset-management.html (Externalized)
│       └── ...                     # Other service-specific CSS files as needed (created on demand)
│
├── js/                             # JavaScript directory
│   └── main.js                     # Main global JavaScript file
│
├── images/                         # Images directory (logos, backgrounds, service images, etc.)
│   ├── SEES_new_logo.jpg
│   └── ...                         # Various other images
│
└── services/                       # Main services directory
    ├── engineering.html
    ├── asset-management.html
    ├── gas-conversion.html
    ├── procurement.html
    ├── renewable-energy.html
    ├── civil-construction.html
    ├── tank-cleaning.html
    │
    └── iso-certification/          # ISO certification sub-site
        ├── index.html              # ISO main page
        ├── certification.html      # ISO certification details
        ├── training.html           # ISO training details
        ├── audit.html              # ISO audit details
        ├── process.html            # ISO process page
        ├── contact.html            # ISO contact page
        ├── styles.css              # Styles specific to the ISO sub-site
        ├── scripts.js              # Scripts specific to the ISO sub-site
        └── assets/                 # (This folder might be empty or removed if all assets are globalized)
            └── ...                 # ISO specific assets if any (logos are now global)

```

**Key Files Deleted/Moved:**
*   `index.tsx` (Deleted)
*   `metadata.json` (Deleted)
*   `services/iso-certification/privacy-policy.html` (Deleted - Consolidated to root)
*   `services/iso-certification/terms-of-service.html` (Deleted - Consolidated to root)
*   `services/iso-certification/privacy-policy.css` (Deleted)
*   `services/iso-certification/terms-of-service.css` (Deleted)
*   `services/iso-certification/ad-test.html` (Moved to root as `ad-test.html`)
*   `services/iso-certification/README.md` (Deleted - Info merged here)

## Navigation Structure

The website uses relative paths for robust navigation:

1.  **Main Navigation (Root Pages like `index.html`, `about.html`)**
    *   Links to other root pages: e.g., `contact.html`
    *   Links to services: e.g., `./services/engineering.html`
    *   Link to ISO sub-site: `./services/iso-certification/` (goes to its `index.html`)

2.  **Service Pages (`services/*.html`)**
    *   Links to root pages: e.g., `../index.html`, `../contact.html`
    *   Links to other services: e.g., `engineering.html` (sibling), `../services/asset-management.html`
    *   Link to ISO sub-site: `iso-certification/` (sibling directory) or `../services/iso-certification/`

3.  **ISO Certification Sub-site Navigation (`services/iso-certification/*.html`)**
    *   Link to Main Site Home: `../../index.html`
    *   Links to ISO sub-site pages: e.g., `certification.html` (local to ISO section)
    *   Links to Main Site Services: e.g., `../../services/engineering.html`
    *   Legal Links (to root): `../../privacy-policy.html`, `../../terms-of-service.html`

4.  **Footer Links (All Pages)**
    *   Paths adjusted based on the page's location to correctly point to root pages or service pages.
    *   Legal links always point to the root `privacy-policy.html` and `terms-of-service.html`.

## Asset Linking (CSS, JS, Images)

*   **Root Pages (`index.html`, `about.html`, etc.):**
    *   CSS: `./css/styles.css`, `./css/variables.css`, etc.
    *   JS: `./js/main.js`
    *   Images: `./images/some-image.jpg`
    *   Favicon: `./images/SEES_new_logo.jpg`
*   **Service Pages (`services/*.html`):**
    *   CSS: `../css/styles.css`, `../css/variables.css`, `../css/services/specific-service.css`
    *   JS: `../js/main.js`
    *   Images: `../images/some-image.jpg`
    *   Favicon: `../images/SEES_new_logo.jpg`
*   **ISO Sub-site Pages (`services/iso-certification/*.html`):**
    *   Global CSS: `../../css/styles.css`, `../../css/variables.css`
    *   Local ISO CSS: `./styles.css`
    *   Global JS: `../../js/main.js`
    *   Local ISO JS: `./scripts.js`
    *   Images (global): `../../images/some-image.jpg`
    *   Favicon: `../../images/SEES_new_logo.jpg` (standardized)
    *   Logo: `../../images/SEES_new_logo.jpg` (standardized)

## Key Features

*   **Responsive Design**: Adapts to all screen sizes.
*   **Dark/Light Mode**: User-toggleable theme preference stored in localStorage.
*   **Mobile Navigation**: Hamburger menu for smaller screens with nested service dropdown.
*   **Service Showcase**: Dedicated pages for each main service and ISO service.
*   **Contact Forms**: Interactive forms (currently using Formspree via mailto for ISO, potentially needs update for AJAX like main site).
*   **Modern UI**: Clean, professional interface with consistent branding.
*   **Optimized Assets**: For faster loading times.
*   **Consolidated Legal Pages**: Single `privacy-policy.html` and `terms-of-service.html` at the root, linked from all pages, styled by `css/legal-styles.css`.
*   **Modular CSS**: Global styles, page-specific styles (e.g., `css/contact.css`, `css/services/asset-management.css`), and component-specific styles.
*   **Ad Parameter Testing**: `ad-test.html` (now at root) utility for testing marketing campaign URL parameters across the entire site.

## CSS Architecture

*   **`css/variables.css`**: Contains CSS custom properties for global theming.
*   **`css/styles.css`**: Main global stylesheet.
*   **`css/legal-styles.css`**: Shared styles for root legal pages.
*   **Page-Specific CSS**:
    *   `css/contact.css`
    *   `css/services/asset-management.css`
    *   (Other service pages retain inline styles for now, externalized on request).
*   **ISO Sub-site CSS**:
    *   `services/iso-certification/styles.css`: Specific to the ISO sub-site. These pages also link to global CSS.

## JavaScript Organization

*   **`js/main.js`**: Handles global website functionality (theme, mobile nav, main contact form, modals, carousels, lightbox, back-to-top).
*   **`services/iso-certification/scripts.js`**: JavaScript specific to the ISO sub-site. These pages also link to global JS.

## Ad Parameter Testing (`ad-test.html`)

The `ad-test.html` file at the root is a utility for testing URL parameters from marketing campaigns (e.g., `utm_source`, `service_interest`). It includes:
*   Example links to various pages across the main site and ISO sub-site.
*   A reference table of common URL parameters.
*   This helps verify JavaScript logic for capturing parameters for analytics or pre-filling forms.

## Development Setup

1.  Clone the repository.
2.  Open `index.html` in your web browser.
3.  For live reload, use VS Code's "Live Server" or a simple HTTP server (e.g., Python 3: `python -m http.server`).

## Maintenance

1.  Keep content (services, projects, team, contact) current.
2.  Optimize new images.
3.  Periodically check links.
4.  Review and update legal pages as needed.
5.  Test on various browsers/devices after significant changes.

## License

All rights reserved. This website and its content are the property of Solution Energy and Engineering Services Limited.

## Contact

For questions or support regarding this website, contact:
*   Email: info@solutionenergylimited.com
*   Phone: +234 (915) 312-3973
```