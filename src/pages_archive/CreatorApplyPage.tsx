import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { SEO } from '../components/SEO';
import { toast } from 'sonner';
import { Analytics } from '../utils/analytics';

export function CreatorApplyPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        platform: 'threads', // threads only
        channelUrl: '',
        followers: '',
        engagement: '',
        category: '',
        agreed: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        try {
            // Extract handle from URL or use as is
            let handle = formData.channelUrl.trim();
            try {
                if (handle.startsWith('http')) {
                    const url = new URL(handle);
                    const pathParts = url.pathname.split('/').filter(Boolean);
                    // Handle format like /@username
                    const handlePart = pathParts.find(p => p.startsWith('@'));
                    if (handlePart) {
                        handle = handlePart;
                    } else {
                        // fallback
                        handle = pathParts[pathParts.length - 1] || handle;
                    }
                }
            } catch (e) {
                console.warn('Could not parse handle', e);
            }

            const resp = await fetch('/api/public/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    handle: handle, // Add extracted handle
                    formType: 'CreatorApplication',
                    timestamp: new Date().toISOString()
                })
            });

            const json = await resp.json().catch(() => ({}));
            if (!resp.ok || !json?.ok) {
                throw new Error(json?.error || '제출에 실패했습니다.');
            }

            setIsSubmitted(true);

            Analytics.track(Analytics.Events.CREATOR_APPLY_SUBMIT, {
                platform: formData.platform,
                category: formData.category,
                has_channel_url: !!formData.channelUrl
            });

            toast.success('신청이 성공적으로 접수되었습니다.');
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSending(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const categories = ['Beauty', 'Fashion', 'Food', 'Lifestyle', 'Tech', 'Education', 'Other'];

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">신청 완료!</h2>
                    <p className="text-neutral-500 font-light mb-8">
                        신청이 성공적으로 접수되었습니다.<br />
                        검토 후 등록해주신 연락처로 3일 이내에 연락드리겠습니다.
                    </p>
                    <a href="/" className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
                        홈으로 돌아가기
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6">
            <SEO
                title="스친이 신청하기"
                description="아서리안의 공식 스친이로 등록하고 브랜드 캠페인을 시작하세요."
                keywords={['크리에이터 모집', '인플루언서 지원', 'SNS 수익화', 'MCN 모집', '스친이 지원', '스레드 수익화', '인플루언서 성장']}
            />

            <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 lg:gap-24">
                {/* Left Column: Info */}
                <div className="md:col-span-5 lg:col-span-4 md:sticky top-32 h-fit">
                    <span className="text-xs font-bold tracking-widest uppercase mb-4 block text-neutral-400">For Creators</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-8 text-neutral-900 leading-tight">
                        스친이로<br />함께하세요.
                    </h1>
                    <p className="text-lg text-neutral-500 font-light mb-12 leading-relaxed">
                        아서리안의 공식 <strong className="text-neutral-900">스친이</strong>가 되어<br />
                        검증된 브랜드 캠페인과 안정적인 수익 기회를 만나보세요.
                    </p>

                    <div className="space-y-8 border-t border-neutral-100 pt-8">
                        <div className="flex gap-4">
                            <Sparkles className="w-6 h-6 text-neutral-900 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm mb-1">검증된 브랜드 매칭</h4>
                                <p className="text-sm text-neutral-500">우량 브랜드와의 안전한 협업 보장</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Sparkles className="w-6 h-6 text-neutral-900 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm mb-1">오픈 파트너십</h4>
                                <p className="text-sm text-neutral-500">전속 계약 없이 자유로운 활동</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Sparkles className="w-6 h-6 text-neutral-900 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm mb-1">홈페이지 프로필 등록</h4>
                                <p className="text-sm text-neutral-500">공식 스친이 디렉토리에 프로필 업로드</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-7 lg:col-span-8 bg-neutral-50 p-8 md:p-12 rounded-3xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: 기본 정보 */}
                        <section>
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-neutral-200">기본 정보</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">성함 (본명)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                                        placeholder="홍길동"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">연락처</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                                        placeholder="hello@example.com"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: 채널 정보 */}
                        <section>
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-neutral-200">채널 정보</h3>
                            <input type="hidden" name="platform" value="threads" />
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Threads 아이디 (ID)</label>
                                    <input
                                        type="text"
                                        name="channelUrl"
                                        required
                                        value={formData.channelUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                                        placeholder="@arthurian"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">팔로워 수</label>
                                        <input
                                            type="text"
                                            name="followers"
                                            required
                                            value={formData.followers}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                                            placeholder="예: 1.5만, 10k"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">평균 도달/반응</label>
                                        <input
                                            type="text"
                                            name="engagement"
                                            required
                                            value={formData.engagement}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                                            placeholder="예: 좋아요 500개"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">주요 카테고리</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors appearance-none"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: 동의 및 제출 */}
                        <section className="pt-4">
                            <div className="flex items-start gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    id="agreed"
                                    className="mt-1"
                                    checked={formData.agreed}
                                    onChange={(e) => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
                                />
                                <label htmlFor="agreed" className="text-sm text-neutral-500 leading-relaxed user-select-none cursor-pointer">
                                    개인정보 수집 및 이용에 동의하며, 아서리안의 스친이 등록 과정을 진행함에 동의합니다.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!formData.agreed || isSending}
                                className={`inline-flex items-center justify-center w-full px-10 py-4 rounded-full font-medium transition-colors shadow-lg ${formData.agreed && !isSending
                                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                    }`}
                            >
                                <span>{isSending ? '제출 중...' : '스친이 신청하기'}</span>
                                {isSending && <Loader2 size={16} className="ml-2 animate-spin" />}
                            </button>
                        </section>
                    </form>

                    {/* FAQ Section */}
                    <div className="mt-16 mb-4">
                        <h3 className="text-xl font-bold mb-6 pb-2 border-b border-neutral-200">자주 묻는 질문</h3>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "스친이가 되면 어떤 혜택이 있나요?",
                                    a: "아서리안의 공식 스친이로 선정되시면 홈페이지에 프로필이 업로드 되며 더 많은 캠페인 참여 기회를 획득하실 수 있습니다!"
                                },
                                {
                                    q: "스친이가 되면 별도 계약이 필요한건가요?",
                                    a: "아닙니다, 아서리안은 스친이분들의 자율성을 존중하기 때문에 종속성 없는 파트너십을 지향합니다."
                                },
                                {
                                    q: "지원 결과는 언제 알 수 있나요?",
                                    a: "신청 접수 후 내부 검토를 거쳐 영업일 기준 3일 이내에 기재해주신 연락처로 개별 안내드립니다."
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                                    <h4 className="font-bold text-lg mb-2 text-neutral-900">{item.q}</h4>
                                    <p className="text-neutral-600 leading-relaxed text-sm">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
