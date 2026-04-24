// ========= CURTAIN INTRO =========
window.addEventListener('load', () => {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;
  setTimeout(() => curtain.classList.add('closed'), 1600);
  setTimeout(() => curtain.remove(), 3400);
});

// ========= COPY CONTRACT =========
document.querySelectorAll('.btn-copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      btn.textContent = 'Copied!';
      showToast('Contract copied 👑');
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = 'Copy';
      }, 1600);
    } catch {
      showToast('Copy failed — select manually');
    }
  });
});

// ========= TOAST =========
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ========= REVEAL ON SCROLL =========
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ========= HERO SPOTLIGHT FOLLOWS MOUSE =========
const hero = document.getElementById('hero');
if (hero && window.matchMedia('(hover: hover)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
}

// ========= FALLING PETALS =========
const petalsLayer = document.getElementById('petals');
const PETAL_GLYPHS = ['🌹', '🌸', '💮', '❀', '🍓'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function spawnPetal() {
  if (!petalsLayer || reduceMotion) return;
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.textContent = PETAL_GLYPHS[Math.floor(Math.random() * PETAL_GLYPHS.length)];
  const startX = Math.random() * 100;
  const drift = (Math.random() - 0.5) * 240;
  const duration = 8 + Math.random() * 8;
  const size = 14 + Math.random() * 16;
  petal.style.left = `${startX}%`;
  petal.style.fontSize = `${size}px`;
  petal.style.setProperty('--drift', `${drift}px`);
  petal.style.animationDuration = `${duration}s`;
  petalsLayer.appendChild(petal);
  setTimeout(() => petal.remove(), duration * 1000 + 500);
}

if (petalsLayer && !reduceMotion) {
  // Initial burst
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnPetal, i * 400);
  }
  // Steady rain
  setInterval(spawnPetal, 1100);
}

// ========= NUMBER COUNTER =========
const countEls = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const suffix = el.dataset.suffix || '';
      const format = (n) => n.toLocaleString('en-US');

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(Math.floor(target * eased)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = format(target) + suffix;
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
countEls.forEach((el) => countObserver.observe(el));
