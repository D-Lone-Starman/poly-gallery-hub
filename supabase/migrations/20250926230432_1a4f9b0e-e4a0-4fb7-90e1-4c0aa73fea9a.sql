-- Fix the search path security issue
DROP FUNCTION IF EXISTS public.increment_downloads(UUID);

-- Create a simpler approach using direct update
-- We'll handle this in the frontend instead of using a function