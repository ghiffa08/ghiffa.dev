import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  Clock,
  Calendar,
  X,
  MessageCircle,
  Bookmark,
  Play,
  Pause,
  Square,
  MoreHorizontal,
  Send,
  ExternalLink,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Languages,
  Sparkles,
  Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabaseClient';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { useSupabaseSingle } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';
import { ScrollReveal } from '../components/atoms/ScrollReveal';
import { ArticlesHeader, PortfolioFooter } from '../components/organisms/portfolio';
import { RefineImage } from '../components/RefineImage';
import { formatReadTime } from '../utils/formatReadTime';

/**
 * Custom Clapping Hands Icon matching Medium's signature look
 */
const ClapIcon = ({ className = "w-5 h-5", filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? "0" : "1.8"}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M19.07 4.93a10 10 0 0 0-1.4-1.15M4.93 19.07a10 10 0 0 1-1.15-1.4"
      opacity="0.3"
    />
    <path d="M14.5 4.5c.83 0 1.5.67 1.5 1.5v5.5a1 1 0 0 0 2 0V7.5a1.5 1.5 0 0 1 3 0v6.5a7 7 0 0 1-7 7h-1.5a7 7 0 0 1-5.74-3l-2.4-3.6a1.5 1.5 0 0 1 2.5-1.66l1.64 2.46V4.5a1.5 1.5 0 0 1 3 0v4.5a1 1 0 0 0 2 0V4.5c0-.83.67-1.5 1.5-1.5z" />
  </svg>
);

/**
 * Format ISO timestamp into clean long date format (e.g. "October 12, 2024").
 */
const formatDateLong = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Relative time helper (e.g. "2 hours ago", "Yesterday").
 */
const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'just now';
  const now = new Date();
  const past = new Date(timestamp);
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Clean and normalize article markdown/rich text.
 */
