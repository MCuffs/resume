import { useState } from 'react';
import { toast } from 'sonner';

export function BrandPartnership() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    website: '',
    budget: '',
    message: ''
  });

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVlUlKAfA28JtpURhUByby2jWQ-wcVTic0RJHKOobAEa0aG7U6eCnjBVNC1h0J09WO/exec';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'BrandPartnership',
          timestamp: new Date().toISOString()
        })
      });

      setSubmitted(true);
      toast.success('Inquiry sent successfully!');
      setFormData({
        company: '',
        email: '',
        website: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <section
        id="brand-partnership"
        className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200"
      >
        <div className="max-w-2xl">
          <p className="text-lg md:text-xl text-neutral-700">
            Thanks for reaching out. We'll follow up shortly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="brand-partnership"
      className="px-6 md:px-12 lg:px-24 py-32 bg-white border-t border-neutral-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2
            className="text-3xl md:text-5xl lg:text-5xl font-normal mb-8 leading-none tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Brand Partnerships
          </h2>
          <p className="text-neutral-500 font-light text-lg">
            We connect brands with creators built for long-term collaboration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="group">
              <label htmlFor="company" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                Company name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
              />
            </div>

            <div className="group">
              <label htmlFor="email" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                Contact email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="group">
              <label htmlFor="website" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                Brand website or product link
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
                className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
              />
            </div>

            <div className="group">
              <label htmlFor="budget" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                Budget range (optional)
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
              />
            </div>
          </div>

          <div className="group">
            <label htmlFor="message" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
              What are you looking to collaborate on?
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={2}
              className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg resize-none"
            />
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSending}
              className="px-10 py-4 bg-neutral-900 text-white text-sm font-medium tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {isSending ? 'SENDING...' : 'CONTACT'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
