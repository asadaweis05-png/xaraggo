/* ==========================================================================
   ERAV - Quruxda iyo Labbiska Soomaaliyeed (AI Features & Logic Engine)
   ========================================================================== */

// STATE MANAGEMENT
const state = {
  theme: 'light',
  currency: 'USD',
  currencyRates: { USD: 1, SOS: 26000, EUR: 0.92 },
  currencySymbols: { USD: '$', SOS: 'Sh.So ', EUR: '' },
  
  cart: [
    { id: 'p1', name: 'Serum Niacinamide 10%', price: 38, image: './images/serum.jpg', category: 'Daryeelka Maqaarka', qty: 1 }
  ],
  wishlist: ['p2'],
  
  user: {
    name: 'Aamiina Xasan',
    skinType: 'Maqaar Isku Dhafan / U Janjeera Dhibcaha Madow',
    size: 'Dhexdhexaad (M)',
    points: 450,
    vipTier: 'Xubinta Dahabiga Ah',
    savedRoutines: [
      { name: 'Habka Dhalaalka Subaxda', steps: ['Dhaqaha Dabacsan ee Wejiga', 'Serum Niacinamide 10%', 'Dhowrida Qoyanaanta SPF 50'] }
    ],
    savedOutfits: []
  },

  skinTrackerLogs: [
    { date: '2026-07-20', acne: 4, hydration: 6, oiliness: 5, note: 'Bilaabay Serum Niacinamide 10%' },
    { date: '2026-07-21', acne: 3, hydration: 7, oiliness: 4, note: 'Maqaarku wuxuu dareemayaa qoyan, casaan yar' }
  ],

  outfitBuilder: {
    top: { name: 'Dirac Xariir ah oo Soomaaliyeed iyo Garbasaar', price: 140, image: './images/dirac.jpg' },
    hijab: { name: 'Jalbaab Chiffon ah', price: 35, image: './images/hero.jpg' },
    bag: { name: 'Shanta Gacanta ee Dahabiga ah', price: 85, image: './images/serum.jpg' }
  }
};

// DATASETS
const products = [
  {
    id: 'p1',
    name: 'Serum Niacinamide 10%',
    category: 'daryeelka-maqaarka',
    price: 38,
    rating: 4.9,
    reviewsCount: 128,
    image: './images/serum.jpg',
    badge: 'Ugu Iibka Badan',
    desc: 'Laga hortago dhibcaha madow, finanka iyo saliidda badan iyadoo la adeegsanayo Niacinamide 10% & Zinc.'
  },
  {
    id: 'p2',
    name: 'Dirac Xariir ah oo Soomaaliyeed iyo Garbasaar',
    category: 'dirac',
    price: 140,
    rating: 5.0,
    reviewsCount: 94,
    image: './images/dirac.jpg',
    badge: 'Khadka Boqortooyada',
    desc: 'Dirac xariir ah oo Soomaaliyeed oo lagu qurxiyay toosinta dahabiga ah iyo Garbasaar u dhigma.'
  },
  {
    id: 'p3',
    name: 'Cabaaya Dahabi ah',
    category: 'abayas',
    price: 110,
    rating: 4.8,
    reviewsCount: 62,
    image: './images/hero.jpg',
    badge: 'Cusub',
    desc: 'Cabaaya Dahabi ah oo ka samaysan xariir jilicsan iyo Garbasaar u dhigma.'
  },
  {
    id: 'p4',
    name: 'Jalbaab Chiffon ah',
    category: 'hijabs',
    price: 35,
    rating: 4.9,
    reviewsCount: 210,
    image: './images/hero.jpg',
    badge: 'Moodada Hadda',
    desc: 'Jalbaab Chiffon ah oo aan ka siibanyaan oo ku habboon dhammaan midabbada.'
  }
];

const ingredientsData = [
  {
    name: 'Niacinamide 10%',
    benefit: 'Wuxuu tirtiraa dhibcaha madow, wuxuu yarayaa daloolada maqaarka, wuxuuna xaktameeyaa dufan badan.',
    whoUse: 'Maqaarka dufanka leh, isku dhafka ah, ama dhibcaha madow leh.',
    whoAvoid: 'Ma jiro, wuxuu ku habboon yahay dhammaan maqaarrada.',
    tag: 'Dhalaalinta'
  },
  {
    name: 'Vitamin C',
    benefit: 'Antioxidant xoog badan oo dhalaaliya maqaarka madow una ilaaliya qorraxda.',
    whoUse: 'Maqaarka midabka aan simanayn leh.',
    whoAvoid: 'Maqaarka xasaasiga ah ee jaban.',
    tag: 'Antioxidant'
  }
];

const skinConcernsData = {
  acne: {
    title: 'Finan & Dufan Badan',
    causes: 'Dufan badan, daloolada xirantay, iyo isbeddelka hoormoonada.',
    prevention: 'Dhaqida wejiga laba jeer maalintii, isticmaalka Serum Niacinamide 10%.',
    routine: '1. Dhaqaha Salicylic Acid -> 2. Serum Niacinamide 10% -> 3. Kiriimka Gel-ka ah -> 4. Sunscreen SPF 50.',
    recommendedProducts: ['Serum Niacinamide 10%']
  },
  darkSpots: {
    title: 'Dhibco Madow & Hyperpigmentation',
    causes: 'Madoobaadka ka dhasha finanka oo ku badan maqaarka madow.',
    prevention: 'Isticmaalka Sunscreen SPF 50 maalintii iyo Vitamin C.',
    routine: '1. Dhaqaha Dabacsan -> 2. Vitamin C -> 3. Kiriimka Ceramides -> 4. Sunscreen SPF 50.',
    recommendedProducts: ['Serum Niacinamide 10%']
  }
};

