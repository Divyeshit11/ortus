'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-text mb-8 text-center">
          Contact Us
        </h1>
        
        <p className="text-brand-muted text-center mb-12">
          Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            Thank you for your message. We will get back to you soon.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-text mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-brand-text mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder="What is this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-brand-text mb-2">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
