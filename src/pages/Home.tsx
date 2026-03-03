import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const [showConsultingModal, setShowConsultingModal] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', targetCompany: '' });
    const [consultingLoading, setConsultingLoading] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setErrorMSG('Please select a PDF format English Resume first.');
            return;
        }

        setLoading(true);
        setErrorMSG('');

        const uploadData = new FormData();
        uploadData.append('resume', file);

        try {
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: uploadData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to parse resume');
            }

            // Save the extracted raw text and the pending transaction sessionId. Actual AI generation happens AFTER payment on the next page.
            localStorage.removeItem('parsedResume'); // Clear any leftover demo data
            localStorage.setItem('rawResumeText', result.text);
            if (result.sessionId) {
                localStorage.setItem('sessionId', result.sessionId);
            }
            navigate('/preview');
        } catch (err: any) {
            console.error(err);
            setErrorMSG(err.message || 'Server error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const openPaymentModal = (serviceType: string) => {
        setSelectedService(serviceType);
        setShowConsultingModal(true);
    };

    const handleConsultingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;

        if (!webhookUrl) {
            console.warn("Webhook URL missing! Simulated Submission:", { service: selectedService, ...formData });
            alert(`[Simulation Mode] Application sent!\n(Add VITE_GOOGLE_SHEET_WEBHOOK_URL to .env to connect real DB)`);
            setShowConsultingModal(false);
            setFormData({ name: '', email: '', targetCompany: '' });
            return;
        }

        setConsultingLoading(true);
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors', // Avoid CORS preflight issues with standard Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service: selectedService,
                    name: formData.name,
                    email: formData.email,
                    targetCompany: formData.targetCompany,
                    timestamp: new Date().toISOString()
                })
            });

            alert(`Application sent successfully!\nOur expert will contact you at ${formData.email} within 24 hours.`);
            setShowConsultingModal(false);
            setFormData({ name: '', email: '', targetCompany: '' });
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit the form. Please try again later.");
        } finally {
            setConsultingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#112E51] font-sans selection:bg-[#29AEE1] selection:text-white">
            {/* Top Announcement Bar */}
            <div className="bg-[#041B3B] text-white text-[12px] py-2 px-6 shadow-sm flex items-center justify-center md:justify-between font-medium tracking-wide">
                <div className="hidden md:flex flex-1"></div>
                <div className="flex items-center gap-2">
                    <span className="text-[#29AEE1] font-black text-sm">&gt;</span> Build your career in Korea right now! Data & AI-driven Resume Pipeline.
                    <button className="ml-2 hover:underline decoration-[#29AEE1] underline-offset-4">Learn more</button>
                </div>
                <div className="hidden md:flex flex-1 justify-end">
                    <button className="text-white hover:text-gray-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>

            {/* Navbar */}
            <header className="border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-center sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1400px] w-full flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <div className="font-extrabold text-[20px] tracking-tight flex items-center gap-2 text-[#29AEE1]">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            ARTHURIAN
                        </div>
                        {/* Links */}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-28 pb-36 overflow-hidden flex flex-col items-center">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#cff0ff] via-[#eaf7ff] to-[#ffffff] -z-10" />
                <div className="absolute top-0 right-0 w-1/2 md:w-1/3 h-[800px] bg-gradient-to-bl from-[#70cfff]/30 to-transparent -z-10 rounded-full blur-3xl opacity-60" />
                <div className="absolute top-1/2 left-0 w-1/4 h-[500px] bg-gradient-to-tr from-[#7fcbff]/20 to-transparent -z-10 rounded-full blur-2xl" />

                <div className="max-w-[1000px] mx-auto text-center px-6 z-10 w-full">
                    <div className="text-[13px] font-extrabold text-[#556987] uppercase tracking-[0.2em] mb-4">
                        AI Resume Cloud
                    </div>
                    <h1 className="text-[40px] md:text-[54px] lg:text-[64px] font-extrabold text-[#112E51] leading-[1.05] mb-2 tracking-tight drop-shadow-sm">
                        BRIDGE THE GAP TO YOUR
                    </h1>
                    <h1 className="text-[40px] md:text-[54px] lg:text-[64px] font-extrabold text-[#29AEE1] leading-[1.05] mb-8 tracking-tight drop-shadow-sm">
                        KOREAN CAREER.
                    </h1>
                    <p className="text-[17px] md:text-[19px] text-[#2c3e50] max-w-[760px] mx-auto leading-[1.6] mb-14 font-medium">
                        Korea's job market is open to global talent, yet countless candidates fail the initial screening simply because they lack the deeply-rooted, standardized corporate resume format. Convert your English CV into an impeccable, HR-compliant <strong className="font-bold text-[#112E51]">Korean resume in seconds.</strong>
                    </p>

                    {/* Search-like Upload Bar */}
                    <div className="max-w-[800px] mx-auto bg-white rounded-full shadow-[0_15px_60px_-15px_rgba(41,174,225,0.25)] p-2.5 md:pl-8 flex flex-col md:flex-row items-center border border-white hover:border-[#29AEE1]/30 transition-all duration-300 relative group">

                        <div className="flex-[1] w-full flex items-center relative py-3 md:py-1 z-20 overflow-hidden">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                                disabled={loading}
                            />
                            <svg className="w-6 h-6 text-[#29AEE1] mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                            </svg>
                            <div className="text-left flex-1 whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none">
                                {file ? (
                                    <span className="text-[#112E51] font-bold text-[16px] md:text-[18px]">{file.name}</span>
                                ) : (
                                    <span className="text-gray-400 text-[16px] md:text-[18px] font-medium hidden md:inline group-hover:text-gray-500 transition-colors">Attach English Resume (PDF)...</span>
                                )}
                                {!file && <span className="text-gray-400 text-[16px] font-medium md:hidden">Upload PDF...</span>}
                            </div>
                        </div>

                        <div className="flex items-center w-full md:w-auto mt-2 md:mt-0 z-20 gap-3">
                            {errorMSG && <span className="text-red-500 text-[13px] font-bold whitespace-nowrap hidden lg:block mr-2">{errorMSG}</span>}
                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className={`w-full md:w-auto px-10 py-4 md:py-3.5 rounded-full font-bold text-[15px] transition-all duration-300 shadow-md ${file ? 'bg-[#29AEE1] text-white hover:bg-[#1E95C3] hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg> Processing...
                                    </span>
                                ) : 'Run AI Pipeline'}
                            </button>
                        </div>
                    </div>
                    {errorMSG && <div className="text-red-500 text-[13px] font-bold mt-4 lg:hidden">{errorMSG}</div>}

                    <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 text-[14px] font-semibold text-[#112E51]">
                        <button
                            onClick={() => {
                                const mockData = {
                                    "personalInfo": {
                                        "name": "홍길동",
                                        "gender": "남",
                                        "birthYear": "1994년 (만 32세)",
                                        "phone": "010-1234-5678",
                                        "email": "gildong.hong@gmail.com",
                                        "address": "서울특별시 강남구 테헤란로 123",
                                        "summary": "1,000만 MAU 글로벌 B2B SaaS 프로덕트의 핵심 사업 전략을 리드한 6년차 그로스 마케터 및 전략 기획자. 다수의 글로벌 캠페인을 성공적으로 런칭하여 전년 대비 150%의 매출 성장을 견인한 경험이 있으며, 데이터 기반의 의사결정과 퍼포먼스 마케팅 최적화에 전문성을 보유하고 있습니다. 한국 및 아시아 시장 확장을 위한 신규 비즈니스 파이프라인 구축에 강점을 보입니다."
                                    },
                                    "education": [
                                        {
                                            "schoolName": "서울대학교",
                                            "degree": "학사 (B.A.)",
                                            "major": "경영학과",
                                            "period": "2013. 03 ~ 2018. 02",
                                            "status": "졸업"
                                        },
                                        {
                                            "schoolName": "New York University",
                                            "degree": "교환학생",
                                            "major": "비즈니스 마케팅",
                                            "period": "2015. 09 ~ 2016. 06",
                                            "status": "수료"
                                        }
                                    ],
                                    "experience": [
                                        {
                                            "companyName": "NEXUS Tech (네서스 테크)",
                                            "period": "2021.03 ~ 재직 중",
                                            "totalDuration": "총 3년 1개월",
                                            "projects": [
                                                {
                                                    "projectName": "글로벌 마케팅 캠페인 및 전략 총괄",
                                                    "period": "2021.03 ~ 현재",
                                                    "role": "Marketing Director",
                                                    "achievements": [
                                                        "글로벌 B2B 클라이언트 타겟팅 및 디지털 마케팅 전략 수립 (월간 광고 예산 $500K 운영)",
                                                        "신규 APAC 시장 진출 캠페인 리드: 프로덕트 MAU 전년 대비 250% 상승 견인",
                                                        "A/B 테스트 및 퍼널 최적화를 통해 리드 전환율(CVR) 18% 개선",
                                                        "연간 세일즈 리드 파이프라인 최적화로 1차 분기 매출액 200만 달러 초과 달성"
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "companyName": "InnoVision Korea",
                                            "period": "2018.03 ~ 2021.02",
                                            "totalDuration": "총 3년",
                                            "projects": [
                                                {
                                                    "projectName": "퍼포먼스 마케팅 매니저",
                                                    "period": "2018.03 ~ 2021.02",
                                                    "role": "Performance Marketer",
                                                    "achievements": [
                                                        "Google Ads, Meta Ads 기획 및 운영 관리, 고객 획득 비용(CAC) 30% 절감",
                                                        "자체 CRM 데이터 분석을 기반으로 한 VIP 고객 리텐션 캠페인 런칭 (리텐션율 15% 상승)",
                                                        "온라인 프로모션 이벤트 기획 및 운영 (일 최고 방문자수 10만 명 달성)"
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "skills": [
                                        "Google Analytics 4 / Amplitude",
                                        "Google Ads / Meta Ads Manager",
                                        "SQL / Tableau 활용 데이터 분석 및 대시보드 구축",
                                        "HubSpot / Salesforce (CRM 툴 활용 리드 너쳐링)",
                                        "A/B Testing 기획 및 실행"
                                    ],
                                    "languages": [
                                        {
                                            "name": "영어",
                                            "level": "원어민 수준 (Native proficiency)",
                                            "certification": "TOEIC 990, OPIc AL"
                                        },
                                        {
                                            "name": "한국어",
                                            "level": "모국어",
                                            "certification": ""
                                        }
                                    ],
                                    "awards": [
                                        {
                                            "name": "2022 아시아 테크 어워즈 우수 마케팅 캠페인 부문 수상",
                                            "organization": "Asia Tech Committee",
                                            "month": "2022. 11"
                                        },
                                        {
                                            "name": "사내 핵심 인재 공로상 (Top Performer of the Year)",
                                            "organization": "NEXUS Tech",
                                            "month": "2021. 12"
                                        }
                                    ],
                                    "extracurricular": [],
                                    "certifications": ["PMP", "Google Analytics 연수"],
                                    "keywords": ["리더십", "책임감", "도전적", "논리적", "유연성", "커뮤니케이션 능력"],
                                    "selfIntroduction": "경영학과 출신으로 폭넓은 비즈니스 케이스 스터디 기반의 유연한 문제 해결 능력을 갖추었습니다. 초기 커리어를 NEXUS Tech 파트너십 부문에서 시작하여 다양한 산업군의 파트너 기업들과 긴밀하게 소통하며 신뢰를 구축해 왔습니다.\n\n이를 기반으로 현재 글로벌 마케팅 디렉터 역할을 완수하며 급변하는 B2B 소프트웨어 시장에 선제적으로 대응하는 전략을 기획하고 있습니다. 특히 데이터를 기반으로 한 합리적인 의사결정 프로세스를 도입하여, 한정된 마케팅 예산 대비 최고 효율을 창출한 다수의 캠페인 사례를 이끌었습니다.\n\n앞으로도 실무 현장에서의 인사이트와 탁월한 대내외 커뮤니케이션 능력을 발휘하여, 글로벌 IT 생태계를 리딩하는 경쟁력 있는 비즈니스 전문가로서 성장해 나가고자 합니다."
                                };
                                localStorage.setItem('parsedResume', JSON.stringify(mockData));
                                navigate('/preview');
                            }}
                            className="bg-[#29AEE1]/10 text-[#29AEE1] px-5 py-2.5 rounded-full hover:bg-[#29AEE1]/20 transition-colors flex items-center gap-2"
                        >
                            View Demo Output
                        </button>
                        <button className="text-[#556987] hover:text-[#112E51] flex items-center gap-1 transition-colors">
                            Check Announcements <span className="text-[#29AEE1] font-bold ml-1">&gt;</span>
                        </button>
                    </div>
                </div>
            </section >



            {/* Core Features / 3 Columns */}
            < section className="py-28 bg-[#f9fafb]" >
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-20">
                        <h2 className="text-[13px] font-bold text-[#556987] mb-3 uppercase tracking-wider">Platform Insights</h2>
                        <h3 className="text-[40px] md:text-[46px] font-extrabold text-[#112E51] leading-[1.1] tracking-tight">
                            ENTERPRISE<br />
                            <span className="text-[#29AEE1]">DATA & AI PIPELINE</span>
                        </h3>
                        <p className="text-[17px] text-[#556987] max-w-[650px] mt-6 leading-[1.6]">
                            From ingestion and processing to structuring and compliance, Arthurian ensures your career data achieves maximum impact in the Korean market.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 md:gap-14">
                        <div className="group">
                            <div className="w-16 h-16 mb-8 text-[#29AEE1] bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <h4 className="text-[14px] font-extrabold text-[#29AEE1] uppercase tracking-wider mb-2">Simplicity</h4>
                            <h5 className="text-[22px] font-bold text-[#112E51] mb-3">Instant Korean Formatting</h5>
                            <p className="text-[16px] text-[#556987] leading-relaxed">
                                Simply upload your PDF. We eliminate the time spent figuring out complex table structures, grids, and formatting rules that are standard in Korea.
                            </p>
                        </div>
                        <div className="group">
                            <div className="w-16 h-16 mb-8 text-[#29AEE1] bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                </svg>
                            </div>
                            <h4 className="text-[14px] font-extrabold text-[#29AEE1] uppercase tracking-wider mb-2">Connectivity</h4>
                            <h5 className="text-[22px] font-bold text-[#112E51] mb-3">Contextual Translation</h5>
                            <p className="text-[16px] text-[#556987] leading-relaxed">
                                Our bespoke AI accurately translates your professional milestones, ensuring your tech stack and experiences map perfectly to local business norms.
                            </p>
                        </div>
                        <div className="group">
                            <div className="w-16 h-16 mb-8 text-[#29AEE1] bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                            </div>
                            <h4 className="text-[14px] font-extrabold text-[#29AEE1] uppercase tracking-wider mb-2">Reliability</h4>
                            <h5 className="text-[22px] font-bold text-[#112E51] mb-3">Secure Document Handling</h5>
                            <p className="text-[16px] text-[#556987] leading-relaxed">
                                Your personal information and career history are processed in an isolated environment and never retained for unauthorized training purposes.
                            </p>
                        </div>
                    </div>
                </div>
            </section >

            {/* Premium Consulting Image Feature Row (Like Snowflake Pfizer Card) */}
            < section className="py-28 bg-white overflow-hidden" >
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-[#29AEE1]/10 text-[#29AEE1] font-bold px-4 py-1.5 rounded-full text-[13px] mb-4 uppercase tracking-wider">
                            Go Beyond AI
                        </div>
                        <h3 className="text-[32px] md:text-[42px] font-extrabold text-[#112E51] mb-5 tracking-tight leading-tight">
                            Polished by <span className="text-[#29AEE1]">Experts</span>
                        </h3>
                        <p className="text-[18px] text-[#556987] max-w-2xl mx-auto leading-relaxed">
                            For critical applications, get your AI-translated resume reviewed and enriched by former Korean HR recruiters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Plan 1 */}
                        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-10 flex flex-col justify-between border border-gray-100 hover:border-[#29AEE1]/30 transition-colors">
                            <div>
                                <h4 className="text-[13px] font-bold text-[#29AEE1] mb-3 uppercase tracking-wider">Resume Polish</h4>
                                <h5 className="text-[28px] font-extrabold text-[#112E51] leading-tight mb-5">
                                    Korean Resume Review
                                </h5>
                                <p className="text-[16px] text-[#556987] leading-[1.6] mb-8">
                                    A former HR Recruiter with 5+ years of experience will personally review your AI-translated resume and correct any awkward phrasing into perfectly natural, professional business Korean.
                                </p>
                            </div>
                            <div>
                                <div className="text-[36px] font-extrabold text-[#29AEE1] leading-none mb-6">₩29,000</div>
                                <button className="w-full bg-[#112E51] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#0a1e36] transition-colors" onClick={() => openPaymentModal('Korean Resume Review (₩29,000)')}>
                                    Inquire Now
                                </button>
                            </div>
                        </div>

                        {/* Plan 2 */}
                        <div className="bg-gradient-to-br from-[#112E51] to-[#0a1e36] rounded-3xl shadow-[0_20px_60px_-15px_rgba(41,174,225,0.2)] p-8 md:p-10 flex flex-col justify-between border border-[#112E51] relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-[13px] font-bold text-[#29AEE1] mb-3 uppercase tracking-wider">Interview Prep</h4>
                                <h5 className="text-[28px] font-extrabold text-white leading-tight mb-5">
                                    Custom Interview Questions
                                </h5>
                                <p className="text-[16px] text-gray-300 leading-[1.6] mb-8">
                                    Based on your translated resume and your target company/industry, our experts will craft a customized set of high-probability behavioral and technical interview questions in Korean, along with answering strategies.
                                </p>
                            </div>
                            <div className="relative z-10">
                                <div className="text-[36px] font-extrabold text-[#29AEE1] leading-none mb-6">₩69,000</div>
                                <button className="w-full bg-[#29AEE1] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#1f9bc9] transition-colors" onClick={() => openPaymentModal('Custom Interview Questions (₩69,000)')}>
                                    Inquire Now
                                </button>
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#29AEE1] rounded-full mix-blend-screen opacity-10 blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section >



            {/* Modal - SaaS Styled */}
            {
                showConsultingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#112E51]/70 backdrop-blur-[4px] p-4">
                        <div className="bg-white shadow-2xl rounded-2xl max-w-[480px] w-full overflow-hidden border border-[#29AEE1]/20">

                            <div className="border-b border-gray-100 px-6 py-5 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#29AEE1]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                    <h3 className="text-[17px] font-extrabold text-[#112E51] tracking-tight">{selectedService}</h3>
                                </div>
                                <button
                                    onClick={() => setShowConsultingModal(false)}
                                    className="text-gray-400 hover:text-[#112E51] transition-colors p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-8">
                                <p className="text-[14px] text-[#556987] mb-8 leading-relaxed font-medium bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl text-blue-900 shadow-inner">
                                    Please submit your details below to request this service. Our team will review your inquiry and email you a secure payment link to proceed.
                                </p>

                                <form onSubmit={handleConsultingSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-[14px] font-bold text-[#112E51] mb-2 uppercase tracking-wide text-xs">User Handle (Name)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-[#112E51] font-medium focus:bg-white focus:outline-none focus:border-[#29AEE1] focus:ring-2 focus:ring-[#29AEE1]/20 transition-all shadow-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-bold text-[#112E51] mb-2 uppercase tracking-wide text-xs">Primary Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-[#112E51] font-medium focus:bg-white focus:outline-none focus:border-[#29AEE1] focus:ring-2 focus:ring-[#29AEE1]/20 transition-all shadow-sm"
                                            placeholder="abc@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-bold text-[#112E51] mb-2 uppercase tracking-wide text-xs">Target Organization</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.targetCompany}
                                            onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                                            className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-[#112E51] font-medium focus:bg-white focus:outline-none focus:border-[#29AEE1] focus:ring-2 focus:ring-[#29AEE1]/20 transition-all shadow-sm"
                                            placeholder="Samsung, Kakao, Tech..."
                                        />
                                    </div>

                                    <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full">
                                        <button
                                            type="button"
                                            onClick={() => setShowConsultingModal(false)}
                                            className="w-full sm:w-auto px-6 py-3.5 text-[15px] font-bold text-[#556987] hover:text-[#112E51] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={consultingLoading}
                                            className="w-full sm:w-auto bg-[#29AEE1] hover:bg-[#1E95C3] text-white text-[15px] font-bold px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                                        >
                                            {consultingLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {consultingLoading ? 'Processing...' : 'Submit Inquiry'}
                                                </span>
                                            ) : 'Submit Inquiry'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Minimal SaaS Footer */}
            <footer className="border-t border-gray-100 bg-white py-12 text-center text-[#556987]">
                <div className="flex items-center justify-center gap-2 mb-4 text-[#29AEE1]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="font-extrabold text-[16px] tracking-tight">ARTHURIAN</span>
                </div>
                <div className="flex items-center justify-center gap-6 text-[14px] font-bold mb-6">
                    <button onClick={() => setShowPrivacyModal(true)} className="hover:text-[#112E51] transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#29AEE1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        Zero Retention Policy
                    </button>
                    <button className="hover:text-[#112E51] transition-colors">Terms of Service</button>
                    <button className="hover:text-[#112E51] transition-colors">Contact</button>
                </div>
                <p className="text-[13px]">© 2026 Arthurian AI Resume. All rights reserved.</p>
            </footer>

            {/* Privacy Policy Modal */}
            {
                showPrivacyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#112E51]/70 backdrop-blur-[4px] p-4">
                        <div className="bg-white shadow-2xl rounded-2xl max-w-[550px] w-full overflow-hidden border border-[#29AEE1]/20">
                            <div className="border-b border-gray-100 px-6 py-5 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#29AEE1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    <h3 className="text-[17px] font-extrabold text-[#112E51] tracking-tight">Zero Retention Policy</h3>
                                </div>
                                <button
                                    onClick={() => setShowPrivacyModal(false)}
                                    className="text-gray-400 hover:text-[#112E51] transition-colors p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="bg-blue-50 border border-blue-100 text-[#112E51] p-5 rounded-xl mb-6">
                                    <h4 className="font-extrabold text-[15px] mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
                                        We do not store your resume.
                                    </h4>
                                    <p className="text-[14px] text-[#556987] leading-relaxed">
                                        Your privacy is our absolute priority. Our architecture is designed to handle your highly sensitive career data with <strong className="text-[#112E51]">Zero Retention</strong>.
                                    </p>
                                </div>

                                <ul className="space-y-5">
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-[#f8fbff] text-[#29AEE1] flex items-center justify-center font-bold border border-blue-100">1</div>
                                        <div>
                                            <h5 className="font-bold text-[#112E51] text-[15px] mb-1">Ephemeral Processing</h5>
                                            <p className="text-[14px] text-[#556987] leading-relaxed">Your uploaded PDF format is converted to text purely in memory. The original file is instantly destroyed.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-[#f8fbff] text-[#29AEE1] flex items-center justify-center font-bold border border-blue-100">2</div>
                                        <div>
                                            <h5 className="font-bold text-[#112E51] text-[15px] mb-1">Anonymous Transactions</h5>
                                            <p className="text-[14px] text-[#556987] leading-relaxed">We only store a random Session ID and payment status in our database to authorize the AI generation. No personal identifiers are saved alongside it.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-[#f8fbff] text-[#29AEE1] flex items-center justify-center font-bold border border-blue-100">3</div>
                                        <div>
                                            <h5 className="font-bold text-[#112E51] text-[15px] mb-1">Client-Side Ownership</h5>
                                            <p className="text-[14px] text-[#556987] leading-relaxed">The translated Korean resume data is delivered directly to your browser's local storage. Once you download the PDF and close the tab, it vanishes forever.</p>
                                        </div>
                                    </li>
                                </ul>

                                <button
                                    onClick={() => setShowPrivacyModal(false)}
                                    className="mt-8 w-full bg-[#29AEE1] hover:bg-[#1E95C3] text-white text-[15px] font-bold px-8 py-3.5 rounded-full transition-all shadow-md hover:-translate-y-0.5"
                                >
                                    I Understand
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