const forumPosts = [
  {
    id: 'f1',
    author: 'Fadumo Aadan',
    category: 'daryeelka-maqaarka',
    title: 'Sidee loo tirtiraa dhibcaha madow ee finanka ka dib?',
    content: 'Asc walaalaha qaaliga ah! Waxaan leeyahay dhibco madow oo ku yaal dhabannada. Ma Azelaic Acid ayaa fiican mise Glycolic Acid?',
    likes: 24,
    answersCount: 7,
    tags: ['#DhibcoMadow', '#MaqaarkaSoomaaliyeed']
  }
];

const blogPosts = [
  {
    id: 'b1',
    title: 'Hantida Maqaarka Madow: Hagaha Isticmaalka Sunscreen-ka',
    category: 'Daryeelka Maqaarka',
    readTime: '5 daqiiqo',
    image: './images/serum.jpg',
    excerpt: 'Sababta maqaarka madow uu weli ugu baahan yahay Sunscreen SPF 50 iyo sida uu uga hortago dhibcaha madow.'
  }
];

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderBestSellers();
  renderShopCatalog();
  renderIngredientLibrary();
  renderSkinConcernTab('darkSpots');
  renderForumPosts();
  renderBlogPosts();
  renderCart();
  renderWishlist();
  renderOutfitPicker();
  renderSkinLogHistory();
  renderAdminTable();
  initQuizWizard();
});

// NAVIGATION
function navigateTo(viewId) {
  // Redirect to auth for protected views if not logged in
  if ((viewId === 'dashboard') && !state.authUser) {
    viewId = 'auth';
  }

  document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${viewId}`);
  if (activeNav) activeNav.classList.add('active');

  // Populate dashboard when navigating to it
  if (viewId === 'dashboard' && state.authUser) {
    renderDashboard();
  }
}

function toggleDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (drawer) {
    drawer.classList.toggle('open');
  }
}

function toggleMobileMenu() {
  toggleDrawer('mobile-menu-drawer');
}

// THEME & CURRENCY
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('dark-mode', state.theme === 'dark');
  const icon = document.getElementById('theme-icon');
  icon.className = state.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function changeCurrency(curr) {
  state.currency = curr;
  renderBestSellers();
  renderShopCatalog();
  renderCart();
}

function formatPrice(usdAmount) {
  const rate = state.currencyRates[state.currency] || 1;
  const sym = state.currencySymbols[state.currency] || '$';
  const val = (usdAmount * rate).toLocaleString();
  return `${sym}${val}`;
}

// RENDER PRODUCTS
function createProductCardHTML(p) {
  const isFav = state.wishlist.includes(p.id);
  return `
    <div class="product-card">
      <div class="product-thumb">
        <img src="${p.image}" alt="${p.name}">
        <span class="product-badge">${p.badge}</span>
        <button class="product-fav-btn ${isFav ? 'active' : ''}" onclick="toggleWishlist('${p.id}')">
          <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <i class="fa-solid fa-star"></i> <span>${p.rating} (${p.reviewsCount})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="btn btn-gold btn-sm" onclick="addToCart('${p.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Kuduud
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderBestSellers() {
  const container = document.getElementById('home-best-sellers-grid');
  if (container) {
    container.innerHTML = products.map(p => createProductCardHTML(p)).join('');
  }
}

function renderShopCatalog() {
  const container = document.getElementById('shop-catalog-grid');
  if (container) {
    container.innerHTML = products.map(p => createProductCardHTML(p)).join('');
  }
}

function filterShopTab(cat, btn) {
  document.querySelectorAll('#view-shop .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const container = document.getElementById('shop-catalog-grid');
  const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
  container.innerHTML = filtered.map(p => createProductCardHTML(p)).join('');
}

function filterShopCategory(cat) {
  navigateTo('shop');
  const container = document.getElementById('shop-catalog-grid');
  const filtered = products.filter(p => p.category === cat);
  container.innerHTML = filtered.map(p => createProductCardHTML(p)).join('');
}

// CART & WISHLIST
function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  
  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...prod, qty: 1 });
  }
  
  renderCart();
  toggleDrawer('cart-drawer');
  
  // Sync to Supabase
  if (typeof syncCartToDB === 'function') syncCartToDB();
}

function renderCart() {
  const container = document.getElementById('cart-drawer-items');
  const countBadge = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('cart-subtotal-price');
  if (!container) return;
  
  const totalItems = state.cart.reduce((acc, item) => acc + item.qty, 0);
  if (countBadge) countBadge.innerText = totalItems;
  
  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>Gaadhigaaga waxba kuma jiraan.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = formatPrice(0);
    return;
  }
  
  let subtotal = 0;
  container.innerHTML = state.cart.map(item => {
    subtotal += item.price * item.qty;
    return `
      <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
        <div style="flex-grow: 1;">
          <h4 style="font-size: 0.9rem; font-family: var(--font-serif);">${item.name}</h4>
          <span style="font-size: 0.85rem; color: var(--gold-primary); font-weight: 700;">Qiimaha: ${formatPrice(item.price)}</span>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.35rem;">
            <button class="pill-btn" style="padding: 2px 8px;" onclick="updateCartQty('${item.id}', -1)">-</button>
            <span style="font-size: 0.85rem;">Tirada: ${item.qty}</span>
            <button class="pill-btn" style="padding: 2px 8px;" onclick="updateCartQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="icon-btn" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash-can" style="color: #c94a4a;"></i></button>
      </div>
    `;
  }).join('');
  
  if (subtotalEl) subtotalEl.innerText = formatPrice(subtotal);
}

function updateCartQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      renderCart();
      if (typeof syncCartToDB === 'function') syncCartToDB();
    }
  }
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderCart();
  if (typeof syncCartToDB === 'function') syncCartToDB();
}

function toggleWishlist(id) {
  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter(i => i !== id);
  } else {
    state.wishlist.push(id);
  }
  const badge = document.getElementById('wishlist-count');
  if (badge) badge.innerText = state.wishlist.length;
  renderBestSellers();
  renderShopCatalog();
  renderWishlist();
  
  // Sync to Supabase
  if (typeof syncWishlistToDB === 'function') syncWishlistToDB();
}

function renderWishlist() {
  const container = document.getElementById('wishlist-drawer-items');
  if (!container) return;
  const wishProducts = products.filter(p => state.wishlist.includes(p.id));
  
  if (wishProducts.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Waxba uguma jiraan kaydkaaga.</p>`;
    return;
  }
  
  container.innerHTML = wishProducts.map(p => `
    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center;">
      <img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);">
      <div>
        <h4 style="font-size: 0.85rem;">${p.name}</h4>
        <span style="font-size: 0.8rem; color: var(--gold-primary);">${formatPrice(p.price)}</span>
      </div>
      <button class="btn btn-gold btn-sm" style="margin-left: auto;" onclick="addToCart('${p.id}')">Kuduud</button>
    </div>
  `).join('');
}

// --------------------------------------------------------------------------
// ADVANCED AI ENGINE 1: LATALIYAHA MAQAARKA AI (AI SKIN ADVISOR)
// --------------------------------------------------------------------------
function simulatePhotoUpload() {
  const statusEl = document.getElementById('photo-upload-status');
  statusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color: var(--gold-primary);"></i> Sawirka maqaarkaaga waa la baarayaa...`;
  setTimeout(() => {
    statusEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #28a745;"></i> AI Scan: 88% Dhalaal, Dhibco madow oo yar la ogaaday!`;
  }, 1200);
}

function runAISkinAnalysis() {
  const prompt = document.getElementById('ai-skin-prompt').value.toLowerCase();
  const resultDiv = document.getElementById('ai-skin-result');
  resultDiv.style.display = 'block';

  let identifiedIssues = ['Dhibco madow ka dib finanka', 'Dufan T-zone oo yar'];
  let recommendedActives = ['Niacinamide 10%', 'Sunscreen SPF 50'];
  let recommendedItem = products[0]; // Serum Niacinamide 10%

  if (prompt.includes('finan') || prompt.includes('acne')) {
    identifiedIssues = ['Finanka firfircoon & Sebum badan', 'Daloolo xirantay'];
    recommendedActives = ['Salicylic Acid 2%', 'Niacinamide 10% & Zinc'];
  } else if (prompt.includes('qallayl') || prompt.includes('dry')) {
    identifiedIssues = ['Biyo laaanta maqaarka', 'Barrier-ka oo xasaasi ah'];
    recommendedActives = ['Ceramides', 'Hyaluronic Acid'];
  } else if (prompt.includes('xasaasiyad') || prompt.includes('sensitive')) {
    identifiedIssues = ['Casaan & Diirid maqaarka ah'];
    recommendedActives = ['Centella Asiatica', 'Ceramides'];
  }

  resultDiv.innerHTML = `
    <div style="background: var(--bg-card); border: 1.5px solid var(--gold-primary); border-radius: var(--radius-md); padding: 1.5rem; animation: fadeIn 0.4s ease;">
      <h3 class="font-serif" style="font-size: 1.6rem; color: var(--emerald-dark); margin-bottom: 0.75rem;">
        <i class="fa-solid fa-robot" style="color: var(--gold-primary);"></i> Natjijada Baadhista AI: Lataliyaha Maqaarka
      </h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
        Faahfaahintaada ku basada: <em>"${prompt || 'Finan, dhibco madow, dufan badan ama qallayl'}"</em>
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-sm);">
          <strong style="color: var(--emerald-dark); font-size: 0.9rem;"><i class="fa-solid fa-magnifying-glass"></i> Waxyabaha La Ogaaday:</strong>
          <ul style="margin-left: 1.25rem; font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-primary);">
            ${identifiedIssues.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>
        <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-sm);">
          <strong style="color: var(--emerald-dark); font-size: 0.9rem;"><i class="fa-solid fa-prescription-bottle-medical"></i> Maaddooyinka Lagu Taliyay:</strong>
          <ul style="margin-left: 1.25rem; font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-primary);">
            ${recommendedActives.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; align-items: center; background: var(--gold-light); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
        <img src="${recommendedItem.image}" style="width: 65px; height: 65px; object-fit: cover; border-radius: var(--radius-sm);">
        <div style="flex-grow: 1;">
          <strong style="font-size: 0.95rem;">${recommendedItem.name}</strong>
          <span style="display: block; font-size: 0.85rem; color: var(--gold-primary); font-weight: 700;">${formatPrice(recommendedItem.price)}</span>
        </div>
        <button class="btn btn-gold btn-sm" onclick="addToCart('${recommendedItem.id}')">
          <i class="fa-solid fa-bag-shopping"></i> Ku Add Gaadhiga
        </button>
      </div>

      <p style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">
        Ogeysiis Caafimaad: Talooyinka AI-du waa kuwa aqooneed oo keliya. Ma aha talo dhakhtar rasmi ah.
      </p>
    </div>
  `;
}

