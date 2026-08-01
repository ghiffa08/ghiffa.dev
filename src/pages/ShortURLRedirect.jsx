import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { URLRepository } from '../repositories/URLRepository';

/**
 * URL Redirect Handler
 * Public route: /s/:shortCode
 * Handles short URL redirection with analytics tracking
 */
export default function ShortURLRedirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        navigate('/');
        return;
      }

      try {
        // Fetch URL data by short code
        const urlData = await URLRepository.getByShortCode(shortCode);

        if (!urlData) {
          // Short code not found, redirect to home
          navigate('/', { replace: true });
          return;
        }

        // Track click analytics (fire and forget)
        URLRepository.incrementClickCount(urlData.id).catch(err => 
          console.error('Analytics tracking failed:', err)
        );

        // Track detailed click data
        URLRepository.trackClick(urlData.id, {
          referrer: document.referrer,
          user_agent: navigator.userAgent
        }).catch(err => 
          console.error('Click tracking failed:', err)
        );

        // Redirect to original URL
        window.location.href = urlData.original_url;
      } catch (error) {
        console.error('Redirect error:', error);
        navigate('/', { replace: true });
      }
    };

    handleRedirect();
  }, [shortCode, navigate]);

  // Loading state during redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-mono text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
