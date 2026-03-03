import { SEO } from '../components/SEO';

export function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12">
            <SEO title="개인정보처리방침" description="아서리안 스튜디오의 개인정보 수집 및 이용에 관한 방침입니다." />

            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-neutral-900 mb-8">개인정보처리방침</h1>

                <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-600 mb-6">
                        아서리안 스튜디오(이하 "회사")는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수하고 있습니다.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. 수집하는 개인정보 항목 및 방법</h2>
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
                            <p className="text-sm text-blue-900 font-semibold">⚠️ 자동 수집 고지</p>
                            <p className="text-sm text-blue-800 mt-2">
                                본 서비스는 로그인 후 <strong>매일 자동으로</strong> 귀하의 Threads 계정 데이터를 수집합니다.
                            </p>
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                            <li><strong>필수 항목</strong>: Threads 계정 ID, 사용자명, 프로필 사진</li>
                            <li><strong>자동 수집 항목</strong>: 팔로워 수, 게시물 개수 (매일 자정 자동 수집)</li>
                            <li><strong>수집 방법</strong>:
                                <ul className="list-disc pl-6 mt-2">
                                    <li>최초 로그인 시: 사용자 동의 후 OAuth 인증</li>
                                    <li>로그인 후: 매일 자정(한국시간) 자동 수집</li>
                                </ul>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. 이용 목적</h2>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                            <li>대시보드 서비스 제공 및 실시간 통계 표시</li>
                            <li>크리에이터 랭킹 및 성장률 분석</li>
                            <li>브랜드-크리에이터 매칭 서비스</li>
                            <li>일별 데이터 히스토리 제공 (최대 30일)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. 보유 및 이용 기간</h2>
                        <div className="bg-neutral-50 p-4 rounded-lg mb-3">
                            <p className="text-neutral-700"><strong>원칙</strong>: 서비스 이용 기간 동안 보유</p>
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                            <li><strong>Access Token</strong>: 로그인 유지 및 데이터 수집용, 탈퇴 시 즉시 삭제</li>
                            <li><strong>프로필 정보</strong>: 탈퇴 시 즉시 삭제</li>
                            <li><strong>일별 통계 데이터</strong>: 최대 30일간 보관 후 자동 삭제</li>
                            <li><strong>탈퇴 시</strong>: 모든 개인정보 <strong>즉시 영구 삭제</strong> (복구 불가)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. 이용자 권리 및 행사 방법</h2>
                        <p className="text-neutral-700 mb-3">귀하는 언제든지 다음 권리를 행사할 수 있습니다:</p>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-700 mb-4">
                            <li>개인정보 열람 요청</li>
                            <li>개인정보 정정 요청</li>
                            <li>개인정보 삭제 요청 (회원 탈퇴)</li>
                            <li>자동 데이터 수집 중단 요청</li>
                        </ul>
                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
                            <p className="text-sm text-yellow-900 font-semibold">📧 권리 행사 방법</p>
                            <p className="text-sm text-yellow-800 mt-2">
                                이메일: <strong>privacy@arthurian.cloud</strong><br />
                                제목: [개인정보 삭제 요청] 또는 [자동 수집 중단 요청]<br />
                                내용: 사용자명, 요청 사항<br />
                                처리 기간: 요청일로부터 <strong>7일 이내</strong>
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. 책임자</h2>
                        <div className="bg-neutral-50 p-6 rounded-xl">
                            <p className="text-neutral-700">담당: 아서리안 스튜디오 운영팀</p>
                            <p className="text-neutral-700">이메일: privacy@arthurian.cloud</p>
                        </div>
                    </section>

                    <div className="mt-12 pt-8 border-t border-neutral-200">
                        <p className="text-neutral-500 text-sm"><strong>시행일</strong>: 2026년 2월 4일</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
