import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export interface FAQItem {
    question: string;
    answer: string;
}

const DEFAULT_FAQS: FAQItem[] = [
    {
        question: "Threads 마케팅은 다른 SNS와 어떻게 다른가요?",
        answer: "이미지 중심의 인스타그램과 달리, 스레드는 '텍스트' 중심의 소통이 활발합니다. 진정성 있는 후기와 정보 전달에 강점이 있어, 구매 관여도가 높은 제품군에 특히 효과적입니다."
    },
    {
        question: "스친이가 되면 어떤 혜택이 있나요?",
        answer: "아서리안의 스친이가 되시면 매칭 조건에서 우선순위로 배정됩니다!"
    },
    {
        question: "광고/캠페인 최소 예산은 얼마인가요?",
        answer: "아서리안은 10만원부터 시작 가능합니다. 예산의 규모보다는 브랜드와 크리에이터의 '핏(Fit)'과 '성장 가능성'을 더 중요하게 생각합니다. 부담 없이 문의주세요."
    },
    {
        question: "팔로워가 적은 브랜드도 효과를 볼 수 있나요?",
        answer: "네, 그렇습니다. 스레드는 알고리즘 특성상 팔로워가 없어도 콘텐츠의 질이 좋으면 확산(Viral)될 가능성이 높습니다. 아서리안이 초기 확산을 도와드립니다."
    },
    {
        question: "정산 주기는 어떻게 되나요?",
        answer: "캠페인 종료 및 리포트 전달 후 익월 말일 지급을 원칙으로 하고 있습니다."
    }
];

interface FAQProps {
    items?: FAQItem[];
    dark?: boolean;
}

export function FAQ({ items = DEFAULT_FAQS, dark = false }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className={`py-24 px-6 md:px-12 border-t ${dark ? 'bg-black border-neutral-800 text-white' : 'bg-white border-neutral-100 text-neutral-900'}`}>
            <div className="max-w-[1000px] mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {items.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${dark
                                ? 'border-neutral-800 hover:border-neutral-700'
                                : 'border-neutral-200 hover:border-neutral-300'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${dark ? 'bg-black hover:bg-neutral-900' : 'bg-white hover:bg-neutral-50'}`}
                            >
                                <span className="text-lg font-medium">{faq.question}</span>
                                <span className={`transition-transform ${openIndex === index ? 'rotate-180' : ''} ${dark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className={`px-6 pb-6 leading-relaxed pt-4 ${dark
                                            ? 'text-neutral-400 bg-neutral-900/50 border-t border-neutral-800'
                                            : 'text-neutral-600 bg-neutral-50/50 border-t border-neutral-100'
                                            }`}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
