import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, BarChart3, ArrowRight } from 'lucide-react';

export function BrandValue() {
    const { t } = useTranslation();
    const values = t('home.brands.values', { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;

    const icons = [CheckCircle2, Zap, BarChart3];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="brand-value" className="px-6 md:px-12 lg:px-24 py-24 bg-white border-b border-neutral-100">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase mb-4">
                        {t('home.brands.badge')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        {t('home.brands.title')}
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        {t('home.brands.subtitle')}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {values.map((value, index) => {
                        const Icon = icons[index];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="text-center group"
                            >
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                    <Icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-neutral-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center"
                >
                    <button
                        onClick={() => scrollToSection('brand-application')}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-200 hover:border-blue-300 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        {t('home.brands.cta')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
