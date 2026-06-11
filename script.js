document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. PRELOADER & GSAP ENTRY ANIMATIONS
     ========================================== */
  const preloader = document.getElementById('preloader');
  const preloaderLogo = document.getElementById('preloader-logo');

  // GSAP: Animate preloader logo
  gsap.fromTo(preloaderLogo, 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  );

  window.addEventListener('load', () => {
    // Fade out preloader
    setTimeout(() => {
      preloader.classList.add('fade-out');
      
      // Trigger Hero animations after preloader closes
      initHeroAnimations();
    }, 1000);
  });

  function initHeroAnimations() {
    const tl = gsap.timeline();
    
    // Navbar entry
    tl.fromTo('.navbar', 
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    
    // Hero Badge
    tl.fromTo('.hero-badge', 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    // Title elements
    tl.fromTo('.hero-title-prefix, .hero-name, .hero-subtitle, .hero-desc', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      '-=0.5'
    );

    // Call to action buttons
    tl.fromTo('.hero-ctas .btn', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

    // Profile photo wrapper
    tl.fromTo('.profile-card-wrapper', 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=0.8'
    );

    // Floating experience badge
    tl.fromTo('.floating-experience-badge', 
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
      '-=0.6'
    );

    // Tech badges
    tl.fromTo('.tech-badge', 
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
      '-=0.5'
    );
  }

  /* ==========================================
     2. AOS ANIMATION INITIALIZATION
     ========================================== */
  AOS.init({
    duration: 1000,
    once: true,
    offset: 120,
    easing: 'ease-out-cubic'
  });

  /* ==========================================
     3. SCROLL PROGRESS & NAVBAR EFFECTS
     ========================================== */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
  const navSections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 3.1 Progress Bar Calculator
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${progress}%`;

    // 3.2 Navbar Glassmorphism scroll toggle
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 3.3 Scroll to Top Button visibility
    if (scrollTop > 400) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }

    // 3.4 Active Nav Link Highlight based on scroll
    let currentSection = '';
    navSections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.parentElement.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.parentElement.classList.add('active');
      }
    });
  });

  // Scroll to Top Button Action
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================
     4. MOBILE MENU INTERACTION
     ========================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = mobileMenuToggle.querySelector('i');

  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Change icon based on status
    if (navMenu.classList.contains('active')) {
      menuIcon.className = 'fa-solid fa-xmark';
    } else {
      menuIcon.className = 'fa-solid fa-bars-staggered';
    }
  });

  // Close menu when clicking link
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuIcon.className = 'fa-solid fa-bars-staggered';
    });
  });

  /* ==========================================
     5. SKILLS TABS & PROGRESS BARS
     ========================================== */
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillGrids = document.querySelectorAll('.skills-grid');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      skillTabs.forEach(t => t.classList.remove('active'));
      // Activate clicked tab
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');

      // Hide all grids
      skillGrids.forEach(grid => {
        grid.classList.remove('active');
      });

      // Show matching grid
      const activeGrid = document.getElementById(`tab-${targetTab}`);
      activeGrid.classList.add('active');

      // Animate progress bars in active grid
      animateSkillsInGrid(activeGrid);
    });
  });

  function animateSkillsInGrid(grid) {
    const bars = grid.querySelectorAll('.skill-bar-progress');
    bars.forEach(bar => {
      const targetLevel = bar.getAttribute('data-level');
      bar.style.width = targetLevel;
    });
  }

  // Auto-animate frontend skills when home scrolls into view using IntersectionObserver
  const skillsSection = document.getElementById('skills');
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const defaultActiveGrid = document.querySelector('.skills-grid.active');
        animateSkillsInGrid(defaultActiveGrid);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  skillsObserver.observe(skillsSection);

  /* ==========================================
     6. PROJECTS FILTERING
     ========================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate other buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Activate clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Hide card first with fade-out
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            // Trigger layout recalculation before animating back in
            void card.offsetWidth;
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        }, 300); // match transition speed
      });
    });
  });

  /* ==========================================
     7. AWARDS LIGHTBOX GALLERY
     ========================================== */
  const awardCards = document.querySelectorAll('.award-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentAwardIndex = 0;
  const awardsData = [];

  // Populate awards array
  awardCards.forEach((card, index) => {
    awardsData.push({
      imgSrc: card.getAttribute('data-img'),
      caption: card.getAttribute('data-caption')
    });

    card.addEventListener('click', () => {
      currentAwardIndex = index;
      openLightbox(currentAwardIndex);
    });
  });

  function openLightbox(index) {
    const data = awardsData[index];
    lightboxImg.src = data.imgSrc;
    lightboxImg.alt = data.caption;
    lightboxCaption.textContent = data.caption;
    
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = ''; // restore scrolling
  }

  function showNextAward() {
    currentAwardIndex = (currentAwardIndex + 1) % awardsData.length;
    updateLightboxContent(currentAwardIndex);
  }

  function showPrevAward() {
    currentAwardIndex = (currentAwardIndex - 1 + awardsData.length) % awardsData.length;
    updateLightboxContent(currentAwardIndex);
  }

  function updateLightboxContent(index) {
    // Add brief fade animation to image transition
    lightboxImg.style.opacity = '0.4';
    setTimeout(() => {
      const data = awardsData[index];
      lightboxImg.src = data.imgSrc;
      lightboxImg.alt = data.caption;
      lightboxCaption.textContent = data.caption;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  // Lightbox click events
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextAward);
  lightboxPrev.addEventListener('click', showPrevAward);

  // Close when clicking background outside content
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextAward();
    } else if (e.key === 'ArrowLeft') {
      showPrevAward();
    }
  });

  /* ==========================================
     8. STATISTICS COUNTER ANIMATION
     ========================================== */
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(statsSection);

  function animateStats() {
    statNumbers.forEach(num => {
      const target = parseFloat(num.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1800; // Total count duration in ms
      const stepTime = 25;   // Tick speed
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        current += increment;
        step++;

        if (step >= totalSteps) {
          num.textContent = isDecimal ? target.toFixed(1) + '+' : target + (target === 100 ? '%' : '+');
          clearInterval(timer);
        } else {
          num.textContent = isDecimal ? current.toFixed(1) + '+' : Math.floor(current) + '+';
        }
      }, stepTime);
    });
  }

  /* ==========================================
     9. TESTIMONIALS SLIDER
     ========================================== */
  const testimonialsWrapper = document.getElementById('testimonials-wrapper');
  const sliderDots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoSlideTimer;

  function goToSlide(index) {
    currentSlide = index;
    testimonialsWrapper.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    sliderDots.forEach(dot => dot.classList.remove('active'));
    sliderDots[index].classList.add('active');
  }

  sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      let nextSlide = (currentSlide + 1) % sliderDots.length;
      goToSlide(nextSlide);
    }, 6000); // change slide every 6 seconds
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();

  /* ==========================================
     10. CONTACT FORM SUBMISSION & VALIDATION
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Fetch fields
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Basic Validation Check
      if (!name || !email || !subject || !message) {
        showToast('Please fill in all details before submitting.', 'error');
        return;
      }

      // Submit button state animation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      // Simulate sending message (2s delay)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        
        // Clear form
        contactForm.reset();

        // Trigger success notification
        showToast('Thank you! Your message has been sent successfully.', 'success');
      }, 2000);
    });
  }

  function showToast(message, type) {
    if (toastNotification) {
      toastMessage.textContent = message;
      toastNotification.className = `toast-notification active ${type}`;
      
      // Auto remove toast
      setTimeout(() => {
        toastNotification.classList.remove('active');
      }, 4500);
    }
  }
});
