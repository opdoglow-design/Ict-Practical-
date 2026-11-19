// quiz.js
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

// Topic filter options
const tf = $('#topicFilter');
TOPICS.forEach(t => {
  const o = document.createElement('option');
  o.value = t.id; o.textContent = t.title;
  tf.appendChild(o);
});

// URL param topic
const params = new URLSearchParams(location.search);
if (params.get('topic')) tf.value = params.get('topic');

let questions = [];
function buildQuestions() {
  const topic = tf.value;
  const mode = $('#modeFilter').value;
  let base = topic === 'all' ? [...QUIZ] : QUIZ.filter(q => q.topic === topic);
  if (mode === '10') base = shuffle(base).slice(0, 10);
  if (mode === '5') base = shuffle(base).slice(0, 5);
  questions = base.map((q, i) => ({ ...q, idx: i, chosen: null }));
  render();
}
function shuffle(arr) { return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }

function render() {
  const c = $('#quizContainer');
  if (!questions.length) { c.innerHTML = '<p style="text-align:center;color:var(--muted);">No questions for this selection.</p>'; return; }
  c.innerHTML = questions.map((q, i) => `
    <div class="topic-card" style="margin-bottom:14px;" data-qi="${i}">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span class="chip">Q${i+1}</span>
        <span class="chip">${TOPICS.find(t=>t.id===q.topic)?.title || q.topic}</span>
      </div>
      <div style="font-weight:600;margin-bottom:12px;">${q.q}</div>
      <div style="display:grid;gap:8px;">
        ${q.opts.map((o,j) => `
          <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--card-2);border:1px solid var(--border);cursor:pointer;">
            <input type="radio" name="q${i}" value="${j}" ${q.chosen===j?'checked':''} />
            <span>${String.fromCharCode(65+j)}. ${o}</span>
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
}

tf.addEventListener('change', buildQuestions);
$('#modeFilter').addEventListener('change', buildQuestions);

$('#submitQuiz').addEventListener('click', () => {
  if (!questions.length) return;
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
  // save best
  try {
    const p = JSON.parse(localStorage.getItem('ict-progress')) || { completed:[], quizBest:0, studied:0 };
    if (score > (p.quizBest||0)) { p.quizBest = score; localStorage.setItem('ict-progress', JSON.stringify(p)); }
  } catch {}
  $('#reviewList').innerHTML = review.map(r => `
    <div style="padding:12px;border-radius:10px;background:var(--card-2);border:1px solid ${r.correct?'var(--success)':'var(--danger)'};">
      <div style="font-weight:600;margin-bottom:6px;">Q${r.i+1}. ${r.q.q}</div>
      <div style="font-size:.9rem;color:var(--muted);">Your answer: ${r.q.chosen===null?'—':r.q.opts[r.q.chosen]} ${r.correct?'✅':'❌'}</div>
      ${!r.correct ? `<div style="font-size:.9rem;color:var(--success);">Correct: ${r.q.opts[r.q.ans]}</div>` : ''}
    </div>
  `).join('');
  window.scrollTo({ top: $('#resultBox').offsetTop - 80, behavior: 'smooth' });
});

$('#resetQuiz').addEventListener('click', () => {
  questions.forEach(q => q.chosen = null);
  render();
  $('#resultBox').classList.add('hidden');
});

buildQuestions();
