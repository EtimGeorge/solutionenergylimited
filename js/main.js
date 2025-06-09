/**
 * SEESL Website - Main JavaScript File
 * 
 * This file initializes all functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize form validation if form exists
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      initFormValidation(contactForm); // This now includes the AJAX submit logic
    } 
    
    
    // Initialize modals (handles success modal closing, and any data-modal triggers)
    if (document.querySelector('.modal')) {
      initModals();
    }

        // Initialize carousels
        if (document.querySelector('.tech-carousel')) {
          setupCarousel('.tech-carousel'); // Uses modified setupCarousel
      }
      if (document.querySelector('.projects-carousel')) {
          setupCarousel('.projects-carousel'); // Uses modified setupCarousel
      }

  // Initialize Lightbox
const lightbox = document.getElementById('lightbox');

if (lightbox) { // Only proceed if the main lightbox element exists
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    if (lightboxImg && closeBtn) { // Ensure critical inner elements also exist
        document.querySelectorAll('.thumbnail').forEach(img => {
            img.addEventListener('click', (e) => {
                e.preventDefault(); // Good practice if thumbnails are ever wrapped in <a>
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || "Expanded view"; // Set alt text for accessibility
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent body scrolling when lightbox is open
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = ''; // Restore body scrolling
        };

        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) { // Click on the overlay itself
                closeLightbox();
            }
        });

        // Optional: Close lightbox with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    } else {
        // console.warn("Lightbox image container or close button not found."); // Optional for debugging
    }
} else {
    // console.warn("Lightbox element not found."); // Optional for debugging
}

  });
  
  /**
   * Mobile Menu Functionality
   */
  function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const servicesDropdown = document.getElementById('services-dropdown-mobile');
    const mobileServices = document.getElementById('mobile-services');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
      if (!mobileMenu.classList.contains('open')) {
        // Opening the menu
        mobileMenu.style.height = 'auto';
        const height = mobileMenu.scrollHeight;
        mobileMenu.style.height = '0';
        mobileMenu.style.visibility = 'visible';
        
        // Force browser to acknowledge changes before animation
        setTimeout(() => {
          mobileMenu.style.height = `${height}px`;
          mobileMenu.classList.add('open');
        }, 10);
        
        // Change icon to X
        mobileMenuToggle.querySelector('i').className = 'fas fa-times';
      } else {
        // Closing the menu
        mobileMenu.style.height = '0';
        mobileMenu.classList.remove('open');
        
        // Reset icon
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        
        // After animation completes, hide element
        setTimeout(() => {
          if (!mobileMenu.classList.contains('open')) {
            mobileMenu.style.visibility = 'hidden';
          }
        }, 300);
      }
    });
    
    // Toggle services dropdown in mobile menu
    if (servicesDropdown && mobileServices) {
      servicesDropdown.addEventListener('click', function() {
        mobileServices.classList.toggle('open');
        
        // Rotate chevron icon
        const icon = servicesDropdown.querySelector('i');
        if (mobileServices.classList.contains('open')) {
          icon.style.transform = 'rotate(180deg)';
        } else {
          icon.style.transform = 'rotate(0)';
        }
      });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('open') && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuToggle.contains(e.target)) {
        
        mobileMenu.style.height = '0';
        mobileMenu.classList.remove('open');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        
        setTimeout(() => {
          if (!mobileMenu.classList.contains('open')) {
            mobileMenu.style.visibility = 'hidden';
          }
        }, 300);
      }
    });
  }
  
  /**
   * Theme Toggle Functionality
   */
  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set the theme based on saved preference or device setting
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Update the theme
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Save the preference
      localStorage.setItem('theme', newTheme);
    });
  }
  
  /**
   * Form Validation
   */
  function initFormValidation(form) {
    // Add input validation on blur
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.hasAttribute('required')) {
        input.addEventListener('blur', function() {
          validateInput(this);
        });
      }
      
      if (input.type === 'email') {
        input.addEventListener('blur', function() {
          validateEmail(this);
        });
      }
    });
    
    

    form.addEventListener('submit', async function(e) {
      e.preventDefault(); // Prevent default HTML form submission
    
      let isValidForm = true;
      // Re-validate all required inputs before submission
      inputs.forEach(input => {
        if (input.hasAttribute('required')) {
          if (!validateInput(input)) {
            isValidForm = false;
          }
        }
        if (input.type === 'email') {
          if (!validateEmail(input)) { // Assuming validateEmail also checks required if applicable
            isValidForm = false;
          }
        }
      });
    
      if (!isValidForm) {
        // Optionally, focus the first invalid input or show a general message
        const firstError = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
        if (firstError) {
          firstError.focus();
        }
        return; // Stop if form is not valid
      }
    
      // If form is valid, proceed with submission
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    
      try {

        

        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            // Remove Content-Type header - let the browser set it automatically for FormData
          }

        });
    
        if (response.ok) {
          // Formspree submission successful
          form.reset(); // Clear the form fields
          // Remove any lingering validation error messages after successful submission
          form.querySelectorAll('.error-message').forEach(el => el.remove());
          form.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
    
          // Show the success modal
          const successModal = document.getElementById('success-modal');
          if (successModal) {
            // Check if initModals has made it 'none' or if it's using the 'hidden' class.
            // The current initModals uses style.display.
            // Let's ensure it becomes visible using the same mechanism.
            successModal.style.display = 'block'; 
            // If your modals rely on 'open' class from CSS, use:
            // successModal.classList.add('open'); 
            // successModal.classList.remove('hidden');
            
            // Ensure body scroll is handled if initModals isn't already doing it upon opening this specific modal
             if (typeof document.body.style.overflow !== 'undefined') { // Check if style property exists
                document.body.style.overflow = 'hidden';
             }
    
    
            // If you have a specific close button for this modal inside it (e.g., class .modal-btn)
            // and want to add an event listener here (though initModals should cover general .modal-close)
            const modalCloseButton = successModal.querySelector('.modal-btn, .modal-close'); // Adjust selector if needed
            if (modalCloseButton) {
              modalCloseButton.onclick = () => { // Use onclick for simplicity here or addEventListener
                successModal.style.display = 'none';
                if (typeof document.body.style.overflow !== 'undefined') {
                    document.body.style.overflow = '';
                }
              };
            }
          } else {
            alert('Thank you! Your message has been sent.'); // Fallback if modal not found
          }
        } else {
          // Formspree returned an error
          response.json().then(data => {
            if (data.errors) {
              // Display Formspree errors (e.g., "email is not valid")
              // This is a simple alert, you might want to display them near fields
              alert(data.errors.map(error => error.message).join("\n"));
            } else {
              alert('Oops! There was a problem submitting your form. Please try again.');
            }
          }).catch(() => {
            alert('Oops! There was a problem submitting your form and parsing the response.');
          });
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Oops! There was a network error. Please try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });


    
    // Input validation function
    function validateInput(input) {
      const parent = input.closest('.form-group');
      const errorElement = parent.querySelector('.error-message');
      
      // Remove existing error message
      if (errorElement) {
        parent.removeChild(errorElement);
      }
      
      // Remove error class
      parent.classList.remove('error');
      
      // Check if input is empty
      if (input.value.trim() === '') {
        showError(input, 'This field is required');
        return false;
      }
      
      return true;
    }
    
    // Email validation function
    function validateEmail(input) {
      if (input.value.trim() === '') return true;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(input.value.trim());
      
      if (!isValid) {
        showError(input, 'Please enter a valid email address');
      }
      
      return isValid;
    }
    
    // Show error message
    function showError(input, message) {
      const parent = input.closest('.form-group');
      parent.classList.add('error');
      
      const errorMessage = document.createElement('span');
      errorMessage.className = 'error-message';
      errorMessage.textContent = message;
      
      parent.appendChild(errorMessage);
    }
  }
  
  
  /**
   * Modal Functionality
   */
  function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    
    // Hide modal by default
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
    
    // Open modal when trigger is clicked
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (modal) {
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden'; // Prevent body scrolling
        }
      });
    });
    
    // Close modal when close button is clicked
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
          document.body.style.overflow = ''; // Restore body scrolling
        }
      });
    });
    
    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          this.style.display = 'none';
          document.body.style.overflow = ''; // Restore body scrolling
        }
      });
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        modals.forEach(modal => {
          if (modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore body scrolling
          }
        });
      }
    });
  }

  // Clear the form fields when the page loads
