/**
 * SEES Global ISO Certification - Main JavaScript
 * 
 * This file contains all the interactive functionality for the website.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in the footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize theme toggle
  initThemeToggle();
  
  // Initialize CTA buttons
  initCtaButtons();
  
  // Initialize training page CTA buttons
  initTrainingCtaButtons();
  
  // Initialize certification page CTA buttons
  initCertificationCtaButtons();
  
  // Initialize audit page CTA buttons
  initAuditCtaButtons();
  
  // Initialize trust badge carousel
  initBadgeCarousel();
  
  // Initialize testimonial carousel
  initTestimonialCarousel();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize success modal
  initModal();
  
  // Handle URL parameters (for social media ads)
  handleUrlParameters();
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const servicesDropdown = document.getElementById('services-dropdown');
  const mobileServices = document.getElementById('mobile-services');
  
  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
    
    // Change icon based on menu state
    const icon = mobileMenuToggle.querySelector('i');
    if (mobileMenu.classList.contains('open')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });
  
  // Toggle services dropdown in mobile menu
  if (servicesDropdown) {
    servicesDropdown.addEventListener('click', function() {
      mobileServices.classList.toggle('open');
      
      // Rotate the chevron icon
      const icon = servicesDropdown.querySelector('i');
      if (mobileServices.classList.contains('open')) {
        icon.style.transform = 'rotate(180deg)';
      } else {
        icon.style.transform = 'rotate(0)';
      }
    });
  }
}

/**
 * Theme Toggle Functionality
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or use device preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the saved theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update the theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save the preference
    localStorage.setItem('theme', newTheme);
  });
}

/**
 * CTA Button Functionality
 */
function initCtaButtons() {
  const nigeriaCta = document.getElementById('nigeria-cta');
  const internationalCta = document.getElementById('international-cta');
  const contactForm = document.getElementById('contact-form');
  const formTitle = document.getElementById('form-title');
  const inquirySource = document.getElementById('inquiry-source');
  const clientTypeSelect = document.getElementById('client-type');
  
  // If these elements don't exist, exit early
  if (!contactForm) {
    return;
  }
  
  // Function to scroll to the contact form
  function scrollToContactForm() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Nigeria CTA button functionality
  if (nigeriaCta) {
    nigeriaCta.addEventListener('click', function(e) {
      // Prevent default anchor behavior
      e.preventDefault();
      
      // Update form appearance for Nigeria clients
      contactForm.classList.add('nigeria-form');
      contactForm.classList.remove('international-form');
      
      // Update form title if it exists
      if (formTitle) {
        formTitle.textContent = 'Nigeria Client Inquiry';
      }
      
      // Update hidden field
      if (inquirySource) {
        inquirySource.value = 'nigeria_cta';
      }
      
      // Set client type dropdown if it exists
      if (clientTypeSelect) {
        clientTypeSelect.value = 'nigeria';
      }
      
      // Scroll to form
      scrollToContactForm();
    });
  }
  
  // International CTA button functionality
  if (internationalCta) {
    internationalCta.addEventListener('click', function(e) {
      // Prevent default anchor behavior
      e.preventDefault();
      
      // Update form appearance for International clients
      contactForm.classList.add('international-form');
      contactForm.classList.remove('nigeria-form');
      
      // Update form title if it exists
      if (formTitle) {
        formTitle.textContent = 'International Client Inquiry';
      }
      
      // Update hidden field
      if (inquirySource) {
        inquirySource.value = 'international_cta';
      }
      
      // Set client type dropdown if it exists
      if (clientTypeSelect) {
        clientTypeSelect.value = 'international';
      }
      
      // Scroll to form
      scrollToContactForm();
    });
  }
}

/**
 * Training Page CTA Button Functionality
 */
