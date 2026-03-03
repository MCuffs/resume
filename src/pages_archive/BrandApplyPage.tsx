import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Building2, Package, Target, Loader2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { toast } from 'sonner';
import { Analytics } from '../utils/analytics';
import { useLocation } from 'react-router-dom';

export function BrandApplyPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const location = useLocation();

    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        website: '',
        productName: '',
        campaignGoal: 'sales', // sales | branding | traffic
        budget: '',
        message: ''
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const prefill = params.get('prefill');
        if (prefill) {
            setFormData(prev => ({ ...prev, message: decodeURIComponent(prefill) }));
        }
    }, [location.search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        try {
            const resp = await fetch('/api/public/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    formType: 'BrandApplication',
                    timestamp: new Date().toISOString()
                })
            });

            const json = await resp.json().catch(() => ({}));
            if (!resp.ok || !json?.ok) {
                throw new Error(json?.error || '제출에 실패했습니다.');
            }

            setIsSubmitted(true);

            Analytics.track(Analytics.Events.BRAND_APPLY_SUBMIT, {
                campaign_goal: formData.campaignGoal,
                budget_range: formData.budget,
                website_provided: !!formData.website
            });

            toast.success('문의가 성공적으로 접수되었습니다.');
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSending(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Inquiry Sent</h2>
                    <p className="text-neutral-500 font-light mb-8">
                        문의가 접수되었습니다.<br />
                        담당 매니저가 내용을 확인 후 24시간 이내에 제안서를 보내드립니다.
                    </p>
                    <a href="/" className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
                        Return Home
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6">
            <SEO
                title="Brand Application"
                description="Register your campaign and connect with top-tier creators."
                keywords={['브랜드 마케팅', '쓰레드 광고', '체험단 모집', '인플루언서 매칭', '스레드 홍보', '공동구매 소싱', '마케팅 대행']}
            />

            <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 lg:gap-24">
                {/* Left Column: Info */}
                <div className="md:col-span-5 lg:col-span-4 md:sticky top-32 h-fit">
                    <span className="text-xs font-bold tracking-widest uppercase mb-4 block text-neutral-400">For Brands</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-8 text-neutral-900 leading-tight">
                        Start Your<br />Campaign.
                    </h1>
                    <p className="text-lg text-neutral-500 font-light mb-12 leading-relaxed">
                        제품의 잠재력을 폭발시킬 준비가 되셨나요?
                        간단한 정보를 남겨주시면, 아서리안의 전담 매니저가 최적의 크리에이터와 전략을 제안해드립니다.
                    </p>

                    <div className="space-y-8 border-t border-neutral-100 pt-8">
                        <div className="flex gap-4">
                            <Building2 className="w-6 h-6 text-neutral-900 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm mb-1">Company Verification</h4>
                                <p className="text-sm text-neutral-500">사업자 등록증 기반의 철저한 인증</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Target className="w-6 h-6 text-neutral-900 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm mb-1">Target Matching</h4>
                                <p className="text-sm text-neutral-500">브랜드 핏에 맞는 크리에이터 매칭</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Package className="w-6 h-6 text-neutral-900 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm mb-1">Full Management</h4>
                                <p className="text-sm text-neutral-500">기획부터 정산까지 올인원 케어</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-7 lg:col-span-8 bg-neutral-50 p-8 md:p-12 rounded-3xl">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1 */}
                        <section>
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-neutral-200">Brand Info</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">회사명 (브랜드명)</label>
                                    <input type="text" name="companyName" required className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">담당자 성함</label>
                                    <input type="text" name="contactName" required className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors" onChange={handleChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">이메일</label>
                                    <input type="email" name="email" required className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors" onChange={handleChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">웹사이트 / 쇼핑몰 URL</label>
                                    <input type="url" name="website" className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors" onChange={handleChange} />
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-neutral-200">Product & Goal</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">진행할 제품명</label>
                                    <input type="text" name="productName" required className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors" onChange={handleChange} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">캠페인 주요 목표</label>
                                        <select name="campaignGoal" className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors appearance-none" onChange={handleChange}>
                                            <option value="sales">매출 증대 (Sales)</option>
                                            <option value="branding">브랜드 인지도 (Branding)</option>
                                            <option value="traffic">유입 확대 (Traffic)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">예산 규모</label>
                                        <select name="budget" className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors appearance-none" onChange={handleChange}>
                                            <option value="">선택해주세요</option>
                                            <option value="100k_500k">10만원 ~ 50만원</option>
                                            <option value="500k_1m">50만원 ~ 100만원</option>
                                            <option value="1m_3m">100만원 ~ 300만원</option>
                                            <option value="3m_5m">300만원 ~ 500만원</option>
                                            <option value="5m_10m">500만원 ~ 1,000만원</option>
                                            <option value="10m_30m">1,000만원 ~ 3,000만원</option>
                                            <option value="over_30m">3,000만원 이상</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">기타 문의사항</label>
                                    <textarea name="message" rows={4} className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors resize-none" placeholder="특별히 원하시는 크리에이터 스타일이나 일정이 있다면 적어주세요." onChange={handleChange}></textarea>
                                </div>
                            </div>
                        </section>

                        <div className="pt-4 text-right">
                            <button
                                type="submit"
                                disabled={isSending}
                                className="inline-flex items-center justify-center w-full md:w-auto px-10 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span>{isSending ? 'Sending...' : 'Send Inquiry'}</span>
                                {isSending && <Loader2 size={16} className="ml-2 animate-spin" />}
                            </button>
                        </div>
                    </form>

                    {/* FAQ Section */}
                    <div className="mt-16 mb-4">
                        <h3 className="text-xl font-bold mb-6 pb-2 border-b border-neutral-200">자주 묻는 질문</h3>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "신청 후 절차는 어떻게 진행되나요?",
                                    a: "담당자가 확인 후 개별 연락을 통해 진행됩니다."
                                },
                                {
                                    q: "최소 금액 10만원은 필수인가요?",
                                    a: "해당 비용은 플랫폼 사용 및 인플루언서 매칭의 수수료로 사용되며, 인플루언서 지급형 캠페인 및 브랜디드 캠페인은 기타 문의사항에서 함께 문의 부탁드립니다!"
                                },
                                {
                                    q: "계약은 어떻게 진행되나요?",
                                    a: "세금 계산서 발행은 필수로 진행해드리며, 신청 확인 -> 담당자 연락 -> 캠페인 협의 및 조율 -> 인플루언서 게시글 업로드 및 피드백 -> 최종 결과 보고 의 형태로 이뤄집니다"
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                                    <h4 className="font-bold text-lg mb-2 text-neutral-900">{item.q}</h4>
                                    <p className="text-neutral-600 leading-relaxed text-sm whitespace-pre-line">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
