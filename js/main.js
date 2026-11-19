// main.js - Enhanced
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const THEME_KEY = 'ict-theme';
const PROG_KEY = 'ict-progress';
const NOTES_KEY = 'ict-notes';
const BOOKMARKS_KEY = 'ict-bookmarks';
const POMO_KEY = 'ict-pomo';
const STREAK_KEY = 'ict-streak';

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
$('#hamburger')?.addEventListener('click', () => {
  navLinks.classList.add('open'); backdrop.classList.add('open');
});
function closeNav() { navLinks.classList.remove('open'); backdrop.classList.remove('open'); }
backdrop?.addEventListener('click', closeNav);
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// ---------- Storage helpers ----------
function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROG_KEY)) || { completed: [], quizBest: 0, studied: 0, cardsViewed: 0 }; }
  catch { return { completed: [], quizBest: 0, studied: 0, cardsViewed: 0 }; }
}
function setProgress(p) { localStorage.setItem(PROG_KEY, JSON.stringify(p)); updateDashboard(); }
function getNotes() { try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || {}; } catch { return {}; } }
function setNotes(n) { localStorage.setItem(NOTES_KEY, JSON.stringify(n)); }
function getBookmarks() { try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || []; } catch { return []; } }
function setBookmarks(b) { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(b)); }
function getPomo() { try { return JSON.parse(localStorage.getItem(POMO_KEY)) || { sessions: 0 }; } catch { return { sessions: 0 }; } }
function setPomo(p) { localStorage.setItem(POMO_KEY, JSON.stringify(p)); }

// Streak
function updateStreak() {
  const today = new Date().toDateString();
  let s = { last: null, count: 0 };
  try { s = JSON.parse(localStorage.getItem(STREAK_KEY)) || s; } catch {}
  if (s.last === today) return s.count;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (s.last === yesterday) s.count += 1;
  else if (s.last !== today) s.count = 1;
  s.last = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
  return s.count;
}
const streakCount = updateStreak();

// ---------- Stats ----------
function updateStats() {
  $('#statTopics') && ($('#statTopics').textContent = TOPICS.length);
  $('#statLessons') && ($('#statLessons').textContent = TOPICS.reduce((a,t)=>a+t.lessons,0));
  $('#statQuestions') && ($('#statQuestions').textContent = QUIZ.length);
  $('#statCards') && ($('#statCards').textContent = FLASHCARDS.length);
}
updateStats();

// ---------- Progress ring ----------
function updateRing() {
  const p = getProgress();
  const total = TOPICS.length;
  const done = p.completed.length;
  const pct = Math.round((done / total) * 100);
  const circ = 2 * Math.PI * 39;
  const c1 = $('#ringCircle'); if (c1) c1.setAttribute('stroke-dashoffset', circ * (1 - pct/100));
  const t1 = $('#ringText'); if (t1) t1.textContent = pct + '%';
  const c2 = $('#ringCircle2'); if (c2) c2.setAttribute('stroke-dashoffset', circ * (1 - pct/100));
  const t2 = $('#ringText2'); if (t2) t2.textContent = pct + '%';
}
updateRing();

// ---------- Dashboard ----------
function updateDashboard() {
  const p = getProgress();
  $('#dashCompleted') && ($('#dashCompleted').textContent = p.completed.length);
  $('#dashTotal') && ($('#dashTotal').textContent = TOPICS.length);
  $('#dashLessons') && ($('#dashLessons').textContent = p.studied);
  $('#dashQuiz') && ($('#dashQuiz').textContent = p.quizBest);
  $('#dashStreak') && ($('#dashStreak').textContent = streakCount);
  $('#dashPomo') && ($('#dashPomo').textContent = getPomo().sessions);
  updateRing();
  renderAchievements();
  renderBookmarks();
}
updateDashboard();