// --------------------------------------------------------------------------
// ADVANCED AI ENGINE 2: LATALIYAHA LABBISKA AI (AI FASHION STYLIST)
// --------------------------------------------------------------------------
function runAIFashionStylist() {
  const occasion = document.getElementById('stylist-occasion').value;
  const result = document.getElementById('ai-stylist-result');
  result.style.display = 'block';

  let occasionTitle = 'Ciid';
  let diracChoice = products[1]; // Dirac Xariir ah
  let hijabChoice = products[3]; // Jalbaab Chiffon

  if (occasion === 'aroos') {
    occasionTitle = 'Aroos Soomaaliyeed';
  } else if (occasion === 'qalin-jabin') {
    occasionTitle = 'Qalin-jabin Jaamacad';
  } else if (occasion === 'shaqo') {
    occasionTitle = 'Shaqo & Xafiis';
    diracChoice = products[2]; // Cabaaya Dahabi ah
  } else if (occasion === 'jaamacad') {
    occasionTitle = 'Jaamacad';
    diracChoice = products[2];
  } else if (occasion === 'maalin-kasta') {
    occasionTitle = 'Maalin Kasta';
  }

  result.innerHTML = `
    <div style="background: var(--bg-card); border: 1.5px solid var(--gold-primary); border-radius: var(--radius-md); padding: 1.5rem; animation: fadeIn 0.4s ease;">
      <h3 class="font-serif" style="font-size: 1.6rem; color: var(--emerald-dark); margin-bottom: 0.75rem;">
        <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--gold-primary);"></i> Labiska AI-du Kuu Soo Jeedisay
      </h3>
      <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--gold-primary); margin-bottom: 1rem;">
        Munaasabadda: ${occasionTitle}
      </h4>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
        <div style="display: flex; gap: 0.75rem; background: var(--bg-tertiary); padding: 0.85rem; border-radius: var(--radius-sm); align-items: center;">
          <img src="${diracChoice.image}" style="width: 55px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);">
          <div>
            <strong style="font-size: 0.85rem; display: block;">${diracChoice.name}</strong>
            <span style="font-size: 0.8rem; color: var(--gold-primary); font-weight: 700;">${formatPrice(diracChoice.price)}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; background: var(--bg-tertiary); padding: 0.85rem; border-radius: var(--radius-sm); align-items: center;">
          <img src="${hijabChoice.image}" style="width: 55px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);">
          <div>
            <strong style="font-size: 0.85rem; display: block;">${hijabChoice.name}</strong>
            <span style="font-size: 0.8rem; color: var(--gold-primary); font-weight: 700;">${formatPrice(hijabChoice.price)}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 1rem;">
        <button class="btn btn-gold btn-sm" style="flex: 1;" onclick="addToCart('${diracChoice.id}'); addToCart('${hijabChoice.id}');">
          <i class="fa-solid fa-cart-plus"></i> Ku Add Labiskaan Gaadhiga
        </button>
        <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="navigateTo('outfit-builder')">
          <i class="fa-solid fa-sliders"></i> Ku Beddal Naqshadeeyaha
        </button>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// GLOBAL AI SEARCH ENGINE
// --------------------------------------------------------------------------
function handleGlobalSearch(query) {
  const resultsDiv = document.getElementById('global-search-results');
  if (!query.trim()) {
    resultsDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Geli eray aad raadinayso...</p>';
    return;
  }

  const q = query.toLowerCase();
  const matchedProducts = products.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  
  if (matchedProducts.length === 0) {
    resultsDiv.innerHTML = `
      <div style="padding: 1.5rem; background: var(--bg-tertiary); border-radius: var(--radius-md); text-align: center;">
        <p style="font-weight: 600;"> AI Assistant: Ma jiro alaab magaceeda yahay "${query}".</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">Try searching: "Serum", "Dirac", "Cabaaya", or "Jalbaab"</p>
      </div>
    `;
    return;
  }

  resultsDiv.innerHTML = matchedProducts.map(p => `
    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-md);">
      <img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);">
      <div style="flex-grow: 1;">
        <strong style="font-size: 0.9rem;">${p.name}</strong>
        <span style="display: block; font-size: 0.8rem; color: var(--gold-primary); font-weight: 700;">${formatPrice(p.price)}</span>
      </div>
      <button class="btn btn-gold btn-sm" onclick="addToCart('${p.id}')">Kuduud</button>
    </div>
  `).join('');
}

// QUIZ WIZARD (6 Detailed Somali Skin Questions)
const quizQuestions = [
  {
    q: "1. Sidee maqaarku dareemaa 3060 daqiiqo ka dib marka aad wejiga dhaqato?",
    options: [
      "Qallayl oo giagsan (Maqaarka Qallalan)",
      "Dufan badan oo dhalaalaya (Maqaarka Dufanka Leh)",
      "Dufan sanka/waji-sare oo keliya (Maqaar Isku Dhafan)",
      "Iska caadi ah oo dabacsan (Maqaar Caadi Ah)",
      "Redness ama gubasho yar (Maqaar Xasaasi Ah)"
    ]
  },
  {
    q: "2. Finan ama xabado intee jeer ayay wejigaaga ka soo baxaan?",
    options: [
      "Maalin kasta ama usbuuc walba (Finan Firfircoon)",
      "Xilliga caadada ama stress-ka oo keliya",
      "Marnaba ama aad u yar",
      "Marka aan isticmaalo alaab cusub (Xasaasiyad)"
    ]
  },
  {
    q: "3. Dhibco madow ama hyperpigmentation ma leedahay ka dib finanka?",
    options: [
      "Haa, dhibco madow oo badan oo aan jalafsanayn",
      "Haa, meelo yar yar oo madow",
      "Maya, maqaarkaygu mar walba waa siman yahay"
    ]
  },
  {
    q: "4. Daloolada (pores) wejigaaga sidee u muuqdaan?",
    options: [
      "Waa waweyn yihiin oo sanka & dhabannada ka muuqdaan",
      "Dhexdhexaad meelaha T-zone",
      "Aad u yar oo aan haba yaraatee muuqan"
    ]
  },
  {
    q: "5. Qorraxda markaad gasho sidee maqaarkaagu u reageeyaa?",
    options: [
      "Waa madoobaadaa oo dhibco madow soo baxaan (Hyperpigmentation)",
      "Waa diiraa oo casaadaa (Xasaasiyad Qorrax)",
      "Waxba kama beddelmo ama dufan ayaa ka soo baxa"
    ]
  },
  {
    q: "6. Waa maxay meesha ugu horeysa ee aad rabto inaad daryeesho?",
    options: [
      "Tirtirida dhibco madow & dhalaalinta maqaarka",
      "Yaraynta finanka & dufanka badan",
      "Dhowrida qoyanaanta & caafimaadka maqaarka",
      "Dawaynta xasaasiyadda & casaanka"
    ]
  }
];

let quizStep = 0;
let quizAnswers = [];

function initQuizWizard() {
  quizStep = 0;
  quizAnswers = [];
  renderQuizStep();
}

function evaluateQuizResults(answers) {
  const ansStr = answers.join(' ').toLowerCase();
  
  let skinType = 'Maqaar Isku Dhafan';
  let primaryConcern = 'Dhibco Madow & Dhalaalka';
  let recommendedActive = 'Niacinamide 10% & Sunscreen SPF 50';
  let cleanser = 'Gel Cleanser Jilicsan';
  let moisturizer = 'Oil-Free Gel Moisturizer';

  if (ansStr.includes('dufanka leh') || ansStr.includes('dufan badan') || ansStr.includes('yaraynta finanka')) {
    skinType = 'Maqaar Dufanka Leh';
    primaryConcern = 'Finan & Dufan Badan';
    recommendedActive = 'Salicylic Acid 2% + Niacinamide 10%';
    cleanser = 'Salicylic Acid Foam Cleanser';
    moisturizer = 'Lightweight Oil-Free Gel';
  } else if (ansStr.includes('qallalan') || ansStr.includes('qallayl')) {
    skinType = 'Maqaar Qallalan';
    primaryConcern = 'Biyo Laaanta Maqaarka & Giagsanaanta';
    recommendedActive = 'Hyaluronic Acid + Ceramides';
    cleanser = 'Hydrating Cream Cleanser';
    moisturizer = 'Rich Barrier Cream';
  } else if (ansStr.includes('xasaasi') || ansStr.includes('casaanka') || ansStr.includes('diiraa')) {
    skinType = 'Maqaar Xasaasi Ah';
    primaryConcern = 'Casaan, Gubasho & Xasaasiyad';
    recommendedActive = 'Centella Asiatica + Azelaic Acid';
    cleanser = 'Ultra-Gentle Micellar / Gel Cleanser';
    moisturizer = 'Soothing Sope Cream';
  }

  return { skinType, primaryConcern, recommendedActive, cleanser, moisturizer };
}

function renderQuizStep() {
  const container = document.getElementById('quiz-step-content');
  const fill = document.getElementById('quiz-progress');
  
  if (!container) return;

  if (quizStep >= quizQuestions.length) {
    if (fill) fill.style.width = '100%';

    const res = evaluateQuizResults(quizAnswers);

    // Save result to state & Supabase
    state.user.skinType = res.skinType;
    if (state.authUser && typeof updateUserProfile === 'function') {
      updateUserProfile({ skin_type: res.skinType });
    }

    container.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0; animation: fadeIn 0.4s ease;">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, var(--gold-primary), var(--emerald-dark)); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <i class="fa-solid fa-circle-check" style="font-size: 2.2rem; color: #FFF;"></i>
        </div>
        <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-primary);">Imtixaanka Waa La Dhaameeyay</span>
        <h3 class="font-serif" style="font-size: 2rem; margin: 0.3rem 0 0.5rem; color: var(--emerald-dark);">Natiijada Maqaarkaaga</h3>
        
        <div style="background: var(--gold-light); border: 1.5px solid var(--gold-primary); border-radius: var(--radius-md); padding: 1rem 1.5rem; display: inline-block; margin-bottom: 2rem;">
          <strong style="font-size: 1.2rem; color: var(--emerald-dark); display: block;">Nooca Maqaarka: ${res.skinType}</strong>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">Focus: ${res.primaryConcern}</span>
        </div>

        <div style="background: var(--bg-tertiary); padding: 1.75rem; border-radius: var(--radius-lg); text-align: left; margin-bottom: 2rem; border: 1px solid var(--border-color);">
          <h4 style="color: var(--emerald-dark); margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
            <i class="fa-solid fa-sun" style="color: var(--gold-primary);"></i> Jadwalka Subaxda (Morning Routine):
          </h4>
          <ol style="margin-left: 1.25rem; font-size: 0.9rem; line-height: 1.8; margin-bottom: 1.5rem;">
            <li><strong>Dhaqaha:</strong> ${res.cleanser}</li>
            <li><strong>Serum-ka:</strong> ${res.recommendedActive}</li>
            <li><strong>Qoyanta:</strong> ${res.moisturizer}</li>
            <li><strong>Sunscreen:</strong> Broad Spectrum SPF 50+ (Sidoo kale maqaarka madow wuxuu u baahan yahay SPF!)</li>
          </ol>

          <h4 style="color: var(--emerald-dark); margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
            <i class="fa-solid fa-moon" style="color: #7C3AED;"></i> Jadwalka Habeenka (Evening Routine):
          </h4>
          <ol style="margin-left: 1.25rem; font-size: 0.9rem; line-height: 1.8;">
            <li><strong>Cleanser-ka 1-aad:</strong> Micellar Water (ka saar boodhka & qurxinta)</li>
            <li><strong>Cleanser-ka 2-aad:</strong> ${res.cleanser}</li>
            <li><strong>Dawaynta:</strong> ${res.recommendedActive}</li>
            <li><strong>Kiriimka Habeenka:</strong> ${res.moisturizer}</li>
          </ol>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-gold" onclick="navigateTo('ai-skin-advisor')">
             Haddana Sawirka Wejiga ka Falanqee (AI Scan)
          </button>
          <button class="btn btn-primary" onclick="navigateTo('shop')">
             Eeg Alaabta Habkaaga Ku Habboon
          </button>
        </div>
      </div>
    `;
    return;
  }
  
  const q = quizQuestions[quizStep];
  if (fill) fill.style.width = `${((quizStep + 1) / quizQuestions.length) * 100}%`;
  
  container.innerHTML = `
    <span style="font-size: 0.8rem; font-weight: 700; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.08em;">Suaasha ${quizStep + 1} ee ${quizQuestions.length}</span>
    <h3 class="font-serif" style="font-size: 1.4rem; margin: 0.3rem 0 1.25rem; color: var(--emerald-dark);">${q.q}</h3>
    <div class="quiz-option-grid" style="display: grid; gap: 0.75rem;">
      ${q.options.map(opt => `
        <div class="quiz-option" onclick="answerQuiz('${opt.replace(/'/g, "\\'")}')" style="background: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem 1.25rem; cursor: pointer; transition: all 0.2s ease;">
          <strong style="font-size: 0.92rem; color: var(--text-primary);">${opt}</strong>
        </div>
      `).join('')}
    </div>
  `;
}

