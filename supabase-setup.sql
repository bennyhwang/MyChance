-- 1. 在 Supabase Dashboard → SQL Editor 中运行此脚本
-- 2. 然后到 Authentication → Users → Add User 创建管理员账号（用于登录 admin.html）

CREATE TABLE teachers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  gender TEXT,
  age INTEGER,
  qualification TEXT,
  achievement TEXT,
  specialty TEXT,
  start_date TEXT,
  subject TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_select_teachers" ON teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_teachers" ON teachers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_teachers" ON teachers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

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

CREATE POLICY "auth_can_update" ON inquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 如果你已经运行过上面的建表语句，只需运行下面这行添加回访列：
-- ALTER TABLE inquiries ADD COLUMN follow_up TEXT;
