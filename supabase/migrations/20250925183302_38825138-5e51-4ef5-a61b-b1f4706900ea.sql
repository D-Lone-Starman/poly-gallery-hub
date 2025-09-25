-- Create function to increment downloads
CREATE OR REPLACE FUNCTION public.increment_downloads(model_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.models 
  SET downloads = downloads + 1 
  WHERE id = model_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;