const cleanArticleMarkdown = (raw) => {
  if (!raw || typeof raw !== 'string') return { isHtml: false, content: '' };
  const trimmed = raw.trim();

  const hasBlockHtml = /<(h[1-6]|table|blockquote|pre)[\s>]/i.test(trimmed);
  const hasMarkdownHeadings = /###|##|#\s/.test(trimmed);
  const hasNumberedBold = /\*\*\d+\.\s+[^*]+?\*\*/.test(trimmed);

  if (hasBlockHtml && !hasMarkdownHeadings && !hasNumberedBold) {
    return { isHtml: true, content: trimmed };
  }

  let text = trimmed;

  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  text = text.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n\n');

  text = text.replace(/###\s*([^?\n]+?\?)\s*([A-Z])/g, '\n\n### $1\n\n$2');
  text = text.replace(
    /###\s*([A-Za-z0-9\s'&,-]+?)(?=\s+[A-Z][a-z]+ (?:we|you|I|they|it|is|are|was|were|all|about|have|can|will|would|could|should|bukan|dan|di|ke|ini|itu)\b|\n|$)/g,
    '\n\n### $1\n\n'
  );
  text = text.replace(/([^\n])\s*(###\s+[^\n]+)/g, '$1\n\n$2\n\n');
  text = text.replace(/([^\n]|^)\s*(\*\*\d+\.\s+[^*]+?\*\*)\s*([A-Z])/g, '$1\n\n### $2\n\n$3');
  text = text.replace(/###\s*\*\*(\d+\.\s+[^*]+?)\*\*/g, '### $1');
  text = text.replace(/([^\n])\s*(-\s+\*\*[^*]+?\*\*)/g, '$1\n\n$2');
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return { isHtml: false, content: text };
};

/**
 * Intelligent Language Detector (Indonesian vs English)
 */
const detectLanguage = (text = '') => {
  if (!text) return 'en-US';
  const sample = text.toLowerCase();
  const idKeywords = [
    'yang', 'dan', 'di', 'ke', 'ini', 'itu', 'dengan', 'untuk', 'dari', 
    'adalah', 'bisa', 'kamu', 'kami', 'mereka', 'pada', 'juga', 'akan', 
    'belajar', 'kita', 'oleh', 'saat', 'sudah', 'karena', 'seperti'
  ];
  let count = 0;
  for (const w of idKeywords) {
    if (sample.includes(` ${w} `) || sample.startsWith(`${w} `) || sample.includes(` ${w}.`)) {
      count++;
      if (count >= 2) return 'id-ID';
    }
  }
  return 'en-US';
};

/**
 * Split text into robust, short chunks to prevent the 15-second Chromium speech timeout
 */
const prepareSpeechChunks = (title, description, content) => {
  // Strip out markdown code blocks, links, formatting, images, HTML tags
  const cleanBody = (content || '')
    .replace(/```[\s\S]*?```/g, ' ')     // code blocks
    .replace(/`([^`]+)`/g, '$1')        // inline code
    .replace(/!\[.*?\]\(.*?\)/g, ' ')     // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')  // markdown links
    .replace(/<[^>]+>/g, ' ')            // HTML tags
    .replace(/[#*~_>]/g, ' ')            // formatting symbols
    .replace(/\s+/g, ' ')
    .trim();

  const fullText = `${title || ''}. ${description ? description + '.' : ''} ${cleanBody}`.trim();

  // Split at sentence boundaries (punctuation)
  const rawSentences = fullText
    .replace(/([.?!])\s+/g, '$1\n')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 2);

  // Group sentences into short chunks (max ~130 chars) to prevent Chrome speech synthesis timeout
  const chunks = [];
  let buffer = '';
  for (const s of rawSentences) {
    if ((buffer + ' ' + s).trim().length < 130) {
      buffer = buffer ? `${buffer} ${s}` : s;
    } else {
      if (buffer.trim()) chunks.push(buffer.trim());
      buffer = s;
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());

  const validChunks = chunks.filter(c => /[a-zA-Z0-9]/.test(c));
  return validChunks.length > 0 ? validChunks : [title || 'Article story'];
};

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: info } = useSupabaseSingle('personal_info');

  const [article, setArticle] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Medium Claps & Bookmark State
  const [claps, setClaps] = useState(0);
  const [myClaps, setMyClaps] = useState(0);
  const [clapBubbles, setClapBubbles] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const pendingClapsRef = useRef(0);
  const clapTimerRef = useRef(null);

  // Responses / Comments State
  const [showResponsesDrawer, setShowResponsesDrawer] = useState(false);
  const [responses, setResponses] = useState([]);
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [newResponse, setNewResponse] = useState({ name: '', content: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  // Share Modal & Toast
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Reading progress and sticky bar
  const [readingProgress, setReadingProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [largeFont, setLargeFont] = useState(false);

  // ==========================================================
  // ROBUST MULTI-LANGUAGE TEXT-TO-SPEECH (TTS) PLAYER ENGINE
  // ==========================================================
  const [audioState, setAudioState] = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [currentChunkIdx, setCurrentChunkIdx] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0); // 0.85, 1.0, 1.25, 1.5
  const [speechLang, setSpeechLang] = useState('id-ID'); // 'id-ID' or 'en-US'
  const [availableVoices, setAvailableVoices] = useState([]);

  const isMountedRef = useRef(true);
  const isPlayingRef = useRef(false);
  const chunksRef = useRef([]);
  const chunkIdxRef = useRef(0);
  const rateRef = useRef(1.0);
  const langRef = useRef('id-ID');
  const consecutiveErrorsRef = useRef(0);
  const speechTimerRef = useRef(null);
  const hasFallbackLanguageRef = useRef(false);
  const topActionBarRef = useRef(null);

  const email = info?.email || 'hello@ghiffa.dev';
  const appName = settings?.app_name || 'ghiffa.dev';
  const authorName = info?.full_name || 'Haikal Jibran Al-Ghiffarry';
  const authorAvatar = info?.avatar_url || '/ghiffa.png';

  const articleUrl = typeof window !== 'undefined' ? window.location.href : `https://ghiffa.dev/article/${slug}`;

  const processedContent = useMemo(() => {
    return cleanArticleMarkdown(article?.content);
  }, [article?.content]);

  // Derive Topic Tags
  const articleTags = useMemo(() => {
    if (Array.isArray(article?.tags) && article.tags.length > 0) {
      return article.tags;
    }
    const tags = [];
    const textToScan = `${article?.title || ''} ${article?.description || ''}`.toLowerCase();
    if (textToScan.includes('ai') || textToScan.includes('intelligence')) tags.push('AI');
    if (textToScan.includes('code') || textToScan.includes('program') || textToScan.includes('dev')) tags.push('Programming');
    if (textToScan.includes('skillstreak') || textToScan.includes('gamif')) tags.push('Gamification');
    if (textToScan.includes('web') || textToScan.includes('frontend') || textToScan.includes('fullstack')) tags.push('Web Development');
    if (textToScan.includes('agent') || textToScan.includes('prompt')) tags.push('AI Agent');
    if (textToScan.includes('product') || textToScan.includes('design')) tags.push('Productivity');
    if (tags.length === 0) tags.push('Technology', 'Engineering');
    return tags;
  }, [article]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2400);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2200);
  };

  // Sync refs with state
  useEffect(() => {
    chunkIdxRef.current = currentChunkIdx;
  }, [currentChunkIdx]);

  useEffect(() => {
    rateRef.current = speechRate;
  }, [speechRate]);

  useEffect(() => {
    langRef.current = speechLang;
  }, [speechLang]);

  // Load voices reliably across Chromium, Firefox, WebKit
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          setAvailableVoices(v);
        }
      } catch {
        // ignore
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Strict language-prefix voice matching to prevent Chromium cross-voice synthesis-failed crashes
  const getSelectedVoice = (targetLang) => {
    const liveVoices = (typeof window !== 'undefined' && 'speechSynthesis' in window) 
      ? window.speechSynthesis.getVoices() 
      : [];
    const pool = (liveVoices && liveVoices.length > 0) ? liveVoices : availableVoices;
    if (!pool || pool.length === 0) return null;

    const prefix = (targetLang || 'en').slice(0, 2).toLowerCase();

    // Find voices matching the target language prefix (e.g. 'id' or 'en')
    const matches = pool.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(prefix));

    if (matches.length > 0) {
      const natural = matches.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Natural') || 
        v.name.includes('Samantha') || 
        v.name.includes('Indonesian') ||
        v.name.includes('Premium') ||
        v.name.includes('Online')
      );
      return natural || matches[0];
    }

    // CRITICAL: If no voice matches target language (e.g. Indonesian not installed on OS),
    // NEVER attach a mismatching English voice object, return null so browser picks default
    return null;
  };

  // Speak specific chunk safely
  const playChunk = (index, shouldCancelBefore = false) => {
    if (!('speechSynthesis' in window)) return;
    const chunks = chunksRef.current;
    if (!chunks || chunks.length === 0 || index >= chunks.length) {
      setAudioState('idle');
      isPlayingRef.current = false;
      setCurrentChunkIdx(0);
      consecutiveErrorsRef.current = 0;
      showToast('Finished listening to the story!');
      return;
    }

    if (shouldCancelBefore) {
      window.speechSynthesis.cancel();
    }

    setCurrentChunkIdx(index);
    chunkIdxRef.current = index;

    try {
      const textToSpeak = chunks[index];
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rateRef.current;

      const matchedVoice = getSelectedVoice(langRef.current);

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        // Fallback: If no matching voice exists or if fallback is active
        if (hasFallbackLanguageRef.current) {
          utterance.lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
        } else {
          utterance.lang = langRef.current || 'en-US';
        }
      }

      utterance.onstart = () => {
        consecutiveErrorsRef.current = 0;
      };

      utterance.onend = () => {
        consecutiveErrorsRef.current = 0;
        hasFallbackLanguageRef.current = false;
        if (isMountedRef.current && isPlayingRef.current) {
          clearTimeout(speechTimerRef.current);
          speechTimerRef.current = setTimeout(() => {
            if (isMountedRef.current && isPlayingRef.current) {
              playChunk(index + 1, false);
            }
          }, 50);
        }
      };

      utterance.onerror = (e) => {
        // Clean return on deliberate pause, stop, or cancel
        if (e.error === 'canceled' || e.error === 'interrupted') return;

        console.warn('Speech chunk notification:', e.error);
        consecutiveErrorsRef.current += 1;

        // Circuit breaker: prevent rapid cascading infinite error loops
        if (consecutiveErrorsRef.current >= 2) {
          console.warn('Speech synthesis permanently failed or unavailable for this voice.');
          isPlayingRef.current = false;
          setAudioState('idle');
          showToast('Speech audio is unavailable or unsupported on this device.');
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          return;
        }

        // First failure: try one graceful fallback with browser default speech settings
        hasFallbackLanguageRef.current = true;
        clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          if (isMountedRef.current && isPlayingRef.current) {
            playChunk(index, true);
          }
        }, 120);
      };

      // Ensure speech synthesis engine is active and not paused in Chromium
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis invocation exception:', err);
      isPlayingRef.current = false;
      setAudioState('idle');
      showToast('Could not start audio playback.');
    }
  };

  // Toggle Play / Pause
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (audioState === 'playing') {
      window.speechSynthesis.pause();
      setAudioState('paused');
      isPlayingRef.current = false;
      showToast('Audio paused');
      return;
    }

    if (audioState === 'paused') {
      window.speechSynthesis.resume();
      setAudioState('playing');
      isPlayingRef.current = true;
      showToast('Resuming story audio...');
      return;
    }

    // Start fresh
    const chunks = prepareSpeechChunks(article?.title, article?.description, processedContent.content);
    chunksRef.current = chunks;
    setAudioState('playing');
    isPlayingRef.current = true;
    consecutiveErrorsRef.current = 0;
    hasFallbackLanguageRef.current = false;

    showToast(`Playing story audio...`);

    // Give Chromium a brief 60ms breath after cancel before speaking first chunk
    window.speechSynthesis.cancel();
    clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      if (isMountedRef.current && isPlayingRef.current) {
        playChunk(0, false);
      }
    }, 60);
  };

  // Stop Audio
  const handleStopAudio = () => {
    clearTimeout(speechTimerRef.current);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioState('idle');
    isPlayingRef.current = false;
    setCurrentChunkIdx(0);
    consecutiveErrorsRef.current = 0;
    showToast('Audio stopped');
  };

  // Skip Forward chunk
  const handleNextChunk = () => {
    const nextIdx = Math.min(chunksRef.current.length - 1, currentChunkIdx + 1);
    setCurrentChunkIdx(nextIdx);
    if (audioState === 'playing') {
      window.speechSynthesis.cancel();
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && isPlayingRef.current) {
          playChunk(nextIdx, false);
        }
      }, 60);
    }
  };

  // Skip Backward chunk
  const handlePrevChunk = () => {
    const prevIdx = Math.max(0, currentChunkIdx - 1);
    setCurrentChunkIdx(prevIdx);
    if (audioState === 'playing') {
      window.speechSynthesis.cancel();
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && isPlayingRef.current) {
          playChunk(prevIdx, false);
        }
      }, 60);
    }
  };

  // Cycle Speed (1x -> 1.25x -> 1.5x -> 0.85x)
  const handleCycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 0.85];
    const currIdx = speeds.indexOf(speechRate);
    const nextSpeed = speeds[(currIdx + 1) % speeds.length];
    setSpeechRate(nextSpeed);
    showToast(`Playback speed set to ${nextSpeed}x`);

    if (audioState === 'playing') {
      window.speechSynthesis.cancel();
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && isPlayingRef.current) {
          playChunk(chunkIdxRef.current, false);
        }
      }, 60);
    }
  };

  // Toggle Language between Indonesian and English
  const handleToggleLanguage = () => {
    const nextLang = speechLang === 'id-ID' ? 'en-US' : 'id-ID';
    setSpeechLang(nextLang);
    hasFallbackLanguageRef.current = false;
    showToast(`Voice language switched to ${nextLang === 'id-ID' ? 'Indonesian' : 'English'}`);

    if (audioState === 'playing') {
      window.speechSynthesis.cancel();
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && isPlayingRef.current) {
          playChunk(chunkIdxRef.current, false);
        }
      }, 60);
    }
  };

  // Scroll tracking for reading progress and sticky bar (throttled via RAF to eliminate scroll jank)
  useEffect(() => {
    let rafId = null;
    let lastProgress = -1;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const rawProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        const progress = Math.min(100, Math.max(0, Math.round(rawProgress)));

        if (Math.abs(progress - lastProgress) >= 1) {
          lastProgress = progress;
          setReadingProgress(progress);
        }

        if (topActionBarRef.current) {
          const topBarRect = topActionBarRef.current.getBoundingClientRect();
          const shouldShow = topBarRect.bottom < 0;
          setShowStickyBar((prev) => (prev !== shouldShow ? shouldShow : prev));
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch Article, Saved State, Claps, and Responses
  useEffect(() => {
    window.scrollTo(0, 0);
    isMountedRef.current = true;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioState('idle');
      isPlayingRef.current = false;
    }

    async function fetchArticleAndMore() {
      setLoading(true);
      try {
        const data = await ArticleRepository.getArticleBySlug(slug);
        if (!data) {
          setNotFound(true);
        } else {
          setArticle(data);
          setNotFound(false);
          setClaps(data.claps_count || 48);

          // Auto-detect language
          const detected = detectLanguage(`${data.title} ${data.description || ''} ${data.content || ''}`);
          setSpeechLang(detected);

          // Check if article is bookmarked in localStorage
          try {
            const saved = JSON.parse(localStorage.getItem('ghiffa_saved_articles') || '[]');
            setIsBookmarked(saved.includes(slug));

            const storedClaps = parseInt(localStorage.getItem(`ghiffa_claps_${data.id}`) || '0', 10);
            setMyClaps(storedClaps);

            const savedName = localStorage.getItem('ghiffa_reader_name') || '';
            if (savedName) setNewResponse(prev => ({ ...prev, name: savedName }));
          } catch {
            // ignore localStorage errors
          }

          // Fetch responses
          try {
            const respList = await ArticleRepository.getResponses(data.id);
            setResponses(respList || []);
          } catch (err) {
            console.error('Failed to load responses:', err);
          }

          // Fetch more articles
          try {
            const all = await ArticleRepository.getAllArticles(4);
            const others = (all || []).filter((item) => item.slug !== slug).slice(0, 3);
            setMoreArticles(others);
          } catch {
            // non-fatal
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchArticleAndMore();

    return () => {
      isMountedRef.current = false;
      isPlayingRef.current = false;
      clearTimeout(speechTimerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slug]);

  // Clapping handler
  const handleClap = async (e) => {
    if (e) e.stopPropagation();
    if (!article) return;

    if (myClaps >= 50) {
      showToast("You've reached the 50 claps limit on this story!");
      return;
    }

    const nextClaps = claps + 1;
    const nextMyClaps = myClaps + 1;
    setClaps(nextClaps);
    setMyClaps(nextMyClaps);

    const id = Date.now() + Math.random();
    setClapBubbles(prev => [...prev, { id, count: nextMyClaps }]);
    setTimeout(() => {
      setClapBubbles(prev => prev.filter(b => b.id !== id));
    }, 1000);

    localStorage.setItem(`ghiffa_claps_${article.id}`, nextMyClaps.toString());

    // Debounce mutation to Supabase by 1000ms to batch rapid claps into 1 request
    pendingClapsRef.current += 1;
    if (clapTimerRef.current) clearTimeout(clapTimerRef.current);
    clapTimerRef.current = setTimeout(async () => {
      const amountToSend = pendingClapsRef.current;
      pendingClapsRef.current = 0;
      if (amountToSend > 0) {
        try {
          await ArticleRepository.incrementClaps(article.id, amountToSend);
        } catch {
          // non-fatal
        }
      }
    }, 1000);
  };

  // Bookmark / Save handler
  const handleToggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('ghiffa_saved_articles') || '[]');
      let updated;
      if (isBookmarked) {
        updated = saved.filter(s => s !== slug);
        setIsBookmarked(false);
        showToast('Story removed from your Reading List');
      } else {
        updated = [...saved, slug];
        setIsBookmarked(true);
        showToast('Story saved to your Reading List');
      }
      localStorage.setItem('ghiffa_saved_articles', JSON.stringify(updated));
    } catch {
      setIsBookmarked(!isBookmarked);
    }
  };

  // Submit community response
  const handleAddResponse = async (e) => {
    e.preventDefault();
    if (!newResponse.name.trim() || !newResponse.content.trim() || !article) return;

    setSubmittingResponse(true);
    try {
      const created = await ArticleRepository.submitResponse({
        articleId: article.id,
        authorName: newResponse.name.trim(),
        content: newResponse.content.trim()
      });

      localStorage.setItem('ghiffa_reader_name', newResponse.name.trim());
      setResponses(prev => [created, ...prev]);
      setNewResponse(prev => ({ ...prev, content: '' }));
      showToast('Response published!');
    } catch (err) {
      console.error('Failed to submit response:', err);
      const localItem = {
        id: Date.now(),
        author_name: newResponse.name.trim(),
        content: newResponse.content.trim(),
        created_at: new Date().toISOString()
      };
      setResponses(prev => [localItem, ...prev]);
      setNewResponse(prev => ({ ...prev, content: '' }));
      showToast('Response posted!');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Check if admin is authenticated to enable comment moderation
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setIsAdmin(true);
      }
    });
  }, []);

  // Admin delete response
  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm('Are you sure you want to delete this response permanently?')) return;
    try {
      await ArticleRepository.deleteResponse(responseId);
      setResponses(prev => prev.filter(r => r.id !== responseId));
      showToast('Response deleted.');
    } catch (err) {
      alert('Failed to delete response: ' + (err.message || 'Unknown error'));
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#141414] flex flex-col font-sans">
        <ArticlesHeader showBack={true} emailAddress={email} />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-24 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#111111] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 animate-pulse">
            Loading Article...
          </p>
        </main>
        <PortfolioFooter emailAddress={email} />
      </div>
    );
  }

  // Not Found State
  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-white text-[#141414] flex flex-col font-sans">
        <ArticlesHeader showBack={true} emailAddress={email} />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-24 text-center flex flex-col items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-2">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-3">
            Article Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The article you are looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium px-5 py-2.5 rounded-full bg-[#141414] text-white hover:bg-[#2b2b2b] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </main>
        <PortfolioFooter emailAddress={email} />
      </div>
    );
  }

  // ==========================================================
  // COMPREHENSIVE SEO & SCHEMA.ORG GRAPH MARKUP
  // ==========================================================
  const detectedLangCode = speechLang === 'id-ID' ? 'id-ID' : 'en-US';
  const totalWordCount = processedContent.content.split(/\s+/).filter(Boolean).length;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${articleUrl}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://ghiffa.dev/#website',
          name: 'ghiffa.dev',
          url: 'https://ghiffa.dev'
        },
        headline: article.title,
        description: article.description,
        inLanguage: detectedLangCode,
        mainEntityOfPage: articleUrl,
        datePublished: article.published_at,
        dateModified: article.updated_at || article.published_at,
        image: article.cover_image ? [article.cover_image] : ['https://ghiffa.dev/og-image.jpg'],
        keywords: articleTags.join(', '),
        articleSection: articleTags[0] || 'Technology',
        wordCount: totalWordCount,
        author: {
          '@type': 'Person',
          '@id': 'https://ghiffa.dev/#person',
          name: authorName,
          jobTitle: 'Fullstack Web Developer & IoT Engineer',
          url: 'https://ghiffa.dev',
          sameAs: [
            'https://github.com/ghiffa08',
            'https://www.linkedin.com/in/haikal-jibran-al-ghiffarry',
            'https://www.instagram.com/haikaljibraan'
          ]
        },
        publisher: {
          '@type': 'Organization',
          name: 'ghiffa.dev',
          url: 'https://ghiffa.dev',
          logo: {
            '@type': 'ImageObject',
            url: 'https://ghiffa.dev/ghiffa.png'
          }
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://ghiffa.dev'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Articles',
            item: 'https://ghiffa.dev/articles'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleUrl
          }
        ]
      }
    ]
  };

  const totalChunks = chunksRef.current.length || 1;
  const chunkProgressPercent = Math.round(((currentChunkIdx + 1) / totalChunks) * 100);

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col selection:bg-[#FF5500] selection:text-white font-sans relative">
      <SEO
        title={`${article.title} | ${appName}`}
        description={article.description}
        image={article.cover_image}
        url={articleUrl}
        type="article"
        publishedDate={article.published_at}
        modifiedDate={article.updated_at || article.published_at}
        keywords={articleTags}
        tags={articleTags}
        section={articleTags[0] || 'Technology'}
        jsonLd={articleSchema}
      />

      {/* 1. MEDIUM READING PROGRESS BAR (STICKY AT TOP OF VIEWPORT) */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#FF5500] to-[#FF7700] z-[100] transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] bg-[#141414] text-white text-xs font-mono px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check size={14} className="text-[#FF5500]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reusable Header */}
      <ArticlesHeader currentTitle={article.title} showBack={true} emailAddress={email} />

      <main className="flex-1 w-full">
        {/* Article Container (Medium Standard Width ~720px - 820px) */}
        <div className="max-w-[820px] mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-8">
          <ScrollReveal delay={0.05} y={16}>
            {/* Semantic Header & Navigation */}
            <header>
              <nav aria-label="Breadcrumb">
                <Link
                  to="/articles"
                  className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-black transition-colors mb-6"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Back to all articles</span>
                </Link>
              </nav>

              {/* Medium-style Topic Pills / Tags */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
                {articleTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Single Primary <h1> Article Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-[-0.035em] text-[#141414] leading-[1.12] mb-4">
                {article.title}
              </h1>

              {/* Subtitle / Description */}
              {article.description && (
                <p className="text-lg sm:text-xl text-gray-500 font-normal leading-relaxed mb-6 font-serif sm:font-sans">
                  {article.description}
                </p>
              )}

              {/* Author Profile Bar */}
              <div className="flex items-center gap-3.5 py-4">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = '/ghiffa.png';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#141414]">{authorName}</span>
                    <span className="text-xs text-gray-400 font-normal">&middot;</span>
                    <a
                      href="mailto:hello@ghiffa.dev"
                      className="text-xs font-medium text-emerald-600 hover:underline"
                    >
                      Follow
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-0.5">
                    <span>{formatReadTime(article.read_time)}</span>
                    <span>&middot;</span>
                    <time dateTime={article.published_at}>
                      {formatDateLong(article.published_at)}
                    </time>
                  </div>
                </div>
              </div>
            </header>

            {/* 2. MEDIUM ACTION BAR (TOOLBAR UNDER AUTHOR) */}
            <div
              ref={topActionBarRef}
              className="py-3 my-4 border-y border-gray-200/80 flex items-center justify-between text-gray-500 select-none"
            >
              {/* Left Actions: Claps & Responses */}
              <div className="flex items-center gap-5 sm:gap-6">
                {/* Claps Button with Floating Counter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleClap}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-all cursor-pointer group active:scale-95"
                    title="Clap for this story"
                  >
                    <div className={`p-1 rounded-full transition-transform group-hover:scale-110 ${myClaps > 0 ? 'text-[#FF5500]' : 'text-gray-600'}`}>
                      <ClapIcon className="w-5 h-5" filled={myClaps > 0} />
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-700">
                      {claps}
                    </span>
                  </button>

                  {/* Floating +1 / count bubbles */}
                  {clapBubbles.map((bubble) => (
                    <span
                      key={bubble.id}
                      className="absolute -top-6 left-2 font-mono font-extrabold text-xs text-[#FF5500] animate-out fade-out slide-out-to-top-4 duration-700 pointer-events-none select-none"
                    >
                      +{bubble.count}
                    </span>
                  ))}
                </div>

                {/* Responses / Comments Button */}
                <button
                  type="button"
                  onClick={() => setShowResponsesDrawer(true)}
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors cursor-pointer group"
                  title="View and write responses"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-mono font-medium text-gray-700">
                    {responses.length}
                  </span>
                </button>
              </div>

              {/* Right Actions: Bookmark, Listen, Share, Font size */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Save / Bookmark Story */}
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${
                    isBookmarked ? 'text-[#FF5500]' : 'text-gray-500 hover:text-black'
                  }`}
                  title={isBookmarked ? 'Saved to Reading List' : 'Save story'}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#FF5500]' : ''}`} />
                </button>

                {/* Listen / Play Story (Text-to-Speech) */}
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    audioState === 'playing'
                      ? 'bg-[#FF5500] text-white shadow-sm'
                      : audioState === 'paused'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Listen to article"
                >
                  {audioState === 'playing' ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Listening...</span>
                    </>
                  ) : audioState === 'paused' ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#FF5500]" />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Share story"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Font Size Toggle */}
                <button
                  type="button"
                  onClick={() => setLargeFont(prev => !prev)}
                  className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer text-xs font-mono font-bold"
                  title="Toggle font size"
                >
                  <span className="text-[11px]">{largeFont ? 'A-' : 'A+'}</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Article Cover Image with SEO optimization */}
        {article.cover_image && (
          <div className="max-w-[920px] mx-auto px-4 sm:px-8 mb-10 sm:mb-14">
            <ScrollReveal delay={0.1} y={20}>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-[#18181B] border border-black/5 shadow-xs">
                <RefineImage
                  src={article.cover_image}
                  alt={article.title}
                  aspectRatio="16 / 9"
                  radius={24}
                  priority={true}
                  className="w-full max-h-[620px]"
                  imgClassName="max-h-[620px] object-cover sm:object-center"
                />
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* 3. ARTICLE CONTENT CONTAINER */}
        <article className="max-w-[760px] mx-auto px-4 sm:px-8 pb-16">
          <div className={`prose-portfolio ${largeFont ? 'text-[19px] sm:text-[21px] leading-[1.8]' : 'text-[17px] sm:text-[19px] leading-[1.75]'}`}>
            {processedContent.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: processedContent.content }} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <RefineImage
                      src={props.src}
                      alt={props.alt || ''}
                      aspectRatio="16 / 9"
                      radius={16}
                      className="my-6 rounded-2xl overflow-hidden shadow-xs border border-gray-100"
                    />
                  )
                }}
              >
                {processedContent.content}
              </ReactMarkdown>
            )}
          </div>

          {/* Article Topic Tags (Bottom List) */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {articleTags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-mono rounded-full transition-colors select-none"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-8 py-4 border-y border-gray-200/80 flex items-center justify-between text-gray-500 select-none">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={handleClap}
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-transform cursor-pointer group active:scale-95"
              >
                <div className={`p-1 rounded-full group-hover:scale-110 transition-transform ${myClaps > 0 ? 'text-[#FF5500]' : ''}`}>
                  <ClapIcon className="w-6 h-6" filled={myClaps > 0} />
                </div>
                <span className="text-sm font-mono font-bold">{claps}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowResponsesDrawer(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-mono font-medium">{responses.length}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${
                  isBookmarked ? 'text-[#FF5500]' : 'text-gray-500 hover:text-black'
                }`}
                title="Save story"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#FF5500]' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                title="Share story"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="mt-12 p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                e.currentTarget.src = '/ghiffa.png';
              }}
            />
            <div className="flex-1">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold mb-1">
                Written by
              </div>
              <h3 className="text-lg font-bold text-[#141414] mb-1.5">{authorName}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Fullstack Web Developer, IoT Architect, and founder of Skillstreak.id. Passionate about interactive design systems and developer tooling.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <a
                  href="mailto:hello@ghiffa.dev"
                  className="px-4 py-1.5 bg-[#141414] text-white text-xs font-mono font-semibold rounded-full hover:bg-[#FF5500] transition-colors"
                >
                  Contact Author
                </a>
                <a
                  href="https://instagram.com/haikaljibraan"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-gray-500 hover:text-black transition-colors"
                >
                  @haikaljibraan
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* More Articles Section */}
        {moreArticles.length > 0 && (
          <section className="border-t border-gray-100 bg-[#FAFAFA] py-16 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#FF5500] block mb-1">
                    Continue Reading
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141414]">
                    Recommended from ghiffa.dev
                  </h2>
                </div>

                <Link
                  to="/articles"
                  className="text-xs font-mono text-gray-600 hover:text-black inline-flex items-center gap-1 font-medium"
                >
                  <span>Explore all</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {moreArticles.map((otherArticle, idx) => (
                  <Link
                    key={otherArticle.id || idx}
                    to={`/article/${otherArticle.slug}`}
                    className="group bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-gray-400 hover:shadow-xs transition-all flex flex-col"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-black/5">
                      {otherArticle.cover_image ? (
                        <RefineImage
                          src={otherArticle.cover_image}
                          alt={otherArticle.title}
                          aspectRatio="4 / 3"
                          radius={12}
                          className="w-full h-full"
                          imgClassName="group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/30 font-mono text-xs">
                          ghiffa.dev
                        </div>
                      )}
                    </div>

                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                      {formatDateLong(otherArticle.published_at)}
                    </span>

                    <h3 className="text-base font-semibold text-[#141414] group-hover:text-[#FF5500] transition-colors line-clamp-2 mb-2 leading-snug">
                      {otherArticle.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-auto pt-1">
                      {otherArticle.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 4. DEDICATED ADVANCED MEDIUM AUDIO TTS PLAYER (WHEN ACTIVE) */}
      {audioState !== 'idle' && (
        <div className="fixed bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#141414] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 font-mono text-xs animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[94vw] sm:max-w-md">
          {/* Animated Equalizer bars */}
          <div className="flex items-center gap-0.5 h-3.5 px-1 shrink-0">
            <span className={`w-0.5 bg-[#FF5500] rounded-full ${audioState === 'playing' ? 'h-3 animate-pulse' : 'h-1.5'}`} />
            <span className={`w-0.5 bg-white rounded-full ${audioState === 'playing' ? 'h-4 animate-bounce' : 'h-2'}`} />
            <span className={`w-0.5 bg-[#FF5500] rounded-full ${audioState === 'playing' ? 'h-2.5 animate-pulse' : 'h-1'}`} />
          </div>

          {/* Progress Info */}
          <div className="flex-1 truncate text-[11px]">
            <span className="font-bold text-gray-200">
              {currentChunkIdx + 1}/{totalChunks}
            </span>
            <span className="text-gray-400 ml-1.5">({chunkProgressPercent}%)</span>
          </div>

          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handlePrevChunk}
              disabled={currentChunkIdx === 0}
              className="p-1 text-gray-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous sentence"
            >
              <SkipBack size={13} />
            </button>

            <button
              type="button"
              onClick={handleToggleAudio}
              className="w-7 h-7 rounded-full bg-[#FF5500] text-white flex items-center justify-center hover:bg-[#FF7700] transition-colors cursor-pointer"
              title={audioState === 'playing' ? 'Pause' : 'Resume'}
            >
              {audioState === 'playing' ? (
                <Pause size={12} className="fill-current" />
              ) : (
                <Play size={12} className="fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNextChunk}
              disabled={currentChunkIdx >= totalChunks - 1}
              className="p-1 text-gray-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next sentence"
            >
              <SkipForward size={13} />
            </button>
          </div>

          <span className="w-px h-3.5 bg-gray-700 shrink-0" />

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={handleCycleSpeed}
            className="px-1.5 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-[10px] font-bold text-amber-400 cursor-pointer shrink-0"
            title="Adjust speech rate"
          >
            {speechRate}x
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={handleToggleLanguage}
            className="px-1.5 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-[10px] font-bold text-emerald-400 cursor-pointer shrink-0"
            title="Toggle Voice Language (Indonesian / English)"
          >
            {speechLang === 'id-ID' ? 'ID' : 'EN'}
          </button>

          {/* Stop / Close */}
          <button
            type="button"
            onClick={handleStopAudio}
            className="p-1 text-gray-400 hover:text-red-400 cursor-pointer shrink-0"
            title="Stop and close"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 5. STICKY FLOATING MEDIUM ACTION BAR (APPEARS ON SCROLL) */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-200/90 shadow-2xl flex items-center gap-5 transition-all duration-300 ease-out ${
          showStickyBar ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Clap in Sticky Bar */}
        <button
          type="button"
          onClick={handleClap}
          className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors cursor-pointer active:scale-90"
          title="Clap"
        >
          <ClapIcon className="w-5 h-5" filled={myClaps > 0} />
          <span className="text-xs font-mono font-bold text-gray-800">{claps}</span>
        </button>

        <span className="w-px h-4 bg-gray-200" />

        {/* Responses in Sticky Bar */}
        <button
          type="button"
          onClick={() => setShowResponsesDrawer(true)}
          className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors cursor-pointer"
          title="Responses"
        >
          <MessageCircle className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-mono font-medium text-gray-800">{responses.length}</span>
        </button>

        <span className="w-px h-4 bg-gray-200" />

        {/* Bookmark in Sticky Bar */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          className={`p-1 rounded-full transition-colors cursor-pointer ${
            isBookmarked ? 'text-[#FF5500]' : 'text-gray-500 hover:text-black'
          }`}
          title="Save story"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#FF5500]' : ''}`} />
        </button>

        {/* Listen in Sticky Bar */}
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`p-1 rounded-full transition-colors cursor-pointer ${
            audioState === 'playing' ? 'text-[#FF5500]' : 'text-gray-500 hover:text-black'
          }`}
          title="Listen"
        >
          {audioState === 'playing' ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* Share in Sticky Bar */}
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="p-1 text-gray-500 hover:text-black transition-colors cursor-pointer"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 6. RESPONSES / COMMENTS SLIDE-OVER DRAWER (EXACT MEDIUM UX) */}
      {showResponsesDrawer && (
        <div className="fixed inset-0 z-[120] flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowResponsesDrawer(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col font-sans z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#141414]">Responses ({responses.length})</h3>
                <p className="text-xs text-gray-400 font-mono">Join the conversation</p>
              </div>
              <button
                type="button"
                onClick={() => setShowResponsesDrawer(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Response Writing Box */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/70">
              <form onSubmit={handleAddResponse} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={newResponse.name}
                  onChange={(e) => setNewResponse({ ...newResponse, name: e.target.value })}
                  className="w-full text-xs font-mono bg-white border border-gray-200 px-3 py-2 rounded-lg outline-none focus:border-black transition-colors"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="What are your thoughts?"
                  value={newResponse.content}
                  onChange={(e) => setNewResponse({ ...newResponse, content: e.target.value })}
                  className="w-full text-xs bg-white border border-gray-200 p-3 rounded-lg outline-none focus:border-black transition-colors resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingResponse || !newResponse.content.trim()}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#FF5500] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={12} />
                    <span>{submittingResponse ? 'Posting...' : 'Respond'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Responses List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 divide-y divide-gray-100">
              {responses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-mono uppercase tracking-wider">No responses yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts on this story.</p>
                </div>
              ) : (
                responses.map((resp) => (
                  <div key={resp.id} className="pt-4 first:pt-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 font-bold text-[10px] flex items-center justify-center font-mono">
                          {resp.author_name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <span className="text-xs font-bold text-[#141414]">{resp.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">
                          {getRelativeTime(resp.created_at)}
                        </span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteResponse(resp.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                            title="Admin: Delete comment"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">
                      {resp.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. MEDIUM SHARE MODAL DIALOG */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl border border-gray-200 shadow-2xl p-6 relative overflow-hidden font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#FF5500]">
                  Share this story
                </p>
                <h3 className="text-sm font-bold text-[#141414] line-clamp-1 mt-0.5">
                  {article.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Share Grid (WhatsApp, X, LinkedIn, Native More) */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + '\n' + articleUrl)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-gray-600">WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-gray-600">Twitter/X</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-gray-600">LinkedIn</span>
              </a>

              {/* Native More / Web Share */}
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.description,
                      url: articleUrl,
                    }).then(() => setShowShareModal(false)).catch(() => {});
                  } else {
                    handleCopyLink();
                  }
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="font-mono text-[10px] text-gray-600">More</span>
              </button>
            </div>

            {/* Copy Link Input Bar */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
              <input
                type="text"
                readOnly
                value={articleUrl}
                className="bg-transparent text-xs font-mono text-gray-600 flex-1 outline-none truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-black text-white hover:bg-[#FF5500] transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Portfolio Footer */}
      <PortfolioFooter emailAddress={email} />
    </div>
  );
}
