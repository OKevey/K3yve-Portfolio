/* =============================================
   KRFT PORTFOLIO — script.js
   ============================================= */

// =============================================
// STATE
// =============================================
const DEFAULT_PW = 'krft2025';

let state = {
  arts: [],
  categories: [],
  podium: [null, null, null],
  about: 'Escreva aqui sobre você e seu trabalho. Fale sobre sua trajetória, estilo e inspirações.\n\nEste texto aparece na seção "Sobre" do seu portfólio.\nVocê pode editá-lo diretamente pelo painel de administração.',
  tagline: 'Artes que falam por si. Covers, flyers e identidade visual com pegada streetwear.',
  password: DEFAULT_PW,
  isAdmin: false,
  currentCat: 'all'
};

function loadState() {
  try {
    const s = localStorage.getItem('krft_portfolio');
    if (s) {
      const saved = JSON.parse(s);
      state = { ...state, ...saved, isAdmin: false };
    }
  } catch (e) {
    console.warn('Erro ao carregar estado:', e);
  }
}

function saveState() {
  const toSave = { ...state, isAdmin: false };
  localStorage.setItem('krft_portfolio', JSON.stringify(toSave));
}

// =============================================
// SMOOTH CURSOR (lerp)
// =============================================
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;
const LERP = 0.12; // 0 = no lag, 1 = instant

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // dot follows instantly
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  // ring smoothly lerps toward mouse
  ringX += (mouseX - ringX) * LERP;
  ringY += (mouseY - ringY) * LERP;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// =============================================
// SCROLL PROGRESS BAR
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
// TOAST
// =============================================
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// =============================================
// SMOOTH SCROLL (nav links)
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

// =============================================
// TEXTS
// =============================================
function renderTexts() {
  document.getElementById('hero-tagline').textContent = state.tagline;
  document.getElementById('about-text').textContent   = state.about;
}

// =============================================
// ABOUT QUICK EDIT (front-end, admin only)
// =============================================
function toggleAboutEdit() {
  const area = document.getElementById('about-edit-area');
  const ta   = document.getElementById('about-textarea');
  const open = area.style.display === 'block';
  area.style.display = open ? 'none' : 'block';
  if (!open) ta.value = state.about;
}

function saveAbout() {
  state.about = document.getElementById('about-textarea').value;
  document.getElementById('about-text').textContent = state.about;
  document.getElementById('about-edit-area').style.display = 'none';
  saveState();
  toast('// TEXTO SALVO');
}

// =============================================
// CATEGORIES
// =============================================
function renderCategoryTabs() {
  const tabs = document.getElementById('cat-tabs');
  tabs.innerHTML = `<button class="cat-tab ${state.currentCat === 'all' ? 'active' : ''}" data-cat="all" onclick="filterCat('all',this)">TUDO</button>`;
  state.categories.forEach(c => {
    tabs.innerHTML += `<button class="cat-tab ${state.currentCat === c ? 'active' : ''}" data-cat="${c}" onclick="filterCat('${c}',this)">${c.toUpperCase()}</button>`;
  });
}

function filterCat(cat, btn) {
  state.currentCat = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderGallery();
}

