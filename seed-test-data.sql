-- ========================================
-- SPORTS MANAGER - TEST DATA FOR EXAM DEMO
-- 3 Users, 2 Fields, 3 Tournaments, Teams/Players/Matches, Bookings
-- ========================================

-- Clear existing data (keep users for auth demo)
DELETE FROM auth_logs;
DELETE FROM bookings;
DELETE FROM matches;
DELETE FROM players;
DELETE FROM teams;
DELETE FROM tournaments;
DELETE FROM fields;
DELETE FROM users WHERE id > 3;  -- Keep first 3 users if exist

-- ========================================
-- 1. USERS (3 test accounts)
-- ========================================
INSERT INTO users (username, email, password, name, surname, role, is_active, created_at) VALUES
-- Admin (for special demo)
('admin', 'admin@sports.com', '$2b$12$your_bcrypt_hash_here', 'Admin', 'User', 'admin', true, NOW()),
-- Coach Marwan (your account - tournament creator)
('marwan', 'marwan@example.com', '$2b$12$your_bcrypt_hash_here', 'Marwan', 'Coach', 'user', true, NOW()),
-- Player John (makes bookings)
('johnplayer', 'john@example.com', '$2b$12$your_bcrypt_hash_here', 'John', 'Doe', 'user', true, NOW());

-- IDs: admin=1, marwan=2, john=3

-- ========================================
-- 2. FIELDS (2 sports fields)
-- ========================================
INSERT INTO fields (id, name, sport, address, price_per_hour, capacity, is_active) VALUES
(uuid_generate_v4(), 'Stadio Milanese', 'football', 'Via Sportiva 123, Milano', 30.00, 100, true),
(uuid_generate_v4(), 'PalaVolley Nord', 'volleyball', 'Via Pallavolo 45, Milano', 25.00, 50, true);

-- ========================================
-- 3. BOOKINGS (2 bookings by John)
-- ========================================
-- Get field IDs dynamically (replace with actual UUIDs after insert)
-- Manual booking: John books football field tomorrow 10:00-12:00
INSERT INTO bookings (id, date, start_time, end_time, total_price, field_id, user_id, is_active, created_at) VALUES
(uuid_generate_v4(), '2026-01-22', '10:00', '12:00', 60.00, (SELECT id FROM fields WHERE name='Stadio Milanese' LIMIT 1), 3, true, NOW()),
(uuid_generate_v4(), '2026-01-23', '14:00', '16:00', 50.00, (SELECT id FROM fields WHERE name='PalaVolley Nord' LIMIT 1), 3, true, NOW());

-- ========================================
-- 4. TOURNAMENTS (3 by Marwan - different sports)
-- ========================================
INSERT INTO tournaments (id, name, sport, max_teams, start_date, end_date, status, creator_id, current_teams, is_active, created_at, updated_at) VALUES
-- Football tournament (4 teams - perfect for round-robin demo)
(uuid_generate_v4(), 'Milano Football Cup 2026', 'football', 4, '2026-01-25', '2026-02-01', 'finished', 2, 4, true, NOW(), NOW()),
-- Volleyball (2 teams - simple)
(uuid_generate_v4(), 'Volley Winter League', 'volleyball', 4, '2026-01-20', '2026-01-28', 'finished', 2, 2, true, NOW(), NOW()),
-- Basketball (ongoing - for demo)
(uuid_generate_v4(), 'Basket Milano Open', 'basketball', 8, '2026-01-22', '2026-02-05', 'ongoing', 2, 0, true, NOW(), NOW());

-- Tournament IDs: T1=football (id1), T2=volleyball (id2), T3=basket (id3)

-- ========================================
-- 5. TEAMS & PLAYERS (Football tournament - COMPLETE for standings demo)
-- ========================================
-- Team 1: AC Milan (2 wins)
INSERT INTO teams (id, name, tournament_id, is_active, created_at) VALUES
(uuid_generate_v4(), 'AC Milan Amatori', (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), true, NOW()),
(uuid_generate_v4(), 'Inter Youth', (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), true, NOW()),
(uuid_generate_v4(), 'Juventus B', (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), true, NOW()),
(uuid_generate_v4(), 'Atalanta U23', (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), true, NOW());

