import React from 'react';

export function ContactModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  formSent
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1 cursor-pointer"
        >
          ✕
        </button>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          ghiffa.dev
        </div>
        <h3 className="text-2xl font-bold text-[#111111] mb-2">
          Let&apos;s build a project together
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Leave us a message and we&apos;ll schedule a call.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="hello@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows="3"
              required
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#141414] hover:bg-black text-white font-medium py-3 rounded-full text-sm transition-all cursor-pointer"
          >
            Send message
          </button>
          {formSent && (
            <p className="text-xs text-emerald-600 text-center pt-2 font-medium">
              Message sent! We will get back to you soon.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
