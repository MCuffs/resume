
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function BrandApplication() {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
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
                    formType: 'BrandApplication',
                    timestamp: new Date().toISOString()
                })
            });

            setSubmitted(true);
            toast.success(t('brand.application.success'));
            setFormData({
                companyName: '',
                contactName: '',
                email: '',
                budget: '',
                message: ''
            });
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(t('brand.application.failure'));
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

    if (submitted) {
        return (
            <section
                id="brand-application"
                className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200 bg-neutral-50"
            >
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-lg md:text-xl text-neutral-700">
                        {t('brand.application.received')}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            id="brand-application"
            className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200 bg-neutral-50"
        >
            <div className="max-w-6xl mx-auto">
                <div className="max-w-2xl mb-12">
                    <h2 className="text-3xl md:text-4xl mb-4">{t('brand.application.title')}</h2>
                    <p className="text-neutral-600">
                        {t('brand.application.subtitle')}
                    </p>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="companyName" className="block text-sm text-neutral-600 mb-2">
                                {t('brand.application.fields.company')}
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactName" className="block text-sm text-neutral-600 mb-2">
                                {t('brand.application.fields.contact')}
                            </label>
                            <input
                                type="text"
                                id="contactName"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm text-neutral-600 mb-2">
                                {t('brand.application.fields.email')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="budget" className="block text-sm text-neutral-600 mb-2">
                                {t('brand.application.fields.budget')}
                            </label>
                            <select
                                id="budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                            >
                                <option value="">{t('brand.application.fields.budget_placeholder')}</option>
                                <option value="under_5k">~$5,000</option>
                                <option value="5k_20k">$5,000 ~ $20,000</option>
                                <option value="20k_50k">$20,000 ~ $50,000</option>
                                <option value="50k_plus">$50,000+</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm text-neutral-600 mb-2">
                                {t('brand.application.fields.message')}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSending}
                            className="px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? t('brand.application.sending') : t('brand.application.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
