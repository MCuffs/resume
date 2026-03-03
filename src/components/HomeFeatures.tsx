import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: <Target className="w-8 h-8 md:w-10 md:h-10 text-neutral-900" />,
        title: "Micro-Targeting",
        description: "관심사 기반의 정교한 매칭으로 진성 유저에게 도달합니다."
    },
    {
        icon: <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-neutral-900" />,
        title: "High Conversion",
        description: "단순 노출이 아닌, 구매와 전환에 최적화된 콘텐츠를 기획합니다."
    },
    {
        icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-neutral-900" />,
        title: "Verified Creators",
        description: "팔로워 수보다 구매 파급력이 입증된 크리에이터와 함께합니다."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-neutral-900" />,
        title: "Safe Management",
        description: "계약부터 정산까지, 모든 과정을 안전하게 관리합니다."
    }
];

export function HomeFeatures() {
    return (
        <section className="px-6 md:px-12 lg:px-24 py-24 bg-neutral-50">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-start"
                        >
                            <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 text-neutral-900">
                                {feature.title}
                            </h3>
                            <p className="text-neutral-500 font-light leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
