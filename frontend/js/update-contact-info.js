(function() {
    const phone1 = window.FRONTEND_CONFIG.CONTACT_PHONE_1;
    const phone2 = window.FRONTEND_CONFIG.CONTACT_PHONE_2;
    const email = window.FRONTEND_CONFIG.CONTACT_EMAIL;

    const phone1_formatted = `+${phone1.slice(1, 4)} (${phone1.slice(4, 7)}) ${phone1.slice(7, 10)}-${phone1.slice(10)}`;
    const phone2_formatted = `+${phone2.slice(1, 4)} (${phone2.slice(4, 7)}) ${phone2.slice(7, 10)}-${phone2.slice(10)}`;

    document.addEventListener('DOMContentLoaded', function() {
        const phone1_elements = document.querySelectorAll('[data-tel="1"]');
        const phone2_elements = document.querySelectorAll('[data-tel="2"]');
        const email_elements = document.querySelectorAll('[data-email]');

        phone1_elements.forEach(el => {
            el.href = `tel:${phone1}`;
            el.innerHTML = phone1_formatted;
        });

        phone2_elements.forEach(el => {
            el.href = `tel:${phone2}`;
            el.innerHTML = phone2_formatted;
        });

        email_elements.forEach(el => {
            el.href = `mailto:${email}`;
            el.innerHTML = email;
        });
    });
})();