// =============================================
// GALLERY
// =============================================
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const arts = state.currentCat === 'all'
    ? state.arts
    : state.arts.filter(a => a.category === state.currentCat);

  if (!arts.length) {
    grid.innerHTML = `<div class="empty-gallery">// NENHUMA ARTE CADASTRADA ${state.currentCat !== 'all' ? 'NESTA CATEGORIA' : ''}<br>ACESSE O PAINEL ADMIN PARA ADICIONAR</div>`;
    return;
  }

  grid.innerHTML = arts.map(art => `
    <div class="art-card" onclick="openLightbox('${art.id}')">
      <img src="${art.img}" alt="${art.name}" loading="lazy">
      <div class="art-info">
        <div class="art-name">${art.name}</div>
        ${art.desc ? `<div class="art-desc">${art.desc.substring(0, 80)}${art.desc.length > 80 ? '...' : ''}</div>` : ''}
        ${art.category ? `<span class="art-tag">${art.category}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// =============================================
// PODIUM
// =============================================
function renderPodium() {
  const wrap  = document.getElementById('podium-wrap');
  const slots = [
    { rank: 1, cls: 'rank-1', order: 2 },
    { rank: 2, cls: 'rank-2', order: 1 },
    { rank: 3, cls: 'rank-3', order: 3 }
  ];

  wrap.innerHTML = slots.map(s => {
    const artId = state.podium[s.rank - 1];
    const art   = artId ? state.arts.find(a => a.id === artId) : null;
    return `
      <div class="podium-item ${s.cls}" style="order:${s.order}">
        <div class="podium-card" ${art ? `onclick="openLightbox('${art.id}')"` : ''}>
          ${art
            ? `<img src="${art.img}" alt="${art.name}">
               <div class="overlay"></div>
               <div class="card-title">${art.name}</div>`
            : `<div class="empty-podium" style="width:100%;height:100%;">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                   <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                 </svg>
                 <p>VAZIO</p>
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
  const art = state.arts.find(a => a.id === id);
  if (!art) return;
  document.getElementById('lightbox-img').src      = art.img;
  document.getElementById('lightbox-title').textContent = art.name;
  document.getElementById('lightbox-desc').textContent  = art.desc || '';
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
// LOGIN
// =============================================
function openLogin() {
  document.getElementById('login-overlay').classList.add('active');
  setTimeout(() => document.getElementById('login-pw').focus(), 100);
}

function closeLogin() {
  document.getElementById('login-overlay').classList.remove('active');
  document.getElementById('login-pw').value = '';
  document.getElementById('login-error').style.display = 'none';
}

function doLogin() {
  const pw = document.getElementById('login-pw').value;
  if (pw === state.password) {
    state.isAdmin = true;
    closeLogin();
    openAdmin();
  } else {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('login-pw').value = '';
    document.getElementById('login-pw').focus();
  }
}

// =============================================
// ADMIN PANEL
// =============================================
function openAdmin() {
  if (!state.isAdmin) { openLogin(); return; }
  document.getElementById('admin-panel').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderAdmin();

  // Show quick-edit button on about section
  document.getElementById('about-edit-btn').style.display = 'inline-block';
}

function closeAdmin() {
  document.getElementById('admin-panel').classList.remove('active');
  document.body.style.overflow = '';
}

function renderAdmin() {
  // Texts
  document.getElementById('admin-tagline').value = state.tagline;
  document.getElementById('admin-about').value   = state.about;

  // Category list
  const catsList = document.getElementById('admin-cats-list');
  catsList.innerHTML = state.categories.map(c => `
    <div class="category-tag">
      ${c}
      <button onclick="removeCategory('${c}')">✕</button>
    </div>
  `).join('') || '<span style="font-family:Space Mono;font-size:0.65rem;color:#444;">// Nenhuma categoria</span>';

  // Category select for new art
  const catSelect = document.getElementById('new-art-cat');
  catSelect.innerHTML = `<option value="">Selecione...</option>` +
    state.categories.map(c => `<option value="${c}">${c}</option>`).join('');

  // Podium selects
  const artOptions = `<option value="">— Vazio —</option>` +
    state.arts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  ['podium-1', 'podium-2', 'podium-3'].forEach((id, i) => {
    const s = document.getElementById(id);
    s.innerHTML = artOptions;
    s.value = state.podium[i] || '';
  });

  // Arts list
  const artsList = document.getElementById('admin-arts-list');
  artsList.innerHTML = state.arts.length
    ? state.arts.map(a => `
        <div class="admin-art-row">
          <img src="${a.img}" alt="${a.name}">
          <div class="admin-art-row-info">
            <div class="admin-art-row-name">${a.name}</div>
            <div class="admin-art-row-meta">${a.category || 'Sem categoria'} // ${a.desc ? a.desc.substring(0, 60) + '...' : 'Sem descrição'}</div>
          </div>
          <button class="btn-secondary" onclick="editArtPrompt('${a.id}')">✏</button>
          <button class="btn-danger" onclick="deleteArt('${a.id}')">✕</button>
        </div>
      `).join('')
    : '<p style="font-family:Space Mono;font-size:0.65rem;color:#444;text-align:center;padding:20px;">// Nenhuma arte cadastrada</p>';

  // Clear password fields
  ['pw-current', 'pw-new', 'pw-confirm'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pw-error').textContent = '';
}

// =============================================
// SAVE TEXTS
// =============================================
function saveTexts() {
  state.tagline = document.getElementById('admin-tagline').value;
  state.about   = document.getElementById('admin-about').value;
  renderTexts();
  saveState();
  toast('// TEXTOS SALVOS');
}

// =============================================
// CATEGORIES — ADD / REMOVE
// =============================================
function addCategory() {
  const input = document.getElementById('new-cat-input');
  const val   = input.value.trim();
  if (!val) return;
  if (state.categories.includes(val)) { toast('// CATEGORIA JÁ EXISTE'); return; }
  state.categories.push(val);
  input.value = '';
  saveState();
  renderAdmin();
  renderCategoryTabs();
  toast('// CATEGORIA ADICIONADA');
}

function removeCategory(cat) {
  if (!confirm(`Remover categoria "${cat}"?`)) return;
  state.categories = state.categories.filter(c => c !== cat);
  state.arts = state.arts.map(a => a.category === cat ? { ...a, category: '' } : a);
  saveState();
  renderAdmin();
  renderCategoryTabs();
  toast('// CATEGORIA REMOVIDA');
}

// =============================================
// ARTS — ADD / EDIT / DELETE
// =============================================
function previewImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById('upload-preview');
    prev.src = e.target.result;
    prev.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function addArt() {
  const name      = document.getElementById('new-art-name').value.trim();
  const cat       = document.getElementById('new-art-cat').value;
  const desc      = document.getElementById('new-art-desc').value.trim();
  const fileInput = document.getElementById('art-file');
  const file      = fileInput.files[0];

  if (!name) { toast('// INSIRA O NOME DA ARTE'); return; }
  if (!file)  { toast('// SELECIONE UMA IMAGEM');  return; }

  const reader = new FileReader();
  reader.onload = e => {
    const art = {
      id:       'art_' + Date.now(),
      name,
      desc,
      category: cat,
      img:      e.target.result
    };
    state.arts.unshift(art);
    saveState();
    renderGallery();
    renderPodium();
    renderAdmin();
    // Reset form
    document.getElementById('new-art-name').value  = '';
    document.getElementById('new-art-desc').value  = '';
    document.getElementById('new-art-cat').value   = '';
    fileInput.value = '';
    document.getElementById('upload-preview').style.display = 'none';
    toast('// ARTE ADICIONADA');
  };
  reader.readAsDataURL(file);
}

function deleteArt(id) {
  if (!confirm('Excluir esta arte permanentemente?')) return;
  state.arts   = state.arts.filter(a => a.id !== id);
  state.podium = state.podium.map(p => p === id ? null : p);
  saveState();
  renderGallery();
  renderPodium();
  renderAdmin();
  toast('// ARTE REMOVIDA');
}

function editArtPrompt(id) {
  const art = state.arts.find(a => a.id === id);
  if (!art) return;
  const newName = prompt('Nome da arte:', art.name);
  if (newName !== null) art.name = newName.trim() || art.name;
  const newDesc = prompt('Descrição:', art.desc || '');
  if (newDesc !== null) art.desc = newDesc.trim();
  saveState();
  renderGallery();
  renderAdmin();
  toast('// ARTE ATUALIZADA');
}

// =============================================
// PODIUM — SAVE
// =============================================
function savePodium() {
  state.podium = [
    document.getElementById('podium-1').value || null,
    document.getElementById('podium-2').value || null,
    document.getElementById('podium-3').value || null
  ];
  saveState();
  renderPodium();
  toast('// PÓDIO SALVO');
}

// =============================================
// PASSWORD — CHANGE
// =============================================
function changePassword() {
  const current  = document.getElementById('pw-current').value;
  const newPw    = document.getElementById('pw-new').value;
  const confirm  = document.getElementById('pw-confirm').value;
  const errEl    = document.getElementById('pw-error');

  errEl.textContent = '';

  if (current !== state.password) {
    errEl.textContent = '// SENHA ATUAL INCORRETA.';
    return;
  }
  if (newPw.length < 4) {
    errEl.textContent = '// NOVA SENHA MUITO CURTA (mínimo 4 caracteres).';
    return;
  }
  if (newPw !== confirm) {
    errEl.textContent = '// AS SENHAS NÃO COINCIDEM.';
    return;
  }

  state.password = newPw;
  saveState();
  ['pw-current', 'pw-new', 'pw-confirm'].forEach(id => document.getElementById(id).value = '');
  toast('// SENHA ALTERADA COM SUCESSO');
}

// =============================================
// INIT
// =============================================
loadState();
renderTexts();
renderCategoryTabs();
renderGallery();
renderPodium();
