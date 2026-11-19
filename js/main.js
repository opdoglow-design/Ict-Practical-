// main.js
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const THEME_KEY = 'ict-theme';
const PROG_KEY = 'ict-progress';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  $('#themeToggle').textContent = saved === 'dark' ? '🌙' : '☀️';
}
$('#themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  $('#themeToggle').textContent = next === 'dark' ? '🌙' : '☀️';
  toast('Theme: ' + next);
});

// Hamburger
$('#hamburger').addEventListener('click', () => $('#navLinks').classList.toggle('open'));

// Stats
function updateStats() {
  $('#statTopics').textContent = TOPICS.length;
  $('#statLessons').textContent = TOPICS.reduce((a,t)=>a+t.lessons,0);
  $('#statQuestions').textContent = QUIZ.length;
  $('#statCards').textContent = FLASHCARDS.length;
}
updateStats();

// Progress
function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROG_KEY)) || { completed: [], quizBest: 0, studied: 0 }; }
  catch { return { completed: [], quizBest: 0, studied: 0 }; }
}
function setProgress(p) { localStorage.setItem(PROG_KEY, JSON.stringify(p)); updateRing(); }
function updateRing() {
  const p = getProgress();
  const total = TOPICS.length;
  const done = p.completed.length;
  const pct = Math.round((done / total) * 100);
  const circ = 2 * Math.PI * 34;
  $('#ringCircle').setAttribute('stroke-dashoffset', circ * (1 - pct/100));
  $('#ringText').textContent = pct + '%';
}
updateRing();

// Topics grid
function renderTopics(filter='') {
  const grid = $('#topicsGrid');
  const q = filter.toLowerCase();
  const items = TOPICS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q) ||
    t.content.some(c => c.toLowerCase().includes(q))
  );
  grid.innerHTML = items.map(t => `
    <div class="topic-card fade-in" data-id="${t.id}">
      <div class="icon" style="background:${t.color}">${t.icon}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <div class="meta">
        <span>📖 ${t.lessons} lessons</span>
        <span class="chip">${t.level}</span>
      </div>
    </div>
  `).join('');
  $$('.topic-card', grid).forEach(card => {
    card.addEventListener('click', () => openTopic(card.dataset.id));
  });
}
renderTopics();
$('#topicSearch').addEventListener('input', e => renderTopics(e.target.value));

function openTopic(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t) return;
  const p = getProgress();
  const done = p.completed.includes(id);
  $('#modalContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div class="icon" style="background:${t.color};width:52px;height:52px;border-radius:14px;display:grid;place-items:center;font-size:1.5rem;">${t.icon}</div>
      <div>
        <h3 style="margin:0;">${t.title}</h3>
        <p style="color:var(--muted);margin:0;font-size:.9rem;">${t.lessons} lessons · ${t.level}</p>
      </div>
    </div>
    <p style="color:var(--muted);margin-bottom:16px;">${t.desc}</p>
    <ol style="padding-left:20px;display:grid;gap:8px;">
      ${t.content.map((c,i) => `<li style="line-height:1.5;">${c}</li>`).join('')}
    </ol>
    <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" id="markDone">${done ? '✓ Completed' : 'Mark as Completed'}</button>
      <a class="btn btn-ghost" href="quiz.html?topic=${t.id}">Quiz this topic</a>
    </div>
  `;
  $('#modalBackdrop').classList.add('open');
  $('#markDone').addEventListener('click', () => {
    const pr = getProgress();
    if (!pr.completed.includes(id)) { pr.completed.push(id); pr.studied += t.lessons; setProgress(pr); toast('Progress saved!'); }
    $('#markDone').textContent = '✓ Completed';
  });
}
$('#modalClose').addEventListener('click', () => $('#modalBackdrop').classList.remove('open'));
$('#modalBackdrop').addEventListener('click', e => { if (e.target === $('#modalBackdrop')) $('#modalBackdrop').classList.remove('open'); });

// Glossary
function renderGloss(filter='') {
  const list = $('#glossList');
  const q = filter.toLowerCase();
  const items = GLOSSARY.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  list.innerHTML = items.map(g => `
    <div class="gloss-item fade-in">
      <h4>${g.term}</h4>
      <p>${g.def}</p>
    </div>
  `).join('');
}
renderGloss();
$('#glossSearch').addEventListener('input', e => renderGloss(e.target.value));

// Quiz preview
let previewIndex = 0;
function renderPreview() {
  const q = QUIZ[previewIndex % QUIZ.length];
  $('#previewQ').textContent = q.q;
  $('#previewOpts').innerHTML = q.opts.map((o,i) => `<button class="quiz-opt" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('');
  $('#previewFeedback').textContent = '';
  $$('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      $$('.quiz-opt').forEach(b => b.disabled = true);
      if (i === q.ans) { btn.classList.add('correct'); $('#previewFeedback').textContent = '✅ Correct!'; $('#previewFeedback').style.color = 'var(--success)'; }
      else { btn.classList.add('wrong'); $$('.quiz-opt')[q.ans].classList.add('correct'); $('#previewFeedback').textContent = '❌ Answer: ' + q.opts[q.ans]; $('#previewFeedback').style.color = 'var(--danger)'; }
      setTimeout(() => { previewIndex++; renderPreview(); }, 1800);
    });
  });
}
renderPreview();

// Nav active on scroll
const sections = ['home','topics','features','quiz','glossary'];
window.addEventListener('scroll', () => {
  let cur = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) cur = id;
  });
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + cur);
  });
});

// Toast
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// Keyboard shortcut
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $('#modalBackdrop').classList.remove('open');
});
initTheme();
