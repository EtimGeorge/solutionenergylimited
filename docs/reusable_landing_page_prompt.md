# Prompt for AI LLM: Build a Reusable, High-Conversion, "Wow-Factor" Ad Campaign Landing Page

## 1. The Vision: Create an Unforgettable Experience

**Primary Goal:** Build a single, reusable HTML file (`campaign-template.html`) that is not just a landing page, but an **interactive experience**. The page should be visually stunning, engaging, and create a memorable "wow" effect that drives conversions.

**Design Philosophy:** We are targeting a "Modern Tech-Forward" aesthetic. Think sleek, professional, and dynamic. The design should heavily feature:
*   **Glassmorphism:** Use blurred, semi-transparent backgrounds to create a sense of depth.
*   **Subtle 3D Effects:** Elements should feel tangible, with 3D rotations on hover and scroll-triggered animations that give them life.
*   **Fluid Motion:** All animations should be smooth and purposeful, guiding the user's eye down the page.
*   **Bold, Clear Typography:** Professional and easy to read.

## 2. Page Structure & Interactive Elements

The page will consist of the following sections, each with specific interactive and aesthetic instructions.

---

### **Section 1: The Dynamic Hero**

*   **Vision:** An immersive, multi-layered entry point that immediately captivates the user.
*   **Background:**
    *   Create a subtle, slow-moving **animated gradient background** (an "aurora" effect) using CSS. This will be the base layer.
    *   Over this, place the `<!-- CAMPAIGN-SPECIFIC BACKGROUND IMAGE -->`. This image should have a parallax effect, moving slightly slower than the scroll speed.
*   **Content:**
    *   `<h1>` (`<!-- CAMPAIGN-SPECIFIC HEADLINE -->`): This should animate on page load, with each word sliding up into place.
    *   `<p>` (`<!-- CAMPAIGN-SPECIFIC SUB-HEADLINE -->`): This should fade in after the headline animation is complete.
    *   **Call-to-Action Button:** A glassmorphic button ("Get a Quote") that glows subtly. On hover, it should have a 3D "press-down" effect. This button will smoothly scroll to the form section.

---

### **Section 2: 3D Animated Benefits Grid**

*   **Vision:** A highly interactive grid that encourages user engagement.
*   **Structure:** A 3-column grid of "feature cards."
*   **Interactivity:**
    *   The cards will use the `.float-3d` class for a base floating effect.
    *   On hover, each card will perform a **3D flip animation**, revealing the description on the "back" of the card.
*   **Content (per card):**
    *   **Front:** Font Awesome Icon and `<h3>` Title (`<!-- BENEFIT X TITLE -->`).
    *   **Back:** `<p>` Description (`<!-- BENEFIT X DESCRIPTION -->`).
*   **Required CSS for 3D Flip (Provide this to the AI):**
    ```css
    .flip-card { perspective: 1000px; }
    .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
    .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
    .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; }
    .flip-card-back { transform: rotateY(180deg); }
    ```

---

### **Section 3: "Explore Our Services" Carousel**

*   **Vision:** A sleek, auto-scrolling carousel to elegantly showcase other company services, preventing the landing page from being a dead end.
*   **Structure:** Reuse the exact same structure and CSS (`.partners-auto-scroll-container`, `.partners-track-auto-scroll`) as the "Our Partners" section on the main `index.html` page.
*   **Content:** Instead of partner logos, each item in the carousel will contain a Font Awesome icon and the name of a service (e.g., "Engineering," "Procurement"). Each item should link to the corresponding service page on the main website.

---

### **Section 4: The "Smart Form" Lead Capture**

