-- =============================================================
-- AGP Donor Intelligence — Development Seed
-- Seeds 5 test users with donor data for local/staging testing.
-- ALL passwords: TestPass123!
-- =============================================================

-- Safety guard: abort if this looks like a production database
DO $$
BEGIN
  IF current_database() ILIKE '%prod%' THEN
    RAISE EXCEPTION 'Refusing to seed: database name contains "prod" — aborting.';
  END IF;
END;
$$;

-- =============================================================
-- 1. Insert auth.users + auth.identities (required for email/password login)
-- =============================================================

-- Passwords are bcrypt hashes of "TestPass123!"
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_sent_at,
  raw_user_meta_data, raw_app_meta_data,
  created_at, updated_at, last_sign_in_at,
  is_super_admin, is_sso_user, deleted_at
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test1@agp.dev',
  '$2a$10$PW8Mz8fF7wRqN/9Q1XvdNe.y6D3aJbmOo7LSQ2L1y9DGWS0mJ4F5.',
  now(), now(),
  '{"full_name": "Alice Fundraiser"}',
  '{"provider": "email", "providers": ["email"]}',
  now(), now(), now(),
  false, false, null
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test2@agp.dev',
  '$2a$10$PW8Mz8fF7wRqN/9Q1XvdNe.y6D3aJbmOo7LSQ2L1y9DGWS0mJ4F5.',
  now(), now(),
  '{"full_name": "Bob Development"}',
  '{"provider": "email", "providers": ["email"]}',
  now(), now(), now(),
  false, false, null
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test3@agp.dev',
  '$2a$10$PW8Mz8fF7wRqN/9Q1XvdNe.y6D3aJbmOo7LSQ2L1y9DGWS0mJ4F5.',
  now(), now(),
  '{"full_name": "Carol Analytics"}',
  '{"provider": "email", "providers": ["email"]}',
  now(), now(), now(),
  false, false, null
),
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test4@agp.dev',
  '$2a$10$PW8Mz8fF7wRqN/9Q1XvdNe.y6D3aJbmOo7LSQ2L1y9DGWS0mJ4F5.',
  now(), now(),
  '{"full_name": "David Steward"}',
  '{"provider": "email", "providers": ["email"]}',
  now(), now(), now(),
  false, false, null
),
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test5@agp.dev',
  '$2a$10$PW8Mz8fF7wRqN/9Q1XvdNe.y6D3aJbmOo7LSQ2L1y9DGWS0mJ4F5.',
  now(), now(),
  '{"full_name": "Eve Empty"}',
  '{"provider": "email", "providers": ["email"]}',
  now(), now(), now(),
  false, false, null
)
ON CONFLICT (id) DO NOTHING;

-- auth.identities rows are required for email/password sign-in
INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data,
  last_sign_in_at, created_at, updated_at
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'test1@agp.dev', 'email',
  '{"sub": "11111111-1111-1111-1111-111111111111", "email": "test1@agp.dev"}',
  now(), now(), now()
),
(
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'test2@agp.dev', 'email',
  '{"sub": "22222222-2222-2222-2222-222222222222", "email": "test2@agp.dev"}',
  now(), now(), now()
),
(
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  'test3@agp.dev', 'email',
  '{"sub": "33333333-3333-3333-3333-333333333333", "email": "test3@agp.dev"}',
  now(), now(), now()
),
(
  '44444444-4444-4444-4444-444444444444',
  '44444444-4444-4444-4444-444444444444',
  'test4@agp.dev', 'email',
  '{"sub": "44444444-4444-4444-4444-444444444444", "email": "test4@agp.dev"}',
  now(), now(), now()
),
(
  '55555555-5555-5555-5555-555555555555',
  '55555555-5555-5555-5555-555555555555',
  'test5@agp.dev', 'email',
  '{"sub": "55555555-5555-5555-5555-555555555555", "email": "test5@agp.dev"}',
  now(), now(), now()
)
ON CONFLICT (id) DO NOTHING;