function answerQuiz(option) {
  quizAnswers.push(option);
  quizStep++;
  renderQuizStep();
}

// OUTFIT BUILDER
const wardrobeItems = {
  top: [
    { name: 'Dirac Xariir ah oo Soomaaliyeed iyo Garbasaar', price: 140, image: './images/dirac.jpg' },
    { name: 'Cabaaya Dahabi ah', price: 110, image: './images/hero.jpg' }
  ],
  hijab: [
    { name: 'Jalbaab Chiffon ah', price: 35, image: './images/hero.jpg' }
  ],
  bag: [
    { name: 'Shanta Gacanta ee Dahabiga ah', price: 85, image: './images/serum.jpg' }
  ]
};

let currentCategory = 'top';

function switchOutfitCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('#view-outfit-builder .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderOutfitPicker();
}

function renderOutfitPicker() {
  const container = document.getElementById('outfit-picker-grid');
  const items = wardrobeItems[currentCategory] || [];
  container.innerHTML = items.map(item => `
    <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; text-align: center; cursor: pointer; background: var(--bg-primary);" onclick="selectOutfitPiece('${currentCategory}', '${item.name}', ${item.price}, '${item.image}')">
      <img src="${item.image}" style="height: 90px; object-fit: contain; margin-bottom: 0.5rem;">
      <h5 style="font-size: 0.8rem; font-family: var(--font-serif);">${item.name}</h5>
      <span style="font-size: 0.75rem; color: var(--gold-primary); font-weight: 700;">${formatPrice(item.price)}</span>
    </div>
  `).join('');
}

