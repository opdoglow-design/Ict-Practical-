// quiz.js - Enhanced
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const THEME_KEY = 'ict-theme';
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = $('#themeToggle');
  if (btn) { btn.textContent = saved === 'dark' ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      btn.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }
}
initTheme();

// Nav drawer
const navLinks = document.querySelector('.nav-links');
const backdrop = document.getElementById('navBackdrop');
const hamburger = document.getElementById('hamburger');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  backdrop?.classList.toggle('open', open);
  if (hamburger) hamburger.textContent = open ? '✕' : '☰';
});
function closeNav(){ navLinks.classList.remove('open'); backdrop?.classList.remove('open'); if (hamburger) hamburger.textContent = '☰'; }
backdrop?.addEventListener('click', closeNav);
navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeNav));
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });
document.querySelectorAll('.dropdown').forEach(dd => {
  if (dd.querySelector('a.active')) dd.querySelector('.dropdown-toggle')?.classList.add('active');
});
document.querySelectorAll('.dropdown-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const dd = btn.closest('.dropdown');
    document.querySelectorAll('.dropdown').forEach(d => { if (d !== dd) d.classList.remove('open'); });
    dd.classList.toggle('open');
  });
});
document.addEventListener('click', () => document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open')));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

// Assign difficulty by index
QUIZ.forEach((q, i) => {
  q.difficulty = i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard';
});

// Topic filter
const tf = $('#topicFilter');
TOPICS.forEach(t => {
  const o = document.createElement('option');
  o.value = t.id; o.textContent = t.title;
  tf.appendChild(o);
});
const params = new URLSearchParams(location.search);
if (params.get('topic') && [...tf.options].some(o=>o.value===params.get('topic'))) tf.value = params.get('topic');

const diffFilter = $('#diffFilter');
const modeFilter = $('#modeFilter');
const shuffleQ = $('#shuffleQ');
const shuffleO = $('#shuffleO');
const timerOn = $('#timerOn');

let questions = [];
let timerInterval = null;
let timeLeft = 30;

function shuffle(arr) { return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }

function buildQuestions() {
  const topic = tf.value;
  const diff = diffFilter.value;
  const mode = modeFilter.value;
  let base = topic === 'all' ? [...QUIZ] : QUIZ.filter(q => q.topic === topic);
  if (diff !== 'all') base = base.filter(q => q.difficulty === diff);
  if (mode === '10') base = shuffle(base).slice(0, 10);
  if (mode === '5') base = shuffle(base).slice(0, 5);
  if (shuffleQ.checked) base = shuffle(base);
  questions = base.map((q, i) => {
    let opts = q.opts.map((o, j) => ({ text: o, orig: j }));
    if (shuffleO.checked) opts = shuffle(opts);
    return { ...q, idx: i, chosen: null, opts, ansOrig: q.ans };
  });
  // remap answer index after shuffle
  questions.forEach(q => {
    q.ans = q.opts.findIndex(o => o.orig === q.ansOrig);
  });
  render();
  updateHistory();
  clearTimer();
}

function render() {
  const c = $('#quizContainer');
  if (!questions.length) { c.innerHTML = '<p style="text-align:center;color:var(--muted);">No questions for this selection.</p>'; return; }
  c.innerHTML = questions.map((q, i) => `
    <div class="topic-card" style="margin-bottom:14px;" data-qi="${i}">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
        <span class="chip">Q${i+1} / ${questions.length}</span>
        <span class="chip">${TOPICS.find(t=>t.id===q.topic)?.title || q.topic}</span>
        <span class="chip">${q.difficulty}</span>
      </div>
      ${timerOn.checked ? `<div style="font-size:.8rem;color:var(--muted);margin-bottom:6px;">⏱️ <span class="qtimer" data-qi="${i}">30</span>s</div>` : ''}
      <div style="font-weight:600;margin-bottom:12px;">${q.q}</div>
      <div style="display:grid;gap:8px;">
        ${q.opts.map((o,j) => `
          <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--card-2);border:1px solid var(--border);cursor:pointer;">
            <input type="radio" name="q${i}" value="${j}" ${q.chosen===j?'checked':''} />
            <span>${String.fromCharCode(65+j)}. ${o.text}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
  $$('input[type=radio]').forEach(r => {
    r.addEventListener('change', e => {
      const qi = +e.target.name.replace('q','');
      questions[qi].chosen = +e.target.value;
    });
  });
  if (timerOn.checked) startTimers();
}

function startTimers() {
  clearTimer();
  questions.forEach(q => { q.timeLeft = 30; });
  timerInterval = setInterval(() => {
    let any = false;
    questions.forEach((q, i) => {
      if (q.chosen !== null) return;
      if (q.timeLeft > 0) {
        q.timeLeft--;
        const el = document.querySelector(`.qtimer[data-qi="${i}"]`);
        if (el) el.textContent = q.timeLeft;
        any = true;
      } else {
        const card = document.querySelector(`[data-qi="${i}"]`);
        if (card && !card.classList.contains('timesup')) {
          card.classList.add('timesup');
          card.querySelectorAll('input').forEach(inp => inp.disabled = true);
          const el = card.querySelector('.qtimer');
          if (el) el.textContent = '0';
        }
      }
    });
    if (!any) clearTimer();
  }, 1000);
}
function clearTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

tf.addEventListener('change', buildQuestions);
diffFilter.addEventListener('change', buildQuestions);
modeFilter.addEventListener('change', buildQuestions);
shuffleQ.addEventListener('change', buildQuestions);
shuffleO.addEventListener('change', buildQuestions);
timerOn.addEventListener('change', buildQuestions);

$('#submitQuiz').addEventListener('click', () => {
  if (!questions.length) return;
  clearTimer();
  let score = 0;
  const review = [];
  questions.forEach((q, i) => {
    const correct = q.chosen === q.ans;
    if (correct) score++;
    review.push({ i, q, correct });
  });
  const pct = Math.round(score / questions.length * 100);
  $('#resultBox').classList.remove('hidden');
  $('#resultTitle').textContent = pct >= 80 ? '🏆 Excellent!' : pct >= 50 ? '👍 Good job!' : '📚 Keep practicing!';
  $('#resultScore').textContent = `${score}/${questions.length} (${pct}%)`;
  $('#resultMsg').textContent = pct >= 80 ? 'You have a strong grasp of ICT.' : 'Review the topics and try again.';
  // save best + history
  try {
    const p = JSON.parse(localStorage.getItem('ict-progress')) || { completed:[], quizBest:0, studied:0, history:[] };
    if (score > (p.quizBest||0)) p.quizBest = score;
    p.history = p.history || [];
    p.history.unshift({ score, total: questions.length, date: new Date().toLocaleDateString() });
    p.history = p.history.slice(0, 5);
    localStorage.setItem('ict-progress', JSON.stringify(p));
  } catch {}
  $('#reviewList').innerHTML = review.map(r => `
    <div style="padding:12px;border-radius:10px;background:var(--card-2);border:1px solid ${r.correct?'var(--success)':'var(--danger)'};">
      <div style="font-weight:600;margin-bottom:6px;">Q${r.i+1}. ${r.q.q}</div>
      <div style="font-size:.9rem;color:var(--muted);">Your answer: ${r.q.chosen===null?'—':r.q.opts[r.q.chosen].text} ${r.correct?'✅':'❌'}</div>
      ${!r.correct ? `<div style="font-size:.9rem;color:var(--success);">Correct: ${r.q.opts[r.q.ans].text}</div>` : ''}
    </div>
  `).join('');
  window.scrollTo({ top: $('#resultBox').offsetTop - 80, behavior: 'smooth' });
  updateHistory();
});

$('#resetQuiz').addEventListener('click', () => {
  questions.forEach(q => q.chosen = null);
  render();
  $('#resultBox').classList.add('hidden');
});

function updateHistory() {
  const box = $('#historyBox'); if (!box) return;
  try {
    const p = JSON.parse(localStorage.getItem('ict-progress')) || { history:[] };
    const h = p.history || [];
    if (!h.length) { box.textContent = ''; return; }
    box.innerHTML = 'Recent: ' + h.map(x=>`${x.score}/${x.total} (${x.date})`).join(' · ');
  } catch { box.textContent = ''; }
}

buildQuestions();