-- handle_new_user trigger fires for NEW inserts, not the above ON CONFLICT.
-- Manually ensure profiles exist for all 5 users.
INSERT INTO public.profiles (id, email, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'test1@agp.dev', 'Alice Fundraiser'),
  ('22222222-2222-2222-2222-222222222222', 'test2@agp.dev', 'Bob Development'),
  ('33333333-3333-3333-3333-333333333333', 'test3@agp.dev', 'Carol Analytics'),
  ('44444444-4444-4444-4444-444444444444', 'test4@agp.dev', 'David Steward'),
  ('55555555-5555-5555-5555-555555555555', 'test5@agp.dev', 'Eve Empty')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 2. Seed uploads (one per user except test5 who has no data)
-- =============================================================

INSERT INTO uploads (id, user_id, filename, row_count, rejected_count, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'agp_2024_annual.csv',   68, 2, 'complete'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'test2_gifts.csv',       10, 0, 'complete'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'carol_import.csv',       5, 1, 'complete'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'david_small.csv',        3, 0, 'complete')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 3. Seed donor_gifts — test1 (68 gifts across 5 campaigns)
-- =============================================================

INSERT INTO donor_gifts (upload_id, user_id, donor_id, donor_name, segment, gift_date, gift_amount, campaign, channel, region) VALUES
-- Annual Fund 2024
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D001','Margaret Chen','Major Gifts','2024-01-10',5000.00,'Annual Fund 2024','Email','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D002','James Holloway','Major Gifts','2024-01-22',7500.00,'Annual Fund 2024','Direct Mail','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D003','Patricia Nguyen','Mid-Level','2024-02-05',1200.00,'Annual Fund 2024','Online','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D004','Robert Kim','Sustainer','2024-02-14',150.00,'Annual Fund 2024','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D005','Susan Torres','Mid-Level','2024-02-28',800.00,'Annual Fund 2024','Email','Southwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D006','Michael Park','First-Time','2024-03-08',250.00,'Annual Fund 2024','Online','Northwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D007','Linda Okafor','Sustainer','2024-03-15',100.00,'Annual Fund 2024','Email','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D008','David Patel','Mid-Level','2024-03-22',600.00,'Annual Fund 2024','Phone','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D009','Jennifer Ross','Major Gifts','2024-04-02',10000.00,'Annual Fund 2024','Direct Mail','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D010','Christopher Lee','Lapsed','2024-04-18',500.00,'Annual Fund 2024','Email','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D011','Amanda Wright','Sustainer','2024-04-25',200.00,'Annual Fund 2024','Online','Southwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D012','Ryan Martinez','First-Time','2024-05-03',75.00,'Annual Fund 2024','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D013','Sarah Johnson','Mid-Level','2024-05-20',950.00,'Annual Fund 2024','Email','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D001','Margaret Chen','Major Gifts','2024-05-30',3000.00,'Annual Fund 2024','Email','Northeast'),
-- Spring Gala
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D014','Thomas Brown','Major Gifts','2024-03-20',15000.00,'Spring Gala','Event','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D015','Rebecca Wilson','Major Gifts','2024-03-20',8000.00,'Spring Gala','Event','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D016','Kevin Zhang','Mid-Level','2024-03-20',2500.00,'Spring Gala','Event','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D017','Michelle Davis','Mid-Level','2024-03-20',1800.00,'Spring Gala','Event','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D018','Andrew Thompson','Sustainer','2024-03-20',500.00,'Spring Gala','Event','Southwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D019','Nicole Harris','First-Time','2024-03-20',350.00,'Spring Gala','Event','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D020','Brian Clark','Lapsed','2024-03-20',1000.00,'Spring Gala','Event','Northwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D021','Stephanie Lewis','General','2024-03-20',200.00,'Spring Gala','Event','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D002','James Holloway','Major Gifts','2024-03-20',5000.00,'Spring Gala','Event','Southeast'),
-- Monthly Giving Program
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D022','Karen White','Sustainer','2024-01-15',100.00,'Monthly Giving Program','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D022','Karen White','Sustainer','2024-02-15',100.00,'Monthly Giving Program','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D022','Karen White','Sustainer','2024-03-15',100.00,'Monthly Giving Program','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D022','Karen White','Sustainer','2024-04-15',100.00,'Monthly Giving Program','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D022','Karen White','Sustainer','2024-05-15',100.00,'Monthly Giving Program','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D023','Paul Anderson','Sustainer','2024-01-20',250.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D023','Paul Anderson','Sustainer','2024-02-20',250.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D023','Paul Anderson','Sustainer','2024-03-20',250.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D023','Paul Anderson','Sustainer','2024-04-20',250.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D023','Paul Anderson','Sustainer','2024-05-20',250.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D004','Robert Kim','Sustainer','2024-01-14',150.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D004','Robert Kim','Sustainer','2024-02-14',150.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D004','Robert Kim','Sustainer','2024-03-14',150.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D004','Robert Kim','Sustainer','2024-04-14',150.00,'Monthly Giving Program','Online','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D004','Robert Kim','Sustainer','2024-05-14',150.00,'Monthly Giving Program','Online','Midwest'),
-- Year-End Appeal
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D024','Elizabeth Turner','Major Gifts','2023-12-05',20000.00,'Year-End Appeal','Direct Mail','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D025','George Scott','Major Gifts','2023-12-10',12000.00,'Year-End Appeal','Email','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D026','Diana Adams','Mid-Level','2023-12-15',2000.00,'Year-End Appeal','Direct Mail','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D027','Frank Nelson','Lapsed','2023-12-20',750.00,'Year-End Appeal','Email','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D028','Grace Hill','First-Time','2023-12-22',300.00,'Year-End Appeal','Online','Southwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D029','Henry Baker','Sustainer','2023-12-24',500.00,'Year-End Appeal','Phone','Northwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D030','Irene Campbell','General','2023-12-28',100.00,'Year-End Appeal','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D031','Jack Rivera','Mid-Level','2023-12-30',1500.00,'Year-End Appeal','Direct Mail','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D009','Jennifer Ross','Major Gifts','2023-12-31',5000.00,'Year-End Appeal','Direct Mail','West'),
-- Capital Campaign
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D032','Laura Mitchell','Major Gifts','2024-06-01',25000.00,'Capital Campaign','Direct Mail','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D033','Marcus Evans','Major Gifts','2024-06-05',18000.00,'Capital Campaign','Phone','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D034','Nancy Cooper','Major Gifts','2024-06-12',30000.00,'Capital Campaign','Event','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D035','Oscar Brooks','Mid-Level','2024-06-18',3500.00,'Capital Campaign','Direct Mail','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D036','Pamela Ward','Mid-Level','2024-06-25',2800.00,'Capital Campaign','Email','Southwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D037','Quentin Price','Lapsed','2024-07-02',1200.00,'Capital Campaign','Phone','Northwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D038','Rachel Gray','First-Time','2024-07-08',500.00,'Capital Campaign','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D039','Samuel Hughes','General','2024-07-15',250.00,'Capital Campaign','Online','Southeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D040','Tina Foster','Sustainer','2024-07-22',400.00,'Capital Campaign','Email','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D014','Thomas Brown','Major Gifts','2024-07-30',10000.00,'Capital Campaign','Event','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D015','Rebecca Wilson','Major Gifts','2024-08-05',8000.00,'Capital Campaign','Event','West'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D024','Elizabeth Turner','Major Gifts','2024-08-12',15000.00,'Capital Campaign','Direct Mail','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D041','Victor Simmons','Mid-Level','2024-08-19',1900.00,'Capital Campaign','Email','Midwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D042','Wendy Long','First-Time','2024-08-26',450.00,'Capital Campaign','Online','Southwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D043','Xavier King','Lapsed','2024-09-02',700.00,'Capital Campaign','Email','Northwest'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D044','Yolanda Green','General','2024-09-10',125.00,'Capital Campaign','Online','Northeast'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','D045','Zachary Flores','Major Gifts','2024-09-18',22000.00,'Capital Campaign','Direct Mail','Southeast');

