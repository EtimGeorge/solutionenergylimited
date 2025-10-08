document.addEventListener('DOMContentLoaded', function() {
    // Set current year in the footer
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Initialize mobile menu
    initMobileMenu();
    initMobileServicesDropdown();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize modals
    if (document.querySelector('.modal')) {
      initModals();
    }

    // Initialize carousels
    if (document.querySelector('.tech-carousel')) {
      setupCarousel('.tech-carousel');
    }
    if (document.querySelector('.projects-carousel')) {
      setupCarousel('.projects-carousel');
    }

    // Initialize Lightbox
    initLightbox();

    // Initialize Back to Top Button
    initBackToTop();

    // Initialize Scroll Reveal
    initScrollReveal();
});

function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-scroll-reveal]');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once it's in view
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    if (!lightboxImg || !closeBtn) return;

    document.querySelectorAll('.thumbnail').forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || "Expanded view";
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

function initMobileServicesDropdown() {
    const servicesDropdownButton = document.getElementById('services-dropdown-mobile');
    const mobileServices = document.getElementById('mobile-services');

    if (!servicesDropdownButton || !mobileServices) return;

    servicesDropdownButton.addEventListener('click', function() {
        mobileServices.classList.toggle('open');
        const icon = this.querySelector('i');
        if (mobileServices.classList.contains('open')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');

    modals.forEach(modal => {
        modal.style.display = 'none';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
}

function initBackToTop() {
    const backToTopButton = document.getElementById("backToTopBtn");
    if (!backToTopButton) return;

    const scrollThreshold = 100;

    function toggleBackToTopButton() {
        if (window.scrollY > scrollThreshold) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.addEventListener("scroll", toggleBackToTopButton);
    backToTopButton.addEventListener("click", scrollToTop);
    toggleBackToTopButton();
}

// Dummy setupCarousel function to prevent errors if called
function setupCarousel(selector) {
    // In a real scenario, you would have your carousel logic here.
    // console.log(`Carousel setup for ${selector}`);
}