*   **Vision:** Make the form feel like the final, important step of the journey.
*   **Structure:** Place the form inside a glassmorphic card that has a subtle `box-shadow` glow. As the user starts filling out the form (`:focus-within`), this glow should intensify, drawing focus.
*   **CRITICAL INSTRUCTIONS (Provide this HTML to the AI):**
    *   Replicate the **exact HTML structure** of the `<form id="contact-form">` from `contact.html`.
    *   Set the `data-form-origin` attribute to `<!-- CAMPAIGN-SPECIFIC ORIGIN -->`.
    *   Pre-select the relevant service in the dropdown.
    *   **Here is the required HTML for the form:**
        ```html
        <div class="contact-form-container">
          <form id="contact-form" class="contact-form" data-form-origin="<!-- CAMPAIGN-SPECIFIC ORIGIN -->">
            <input type="text" name="_gotcha" style="display:none">
            <input type="hidden" name="form_type" value="campaign_form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="company">Company Name</label>
              <input type="text" id="company" name="company">
            </div>
            <div class="form-group">
              <label for="service">Service of Interest</label>
              <select id="service" name="service" required>
                <option value="">Please Select</option>
                <option value="asset-management">Asset Management</option>
                <!-- ... all other options ... -->
              </select>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit Inquiry</button>
          </form>
        </div>
        ```

---

### **Section 5: The "Excitement" Submission Confirmation**

*   **Vision:** A rewarding and exciting confirmation that makes the user feel valued and encourages further engagement.
*   **Functionality:** On successful form submission, `contact.js` will trigger a full-screen modal.
*   **Required HTML for Modal (Provide this to the AI):**
    ```html
    <div id="success-modal" class="modal" style="display: none;">
      <div class="modal-content-campaign">
        <div class="confetti-container"></div>
        <div class="checkmark-container">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
        </div>
        <h2>Inquiry Sent!</h2>
        <p>Thank you for your interest. Our team will be in touch with you shortly.</p>
        <a href="index.html" class="btn btn-secondary">Explore Our Full Website</a>
      </div>
    </div>
    ```
*   **Required CSS for Modal & Animations (Provide this to the AI):**
    ```css
    /* Add this to a <style> tag or inline for the AI */
    .modal-content-campaign { text-align: center; }
    .checkmark-container { margin: 0 auto 20px; width: 100px; height: 100px; }
    .checkmark { width: 100px; height: 100px; border-radius: 50%; display: block; stroke-width: 2; stroke: #fff; stroke-miterlimit: 10; box-shadow: inset 0px 0px 0px #4bb71b; animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
    .checkmark-circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 2; stroke-miterlimit: 10; stroke: #4bb71b; fill: none; animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
    .checkmark-check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards; }
    @keyframes stroke { 100% { stroke-dashoffset: 0; } }
    @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
    @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 50px #4bb71b; } }
    /* Basic Confetti - can be enhanced */
    .confetti-container { /* JS will populate this */ position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
    ```
*   **Required JS for Confetti (Instruct AI to add this to a `<script>` tag):**
    ```javascript
    function showSuccessModalWithConfetti() {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'block';
        const confettiContainer = modal.querySelector('.confetti-container');
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = Math.random() * 8 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.top = Math.random() * 100 + '%';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animation = `fall ${Math.random() * 2 + 3}s linear infinite`;
            confettiContainer.appendChild(confetti);
        }
    }
    @keyframes fall { to { transform: translateY(100vh) rotate(360deg); } }
    // The existing contact.js should be modified to call showSuccessModalWithConfetti() instead of its own modal logic.
    ```

---

## 3. Final Technical Instructions

*   **File Name:** `campaign-template.html`.
*   **CSS Links (in `<head>`):**
    ```html
    <link rel="stylesheet" href="./css/variables.css">
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    ```
*   **JS Links (before `</body>`):**
    ```html
    <script src="https://www.google.com/recaptcha/api.js?render=6Ld-fA8qAAAAAP_88n2yS2syO2gG1-wzY_Z-Y-Z-" async defer></script>
    <script src="./js/main.js"></script>
    <script src="./js/contact.js"></script>
    <!-- Add the confetti script here -->
    ```
*   **Scroll Animations:** Use a simple Intersection Observer in `main.js` to add a class (e.g., `.is-visible`) to sections as they scroll into view, which can trigger the animations.

By following this detailed blueprint, the AI will create a truly exceptional, interactive, and reusable landing page that aligns with a modern, high-end brand image.