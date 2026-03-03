import { motion } from 'framer-motion';

export function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50/80 backdrop-blur-sm">
            <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-16 h-16 border-4 border-neutral-200 border-t-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />
            </motion.div>
        </div>
    );
}

export function PageLoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <motion.div
                className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />
        </div>
    );
}
