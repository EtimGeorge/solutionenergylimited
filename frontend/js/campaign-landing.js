// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-bg-image');
    const scrolled = window.pageYOffset;
    heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Smooth scroll for CTA button
document.querySelector('.btn-hero').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#form').scrollIntoView({
        behavior: 'smooth'
    });
});

// Intersection Observer for scroll animations
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});


// Close modal when clicking outside
const successModal = document.getElementById('success-modal');
if (successModal) {
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}
