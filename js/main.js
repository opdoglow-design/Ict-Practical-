// main.js - Clean & Simple
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const THEME_KEY = 'ict-theme';
const PROG_KEY = 'ict-progress';

// ---------- Theme ----------
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = $('#themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '🌙' : '☀️';
}
initTheme();
$('#themeToggle')?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  $('#themeToggle').textContent = next === 'dark' ? '🌙' : '☀️';
  toast('Theme: ' + next);
});

// ---------- Nav drawer ----------
const navLinks = $('#navLinks');
const backdrop = $('#navBackdrop');
const hamburger = $('#hamburger');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  backdrop?.classList.toggle('open', open);
  if (hamburger) hamburger.textContent = open ? '✕' : '☰';
});
function closeNav() { navLinks?.classList.remove('open'); backdrop?.classList.remove('open'); if (hamburger) hamburger.textContent = '☰'; }
backdrop?.addEventListener('click', closeNav);
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// ---------- Dropdowns ----------
$$('.dropdown-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const dd = btn.closest('.dropdown');
    $$('.dropdown').forEach(d => { if (d !== dd) d.classList.remove('open'); });
    dd.classList.toggle('open');
  });
});
document.addEventListener('click', () => $$('.dropdown').forEach(d => d.classList.remove('open')));

// ---------- Nav enhancements ----------
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });
$$('.dropdown').forEach(dd => {
  if (dd.querySelector('a.active')) dd.querySelector('.dropdown-toggle')?.classList.add('active');
});

// ---------- Storage ----------
function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROG_KEY)) || { completed: [] }; }
  catch { return { completed: [] }; }
}
function setProgress(p) { localStorage.setItem(PROG_KEY, JSON.stringify(p)); }

// ---------- Stats ----------
function updateStats() {
  const lessons = TOPICS.reduce((a,t)=>a+t.lessons,0);
  $('#statTopics') && ($('#statTopics').textContent = TOPICS.length);
  $('#statLessons') && ($('#statLessons').textContent = lessons);
  $('#statQuestions') && ($('#statQuestions').textContent = QUIZ.length);
  $('#statCards') && ($('#statCards').textContent = FLASHCARDS.length);
  $('#hpTopics') && ($('#hpTopics').textContent = TOPICS.length);
  $('#hpLessons') && ($('#hpLessons').textContent = lessons);
  $('#hpQs') && ($('#hpQs').textContent = QUIZ.length);
  $('#hpCards') && ($('#hpCards').textContent = FLASHCARDS.length);
}
updateStats();

// ---------- Topics grid ----------
function renderTopics(filter='') {
  const grid = $('#topicsGrid'); if (!grid) return;
  const q = filter.toLowerCase();
  const items = TOPICS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q) ||
    t.content.some(c => c.toLowerCase().includes(q))
  );
  grid.innerHTML = items.map(t => `
    <div class="topic-card reveal" data-id="${t.id}">
      <div class="icon" style="background:${t.color || 'var(--card-2)'}">${t.icon}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <div class="meta">
        <span>📖 ${t.lessons} lessons</span>
        <span class="chip">${t.level}</span>
      </div>
    </div>
  `).join('');
  $$('.topic-card', grid).forEach(card => card.addEventListener('click', () => openTopic(card.dataset.id)));
  observeReveal();
}
renderTopics();
$('#topicSearch')?.addEventListener('input', e => renderTopics(e.target.value));

// ---------- Topic modal ----------
function openTopic(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t) return;
  $('#modalContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <div class="icon" style="background:${t.color || 'var(--card-2)'};width:44px;height:44px;border-radius:8px;display:grid;place-items:center;font-size:1.3rem;">${t.icon}</div>
      <div>
        <h3 style="margin:0;">${t.title}</h3>
        <p style="color:var(--muted);margin:0;font-size:.85rem;">${t.lessons} lessons · ${t.level}</p>
      </div>
    </div>
    <p style="color:var(--muted);margin-bottom:12px;">${t.desc}</p>
    <ol style="padding-left:18px;display:grid;gap:6px;">
      ${t.content.map(c => `<li style="line-height:1.5;">${c}</li>`).join('')}
    </ol>
    <div style="margin-top:14px;">
      <button class="btn btn-primary" id="markDone">Mark as Completed</button>
    </div>
  `;
  $('#modalBackdrop').classList.add('open');
  const p = getProgress();
  const done = p.completed.includes(id);
  const btn = $('#markDone');
  if (done) { btn.textContent = '✓ Completed'; btn.disabled = true; }
  btn?.addEventListener('click', () => {
    const pr = getProgress();
    if (!pr.completed.includes(id)) { pr.completed.push(id); setProgress(pr); toast('Marked complete!'); }
    btn.textContent = '✓ Completed'; btn.disabled = true;
  });
}
$('#modalClose')?.addEventListener('click', () => $('#modalBackdrop').classList.remove('open'));
$('#modalBackdrop')?.addEventListener('click', e => { if (e.target === $('#modalBackdrop')) $('#modalBackdrop').classList.remove('open'); });

// ---------- Glossary ----------
function renderGloss(filter='') {
  const list = $('#glossList'); if (!list) return;
  const q = filter.toLowerCase();
  const items = GLOSSARY.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  list.innerHTML = items.map(g => `
    <div class="gloss-item reveal">
      <h4>${g.term}</h4>
      <p>${g.def}</p>
    </div>
  `).join('');
  observeReveal();
}
renderGloss();
$('#glossSearch')?.addEventListener('input', e => renderGloss(e.target.value));

// ---------- Quiz preview ----------
let previewIndex = 0;
function renderPreview() {
  const q = QUIZ[previewIndex % QUIZ.length];
  const pq = $('#previewQ'); if (!pq) return;
  pq.textContent = q.q;
  $('#previewOpts').innerHTML = q.opts.map((o,i) => `<button class="quiz-opt" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('');
  $('#previewFeedback').textContent = '';
  $$('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      $$('.quiz-opt').forEach(b => b.disabled = true);
      if (i === q.ans) { btn.classList.add('correct'); $('#previewFeedback').textContent = '✅ Correct!'; $('#previewFeedback').style.color = 'var(--success)'; }
      else { btn.classList.add('wrong'); $$('.quiz-opt')[q.ans].classList.add('correct'); $('#previewFeedback').textContent = '❌ Answer: ' + q.opts[q.ans]; $('#previewFeedback').style.color = 'var(--danger)'; }
      setTimeout(() => { previewIndex++; renderPreview(); }, 1600);
    });
  });
}
renderPreview();

// ---------- Nav active on scroll ----------
const sections = ['home','explore','features','about'];
window.addEventListener('scroll', () => {
  let cur = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) cur = id;
  });
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) a.classList.toggle('active', href === '#' + cur);
  });
  $('#backTop')?.classList.toggle('show', window.scrollY > 400);
});

// ---------- Back to top ----------
$('#backTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Reveal ----------
function observeReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e=>e.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => { if (!el.classList.contains('visible')) io.observe(el); });
}
observeReveal();

// ---------- Keyboard ----------
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { $('#modalBackdrop')?.classList.remove('open'); closeNav(); }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 't' || e.key === 'T') $('#themeToggle')?.click();
});

// ---------- Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
