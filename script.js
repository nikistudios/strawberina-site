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

// ========= COURTIER IMAGE FALLBACK =========
document.querySelectorAll('.courtier-face img').forEach((img) => {
  img.addEventListener('error', () => {
    const parent = img.parentElement;
    if (!parent) return;
    const emoji = parent.dataset.emoji || '🍓';
    img.remove();
    parent.textContent = emoji;
  });
});

// ========= QUIZ: WHICH ISLANDER ARE YOU? =========
const QUIZ_QUESTIONS = [
  {
    q: "It's 2am in the villa. Where are you?",
    a: [
      { t: "Whispering secrets in the kitchen with my favorite", i: "Kiwilo" },
      { t: "Crying in the closet — nobody knows yet", i: "Orangelo" },
      { t: "Starting chaos in the bedroom, loudly", i: "Pinapina" },
      { t: "Asleep. Beauty sleep > drama.", i: "Strawberina" },
    ]
  },
  {
    q: "What's your red flag in love?",
    a: [
      { t: "I'm always 'just friends' with multiple people", i: "Watermelina" },
      { t: "I overthink every text for six hours", i: "Orangelo" },
      { t: "I keep receipts on EVERYTHING", i: "Mangella" },
      { t: "I leave you on read if you're boring", i: "Coconick" },
    ]
  },
  {
    q: "Pick your villa uniform:",
    a: [
      { t: "Red dress, black heels, main character forever", i: "Strawberina" },
      { t: "Bikini, tan, salt-water hair", i: "Coconick" },
      { t: "A matching set I designed myself", i: "Mangella" },
      { t: "Loud print. Bigger energy.", i: "Pinapina" },
    ]
  },
  {
    q: "Your love language is:",
    a: [
      { t: "Words of affirmation (and mild stalking)", i: "Orangelo" },
      { t: "Quality time (preferably in the hot tub)", i: "Kiwilo" },
      { t: "Gift giving — I made it just for you", i: "Mangella" },
      { t: "Physical touch (I bite, sometimes)", i: "Bananito" },
    ]
  },
  {
    q: "You get dumped from the villa. How do you leave?",
    a: [
      { t: "Sobbing monologue. Iconic exit. Camera zooms.", i: "Orangelo" },
      { t: "Middle finger. No tears. Gone in 60 seconds.", i: "Pinapina" },
      { t: "Quiet goodbye. Mom tears. Everyone cries with me.", i: "Cherrita" },
      { t: "I'll be back in seven days. Plot loading.", i: "Bananito" },
    ]
  }
];

const ISLANDERS = {
  Bananito:    { emoji: "🍌", img: "images/islanders/bananito.png",    desc: "You're Bananito — the dramatic underdog with plot armor. Dumped, but never forgotten. You'll be back in seven days with a vengeance." },
  Watermelina: { emoji: "🍉", img: "images/islanders/watermelina.png", desc: "You're Watermelina — the center of every love triangle and every group chat. Chaos is your love language. The villa doesn't run without you." },
  Mangella:    { emoji: "🥭", img: "images/islanders/mangella.png",    desc: "You're Mangella — creative, composed, always perfectly dressed. You design the villa's vibe, its outfits, and occasionally its drama." },
  Kiwilo:      { emoji: "🥝", img: "images/islanders/kiwilo.png",      desc: "You're Kiwilo — the soft romantic with the hospitality smile. Everyone catches feelings around you. You catch flights." },
  Orangelo:    { emoji: "🍊", img: "images/islanders/orangelo.png",    desc: "You're Orangelo — the emotional one who said the quiet part loud. Confessed. Got dumped. Became a legend. Heart on sleeve, sleeve on fire." },
  Coconick:    { emoji: "🥥", img: "images/islanders/coconick.png",    desc: "You're Coconick — laidback Aussie energy with a punch in reserve. You surf villas, vibes, and the occasional confrontation." },
  Pinapina:    { emoji: "🍍", img: "images/islanders/pinapina.png",    desc: "You're Pinapina — NYC energy in a fruit bowl. Loud, iconic, zero filter, maximum main character. The villa is lucky to have you." },
  Cherrita:    { emoji: "🍒", img: "images/islanders/cherrita.png",    desc: "You're Cherrita — the villa mom. Wise, warm, wouldn't hurt a fly. Left in episode 12 and broke everyone's heart. Still the blueprint." },
  Strawberina: { emoji: "🍓", img: "images/islanders/strawberina.png", desc: "You're Strawberina herself — the red-dressed diva, the queen of the FYP, the main character of brainrot. Long may you scroll, your majesty." },
};

