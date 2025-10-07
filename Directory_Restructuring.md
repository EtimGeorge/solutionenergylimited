# Project Restructuring Plan: Frontend (Namecheap) & Backend (Render)

**Goal:** To reorganize the `solutionenergylimited` project into clear `frontend/` and `backend/` directories, adjust all necessary file paths, and establish a deployment strategy using Namecheap for the static frontend and Render for the Node.js backend.

**Rationale:**
*   **Clarity & Maintainability:** Separating frontend and backend code into distinct directories improves code organization, making it easier to navigate, understand, and maintain.
*   **Independent Deployment:** Allows for independent deployment of the frontend and backend, optimizing build times and resource allocation for each service.
*   **Platform Optimization:** Leverages Namecheap's strengths for static site hosting and Render's capabilities for Node.js service deployment, avoiding Vercel's "No entrypoint found" confusion for monorepos.
*   **Scalability:** Provides a cleaner foundation for future scaling and development of both parts of the application.

---

## **Phase 1: Directory Restructuring**

### **Checklist for Phase 1:**

- [x] 1.1. Create `frontend/` and `backend/` directories.
- [x] 1.2. Move all static frontend files and folders into `frontend/` (file-by-file, with path adjustments).
- [x] 1.3. Move the existing `backend/` directory contents into the new `backend/` directory (file-by-file, with path adjustments).
- [x] 1.3.1. Move all `.md` files into a new `docs/` folder.
- [x] 1.4. Review and update frontend file paths (HTML, CSS, JS) meticulously.
- [x] 1.5. Review and update backend file paths (if any internal references change) meticulously.
- [x] 1.6. Update `.gitignore` to reflect the new structure.
- [x] 1.7. Review and relocate root-level `package.json` and `package-lock.json`.

### **Detailed Steps for Phase 1:**

#### **1.1. Create `frontend/` and `backend/` directories**
   - **Status:** Completed by user. `frontend/` and `backend/` directories now exist at the project root.

#### **1.2. Move all static frontend files and folders into `frontend/`**
   - **Status:** Completed by user. All identified static frontend files and folders are now located within the `frontend/` directory.

#### **1.3. Move the existing `backend/` directory contents into the new `backend/` directory**
   - **Status:** Completed by user. All identified backend files and folders are now located within the `backend/` directory.

#### **1.3.1. Move all `.md` files into a new `docs/` folder**
   - **Status:** Completed by user. All `.md` files are now located within the `docs/` directory.

#### **Critical Review of Root Directory & File-by-File Mapping:**

This section details the new locations of files and folders after the restructuring. The *moving* part of these steps has been completed by the user. The next focus is on **path adjustments**.

**Original Root Directory Structure (Simplified for mapping):**
```
C:\Users\user\Desktop\solutionenergylimited\
├───.gitignore
├───about.html
├───ad-test.html
├───blog.html
├───campaign-landing.html
├───contact.html
├───database_setup.sql
├───errors.md
├───index.html
├───modern_backend_setup_guide.md
├───neon-db-resend-strings.md
├───package-lock.json
├───package.json
├───PRD_Form_Backend.md
├───privacy-policy.html
├───process.html
├───Product Requirements Document for Solution Energy Limited Website Enhancements.txt
├───Production-Ready Implementation Guide for cPanel Hosting.txt
├───remaining_credentials_guide.md
├───reusable_landing_page_prompt.md
├───SEESL-README.md
├───terms-of-service.html
├───vercel_deployment_guide.md
├───ads_content\
├───backend\
├───backend-implementation\
├───css\
├───images\
├───js\
├───landing-page-template\
├───services\
└───SSH_KEY\
```

**Mapped Restructuring (File-by-File / Folder-by-Folder):**

**A. Files/Folders now located in `frontend/` (Moved by user):**

1.  **`index.html`**
    *   **New Location:** `frontend/index.html`
    *   **Path Adjustments:** This is the main entry point. All relative paths within `index.html` to `css/`, `js/`, `images/`, `ads_content/`, `services/`, `landing-page-template/`, and other `.html` files will remain the same *relative to its new location*. For example, `<link rel="stylesheet" href="css/styles.css">` will still be `href="css/styles.css"` if `css/` is now `frontend/css/`. However, if an HTML file was in a subdirectory (e.g., `frontend/services/iso-certification/index.html`) and referenced `../../css/styles.css`, this relative path might need adjustment depending on the new structure. We will need to be very careful with relative paths.
