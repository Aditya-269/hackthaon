-- Create a table for recording metadata
CREATE TABLE IF NOT EXISTS recording_metadata (
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
ALTER TABLE recording_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own recordings
CREATE POLICY "Users can view their own recordings"
  ON recording_metadata
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own recordings
CREATE POLICY "Users can insert their own recordings"
  ON recording_metadata
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own recordings
CREATE POLICY "Users can update their own recordings"
  ON recording_metadata
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own recordings
CREATE POLICY "Users can delete their own recordings"
  ON recording_metadata
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE recording_metadata;