-- =============================================================
-- 4. Seed donor_gifts — test2 (10 gifts, isolation test)
-- =============================================================

INSERT INTO donor_gifts (upload_id, user_id, donor_id, donor_name, segment, gift_date, gift_amount, campaign, channel, region) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D001','Alpha Donor','Major Gifts','2024-03-01',5000.00,'Spring Appeal','Email','Northeast'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D002','Beta Donor','Mid-Level','2024-03-05',800.00,'Spring Appeal','Online','West'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D003','Gamma Donor','Sustainer','2024-03-10',150.00,'Spring Appeal','Online','Midwest'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D004','Delta Donor','First-Time','2024-04-01',200.00,'Spring Appeal','Email','Southeast'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D005','Epsilon Donor','Lapsed','2024-04-15',300.00,'Spring Appeal','Direct Mail','Southwest'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D006','Zeta Donor','General','2024-05-01',100.00,'Spring Appeal','Online','Northwest'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D007','Eta Donor','Mid-Level','2024-05-10',600.00,'Spring Appeal','Phone','Northeast'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D008','Theta Donor','Sustainer','2024-06-01',250.00,'Year-End','Online','West'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D001','Alpha Donor','Major Gifts','2024-06-15',3500.00,'Year-End','Direct Mail','Northeast'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','T2D009','Iota Donor','First-Time','2024-07-01',175.00,'Year-End','Online','Midwest');

