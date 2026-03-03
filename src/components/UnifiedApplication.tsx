import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';

export function UnifiedApplication() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-32 px-6 bg-neutral-50" id="application-section">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Ready to join the movement?
                    </h2>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
                        Whether you're a creator looking to grow or a brand seeking impact,<br className="hidden md:block" />
                        we have the right tools for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Creator Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-12 rounded-3xl border border-neutral-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-32 h-32 text-blue-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                                <Sparkles className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">For Creators</h3>
                            <p className="text-neutral-500 mb-8 leading-relaxed h-24">
                                Join our exclusive network of verified partners. Get matched with top brands, receive transparent payments, and grow your influence.
                            </p>
                            <a
                                href="https://tally.so/r/w7XO0J"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors"
                            >
                                Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Brand Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="bg-neutral-900 p-12 rounded-3xl border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden text-white"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Building2 className="w-32 h-32 text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mb-8">
                                <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">For Brands</h3>
                            <p className="text-neutral-400 mb-8 leading-relaxed h-24">
                                Connect with high-impact creators who fit your brand perfectly. Access verified data, manage campaigns easily, and see real results.
                            </p>
                            <a
                                href="https://tally.so/r/3yq9M4"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-lg font-semibold text-white group-hover:text-neutral-300 transition-colors"
                            >
                                Inquire Partnership <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
