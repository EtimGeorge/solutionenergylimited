document.addEventListener('DOMContentLoaded', function () {
    // Wait for reCAPTCHA to be ready before interacting with the form
    grecaptcha.ready(function() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        const successModal = document.getElementById('success-modal');

        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Submitting...';
            submitButton.disabled = true;

            try {
                const token = await grecaptcha.execute('6Ld-fA8qAAAAAP_88n2yS2syO2gG1-wzY_Z-Y-Z-', { action: 'submit' });
                
                const formData = new FormData(contactForm);
                const formProps = Object.fromEntries(formData);
                formProps.recaptchaToken = token;

                // Use the correct backend URL
                const response = await fetch('http://localhost:3000/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formProps)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    if(successModal) {
                        successModal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                    }
                    contactForm.reset();
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
        });
    });
});