import useSWR from 'swr';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { ExperienceRepository } from '../repositories/ExperienceRepository';
import { EducationRepository } from '../repositories/EducationRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';

// Fetcher routing the query through the respective Repository pattern methods
const repositoryFetcher = async ({ table }) => {
  switch (table) {
    case 'projects':
      return ProjectRepository.getAllProjects();
    case 'experiences':
      return ExperienceRepository.getAllExperiences();
    case 'qualifications':
      return EducationRepository.getAllEducation();
    case 'general_settings':
      return SettingsRepository.getSettings();
    case 'personal_info':
      return SettingsRepository.getPersonalInfo();
    default:
      throw new Error(`Repository mapping not found for table/domain: ${table}`);
  }
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
      dedupingInterval: 300000, // 5 minutes cache deduping
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
  // SWR key format is kept same to match cache signatures if any, 
  // but under the hood it routes through the repositories
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
      dedupingInterval: 300000, // 5 minutes cache deduping
    }
  );

  return {
    data: data || [],
    isLoading,
    error
  };
}
