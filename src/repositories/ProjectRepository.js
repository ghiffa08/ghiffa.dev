import { supabase } from '../lib/supabaseClient';
import { slugify } from '../utils/slugify';

export const ProjectRepository = {
  /**
   * Fetches projects from Supabase with an optional limit.
   * @param {number|null} limit 
   * @returns {Promise<Array>} List of projects.
   */
  async getAllProjects(limit = null) {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }
    
    // Ensure backward compatibility on the fly
    return (data || []).map(p => ({
      ...p,
      image_urls: Array.isArray(p.image_urls) && p.image_urls.length > 0 
        ? p.image_urls 
        : (p.image_url ? [p.image_url] : [])
    }));
  },

  /**
   * Finds a project by its URL-friendly slug.
   * @param {string} slug 
   * @returns {Promise<Object|null>} The matching project object.
   */
  async getProjectBySlug(slug) {
    const projects = await this.getAllProjects();
    if (!projects) return null;
    return projects.find(p => slugify(p.title) === slug) || null;
  },

  /**
   * Creates a new project in the database.
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The created project.
   */
  async createProject(payload) {
    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Updates an existing project in the database.
   * @param {string} id 
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The updated project.
   */
  async updateProject(id, payload) {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Deletes a project from the database.
   * @param {string} id 
   * @returns {Promise<boolean>} Success state.
   */
  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
};
