import { supabase } from '../lib/supabaseClient';

/**
 * URLRepository
 * Repository pattern untuk URL Shortener management
 * Handles shortened URLs CRUD operations dan analytics
 */
export const URLRepository = {
  /**
   * Generate random short code (6 chars, alphanumeric)
   * @returns {string} Random short code
   */
  generateShortCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Fetch all shortened URLs (admin view)
   * @returns {Promise<Array>} List of shortened URLs with analytics
   */
  async getAllURLs() {
    const { data, error } = await supabase
      .from('shortened_urls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Get URL by short code (for redirection)
   * @param {string} shortCode 
   * @returns {Promise<Object|null>}
   */
  async getByShortCode(shortCode) {
    const { data, error } = await supabase
      .from('shortened_urls')
      .select('*')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * Create new shortened URL
   * @param {Object} payload - {original_url, short_code?, title?, description?}
   * @returns {Promise<Object>}
   */
  async createURL(payload) {
    // Generate short code if not provided
    if (!payload.short_code) {
      payload.short_code = this.generateShortCode();
    }

    const { data, error } = await supabase
      .from('shortened_urls')
      .insert([{
        original_url: payload.original_url,
        short_code: payload.short_code,
        title: payload.title || null,
        description: payload.description || null,
        qr_code_url: payload.qr_code_url || null,
        expires_at: payload.expires_at || null
      }])
      .select();

    if (error) {
      // Handle duplicate short_code
      if (error.code === '23505') {
        throw new Error('Short code already exists. Try another one.');
      }
      throw new Error(error.message);
    }

    return data?.[0] || null;
  },

  /**
   * Update shortened URL
   * @param {string} id 
   * @param {Object} payload 
   * @returns {Promise<Object>}
   */
  async updateURL(id, payload) {
    const { data, error } = await supabase
      .from('shortened_urls')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Delete shortened URL
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async deleteURL(id) {
    const { error } = await supabase
      .from('shortened_urls')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /**
   * Increment click count (for analytics)
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async incrementClickCount(id) {
    const { error } = await supabase.rpc('increment_url_clicks', { url_id: id });
    
    if (error) {
      // Fallback: manual increment if RPC function not exists
      const { error: updateError } = await supabase
        .from('shortened_urls')
        .update({ 
          click_count: supabase.sql`click_count + 1`,
          last_clicked_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) console.error('Click count update failed:', updateError);
    }
  },

  /**
   * Track click event (detailed analytics)
   * @param {string} urlId 
   * @param {Object} metadata - {referrer?, user_agent?, ip_address?}
   * @returns {Promise<void>}
   */
  async trackClick(urlId, metadata = {}) {
    const { error } = await supabase
      .from('url_clicks')
      .insert([{
        shortened_url_id: urlId,
        referrer: metadata.referrer || null,
        user_agent: metadata.user_agent || null,
        ip_address: metadata.ip_address || null
      }]);

    if (error) console.error('Click tracking failed:', error);
  },

  /**
   * Get click analytics for a URL
   * @param {string} urlId 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async getClickAnalytics(urlId, limit = 100) {
    const { data, error } = await supabase
      .from('url_clicks')
      .select('*')
      .eq('shortened_url_id', urlId)
      .order('clicked_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data || [];
  }
};