window.addEventListener('load', function() {
  // ... (form reset logic) ...
});

// Carousel Setup with Autoplay, Arrows & Dots
function setupCarousel(carouselSelector) { // Note: parameter name changed for clarity
const container = document.querySelector(carouselSelector);
if (!container) {
  // console.warn('Carousel container not found:', carouselSelector);
  return; 
}

let track, items, prev, next, dotsContainer;
let trackSelector, prevSelector, nextSelector, dotsSelector;

if (carouselSelector === '.tech-carousel') {
  trackSelector = '.tech-track';
  prevSelector = '.prev-tech';
  nextSelector = '.next-tech';
  dotsSelector = '.tech-dots'; 
} else if (carouselSelector === '.projects-carousel') {
  trackSelector = '.proj-track';
  prevSelector = '.prev-proj';
  nextSelector = '.next-proj';
  dotsSelector = '.proj-dots';
} else {
  console.error('Unknown carousel selector for setup:', carouselSelector);
  return;
}

track = container.querySelector(trackSelector);
if (!track) {
  // console.warn('Carousel track not found for:', carouselSelector, 'using trackSelector:', trackSelector);
  return; 
}
items = track.children;
prev = container.querySelector(prevSelector);
next = container.querySelector(nextSelector);
dotsContainer = container.querySelector(dotsSelector);
if (!dotsContainer) {
   dotsContainer = container.querySelector('.pagination-dots');
}

if (!items || items.length === 0 || !prev || !next || !dotsContainer) {
  // console.warn('Missing essential carousel elements for:', carouselSelector);
  return;
}

let index = 0, timer;
const total = items.length, interval = 4000;

// Create and attach dots
dotsContainer.innerHTML = ''; // Clear existing dots if any (e.g., from HTML, though not present now)
for (let i = 0; i < total; i++) {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`); // Accessibility
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.append(dot);
}
const dots = dotsContainer.children;

function update() {
  // Ensure track has measurable width for clientWidth to be accurate
  if (track.clientWidth > 0) {
      track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  } else {
      // Fallback or log if track width is 0 (e.g., hidden parent)
      // For now, we'll just prevent error. This might happen if carousel is in a hidden tab/section initially.
  }
  Array.from(dots).forEach((d, i) => d.classList.toggle('active', i === index));
}
function nextSlide() { index = (index + 1) % total; update(); }
function prevSlide() { index = (index - 1 + total) % total; update(); }
function resetTimer() { clearInterval(timer); timer = setInterval(nextSlide, interval); }
function goTo(i) { index = i; resetTimer(); update(); }

prev.addEventListener('click', () => { prevSlide(); resetTimer(); });
next.addEventListener('click', () => { nextSlide(); resetTimer(); });

// Initial setup
resetTimer(); 
update(); // Call update after dots are created and timer is set
}

// Form reset on load
window.addEventListener('load', function() {
  const form = document.getElementById('contact-form');
  if (form) {
      form.reset();
  }
});


// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {

  // Get the button element by its ID
  const backToTopButton = document.getElementById("backToTopBtn");

  // Define the scroll distance (in pixels) when the button should appear
  const scrollThreshold = 100;

  // Function to show or hide the button based on scroll position
  function toggleBackToTopButton() {
      // Check current vertical scroll position
      // window.scrollY is the modern standard.
      // document.documentElement.scrollTop || document.body.scrollTop for older browser compatibility
      const scrolled = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

      if (scrolled > scrollThreshold) {
          // If scrolled more than the threshold, add 'show' class to make it visible
          backToTopButton.classList.add("show");
      } else {
          // Otherwise, remove 'show' class to hide it
          backToTopButton.classList.remove("show");
      }
  }

  // Function to smoothly scroll to the top of the page
  function scrollToTop() {
      window.scrollTo({
          top: 0,
          behavior: "smooth" // This enables smooth scrolling
      });
  }

  // Add event listener for scroll events on the window
  window.addEventListener("scroll", toggleBackToTopButton);

  // Add event listener for click events on the button
  backToTopButton.addEventListener("click", scrollToTop);

  // Initially check the scroll position when the page loads
  // (in case the page is loaded scrolled down, e.g., via a hash link or refresh)
  toggleBackToTopButton();
});




