import { supabase } from '../lib/supabaseClient';

export const ExperienceRepository = {
  /**
   * Fetches all professional experiences from Supabase, sorted by order_index.
   * @returns {Promise<Array>} List of experiences.
   */
  async getAllExperiences() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  },

  /**
   * Creates a new experience entry.
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The created experience.
   */
  async createExperience(payload) {
    const { data, error } = await supabase
      .from('experiences')
      .insert([payload])
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Updates an existing experience entry.
   * @param {string} id 
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The updated experience.
   */
  async updateExperience(id, payload) {
    const { data, error } = await supabase
      .from('experiences')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Deletes an experience entry.
   * @param {string} id 
   * @returns {Promise<boolean>} Success state.
   */
  async deleteExperience(id) {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
};