function initTrainingCtaButtons() {
  const scheduleCta = document.getElementById('schedule-cta');
  const requestCta = document.getElementById('request-cta');
  const customCta = document.querySelector('a[href="#contact"].btn-red');
  const contactForm = document.getElementById('contact-form');
  const trainingTypeSelect = document.getElementById('training-type');
  
  // If no contact form exists, exit early
  if (!contactForm) {
    return;
  }
  
  // Function to scroll to contact form
  function scrollToContactForm() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Function to scroll to schedule section
  function scrollToSchedule() {
    const scheduleSection = document.getElementById('training-schedule');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Request training button functionality
  if (requestCta) {
    requestCta.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Add a hidden input to indicate source if it doesn't exist
      let sourceInput = contactForm.querySelector('input[name="_source"]');
      if (!sourceInput) {
        sourceInput = document.createElement('input');
        sourceInput.type = 'hidden';
        sourceInput.name = '_source';
        contactForm.appendChild(sourceInput);
      }
      
      // Set source value
      sourceInput.value = 'training_request_cta';
      
      // Set custom subject
      let subjectInput = contactForm.querySelector('input[name="_subject"]');
      if (subjectInput) {
        subjectInput.value = 'Training Request from Website';
      }
      
      // Scroll to form
      scrollToContactForm();
    });
  }
  
  // Schedule CTA button functionality
  if (scheduleCta) {
    scheduleCta.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Scroll to schedule section
      scrollToSchedule();
    });
  }
  
  // Custom training request button functionality
  if (customCta) {
    customCta.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Add a hidden input to indicate source if it doesn't exist
      let sourceInput = contactForm.querySelector('input[name="_source"]');
      if (!sourceInput) {
        sourceInput = document.createElement('input');
        sourceInput.type = 'hidden';
        sourceInput.name = '_source';
        contactForm.appendChild(sourceInput);
      }
      
      // Set source value
      sourceInput.value = 'custom_training_cta';
      
      // Set custom subject
      let subjectInput = contactForm.querySelector('input[name="_subject"]');
      if (subjectInput) {
        subjectInput.value = 'Custom Training Request';
      }
      
      // Set training type if dropdown exists
      if (trainingTypeSelect) {
        trainingTypeSelect.value = 'custom';
      }
      
      // Scroll to form
      scrollToContactForm();
    });
  }
}

/**
 * Trust Badge Carousel Functionality
 */
function initBadgeCarousel() {
  const badgesWrapper = document.querySelector('.badges-wrapper');
  const prevButton = document.getElementById('prev-badge');
  const nextButton = document.getElementById('next-badge');
  
  if (!badgesWrapper || !prevButton || !nextButton) {
    return;
  }
  
  const badges = badgesWrapper.querySelectorAll('img');
  let currentPosition = 0;
  let visibleBadges = getVisibleBadges();
  
  // Update visible badges based on screen size
  window.addEventListener('resize', function() {
    visibleBadges = getVisibleBadges();
    updateCarousel();
  });
  
  // Move to previous badge
  prevButton.addEventListener('click', function() {
    currentPosition = (currentPosition - 1 + badges.length) % badges.length;
    updateCarousel();
  });
  
  // Move to next badge
  nextButton.addEventListener('click', function() {
    currentPosition = (currentPosition + 1) % badges.length;
    updateCarousel();
  });
  
  // Auto rotation
  let autoRotate = setInterval(function() {
    currentPosition = (currentPosition + 1) % badges.length;
    updateCarousel();
  }, 4000);
  
  // Pause rotation on hover
  badgesWrapper.addEventListener('mouseenter', function() {
    clearInterval(autoRotate);
  });
  
  badgesWrapper.addEventListener('mouseleave', function() {
    autoRotate = setInterval(function() {
      currentPosition = (currentPosition + 1) % badges.length;
      updateCarousel();
    }, 4000);
  });
  
  // Determine how many badges to show based on screen width
  function getVisibleBadges() {
    if (window.innerWidth < 640) {
      return 1;
    } else if (window.innerWidth < 1024) {
      return 2;
    } else {
      return badges.length;
    }
  }
  
  // Update carousel display
  function updateCarousel() {
    if (visibleBadges >= badges.length) {
      // Show all badges if enough space
      badgesWrapper.style.transform = 'translateX(0)';
    } else {
      // Create circular array of badges
      let displayBadges = [];
      for (let i = 0; i < visibleBadges; i++) {
        displayBadges.push((currentPosition + i) % badges.length);
      }
      
      // Hide all badges
      badges.forEach((badge, index) => {
        badge.style.display = 'none';
      });
      
      // Show only visible badges
      displayBadges.forEach((index, position) => {
        badges[index].style.display = 'block';
        badges[index].style.order = position;
      });
    }
  }
  
  // Initialize carousel
  updateCarousel();
}

/**
 * Certification Page CTA Button Functionality
 */