function selectOutfitPiece(category, name, price, image) {
  state.outfitBuilder[category] = { name, price, image };
  document.getElementById(`slot-${category}-img`).src = image;
  document.getElementById(`slot-${category}-title`).innerText = name;
  document.getElementById(`slot-${category}-price`).innerText = formatPrice(price);
}

function saveCurrentOutfit() {
  alert(' Labiskaaga waa la kaysiyay!');
}

function addAllOutfitToCart() {
  state.cart.push({ id: 'outfit-top', name: state.outfitBuilder.top.name, price: state.outfitBuilder.top.price, image: state.outfitBuilder.top.image, qty: 1 });
  renderCart();
  toggleDrawer('cart-drawer');
}

// COLOR MATCHER
const colorPairings = {
  black: { title: 'Labiska Madowga Ah', matches: ['Jalbaab Chiffon ah (Cad)', 'Garbasaar Dahabi ah', 'Boorso Nude ah'] },
  emerald: { title: 'Labiska Cagaarka Ah', matches: ['Jalbaab Chiffon ah (Dahabi)', 'Garbasaar Cream ah', 'Boorso Bronze ah'] },
  navy: { title: 'Labiska Buluuga Ah', matches: ['Jalbaab Pink ah', 'Garbasaar Pearl ah', 'Boorso Dahabi ah'] }
};

