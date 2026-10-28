import { supabase } from '../lib/supabaseClient';

export const ContactRepository = {
  /**
   * Submit a new contact message (accessible by public/anon)
   */
  async submitMessage({ name, email, message, topic = 'General Inquiry', honeypot = '' }) {
    // 1. Honeypot check: If bot filled the hidden honeypot, fake success silently without hitting Supabase
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn('Bot submission blocked via honeypot.');
      return true;
    }

    // 2. Client-side rate limiting (Max 3 messages in 10 minutes)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;
        const historyStr = localStorage.getItem('ghiffa_contact_timestamps');
        let timestamps = historyStr ? JSON.parse(historyStr) : [];
        timestamps = timestamps.filter(t => now - t < tenMinutes);
        if (timestamps.length >= 3) {
          throw new Error('Too many messages sent. Please wait a few minutes before trying again.');
        }
        timestamps.push(now);
        localStorage.setItem('ghiffa_contact_timestamps', JSON.stringify(timestamps));
      }
    } catch (e) {
      if (e.message.includes('Too many')) throw e;
    }

    // 3. Strict validation
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedMessage = (message || '').trim();

    if (trimmedName.length < 2) {
      throw new Error('Please enter a valid name (at least 2 characters).');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (trimmedMessage.length < 10) {
      throw new Error('Message is too short (at least 10 characters).');
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          topic: topic || 'General Inquiry',
          status: 'unread'
        }
      ]);

    if (error) {
      console.error('Error submitting contact message:', error);
      throw error;
    }

    return true;
  },

  /**
   * Get all messages for admin panel
   */
  async getAllMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Update message status ('read', 'unread', 'replied', 'archived')
   */
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating message status:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a contact message
   */
  async deleteMessage(id) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact message:', error);
      throw error;
    }

    return true;
  }
};