2.  **`about.html`**
    *   **New Location:** `frontend/about.html`
    *   **Path Adjustments:** Similar to `index.html`, internal links and asset paths will need review.
3.  **`ad-test.html`**
    *   **New Location:** `frontend/ad-test.html`
    *   **Path Adjustments:** Review internal links and asset paths.
4.  **`blog.html`**
    *   **New Location:** `frontend/blog.html`
    *   **Path Adjustments:** Review internal links and asset paths.
5.  **`campaign-landing.html`**
    *   **New Location:** `frontend/campaign-landing.html`
    *   **Path Adjustments:** Review internal links and asset paths.
6.  **`contact.html`**
    *   **New Location:** `frontend/contact.html`
    *   **Path Adjustments:** Review internal links, asset paths, and crucially, any JavaScript that interacts with the backend (e.g., form submissions). The `API_BASE_URL` in `js/config.js` will be critical here.
7.  **`privacy-policy.html`**
    *   **New Location:** `frontend/privacy-policy.html`
    *   **Path Adjustments:** Review internal links and asset paths.
8.  **`process.html`**
    *   **New Location:** `frontend/process.html`
    *   **Path Adjustments:** Review internal links and asset paths.
9.  **`terms-of-service.html`**
    *   **New Location:** `frontend/terms-of-service.html`
    *   **Path Adjustments:** Review internal links and asset paths.
10. **`css/` directory**
    *   **New Location:** `frontend/css/`
    *   **Path Adjustments:** All `.css` files within this directory will need their `url()` references (for fonts, background images, etc.) reviewed. If an image was previously `../images/my-image.png` (relative to `css/`), and `images/` is now `frontend/images/`, the path might remain the same *relative to the CSS file's new location*. However, if the CSS file itself moves relative to the images, these paths will need careful adjustment.
11. **`js/` directory**
    *   **New Location:** `frontend/js/`
    *   **Path Adjustments:** All `.js` files within this directory will need review.
        *   `js/config.js`: The `API_BASE_URL` will need to be updated to the Render backend URL.
        *   `js/contact.js`, `js/iso-forms-handler.js`: These likely contain AJAX calls to the backend. Ensure they use the `API_BASE_URL` from `js/config.js` correctly.
        *   Any other JS files that load local resources (e.g., JSON files, images) will need their paths adjusted.
12. **`images/` directory**
    *   **New Location:** `frontend/images/`
    *   **Path Adjustments:** No internal path adjustments needed within this directory, but all HTML and CSS files referencing these images will need correct relative paths.
13. **`ads_content/` directory**
    *   **New Location:** `frontend/ads_content/`
    *   **Path Adjustments:** No internal path adjustments needed.
14. **`services/` directory**
    *   **New Location:** `frontend/services/`
    *   **Path Adjustments:** This directory contains HTML files and potentially CSS/JS. Each file within `services/` will need its internal links and asset paths reviewed, similar to the root HTML files. For example, `services/iso-certification/index.html` will need its paths adjusted relative to its new location `frontend/services/iso-certification/index.html`.
15. **`landing-page-template/` directory**
    *   **New Location:** `frontend/landing-page-template/`
    *   **Path Adjustments:** Review internal links and asset paths within its HTML files.
16. **Root `package.json` and `package-lock.json`**
    *   **New Location:** `frontend/package.json` and `frontend/package-lock.json`
    *   **Path Adjustments:** If these contain scripts that reference files outside `frontend/`, those scripts will need updating. We will first inspect the content of the root `package.json` to confirm it's frontend-specific before moving.

**B. Files/Folders now located in `backend/` (Moved by user):**

