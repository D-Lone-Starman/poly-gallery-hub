-- Create storage buckets for 3D models
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'models', 
  'models', 
  true, 
  52428800, -- 50MB limit
  ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'text/plain']
);

-- Create models table
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  downloads INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on models table
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Create policies for models
CREATE POLICY "Models are viewable by everyone" 
ON public.models 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own models" 
ON public.models 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own models" 
ON public.models 
FOR UPDATE 
USING (author = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own models" 
ON public.models 
FOR DELETE 
USING (author = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create storage policies for models bucket
CREATE POLICY "Models are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'models');

CREATE POLICY "Authenticated users can upload models" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'models' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own model files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'models' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_models_updated_at
BEFORE UPDATE ON public.models
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add trigger for profiles timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample models
INSERT INTO public.models (name, author, price, category, file_path, description, tags) VALUES
('Modern Chair', 'demo@example.com', 29.99, 'Furniture', 'furniture/modern_chair.glb', 'A sleek modern office chair with ergonomic design', ARRAY['furniture', 'office', 'modern']),
('Sci-Fi Robot', 'demo@example.com', 0, 'Characters', 'characters/scifi_robot.glb', 'Futuristic robot character for games and animations', ARRAY['character', 'robot', 'scifi']),
('Sports Car', 'demo@example.com', 49.99, 'Vehicles', 'vehicles/sports_car.glb', 'High-performance sports car model', ARRAY['car', 'vehicle', 'sports']),
('Medieval Sword', 'demo@example.com', 15.99, 'Weapons', 'weapons/medieval_sword.glb', 'Detailed medieval sword with realistic textures', ARRAY['weapon', 'medieval', 'sword']),
('Office Building', 'demo@example.com', 79.99, 'Architecture', 'architecture/office_building.glb', 'Modern office building for architectural visualization', ARRAY['building', 'architecture', 'office']),
('Tree Collection', 'demo@example.com', 0, 'Nature', 'nature/tree_collection.glb', 'Various tree models for environmental scenes', ARRAY['nature', 'tree', 'environment']);