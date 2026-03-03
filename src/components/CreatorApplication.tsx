import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function CreatorApplication() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: '',
    category: '',
    experience: '',
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
          formType: 'CreatorPartnerRegistration',
          timestamp: new Date().toISOString()
        })
      });

      setSubmitted(true);
      toast.success(t('home.application.fields.success'));
      setFormData({
        name: '',
        email: '',
        platform: '',
        category: '',
        experience: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to send. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const platforms = t('home.application.platforms', { returnObjects: true }) as string[];
  const categories = t('home.application.categories', { returnObjects: true }) as string[];

  if (submitted) {
    return (
      <section
        id="creator-application"
        className="px-6 md:px-12 lg:px-24 py-24 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-neutral-100"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl text-neutral-700">
            {t('home.application.fields.success')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="creator-application"
      className="px-6 md:px-12 lg:px-24 py-24 bg-neutral-50 border-b border-neutral-100"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-left"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-normal text-neutral-900 mb-6 tracking-tight leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t('home.application.title')}
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl font-light">
            {t('home.application.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="group">
                <label htmlFor="name" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                  이메일 *
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
                <label htmlFor="platform" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                  {t('home.application.fields.platform')} *
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label htmlFor="category" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                  {t('home.application.fields.category')} *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="group">
              <label htmlFor="experience" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                {t('home.application.fields.experience')} *
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg"
              >
                <option value="">Select Experience</option>
                <option value="beginner">처음 시작</option>
                <option value="intermediate">1년 미만</option>
                <option value="experienced">1년 이상</option>
              </select>
            </div>

            <div className="group">
              <label htmlFor="message" className="block text-sm text-neutral-400 mb-2 font-light uppercase tracking-wider">
                추가 정보 (선택)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={2}
                placeholder="SNS 계정, 포트폴리오 링크 등"
                className="w-full py-4 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors text-lg resize-none"
              />
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isSending}
                className="px-10 py-4 bg-neutral-900 text-white text-sm font-medium tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {isSending ? 'SENDING...' : 'SUBMIT APPLICATION'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
