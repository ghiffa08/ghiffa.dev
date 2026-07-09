import { supabase } from '../lib/supabaseClient';

export const BioLinksRepository = {
  /**
   * Fetches all biography links, sorted by order_index.
   * @returns {Promise<Array>} List of bio links.
   */
  async getAllLinks() {
    const { data, error } = await supabase
      .from('bio_links')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  },

  /**
   * Creates a new bio link.
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The created link.
   */
  async createLink(payload) {
    const { data, error } = await supabase
      .from('bio_links')
      .insert([payload])
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Updates an existing bio link.
   * @param {string} id 
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The updated link.
   */
  async updateLink(id, payload) {
    const { data, error } = await supabase
      .from('bio_links')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Deletes a bio link.
   * @param {string} id 
   * @returns {Promise<boolean>} Success state.
   */
  async deleteLink(id) {
    const { error } = await supabase
      .from('bio_links')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
};
