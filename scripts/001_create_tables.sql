-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  trainer TEXT NOT NULL,
  training_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'dumbbell',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  participants TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming',
  status_type TEXT DEFAULT 'default',
  is_past BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament winners table
CREATE TABLE IF NOT EXISTS tournament_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  place INTEGER NOT NULL,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create VK settings table
CREATE TABLE IF NOT EXISTS vk_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id TEXT NOT NULL DEFAULT 'evolprov',
  posts_count INTEGER DEFAULT 10,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vk_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for schedule
CREATE POLICY "schedule_select_public" ON schedule FOR SELECT USING (true);

-- Public read access for services
CREATE POLICY "services_select_public" ON services FOR SELECT USING (true);

-- Public read access for tournaments
CREATE POLICY "tournaments_select_public" ON tournaments FOR SELECT USING (true);

-- Public read access for tournament winners
CREATE POLICY "tournament_winners_select_public" ON tournament_winners FOR SELECT USING (true);

-- Public read access for site settings
CREATE POLICY "site_settings_select_public" ON site_settings FOR SELECT USING (true);

-- Public read access for vk settings
CREATE POLICY "vk_settings_select_public" ON vk_settings FOR SELECT USING (true);

-- Admin policies (authenticated users with is_admin metadata)
-- Schedule
CREATE POLICY "schedule_insert_admin" ON schedule FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "schedule_update_admin" ON schedule FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "schedule_delete_admin" ON schedule FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );

-- Services
CREATE POLICY "services_insert_admin" ON services FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "services_update_admin" ON services FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "services_delete_admin" ON services FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );

-- Tournaments
CREATE POLICY "tournaments_insert_admin" ON tournaments FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "tournaments_update_admin" ON tournaments FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "tournaments_delete_admin" ON tournaments FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );

-- Tournament Winners
CREATE POLICY "tournament_winners_insert_admin" ON tournament_winners FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "tournament_winners_update_admin" ON tournament_winners FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "tournament_winners_delete_admin" ON tournament_winners FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );

-- Site Settings
CREATE POLICY "site_settings_insert_admin" ON site_settings FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "site_settings_update_admin" ON site_settings FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "site_settings_delete_admin" ON site_settings FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );

-- VK Settings
CREATE POLICY "vk_settings_insert_admin" ON vk_settings FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "vk_settings_update_admin" ON vk_settings FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
CREATE POLICY "vk_settings_delete_admin" ON vk_settings FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean)
  );
