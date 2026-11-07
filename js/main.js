/* ==========================================================
   DevFox website scripts
   ========================================================== */

/* ----------------------------------------------------------
   EmailJS settings
   Create these three values at https://dashboard.emailjs.com
     - Public Key  : Account > General
     - Service ID  : Email Services > (your Gmail service)
     - Template ID : Email Templates > (your template)
   See README.md for the exact template setup.
---------------------------------------------------------- */
const EMAILJS_CONFIG = {
  publicKey:  '06YcrfoY50mYIcAuz',
  serviceId:  'service_8wsjl6q',
  templateId: 'template_apc6snp',
};

// Shown to visitors if sending fails
const FALLBACK_EMAIL = 'pinfo4891@gmail.com';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: border once the page scrolls ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Highlight the current section in the nav ---------- */
  const navLinks = [...nav.querySelectorAll('a:not(.nav-cta)')];
  const sections = [...document.querySelectorAll('main > section[id]')];

  const markActive = () => {
    const y = window.scrollY + 140;
    let current = null;
    sections.forEach((section) => { if (section.offsetTop <= y) current = section.id; });
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  };
  markActive();
  window.addEventListener('scroll', markActive, { passive: true });

  /* ---------- Contact form (EmailJS) ---------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  if (!form) return;

  const btnLabel = submitBtn.querySelector('.btn-label');
  const defaultLabel = btnLabel.textContent;

  const showStatus = (type, html) => {
    statusEl.className = `form-status is-${type}`;
    statusEl.innerHTML = html;
    statusEl.hidden = false;
  };

  const setSending = (sending) => {
    submitBtn.disabled = sending;
    btnLabel.textContent = sending ? 'Sending…' : defaultLabel;
    const existing = submitBtn.querySelector('.spinner');
    if (sending && !existing) {
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.setAttribute('aria-hidden', 'true');
      submitBtn.prepend(spinner);
    } else if (!sending && existing) {
      existing.remove();
    }
  };

  const isConfigured = () =>
    Object.values(EMAILJS_CONFIG).every((v) => v && !v.startsWith('YOUR_'));

  const failureMessage =
    `Sorry, your message could not be sent. Please email us directly at ` +
    `<a href="mailto:${FALLBACK_EMAIL}">${FALLBACK_EMAIL}</a>.`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.hidden = true;

    // Spam trap: bots fill hidden fields, people never see it
    if (form.elements.website && form.elements.website.value) return;

    if (!window.emailjs || !isConfigured()) {
      console.error(
        '[DevFox] EmailJS is not set up. Add your Public Key, Service ID and ' +
        'Template ID to EMAILJS_CONFIG at the top of js/main.js.'
      );
      showStatus('error', failureMessage);
      return;
    }

    setSending(true);
    try {
      await window.emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        form,
        { publicKey: EMAILJS_CONFIG.publicKey }
      );
      form.reset();
      showStatus('success', 'Thank you. Your message has been sent and we will reply within 24 hours.');
    } catch (err) {
      console.error('[DevFox] EmailJS error:', err);
      showStatus('error', failureMessage);
    } finally {
      setSending(false);
    }
  });
});
