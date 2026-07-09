import { supabase } from '../lib/supabaseClient';

export const EducationRepository = {
  /**
   * Fetches all qualifications/education entries from Supabase, sorted by order_index.
   * @returns {Promise<Array>} List of qualifications (education/honors/certs).
   */
  async getAllEducation() {
    const { data, error } = await supabase
      .from('qualifications')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return (data || []).map(q => ({
      ...q,
      certificate_url: q.certificate_url || null
    }));
  },

  /**
   * Creates a new qualification entry.
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The created qualification.
   */
  async createQualification(payload) {
    const { data, error } = await supabase
      .from('qualifications')
      .insert([payload])
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Updates an existing qualification entry.
   * @param {string} id 
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The updated qualification.
   */
  async updateQualification(id, payload) {
    const { data, error } = await supabase
      .from('qualifications')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Deletes a qualification entry.
   * @param {string} id 
   * @returns {Promise<boolean>} Success state.
   */
  async deleteQualification(id) {
    const { error } = await supabase
      .from('qualifications')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
};
