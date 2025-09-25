import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Model {
  id: string;
  name: string;
  author: string;
  price: number;
  category: string;
  rating: number;
  downloads: number;
  description?: string;
  tags?: string[];
  file_path: string;
  thumbnail_path?: string;
  created_at: string;
}

export const useModels = (category: string = 'All') => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });

      if (category !== 'All') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setModels(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  const incrementDownloads = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('models')
        .update({ downloads: supabase.rpc('increment', { x: 1 }) })
        .eq('id', modelId);

      if (error) {
        throw error;
      }

      // Update local state
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, downloads: model.downloads + 1 }
          : model
      ));
    } catch (err) {
      console.error('Error updating downloads:', err);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [category]);

  return {
    models,
    loading,
    error,
    refetch: fetchModels,
    incrementDownloads
  };
};