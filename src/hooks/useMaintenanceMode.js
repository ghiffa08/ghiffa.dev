import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Custom hook to check maintenance mode status
 * @returns {Object} { isMaintenanceMode, loading }
 */
export function useMaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMaintenanceMode();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('maintenance-mode-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'general_settings'
        },
        (payload) => {
          if (payload.new && typeof payload.new.maintenance_mode === 'boolean') {
            setIsMaintenanceMode(payload.new.maintenance_mode);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const { data, error } = await supabase
        .from('general_settings')
        .select('maintenance_mode')
        .single();

      if (error) throw error;

      setIsMaintenanceMode(data?.maintenance_mode || false);
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      setIsMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  return { isMaintenanceMode, loading };
}
