import useSWR from 'swr';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { ExperienceRepository } from '../repositories/ExperienceRepository';
import { EducationRepository } from '../repositories/EducationRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { ArticleRepository } from '../repositories/ArticleRepository';

const CACHE_PREFIX = 'ghiffa_swr_cache_';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes fresh cache

// Fetcher routing the query through the respective Repository pattern methods with localStorage persistence
const repositoryFetcher = async (keyObj) => {
  const table = typeof keyObj === 'string' ? keyObj : keyObj.table;
  const cacheKey = `${CACHE_PREFIX}${JSON.stringify(keyObj)}`;

  // 1. Try reading from localStorage if still within TTL
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return parsed.data;
        }
      }
    } catch {
      // ignore read error
    }
  }

  // 2. Fetch fresh data from Supabase
  let data;
  switch (table) {
    case 'projects':
      data = await ProjectRepository.getAllProjects();
      break;
    case 'experiences':
      data = await ExperienceRepository.getAllExperiences();
      break;
    case 'qualifications':
      data = await EducationRepository.getAllEducation();
      break;
    case 'general_settings':
      data = await SettingsRepository.getSettings();
      break;
    case 'personal_info':
      data = await SettingsRepository.getPersonalInfo();
      break;
    case 'articles':
      data = await ArticleRepository.getAllArticles();
      break;
    default:
      throw new Error(`Repository mapping not found for table/domain: ${table}`);
  }

  // 3. Save to localStorage with timestamp to avoid repeated Supabase egress on page refresh
  if (typeof window !== 'undefined' && window.localStorage && data) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch {
      // localStorage may be full or disabled, gracefully continue
    }
  }

  return data;
};

/**
 * Hook for fetching a single record (like Settings, Biography) via Repositories
 */
export function useSupabaseSingle(table) {
  const { data, error, isLoading } = useSWR(
    { table }, 
    repositoryFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 900000, // 15 minutes in-memory deduping
    }
  );

  return {
    data: Array.isArray(data) ? data[0] : (data || null),
    isLoading,
    error
  };
}

/**
 * Hook for fetching multiple records (like Experiences, Projects, Education) via Repositories
 */
export function useSupabaseList(table, options = {}) {
  const key = {
    table,
    order: options.order,
    eq: options.eq
  };

  const { data, error, isLoading } = useSWR(
    key, 
    repositoryFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 900000, // 15 minutes in-memory deduping
    }
  );

  return {
    data: data || [],
    isLoading,
    error
  };
}
