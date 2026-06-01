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
CREATE POLICY "auth_delete_teachers" ON teachers FOR DELETE TO authenticated USING (true);

CREATE TABLE students (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  gender TEXT,
  age INTEGER,
  school TEXT,
  grade TEXT,
  course TEXT,
  start_date TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_select_students" ON students FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_students" ON students FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_students" ON students FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_students" ON students FOR DELETE TO authenticated USING (true);

CREATE TABLE courses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_name TEXT NOT NULL,
  description TEXT,
  sessions INTEGER,
  start_date TEXT,
  end_date TEXT,
  teacher TEXT,
  classroom TEXT,
  fee TEXT,
  materials TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_select_courses" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_courses" ON courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_courses" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_courses" ON courses FOR DELETE TO authenticated USING (true);

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