function initCertificationCtaButtons() {
  const processCta = document.getElementById('process-cta');
  const certificationCta = document.getElementById('certification-cta');
  const contactForm = document.getElementById('contact-form');
  const inquirySource = document.getElementById('inquiry-source');
  
  // If these elements don't exist, exit early
  if (!contactForm) {
    return;
  }
  
  // Function to scroll to the contact form
  function scrollToContactForm() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Function to scroll to the certification process section
  function scrollToProcess() {
    const processSection = document.getElementById('certification-process');
    if (processSection) {
      processSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Process CTA button functionality
  if (processCta) {
    processCta.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToProcess();
    });
  }
  
  // Certification CTA button functionality
  if (certificationCta) {
    certificationCta.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update hidden field for tracking
      if (inquirySource) {
        inquirySource.value = 'hero_certification_cta';
      }
      
      // Scroll to contact form
      scrollToContactForm();
    });
  }
  
  // Quote request button functionality (at the end of process section)
  const quoteBtn = document.querySelector('a[href="#contact"].btn-red');
  if (quoteBtn) {
    quoteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update hidden field for tracking
      if (inquirySource) {
        inquirySource.value = 'process_quote_cta';
      }
      
      // Scroll to contact form
      scrollToContactForm();
    });
  }
}

/**
 * Audit Page CTA Button Functionality
 */
function initAuditCtaButtons() {
  const typesCta = document.getElementById('types-cta');
  const scheduleCta = document.getElementById('schedule-cta');
  const contactForm = document.getElementById('contact-form');
  const inquirySource = document.getElementById('inquiry-source');
  const auditTypeSelect = document.getElementById('audit-type');
  
  // If these elements don't exist, exit early
  if (!contactForm) {
    return;
  }
  
  // Function to scroll to the contact form
  function scrollToContactForm() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Function to scroll to the audit types section
  function scrollToAuditTypes() {
    const auditTypesSection = document.getElementById('audit-types');
    if (auditTypesSection) {
      auditTypesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Audit Types CTA button functionality
  if (typesCta) {
    typesCta.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToAuditTypes();
    });
  }
  
  // Schedule an Audit CTA button functionality
  if (scheduleCta) {
    scheduleCta.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update hidden field for tracking
      if (inquirySource) {
        inquirySource.value = 'hero_audit_cta';
      }
      
      // Scroll to contact form
      scrollToContactForm();
    });
  }
  
  // Handle Learn More buttons for each audit type
  const learnMoreButtons = document.querySelectorAll('a[href^="#"].btn-service');
  learnMoreButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the audit type from the href attribute
      const auditType = this.getAttribute('href').substring(1);
      
      // Update hidden field for tracking
      if (inquirySource) {
        inquirySource.value = `${auditType}_learn_more`;
      }
      
      // Set the audit type in the dropdown if it exists
      if (auditTypeSelect) {
        // Extract the audit type from the href (e.g., "#internal-audit" -> "internal")
        const type = auditType.split('-')[0];
        
        // Find matching option
        const options = Array.from(auditTypeSelect.options);
        const matchingOption = options.find(option => option.value === type);
        
        if (matchingOption) {
          auditTypeSelect.value = type;
        }
      }
      
      // Scroll to contact form
      scrollToContactForm();
    });
  });
  
  // Handle View Certification Services button
  const viewCertificationBtn = document.querySelector('a[href="certification.html"].btn-red');
  if (viewCertificationBtn) {
    viewCertificationBtn.addEventListener('click', function(e) {
      // Do not prevent default as we want to navigate to certification.html
      
      // Store in session storage that the user came from audit page
      sessionStorage.setItem('referrer', 'audit_page');
    });
  }
}

/**
 * Handle URL Parameters (for social media ads)
 */
