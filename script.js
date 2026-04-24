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

// ========= LIVE STATS (DexScreener API) =========
const PAIR_ADDRESS = '89QVuyoih5N1Quzu6GoLHbxFc9ZxCnGtwo7QbrFwbcKX';
const STATS_API = `https://api.dexscreener.com/latest/dex/pairs/solana/${PAIR_ADDRESS}`;
const REFRESH_MS = 30_000;

function formatUsd(n) {
  if (n == null || isNaN(n)) return '—';
  const num = Number(n);
  if (num >= 1_000_000_000) return '$' + (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return '$' + (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return '$' + (num / 1_000).toFixed(2) + 'K';
  if (num < 0.0001) return '$' + num.toFixed(9);
  if (num < 0.01) return '$' + num.toFixed(7);
  if (num < 1) return '$' + num.toFixed(5);
  return '$' + num.toFixed(2);
}

function formatNum(n) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('en-US');
}

function setStat(key, value) {
  const el = document.querySelector(`[data-stat="${key}"]`);
  if (!el) return;
  const prev = el.textContent;
  el.textContent = value;
  el.parentElement.classList.remove('loading');
  if (prev !== '—' && prev !== value) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }
}

function setStatChange(key, value) {
  const el = document.querySelector(`[data-stat="${key}"]`);
  if (!el) return;
  const num = Number(value || 0);
  const sign = num >= 0 ? '+' : '';
  el.textContent = `${sign}${num.toFixed(2)}%`;
  el.classList.remove('positive', 'negative');
  el.classList.add(num >= 0 ? 'positive' : 'negative');
  el.parentElement.classList.remove('loading');
}

async function fetchStats() {
  try {
    const res = await fetch(STATS_API, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const pair = data.pair || (Array.isArray(data.pairs) && data.pairs[0]);
    if (!pair) throw new Error('no pair in response');

    const price = parseFloat(pair.priceUsd);
    const change24h = pair.priceChange?.h24;
    const marketCap = pair.marketCap || pair.fdv;
    const volume24h = pair.volume?.h24;
    const liquidity = pair.liquidity?.usd;
    const buys24h = pair.txns?.h24?.buys || 0;
    const sells24h = pair.txns?.h24?.sells || 0;

    setStat('price', formatUsd(price));
    setStatChange('change24h', change24h);
    setStat('marketCap', formatUsd(marketCap));
    setStat('volume24h', formatUsd(volume24h));
    setStat('liquidity', formatUsd(liquidity));
    setStat('txns24h', formatNum(buys24h + sells24h));

    const lu = document.getElementById('last-update');
    if (lu) {
      const now = new Date();
      lu.textContent = `updated ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  } catch (err) {
    console.warn('[stats]', err);
    const lu = document.getElementById('last-update');
    if (lu) lu.textContent = 'retrying…';
  }
}

if (document.getElementById('stats-bar')) {
  fetchStats();
  setInterval(fetchStats, REFRESH_MS);
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
