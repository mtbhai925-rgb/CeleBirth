/* ============================================
   BIRTHDAY SURPRISE WEBSITE — script.js
   ============================================ */

/* ---------- 1. Footer Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 2. Confetti ---------- */
(function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const COLORS = ['#f5c842','#e8445a','#56cfe1','#b5ead7','#ff7e95','#a78bfa','#fff','#ffb347'];
  const PIECE_COUNT = 120;
  let pieces = [];
  let running = true;

  class Piece {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * -H : -20;
      this.w  = Math.random() * 10 + 6;
      this.h  = Math.random() * 5  + 3;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rot   = Math.random() * Math.PI * 2;
      this.drot  = (Math.random() - 0.5) * 0.12;
      this.dx    = (Math.random() - 0.5) * 1.8;
      this.dy    = Math.random() * 1.4 + 0.7;
      this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
      this.x   += this.dx;
      this.y   += this.dy;
      this.rot += this.drot;
      if (this.y > H + 20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  for (let i = 0; i < PIECE_COUNT; i++) pieces.push(new Piece());

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    pieces.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  loop();

  // Stop confetti after 12 seconds (fade out)
  setTimeout(() => {
    let fade = setInterval(() => {
      pieces.forEach(p => { p.opacity -= 0.008; });
      const allGone = pieces.every(p => p.opacity <= 0);
      if (allGone) { clearInterval(fade); running = false; ctx.clearRect(0, 0, W, H); }
    }, 30);
  }, 12000);

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();

/* ---------- 3. Scroll Reveal (photos + wish cards) ---------- */
(function initReveal() {
  const targets = document.querySelectorAll('.photo-card, .wish-card');

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger each card slightly
        const el = entry.target;
        const delay = Array.from(targets).indexOf(el) * 90;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ---------- 4. Parallax Hero Glow on Mouse Move ---------- */
(function initParallax() {
  const glow = document.querySelector('.hero-glow');
  if (!glow) return;

  document.addEventListener('mousemove', (e) => {
    const xPct = (e.clientX / window.innerWidth  - 0.5) * 40;
    const yPct = (e.clientY / window.innerHeight - 0.5) * 40;
    glow.style.transform = `translate(${xPct}px, ${yPct}px)`;
  });
})();

/* ---------- 5. Photo Card Tilt Effect ---------- */
(function initTilt() {
  const cards = document.querySelectorAll('.photo-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `
        perspective(600px)
        rotateY(${dx * 6}deg)
        rotateX(${-dy * 6}deg)
        scale(1.03)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---------- 6. Balloon Re-trigger on Click ---------- */
(function initBalloonClick() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('balloon')) {
      e.target.style.animation = 'none';
      void e.target.offsetWidth; // reflow
      e.target.style.animation = '';
    }
  });
})();

/* ---------- 7. Smooth scroll for anchor button ---------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ---------- 8. Wish Card stagger on hover ---------- */
(function initWishHover() {
  const cards = document.querySelectorAll('.wish-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
})();
