import { motion } from 'framer-motion';
import { Check, Zap, MessageCircle } from 'lucide-react';
import { Container } from './Container';

export function HomeComparison() {
    return (
        <section className="py-28 bg-neutral-50 relative overflow-hidden border-b border-neutral-100">
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-white rounded-full blur-3xl opacity-60 -z-10" />

            <Container>
                <div className="max-w-[1000px] mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-neutral-100 text-neutral-600 text-sm font-medium mb-8">
                        Why Threads?
                    </span>

                    <h2 className="text-4xl md:text-6xl font-bold mb-12 text-neutral-900 leading-tight">
                        진정성 있는 텍스트가<br />
                        <span className="text-neutral-400">가장 강력한 마케팅입니다.</span>
                    </h2>

                    <div className="max-w-2xl mx-auto text-xl md:text-2xl text-neutral-500 font-light leading-relaxed mb-16">
                        <p className="mb-8">
                            쏟아지는 숏폼 콘텐츠와 자극적인 영상 광고에 지친 소비자들은<br className="hidden md:block" />
                            이제 진심이 담긴 '글'을 읽기 시작했습니다.
                        </p>
                        <p>
                            아서리안은 스레드(Threads)라는 텍스트 플랫폼을 통해<br className="hidden md:block" />
                            브랜드의 본질적인 이야기를 전합니다.
                        </p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
                    {[
                        { icon: Zap, title: "높은 도달률", desc: "알고리즘을 통한 폭발적인 노출" },
                        { icon: MessageCircle, title: "깊은 유대감", desc: "댓글 소통을 통한 팬덤 형성" },
                        { icon: Check, title: "확실한 전환", desc: "설득력을 갖춘 텍스트의 힘" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="p-8 bg-white border border-neutral-200/60 rounded-3xl shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-neutral-900">{item.title}</h3>
                            <p className="text-neutral-500 font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
                </div>
            </Container>
        </section>
    );
}