(function initQuiz() {
  const card = document.getElementById('quiz-card');
  if (!card) return;

  const screens = {
    intro: card.querySelector('[data-screen="intro"]'),
    question: card.querySelector('[data-screen="question"]'),
    result: card.querySelector('[data-screen="result"]'),
  };
  const questionText = document.getElementById('quiz-question-text');
  const answersBox = document.getElementById('quiz-answers');
  const progressFill = document.getElementById('quiz-progress-fill');
  const stepNum = document.getElementById('quiz-step-num');
  const resultEmoji = document.getElementById('quiz-result-emoji');
  const resultImg = document.getElementById('quiz-result-img');
  const resultName = document.getElementById('quiz-result-name');
  const resultDesc = document.getElementById('quiz-result-desc');
  const shareBtn = document.getElementById('quiz-share');

  let step = 0;
  const scores = {};

  function show(name) {
    Object.entries(screens).forEach(([k, el]) => el.classList.toggle('hidden', k !== name));
  }

  function renderQuestion() {
    const q = QUIZ_QUESTIONS[step];
    questionText.textContent = q.q;
    stepNum.textContent = step + 1;
    progressFill.style.width = `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%`;
    answersBox.innerHTML = '';

    q.a.forEach((ans) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-answer';
      btn.type = 'button';
      btn.textContent = ans.t;
      btn.addEventListener('click', () => {
        btn.classList.add('selected');
        scores[ans.i] = (scores[ans.i] || 0) + 1;
        setTimeout(() => {
          step++;
          if (step < QUIZ_QUESTIONS.length) {
            renderQuestion();
          } else {
            renderResult();
          }
        }, 260);
      });
      answersBox.appendChild(btn);
    });
  }

  function renderResult() {
    let winner = 'Strawberina';
    let max = -1;
    Object.entries(scores).forEach(([name, score]) => {
      if (score > max) { winner = name; max = score; }
    });

    const islander = ISLANDERS[winner];
    resultName.textContent = winner;
    resultDesc.textContent = islander.desc;

    // Prefer image; gracefully fall back to emoji if it fails to load
    resultEmoji.textContent = islander.emoji;
    if (islander.img) {
      const probe = new Image();
      probe.onload = () => {
        resultImg.src = islander.img;
        resultImg.alt = winner;
        resultImg.style.display = 'block';
        resultEmoji.style.display = 'none';
      };
      probe.onerror = () => {
        resultImg.style.display = 'none';
        resultEmoji.style.display = 'block';
      };
      probe.src = islander.img;
    } else {
      resultImg.style.display = 'none';
      resultEmoji.style.display = 'block';
    }

    const slug = winner.toLowerCase();
    const url = encodeURIComponent(`${window.location.origin}/result/${slug}.html`);
    const text = encodeURIComponent(`I got ${winner} ${islander.emoji}\nWhich one are you?`);
    shareBtn.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

    show('result');
  }

  document.getElementById('quiz-start').addEventListener('click', () => {
    step = 0;
    Object.keys(scores).forEach((k) => delete scores[k]);
    renderQuestion();
    show('question');
  });

  document.getElementById('quiz-restart').addEventListener('click', () => {
    step = 0;
    Object.keys(scores).forEach((k) => delete scores[k]);
    show('intro');
  });
})();

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
