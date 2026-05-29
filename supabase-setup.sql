-- 1. 在 Supabase Dashboard → SQL Editor 中运行此脚本
-- 2. 然后到 Authentication → Users → Add User 创建管理员账号（用于登录 admin.html）

CREATE TABLE inquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  parent_name TEXT NOT NULL,
  parent_age INTEGER,
  phone TEXT NOT NULL,
  email TEXT,
  child_age INTEGER,
  school TEXT,
  grade TEXT,
  academic_level TEXT,
  expectation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_can_insert" ON inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "auth_can_select" ON inquiries
  FOR SELECT
  TO authenticated
  USING (true);
