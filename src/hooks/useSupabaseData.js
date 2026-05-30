import useSWR from 'swr';
import { supabase } from '../lib/supabaseClient';

// Generic fetcher function for SWR
const fetcher = async ({ table, order, eq }) => {
  let query = supabase.from(table).select('*');
  
  if (eq) {
    query = query.eq(eq.column, eq.value);
  }
  
  if (order) {
    query = query.order(order.column, { ascending: order.ascending });
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Hook for fetching a single record (like Hero, About, Contact)
export function useSupabaseSingle(table) {
  const { data, error, isLoading } = useSWR(
    { table }, 
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data ? data[0] : null,
    isLoading,
    error
  };
}

// Hook for fetching multiple records (like Experiences, Projects, Education, Articles)
export function useSupabaseList(table, options = {}) {
  const key = {
    table,
    order: options.order,
    eq: options.eq
  };

  const { data, error, isLoading } = useSWR(
    key, 
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
    }
  );

  return {
    data: data || [],
    isLoading,
    error
  };
}
