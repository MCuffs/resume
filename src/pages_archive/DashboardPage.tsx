import { Lock } from 'lucide-react';
import { SEO } from '../components/SEO';

export function DashboardPage() {
    return (
        <div className="bg-neutral-50 min-h-screen pt-32 pb-24 px-6 md:px-12">
            <SEO title="Creator Dashboard" description="크리에이터님의 실시간 성장을 분석합니다." />

            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="bg-white p-16 rounded-3xl border border-neutral-100 shadow-sm max-w-2xl">
                        <div className="p-8 bg-neutral-50 rounded-full mb-8 inline-block">
                            <Lock size={64} className="text-neutral-300" />
                        </div>
                        <h1 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight">대시보드 준비 중</h1>
                        <p className="text-neutral-500 font-light text-lg leading-relaxed mb-6">
                            플랫폼 기능이 정비되는 대로 업데이트됩니다.<br />
                            곧 더 강력한 크리에이터 대시보드로 찾아뵙겠습니다.
                        </p>
                        <div className="inline-block px-6 py-3 bg-black text-white text-sm font-bold rounded-xl">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
