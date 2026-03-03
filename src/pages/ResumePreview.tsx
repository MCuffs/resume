import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// Inner component: renders inside PayPalScriptProvider, waits for SDK to be ready
function PayPalButtonsWrapper({ onApprove, onError }: {
    onApprove: (orderId: string) => void;
    onError: (err: unknown) => void;
}) {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    if (isPending) {
        return (
            <div className="w-full h-12 bg-[#0070ba] rounded-lg flex items-center justify-center gap-2 animate-pulse">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white font-bold text-[15px]">Loading PayPal...</span>
            </div>
        );
    }

    if (isRejected) {
        return (
            <div className="w-full space-y-2">
                <div className="w-full h-12 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center px-4">
                    <span className="text-orange-700 font-bold text-[13px]">⚠️ PayPal widget failed to load.</span>
                </div>
                <button
                    onClick={() => window.open('https://www.paypal.com/checkoutnow', '_blank')}
                    className="w-full h-12 bg-[#0070ba] hover:bg-[#003087] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-[15px]"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M7.144 19.532l1.049-5.751c.11-.605-.119-.731-.614-.761L6 12.882l.321-1.826 4.614-.05c.88.029 1.15-.266 1.05-.916l-.368-2.4c-.3-1.993-1.52-2.59-3.7-2.59H5.18L3 17.712h4.144v1.82zm9.892-13.58l-.29 1.608c-.085.46.062.696.572.696h2.053c.695 0 1.194.14 1.498.415.305.274.426.703.363 1.285h-2.22c-.557 0-.958.148-1.2.446-.244.298-.298.72-.162 1.268l.567 2.214c.273 1.063 1.254 1.594 2.944 1.594h1.668l-.294 1.758H19.86c-2.48 0-4.054-1.127-4.724-3.38l-.577-2.125c-.343-1.268-.066-2.274.828-3.018.895-.744 2.11-1.116 3.649-1.116h1.4c.27 0 .5.042.688.127z" /></svg>
                    Pay $3.99 with PayPal
                </button>
            </div>
        );
    }

    return (
        <PayPalButtons
            style={{ layout: "horizontal", shape: "rect", color: "blue", height: 48, tagline: false }}
            createOrder={(_data, actions) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [{
                        description: "Premium Korean Resume Unlock",
                        amount: { currency_code: "USD", value: "3.99" }
                    }]
                });
            }}
            onApprove={async (data, actions) => {
                if (actions.order) {
                    await actions.order.capture();
                    onApprove(data.orderID);
                }
            }}
            onError={onError}
        />
    );
}