1.  **Existing `backend/` directory contents:**
    *   **New Location:** All files and folders previously inside `C:\Users\user\Desktop\solutionenergylimited\backend\` are now in `C:\Users\user\Desktop\solutionenergylimited\backend\` (the new `backend` folder).
    *   This includes: `.env`, `.env.example`, `.gitignore`, `package-lock.json`, `package.json`, `README.md`, `server.js`, `node_modules/`.
    *   **Path Adjustments:** Review `backend/server.js` and any other backend files for internal `require()` or `import` statements that use relative paths. If the `backend` folder itself is now the root of the backend application, these paths should generally remain correct *relative to the backend folder*.

**C. Files/Folders now located in `docs/` (Moved by user):**

1.  **All `.md` files:**
    *   **New Location:** `docs/`
    *   This includes: `errors.md`, `modern_backend_setup_guide.md`, `neon-db-resend-strings.md`, `PRD_Form_Backend.md`, `remaining_credentials_guide.md`, `reusable_landing_page_prompt.md`, `SEESL-README.md`, `vercel_deployment_guide.md`.
    *   **Path Adjustments:** None, as these are standalone documentation files.

**D. Files/Folders to remain at the project root:**

1.  **`.gitignore` (root)**
    *   **New Location:** Remains at root.
    *   **Path Adjustments:** Will need to be updated to include `frontend/node_modules/` (if applicable), ensure `backend/node_modules/` is ignored, and potentially ignore `frontend/.env` if frontend uses one.
2.  **`database_setup.sql`**
    *   **New Location:** Remains at root.
    *   **Path Adjustments:** None. This is a standalone SQL script.
3.  **`Product Requirements Document for Solution Energy Limited Website Enhancements.txt`**
    *   **New Location:** Remains at root.
    *   **Path Adjustments:** None.
4.  **`Production-Ready Implementation Guide for cPanel Hosting.txt`**
    *   **New Location:** Remains at root.
    *   **Path Adjustments:** None.
5.  **`backend-implementation/` directory**
    *   **New Location:** Remains at root.
    *   **Path Adjustments:** None. This seems to be documentation/planning related to backend implementation.
6.  **`SSH_KEY/` directory**
    *   **New Location:** Remains at root.
    *   **Path Adjustments:** None. This contains sensitive keys and should not be part of the deployable frontend or backend.

---

## **Phase 2: Deployment Strategy (Render for Backend, Namecheap for Frontend)**

### **Checklist for Phase 2:**

- [ ] 2.1. Configure Render for backend deployment.
- [ ] 2.2. Configure Namecheap for static frontend hosting.
- [ ] 2.3. Update frontend `API_BASE_URL` to Render backend URL.
- [ ] 2.4. Configure environment variables on Render.
- [ ] 2.5. Test frontend-backend communication.

### **Detailed Steps for Phase 2:**

#### **2.1. Configure Render for backend deployment**
   - **Create a new Web Service on Render:**
     - Connect your GitHub repository to Render.
     - Select the `backend/` directory as the **Root Directory** for the Render service.
     - Choose `Node` as the runtime.
     - Set the **Build Command** (e.g., `npm install`).
     - Set the **Start Command** (e.g., `node server.js` or `npm start` if defined in `backend/package.json`).
     - Configure any necessary ports (e.g., `PORT=3000` if your Express app listens on 3000).

#### **2.2. Configure Namecheap for static frontend hosting**
   - This typically involves uploading the contents of your `frontend/` directory to your Namecheap hosting account via FTP or their file manager.
   - Ensure your domain's DNS records are correctly pointing to your Namecheap hosting.

#### **2.3. Update frontend `API_BASE_URL` to Render backend URL**
   - Once your backend is deployed on Render and you have its public URL (e.g., `https://your-backend-name.onrender.com`), update the `API_BASE_URL` in `frontend/js/config.js` to this new Render URL.

#### **2.4. Configure environment variables on Render**
   - In your Render service settings, go to the "Environment" section.
   - Add all necessary environment variables that your backend uses (e.g., `DATABASE_URL`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `RECAPTCHA_SECRET_KEY`, etc.). These should correspond to the variables in your `backend/.env` file.

#### **2.5. Test frontend-backend communication**
   - After both frontend and backend are deployed, thoroughly test all forms and features on your Namecheap-hosted frontend to ensure they correctly communicate with the Render-hosted backend.

---

## **Phase 3: Post-Restructuring Cleanup & Verification**

### **Checklist for Phase 3:**

- [ ] 3.1. Verify all links and assets on the frontend.
- [ ] 3.2. Run frontend linting/build (if applicable).
- [ ] 3.3. Run backend tests (if applicable).
- [ ] 3.4. Update documentation (e.g., `README.md`).
