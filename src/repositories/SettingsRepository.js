import { supabase } from '../lib/supabaseClient';

export const SettingsRepository = {
  /**
   * Fetches general app settings.
   * @returns {Promise<Object>} Settings configuration.
   */
  async getSettings() {
    const { data, error } = await supabase
      .from('general_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * Fetches personal info.
   * @returns {Promise<Object>} Personal biography/links/etc.
   */
  async getPersonalInfo() {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * Updates general settings.
   * @param {Object} payload 
   * @returns {Promise<Object>} Updated settings.
   */
  async updateSettings(payload) {
    const existing = await this.getSettings().catch(() => null);
    
    let result;
    if (existing?.id) {
      result = await supabase
        .from('general_settings')
        .update(payload)
        .eq('id', existing.id)
        .select();
    } else {
      result = await supabase
        .from('general_settings')
        .insert([payload])
        .select();
    }

    if (result.error) throw new Error(result.error.message);
    return result.data?.[0] || null;
  },

  /**
   * Updates personal biography details.
   * @param {Object} payload 
   * @returns {Promise<Object>} Updated personal info.
   */
  async updatePersonalInfo(payload) {
    const existing = await this.getPersonalInfo().catch(() => null);
    
    let result;
    if (existing?.id) {
      result = await supabase
        .from('personal_info')
        .update(payload)
        .eq('id', existing.id)
        .select();
    } else {
      result = await supabase
        .from('personal_info')
        .insert([payload])
        .select();
    }

    if (result.error) throw new Error(result.error.message);
    return result.data?.[0] || null;
  }
};
