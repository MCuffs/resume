import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const stats = [
    { label: 'Cumulative Views', value: 2000000, suffix: '+' },
    { label: 'Brand Collaborations', value: 10, suffix: '+' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
        duration: 2000,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest)) + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} className="text-4xl md:text-5xl font-bold tracking-tight" />;
}

export function StatsCounter() {
    return (
        <section className="py-24 border-b border-neutral-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col gap-2 min-w-[200px]">
                            <Counter value={stat.value} suffix={stat.suffix} />
                            <span className="text-sm text-neutral-500 uppercase tracking-widest font-medium">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
