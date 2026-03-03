import { motion } from 'framer-motion';

const values = [
    'Growth', 'Transparency', 'Authenticity', 'Partnership', 'Vision', 'Impact'
];

export function ValuesMarquee() {
    return (
        <section className="py-16 border-b border-neutral-100 dark:border-white/5 overflow-hidden bg-white dark:bg-neutral-900">
            <div className="flex relative">
                <motion.div
                    className="flex gap-24 pr-24 whitespace-nowrap"
                    animate={{ x: '-50%' }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {[...values, ...values, ...values, ...values].map((value, idx) => (
                        <span
                            key={idx}
                            className="text-2xl md:text-3xl font-medium text-neutral-300 dark:text-neutral-700 uppercase tracking-widest"
                        >
                            {value}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
