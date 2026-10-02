/**
 * TechAstra Software — Official Interactive & Cosmic Astra Engine
 * Lightweight, zero-dependency, GPU-accelerated & WCAG accessible
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAstraCosmicCanvas();
  initCardHoverShimmer();
  initMobileDrawer();
  initActiveNavigation();
  initContactForm();
  initSmoothScroll();
  initDynamicYear();
});

/**
 * --------------------------------------------------------------------------
 * 1. Cosmic Astra Celestial Constellation Canvas
 * --------------------------------------------------------------------------
 */
function initAstraCosmicCanvas() {
  const canvas = document.getElementById('astra-canvas');
  if (!canvas) return;

  // Respect user reduced-motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;
  let animationFrameId = null;
  let isVisible = true;

  // Mouse interaction coordinates
  const mouse = {
    x: -1000,
    y: -1000,
    radius: 140
  };

  const isMobile = window.innerWidth < 768;
  const starCount = isMobile ? 30 : 65;
  const maxConnectDist = isMobile ? 85 : 125;
  const stars = [];

  const darkStarColors = [
    'rgba(255, 255, 255,',
    'rgba(0, 240, 255,',
    'rgba(96, 165, 250,',
    'rgba(167, 139, 250,'
  ];

  const lightStarColors = [
    'rgba(234, 88, 12,',  // Solar Orange
    'rgba(2, 132, 199,',  // TechAstra Azure
    'rgba(245, 158, 11,', // Amber
    'rgba(99, 102, 241,'  // Indigo
  ];

  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth || 360;
    height = rect.height || 600;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    if (ctx.resetTransform) {
      ctx.resetTransform();
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.scale(dpr, dpr);
  }

  class Star {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (width || 360);
      this.y = initial ? Math.random() * (height || 600) : (Math.random() < 0.5 ? -10 : (height || 600) + 10);
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.7;
      this.baseAlpha = Math.random() * 0.55 + 0.35;
      this.alpha = this.baseAlpha;
      const palette = isLightTheme() ? lightStarColors : darkStarColors;
      this.colorBase = palette[Math.floor(Math.random() * palette.length)];
      this.twinkleSpeed = Math.random() * 0.025 + 0.008;
      this.twinkleStep = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Soft boundary wrap
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      // Twinkle pulsation
      this.twinkleStep += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinkleStep) * 0.2;

      // Mouse / touch gravitational proximity effect
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 0.8;
        this.x -= (dx / dist) * force;
        this.y -= (dy / dist) * force;
      }
    }

    draw() {
      const light = isLightTheme();
      const starAlpha = Math.max(0.12, Math.min(1, this.alpha * (light ? 0.8 : 1)));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorBase} ${starAlpha})`;
      ctx.shadowBlur = this.radius * (light ? 2 : 3.5);
      ctx.shadowColor = light ? 'rgba(234, 88, 12, 0.35)' : 'rgba(0, 240, 255, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
  }

  function drawConstellations() {
    const light = isLightTheme();
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxConnectDist) {
          const proximityAlpha = (1 - dist / maxConnectDist) * (light ? 0.14 : 0.18);
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = light
            ? `rgba(234, 88, 12, ${proximityAlpha})`
            : `rgba(0, 240, 255, ${proximityAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Constellation link to active mouse or touch pointer
      const mdx = stars[i].x - mouse.x;
      const mdy = stars[i].y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mDist < mouse.radius) {
        const mAlpha = (1 - mDist / mouse.radius) * (light ? 0.22 : 0.28);
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = light
          ? `rgba(234, 88, 12, ${mAlpha})`
          : `rgba(0, 240, 255, ${mAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Listen for real-time theme changes to update star colors
  window.addEventListener('themechange', () => {
    const light = isLightTheme();
    const palette = light ? lightStarColors : darkStarColors;
    stars.forEach(s => {
      s.colorBase = palette[Math.floor(Math.random() * palette.length)];
    });
  });

  let isRunning = false;

  function startAnimation() {
    if (!isRunning) {
      isRunning = true;
      animationFrameId = requestAnimationFrame(tick);
    }
  }

  function stopAnimation() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function tick() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);
    drawConstellations();

    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    animationFrameId = requestAnimationFrame(tick);
  }

  // Window Resize Debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      initStars();
      if (!isRunning) startAnimation();
    }, 150);
  });

  // Track Mouse on canvas container
  const parentSection = canvas.parentElement || window;
  parentSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  parentSection.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Touch Support for Mobile
  parentSection.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  parentSection.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  parentSection.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  }, { passive: true });

  // Pause when tab is hidden, resume when tab is active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  window.addEventListener('focus', () => {
    startAnimation();
  });

  // Intersection Observer with generous margin so it stays active when scrolling near hero
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      });
    }, { rootMargin: '150px 0px 150px 0px' });
    observer.observe(canvas);
  }

  resize();
  initStars();
  startAnimation();
}

/**
 * --------------------------------------------------------------------------
 * 2. Card Hover Dynamic Starlight Bevel Tracker
 * --------------------------------------------------------------------------
 */
function initCardHoverShimmer() {
  const cards = document.querySelectorAll('.card, .portal-card, .form-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 3. Mobile Navigation Drawer Toggle
 * --------------------------------------------------------------------------
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
 * --------------------------------------------------------------------------
 * 4. Highlights Current Page in Primary Navigation & Drawer
 * --------------------------------------------------------------------------
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
 * --------------------------------------------------------------------------
 * 5. Contact Inquiry Form Logic & Preselection
 * --------------------------------------------------------------------------
 */
function initContactForm() {
  const forms = document.querySelectorAll('#techastra-inquiry-form');
  if (!forms.length) return;

  // Pre-fill service dropdown from URL parameters (e.g. ?service=prophunt or ?service=hms)
  try {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      const lower = serviceParam.toLowerCase();
      forms.forEach(form => {
        const serviceInput = form.querySelector('[name="service"]');
        if (serviceInput) {
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
      });
    }
  } catch (err) {}

  // Create Email Dispatch Modal once in DOM for desktop users
  let modalBackdrop = document.getElementById('email-client-modal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'email-client-modal';
    modalBackdrop.className = 'email-modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.innerHTML = `
      <div class="email-modal-dialog">
        <div class="email-modal-header">
          <div class="email-modal-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>Send Project Inquiry</span>
          </div>
          <button type="button" class="email-modal-close" id="email-modal-close-btn" aria-label="Close dialog">&times;</button>
        </div>
        <div class="email-modal-body">
          <h3 class="email-modal-heading">Choose Your Email Provider</h3>
          <p class="email-modal-sub">Your inquiry is pre-filled. Select an option below to open directly with all fields populated:</p>
          
          <div class="email-providers-list">
            <a href="#" class="email-provider-btn" id="provider-gmail-btn" target="_blank" rel="noopener">
              <div class="email-provider-icon">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path fill="#EA4335" d="M12 12.713L2.4 5.51A2 2 0 0 1 3.6 4.8h16.8a2 2 0 0 1 1.2.71L12 12.713z"/>
                  <path fill="#4285F4" d="M21.6 5.51L12 12.713 2.4 5.51A2 2 0 0 0 2 6.8v10.4a2 2 0 0 0 2 2h2.4V11.2l5.6 4.2 5.6-4.2v8h2.4a2 2 0 0 0 2-2V6.8a2 2 0 0 0-.4-1.29z"/>
                  <path fill="#34A853" d="M4 19.2h2.4v-8L2 7.7v9.5a2 2 0 0 0 2 2z"/>
                  <path fill="#FBBC05" d="M20 19.2a2 2 0 0 0 2-2V7.7l-4.4 3.5v8H20z"/>
                </svg>
              </div>
              <div class="email-provider-details">
                <span class="email-provider-title">Gmail (Web)</span>
                <span class="email-provider-desc">Opens mail.google.com with pre-filled details</span>
              </div>
              <span class="email-provider-arrow">Open &rarr;</span>
            </a>

            <a href="#" class="email-provider-btn" id="provider-outlook-btn" target="_blank" rel="noopener">
              <div class="email-provider-icon">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path fill="#0078D4" d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13z"/>
                  <path fill="#FFFFFF" d="M12 13.5L3.5 7h17L12 13.5z"/>
                </svg>
              </div>
              <div class="email-provider-details">
                <span class="email-provider-title">Outlook / Office 365 (Web)</span>
                <span class="email-provider-desc">Opens Outlook Web compose page</span>
              </div>
              <span class="email-provider-arrow">Open &rarr;</span>
            </a>

            <a href="#" class="email-provider-btn" id="provider-default-btn">
              <div class="email-provider-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <div class="email-provider-details">
                <span class="email-provider-title">Default Mail App</span>
                <span class="email-provider-desc">Windows Mail, Apple Mail, or Desktop Outlook</span>
              </div>
              <span class="email-provider-arrow">Launch &rarr;</span>
            </a>
          </div>

          <div class="email-modal-footer">
            <span>To: <strong>techastrasoftware@gmail.com</strong></span>
            <button type="button" class="email-modal-copy-btn" id="email-modal-copy-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span id="copy-btn-label">Copy Text</span>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);

    // Close handlers
    const closeBtn = document.getElementById('email-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-active');
    }
  }

  let activeInquiryText = '';

  function openModalWithData(toEmail, subject, bodyText) {
    activeInquiryText = bodyText;
    const encodedTo = encodeURIComponent(toEmail);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(activeInquiryText);

    // 1. Gmail Web URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    const gmailBtn = document.getElementById('provider-gmail-btn');
    if (gmailBtn) {
      gmailBtn.href = gmailUrl;
      gmailBtn.onclick = () => {
        setTimeout(closeModal, 400);
      };
    }

    // 2. Outlook Web URL
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    const outlookBtn = document.getElementById('provider-outlook-btn');
    if (outlookBtn) {
      outlookBtn.href = outlookUrl;
      outlookBtn.onclick = () => {
        setTimeout(closeModal, 400);
      };
    }

    // 3. Default Native Mail Client
    const mailtoUrl = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    const defaultBtn = document.getElementById('provider-default-btn');
    if (defaultBtn) {
      defaultBtn.href = mailtoUrl;
      defaultBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = mailtoUrl;
        setTimeout(closeModal, 400);
      };
    }

    // 4. Copy Text Handler
    const copyBtn = document.getElementById('email-modal-copy-btn');
    const copyLabel = document.getElementById('copy-btn-label');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const fullContent = `To: ${toEmail}\nSubject: ${subject}\n\n${activeInquiryText}`;
        navigator.clipboard.writeText(fullContent).then(() => {
          if (copyLabel) copyLabel.textContent = 'Copied!';
          setTimeout(() => {
            if (copyLabel) copyLabel.textContent = 'Copy Text';
          }, 2000);
        }).catch(() => {
          if (copyLabel) copyLabel.textContent = 'Failed';
        });
      };
    }

    modalBackdrop.classList.add('is-active');
  }

  // Bind submit to each form
  forms.forEach(form => {
    const statusMsg = form.querySelector('#form-status-msg') || form.parentElement.querySelector('#form-status-msg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const serviceSelect = form.querySelector('[name="service"]');
      const messageInput = form.querySelector('[name="message"]');

      let isValid = true;
      clearFormErrors(form, statusMsg);

      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) showError(nameInput, 'Please provide your name');
        isValid = false;
      }

      if (!emailInput || !emailInput.value.trim() || !emailInput.value.includes('@')) {
        if (emailInput) showError(emailInput, 'Please provide a valid business email');
        isValid = false;
      }

      if (serviceSelect && !serviceSelect.value) {
        showError(serviceSelect, 'Please select your requirement');
        isValid = false;
      }

      if (!messageInput || !messageInput.value.trim()) {
        if (messageInput) showError(messageInput, 'Please describe your requirements');
        isValid = false;
      }

      if (!isValid) return;

      const toEmail = 'techastrasoftware@gmail.com';
      const serviceValue = serviceSelect ? serviceSelect.value : 'General Technology Consultation';
      const nameValue = nameInput.value.trim();
      const emailValue = emailInput.value.trim();
      const phoneValue = phoneInput && phoneInput.value.trim() ? phoneInput.value.trim() : 'Not specified';
      const messageValue = messageInput.value.trim();

      const subject = `Project Inquiry: ${serviceValue} — ${nameValue}`;
      const bodyFormatted = 
        `Hello TechAstra Software Team,\n\n` +
        `I would like to submit a project inquiry with the following details:\n\n` +
        `• Full Name: ${nameValue}\n` +
        `• Business Email: ${emailValue}\n` +
        `• Phone / WhatsApp: ${phoneValue}\n` +
        `• Selected Requirement: ${serviceValue}\n\n` +
        `Project Brief & Objectives:\n${messageValue}\n\n` +
        `----------------------------------------\n` +
        `Sent via TechAstra Software Website (techastrasoftware.com)`;

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // Direct mobile redirection to Gmail, Outlook, or whatever installed mail app
        const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyFormatted)}`;
        
        if (statusMsg) {
          statusMsg.innerHTML = `
            <div style="color: #10B981; font-weight: 600; padding: 0.85rem; background: rgba(16, 185, 129, 0.12); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center; margin-top: 1rem;">
              ✓ Opening your email app (Gmail / Outlook)... Tap <strong>Send</strong> to deliver your inquiry!
              <div style="margin-top: 0.5rem; font-size: 0.8rem; font-weight: normal; color: var(--text-secondary);">
                Need to open webmail instead? <a href="#" id="mobile-webmail-trigger" style="color: var(--brand-cyan); text-decoration: underline;">Choose Gmail / Outlook Web</a>
              </div>
            </div>
          `;
          statusMsg.style.display = 'block';

          const mobileWebmailTrigger = statusMsg.querySelector('#mobile-webmail-trigger');
          if (mobileWebmailTrigger) {
            mobileWebmailTrigger.onclick = (evt) => {
              evt.preventDefault();
              openModalWithData(toEmail, subject, bodyFormatted);
            };
          }
        }

        setTimeout(() => {
          window.location.href = mailtoUrl;
          form.reset();
        }, 300);
      } else {
        // Desktop: show interactive email provider selector
        if (statusMsg) {
          statusMsg.innerHTML = `
            <div style="color: #10B981; font-weight: 600; padding: 0.75rem; background: rgba(16, 185, 129, 0.12); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center; margin-top: 1rem;">
              ✓ Inquiry ready! Choose your email client to send in one click.
            </div>
          `;
          statusMsg.style.display = 'block';
        }

        openModalWithData(toEmail, subject, bodyFormatted);
        form.reset();
      }
    });
  });

  function showError(inputEl, message) {
    inputEl.style.borderColor = 'var(--color-error)';
    const parent = inputEl.closest('.form-group');
    if (parent) {
      let feedback = parent.querySelector('.form-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback is-invalid';
        parent.appendChild(feedback);
      }
      feedback.textContent = message;
      feedback.style.display = 'block';
    }
  }

  function clearFormErrors(formEl, statusMsg) {
    formEl.querySelectorAll('.form-control').forEach(el => {
      el.style.borderColor = '';
    });
    formEl.querySelectorAll('.form-feedback').forEach(el => {
      el.style.display = 'none';
    });
    if (statusMsg) statusMsg.style.display = 'none';
  }
}

/**
 * --------------------------------------------------------------------------
 * 6. Smooth In-Page Anchor Scrolling
 * --------------------------------------------------------------------------
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 7. Dynamic Copyright Year
 * --------------------------------------------------------------------------
 */
function initDynamicYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
}

/**
 * --------------------------------------------------------------------------
 * 8. Theme Switcher (Solar Astra Light / Deep Space Dark)
 * --------------------------------------------------------------------------
 */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('techastra-theme', theme);
    } catch (e) {}

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#F8FAFC' : '#030712');
    }

    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('title', theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme');
    });

    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // Determine initial state — Day (Light) theme is default
  let currentTheme = 'light';
  try {
    const saved = localStorage.getItem('techastra-theme');
    if (saved === 'dark') {
      currentTheme = 'dark';
    } else if (saved === 'light') {
      currentTheme = 'light';
    }
  } catch (e) {}

  applyTheme(currentTheme);

  // Attach click handlers
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  });
}