-- =============================================================
-- 5. Seed donor_gifts — test3 (5 gifts)
-- =============================================================

INSERT INTO donor_gifts (upload_id, user_id, donor_id, donor_name, segment, gift_date, gift_amount, campaign, channel, region) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc','33333333-3333-3333-3333-333333333333','C001','Carol A','Major Gifts','2024-02-10',10000.00,'Capital Drive','Email','Northeast'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','33333333-3333-3333-3333-333333333333','C002','Carol B','Mid-Level','2024-03-20',1500.00,'Capital Drive','Direct Mail','West'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','33333333-3333-3333-3333-333333333333','C003','Carol C','Sustainer','2024-04-01',200.00,'Capital Drive','Online','Midwest'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','33333333-3333-3333-3333-333333333333','C004','Carol D','First-Time','2024-05-15',350.00,'Capital Drive','Online','Southeast'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','33333333-3333-3333-3333-333333333333','C001','Carol A','Major Gifts','2024-06-30',7000.00,'Capital Drive','Phone','Northeast');

-- =============================================================
-- 6. Seed donor_gifts — test4 (3 gifts)
-- =============================================================

INSERT INTO donor_gifts (upload_id, user_id, donor_id, donor_name, segment, gift_date, gift_amount, campaign, channel, region) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd','44444444-4444-4444-4444-444444444444','D001','David A','General','2024-05-01',500.00,'Annual Appeal','Email','Northeast'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','44444444-4444-4444-4444-444444444444','D002','David B','First-Time','2024-06-01',250.00,'Annual Appeal','Online','West'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','44444444-4444-4444-4444-444444444444','D003','David C','Mid-Level','2024-07-01',900.00,'Annual Appeal','Direct Mail','Southeast');

-- test5 has no donor_gifts (empty state test)

-- =============================================================
-- 7. Verification — run this SELECT to confirm seeding
-- =============================================================
SELECT
  p.email,
  COUNT(dg.id)            AS gift_count,
  COALESCE(SUM(dg.gift_amount), 0) AS total_raised
FROM profiles p
LEFT JOIN donor_gifts dg ON dg.user_id = p.id
WHERE p.email LIKE '%@agp.dev'
GROUP BY p.email
ORDER BY p.email;
-- Expected: test1=68 gifts ~$219k, test2=10, test3=5, test4=3, test5=0
