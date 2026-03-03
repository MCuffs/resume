import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export function WhyArtharian() {
    const { t } = useTranslation();
    const comparison = t('home.why.comparison', { returnObjects: true }) as Array<{
        label: string;
        old: string;
        new: string;
    }>;

    return (
        <section className="px-6 md:px-12 lg:px-24 py-24 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-neutral-100">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-600 text-white text-xs font-semibold tracking-wide uppercase mb-4">
                        {t('home.why.badge')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        {t('home.why.title')}
                    </h2>
                </motion.div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-neutral-50 border-b border-neutral-200">
                        <div className="text-sm font-semibold text-neutral-600"></div>
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600">
                                <X className="w-4 h-4 text-red-500" />
                                <span>기존 ?�이?�시</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                                <Check className="w-4 h-4" />
                                <span>?�서리안</span>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Rows */}
                    {comparison.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`grid grid-cols-3 gap-4 p-6 ${index !== comparison.length - 1 ? 'border-b border-neutral-100' : ''
                                } hover:bg-blue-50/30 transition-colors`}
                        >
                            <div className="flex items-center">
                                <span className="font-semibold text-neutral-900">{item.label}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-sm text-neutral-600">{item.old}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium text-blue-700">{item.new}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-lg text-neutral-700 font-medium">
                        {t('home.why.footer')}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
