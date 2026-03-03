import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        ease: [0.21, 0.47, 0.32, 0.98]
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ScaleOnHoverProps {
    children: ReactNode;
    className?: string;
    scale?: number;
}

export function ScaleOnHover({ children, className = '', scale = 1.02 }: ScaleOnHoverProps) {
    return (
        <motion.div
            whileHover={{ scale }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