function selectColorMatch(key) {
  const pair = colorPairings[key] || colorPairings.black;
  const output = document.getElementById('color-match-output');
  output.innerHTML = `
    <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-md); border-left: 4px solid var(--gold-primary);">
      <h4 style="font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 0.5rem;">${pair.title}</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">Midabbada si fiican isugu habboon labbiskaaga:</p>
      <ul style="margin-left: 1.25rem;">
        ${pair.matches.map(m => `<li style="font-weight: 600; margin-bottom: 0.35rem;"> ${m}</li>`).join('')}
      </ul>
    </div>
  `;
}

// SKIN TRACKER
function logSkinEntry() {
  const acne = document.getElementById('track-acne').value;
  const hydration = document.getElementById('track-hydration').value;
  const oiliness = document.getElementById('track-oiliness').value;
  
  const today = new Date().toISOString().split('T')[0];
  state.skinTrackerLogs.unshift({ date: today, acne, hydration, oiliness, note: 'La socodka horumarka' });
  renderSkinLogHistory();
  alert('Horumarka maqaarkaaga waa la kaydiyay!');
}

function renderSkinLogHistory() {
  const container = document.getElementById('skin-log-history');
  if (!container) return;
  container.innerHTML = state.skinTrackerLogs.map(log => `
    <div style="border-bottom: 1px solid var(--border-color); padding: 0.75rem 0; font-size: 0.85rem;">
      <div style="display: flex; justify-content: space-between; font-weight: 600;">
        <span> ${log.date}</span>
        <span style="color: var(--gold-primary);">Qoyanta: ${log.hydration}/10</span>
      </div>
      <p style="color: var(--text-secondary); margin-top: 0.25rem;">Finan: ${log.acne}/10 | Dufan: ${log.oiliness}/10</p>
    </div>
  `).join('');
}

// INGREDIENTS & CONCERNS
function renderIngredientLibrary() {
  const container = document.getElementById('ingredient-cards-grid');
  if (container) {
    container.innerHTML = ingredientsData.map(ing => `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
        <span class="product-badge" style="position: static; display: inline-block; margin-bottom: 0.5rem;">${ing.tag}</span>
        <h3 class="font-serif" style="font-size: 1.3rem; margin-bottom: 0.5rem;">${ing.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">${ing.benefit}</p>
        <div style="font-size: 0.8rem; background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-sm);">
          <strong style="color: #28a745;">Ciddii Isticmaalaysa:</strong> ${ing.whoUse}<br>
          <strong style="color: #c94a4a; margin-top: 0.25rem; display: inline-block;">Ciddii Ka Fogaanaysa:</strong> ${ing.whoAvoid}
        </div>
      </div>
    `).join('');
  }
}

function renderSkinConcernTab(key) {
  const concern = skinConcernsData[key] || skinConcernsData.acne;
  const container = document.getElementById('concern-detail-card');
  if (container) {
    container.innerHTML = `
      <h3 class="font-serif" style="font-size: 2rem; color: var(--emerald-dark); margin-bottom: 1rem;">${concern.title}</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div>
          <h4 style="color: var(--gold-primary); margin-bottom: 0.35rem;">Sababaha Ugu Waawaweyn:</h4>
          <p style="font-size: 0.9rem; margin-bottom: 1rem;">${concern.causes}</p>
          <h4 style="color: var(--gold-primary); margin-bottom: 0.35rem;">Ka Hortagga & Daryeelka:</h4>
          <p style="font-size: 0.9rem;">${concern.prevention}</p>
        </div>
        <div style="background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md);">
          <h4 style="color: var(--emerald-dark); margin-bottom: 0.5rem;">Qorshaha Daryeelka Maqaarka:</h4>
          <p style="font-size: 0.85rem;">${concern.routine}</p>
        </div>
      </div>
    `;
  }
}