-- Players (captains highlighted)
INSERT INTO players (id, name, position, jersey_number, is_captain, team_id, is_active, created_at) VALUES
-- AC Milan (Captain #10)
(uuid_generate_v4(), 'Luca', 'STRIKER', 10, true, (SELECT id FROM teams WHERE name='AC Milan Amatori' LIMIT 1), true, NOW()),
(uuid_generate_v4(), 'Marco', 'CENTER_BACK', 5, false, (SELECT id FROM teams WHERE name='AC Milan Amatori' LIMIT 1), true, NOW()),

-- Inter Youth (Captain #7)
(uuid_generate_v4(), 'Giovanni', 'RIGHT_WINGER', 7, true, (SELECT id FROM teams WHERE name='Inter Youth' LIMIT 1), true, NOW()),

-- Juventus B (Captain #9)
(uuid_generate_v4(), 'Matteo', 'STRIKER', 9, true, (SELECT id FROM teams WHERE name='Juventus B' LIMIT 1), true, NOW()),

-- Atalanta U23 (Captain #11)
(uuid_generate_v4(), 'Alessandro', 'LEFT_WINGER', 11, true, (SELECT id FROM teams WHERE name='Atalanta U23' LIMIT 1), true, NOW());

-- ========================================
-- 6. MATCHES (Football tournament - 6 matches, 3 rounds complete)
-- ========================================
INSERT INTO matches (id, round, status, score_team1, score_team2, tournament_id, team1_id, team2_id, scheduled_at, created_at) VALUES
-- ROUND 1
(uuid_generate_v4(), 1, 'finished', 2, 1, (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), 
 (SELECT id FROM teams WHERE name='AC Milan Amatori' LIMIT 1), (SELECT id FROM teams WHERE name='Inter Youth' LIMIT 1), '2026-01-25 15:00', NOW()),
(uuid_generate_v4(), 1, 'finished', 3, 0, (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), 
 (SELECT id FROM teams WHERE name='Juventus B' LIMIT 1), (SELECT id FROM teams WHERE name='Atalanta U23' LIMIT 1), '2026-01-25 17:00', NOW()),

-- ROUND 2  
(uuid_generate_v4(), 2, 'finished', 1, 1, (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), 
 (SELECT id FROM teams WHERE name='AC Milan Amatori' LIMIT 1), (SELECT id FROM teams WHERE name='Juventus B' LIMIT 1), '2026-01-26 15:00', NOW()),
(uuid_generate_v4(), 2, 'finished', 0, 2, (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), 
 (SELECT id FROM teams WHERE name='Inter Youth' LIMIT 1), (SELECT id FROM teams WHERE name='Atalanta U23' LIMIT 1), '2026-01-26 17:00', NOW()),

-- ROUND 3 (Final)
(uuid_generate_v4(), 3, 'finished', 2, 0, (SELECT id FROM tournaments WHERE name='Milano Football Cup 2026' LIMIT 1), 
 (SELECT id FROM teams WHERE name='AC Milan Amatori' LIMIT 1), (SELECT id FROM teams WHERE name='Atalanta U23' LIMIT 1), '2026-01-27 16:00', NOW());

-- ========================================
-- 7. SIMPLE VOLLEYBALL TOURNAMENT (2 teams, 1 match)
-- ========================================
INSERT INTO teams (id, name, tournament_id, is_active, created_at) VALUES
(uuid_generate_v4(), 'Volley Milano', (SELECT id FROM tournaments WHERE name='Volley Winter League' LIMIT 1), true, NOW()),
(uuid_generate_v4(), 'Pallavolo Nord', (SELECT id FROM tournaments WHERE name='Volley Winter League' LIMIT 1), true, NOW());

INSERT INTO matches (id, round, status, score_team1, score_team2, tournament_id, team1_id, team2_id, scheduled_at, created_at) VALUES
(uuid_generate_v4(), 1, 'finished', 3, 1, (SELECT id FROM tournaments WHERE name='Volley Winter League' LIMIT 1), 
 (SELECT id FROM teams WHERE name='Volley Milano' ORDER BY id DESC LIMIT 1), (SELECT id FROM teams WHERE name='Pallavolo Nord' ORDER BY id DESC LIMIT 1), '2026-01-28 18:00', NOW());

-- ========================================
-- 8. AUTH LOGS (Demo login attempts)
-- ========================================
INSERT INTO auth_logs (user_id, ip_address, user_agent, success, created_at) VALUES
(2, '127.0.0.1', 'Mozilla/5.0 (Windows)', true, NOW() - INTERVAL '1 hour'),
(3, '192.168.1.100', 'PostmanRuntime', true, NOW() - INTERVAL '30 minutes'),
(NULL, '8.8.8.8', 'curl/7.68.0', false, NOW() - INTERVAL '5 minutes');  -- Failed login

-- ========================================
-- SUMMARY OF TEST DATA
-- ========================================
-- USERS: admin(1), marwan(2), john(3)
-- FIELDS: Stadio Milanese(football), PalaVolley Nord(volleyball)
-- BOOKINGS: John has 2 upcoming bookings
-- TOURNAMENTS: 
--   1. Milano Football Cup (FINISHED, 4 teams, 6 matches, standings ready)
--   2. Volley Winter League (FINISHED, 2 teams, 1 match)
--   3. Basket Milano Open (ONGOING, no teams yet)
-- MATCHES: Complete football tournament (AC Milan wins championship)
-- PLAYERS: Captains with positions
-- AUTH LOGS: Successful + 1 failed login

SELECT 'TEST DATA LOADED SUCCESSFULLY!' as status;
