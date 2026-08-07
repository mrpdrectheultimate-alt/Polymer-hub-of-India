-- Add video health tracking columns if not already present
ALTER TABLE videos 
  ADD COLUMN IF NOT EXISTS embed_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS embed_error TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_embed_status ON videos(embed_status);

-- Update existing videos to 'working' status if pending
UPDATE videos SET embed_status = 'working' WHERE embed_status = 'pending';
