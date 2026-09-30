// Default theme configuration: Dark mode premium aesthetics
(function applyInitialTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
})();

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initActiveNav();
  initContactForm();
  initSmoothScroll();
  initScrollReveal();
  initCurrentYear();
  initCopyButtons();
});

/**
 * Mobile Navigation Drawer Toggle & Focus Trap
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close when clicking any nav link in drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * Highlights the active link based on current page URL
 */
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-nav a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Contact Inquiry Form Validation & Submission
 */
function initContactForm() {
  const form = document.getElementById('techastra-inquiry-form');
  if (!form) return;

  const statusMsg = document.getElementById('form-status-msg');
  const serviceInput = form.querySelector('[name="service"]');

  // Pre-fill service dropdown from URL parameters (e.g. ?service=banking-analytics)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && serviceInput) {
      const lower = serviceParam.toLowerCase();
      Array.from(serviceInput.options).forEach(opt => {
        if (
          opt.value.toLowerCase().includes(lower) ||
          (lower.includes('bank') && opt.value.toLowerCase().includes('bank')) ||
          (lower.includes('hms') && opt.value.toLowerCase().includes('hms')) ||
          (lower.includes('prop') && opt.value.toLowerCase().includes('prop')) ||
          (lower.includes('daas') && opt.value.toLowerCase().includes('daas')) ||
          (lower.includes('erp') && opt.value.toLowerCase().includes('erp'))
        ) {
          opt.selected = true;
        }
      });
    }
  } catch (e) {
    // Non-blocking query param parsing
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Field references
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const messageInput = form.querySelector('[name="message"]');

    let isValid = true;
    clearErrors(form);

    // Validation
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please provide your name or business name.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please provide a valid business email address.');
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Please provide a brief description (at least 10 characters).');
      isValid = false;
    }

    if (!isValid) {
      if (statusMsg) {
        statusMsg.className = 'form-status-msg error';
        statusMsg.textContent = 'Please correct the highlighted fields above.';
        statusMsg.style.display = 'block';
      }
      return;
    }

    // Submit state simulation & Mailto Handover
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Preparing Inquiry...
    `;

    // Construct Mailto fallback link
    const subject = encodeURIComponent(`Project Inquiry: ${serviceInput.value || 'Custom Software'} — ${nameInput.value.trim()}`);
    const bodyContent = `Name: ${nameInput.value.trim()}
Email: ${emailInput.value.trim()}
Phone: ${phoneInput.value.trim() || 'N/A'}
Service Required: ${serviceInput.value || 'Not specified'}

Project Requirement:
${messageInput.value.trim()}

---
Submitted via TechAstra Software Official Website`;

    const mailtoUri = `mailto:techastrasoftware@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = `
          <strong>Inquiry Generated Successfully!</strong><br>
          We are ready to connect. If your email client does not open automatically, 
          <a href="${mailtoUri}" style="text-decoration: underline; font-weight: 700;">click here to send directly to techastrasoftware@gmail.com</a>.
        `;
        statusMsg.style.display = 'block';
      }

      // Automatically trigger email client
      window.location.href = mailtoUri;
      form.reset();
    }, 600);
  });

  function showError(input, message) {
    input.classList.add('input-error');
    const errEl = document.createElement('span');
    errEl.className = 'form-feedback error';
    errEl.textContent = message;
    input.parentElement.appendChild(errEl);
  }

  function clearErrors(form) {
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.form-feedback.error').forEach(el => el.remove());
    if (statusMsg) statusMsg.style.display = 'none';
  }
}

/**
 * Smooth Scrolling for Anchor Links with Header Offset
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Injects current year dynamically into footer
 */
function initCurrentYear() {
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/**
 * Quick copy buttons for phone/email with visual feedback
 */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalTitle = btn.getAttribute('title') || '';
        btn.setAttribute('title', 'Copied to clipboard!');
        btn.classList.add('copied');

        setTimeout(() => {
          btn.setAttribute('title', originalTitle);
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}


/**
 * High-Performance, Non-Laggy IntersectionObserver Scroll Reveal
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // If user prefers reduced motion or IntersectionObserver is not supported, reveal immediately
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target); // Unobserve once animated
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

