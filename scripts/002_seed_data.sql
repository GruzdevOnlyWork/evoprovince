-- Seed schedule data
INSERT INTO schedule (day_of_week, time_slot, trainer, training_type) VALUES
('Понедельник', '10:00 - 12:00', 'Алексей Иванов', 'Групповая тренировка'),
('Понедельник', '18:00 - 20:00', 'Дмитрий Петров', 'Продвинутый уровень'),
('Вторник', '10:00 - 12:00', 'Сергей Смирнов', 'Индивидуальные занятия'),
('Вторник', '19:00 - 21:00', 'Алексей Иванов', 'Подготовка к турнирам'),
('Среда', '10:00 - 12:00', 'Дмитрий Петров', 'Групповая тренировка'),
('Среда', '18:00 - 20:00', 'Сергей Смирнов', 'Начинающие'),
('Четверг', '10:00 - 12:00', 'Алексей Иванов', 'Индивидуальные занятия'),
('Четверг', '19:00 - 21:00', 'Дмитрий Петров', 'Продвинутый уровень'),
('Пятница', '10:00 - 12:00', 'Сергей Смирнов', 'Групповая тренировка'),
('Пятница', '18:00 - 20:00', 'Алексей Иванов', 'Все уровни'),
('Суббота', '11:00 - 13:00', 'Дмитрий Петров', 'Мастер-класс'),
('Суббота', '15:00 - 17:00', 'Сергей Смирнов', 'Открытая тренировка'),
('Воскресенье', '11:00 - 13:00', 'Алексей Иванов', 'Групповая тренировка');

-- Seed services data
INSERT INTO services (icon, title, description, price, features, is_popular, sort_order) VALUES
('dumbbell', 'Индивидуальные тренировки', 'Персональный подход к каждому спортсмену с учетом уровня подготовки и целей', 'от 1000 ₽', ARRAY['Персональная программа тренировок', 'Анализ техники выполнения упражнений', 'Консультации по питанию', 'Гибкий график занятий'], false, 1),
('users', 'Групповые занятия', 'Тренировки в команде единомышленников под руководством опытных тренеров', 'от 500 ₽', ARRAY['Групповая мотивация', 'Разминка и заминка', 'Базовая и продвинутая программы', 'Дружеская атмосфера'], true, 2),
('trophy', 'Подготовка к турнирам', 'Профессиональная подготовка к соревнованиям любого уровня', 'от 1500 ₽', ARRAY['Тренировка соревновательных элементов', 'Работа над выносливостью', 'Психологическая подготовка', 'Анализ выступлений'], false, 3),
('target', 'Мастер-классы', 'Специализированные занятия по изучению сложных элементов и техник', 'от 700 ₽', ARRAY['Изучение продвинутых элементов', 'Занятия с приглашенными спортсменами', 'Видеоанализ техники', 'Практические советы от профи'], false, 4);

-- Seed upcoming tournaments
INSERT INTO tournaments (title, description, date, location, participants, image_url, status, status_type, is_past) VALUES
('Кубок области по воркауту 2025', 'Главное соревнование региона среди любителей и профессионалов воркаута', '2025-01-15', 'Центральный стадион', 'До 50 участников', '/regional-workout-cup-competition-venue.jpg', 'Регистрация открыта', 'success', false),
('Открытый турнир Эволюция', 'Открытый турнир для всех желающих показать свои навыки', '2025-02-03', 'Площадка ''Эволюция''', 'Без ограничений', '/open-tournament-street-workout-competition.jpg', 'Скоро регистрация', 'warning', false),
('Чемпионат города', 'Городской чемпионат по воркауту среди спортсменов всех категорий', '2025-03-12', 'Спорткомплекс ''Олимп''', 'До 30 участников', '/city-championship-workout-athletes.jpg', 'Готовится', 'default', false);

-- Seed past tournaments
INSERT INTO tournaments (title, description, date, location, participants, image_url, status, status_type, is_past) VALUES
('Осенний марафон 2024', 'Осенний турнир по воркауту', '2024-10-20', 'Площадка ''Эволюция''', NULL, '/autumn-marathon-workout-competition-results.jpg', 'Завершен', 'default', true),
('Летний кубок 2024', 'Летний турнир по воркауту', '2024-07-15', 'Центральный парк', NULL, '/summer-cup-outdoor-workout-event.jpg', 'Завершен', 'default', true),
('Весенний старт 2024', 'Весенний турнир по воркауту', '2024-04-25', 'Стадион ''Юность''', NULL, '/spring-start-competition-street-workout.jpg', 'Завершен', 'default', true);

-- Seed tournament winners
INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 1, 'Алексей Иванов', 'Эволюция провинции' FROM tournaments WHERE title = 'Осенний марафон 2024';
INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 2, 'Дмитрий Соколов', 'Городские гимнасты' FROM tournaments WHERE title = 'Осенний марафон 2024';
INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 3, 'Михаил Петров', 'Эволюция провинции' FROM tournaments WHERE title = 'Осенний марафон 2024';

INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 1, 'Сергей Смирнов', 'Эволюция провинции' FROM tournaments WHERE title = 'Летний кубок 2024';
INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 2, 'Андрей Козлов', 'Турник-клуб' FROM tournaments WHERE title = 'Летний кубок 2024';
INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 3, 'Игорь Волков', 'Стрит-спорт' FROM tournaments WHERE title = 'Летний кубок 2024';

INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 1, 'Дмитрий Петров', 'Эволюция провинции' FROM tournaments WHERE title = 'Весенний старт 2024';
INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 2, 'Максим Федоров', 'Силовые ребята' FROM tournaments WHERE title = 'Весенний старт 2024';
INSERT INTO tournament_winners (tournament_id, place, name, team)
SELECT id, 3, 'Владимир Орлов', 'Городские гимнасты' FROM tournaments WHERE title = 'Весенний старт 2024';

-- Seed VK settings
INSERT INTO vk_settings (group_id, posts_count) VALUES ('evolprov', 10);
