/* =============================================
   KRFT PORTFOLIO — script.js
   Página pública — lê dados do Supabase
   ============================================= */

const SUPABASE_URL  = 'https://cqwrecnwclqxtllrbicm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxd3JlY253Y2xxeHRsbHJiaWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDkyODMsImV4cCI6MjA4Nzk4NTI4M30.wZvEQhc1BioSDj7nTojByaVsk6MyAy-TieDEEtQarzM';

async function sbFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      ...opts.headers
    },
    ...opts
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

let state = {
  arts: [], categories: [], podium: [null, null, null],
  about: '', tagline: '', currentCat: 'all'
};

async function loadData() {
  showLoading(true);
  try {
    const arts = await sbFetch('arts?select=*&order=created_at.desc');
    state.arts = arts || [];
    state.categories = [...new Set(state.arts.map(a => a.category).filter(Boolean))];

    const settings = await sbFetch('settings?select=*');
    if (settings) {
      settings.forEach(s => {
        if (s.key === 'tagline') state.tagline = s.value;
        if (s.key === 'about')   state.about   = s.value;
        if (s.key === 'podium')  state.podium  = JSON.parse(s.value || '[null,null,null]');
      });
    }
    if (!state.tagline) state.tagline = 'Artes que falam por si. Covers, flyers e identidade visual com pegada streetwear.';
    if (!state.about)   state.about   = 'Escreva aqui sobre você e seu trabalho.';
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    document.getElementById('gallery-grid').innerHTML = '<div class="empty-gallery">// ERRO AO CARREGAR DADOS.<br>Verifique sua conexão.</div>';
  }
  showLoading(false);
  renderAll();
}

function showLoading(on) {
  const el = document.getElementById('loading-screen');
  if (el) el.style.display = on ? 'flex' : 'none';
}

// CURSOR
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
let ringX = mouseX, ringY = mouseY;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX+'px'; cursorDot.style.top = mouseY+'px';
});
(function animateCursor() {
  ringX += (mouseX-ringX)*0.12; ringY += (mouseY-ringY)*0.12;
  cursorRing.style.left = ringX+'px'; cursorRing.style.top = ringY+'px';
  requestAnimationFrame(animateCursor);
})();

// SCROLL
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  document.getElementById('scroll-line').style.width = (pct*100)+'%';
});

// GRID DECO
const gd = document.getElementById('grid-deco');
for (let i=0;i<64;i++) { const s=document.createElement('span'); gd.appendChild(s); }

// FOOTER
document.getElementById('footer-year').textContent = new Date().getFullYear();

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior:'smooth' });
  });
});

function renderAll() {
  renderTexts(); renderCategoryTabs(); renderGallery(); renderPodium();
}

function renderTexts() {
  document.getElementById('hero-tagline').textContent = state.tagline;
  document.getElementById('about-text').textContent   = state.about;
}

function renderCategoryTabs() {
  const tabs = document.getElementById('cat-tabs');
  tabs.innerHTML = `<button class="cat-tab ${state.currentCat==='all'?'active':''}" data-cat="all" onclick="filterCat('all',this)">TUDO</button>`;
  state.categories.forEach(c => {
    tabs.innerHTML += `<button class="cat-tab ${state.currentCat===c?'active':''}" data-cat="${c}" onclick="filterCat('${c}',this)">${c.toUpperCase()}</button>`;
  });
}

function filterCat(cat, btn) {
  state.currentCat = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const arts = state.currentCat==='all' ? state.arts : state.arts.filter(a=>a.category===state.currentCat);
  if (!arts.length) {
    grid.innerHTML = `<div class="empty-gallery">// NENHUMA ARTE CADASTRADA ${state.currentCat!=='all'?'NESTA CATEGORIA':''}</div>`;
    return;
  }
  grid.innerHTML = arts.map(art => `
    <div class="art-card" onclick="openLightbox('${art.id}')">
      <img src="${art.img}" alt="${art.name}" loading="lazy">
      <div class="art-info">
        <div class="art-name">${art.name}</div>
        ${art.description ? `<div class="art-desc">${art.description.substring(0,80)}${art.description.length>80?'...':''}</div>` : ''}
        ${art.category ? `<span class="art-tag">${art.category}</span>` : ''}
      </div>
    </div>
  `).join('');
}

function renderPodium() {
  const wrap = document.getElementById('podium-wrap');
  const slots = [{rank:1,cls:'rank-1',order:2},{rank:2,cls:'rank-2',order:1},{rank:3,cls:'rank-3',order:3}];
  wrap.innerHTML = slots.map(s => {
    const artId = state.podium[s.rank-1];
    const art   = artId ? state.arts.find(a=>a.id===artId) : null;
    return `
      <div class="podium-item ${s.cls}" style="order:${s.order}">
        <div class="podium-card" ${art?`onclick="openLightbox('${art.id}')"`:''}> 
          ${art
            ? `<img src="${art.img}" alt="${art.name}"><div class="overlay"></div><div class="card-title">${art.name}</div>`
            : `<div class="empty-podium" style="width:100%;height:100%;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                <p>VAZIO</p></div>`}
        </div>
        <div class="podium-base"></div>
      </div>`;
  }).join('');
}

function openLightbox(id) {
  const art = state.arts.find(a=>a.id===id); if (!art) return;
  document.getElementById('lightbox-img').src           = art.img;
  document.getElementById('lightbox-title').textContent = art.name;
  document.getElementById('lightbox-desc').textContent  = art.description || '';
  document.getElementById('lightbox-cat').textContent   = art.category || '';
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target!==e.currentTarget && !e.target.classList.contains('lightbox-close')) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key==='Escape') closeLightbox(); });

loadData();
