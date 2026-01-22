-- seed-simple.sql - Bulletproof, works everywhere

-- 1. Wipe everything
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE;';
  END LOOP;
END $$;

-- 2. USERS
INSERT INTO users (id, username, email, password, name, surname, role, "createdAt", "updatedAt", "isActive") VALUES
(1, 'admin', 'admin@example.com', '$2a$10$kDxCr7Z4s3Sg1rzTfAJ9z.5ZeePODVX4sP0RfC9EtYWY92OJas942', 'Admin', 'User', 'admin', '2026-01-01 10:00:00', '2026-01-01 10:00:00', true),
(2, 'john_doe', 'john@example.com', '$2a$10$kDxCr7Z4s3Sg1rzTfAJ9z.5ZeePODVX4sP0RfC9EtYWY92OJas942', 'John', 'Doe', 'user', '2026-01-02 12:00:00', '2026-01-02 12:00:00', true);

-- 3. FIELDS
INSERT INTO fields (id, name, sport, address, "pricePerHour", capacity, "isActive") VALUES
('550e8400-e29b-41d4-a716-446655440040', 'San Siro Stadium', 'football', 'Via Piccolomini, 5, 20151 Milano', 35.50, 75000, true),
('550e8400-e29b-41d4-a716-446655440041', 'Centro Sportivo Milan', 'football', 'Via Cento, 8, 20090 Milan', 25.00, 500, true);

-- 4. TOURNAMENTS
INSERT INTO tournaments (id, name, sport, "maxTeams", "startDate", "endDate", status, "currentTeams", "createdAt", "updatedAt", "isActive", "creatorId") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Winter Cup 2026', 'football', 16, '2026-02-01', '2026-02-28', 'registration', 8, '2026-01-01 09:00:00', '2026-01-22 10:00:00', true, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Spring League', 'football', 8, '2026-03-01', '2026-03-31', 'registration', 4, '2026-01-15 14:00:00', '2026-01-15 14:00:00', true, 2);

-- 5. TEAMS
INSERT INTO team (id, name, "tournamentId", "isActive", "createdAt") VALUES
('550e8400-e29b-41d4-a716-446655440010', 'FC Barcelona', '550e8400-e29b-41d4-a716-446655440001', true, '2026-01-01 09:30:00'),
('550e8400-e29b-41d4-a716-446655440011', 'Real Madrid', '550e8400-e29b-41d4-a716-446655440001', true, '2026-01-01 09:35:00'),
('550e8400-e29b-41d4-a716-446655440012', 'Juventus', '550e8400-e29b-41d4-a716-446655440002', true, '2026-01-15 14:30:00');

-- 6. PLAYERS
INSERT INTO player (id, name, "position", "jerseyNumber", "isCaptain", "isActive", "createdAt", "teamId") VALUES
('550e8400-e29b-41d4-a716-446655440020', 'Lionel Messi', 'striker', 10, true, true, '2026-01-01 09:40:00', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440021', 'Karim Benzema', 'striker', 9, false, true, '2026-01-01 09:45:00', '550e8400-e29b-41d4-a716-446655440011');

-- 7. MATCHES
INSERT INTO match (id, round, status, "scoreTeam1", "scoreTeam2", "tournamentId", "team1Id", "team2Id", "scheduledAt", "createdAt") VALUES
('550e8400-e29b-41d4-a716-446655440030', 1, 'scheduled', NULL, NULL, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440011', '2026-02-05 15:00:00', '2026-01-01 10:00:00');

-- 8. BOOKINGS
INSERT INTO bookings (id, date, "startTime", "endTime", "totalPrice", "createdAt", "isActive", "fieldId", "userId") VALUES
('550e8400-e29b-41d4-a716-446655440050', '2026-01-25', '09:00', '11:00', 71.00, '2026-01-20 14:00:00', true, '550e8400-e29b-41d4-a716-446655440040', 2);


-- 9. Verify
SELECT 'SUCCESS' as status, COUNT(*) as total_rows FROM (
  SELECT 1 FROM users UNION ALL SELECT 1 FROM fields UNION ALL 
  SELECT 1 FROM tournaments UNION ALL SELECT 1 FROM team UNION ALL 
  SELECT 1 FROM player UNION ALL SELECT 1 FROM match UNION ALL 
  SELECT 1 FROM bookings UNION ALL SELECT 1 FROM auth_logs
) t;
