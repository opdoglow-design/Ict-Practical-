// flashcards.js - Enhanced
const $ = (s, r=document) => r.querySelector(s);

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

const KNOWN_KEY = 'ict-known-cards';
function getKnown() { try { return JSON.parse(localStorage.getItem(KNOWN_KEY)) || []; } catch { return []; } }
function setKnown(k) { localStorage.setItem(KNOWN_KEY, JSON.stringify(k)); }

// Categories
const fcCat = $('#fcCat');
const cats = [...new Set(FLASHCARDS.map(c => c.cat || 'General'))];
cats.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; fcCat.appendChild(o); });

let cards = [...FLASHCARDS];
let index = 0;
const cardEl = $('#flashcard');

function applyFilters() {
  const cat = fcCat.value;
  const mode = $('#fcMode').value;
  const q = $('#fcSearch').value.toLowerCase();
  const known = getKnown();
  cards = FLASHCARDS.filter(c => {
    if (cat !== 'all' && (c.cat || 'General') !== cat) return false;
    if (q && !c.front.toLowerCase().includes(q) && !c.back.toLowerCase().includes(q)) return false;
    if (mode === 'known' && !known.includes(c.front)) return false;
    if (mode === 'unknown' && known.includes(c.front)) return false;
    return true;
  });
  index = 0;
  show();
  updateProgress();
}

function show() {
  if (!cards.length) {
    $('#fcFront').textContent = 'No cards';
    $('#fcBack').textContent = 'Try a different filter';
    $('#fcProgress').textContent = '0 cards';
    return;
  }
  const c = cards[index];
  $('#fcFront').textContent = c.front;
  $('#fcBack').textContent = c.back;
  cardEl.classList.remove('flipped');
  $('#fcProgress').textContent = `Card ${index+1} of ${cards.length}`;
}

function updateProgress() {
  const known = getKnown();
  const total = FLASHCARDS.length;
  const k = known.length;
  $('#fcKnownCount').textContent = k;
  $('#fcUnknownCount').textContent = total - k;
  $('#fcProgressBar').style.width = (k / total * 100) + '%';
}

show();
updateProgress();

$('#flashcard').addEventListener('click', () => cardEl.classList.toggle('flipped'));
$('#flipCard').addEventListener('click', () => cardEl.classList.toggle('flipped'));
$('#nextCard').addEventListener('click', () => { if (cards.length) { index = (index+1) % cards.length; show(); } });
$('#prevCard').addEventListener('click', () => { if (cards.length) { index = (index-1+cards.length) % cards.length; show(); } });
$('#shuffleCards').addEventListener('click', () => {
  cards = shuffle([...cards]);
  index = 0; show();
});
function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }

$('#fcSearch').addEventListener('input', applyFilters);
fcCat.addEventListener('change', applyFilters);
$('#fcMode').addEventListener('change', applyFilters);

$('#markKnown').addEventListener('click', () => {
  if (!cards.length) return;
  const front = cards[index].front;
  const known = getKnown();
  if (!known.includes(front)) { known.push(front); setKnown(known); }
  updateProgress();
  // move next
  if (index < cards.length - 1) { index++; show(); }
});
$('#markUnknown').addEventListener('click', () => {
  if (!cards.length) return;
  const front = cards[index].front;
  const known = getKnown().filter(x => x !== front);
  setKnown(known);
  updateProgress();
});
$('#resetKnown').addEventListener('click', () => {
  setKnown([]);
  updateProgress();
  applyFilters();
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { if (cards.length) { index = (index+1) % cards.length; show(); } }
  if (e.key === 'ArrowLeft') { if (cards.length) { index = (index-1+cards.length) % cards.length; show(); } }
  if (e.key === ' ') { e.preventDefault(); cardEl.classList.toggle('flipped'); }
  if (e.key === 'k' || e.key === 'K') $('#markKnown').click();
  if (e.key === 'u' || e.key === 'U') $('#markUnknown').click();
});