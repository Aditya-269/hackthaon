-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  emergency_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trusted_contacts table
CREATE TABLE IF NOT EXISTS trusted_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'offline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_events table
CREATE TABLE IF NOT EXISTS emergency_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  location JSONB,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create location_updates table
CREATE TABLE IF NOT EXISTS location_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emergency_event_id UUID REFERENCES emergency_events(id) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  accuracy FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create safe_routes table
CREATE TABLE IF NOT EXISTS safe_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  start_location JSONB NOT NULL,
  end_location JSONB NOT NULL,
  route_data JSONB,
  safety_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trusted contacts policies
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trusted contacts"
  ON trusted_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trusted contacts"
  ON trusted_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trusted contacts"
  ON trusted_contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trusted contacts"
  ON trusted_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Emergency events policies
ALTER TABLE emergency_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emergency events"
  ON emergency_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emergency events"
  ON emergency_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency events"
  ON emergency_events FOR UPDATE
  USING (auth.uid() = user_id);

-- Location updates policies
ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view location updates for their emergency events"
  ON location_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM emergency_events
      WHERE emergency_events.id = location_updates.emergency_event_id
      AND emergency_events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert location updates for their emergency events"
  ON location_updates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM emergency_events
      WHERE emergency_events.id = location_updates.emergency_event_id
      AND emergency_events.user_id = auth.uid()
    )
  );

-- Safe routes policies
ALTER TABLE safe_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own safe routes"
  ON safe_routes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own safe routes"
  ON safe_routes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own safe routes"
  ON safe_routes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own safe routes"
  ON safe_routes FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', null);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
