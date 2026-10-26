import React, { useState, useEffect, useMemo } from 'react';
import { ContactRepository } from '../../repositories/ContactRepository';
import { 
  Mail, 
  Trash2, 
  RefreshCw, 
  Search, 
  CheckCircle, 
  MailCheck, 
  ExternalLink, 
  Eye, 
  X,
  Clock,
  User,
  Inbox
} from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/admin-ui/Table';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'read' | 'replied'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await ContactRepository.getAllMessages();
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      alert('Failed to load messages: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Update status handler
  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await ContactRepository.updateStatus(id, newStatus);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update message status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete message handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    setActionLoading(true);
    try {
      await ContactRepository.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      alert('Failed to delete message: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Open email client with prefilled reply
  const handleReply = (msg) => {
    const subject = encodeURIComponent(`Re: ${msg.topic || 'Inquiry'} - ghiffa.dev`);
    const body = encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out.\n\n---\nOriginal Message:\n"${msg.message}"\n`);
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
    if (msg.status === 'unread' || msg.status === 'read') {
      handleStatusChange(msg.id, 'replied');
    }
  };

  // Counts
  const counts = useMemo(() => {
    return {
      all: messages.length,
      unread: messages.filter(m => m.status === 'unread').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length,
    };
  }, [messages]);

  // Filtered & searched messages
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      // Filter tab
      if (activeFilter !== 'all' && msg.status !== activeFilter) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (msg.name && msg.name.toLowerCase().includes(q)) ||
        (msg.email && msg.email.toLowerCase().includes(q)) ||
        (msg.topic && msg.topic.toLowerCase().includes(q)) ||
        (msg.message && msg.message.toLowerCase().includes(q))
      );
    });
  }, [messages, activeFilter, searchQuery]);

  // Format date helper
  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="font-mono text-[#111111] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">Messages & Inquiries</h2>
            {counts.unread > 0 && (
              <span className="bg-[#111111] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {counts.unread} NEW
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Incoming inquiries from the portfolio contact modal stored directly in Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchMessages} 
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            REFRESH
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveFilter('all')}
          className={`p-4 border transition-colors cursor-pointer ${
            activeFilter === 'all' ? 'border-[#111111] bg-gray-50' : 'border-[#E5E5E5] bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-xs text-gray-500 uppercase tracking-wider">Total Inquiries</div>
          <div className="text-2xl font-black mt-1">{counts.all}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('unread')}
          className={`p-4 border transition-colors cursor-pointer ${
            activeFilter === 'unread' ? 'border-[#111111] bg-amber-50/50' : 'border-[#E5E5E5] bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-xs text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Unread
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{counts.unread}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('read')}
          className={`p-4 border transition-colors cursor-pointer ${
            activeFilter === 'read' ? 'border-[#111111] bg-gray-50' : 'border-[#E5E5E5] bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-xs text-gray-500 uppercase tracking-wider">Read</div>
          <div className="text-2xl font-black mt-1">{counts.read}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('replied')}
          className={`p-4 border transition-colors cursor-pointer ${
            activeFilter === 'replied' ? 'border-[#111111] bg-emerald-50/50' : 'border-[#E5E5E5] bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={12} />
            Replied
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{counts.replied}</div>
        </div>
      </div>

      {/* Controls: Search + Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 border border-[#E5E5E5]">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'unread', label: 'Unread', count: counts.unread },
            { id: 'read', label: 'Read', count: counts.read },
            { id: 'replied', label: 'Replied', count: counts.replied },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-[#111111] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sender, email, topic..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 focus:border-black focus:outline-none bg-white font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Table */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-[#E5E5E5]">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Loading contact messages...</div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E5E5E5]">
          <Inbox size={32} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">No messages found</h3>
          <p className="text-xs text-gray-400">
            {searchQuery ? 'No inquiries match your current search query.' : 'No contact submissions in this category yet.'}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="w-24">Status</TableCell>
              <TableCell isHeader className="w-48">Sender</TableCell>
              <TableCell isHeader className="w-40">Topic</TableCell>
              <TableCell isHeader>Message Preview</TableCell>
              <TableCell isHeader className="w-36">Received</TableCell>
              <TableCell isHeader className="w-28 text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((msg) => {
              const isUnread = msg.status === 'unread';
              return (
                <TableRow 
                  key={msg.id}
                  className={isUnread ? 'bg-amber-50/20 font-medium' : ''}
                >
                  {/* Status Badge */}
                  <TableCell>
                    {msg.status === 'unread' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        UNREAD
                      </span>
                    )}
                    {msg.status === 'read' && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
                        READ
                      </span>
                    )}
                    {msg.status === 'replied' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle size={10} />
                        REPLIED
                      </span>
                    )}
                  </TableCell>

                  {/* Sender Info */}
                  <TableCell>
                    <div className="font-bold text-xs truncate max-w-[180px]">{msg.name || 'Anonymous'}</div>
                    <a 
                      href={`mailto:${msg.email}`}
                      className="text-[11px] text-gray-500 hover:text-black hover:underline truncate max-w-[180px] block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {msg.email}
                    </a>
                  </TableCell>

                  {/* Topic */}
                  <TableCell>
                    <span className="inline-block text-[11px] font-bold bg-gray-100 px-2 py-0.5 border border-gray-200 truncate max-w-[150px]">
                      {msg.topic || 'General Inquiry'}
                    </span>
                  </TableCell>

                  {/* Message Preview */}
                  <TableCell>
                    <button
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === 'unread') {
                          handleStatusChange(msg.id, 'read');
                        }
                      }}
                      className="text-left text-xs text-gray-600 hover:text-black line-clamp-2 transition-colors cursor-pointer"
                    >
                      {msg.message}
                    </button>
                  </TableCell>

                  {/* Received Date */}
                  <TableCell className="text-[11px] text-gray-500 whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="View Full Message"
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (msg.status === 'unread') {
                            handleStatusChange(msg.id, 'read');
                          }
                        }}
                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        title="Reply via Email"
                        onClick={() => handleReply(msg)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
                      >
                        <Mail size={15} />
                      </button>

                      <button
                        title="Delete Message"
                        onClick={() => handleDelete(msg.id)}
                        disabled={actionLoading}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-6 shadow-2xl relative font-mono text-[#111111]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E5E5E5] pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    INQUIRY DETAILS
                  </span>
                  {selectedMessage.status === 'unread' && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5">
                      UNREAD
                    </span>
                  )}
                  {selectedMessage.status === 'read' && (
                    <span className="bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-bold px-2 py-0.5">
                      READ
                    </span>
                  )}
                  {selectedMessage.status === 'replied' && (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5">
                      REPLIED
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black mt-1">
                  {selectedMessage.topic || 'General Inquiry'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-gray-400 hover:text-black border border-transparent hover:border-black transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sender Meta Box */}
            <div className="bg-gray-50 border border-[#E5E5E5] p-3 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 text-[10px] uppercase block">From</span>
                  <span className="font-bold">{selectedMessage.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-gray-400 text-[10px] uppercase block">Email</span>
                  <a 
                    href={`mailto:${selectedMessage.email}`} 
                    className="font-bold text-blue-600 hover:underline truncate block"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <Clock size={14} className="text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 text-[10px] uppercase block">Received At</span>
                  <span className="text-gray-700">{formatDate(selectedMessage.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
                Message Content
              </span>
              <div className="bg-white border border-[#E5E5E5] p-4 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto selection:bg-black selection:text-white">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-bold uppercase">Status:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                  disabled={actionLoading}
                  className="text-xs border border-gray-300 px-2 py-1 bg-white font-mono focus:border-black focus:outline-none"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={actionLoading}
                  className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-500"
                >
                  <Trash2 size={14} /> DELETE
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleReply(selectedMessage)}
                  className="flex items-center gap-1.5"
                >
                  <MailCheck size={14} /> REPLY VIA EMAIL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
