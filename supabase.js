/* ==========================================================================
   BILIC - Supabase Integration Layer
   Connects to Supabase for Auth, Products, Cart, Wishlist, Orders, Profiles
   ========================================================================== */

// ── Supabase Configuration ──────────────────────────────────────────────────
const SUPABASE_URL = 'https://zhsyovdebvhrannbgqpg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpoc3lvdmRlYnZocmFubmJncXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NzE5MDcsImV4cCI6MjEwMDI0NzkwN30.e_AIOO-WOpLfv0fTU2alwuwiPI-lgbHYXYWUxfZKNUs';

let supabaseClient = null;

function initSupabase() {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');
    return true;
  }
  console.warn('⚠️ Supabase SDK not loaded yet');
  return false;
}

// ── Helper: REST API fetch wrapper ──────────────────────────────────────────
async function supabaseRest(table, { method = 'GET', body = null, query = '', headers = {} } = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  const token = supabaseClient ? (await supabaseClient.auth.getSession())?.data?.session?.access_token : null;

  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Supabase REST error [${method} ${table}]:`, res.status, errText);
    return null;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}


// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════

async function supaSignUp(email, password, fullName) {
  if (!supabaseClient) return { error: { message: 'Supabase not initialized' } };

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });

  if (!error && data.user) {
    // Create profile row
    await supabaseRest('profiles', {
      method: 'POST',
      body: {
        id: data.user.id,
        full_name: fullName,
        email: email,
        vip_tier: 'Cusub',
        points: 0
      },
      headers: { 'Prefer': 'return=representation,resolution=ignore-duplicates' }
    });
  }

  return { data, error };
}

async function supaLogin(email, password) {
  if (!supabaseClient) return { error: { message: 'Supabase not initialized' } };
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

async function supaLogout() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  state.authUser = null;
  state.user = { name: '', skinType: '', size: '', points: 0, vipTier: 'Cusub', savedRoutines: [], savedOutfits: [] };
  updateAuthUI();
  navigateTo('home');
}

async function supaResetPassword(email) {
  if (!supabaseClient) return { error: { message: 'Supabase not initialized' } };
  return await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });
}

async function supaGetCurrentUser() {
  if (!supabaseClient) return null;
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

// ── Auth State Listener ─────────────────────────────────────────────────────

function setupAuthListener() {
  if (!supabaseClient) return;

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event);

    if (event === 'SIGNED_IN' && session?.user) {
      state.authUser = session.user;
      await loadUserProfile(session.user.id);
      await loadCartFromDB();
      await loadWishlistFromDB();
      updateAuthUI();
    } else if (event === 'SIGNED_OUT') {
      state.authUser = null;
      updateAuthUI();
    }
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// USER PROFILE
// ═══════════════════════════════════════════════════════════════════════════

async function loadUserProfile(userId) {
  const rows = await supabaseRest('profiles', {
    query: `?id=eq.${userId}&select=*`
  });

  if (rows && rows.length > 0) {
    const profile = rows[0];
    state.user.name = profile.full_name || '';
    state.user.skinType = profile.skin_type || '';
    state.user.size = profile.size || 'Dhexdhexaad (M)';
    state.user.points = profile.points || 0;
    state.user.vipTier = profile.vip_tier || 'Cusub';
  }
}

async function updateUserProfile(updates) {
  if (!state.authUser) return;
  await supabaseRest('profiles', {
    method: 'PATCH',
    query: `?id=eq.${state.authUser.id}`,
    body: updates,
    headers: { 'Prefer': 'return=minimal' }
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTS (Read from Supabase if table exists, fallback to local)
// ═══════════════════════════════════════════════════════════════════════════

async function loadProductsFromDB() {
  try {
    const rows = await supabaseRest('products', {
      query: '?select=*&order=created_at.desc'
    });

    if (rows && rows.length > 0) {
      // Merge DB products into local products array
      products.length = 0;
      rows.forEach(row => {
        products.push({
          id: row.id,
          name: row.name,
          category: row.category,
          price: row.price,
          rating: row.rating || 4.8,
          reviewsCount: row.reviews_count || 0,
          image: row.image_url || './images/serum.jpg',
          badge: row.badge || '',
          desc: row.description || ''
        });
      });
      console.log(`✅ ${products.length} products loaded from Supabase`);
      renderBestSellers();
      renderShopCatalog();
      return true;
    }
  } catch (e) {
    console.log('ℹ️ Products table not found, using local data');
  }
  return false;
}

async function saveProductToDB(product) {
  return await supabaseRest('products', {
    method: 'POST',
    body: {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      image_url: product.image,
      badge: product.badge,
      description: product.desc
    },
    headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' }
  });
}

// Seed local products to DB
async function seedProductsToDB() {
  for (const p of products) {
    await saveProductToDB(p);
  }
  console.log('✅ Products seeded to Supabase');
}


// ═══════════════════════════════════════════════════════════════════════════
// CART (Persisted to Supabase)
// ═══════════════════════════════════════════════════════════════════════════

async function loadCartFromDB() {
  if (!state.authUser) return;

  try {
    const rows = await supabaseRest('cart_items', {
      query: `?user_id=eq.${state.authUser.id}&select=*`
    });

    if (rows && rows.length > 0) {
      state.cart = rows.map(row => ({
        id: row.product_id,
        name: row.product_name,
        price: row.price,
        image: row.image_url || './images/serum.jpg',
        category: row.category || '',
        qty: row.quantity
      }));
      renderCart();
    }
  } catch (e) {
    console.log('ℹ️ Cart table not available');
  }
}

async function syncCartToDB() {
  if (!state.authUser) return;

  try {
    // Delete existing cart items for this user
    await supabaseRest('cart_items', {
      method: 'DELETE',
      query: `?user_id=eq.${state.authUser.id}`
    });

    // Insert current cart items
    if (state.cart.length > 0) {
      const cartRows = state.cart.map(item => ({
        user_id: state.authUser.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        image_url: item.image,
        category: item.category || '',
        quantity: item.qty
      }));

      await supabaseRest('cart_items', {
        method: 'POST',
        body: cartRows,
        headers: { 'Prefer': 'return=minimal' }
      });
    }
  } catch (e) {
    console.log('ℹ️ Cart sync skipped');
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// WISHLIST (Persisted to Supabase)
// ═══════════════════════════════════════════════════════════════════════════

async function loadWishlistFromDB() {
  if (!state.authUser) return;

  try {
    const rows = await supabaseRest('wishlist_items', {
      query: `?user_id=eq.${state.authUser.id}&select=product_id`
    });

    if (rows) {
      state.wishlist = rows.map(r => r.product_id);
      document.getElementById('wishlist-count').innerText = state.wishlist.length;
      renderBestSellers();
      renderShopCatalog();
      renderWishlist();
    }
  } catch (e) {
    console.log('ℹ️ Wishlist table not available');
  }
}

async function syncWishlistToDB() {
  if (!state.authUser) return;

  try {
    await supabaseRest('wishlist_items', {
      method: 'DELETE',
      query: `?user_id=eq.${state.authUser.id}`
    });

    if (state.wishlist.length > 0) {
      const rows = state.wishlist.map(pid => ({
        user_id: state.authUser.id,
        product_id: pid
      }));

      await supabaseRest('wishlist_items', {
        method: 'POST',
        body: rows,
        headers: { 'Prefer': 'return=minimal' }
      });
    }
  } catch (e) {
    console.log('ℹ️ Wishlist sync skipped');
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════════════

async function createOrder(paymentMethod) {
  if (!state.authUser) return null;

  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const orderNumber = 'BILIC-' + Math.floor(10000 + Math.random() * 90000);

  try {
    const order = await supabaseRest('orders', {
      method: 'POST',
      body: {
        user_id: state.authUser.id,
        order_number: orderNumber,
        total: subtotal,
        currency: state.currency,
        payment_method: paymentMethod,
        status: 'pending',
        items: state.cart
      }
    });

    // Clear cart after order
    state.cart = [];
    await syncCartToDB();
    renderCart();

    return order ? order[0] : { order_number: orderNumber };
  } catch (e) {
    console.log('ℹ️ Orders table not available, processing locally');
    return { order_number: orderNumber };
  }
}

async function loadUserOrders() {
  if (!state.authUser) return [];

  try {
    const rows = await supabaseRest('orders', {
      query: `?user_id=eq.${state.authUser.id}&select=*&order=created_at.desc`
    });
    return rows || [];
  } catch (e) {
    return [];
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// SKIN TRACKER (Persisted)
// ═══════════════════════════════════════════════════════════════════════════

async function saveSkinLogToDB(logEntry) {
  if (!state.authUser) return;

  try {
    await supabaseRest('skin_logs', {
      method: 'POST',
      body: {
        user_id: state.authUser.id,
        date: logEntry.date,
        acne: logEntry.acne,
        hydration: logEntry.hydration,
        oiliness: logEntry.oiliness,
        note: logEntry.note
      }
    });
  } catch (e) {
    console.log('ℹ️ Skin logs table not available');
  }
}

async function loadSkinLogsFromDB() {
  if (!state.authUser) return;

  try {
    const rows = await supabaseRest('skin_logs', {
      query: `?user_id=eq.${state.authUser.id}&select=*&order=date.desc&limit=30`
    });

    if (rows && rows.length > 0) {
      state.skinTrackerLogs = rows.map(r => ({
        date: r.date,
        acne: r.acne,
        hydration: r.hydration,
        oiliness: r.oiliness,
        note: r.note
      }));
      renderSkinLogHistory();
    }
  } catch (e) {
    console.log('ℹ️ Skin logs not available');
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════════════════

async function submitReview(productId, rating, comment) {
  if (!state.authUser) {
    showAuthToast('Fadlan gal koontadaada si aad uga faalloonto alaabta.');
    return;
  }

  try {
    await supabaseRest('reviews', {
      method: 'POST',
      body: {
        user_id: state.authUser.id,
        product_id: productId,
        rating,
        comment,
        author_name: state.user.name || 'Macmiil'
      }
    });
    showAuthToast('✅ Faallodaada waa la diiwaan geliyay!');
  } catch (e) {
    console.log('ℹ️ Reviews table not available');
  }
}

async function loadProductReviews(productId) {
  try {
    const rows = await supabaseRest('reviews', {
      query: `?product_id=eq.${productId}&select=*&order=created_at.desc`
    });
    return rows || [];
  } catch (e) {
    return [];
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function updateAuthUI() {
  const userBtn = document.querySelector('[onclick="navigateTo(\'dashboard\')"]');
  const adminBtn = document.getElementById('nav-admin-btn');
  const authIndicator = document.getElementById('auth-status-indicator');

  if (state.authUser) {
    // User is logged in
    if (userBtn) {
      userBtn.innerHTML = `<i class="fa-solid fa-user-check"></i>`;
      userBtn.title = state.user.name || state.authUser.email;
    }
    if (authIndicator) {
      authIndicator.style.display = 'flex';
      authIndicator.innerHTML = `
        <span style="font-size: 0.75rem; color: var(--gold-primary); font-weight: 600;">
          <i class="fa-solid fa-circle" style="font-size: 6px; color: #28a745; vertical-align: middle; margin-right: 4px;"></i>
          ${state.user.name || state.authUser.email.split('@')[0]}
        </span>
        <button class="pill-btn" onclick="supaLogout()" style="font-size: 0.7rem; padding: 2px 8px; margin-left: 6px;">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      `;
    }
  } else {
    // User is logged out
    if (userBtn) {
      userBtn.innerHTML = `<i class="fa-regular fa-user"></i>`;
      userBtn.title = 'Gal Koontadaada';
    }
    if (authIndicator) {
      authIndicator.style.display = 'none';
    }
  }
}

function showAuthToast(message) {
  let toast = document.getElementById('auth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'auth-toast';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      background: var(--emerald-dark, #0D2818); color: #FAF8F5; padding: 0.85rem 1.5rem;
      border-radius: 12px; font-size: 0.9rem; z-index: 10000;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3); font-weight: 500;
      animation: fadeIn 0.3s ease; display: flex; align-items: center; gap: 0.5rem;
      border: 1px solid rgba(197, 160, 89, 0.3);
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.style.display = 'flex';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}


// ═══════════════════════════════════════════════════════════════════════════
// AUTH FORM HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

async function handleSignUp(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#signup-name').value.trim();
  const email = form.querySelector('#signup-email').value.trim();
  const password = form.querySelector('#signup-password').value;
  const confirmPassword = form.querySelector('#signup-confirm-password').value;

  if (!name || !email || !password) {
    showAuthToast('⚠️ Fadlan buuxi dhammaan meelaha.');
    return;
  }
  if (password !== confirmPassword) {
    showAuthToast('⚠️ Furaha sirta ahi isma mid ahayn.');
    return;
  }
  if (password.length < 6) {
    showAuthToast('⚠️ Furaha sirta ahi waa inuu ugu yaraan 6 xaraf ahaadaa.');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Waa la sameynayaa...';

  const { data, error } = await supaSignUp(email, password, name);

  if (error) {
    showAuthToast(`❌ ${error.message}`);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '✨ Samee Koontada';
    return;
  }

  showAuthToast('✅ Koontadaada waa la sameeyay! Fadlan hubi emailkaaga.');
  submitBtn.disabled = false;
  submitBtn.innerHTML = '✨ Samee Koontada';

  // Switch to login view
  setTimeout(() => switchAuthTab('login'), 1500);
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#login-email').value.trim();
  const password = form.querySelector('#login-password').value;

  if (!email || !password) {
    showAuthToast('⚠️ Fadlan geli emailka iyo furaha sirta.');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Waa la galayaa...';

  const { data, error } = await supaLogin(email, password);

  if (error) {
    showAuthToast(`❌ ${error.message}`);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🔐 Gal Koontadaada';
    return;
  }

  showAuthToast(`✅ Ku soo dhawoow, ${data.user.user_metadata?.full_name || email.split('@')[0]}!`);
  submitBtn.disabled = false;
  submitBtn.innerHTML = '🔐 Gal Koontadaada';

  navigateTo('home');
}

async function handleForgotPassword(e) {
  e.preventDefault();
  const email = e.target.querySelector('#reset-email').value.trim();

  if (!email) {
    showAuthToast('⚠️ Fadlan geli emailka.');
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Waa la diraysaa...';

  const { error } = await supaResetPassword(email);

  if (error) {
    showAuthToast(`❌ ${error.message}`);
  } else {
    showAuthToast('✅ Link cusub ayaa loo diray emailkaaga!');
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '📧 Dir Linkka Cusub';
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));

  const target = document.getElementById(`auth-${tab}`);
  const btn = document.querySelector(`[data-auth-tab="${tab}"]`);
  if (target) target.style.display = 'block';
  if (btn) btn.classList.add('active');
}


// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

async function initSupabaseApp() {
  // Wait for SDK to load
  let attempts = 0;
  while (!initSupabase() && attempts < 20) {
    await new Promise(r => setTimeout(r, 250));
    attempts++;
  }

  if (!supabaseClient) {
    console.warn('⚠️ Supabase SDK failed to load. Running in offline mode.');
    showAuthToast('⚠️ Database connection: Offline mode');
    return;
  }

  // Setup auth listener
  setupAuthListener();

  // Check existing session
  const user = await supaGetCurrentUser();
  if (user) {
    state.authUser = user;
    await loadUserProfile(user.id);
    await loadCartFromDB();
    await loadWishlistFromDB();
    await loadSkinLogsFromDB();
    updateAuthUI();
    console.log('✅ Existing session restored for:', user.email);
  }

  // Try loading products from DB (fallback to local)
  await loadProductsFromDB();

  // Show connection status
  showAuthToast('✅ Supabase waa la xiriray!');
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Ensure state exists safely
  if (typeof state !== 'undefined') {
    if (!state.authUser) state.authUser = null;
  }

  // Initialize Supabase after a short delay to let SDK load
  setTimeout(initSupabaseApp, 500);
});
