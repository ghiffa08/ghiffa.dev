export const InstagramRepository = {
  /**
   * Fetches Instagram posts from the serverless backend function.
   * @returns {Promise<Array>} List of Instagram post items.
   */
  async getFeeds() {
    const res = await fetch('/api/instagram');
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || 'Failed to fetch Instagram feed');
    }
    const data = await res.json();
    return data?.data || [];
  }
};
