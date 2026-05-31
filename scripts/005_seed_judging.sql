-- ============================================================
-- Скрипт заполнения таблиц системы судейства
-- Запустить в Supabase Dashboard → SQL Editor
-- Предварительно выполнить: 004_judging_tables.sql
-- ============================================================

-- Очистка перед заполнением (опционально)
-- TRUNCATE judging_criteria, judging_tiers, judging_elements,
--          judging_deductions, judging_ranks RESTART IDENTITY CASCADE;

-- ── Критерии оценки ──────────────────────────────────────────
INSERT INTO judging_criteria (name, max_score, color, sort_order) VALUES
  ('Статика',        25, '#4ade80', 1),
  ('Динамика',       25, '#ff6a3d', 2),
  ('Техника',        20, '#5ad1ff', 3),
  ('Связки и поток', 15, '#9b8cff', 4),
  ('Оригинальность', 10, '#4ade80', 5),
  ('Презентация',     5, '#ff7a96', 6)
ON CONFLICT DO NOTHING;

-- ── Тиры сложности ───────────────────────────────────────────
INSERT INTO judging_tiers (code, label, pts, sort_order) VALUES
  ('A', 'Базовый', 1.0, 1),
  ('B', 'Средний', 2.0, 2),
  ('C', 'Сложный', 3.5, 3),
  ('D', 'Эксперт', 5.0, 4),
  ('E', 'Элита',   7.0, 5)
ON CONFLICT (code) DO UPDATE SET
  label      = EXCLUDED.label,
  pts        = EXCLUDED.pts,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ── Элементы: статика ────────────────────────────────────────
INSERT INTO judging_elements (name, tier_code, element_type, sort_order) VALUES
  ('L-sit / уголок',             'A', 'static', 1),
  ('Back lever (задний вис)',     'B', 'static', 2),
  ('Human flag (флаг)',           'C', 'static', 3),
  ('Front lever (передний вис)',  'C', 'static', 4),
  ('90° hold (упор углом)',       'D', 'static', 5),
  ('Planche (планш)',             'D', 'static', 6),
  ('One-arm handstand',           'D', 'static', 7),
  ('Maltese (мальтез)',           'E', 'static', 8),
  ('Victorian',                   'E', 'static', 9)
ON CONFLICT DO NOTHING;

-- ── Элементы: динамика ───────────────────────────────────────
INSERT INTO judging_elements (name, tier_code, element_type, sort_order) VALUES
  ('Muscle-up (выход силой)',     'A', 'dynamic', 1),
  ('Explosive pull / 360 pull',   'B', 'dynamic', 2),
  ('Muscle-up 360',               'C', 'dynamic', 3),
  ('Shrimp flip',                 'C', 'dynamic', 4),
  ('Geinger',                     'D', 'dynamic', 5),
  ('Slap muscle-up ×2',           'D', 'dynamic', 6),
  ('540 muscle-up',               'D', 'dynamic', 7),
  ('Bar flip / backflip',         'E', 'dynamic', 8),
  ('Switch blade',                'E', 'dynamic', 9)
ON CONFLICT DO NOTHING;

-- ── Сбавки ───────────────────────────────────────────────────
INSERT INTO judging_deductions (name, pts, sort_order) VALUES
  ('Срыв с элемента',             2.0, 1),
  ('Падение / касание земли',     3.0, 2),
  ('Незачтённый элемент',         1.0, 3),
  ('Нарушение тайминга (за 5 с)', 0.5, 4)
ON CONFLICT DO NOTHING;

-- ── Ранги ────────────────────────────────────────────────────
INSERT INTO judging_ranks (min_score, name, color, sort_order) VALUES
  (90, 'ЭЛИТА',    '#4ade80', 1),
  (75, 'ПРОФИ',    '#5ad1ff', 2),
  (60, 'УМЕЛЫЙ',   '#9b8cff', 3),
  (40, 'ЛЮБИТЕЛЬ', '#ff6a3d', 4),
  (0,  'НОВИЧОК',  '#888888', 5)
ON CONFLICT DO NOTHING;

-- ── Проверка ─────────────────────────────────────────────────
SELECT 'criteria'   AS table_name, COUNT(*) AS rows FROM judging_criteria   UNION ALL
SELECT 'tiers',                    COUNT(*)          FROM judging_tiers      UNION ALL
SELECT 'elements',                 COUNT(*)          FROM judging_elements   UNION ALL
SELECT 'deductions',               COUNT(*)          FROM judging_deductions UNION ALL
SELECT 'ranks',                    COUNT(*)          FROM judging_ranks;
