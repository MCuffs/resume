import { motion } from 'framer-motion';
import { UserPlus, Settings, TrendingUp, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CreatorRoadmap() {
    const { t } = useTranslation();
    const roadmapData = t('home.roadmap.steps', { returnObjects: true }) as Array<{ title: string; description: string }>;

    const icons = [UserPlus, Settings, TrendingUp, Crown];
    const colors = [
        { color: "text-neutral-400", bg: "bg-neutral-100", lineColor: "bg-neutral-200" },
        { color: "text-blue-500", bg: "bg-blue-50", lineColor: "bg-blue-200" },
        { color: "text-indigo-500", bg: "bg-indigo-50", lineColor: "bg-indigo-200" },
        { color: "text-amber-500", bg: "bg-amber-50", lineColor: "bg-transparent" }
    ];

    const steps = roadmapData.map((data, index) => ({
        ...data,
        icon: icons[index] || icons[icons.length - 1],
        ...colors[index] || colors[colors.length - 1]
    }));

    return (
        <aside className="w-full rounded-3xl border border-neutral-100 bg-white p-8 shadow-xl shadow-neutral-100/50">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{t('home.roadmap.title')}</h3>
                <p className="text-sm text-neutral-500">{t('home.roadmap.subtitle')}</p>
            </div>

            <div className="relative pl-2">
                <div className="space-y-0">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative flex gap-4 pb-8 last:pb-0"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {/* Timeline Line */}
                            {index !== steps.length - 1 && (
                                <div className={`absolute left-[19px] top-10 bottom-0 w-[2px] ${step.lineColor}`} />
                            )}

                            {/* Icon Bubble */}
                            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ${step.bg} ${step.color} shadow-sm`}>
                                <step.icon size={16} strokeWidth={2.5} />
                            </div>

                            {/* Content */}
                            <div className="pt-1">
                                <h4 className={`text-sm font-bold ${index === steps.length - 1 ? 'text-neutral-900' : 'text-neutral-800'}`}>
                                    {step.title}
                                </h4>
                                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 text-center font-medium">
                    {t('home.roadmap.footer')}
                </p>
            </div>
        </aside>
    );
}
