document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.contact-form');
    if (forms.length === 0) return;

    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });

    // Initialize the new modal's close functionality
    const modal = document.getElementById('seesl-success-modal');
    if (modal) {
        const closeButtons = modal.querySelectorAll('.seesl-modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
        // Also close when clicking on the modal background
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

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

    submitButton.innerHTML = 'Submitting...';
    submitButton.disabled = true;

    try {
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData);

        // Include the dynamically set form origin
        formProps.formOrigin = form.dataset.formOrigin || 'Unknown Form';

        const response = await fetch(`${BACKEND_URL}/submit-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formProps)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            form.reset();
            // Use the appropriate modal based on the page
            if (form.closest('body').querySelector('#success-modal.modal')) { // This is the campaign-landing modal
                if (typeof showSuccessModalWithConfetti === 'function') {
                    showSuccessModalWithConfetti();
                }
            } else { // This is for all other forms
                const successModal = document.getElementById('seesl-success-modal');
                if(successModal) {
                    successModal.style.display = 'flex';
                }
            }
        } else {
            alert(result.message || 'An error occurred during submission.');
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('An unexpected error occurred. Please try again later.');
    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}
