/* ═══════════════════════════════════════════
   ALLIANCE TO ZERO — main.js
   ═══════════════════════════════════════════ */

// ─── Navigation ───────────────────────────
const header    = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ─── Scroll fade-in animations ───────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll(
  '.feature-card, .member-card, .resource-card, .news-card, .roadmap__item, .person-card, .logo-item'
).forEach(el => { el.classList.add('fade-up'); observer.observe(el); });

// ─── Company logo image fallbacks ─────────
function logoError(img) {
  img.onerror = null;
  img.style.display = 'none';
  const fallback = img.nextElementSibling;
  if (fallback) fallback.style.display = 'flex';
}

// ─── Team photo image fallbacks ───────────
function avatarError(img) {
  img.onerror = null;
  img.style.display = 'none';
  const initials = img.nextElementSibling;
  if (initials) initials.style.display = 'flex';
}

// ─── Download Gate Modal ──────────────────
const modalOverlay   = document.getElementById('modal-overlay');
const modalClose     = document.getElementById('modal-close');
const gateForm       = document.getElementById('gate-form');
const formState      = document.getElementById('modal-form-state');
const successState   = document.getElementById('modal-success-state');
const resourceName   = document.getElementById('modal-resource-name');
const successDesc    = document.getElementById('modal-success-desc');
const downloadLink   = document.getElementById('modal-download-link');
const successClose   = document.getElementById('modal-success-close');
let   lastFocus      = null;

function openModal(title, url) {
  lastFocus = document.activeElement;
  resourceName.textContent = title;
  modalOverlay.dataset.pdfUrl = url;
  formState.hidden      = false;
  successState.hidden   = true;
  gateForm.reset();
  clearErrors();
  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => gateForm.querySelector('input')?.focus(), 60);
}

function closeModal() {
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
  lastFocus?.focus();
}

function clearErrors() {
  gateForm.querySelectorAll('input').forEach(i => i.setCustomValidity(''));
}

// Trigger buttons
document.querySelectorAll('.js-download-trigger').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.title, btn.dataset.url));
});

// Close events
modalClose.addEventListener('click', closeModal);
successClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeModal();
});

// Form submit → reveal download
gateForm.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();
  if (!gateForm.checkValidity()) { gateForm.reportValidity(); return; }

  const pdfUrl = modalOverlay.dataset.pdfUrl || '#';
  const title  = resourceName.textContent;

  formState.hidden    = true;
  successState.hidden = false;
  successDesc.textContent = title;
  downloadLink.href   = pdfUrl;
  downloadLink.setAttribute('download', title);

  // Auto-trigger download if real URL (not placeholder)
  if (pdfUrl !== '#' && !pdfUrl.endsWith('/#')) {
    setTimeout(() => downloadLink.click(), 350);
  }
});
