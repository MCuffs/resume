import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowUpRight, Youtube, Star, TrendingUp } from 'lucide-react';

const POSTS = [
    {
        id: 2,
        slug: 'hu100-marketing-case',
        title: '아서리안과 함께한 후백(Hu100)의 스레드 마케팅 후기',
        excerpt: '100세까지 건강하게, Hu100. 화려한 영상 광고 대신 진정성 있는 텍스트 마케팅으로 찐팬을 모은 실제 사례를 공개합니다.',
        date: '2026. 02. 02',
        category: 'Client Success',
        image: '/blog/hu100/main.png',
        tags: ['Review', 'Wellness', 'Branding']
    },
    {
        id: 1,
        slug: 'why-we-pivoted-to-threads',
        title: '아서리안이 스레드(Threads) 전문 에이전시가 된 이유',
        excerpt: '모두가 숏폼 중독을 외칠 때, 우리는 왜 텍스트로 돌아갔을까요? 도파민의 시대, 진정성 있는 텍스트가 가진 힘에 대해 이야기합니다.',
        date: '2026. 02. 02',
        category: 'Agency Insight',
        image: '/blog/User Case/1st/11월.jpeg', // Using placeholder for now
        tags: ['Agency Story', 'Threads', 'Insight']
    }
];

export function BlogPage() {
    return (
        <div className="bg-white min-h-screen">
            <SEO title="Real Reviews" description="Authentic growth stories and revenue proof from our partners." />

            <section className="pt-48 pb-24 px-6 md:px-12 bg-neutral-900 text-white text-center min-h-[50vh] flex flex-col justify-center items-center relative overflow-hidden">
                {/* Background Element */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-900 opacity-50" />

                <div className="relative z-10 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAE100] text-[#371D1E] text-sm font-bold mb-6"
                    >
                        <Star size={14} fill="currentColor" />
                        <span>Verified Reviews</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        Real Stories.
                    </motion.h1>
                    <p className="text-xl text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
                        아서리안은 숫자로 증명합니다.<br />
                        스친이들의 실제 수익 인증과 성장 스토리를 확인하세요.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {POSTS.map((post) => (
                        <NavLink
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="bg-white rounded-3xl border border-neutral-100 overflow-hidden hover:shadow-2xl hover:border-black/5 transition-all duration-500 h-full flex flex-col relative">
                                <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-neutral-900/10 z-10 group-hover:bg-transparent transition-colors" />
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-[#FAE100] text-[#371D1E] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="text-2xl font-bold mb-3 leading-tight group-hover:underline underline-offset-4 decoration-2 decoration-[#FAE100]">
                                        {post.title}
                                    </h2>
                                    <p className="text-neutral-500 font-light leading-relaxed mb-6 line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between text-sm font-medium">
                                        <span className="text-neutral-900">수익 인증 보기</span>
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-[#FAE100] group-hover:text-[#371D1E] transition-colors">
                                            <ArrowUpRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </NavLink>
                    ))}
                </div>
            </section>
        </div>
    );
}
