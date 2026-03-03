import { motion } from 'framer-motion';
import { ArrowRight, Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Analytics } from '../utils/analytics';
import { Container } from './Container';

export function HomeCTA() {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-neutral-50 border-b border-neutral-100">
            <Container>
                <div className="max-w-[1200px] mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Partner Application (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-10 md:p-14 cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
                        onClick={() => {
                            Analytics.track(Analytics.Events.CTA_CLICK, { location: 'home_bottom', type: 'creator' });
                            navigate('/apply/creator');
                        }}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <Users size={120} />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between items-start gap-8">
                            <div>
                                <h3 className="text-3xl font-bold mb-3">스친이 신청하기</h3>
                                <p className="text-neutral-400 font-light text-lg">
                                    아서리안과 함께 성장할<br />
                                    크리에이터를 모십니다.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-neutral-900 font-bold text-sm transition-transform group-hover:scale-105">
                                Apply Now <ArrowRight size={16} />
                            </span>
                        </div>
                    </motion.div>

                    {/* Brand Inquiry (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden rounded-3xl bg-neutral-100 text-neutral-900 p-10 md:p-14 cursor-pointer border border-neutral-200 hover:border-neutral-300 hover:shadow-xl transition-all"
                        onClick={() => {
                            Analytics.track(Analytics.Events.CTA_CLICK, { location: 'home_bottom', type: 'brand' });
                            navigate('/apply/brand');
                        }}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <Building2 size={120} />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between items-start gap-8">
                            <div>
                                <h3 className="text-3xl font-bold mb-3">브랜드 캠페인 문의하기</h3>
                                <p className="text-neutral-500 font-light text-lg">
                                    가장 효과적인 스레드 마케팅,<br />
                                    지금 시작해보세요.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-bold text-sm transition-transform group-hover:scale-105">
                                Contact Sales <ArrowRight size={16} />
                            </span>
                        </div>
                    </motion.div>
                </div>
                </div>
            </Container>
        </section>
    );
}
