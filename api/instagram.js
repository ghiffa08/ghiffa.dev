/**
 * Vercel Serverless Function to fetch Instagram feed.
 * Accesses a secure process.env.IG_ACCESS_TOKEN and applies Global Edge Caching.
 */
export default async function handler(req, res) {
  const token = process.env.IG_ACCESS_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: { message: 'Server configuration error: IG_ACCESS_TOKEN is missing.' }
    });
  }

  // Parse limit from request query, default to 50
  const limit = req.query?.limit ? parseInt(req.query.limit, 10) : 50;

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${token}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: { message: errorData?.error?.message || 'Failed to fetch Instagram API' }
      });
    }

    const data = await response.json();

    // Cache responses at the edge for 1 hour, allowing stale-while-revalidate for up to 24 hours
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || 'Internal Server Error' }
    });
  }
}
