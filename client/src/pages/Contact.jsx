import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
          We'd love to hear from you. Send us a message or use the contact details below.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700">
            <Mail className="w-6 h-6 text-blue-300 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Email Us</h3>
            <p className="text-gray-300">support@neighbordeep.com</p>
          </div>
          <div className="bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700">
            <Phone className="w-6 h-6 text-green-300 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Call Us</h3>
            <p className="text-gray-300">+1 (555) 123-4567</p>
          </div>
          <div className="bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700">
            <MapPin className="w-6 h-6 text-purple-300 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Our Location</h3>
            <p className="text-gray-300">Community Hub, Local Neighborhood</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 border border-gray-700">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Send a Message</h2>

          {submitStatus === 'success' && (
            <div className="p-4 mb-4 text-sm text-green-300 bg-green-900 rounded-lg" role="alert">
              Your message has been sent successfully! We will get back to you soon.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="p-4 mb-4 text-sm text-red-300 bg-red-900 rounded-lg" role="alert">
              There was an error sending your message. Please try again later.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
