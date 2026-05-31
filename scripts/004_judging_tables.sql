-- Judging system tables

CREATE TABLE IF NOT EXISTS judging_criteria (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  max_score   NUMERIC(5,1) NOT NULL DEFAULT 10,
  color       TEXT NOT NULL DEFAULT '#4ade80',
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judging_tiers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  pts         NUMERIC(4,1) NOT NULL DEFAULT 1.0,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judging_elements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  tier_code    TEXT NOT NULL,
  element_type TEXT NOT NULL CHECK (element_type IN ('static','dynamic')),
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judging_deductions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  pts        NUMERIC(4,1) NOT NULL DEFAULT 1.0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judging_ranks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_score  INT NOT NULL DEFAULT 0,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT '#888',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE judging_criteria    ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_tiers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_elements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_deductions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_ranks       ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public_read_judging_criteria"   ON judging_criteria   FOR SELECT USING (true);
  CREATE POLICY "public_read_judging_tiers"      ON judging_tiers      FOR SELECT USING (true);
  CREATE POLICY "public_read_judging_elements"   ON judging_elements   FOR SELECT USING (true);
  CREATE POLICY "public_read_judging_deductions" ON judging_deductions FOR SELECT USING (true);
  CREATE POLICY "public_read_judging_ranks"      ON judging_ranks      FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "admin_all_judging_criteria"   ON judging_criteria   FOR ALL
    USING (auth.uid() IS NOT NULL AND (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true');
  CREATE POLICY "admin_all_judging_tiers"      ON judging_tiers      FOR ALL
    USING (auth.uid() IS NOT NULL AND (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true');
  CREATE POLICY "admin_all_judging_elements"   ON judging_elements   FOR ALL
    USING (auth.uid() IS NOT NULL AND (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true');
  CREATE POLICY "admin_all_judging_deductions" ON judging_deductions FOR ALL
    USING (auth.uid() IS NOT NULL AND (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true');
  CREATE POLICY "admin_all_judging_ranks"      ON judging_ranks      FOR ALL
    USING (auth.uid() IS NOT NULL AND (auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed data
INSERT INTO judging_criteria (name, max_score, color, sort_order) VALUES
  ('Статика',       25, '#4ade80', 1),
  ('Динамика',      25, '#ff6a3d', 2),
  ('Техника',       20, '#5ad1ff', 3),
  ('Связки и поток',15, '#9b8cff', 4),
  ('Оригинальность',10, '#4ade80', 5),
  ('Презентация',    5, '#ff7a96', 6)
ON CONFLICT DO NOTHING;

INSERT INTO judging_tiers (code, label, pts, sort_order) VALUES
  ('A', 'Базовый', 1.0, 1),
  ('B', 'Средний', 2.0, 2),
  ('C', 'Сложный', 3.5, 3),
  ('D', 'Эксперт', 5.0, 4),
  ('E', 'Элита',   7.0, 5)
ON CONFLICT (code) DO NOTHING;

INSERT INTO judging_elements (name, tier_code, element_type, sort_order) VALUES
  ('L-sit / уголок',            'A', 'static',  1),
  ('Back lever (задний вис)',    'B', 'static',  2),
  ('Human flag (флаг)',          'C', 'static',  3),
  ('Front lever (передний вис)', 'C', 'static',  4),
  ('90° hold (упор углом)',      'D', 'static',  5),
  ('Planche (планш)',            'D', 'static',  6),
  ('One-arm handstand',          'D', 'static',  7),
  ('Maltese (мальтез)',          'E', 'static',  8),
  ('Victorian',                  'E', 'static',  9),
  ('Muscle-up (выход силой)',    'A', 'dynamic', 1),
  ('Explosive pull / 360 pull',  'B', 'dynamic', 2),
  ('Muscle-up 360',              'C', 'dynamic', 3),
  ('Shrimp flip',                'C', 'dynamic', 4),
  ('Geinger',                    'D', 'dynamic', 5),
  ('Slap muscle-up ×2',          'D', 'dynamic', 6),
  ('540 muscle-up',              'D', 'dynamic', 7),
  ('Bar flip / backflip',        'E', 'dynamic', 8),
  ('Switch blade',               'E', 'dynamic', 9)
ON CONFLICT DO NOTHING;

INSERT INTO judging_deductions (name, pts, sort_order) VALUES
  ('Срыв с элемента',            2.0, 1),
  ('Падение / касание земли',    3.0, 2),
  ('Незачтённый элемент',        1.0, 3),
  ('Нарушение тайминга (за 5с)', 0.5, 4)
ON CONFLICT DO NOTHING;

INSERT INTO judging_ranks (min_score, name, color, sort_order) VALUES
  (90, 'ЭЛИТА',    '#4ade80', 1),
  (75, 'ПРОФИ',    '#5ad1ff', 2),
  (60, 'УМЕЛЫЙ',   '#9b8cff', 3),
  (40, 'ЛЮБИТЕЛЬ', '#ff6a3d', 4),
  (0,  'НОВИЧОК',  '#888888', 5)
ON CONFLICT DO NOTHING;
