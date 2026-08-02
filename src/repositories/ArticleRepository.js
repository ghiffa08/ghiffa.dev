import { supabase } from '../lib/supabaseClient';

export const ArticleRepository = {
  /**
   * Fetches published articles from Supabase, ordered by published_at descending.
   * @param {number|null} limit 
   * @returns {Promise<Array>} List of published articles.
   */
  async getAllArticles(limit = null) {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Fetches ALL articles (including drafts) for admin use.
   * @returns {Promise<Array>} List of all articles.
   */
  async getAllArticlesAdmin() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Finds an article by its slug.
   * @param {string} slug 
   * @returns {Promise<Object|null>} The matching article object.
   */
  async getArticleBySlug(slug) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }

    return data || null;
  },

  /**
   * Creates a new article in the database.
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The created article.
   */
  async createArticle(payload) {
    const { data, error } = await supabase
      .from('articles')
      .insert([payload])
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Updates an existing article in the database.
   * @param {string} id 
   * @param {Object} payload 
   * @returns {Promise<Object|null>} The updated article.
   */
  async updateArticle(id, payload) {
    const { data, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0] || null;
  },

  /**
   * Deletes an article from the database.
   * @param {string} id 
   * @returns {Promise<boolean>} Success state.
   */
  async deleteArticle(id) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
};
