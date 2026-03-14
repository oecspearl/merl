-- Enable Supabase Realtime on the locks table for live lock updates
ALTER PUBLICATION supabase_realtime ADD TABLE locks;
