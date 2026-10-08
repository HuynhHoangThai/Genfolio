-- ==============================================================================
-- Genfolio — Database Schema (PostgreSQL & Supabase compatible)
-- ==============================================================================

-- 1. Bảng lưu trữ portfolio của người dùng tạo ra (User Portfolios)
CREATE TABLE IF NOT EXISTS user_portfolios (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(128),
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  title VARCHAR(255),
  template VARCHAR(64) NOT NULL,
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_email ON user_portfolios(user_email);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_template ON user_portfolios(template);

-- 2. Bảng lưu trữ portfolio chia sẻ trực tiếp qua liên kết (Shared Portfolios)
CREATE TABLE IF NOT EXISTS shared_portfolios (
  id VARCHAR(64) PRIMARY KEY,
  portfolio_id VARCHAR(64),
  user_email VARCHAR(255),
  template VARCHAR(64) NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shared_portfolios_id ON shared_portfolios(id);
CREATE INDEX IF NOT EXISTS idx_shared_portfolios_expires_at ON shared_portfolios(expires_at);

-- 3. Hỗ trợ RLS nếu sử dụng Supabase
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_portfolios ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai với portfolio công khai hoặc shared
CREATE POLICY IF NOT EXISTS "Allow public read on public user portfolios"
  ON user_portfolios FOR SELECT
  USING (is_public = true);

CREATE POLICY IF NOT EXISTS "Allow public read on shared portfolios"
  ON shared_portfolios FOR SELECT
  USING (expires_at IS NULL OR expires_at > NOW());
