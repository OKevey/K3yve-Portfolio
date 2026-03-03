/* =============================================
   KRFT PORTFOLIO — script.js
   Lê os dados de arts.js e renderiza o site.
   ============================================= */

// =============================================
// CURSOR SUAVE (lerp)
// =============================================
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX  = mouseX, ringY = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});
(function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

// =============================================
// SCROLL PROGRESS
// =============================================
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  document.getElementById('scroll-line').style.width = (pct * 100) + '%';
});

// =============================================
// GRID DECORATION
// =============================================
const gd = document.getElementById('grid-deco');
for (let i = 0; i < 64; i++) {
  const s = document.createElement('span');
  gd.appendChild(s);
}

// =============================================
// FOOTER YEAR
// =============================================
document.getElementById('footer-year').textContent = new Date().getFullYear();

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

// =============================================
// ESTADO
// =============================================
let currentCat = 'all';

// =============================================
// INIT — lê de arts.js e renderiza tudo
// =============================================
function init() {
  // Textos do CONFIG
  document.getElementById('hero-tagline').textContent = CONFIG.tagline;
  document.getElementById('about-text').textContent   = CONFIG.about;

  // Logo/nome
  document.querySelectorAll('.logo, .footer-logo').forEach(el => {
    el.innerHTML = CONFIG.name.replace('.', '<span>.</span>');
  });

  renderCategoryTabs();
  renderGallery();
  renderPodium();
}

// =============================================
// CATEGORIAS
// =============================================
function getCategories() {
  return [...new Set(ARTS.map(a => a.category).filter(Boolean))];
}

function renderCategoryTabs() {
  const tabs = document.getElementById('cat-tabs');
  const cats = getCategories();

  tabs.innerHTML = `<button class="cat-tab active" data-cat="all" onclick="filterCat('all',this)">TUDO</button>`;
  cats.forEach(c => {
    tabs.innerHTML += `<button class="cat-tab" data-cat="${c}" onclick="filterCat('${c}',this)">${c.toUpperCase()}</button>`;
  });
}

function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderGallery();
}

// =============================================
// GALERIA
// =============================================
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const arts = currentCat === 'all'
    ? ARTS
    : ARTS.filter(a => a.category === currentCat);

  if (!arts.length) {
    grid.innerHTML = `
      <div class="empty-gallery">
        // NO ARTS YET! ${currentCat !== 'all' ? 'IN THIS CATEGORY' : ''}<br>
        COME BACK LATER! :)
      </div>`;
    return;
  }

  grid.innerHTML = arts.map(art => `
    <div class="art-card" onclick="openLightbox('${art.id}')">
      <img src="${art.file}" alt="${art.name}" loading="lazy">
      <div class="art-info">
        <div class="art-name">${art.name}</div>
        ${art.description ? `<div class="art-desc">${art.description.substring(0, 80)}${art.description.length > 80 ? '...' : ''}</div>` : ''}
        ${art.category ? `<span class="art-tag">${art.category}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// =============================================
// PÓDIO
// =============================================
function renderPodium() {
  const wrap  = document.getElementById('podium-wrap');
  const slots = [
    { rank: 1, cls: 'rank-1', order: 2 },
    { rank: 2, cls: 'rank-2', order: 1 },
    { rank: 3, cls: 'rank-3', order: 3 }
  ];

  wrap.innerHTML = slots.map(s => {
    const art = ARTS.find(a => a.featured === s.rank) || null;
    return `
      <div class="podium-item ${s.cls}" style="order:${s.order}">
        <div class="podium-card" ${art ? `onclick="openLightbox('${art.id}')"` : ''}>
          ${art
            ? `<img src="${art.file}" alt="${art.name}">
               <div class="overlay"></div>
               <div class="card-title">${art.name}</div>`
            : `<div class="empty-podium" style="width:100%;height:100%;">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                   <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                 </svg>
                 <p>Empty</p>
               </div>`
          }
        </div>
        <div class="podium-base"></div>
      </div>
    `;
  }).join('');
}

// =============================================
// LIGHTBOX
// =============================================
function openLightbox(id) {
  const art = ARTS.find(a => a.id === id);
  if (!art) return;
  document.getElementById('lightbox-img').src           = art.file;
  document.getElementById('lightbox-title').textContent = art.name;
  document.getElementById('lightbox-desc').textContent  = art.description || '';
  document.getElementById('lightbox-cat').textContent   = art.category || '';
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('lightbox-close')) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// =============================================
// INICIALIZA
// =============================================
init();