// ---------- Achievements ----------
const ACHS = [
  { id: 'first', icon: '🌱', name: 'First Steps', desc: 'Complete your first topic', check: p => p.completed.length >= 1 },
  { id: 'five', icon: '🔥', name: 'On a Roll', desc: 'Complete 5 topics', check: p => p.completed.length >= 5 },
  { id: 'all', icon: '🏆', name: 'ICT Master', desc: 'Complete all topics', check: p => p.completed.length >= TOPICS.length },
  { id: 'quiz80', icon: '🧠', name: 'Quiz Whiz', desc: 'Score 80%+ on a quiz', check: p => p.quizBest >= Math.ceil(QUIZ.length * 0.8) },
  { id: 'notes', icon: '📝', name: 'Note Taker', desc: 'Write notes on 3 topics', check: () => Object.keys(getNotes()).filter(k=>getNotes()[k]?.trim()).length >= 3 },
  { id: 'bookmark', icon: '🔖', name: 'Collector', desc: 'Bookmark 3 topics', check: () => getBookmarks().length >= 3 },
  { id: 'pomo5', icon: '⏱️', name: 'Focused', desc: 'Complete 5 Pomodoro sessions', check: () => getPomo().sessions >= 5 },
  { id: 'streak3', icon: '📅', name: 'Consistent', desc: '3-day study streak', check: () => streakCount >= 3 }
];
function renderAchievements() {
  const p = getProgress();
  const grid = $('#achGrid'); if (!grid) return;
  grid.innerHTML = ACHS.map(a => {
    const unlocked = a.check(p);
    return `<div class="ach ${unlocked?'unlocked':''}">
      <div class="icon">${a.icon}</div>
      <div class="name">${a.name}</div>
      <div class="desc">${a.desc}</div>
    </div>`;
  }).join('');
}

// ---------- Topics grid ----------
function renderTopics(filter='') {
  const grid = $('#topicsGrid'); if (!grid) return;
  const q = filter.toLowerCase();
  const items = TOPICS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q) ||
    t.content.some(c => c.toLowerCase().includes(q))
  );
  const bookmarks = getBookmarks();
  grid.innerHTML = items.map(t => `
    <div class="topic-card reveal" data-id="${t.id}">
      <button class="bookmark-btn ${bookmarks.includes(t.id)?'active':''}" data-bm="${t.id}" aria-label="Bookmark">${bookmarks.includes(t.id)?'★':'☆'}</button>
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
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('bookmark-btn')) return;
      openTopic(card.dataset.id);
    });
  });
  $$('.bookmark-btn', grid).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(btn.dataset.bm);
    });
  });
  observeReveal();
}
renderTopics();
$('#topicSearch')?.addEventListener('input', e => renderTopics(e.target.value));

function toggleBookmark(id) {
  const b = getBookmarks();
  const i = b.indexOf(id);
  if (i >= 0) b.splice(i,1); else b.push(id);
  setBookmarks(b);
  toast(i >= 0 ? 'Bookmark removed' : 'Bookmarked!');
  renderTopics($('#topicSearch')?.value || '');
  renderBookmarks();
  updateDashboard();
}

function renderBookmarks() {
  const grid = $('#bookmarkedGrid'); if (!grid) return;
  const b = getBookmarks();
  const items = TOPICS.filter(t => b.includes(t.id));
  if (!items.length) {
    grid.innerHTML = '';
    $('#noBookmarks')?.classList.remove('hidden');
    return;
  }
  $('#noBookmarks')?.classList.add('hidden');
  grid.innerHTML = items.map(t => `
    <div class="topic-card" data-id="${t.id}">
      <div class="icon" style="background:${t.color}">${t.icon}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <div class="meta"><span>📖 ${t.lessons} lessons</span><span class="chip">${t.level}</span></div>
    </div>
  `).join('');
  $$('.topic-card', grid).forEach(card => card.addEventListener('click', () => openTopic(card.dataset.id)));
}

// ---------- Topic modal ----------
function openTopic(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t) return;
  const p = getProgress();
  const done = p.completed.includes(id);
  const notes = getNotes();
  $('#modalContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div class="icon" style="background:${t.color};width:52px;height:52px;border-radius:14px;display:grid;place-items:center;font-size:1.5rem;">${t.icon}</div>
      <div>
        <h3 style="margin:0;">${t.title}</h3>
        <p style="color:var(--muted);margin:0;font-size:.9rem;">${t.lessons} lessons · ${t.level}</p>
      </div>
    </div>
    <p style="color:var(--muted);margin-bottom:16px;">${t.desc}</p>
    <ol style="padding-left:20px;display:grid;gap:8px;margin-bottom:20px;">
      ${t.content.map((c,i) => `<li style="line-height:1.5;">${c}</li>`).join('')}
    </ol>
    <div class="notes-area" style="margin-bottom:16px;">
      <label style="display:block;margin-bottom:6px;font-weight:600;font-size:.9rem;">📝 Your Notes</label>
      <textarea id="noteInput" placeholder="Write your notes here... (auto-saved)">${notes[id] || ''}</textarea>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" id="markDone">${done ? '✓ Completed' : 'Mark as Completed'}</button>
      <a class="btn btn-ghost" href="quiz.html?topic=${t.id}">Quiz this topic</a>
      <button class="btn btn-ghost" id="speakBtn">🔊 Read aloud</button>
    </div>
  `;
  $('#modalBackdrop').classList.add('open');

  const noteInput = $('#noteInput');
  let saveTimer;
  noteInput.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const n = getNotes(); n[id] = noteInput.value; setNotes(n);
      updateDashboard();
    }, 500);
  });

  $('#markDone').addEventListener('click', () => {
    const pr = getProgress();
    if (!pr.completed.includes(id)) { pr.completed.push(id); pr.studied += t.lessons; setProgress(pr); toast('Progress saved! +XP'); }
    $('#markDone').textContent = '✓ Completed';
  });

  $('#speakBtn').addEventListener('click', () => {
    if (!('speechSynthesis' in window)) { toast('Speech not supported'); return; }
    const u = new SpeechSynthesisUtterance(t.content.join('. '));
    u.rate = 1; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    toast('Reading aloud...');
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
      setTimeout(() => { previewIndex++; renderPreview(); }, 1800);
    });
  });
}
renderPreview();

