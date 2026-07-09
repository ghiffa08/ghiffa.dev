import useSWR from 'swr';
import { InstagramRepository } from '../repositories/InstagramRepository';

/**
 * Custom hook to fetch Instagram feed using the InstagramRepository.
 * Completely abstracted from API tokens and direct REST endpoint URLs.
 */
export function useInstagramFeed() {
  const { data, error, isLoading } = useSWR('instagram/feed', () => InstagramRepository.getFeeds(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 3600000, // Cache results locally for 1 hour
  });

  return {
    data: data || [],
    isLoading,
    error
  };
}
