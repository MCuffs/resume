import { motion } from 'framer-motion';

const logos = [
    'Google', 'Amazon', 'Netflix', 'YouTube', 'TikTok', 'Instagram',
    'Adobe', 'Spotify', 'Twitch', 'Discord'
];

export function CreatorMarquee() {
    return (
        <section className="py-12 border-b border-neutral-100 dark:border-white/5 overflow-hidden bg-neutral-50/50">
            <div className="flex relative">
                <motion.div
                    className="flex gap-16 pr-16 whitespace-nowrap"
                    animate={{ x: '-50%' }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {[...logos, ...logos, ...logos].map((logo, idx) => (
                        <span
                            key={idx}
                            className="text-2xl font-semibold text-neutral-300 dark:text-neutral-700 uppercase tracking-tighter"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
