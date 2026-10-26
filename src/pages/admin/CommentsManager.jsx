import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArticleRepository } from '../../repositories/ArticleRepository';
import { 
   MessageSquare, 
   Trash2, 
   RefreshCw, 
   Search, 
   ExternalLink, 
   Eye, 
   X,
   Clock,
   User,
   Filter,
   AlertTriangle,
   FileText
} from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/admin-ui/Table';

export default function CommentsManager() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState('all');
  const [selectedComment, setSelectedComment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await ArticleRepository.getAllResponsesAdmin();
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      alert('Failed to load comments: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Delete comment handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }
    setActionLoading(true);
    try {
      await ArticleRepository.deleteResponse(id);
      setComments(prev => prev.filter(c => c.id !== id));
      if (selectedComment && selectedComment.id === id) {
        setSelectedComment(null);
      }
    } catch (err) {
      alert('Failed to delete comment: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Derive unique articles for filter
  const uniqueArticles = useMemo(() => {
    const map = new Map();
    comments.forEach(c => {
      if (c.articles?.id) {
        map.set(c.articles.id, c.articles.title || 'Untitled Story');
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [comments]);

  // Statistics
  const stats = useMemo(() => {
    const authors = new Set(comments.map(c => c.author_name.toLowerCase().trim()));
    const articles = new Set(comments.map(c => c.article_id));
    return {
      total: comments.length,
      articlesCount: articles.size,
      authorsCount: authors.size
    };
  }, [comments]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      // Article filter
      if (selectedArticleId !== 'all' && c.article_id !== selectedArticleId) {
        return false;
      }

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchAuthor = (c.author_name || '').toLowerCase().includes(q);
      const matchEmail = (c.author_email || '').toLowerCase().includes(q);
      const matchContent = (c.content || '').toLowerCase().includes(q);
      const matchArticle = (c.articles?.title || '').toLowerCase().includes(q);

      return matchAuthor || matchEmail || matchContent || matchArticle;
    });
  }, [comments, selectedArticleId, searchQuery]);

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getRelativeTime = (isoString) => {
    if (!isoString) return '';
    try {
      const past = new Date(isoString).getTime();
      const now = Date.now();
      const diffSec = Math.floor((now - past) / 1000);

      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays}d ago`;
      return '';
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#111111] uppercase flex items-center gap-2">
            <MessageSquare size={20} className="text-[#FF5500]" />
            Article Comments & Responses
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Review and moderate community reader responses across your stories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchComments}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-mono"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            REFRESH
          </Button>
          <Link to="/admin/panel/articles">
            <Button variant="outline" className="flex items-center gap-1.5 text-xs font-mono">
              <FileText size={13} />
              MANAGE ARTICLES
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 p-4 font-mono shadow-2xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Total Responses
          </div>
          <div className="text-2xl font-black text-[#111111]">
            {stats.total}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            From community readers
          </div>
        </div>

        <div className="bg-white border border-black/10 p-4 font-mono shadow-2xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Stories with Comments
          </div>
          <div className="text-2xl font-black text-[#111111]">
            {stats.articlesCount}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Engaged articles
          </div>
        </div>

        <div className="bg-white border border-black/10 p-4 font-mono shadow-2xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Unique Readers
          </div>
          <div className="text-2xl font-black text-[#111111]">
            {stats.authorsCount}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Distinct comment authors
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-black/10 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between font-mono">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reader name, comment content, or article..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-black/10 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-black transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter by Article Dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-gray-400 shrink-0" />
          <select
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="text-xs border border-black/10 bg-gray-50 px-3 py-2 focus:bg-white focus:outline-hidden focus:border-black font-mono transition-colors max-w-[240px] truncate"
          >
            <option value="all">All Articles ({comments.length})</option>
            {uniqueArticles.map(art => (
              <option key={art.id} value={art.id}>
                {art.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Comments Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>READER</TableCell>
            <TableCell isHeader>STORY / ARTICLE</TableCell>
            <TableCell isHeader>COMMENT RESPONSE</TableCell>
            <TableCell isHeader>POSTED DATE</TableCell>
            <TableCell isHeader className="text-right">ACTIONS</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-400 font-mono text-xs">
                <RefreshCw size={18} className="animate-spin mx-auto mb-2 opacity-50" />
                Loading comments...
              </TableCell>
            </TableRow>
          ) : filteredComments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-400 font-mono text-xs">
                {searchQuery || selectedArticleId !== 'all' 
                  ? 'No comments match your search criteria.' 
                  : 'No reader responses yet.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredComments.map((comment) => (
              <TableRow key={comment.id} className="hover:bg-gray-50/80 transition-colors">
                {/* Reader */}
                <TableCell className="font-bold">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {comment.author_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111111]">{comment.author_name}</div>
                      {comment.author_email && (
                        <div className="text-[10px] text-gray-400 font-mono">{comment.author_email}</div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Article */}
                <TableCell className="max-w-[180px]">
                  {comment.articles ? (
                    <Link
                      to={`/article/${comment.articles.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 truncate"
                      title={comment.articles.title}
                    >
                      <span className="truncate">{comment.articles.title}</span>
                      <ExternalLink size={10} className="shrink-0 opacity-60" />
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Article removed</span>
                  )}
                </TableCell>

                {/* Comment Snippet */}
                <TableCell className="max-w-[320px]">
                  <p 
                    onClick={() => setSelectedComment(comment)}
                    className="text-xs text-gray-700 line-clamp-2 cursor-pointer hover:text-black transition-colors"
                    title="Click to view full comment"
                  >
                    {comment.content}
                  </p>
                </TableCell>

                {/* Date */}
                <TableCell className="font-mono text-[11px] text-gray-500 whitespace-nowrap">
                  <div>{formatDate(comment.created_at)}</div>
                  <div className="text-[10px] text-gray-400">{getRelativeTime(comment.created_at)}</div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedComment(comment)}
                      className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm transition-colors"
                      title="View complete response"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={actionLoading}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
                      title="Delete this comment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 5. Detail Modal / Slide-over */}
      {selectedComment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedComment(null)}
        >
          <div 
            className="bg-white w-full max-w-lg border border-black/20 shadow-2xl p-6 font-mono relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#FF5500]" />
                <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                  READER RESPONSE DETAILS
                </span>
              </div>
              <button 
                onClick={() => setSelectedComment(null)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Author & Story info */}
            <div className="space-y-3 mb-4 text-xs">
              <div className="flex items-center justify-between bg-gray-50 p-3 border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs font-mono">
                    {selectedComment.author_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{selectedComment.author_name}</div>
                    {selectedComment.author_email && (
                      <div className="text-[10px] text-gray-400">{selectedComment.author_email}</div>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 text-right">
                  <div>{formatDate(selectedComment.created_at)}</div>
                  <div className="text-gray-500 font-bold">{getRelativeTime(selectedComment.created_at)}</div>
                </div>
              </div>

              {selectedComment.articles && (
                <div className="bg-gray-50 p-3 border border-gray-100 flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Story:</span>
                    <span className="font-bold text-gray-800 text-xs truncate block">
                      {selectedComment.articles.title}
                    </span>
                  </div>
                  <Link
                    to={`/article/${selectedComment.articles.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline shrink-0 ml-2"
                  >
                    <span>Open Story</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
              )}
            </div>

            {/* Full Comment Text */}
            <div className="mb-6">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Comment Content:
              </label>
              <div className="p-4 bg-gray-50 border border-gray-200 text-xs text-gray-800 leading-relaxed font-sans whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedComment.content}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-black/10">
              <Button
                variant="outline"
                onClick={() => setSelectedComment(null)}
                className="text-xs"
              >
                CLOSE
              </Button>

              <button
                type="button"
                onClick={() => handleDelete(selectedComment.id)}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>{actionLoading ? 'DELETING...' : 'DELETE COMMENT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
