// main.js — full functionality
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
if (cursor && follower) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.2 });
  });
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      gsap.to(btn, { x: x*0.3, y: y*0.3, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.4 }));
  });
}

// ---- MOBILE MENU ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---- SCROLL REVEALS ----
function initScrollReveals() {
  gsap.utils.toArray('.reveal-fade').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  gsap.utils.toArray('.reveal-card').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(0.4)', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });
  gsap.utils.toArray('.reveal-text .line-wrap').forEach(wrap => {
    const line = wrap.querySelector('.hero-line, .line-content');
    if (line) {
      gsap.set(line, { y: '110%' });
      gsap.to(line, { y: '0%', duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: wrap, start: 'top 85%' } });
    }
  });
}

// ---- HERO ANIMATIONS ----
function initHeroAnimations() {
  const heroLines = document.querySelectorAll('.hero .hero-line, .hero .hero-name');
  if (heroLines.length) {
    gsap.set(heroLines, { y: '110%' });
    gsap.to(heroLines, { y: '0%', duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.3 });
  }
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCta = document.querySelector('.hero-cta');
  const heroStats = document.querySelector('.hero-stats');
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroEyebrow) gsap.to(heroEyebrow, { opacity: 1, duration: 0.6, delay: 0.4 });
  if (heroSubtitle) gsap.to(heroSubtitle, { opacity: 1, y: 0, duration: 0.6, delay: 0.6 });
  if (heroCta) gsap.to(heroCta, { opacity: 1, y: 0, duration: 0.6, delay: 0.8 });
  if (heroStats) gsap.to(heroStats, { opacity: 1, y: 0, duration: 0.6, delay: 1 });
  if (heroScroll) gsap.to(heroScroll, { opacity: 1, duration: 0.6, delay: 1.2 });
}

// ---- TYPING EFFECT ----
function initTypingEffect() {
  const terminalEl = document.getElementById('terminalText');
  if (!terminalEl) return;
  const phrases = ['$ developer_ready', '$ instructor_mode', '$ building_future'];
  let idx = 0, charIdx = 0, isDeleting = false;
  function type() {
    const current = phrases[idx];
    if (isDeleting) {
      terminalEl.textContent = current.substring(0, charIdx-1);
      charIdx--;
      if (charIdx === 0) { isDeleting = false; idx = (idx+1)%phrases.length; setTimeout(type, 500); }
      else setTimeout(type, 50);
    } else {
      terminalEl.textContent = current.substring(0, charIdx+1);
      charIdx++;
      if (charIdx === current.length) { isDeleting = true; setTimeout(type, 2000); }
      else setTimeout(type, 100);
    }
  }
  type();
}

// ---- STATS COUNTER ----
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;
  const animateNumber = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const increment = target / 50;
    const update = () => {
      current += increment;
      if (current < target) { el.innerText = Math.floor(current); requestAnimationFrame(update); }
      else el.innerText = target;
    };
    update();
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { animateNumber(entry.target); observer.unobserve(entry.target); } });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => observer.observe(el));
}

// ---- SKILL BARS ----
function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill');
  fills.forEach(fill => {
    const width = fill.style.width;
    if (width) {
      fill.style.width = '0%';
      ScrollTrigger.create({ trigger: fill.closest('.skill-bar-item'), start: 'top 85%', onEnter: () => { fill.style.width = width; }, once: true });
    }
  });
}

// ---- CONTACT FORM ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successDiv = document.getElementById('formSuccess');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      successDiv.style.display = 'block';
      form.reset();
      setTimeout(() => { successDiv.style.display = 'none'; }, 5000);
    }, 1500);
  });
}

// ---- BARBA PAGE TRANSITIONS ----
let particleCleanup = null;
function initParticlesGlobal() {
  if (typeof initParticles === 'function') {
    if (particleCleanup) particleCleanup();
    particleCleanup = initParticles();
  }
}
function initBarba() {
  if (typeof barba === 'undefined') return;
  barba.init({
    transitions: [{
      name: 'page-transition',
      once() { initAll(); },
      leave(data) {
        const lines = document.querySelectorAll('.transition-lines span');
        return gsap.to(lines, { scaleY: 1, duration: 0.5, stagger: 0.05, ease: 'power2.in', transformOrigin: 'top' });
      },
      enter(data) {
        const lines = document.querySelectorAll('.transition-lines span');
        gsap.set(lines, { scaleY: 1 });
        return gsap.to(lines, { scaleY: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', transformOrigin: 'bottom', onComplete: () => initAll() });
      }
    }]
  });
}
function initAll() {
  initScrollReveals();
  initHeroAnimations();
  initTypingEffect();
  initStatsCounter();
  initSkillBars();
  initContactForm();
  initParticlesGlobal();
  // Re-attach magnetic listeners
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.removeEventListener('mousemove', btn._mousemove);
    btn.removeEventListener('mouseleave', btn._mouseleave);
  });
  document.querySelectorAll('.magnetic').forEach(btn => {
    const moveHandler = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      gsap.to(btn, { x: x*0.3, y: y*0.3, duration: 0.3 });
    };
    const leaveHandler = () => gsap.to(btn, { x: 0, y: 0, duration: 0.4 });
    btn.addEventListener('mousemove', moveHandler);
    btn.addEventListener('mouseleave', leaveHandler);
    btn._mousemove = moveHandler;
    btn._mouseleave = leaveHandler;
  });
}

// ---- NAVBAR SCROLL ----
function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
}

// ---- INITIALIZE ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initBarba();
  if (typeof barba === 'undefined') initAll();
});
window.addEventListener('resize', () => {
  if (particleCleanup) { particleCleanup(); particleCleanup = initParticles(); }
});