function handleUrlParameters() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source');
  const campaign = urlParams.get('campaign');
  const formType = urlParams.get('form');
  const service = urlParams.get('service');
  const adId = urlParams.get('ad_id');
  const utm_source = urlParams.get('utm_source');
  const utm_medium = urlParams.get('utm_medium');
  const utm_campaign = urlParams.get('utm_campaign');
  
  // Get contact form
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) {
    return;
  }
  
  // Set a cookie for tracking ad visits (30 day expiry)
  if (source || utm_source) {
    const adSource = source || utm_source;
    const adCampaign = campaign || utm_campaign;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    document.cookie = `ad_source=${adSource}; expires=${expiry.toUTCString()}; path=/`;
    document.cookie = `ad_campaign=${adCampaign}; expires=${expiry.toUTCString()}; path=/`;
    if (adId) {
      document.cookie = `ad_id=${adId}; expires=${expiry.toUTCString()}; path=/`;
    }
  }
  
  // Handle redirection to specific service pages
  if (service) {
    // First save ad parameters if they exist
    const adParams = [];
    if (source) adParams.push(`source=${source}`);
    if (campaign) adParams.push(`campaign=${campaign}`);
    if (adId) adParams.push(`ad_id=${adId}`);
    if (formType) adParams.push(`form=${formType}`);
    
    // URL for redirection
    let redirectUrl = '';
    
    // Determine correct page based on service parameter
    switch(service.toLowerCase()) {
      case 'certification':
      case 'iso':
      case 'iso-certification':
        redirectUrl = 'certification.html';
        break;
      case 'audit':
      case 'auditing':
      case 'iso-audit':
        redirectUrl = 'audit.html';
        break;
      case 'training':
      case 'iso-training':
        redirectUrl = 'training.html';
        break;
      default:
        // Stay on current page if service is not recognized
        break;
    }
    
    // Redirect if we have a valid URL and not already on that page
    if (redirectUrl && !window.location.href.includes(redirectUrl)) {
      const queryString = adParams.length > 0 ? `?${adParams.join('&')}` : '';
      window.location.href = redirectUrl + queryString;
      return; // Exit function as we're redirecting
    }
  }
  
  // Add or update hidden fields for tracking
  if (source || campaign || utm_source || utm_medium || utm_campaign) {
    // Create or update source field
    let sourceInput = contactForm.querySelector('input[name="ad_source"]');
    if (!sourceInput) {
      sourceInput = document.createElement('input');
      sourceInput.type = 'hidden';
      sourceInput.name = 'ad_source';
      contactForm.appendChild(sourceInput);
    }
    sourceInput.value = source || utm_source || '';
    
    // Create or update campaign field
    let campaignInput = contactForm.querySelector('input[name="ad_campaign"]');
    if (!campaignInput) {
      campaignInput = document.createElement('input');
      campaignInput.type = 'hidden';
      campaignInput.name = 'ad_campaign';
      contactForm.appendChild(campaignInput);
    }
    campaignInput.value = campaign || utm_campaign || '';
    
    // Create or update medium field if utm parameters are present
    if (utm_medium) {
      let mediumInput = contactForm.querySelector('input[name="ad_medium"]');
      if (!mediumInput) {
        mediumInput = document.createElement('input');
        mediumInput.type = 'hidden';
        mediumInput.name = 'ad_medium';
        contactForm.appendChild(mediumInput);
      }
      mediumInput.value = utm_medium;
    }
    
    // Create or update ad ID field if present
    if (adId) {
      let adIdInput = contactForm.querySelector('input[name="ad_id"]');
      if (!adIdInput) {
        adIdInput = document.createElement('input');
        adIdInput.type = 'hidden';
        adIdInput.name = 'ad_id';
        contactForm.appendChild(adIdInput);
      }
      adIdInput.value = adId;
    }
    
    // Update inquiry source if it exists
    const inquirySource = document.getElementById('inquiry-source');
    if (inquirySource) {
      // Use UTM parameters if available, otherwise use source/campaign
      const trackingSource = utm_source || source || '';
      const trackingCampaign = utm_campaign || campaign || '';
      const trackingMedium = utm_medium ? `_${utm_medium}` : '';
      
      inquirySource.value = `ad_${trackingSource}${trackingMedium}_${trackingCampaign}`.trim();
      
      // Remove any double underscores that might appear due to empty values
      inquirySource.value = inquirySource.value.replace(/__/g, '_');
      
      // Remove trailing underscore if present
      if (inquirySource.value.endsWith('_')) {
        inquirySource.value = inquirySource.value.slice(0, -1);
      }
    }
  }
  
  // Handle form type parameter (for direct form targeting)
  if (formType) {
    // Scroll to contact form after a short delay
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Update form appearance based on form type
      if (formType === 'nigeria') {
        contactForm.classList.add('nigeria-form');
        contactForm.classList.remove('international-form');
        
        // Update form title if it exists
        const formTitle = document.getElementById('form-title');
        if (formTitle) {
          formTitle.textContent = 'Nigeria Client Inquiry';
        }
        
        // Set client type dropdown if it exists
        const clientTypeSelect = document.getElementById('client-type');
        if (clientTypeSelect) {
          clientTypeSelect.value = 'nigeria';
        }
      } else if (formType === 'international') {
        contactForm.classList.add('international-form');
        contactForm.classList.remove('nigeria-form');
        
        // Update form title if it exists
        const formTitle = document.getElementById('form-title');
        if (formTitle) {
          formTitle.textContent = 'International Client Inquiry';
        }
        
        // Set client type dropdown if it exists
        const clientTypeSelect = document.getElementById('client-type');
        if (clientTypeSelect) {
          clientTypeSelect.value = 'international';
        }
      }
    }, 500);
  }
  
  // Check for service selection through URL parameters
  if (service && !window.location.href.includes(service.toLowerCase() + '.html')) {
    // Auto-select the appropriate service in dropdown menus based on the current page
    setTimeout(() => {
      // Find the appropriate service selection dropdown
      const serviceDropdown = document.getElementById('service') || 
                             document.getElementById('certification') || 
                             document.getElementById('audit-type') || 
                             document.getElementById('training-type');
      
      if (serviceDropdown) {
        // Try to match service parameter with dropdown options
        const options = Array.from(serviceDropdown.options);
        const serviceOptions = {
          'iso9001': ['iso 9001', 'quality', '9001'],
          'iso14001': ['iso 14001', 'environmental', '14001'],
          'iso45001': ['iso 45001', 'occupational', 'health', 'safety', '45001'],
          'iso27001': ['iso 27001', 'information', 'security', '27001'],
          'iso22000': ['iso 22000', 'food', '22000'],
          'internal': ['internal'],
          'stage1': ['stage 1', 'stage1'],
          'stage2': ['stage 2', 'stage2'],
          'surveillance': ['surveillance'],
          'recertification': ['recertification'],
          'public': ['public', 'scheduled'],
          'inhouse': ['in-house', 'inhouse', 'private'],
          'virtual': ['virtual', 'online']
        };
        
        // Try to find a matching option
        let matched = false;
        for (const [key, values] of Object.entries(serviceOptions)) {
          if (service.toLowerCase().includes(key) || values.some(v => service.toLowerCase().includes(v))) {
            // Find an option value that matches
            const matchingOption = options.find(option => 
              option.value.toLowerCase().includes(key) || 
              values.some(v => option.value.toLowerCase().includes(v))
            );
            
            if (matchingOption) {
              serviceDropdown.value = matchingOption.value;
              matched = true;
              break;
            }
          }
        }
        
        // If no match found but options exist, select the first non-empty option as default
        if (!matched && options.length > 1) {
          const firstOption = options.find(option => option.value !== '');
          if (firstOption) {
            serviceDropdown.value = firstOption.value;
          }
        }
        
        // Event dispatch to trigger any change events
        const changeEvent = new Event('change', { bubbles: true });
        serviceDropdown.dispatchEvent(changeEvent);
      }
    }, 1000);
  }
}

