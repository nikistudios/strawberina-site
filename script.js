// ========= QUIZ: WHICH STRAWBERINA ARE YOU? =========
const QUIZ_QUESTIONS = [
  {
    q: "It's Friday night. You are:",
    a: [
      { t: "Smoking, vibing, time isn't real", i: "stoner" },
      { t: "Studying for an exam nobody assigned", i: "nerd" },
      { t: "Posing in the mirror for an hour", i: "sexy" },
      { t: "Dancing on a yacht someone else paid for", i: "rich" },
    ]
  },
  {
    q: "Your relationship with money:",
    a: [
      { t: "What money? Vibes are free.", i: "broke" },
      { t: "Daddy's credit card has no limit", i: "rich" },
      { t: "I'd take yours and you'd thank me", i: "savage" },
      { t: "I'll trade you anything for a bag", i: "stoner" },
    ]
  },
  {
    q: "Your superpower is:",
    a: [
      { t: "Calculating tip in 0.2 seconds", i: "nerd" },
      { t: "Making the entire room nervous", i: "sexy" },
      { t: "Survival instincts of a feral cat", i: "broke" },
      { t: "People are scared to look at me", i: "savage" },
    ]
  },
  {
    q: "Your morning routine:",
    a: [
      { t: "Wake and bake. Coffee is for losers.", i: "stoner" },
      { t: "Read three chapters before sunrise", i: "nerd" },
      { t: "Selfies, perfume, lip gloss, cry", i: "sexy" },
      { t: "Champagne, four phone calls, private jet", i: "rich" },
    ]
  },
  {
    q: "Your villain origin story:",
    a: [
      { t: "They told me to 'go back to school'", i: "nerd" },
      { t: "They mocked my outfit (it was a Kmart fit)", i: "broke" },
      { t: "They tried to play me. Once.", i: "savage" },
      { t: "They said they could 'fix' me", i: "stoner" },
    ]
  }
];

const STRAWBERINA_VARIANTS = {
  stoner:      { fullName: "Stoner Strawberina",     emoji: "🚬", img: "images/variants/stoner.png",      desc: "Permanently in the cloud. Lipton is mid — pass the bowl. You think the FYP is a religion and the algorithm is your god." },
  nerd:        { fullName: "Nerd Strawberina",       emoji: "🤓", img: "images/variants/nerd.png",        desc: "4.0 GPA in brainrot studies. Reads the whitepaper twice. Will explain the candle pattern to you, unsolicited." },
  sexy:        { fullName: "Sexy Strawberina",       emoji: "💋", img: "images/variants/sexy.png",        desc: "Walks slow because the camera needs to keep up. You don't slide into DMs — DMs slide into you." },
  broke:       { fullName: "Broke Strawberina",      emoji: "🥲", img: "images/variants/broke.png",       desc: "Three coins to your name and they're all $STRAWBERINA. Noodles for dinner, big dreams for dessert. Holding forever." },
  rich:        { fullName: "Rich Strawberina",       emoji: "💅", img: "images/variants/rich.png",        desc: "Bought the dip with daddy's allowance. Champagne for breakfast. The valet knows your name and your zodiac." },
  savage:      { fullName: "Savage Strawberina",     emoji: "😈", img: "images/variants/savage.png",      desc: "Doesn't text first. Doesn't text second. Has receipts, screenshots, and a plan. Don't test the queen." },
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
    let winner = 'sexy';
    let max = -1;
    Object.entries(scores).forEach(([name, score]) => {
      if (score > max) { winner = name; max = score; }
    });

    const variant = STRAWBERINA_VARIANTS[winner];
    resultName.textContent = variant.fullName;
    resultDesc.textContent = variant.desc;

    resultEmoji.textContent = variant.emoji;
    if (variant.img) {
      const probe = new Image();
      probe.onload = () => {
        resultImg.src = variant.img;
        resultImg.alt = variant.fullName;
        resultImg.style.display = 'block';
        resultEmoji.style.display = 'none';
      };
      probe.onerror = () => {
        resultImg.style.display = 'none';
        resultEmoji.style.display = 'block';
      };
      probe.src = variant.img;
    } else {
      resultImg.style.display = 'none';
      resultEmoji.style.display = 'block';
    }

    const variantTitle = variant.fullName.replace('Strawberina', '$Strawberina');
    const url = encodeURIComponent(`${window.location.origin}/#quiz`);
    const text = encodeURIComponent(`I got ${variantTitle} ${variant.emoji}\nWhich $Strawberina are you?`);
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

// ========= COPY CONTRACT =========
document.querySelectorAll('.btn-copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      btn.textContent = 'Copied!';
      showToast('Contract copied 🍓');
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
