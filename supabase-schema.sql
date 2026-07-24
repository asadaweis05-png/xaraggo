-- ==========================================================================
-- BILIC Platform - Supabase Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================================================

-- ══════════════════════════════════════════════════════════════════════════
-- 1. PROFILES TABLE (extends auth.users)
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  skin_type TEXT,
  size TEXT DEFAULT 'Dhexdhexaad (M)',
  vip_tier TEXT DEFAULT 'Cusub',
  points INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);


-- ══════════════════════════════════════════════════════════════════════════
-- 2. PRODUCTS TABLE
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  image_url TEXT,
  badge TEXT,
  description TEXT,
  stock INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (public read, admin write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone can read products
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

-- Authenticated users can insert (for seeding)
CREATE POLICY "Authenticated can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- ══════════════════════════════════════════════════════════════════════════
-- 3. CART ITEMS TABLE
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT,
  price NUMERIC(10,2),
  image_url TEXT,
  category TEXT,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════════════
-- 4. WISHLIST ITEMS TABLE
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS wishlist_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist" ON wishlist_items
  FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════════════
-- 5. ORDERS TABLE
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  items JSONB,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════════════
-- 6. REVIEWS TABLE
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read reviews
CREATE POLICY "Public can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════════════
-- 7. SKIN LOGS TABLE
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS skin_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  acne INTEGER,
  hydration INTEGER,
  oiliness INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own skin logs" ON skin_logs
  FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════════════
-- 8. SEED DEFAULT PRODUCTS
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO products (id, name, category, price, rating, reviews_count, image_url, badge, description) VALUES
  ('p1', 'Serum Niacinamide 10%', 'daryeelka-maqaarka', 38.00, 4.9, 128, './images/serum.jpg', 'Ugu Iibka Badan', 'Laga hortago dhibcaha madow, finanka iyo saliidda badan iyadoo la adeegsanayo Niacinamide 10% & Zinc.'),
  ('p2', 'Dirac Xariir ah oo Soomaaliyeed iyo Garbasaar', 'dirac', 140.00, 5.0, 94, './images/dirac.jpg', 'Khadka Boqortooyada', 'Dirac xariir ah oo Soomaaliyeed oo lagu qurxiyay toosinta dahabiga ah iyo Garbasaar u dhigma.'),
  ('p3', 'Cabaaya Dahabi ah', 'abayas', 110.00, 4.8, 62, './images/hero.jpg', 'Cusub', 'Cabaaya Dahabi ah oo ka samaysan xariir jilicsan iyo Garbasaar u dhigma.'),
  ('p4', 'Jalbaab Chiffon ah', 'hijabs', 35.00, 4.9, 210, './images/hero.jpg', 'Moodada Hadda', 'Jalbaab Chiffon ah oo aan ka siibanyaan oo ku habboon dhammaan midabbada.')
ON CONFLICT (id) DO NOTHING;