// ---------- Nav active on scroll ----------
const sections = ['home','topics','dashboard','features','quiz','timer','glossary'];
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
  // back to top
  $('#backTop')?.classList.toggle('show', window.scrollY > 400);
});

// ---------- Back to top ----------
$('#backTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

// ---------- Reveal on scroll ----------
function observeReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e=>e.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => { if (!el.classList.contains('visible')) io.observe(el); });
}
observeReveal();

// ---------- Pomodoro Timer ----------
let timerMode = 'focus';
let timerSeconds = 25 * 60;
let timerInterval = null;
let timerRunning = false;
const MODES = { focus: 25*60, short: 5*60, long: 15*60 };
const LABELS = { focus: 'Focus session', short: 'Short break', long: 'Long break' };

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  $('#timerDisplay').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  document.title = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} · ICT Hub`;
}
updateTimerDisplay();

$$('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    timerMode = btn.dataset.mode;
    timerSeconds = MODES[timerMode];
    timerRunning = false;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    $('#timerLabel').textContent = LABELS[timerMode];
    updateTimerDisplay();
    toast(LABELS[timerMode]);
  });
});

$('#timerStart')?.addEventListener('click', () => {
  if (timerRunning) return;
  timerRunning = true;
  toast('Timer started');
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval); timerInterval = null; timerRunning = false;
      toast(timerMode === 'focus' ? '🎉 Focus complete! Take a break.' : 'Break over — back to work!');
      if (timerMode === 'focus') {
        const p = getPomo(); p.sessions += 1; setPomo(p); updateDashboard();
      }
      // notification
      if (Notification.permission === 'granted') new Notification('ICT Hub Timer', { body: 'Session complete!' });
    }
  }, 1000);
});
$('#timerPause')?.addEventListener('click', () => {
  if (!timerRunning) return;
  timerRunning = false;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  toast('Paused');
});
$('#timerReset')?.addEventListener('click', () => {
  timerRunning = false;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  timerSeconds = MODES[timerMode];
  updateTimerDisplay();
  toast('Reset');
});

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  // ask after first interaction
  document.addEventListener('click', () => { Notification.requestPermission(); }, { once: true });
}

// ---------- Keyboard shortcuts ----------
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $('#modalBackdrop')?.classList.remove('open');
    closeNav();
  }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 't' || e.key === 'T') $('#themeToggle')?.click();
});

// ---------- Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}

// ---------- Init ----------
observeReveal();
updateDashboard();
initTheme();
