/**
 * TechAstra Software — Official Interactive Engine
 * Lightweight, accessible, zero-dependency script
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initActiveNavigation();
  initContactForm();
  initSmoothScroll();
  initDynamicYear();
  initCopyHelpers();
});

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on link click inside drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Highlights Current Page in Primary Navigation & Drawer
 */
function initActiveNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Contact Inquiry Form Logic & Mailto Trigger
 */
function initContactForm() {
  const form = document.getElementById('techastra-inquiry-form');
  if (!form) return;

  const statusMsg = document.getElementById('form-status-msg');
  const serviceInput = form.querySelector('[name="service"]');

  // Pre-fill service dropdown from URL parameters (e.g., ?service=daas or ?service=banking-analytics)
  try {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    if (serviceParam && serviceInput) {
      const lower = serviceParam.toLowerCase();
      Array.from(serviceInput.options).forEach(opt => {
        const val = opt.value.toLowerCase();
        if (
          (lower.includes('bank') && val.includes('bank')) ||
          (lower.includes('daas') && val.includes('daas')) ||
          (lower.includes('device') && val.includes('daas')) ||
          (lower.includes('hms') && val.includes('hms')) ||
          (lower.includes('prop') && val.includes('prop')) ||
          (lower.includes('custom') && val.includes('custom')) ||
          (lower.includes('erp') && val.includes('erp'))
        ) {
          opt.selected = true;
        }
      });
    }
  } catch (err) {
    // Non-blocking query param parsing
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const serviceSelect = form.querySelector('[name="service"]');
    const messageInput = form.querySelector('[name="message"]');

    let isValid = true;
    clearFormErrors(form);

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please provide your name');
      isValid = false;
    }

    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
      showError(emailInput, 'Please provide a valid business email');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please describe your project requirements');
      isValid = false;
    }

    if (!isValid) return;

    // Compose inquiry details
    const subject = encodeURIComponent(`Project Inquiry: ${serviceSelect.value || 'General Solution'} — from ${nameInput.value.trim()}`);
    const body = encodeURIComponent(
      `Name: ${nameInput.value.trim()}\n` +
      `Email: ${emailInput.value.trim()}\n` +
      `Phone: ${phoneInput ? phoneInput.value.trim() : 'N/A'}\n` +
      `Requirement: ${serviceSelect.value}\n\n` +
      `Project Brief:\n${messageInput.value.trim()}\n\n` +
      `-- Sent from TechAstra Software Website (techastrasoftware.com)`
    );

    const mailtoUri = `mailto:techastrasoftware@gmail.com?subject=${subject}&body=${body}`;

    if (statusMsg) {
      statusMsg.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34D399; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
          <strong>Inquiry Prepared!</strong> Opening your email client to dispatch to <strong>techastrasoftware@gmail.com</strong>.
          If your client does not open, <a href="${mailtoUri}" style="color: #00F0FF; text-decoration: underline; font-weight: 700;">click here to send directly</a>.
        </div>
      `;
      statusMsg.style.display = 'block';
    }

    setTimeout(() => {
      window.location.href = mailtoUri;
      form.reset();
    }, 400);
  });

  function showError(input, msg) {
    input.style.borderColor = '#EF4444';
    const err = document.createElement('span');
    err.className = 'form-error-msg';
    err.style.color = '#EF4444';
    err.style.fontSize = '0.78rem';
    err.style.marginTop = '0.25rem';
    err.textContent = msg;
    input.parentElement.appendChild(err);
  }

  function clearFormErrors(f) {
    f.querySelectorAll('.form-control').forEach(el => el.style.borderColor = '');
    f.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    if (statusMsg) statusMsg.style.display = 'none';
  }
}

/**
 * Smooth Anchor Scrolling with Header Offset
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Automatic Current Year in Footer
 */
function initDynamicYear() {
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/**
 * Quick Copy Helper for Support Phone Numbers & Email
 */
function initCopyHelpers() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const val = el.getAttribute('data-copy');
      if (!val) return;
      navigator.clipboard.writeText(val).then(() => {
        const orig = el.getAttribute('title') || '';
        el.setAttribute('title', 'Copied!');
        setTimeout(() => el.setAttribute('title', orig), 1500);
      });
    });
  });
}
