import { motion } from 'framer-motion';

export function PlatformSteps() {
    // Static array to drive the loop, decoupling from i18n to prevent errors
    const steps = [0, 1, 2];

    return (
        <section className="px-6 md:px-12 lg:px-24 py-32 bg-white">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-normal text-neutral-900 mb-8 leading-none"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        Platform Process
                    </h2>
                    <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed font-light">
                        ë³µì¡???ˆì°¨ ?†ì´, ?°ì´?°ê? ì¦ëª…?˜ëŠ” ?±ê³¼ë¥?ê²½í—˜?˜ì„¸??
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-16 relative">
                    {steps.map((_, index) => {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <span
                                    className="text-5xl md:text-6xl text-neutral-200 group-hover:text-black transition-colors duration-500 mb-6"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    0{index + 1}
                                </span>

                                <h3 className="text-xl font-medium text-neutral-900 mb-4 font-light tracking-wide">
                                    {index === 0 && "?¼ì´ë¸??¬ë¦¬?ì´???°ê²°"}
                                    {index === 1 && "?°ë ˆ??ë°”ì´??ë§ˆì???}
                                    {index === 2 && "ê³µë™êµ¬ë§¤ / ?¼ì´ë¸?ì»¤ë¨¸??}
                                </h3>
                                <p className="text-neutral-500 leading-relaxed max-w-xs font-light text-sm">
                                    {index === 0 && "?±í†¡, ? íŠœë¸? ?¸ìŠ¤?€ ?¼ì´ë¸??„ë¬¸ ?¬ë¦¬?ì´?°ì? ë§¤ì¹­?©ë‹ˆ??"}
                                    {index === 1 && "ì´ˆê¸° ?œì¥???°ë ˆ??Threads)ë¥?? ì ?˜ì—¬ ??°œ?ì¸ ?„ë‹¬??ë§Œë“­?ˆë‹¤."}
                                    {index === 2 && "?‘ì°¬???˜ì–´ ?¤ì‹œê°??ë§¤?€ ?•ì‹¤??êµ¬ë§¤ ?„í™˜???´ëŒ?´ëƒ…?ˆë‹¤."}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