// FORUM & BLOG
function renderForumPosts() {
  const container = document.getElementById('forum-posts-container');
  if (container) {
    container.innerHTML = forumPosts.map(post => `
      <div class="forum-card">
        <div class="forum-meta">
          <div class="user-avatar">${post.author[0]}</div>
          <div>
            <strong>${post.author}</strong>  <span>Qaybta: ${post.category}</span>
          </div>
        </div>
        <h3 class="font-serif" style="font-size: 1.3rem; margin-bottom: 0.5rem;">${post.title}</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">${post.content}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
          <div>${post.tags.map(t => `<span style="color: var(--gold-primary); margin-right: 0.5rem;">${t}</span>`).join('')}</div>
          <div>
            <button class="pill-btn" onclick="this.innerText = ' ' + (${post.likes} + 1)"><i class="fa-regular fa-heart"></i> ${post.likes}</button>
            <span style="margin-left: 0.75rem; color: var(--text-muted);"><i class="fa-regular fa-comment"></i> ${post.answersCount} jawaabood</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderBlogPosts() {
  const container = document.getElementById('blog-posts-grid');
  if (container) {
    container.innerHTML = blogPosts.map(post => `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
        <img src="${post.image}" style="width: 100%; height: 200px; object-fit: cover;">
        <div style="padding: 1.5rem;">
          <span style="font-size: 0.75rem; color: var(--gold-primary); font-weight: 700; text-transform: uppercase;">${post.category}  ${post.readTime}</span>
          <h3 class="font-serif" style="font-size: 1.3rem; margin: 0.5rem 0;">${post.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">${post.excerpt}</p>
          <button class="btn btn-outline btn-sm">Akhriso Maqaalka Dhammaantiis</button>
        </div>
      </div>
    `).join('');
  }
}

// CHECKOUT & ADMIN
function selectPayment(type, el) {
  document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const details = document.getElementById('payment-input-details');
  
  if (type === 'evc' || type === 'zaad') {
    details.innerHTML = `<input type="text" placeholder="Geli Nambarka Mobile-ka (${type.toUpperCase()}: +252...)" class="ai-search-input" style="width: 100%; border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-md); background: var(--bg-primary);">`;
  } else if (type === 'card') {
    details.innerHTML = `
      <input type="text" placeholder="Nambarka Kaarka (4000 0000 0000 0000)" class="ai-search-input" style="width: 100%; border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-md); background: var(--bg-primary); margin-bottom: 0.5rem;">
      <div style="display: flex; gap: 0.5rem;">
        <input type="text" placeholder="Bisha/Sanadka" class="ai-search-input" style="border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-md); background: var(--bg-primary); flex: 1;">
        <input type="text" placeholder="CVC" class="ai-search-input" style="border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-md); background: var(--bg-primary); flex: 1;">
      </div>
    `;
  } else {
    details.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Waxaa loo leexin doonaa PayPal express checkout.</p>`;
  }
}

async function processFinalOrder() {
  if (typeof createOrder === 'function' && state.authUser) {
    const order = await createOrder('evc');
    const orderNum = order?.order_number || 'ERAV-' + Math.floor(10000 + Math.random() * 90000);
    if (typeof showAuthToast === 'function') {
      showAuthToast(` Dalabkaaga Waa La Guddoomay! Nambarka: #${orderNum}`);
    } else {
      alert(` Dalabkaaga Waa La Guddoomay! Nambarka raadraaca waa #${orderNum}. Mahadsanid!`);
    }
  } else {
    alert(' Dalabkaaga Waa La Guddoomay! Nambarka raadraaca waa #ERAV-84920. Mahadsanid!');
  }
  state.cart = [];
  renderCart();
  navigateTo('home');
}

function renderAdminTable() {
  const container = document.getElementById('admin-inventory-rows');
  if (container) {
    container.innerHTML = products.map(p => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 0.75rem; font-weight: 600;">${p.name}</td>
        <td style="padding: 0.75rem;">${p.category}</td>
        <td style="padding: 0.75rem; color: var(--gold-primary); font-weight: 700;">$${p.price}</td>
        <td style="padding: 0.75rem;">42 ayaa kaydka ku jira</td>
        <td style="padding: 0.75rem;"><button class="pill-btn" onclick="alert('Wax ka baddal')">Wax ka baddal</button></td>
      </tr>
    `).join('');
  }
}

// USER DASHBOARD
async function renderDashboard() {
  if (!state.authUser) return;

  const nameEl = document.getElementById('dash-name');
  const emailEl = document.getElementById('dash-email');
  const avatarEl = document.getElementById('dash-avatar');
  const vipEl = document.getElementById('dash-vip');
  const pointsEl = document.getElementById('dash-points');
  const wishCountEl = document.getElementById('dash-wishlist-count');
  const ordersCountEl = document.getElementById('dash-orders-count');
  const ordersListEl = document.getElementById('dash-orders-list');

  // Populate profile
  const userName = state.user.name || state.authUser.email.split('@')[0];
  if (nameEl) nameEl.innerText = userName;
  if (emailEl) emailEl.innerText = state.authUser.email;
  if (avatarEl) avatarEl.innerText = userName.charAt(0).toUpperCase();
  if (vipEl) vipEl.innerText = state.user.vipTier || 'Cusub';
  if (pointsEl) pointsEl.innerText = state.user.points || 0;
  if (wishCountEl) wishCountEl.innerText = state.wishlist.length;

  // Load orders
  if (typeof loadUserOrders === 'function') {
    const orders = await loadUserOrders();
    if (ordersCountEl) ordersCountEl.innerText = orders.length;

    if (orders.length > 0 && ordersListEl) {
      ordersListEl.innerHTML = orders.slice(0, 5).map(o => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid var(--border-color);">
          <div>
            <strong style="font-size: 0.9rem; color: var(--emerald-dark);">#${o.order_number}</strong>
            <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">${new Date(o.created_at).toLocaleDateString('so-SO')}</span>
          </div>
          <div style="text-align: right;">
            <span style="font-weight: 700; color: var(--gold-primary);">${formatPrice(o.total)}</span>
            <span style="display: block; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; background: ${o.status === 'completed' ? '#d4edda' : '#fff3cd'}; color: ${o.status === 'completed' ? '#155724' : '#856404'}; margin-top: 4px;">${o.status === 'completed' ? 'La dhammeeyay' : 'Sugitaan'}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

// SKIN TRACKER with DB sync
const origLogSkinEntry = typeof logSkinEntry !== 'undefined' ? logSkinEntry : null;
function logSkinEntryWithSync() {
  const acne = document.getElementById('track-acne').value;
  const hydration = document.getElementById('track-hydration').value;
  const oiliness = document.getElementById('track-oiliness').value;
  
  const today = new Date().toISOString().split('T')[0];
  const entry = { date: today, acne, hydration, oiliness, note: 'La socodka horumarka' };
  state.skinTrackerLogs.unshift(entry);
  renderSkinLogHistory();
  
  if (typeof saveSkinLogToDB === 'function') saveSkinLogToDB(entry);
  if (typeof showAuthToast === 'function') {
    showAuthToast(' Horumarka maqaarkaaga waa la kaydiyay!');
  } else {
    alert('Horumarka maqaarkaaga waa la kaydiyay!');
  }
}