export function ResumePreview() {
    const [resumeData, setResumeData] = useState<any>(null);
    const [rawText, setRawText] = useState<string | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const parsedDataStr = localStorage.getItem('parsedResume');
            const rawTextStr = localStorage.getItem('rawResumeText');

            if (parsedDataStr) {
                // If the user clicked "View Demo", parsedResume is already injected.
                setResumeData(JSON.parse(parsedDataStr));
                // Optionally start unlocked, or keep locked for demo purposes.
                // Keeping it locked to demonstrate the lock screen
            } else if (rawTextStr) {
                // This is a real user upload. We have raw text, but no AI generated data yet.
                setRawText(rawTextStr);
            } else {
                // No data found, navigate back
                navigate('/');
            }
        } catch (e) {
            console.error(e);
            navigate('/');
        }
    }, [navigate]);

    // If neither demo data nor raw text is present, don't render.
    if (!resumeData && !rawText) return null;

    const processResumeGeneration = async (orderId?: string) => {
        if (resumeData) {
            // It's the demo data
            alert("Demo Resume Unlocked!");
            setIsUnlocked(true);
            return;
        }

        if (rawText) {
            setIsGenerating(true);
            setErrorMSG('');
            try {
                // Get the pending transaction sessionId from localStorage
                const sessionId = localStorage.getItem('sessionId');

                // Real usage: Hit the expensive AI endpoint NOW
                const response = await fetch('/api/generate-resume', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rawText, sessionId, orderId })
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to generate resume');
                }

                setResumeData(result.data);
                setIsUnlocked(true);
                // Clear raw text, optionally save parsed if needed
                localStorage.removeItem('rawResumeText');

            } catch (err: any) {
                console.error(err);
                setErrorMSG(err.message || 'Error occurred during AI Generation.');
            } finally {
                setIsGenerating(false);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Use dummy data to construct the blurred background if real data is not yet generated
    const displayData = resumeData || {
        personalInfo: { name: "Analyzing Profile...", email: "secure@vault.com", phone: "***-****-****" },
        education: [{ schoolName: "Analyzing Education History...", degree: "Loading...", major: "Loading...", period: "Loading...", status: "" }],
        experience: [{ companyName: "Extracting Professional Experience...", totalDuration: "", projects: [{ projectName: "AI is reviewing your projects...", period: "", role: "", achievements: ["Reviewing metrics...", "Extracting keywords..."] }] }],
        extracurricular: [], certifications: [], skills: ["Analyzing tech stack..."], keywords: ["AI Processing..."], selfIntroduction: "AI is currently structuring your professional profile to match Korean HR standards..."
    };

    const { personalInfo, education, experience, extracurricular, certifications, skills, keywords, selfIntroduction } = displayData;

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 p-6 pt-24 pb-32 font-sans print:p-0 print:bg-white print:pt-0">
            <div className="max-w-[850px] mx-auto flex flex-col items-center print:max-w-none print:w-full">

                {/* Header Actions - Hidden on Print */}
                <div className="w-full flex justify-between items-end mb-8 print:hidden">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Korean Resume Generated</h1>
                        <p className="text-slate-500 mt-2 font-medium text-lg">Below is your refined, modern corporate Korean resume.</p>
                    </div>
                    {isUnlocked && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-bold py-3 px-5 rounded-xl transition-all flex items-center gap-2 text-[14px]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Home
                            </button>
                            <button
                                onClick={handlePrint}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Download PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Resume Container */}
                <div className="w-full bg-white text-slate-900 px-10 py-16 sm:px-16 sm:py-20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 relative rounded-2xl print:shadow-none print:p-8 print:border-none print:w-full print:rounded-none">

                    {/* Dimmed Overlay if locked (Hidden on Print) */}
                    {!isUnlocked && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col justify-start items-center pt-64 rounded-2xl print:hidden">
                            <div className="bg-white border text-slate-900 border-slate-200 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4 mb-32 transform transition-all relative">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md border-4 border-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-2xl font-extrabold mb-2 mt-4 text-slate-900">Unlock Resume</h4>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                    {resumeData ? 'Your preview is ready! Click below to unlock the full resume.' : 'Your data has been processed. Complete payment below to unlock the full AI-translated resume.'}
                                </p>

                                {errorMSG && <p className="text-red-500 text-sm font-bold mb-4">{errorMSG}</p>}

                                {resumeData ? (
                                    <button
                                        onClick={() => processResumeGeneration()}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
                                    >
                                        Unlock Demo Resume (Free)
                                    </button>
                                ) : (
                                    isGenerating ? (
                                        <div className="w-full bg-[#f8fbff] border border-blue-100 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center space-y-4">
                                            <div className="relative w-12 h-12">
                                                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                                <div className="absolute inset-0 border-4 border-[#29AEE1] rounded-full border-t-transparent animate-spin"></div>
                                            </div>
                                            <div className="text-center">
                                                <h5 className="text-[#112E51] font-extrabold text-[17px] mb-1">Applying Korean HR Standards...</h5>
                                                <p className="text-[#556987] text-[13px] font-medium animate-pulse">This typically takes 10-30 seconds.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[14px] text-slate-400 font-semibold animate-pulse">↓ Complete payment in the bar below ↓</p>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resume Content (Modern Premium Layout) */}
                    <div className="space-y-14 font-sans tracking-tight">

                        {/* 1. Header & Personal Info */}
                        <div className="border-b-2 border-slate-900 pb-10">
                            <h1 className="text-[2.75rem] leading-none font-extrabold text-slate-900 mb-6">{personalInfo?.name}</h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-slate-600 font-medium text-[15px]">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {personalInfo?.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    {personalInfo?.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    {personalInfo?.birthYear} ({personalInfo?.gender})
                                </div>
                            </div>
                            {personalInfo?.address && (
                                <div className="flex items-center gap-2 mt-3 text-slate-500 text-[14px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {personalInfo.address}
                                </div>
                            )}
                        </div>

                        {/* 2. Summary */}
                        {personalInfo?.summary && (
                            <section>
                                <p className="text-[17px] leading-relaxed text-slate-700 font-medium">
                                    {personalInfo.summary}
                                </p>
                            </section>
                        )}

                        {/* 3. Skills & Keywords */}
                        {(skills && skills.length > 0) || (keywords && keywords.length > 0) ? (
                            <section>
                                <h3 className="text-[1.35rem] font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">역량 및 스킬</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {skills?.map((s: string, i: number) => (
                                        <span key={`s-${i}`} className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg text-[14px]">{s}</span>
                                    ))}
                                    {keywords?.map((k: string, i: number) => (
                                        <span key={`k-${i}`} className="bg-white text-slate-500 font-semibold px-4 py-2 rounded-lg text-[14px] border border-slate-200 shadow-sm">#{k}</span>
                                    ))}
                                </div>
                            </section>
                        ) : null}

                        {/* 4. Experience */}
                        {experience && experience.length > 0 && (
                            <section>
                                <h3 className="text-[1.35rem] font-bold text-slate-900 mb-8 pb-2 border-b border-slate-200">경력</h3>
                                <div className="space-y-12">
                                    {experience.map((exp: any, i: number) => (
                                        <div key={i} className="flex flex-col md:flex-row gap-8">
                                            {/* Left Column: Date & Company info */}
                                            <div className="md:w-[220px] shrink-0">
                                                <h4 className="text-xl font-bold text-slate-900 mb-1">{exp.companyName}</h4>
                                                <div className="text-slate-500 font-semibold text-[15px]">{exp.period}</div>
                                                <div className="text-slate-400 text-[14px] mt-1">{exp.totalDuration}</div>
                                            </div>
                                            {/* Right Column: Projects */}
                                            <div className="md:w-full space-y-8">
                                                {exp.projects?.map((proj: any, j: number) => (
                                                    <div key={j}>
                                                        <div className="font-bold text-[17px] text-slate-800 mb-1">{proj.projectName}</div>
                                                        <div className="text-slate-500 font-medium mb-3 text-[14px]">
                                                            {proj.period} <span className="mx-2 text-slate-300">|</span> <span className="text-blue-600 font-bold">{proj.role}</span>
                                                        </div>
                                                        <ul className="list-outside list-disc pl-4 text-[15px] leading-loose space-y-1 text-slate-700 marker:text-slate-300">
                                                            {proj.achievements?.map((ach: string, k: number) => (
                                                                <li key={k}>{ach}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 5. Education */}
                        {education && education.length > 0 && (
                            <section>
                                <h3 className="text-[1.35rem] font-bold text-slate-900 mb-8 pb-2 border-b border-slate-200">학력</h3>
                                <div className="space-y-8">
                                    {education.map((edu: any, i: number) => (
                                        <div key={i} className="flex flex-col md:flex-row gap-8">
                                            <div className="md:w-[220px] shrink-0">
                                                <div className="text-slate-500 font-semibold text-[15px]">{edu.period}</div>
                                                <div className="text-slate-400 text-[14px] mt-1">{edu.status}</div>
                                            </div>
                                            <div className="md:w-full">
                                                <div className="font-bold text-[17px] text-slate-900 mb-1">{edu.schoolName}</div>
                                                <div className="text-slate-600 text-[15px]">{edu.degree} · {edu.major}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 6. Extracurricular & Certifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                            {extracurricular && extracurricular.length > 0 && (
                                <section>
                                    <h3 className="text-[1.35rem] font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">대외활동</h3>
                                    <div className="space-y-6">
                                        {extracurricular.map((act: any, i: number) => (
                                            <div key={i}>
                                                <div className="font-bold text-[16px] text-slate-800">{act.title}</div>
                                                <div className="text-slate-500 text-[14px] font-medium my-1">{act.period}</div>
                                                <div className="text-slate-600 text-[15px] leading-relaxed">{act.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {certifications && certifications.length > 0 && (
                                <section>
                                    <h3 className="text-[1.35rem] font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">자격증</h3>
                                    <ul className="list-outside list-disc pl-4 text-[15px] leading-loose space-y-1 text-slate-800 marker:text-slate-300">
                                        {certifications.map((cert: string, i: number) => (
                                            <li key={i} className="font-medium">{cert}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* 7. Self Introduction Letter (Page Break before printing) */}
                        {selfIntroduction && (
                            <section className="pt-8 print:break-before-page">
                                <h3 className="text-[1.35rem] font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">자기소개서</h3>
                                <div className="text-[15.5px] leading-[2.1] text-slate-800 whitespace-pre-wrap text-justify">
                                    {selfIntroduction}
                                </div>
                            </section>
                        )}

                    </div>
                </div>
            </div>

            {/* Sticky PayPal Payment Bar - OUTSIDE blur overlay to avoid stacking context issues */}
            {!isUnlocked && !resumeData && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] print:hidden">
                    <div className="max-w-[600px] mx-auto px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-extrabold text-slate-900 text-[16px]">Unlock Korean Resume</p>
                                <p className="text-slate-500 text-[13px]">AI-generated, HR-compliant Korean format</p>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-[#29AEE1] text-[22px]">₩4,900</p>
                                <p className="text-slate-400 text-[12px]">≈ $3.99 USD</p>
                            </div>
                        </div>
                        {isGenerating ? (
                            <div className="w-full bg-[#f8fbff] border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                                <div className="relative w-8 h-8 shrink-0">
                                    <div className="absolute inset-0 border-3 border-blue-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-[#29AEE1] rounded-full border-t-transparent animate-spin"></div>
                                </div>
                                <div>
                                    <p className="text-[#112E51] font-extrabold text-[15px]">Applying Korean HR Standards...</p>
                                    <p className="text-[#556987] text-[12px] animate-pulse">This typically takes 10-30 seconds.</p>
                                </div>
                            </div>
                        ) : (
                            <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "USD", components: "buttons" }}>
                                <PayPalButtonsWrapper
                                    onApprove={(orderId) => processResumeGeneration(orderId)}
                                    onError={(err) => {
                                        console.error("PayPal Checkout onError", err);
                                        setErrorMSG("Payment failed. Please try again.");
                                    }}
                                />
                            </PayPalScriptProvider>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