/**
 * Testimonial Carousel Functionality
 */
function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevButton = document.getElementById('prev-testimonial');
  const nextButton = document.getElementById('next-testimonial');
  
  if (!slides.length || !dots.length || !prevButton || !nextButton) {
    return;
  }
  
  let currentSlide = 0;
  
  // Set active slide and dot
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Remove active state from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show current slide and activate dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }
  
  // Move to previous slide
  prevButton.addEventListener('click', function() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });
  
  // Move to next slide
  nextButton.addEventListener('click', function() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });
  
  // Click on dots to navigate to slides
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      currentSlide = parseInt(this.getAttribute('data-index'));
      showSlide(currentSlide);
    });
  });
  
  // Auto rotation
  let autoRotate = setInterval(function() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
  
  // Pause rotation on hover
  const testimonialCarousel = document.querySelector('.testimonial-carousel');
  
  testimonialCarousel.addEventListener('mouseenter', function() {
    clearInterval(autoRotate);
  });
  
  testimonialCarousel.addEventListener('mouseleave', function() {
    autoRotate = setInterval(function() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  });
}

/**
 * Contact Form Functionality
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) {
    return;
  }
  
  contactForm.addEventListener('submit', function(e) {
    // Do not prevent default as we want the form to submit to FormSubmit
    // However, we still validate before submission
    
    // Basic form validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Get service type depending on which page we're on
    let serviceType = '';
    const serviceElement = document.getElementById('service');
    const trainingTypeElement = document.getElementById('training-type');
    const auditTypeElement = document.getElementById('audit-type');
    const certificationElement = document.getElementById('certification');
    
    if (serviceElement) {
      serviceType = serviceElement.value;
    } else if (trainingTypeElement) {
      serviceType = trainingTypeElement.value;
    } else if (auditTypeElement) {
      serviceType = auditTypeElement.value;
    } else if (certificationElement) {
      serviceType = certificationElement.value;
    }
    
    // Check if service type is required and provided
    const isServiceRequired = 
      (serviceElement && serviceElement.hasAttribute('required')) ||
      (trainingTypeElement && trainingTypeElement.hasAttribute('required')) ||
      (auditTypeElement && auditTypeElement.hasAttribute('required')) ||
      (certificationElement && certificationElement.hasAttribute('required'));
    
    if (!name || !email || !message || (isServiceRequired && !serviceType)) {
      e.preventDefault();
      alert('Please fill out all required fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('Please enter a valid email address.');
      return;
    }
    
    // Form is valid and will be submitted to FormSubmit
    // We'll show the success modal after a small delay
    setTimeout(function() {
      const successModal = document.getElementById('success-modal');
      if (successModal) {
        successModal.classList.add('open');
      }
      
      // Clear the form after submission
      contactForm.reset();
      
      // Reset form title and remove any custom classes
      const formTitle = document.getElementById('form-title');
      if (formTitle) {
        formTitle.textContent = 'General Inquiry';
      }
      contactForm.classList.remove('nigeria-form', 'international-form');
    }, 1000);
  });
}

/**
 * Modal Functionality
 */
function initModal() {
  const modal = document.getElementById('success-modal');
  const closeButton = modal.querySelector('.modal-close');
  const actionButton = modal.querySelector('.modal-btn');
  
  if (!modal || !closeButton || !actionButton) {
    return;
  }
  
  // Close modal when close button is clicked
  closeButton.addEventListener('click', function() {
    modal.classList.remove('open');
  });
  
  // Close modal when action button is clicked
  actionButton.addEventListener('click', function() {
    modal.classList.remove('open');
  });
  
  // Close modal when clicking outside of modal content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
  
  // Close modal when ESC key is pressed
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}


//start of iso certification

// Certificate data - Replace with your actual certificates
const certificates = [
  {
    id: 1,
    title: "MAMTECH SERVICES LIMITED",
    type: "ISO 9001",
    imageUrl: "./assets/mamtech-high-resolution-logo.jpg", // Replace with actual thumbnail image
    pdfUrl: "./assets/MAMTECH-SERVICES-LIMITED-9001-2015.pdf"
  },
  {
    id: 2,
    title: "MAMTECH SERVICES LIMITED",
    type: "ISO 45001",
    imageUrl: "./assets/mamtech-high-resolution-logo.jpg", // Replace with actual thumbnail image
    pdfUrl: "./assets/MAMTECH-SERVICES-LIMITED-4501.pdf"
  },
  {
    id: 3,
    title: "MAMTECH SERVICES LIMITED",
    type: "ISO 14001",
    imageUrl: "./assets/mamtech-high-resolution-logo.jpg", // Replace with actual thumbnail image
    pdfUrl: "./assets/MAMTECH-SERVICES-LIMITED-1401.pdf"
  },
  {
    id: 4,
    title: "SAENCRYSTAL GLOBAL SERVICES LTD",
    type: "ISO 9001",
    imageUrl: "./assets/SAENCRYSTAL-GLOBAL-logo.png", // Replace with actual thumbnail image
    pdfUrl: "./assets/quality-systems-9001.pdf"
  }
];

// Function to render certificates
function renderCertificates(filter = 'all') {
  const gridElement = document.getElementById('certificatesGrid');
  gridElement.innerHTML = '';
  
  certificates.forEach(cert => {
    if (filter === 'all' || cert.type === filter) {
      const certificateCard = document.createElement('div');
      certificateCard.className = 'certificate-item';
      
      certificateCard.innerHTML = `
        <img src="${cert.imageUrl}" alt="${cert.title} Certificate" class="certificate-image">
        <div class="certificate-info">
          <h3 class="certificate-title">${cert.title}</h3>
          <div class="certificate-type">${cert.type}</div>
          <a href="${cert.pdfUrl}" class="certificate-link" target="_blank">View Certificate</a>
        </div>
      `;
      
      gridElement.appendChild(certificateCard);
    }
  });
}

// Initialize certificate gallery
document.addEventListener('DOMContentLoaded', function() {
  // Render all certificates initially
  renderCertificates();
  
  // Set up filter buttons
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Filter certificates
      const filterValue = this.getAttribute('data-filter');
      renderCertificates(filterValue);
    });
  });
});

//  end of iso certificates 