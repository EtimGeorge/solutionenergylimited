document.addEventListener('DOMContentLoaded', () => {
    // Select all form containers on the page by class
    const formContainers = document.querySelectorAll('.iso-form-container');
    if (formContainers.length === 0) return;

    formContainers.forEach(container => {
        // Get customization options from the container's data attributes
        const config = {
            formOrigin: container.dataset.formOrigin || 'ISO Form',
            serviceInterest: container.dataset.serviceInterest || '',
            showFields: (container.dataset.showFields || '').split(','),
            formTitle: container.dataset.formTitle || 'Contact Us'
        };

        // Fetch and inject the master form component
        const componentPath = container.dataset.componentPath || '../_form-component.html';

        fetch(componentPath) // Use the dynamically determined path
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok to fetch form component.');
                }
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
                const form = container.querySelector('form');
                if (form) {
                    customizeAndInitForm(form, config);
                }
            })
            .catch(error => {
                console.error('Failed to load ISO form component:', error);
                container.innerHTML = '<p style="color: red;">Error: Could not load the inquiry form. Please try again later.</p>';
            });
    });
});

function customizeAndInitForm(form, config) {
    // Set the form origin for tracking
    form.dataset.formOrigin = config.formOrigin;

    // Set the form title
    const formTitleEl = document.createElement('div');
    formTitleEl.className = 'form-title';
    formTitleEl.textContent = config.formTitle;
    form.prepend(formTitleEl);

    // Pre-select service of interest if specified
    if (config.serviceInterest) {
        const serviceSelect = form.querySelector('#iso-service');
        if (serviceSelect) {
            serviceSelect.value = config.serviceInterest;
        }
    }

    // Show/hide fields based on config
    const allFieldGroups = ['fg-service-interest', 'fg-standard-interest', 'fg-employees'];
    allFieldGroups.forEach(fgId => {
        const fieldGroup = form.querySelector(`#${fgId}`);
        if (fieldGroup) {
            if (config.showFields.includes(fgId)) {
                fieldGroup.style.display = 'block';
            } else {
                fieldGroup.style.display = 'none';
            }
        }
    });

    // Logic for 'Other' standard checkbox
    const otherCheckbox = form.querySelector('#iso-other-checkbox');
    const otherTextInput = form.querySelector('#iso-other-text');
    if (otherCheckbox && otherTextInput) {
        otherCheckbox.addEventListener('change', () => {
            otherTextInput.style.display = otherCheckbox.checked ? 'block' : 'none';
            if(otherCheckbox.checked) otherTextInput.focus();
        });
    }

    // Attach the submission handler (this will be the unified logic)
    form.addEventListener('submit', handleFormSubmission);
}

async function handleFormSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // --- Dynamic Backend URL Logic ---
    function getBackendUrl() {
        const hostname = window.location.hostname;
        if (hostname === '127.0.0.1' || hostname === 'localhost') {
            return 'http://localhost:3000'; // Local development
        } else {
            return window.FRONTEND_CONFIG.BACKEND_URL; // Production URL from config.js
        }
    }
    const BACKEND_URL = getBackendUrl();

    // Basic client-side validation can go here if needed

    submitButton.innerHTML = 'Submitting...';
    submitButton.disabled = true;

    try {
        // This assumes the global reCAPTCHA script is loaded on the page
        const token = await grecaptcha.execute(window.FRONTEND_CONFIG.RECAPTCHA_SITE_KEY, { action: 'iso_form_submit' });

        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData);

        // Include the dynamically set form origin
        formProps.formOrigin = form.dataset.formOrigin;

        const response = await fetch(`${BACKEND_URL}/submit-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...formProps, recaptchaToken: token })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Handle success (e.g., show a success message/modal)
            alert('Submission successful!');
            form.reset();
        } else {
            // Handle error
            alert(result.message || 'An error occurred.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert('An unexpected network error occurred. Please try again.');
    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}