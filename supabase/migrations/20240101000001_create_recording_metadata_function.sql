-- Create a function to create the recording_metadata table if it doesn't exist
CREATE OR REPLACE FUNCTION create_recording_metadata_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'recording_metadata') THEN
    -- Create the table
    CREATE TABLE public.recording_metadata (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      file_path TEXT NOT NULL,
      public_url TEXT,
      is_emergency BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      duration_ms INTEGER,
      file_size INTEGER,
      location JSONB,
      metadata JSONB,
      UNIQUE(user_id, file_path)
    );

    -- Enable RLS
    ALTER TABLE public.recording_metadata ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own recordings"
      ON public.recording_metadata
      FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own recordings"
      ON public.recording_metadata
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own recordings"
      ON public.recording_metadata
      FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own recordings"
      ON public.recording_metadata
      FOR DELETE
      USING (auth.uid() = user_id);

    -- Enable realtime
    ALTER PUBLICATION supabase_realtime ADD TABLE public.recording_metadata;
  END IF;
END;
$$;