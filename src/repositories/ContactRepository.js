import { supabase } from '../lib/supabaseClient';

export const ContactRepository = {
  /**
   * Submit a new contact message (accessible by public/anon)
   */
  async submitMessage({ name, email, message, topic = 'General Inquiry' }) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
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
