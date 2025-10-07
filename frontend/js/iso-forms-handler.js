document.addEventListener('DOMContentLoaded', function () {
    // Select all forms that have the data-form-origin attribute
    const isoForms = document.querySelectorAll('form[data-form-origin]');

    isoForms.forEach(contactForm => {
        const successModal = document.getElementById('success-modal');
        const modalCloseButtons = successModal ? successModal.querySelectorAll('.modal-close, .modal-btn') : [];

        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Clear previous errors
            clearErrors(contactForm);

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Submitting...';
            submitButton.disabled = true;

            grecaptcha.ready(async function () {
                try {
                    const token = await grecaptcha.execute('your_recaptcha_site_key_for_frontend', { action: 'submit_iso_form' });
                    
                    const formData = new FormData(contactForm);
                    const formProps = Object.fromEntries(formData);

                    // Get formOrigin from the data-form-origin attribute
                    const formOrigin = contactForm.dataset.formOrigin;

                    const response = await fetch('YOUR_BACKEND_API_URL/submit-form', { // Replace with your actual backend URL in production
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ...formProps, recaptchaToken: token, formOrigin: formOrigin })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        showSuccessModal(successModal, result.data);
                        contactForm.reset();
                    } else {
                        handleErrorResponse(contactForm, result);
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    displayGeneralError(contactForm, 'An unexpected error occurred. Please try again later.');
                } finally {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }
            });
        });

        // Modal closing logic for each form's associated modal
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (successModal) {
                    successModal.style.display = 'none';
                }
            });
        });

        if (successModal) {
            window.addEventListener('click', (event) => {
                if (event.target === successModal) {
                    successModal.style.display = 'none';
                }
            });
        }
    });

    function showSuccessModal(modal, data) {
        if (modal) {
            const modalMessage = modal.querySelector('p');
            // Customize success message based on form data if needed
            modalMessage.textContent = `Thank you, ${data.name || 'dear client'}! Your inquiry has been submitted. We'll get back to you shortly.`;
            modal.style.display = 'block';
        }
    }

    function handleErrorResponse(form, result) {
        if (result.field) {
            displayFieldError(form, result.field, result.message);
        } else {
            displayGeneralError(form, result.message || 'An error occurred.');
        }
    }

    function displayFieldError(form, fieldName, message) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('border-red-500');
            let errorDiv = field.nextElementSibling;
            if (!errorDiv || !errorDiv.classList.contains('error-message')) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = 'red';
                errorDiv.style.fontSize = '0.875em';
                field.parentNode.insertBefore(errorDiv, field.nextSibling);
            }
            errorDiv.textContent = message;
        }
    }

    function displayGeneralError(form, message) {
        let generalErrorDiv = form.querySelector('.general-error');
        if (!generalErrorDiv) {
            generalErrorDiv = document.createElement('div');
            generalErrorDiv.className = 'error-message general-error';
            generalErrorDiv.style.color = 'red';
            generalErrorDiv.style.marginTop = '1rem';
            form.appendChild(generalErrorDiv);
        }
        generalErrorDiv.textContent = message;
    }

    function clearErrors(form) {
        form.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
        form.querySelectorAll('.error-message').forEach(el => el.remove());
    }
});
