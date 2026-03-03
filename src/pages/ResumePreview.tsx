import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

type ResumeData = {
    personalInfo: {
        name: string;
        gender: string;
        birthYear: string;
        phone: string;
        email: string;
        address: string;
        summary: string;
    };
    education: Array<{
        schoolName: string;
        degree: string;
        major: string;
        period: string;
        status: string;
    }>;
    experience: Array<{
        companyName: string;
        period: string;
        totalDuration: string;
        projects: Array<{
            projectName: string;
            period: string;
            role: string;
            achievements: string[];
        }>;
    }>;
    extracurricular: Array<{
        title: string;
        period: string;
        description: string;
    }>;
    certifications: string[];
    skills: string[];
    keywords: string[];
    selfIntroduction: string;
};

const RESUME_PLACEHOLDER: ResumeData = {
    personalInfo: {
        name: "Analyzing Profile...",
        gender: "",
        birthYear: "",
        phone: "***-****-****",
        email: "secure@vault.com",
        address: "",
        summary: "",
    },
    education: [
        {
            schoolName: "Analyzing Education History...",
            degree: "Loading...",
            major: "Loading...",
            period: "Loading...",
            status: "",
        },
    ],
    experience: [
        {
            companyName: "Extracting Professional Experience...",
            period: "",
            totalDuration: "",
            projects: [
                {
                    projectName: "AI is reviewing your projects...",
                    period: "",
                    role: "",
                    achievements: ["Reviewing metrics...", "Extracting keywords..."],
                },
            ],
        },
    ],
    extracurricular: [],
    certifications: [],
    skills: ["Analyzing tech stack..."],
    keywords: ["AI Processing..."],
    selfIntroduction: "AI is currently structuring your professional profile to match Korean HR standards...",
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toText(value: unknown, fallback = ''): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return fallback;
}

function toTextArray(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map((item) => toText(item).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value
            .split(/\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

function toRecordArray(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) return value.filter(isRecord);
    if (isRecord(value)) return [value];
    return [];
}

function normalizeResumeData(raw: unknown): ResumeData {
    const source = isRecord(raw) ? raw : {};
    const personalInfoRaw = isRecord(source.personalInfo) ? source.personalInfo : {};

    return {
        personalInfo: {
            name: toText(personalInfoRaw.name, ''),
            gender: toText(personalInfoRaw.gender, ''),
            birthYear: toText(personalInfoRaw.birthYear, ''),
            phone: toText(personalInfoRaw.phone, ''),
            email: toText(personalInfoRaw.email, ''),
            address: toText(personalInfoRaw.address, ''),
            summary: toText(personalInfoRaw.summary, ''),
        },
        education: toRecordArray(source.education).map((item) => ({
            schoolName: toText(item.schoolName, ''),
            degree: toText(item.degree, ''),
            major: toText(item.major, ''),
            period: toText(item.period, ''),
            status: toText(item.status, ''),
        })),
        experience: toRecordArray(source.experience).map((exp) => ({
            companyName: toText(exp.companyName, ''),
            period: toText(exp.period, ''),
            totalDuration: toText(exp.totalDuration, ''),
            projects: toRecordArray(exp.projects).map((project) => ({
                projectName: toText(project.projectName, ''),
                period: toText(project.period, ''),
                role: toText(project.role, ''),
                achievements: toTextArray(project.achievements),
            })),
        })),
        extracurricular: toRecordArray(source.extracurricular).map((activity) => ({
            title: toText(activity.title, ''),
            period: toText(activity.period, ''),
            description: toText(activity.description, ''),
        })),
        certifications: toTextArray(source.certifications),
        skills: toTextArray(source.skills),
        keywords: toTextArray(source.keywords),
        selfIntroduction: toText(source.selfIntroduction, ''),
    };
}

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

function sanitizePayPalClientId(value: unknown): string {
    return String(value || 'test').replace(/\s+/g, '').trim();
}

export function ResumePreview() {
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [rawText, setRawText] = useState<string | null>(null);
    const [initState, setInitState] = useState<'checking' | 'ready' | 'missing'>('checking');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const [generationMeta, setGenerationMeta] = useState<{ model?: string; attempt?: number } | null>(null);
    const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
    const [feedbackIssues, setFeedbackIssues] = useState<string[]>([]);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');
    const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
    const [awaitingDownloadConfirm, setAwaitingDownloadConfirm] = useState(false);
    const [showDownloadConfirmPrompt, setShowDownloadConfirmPrompt] = useState(false);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [countdownSeconds, setCountdownSeconds] = useState(0);
    const feedbackRevealTimerRef = useRef<number | null>(null);
    const feedbackCountdownIntervalRef = useRef<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const parsedDataStr = localStorage.getItem('parsedResume');
            const rawTextStr = localStorage.getItem('rawResumeText');

            if (parsedDataStr) {
                // If the user clicked "View Demo", parsedResume is already injected.
                setResumeData(normalizeResumeData(JSON.parse(parsedDataStr)));
                setInitState('ready');
                // Optionally start unlocked, or keep locked for demo purposes.
                // Keeping it locked to demonstrate the lock screen
            } else if (rawTextStr) {
                // This is a real user upload. We have raw text, but no AI generated data yet.
                setRawText(rawTextStr);
                setInitState('ready');
            } else {
                // No data found, navigate back and show fallback (prevents white screen)
                setInitState('missing');
                navigate('/', { replace: true });
            }
        } catch (e) {
            console.error(e);
            setInitState('missing');
            navigate('/', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (feedbackRevealTimerRef.current) {
                window.clearTimeout(feedbackRevealTimerRef.current);
            }
            if (feedbackCountdownIntervalRef.current) {
                window.clearInterval(feedbackCountdownIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const onAfterPrint = () => {
            if (awaitingDownloadConfirm) {
                setAwaitingDownloadConfirm(false);
                setShowDownloadConfirmPrompt(true);
            }
        };

        window.addEventListener('afterprint', onAfterPrint);
        return () => {
            window.removeEventListener('afterprint', onAfterPrint);
        };
    }, [awaitingDownloadConfirm]);

    if (initState === 'checking') {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6">
                <div className="text-slate-600 text-sm font-semibold">Preparing preview...</div>
            </div>
        );
    }

    if (initState === 'missing') {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full text-center shadow-sm">
                    <h2 className="text-slate-900 font-extrabold text-xl mb-2">No resume session found</h2>
                    <p className="text-slate-500 text-sm mb-5">Please upload your PDF on the home page first.</p>
                    <button
                        onClick={() => navigate('/', { replace: true })}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

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

                const raw = await response.text();
                let result: any = null;
                try {
                    result = raw ? JSON.parse(raw) : null;
                } catch {
                    result = null;
                }

                if (!response.ok) {
                    throw new Error(
                        result?.error ||
                        (raw && raw.length < 300 ? raw : '') ||
                        'Failed to generate resume'
                    );
                }

                setResumeData(normalizeResumeData(result.data));
                setGenerationMeta(result.meta || null);
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

    const clearFeedbackTimers = () => {
        if (feedbackRevealTimerRef.current) {
            window.clearTimeout(feedbackRevealTimerRef.current);
            feedbackRevealTimerRef.current = null;
        }
        if (feedbackCountdownIntervalRef.current) {
            window.clearInterval(feedbackCountdownIntervalRef.current);
            feedbackCountdownIntervalRef.current = null;
        }
    };

    const startFeedbackCountdown = () => {
        clearFeedbackTimers();
        setShowDownloadConfirmPrompt(false);
        setShowFeedbackPrompt(false);
        setIsCountdownActive(true);
        setCountdownSeconds(7);

        feedbackCountdownIntervalRef.current = window.setInterval(() => {
            setCountdownSeconds((prev) => {
                if (prev <= 1) {
                    if (feedbackCountdownIntervalRef.current) {
                        window.clearInterval(feedbackCountdownIntervalRef.current);
                        feedbackCountdownIntervalRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        feedbackRevealTimerRef.current = window.setTimeout(() => {
            clearFeedbackTimers();
            setIsCountdownActive(false);
            setShowFeedbackPrompt(true);
        }, 7000);
    };

    const handlePrint = () => {
        clearFeedbackTimers();
        setShowFeedbackPrompt(false);
        setShowDownloadConfirmPrompt(false);
        setIsCountdownActive(false);
        setCountdownSeconds(0);
        setAwaitingDownloadConfirm(true);
        window.print();
    };

    const toggleFeedbackIssue = (issue: string) => {
        setFeedbackIssues((prev) => {
            if (prev.includes(issue)) return prev.filter((x) => x !== issue);
            if (prev.length >= 5) return prev;
            return [...prev, issue];
        });
    };

    const submitFeedback = async () => {
        if (!feedbackRating) {
            setFeedbackError('Please select a rating first.');
            return;
        }

        setFeedbackSubmitting(true);
        setFeedbackError('');
        try {
            const sessionId = localStorage.getItem('sessionId');
            const response = await fetch('/api/resume-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formType: 'ResumeFeedback',
                    rating: feedbackRating,
                    issues: feedbackIssues,
                    comment: feedbackComment,
                    sessionId,
                    generationModel: generationMeta?.model,
                    generationAttempt: generationMeta?.attempt
                })
            });
            const raw = await response.text();
            let result: any = null;
            try {
                result = raw ? JSON.parse(raw) : null;
            } catch {
                result = null;
            }

            if (!response.ok || !result?.ok) {
                const message =
                    result?.error ||
                    (raw && raw.length < 300 ? raw : '') ||
                    'Failed to submit feedback';
                throw new Error(message);
            }
            setFeedbackSubmitted(true);
            window.setTimeout(() => {
                navigate('/', { replace: true });
            }, 1200);
        } catch (err: any) {
            setFeedbackError(err.message || 'Failed to submit feedback');
        } finally {
            setFeedbackSubmitting(false);
        }
    };

    // Use placeholder data to construct the blurred background if real data is not yet generated
    const displayData = resumeData || RESUME_PLACEHOLDER;

    const { personalInfo, education, experience, extracurricular, certifications, skills, keywords, selfIntroduction } = displayData;
    const paypalClientId = sanitizePayPalClientId(import.meta.env.VITE_PAYPAL_CLIENT_ID);

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
                            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD", components: "buttons" }}>
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

            {isUnlocked && showDownloadConfirmPrompt && !showFeedbackPrompt && (
                <div className="fixed inset-0 z-[71] bg-slate-900/45 backdrop-blur-sm print:hidden p-4 flex items-center justify-center">
                    <div className="w-full max-w-[520px] bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl">
                        <p className="text-slate-900 font-extrabold text-xl mb-2">Did the PDF download complete?</p>
                        <p className="text-slate-500 text-sm mb-5">Continue to feedback only after the file is saved.</p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={startFeedbackCountdown}
                                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold"
                            >
                                Yes, downloaded
                            </button>
                            <button
                                onClick={() => {
                                    setShowDownloadConfirmPrompt(false);
                                    setAwaitingDownloadConfirm(false);
                                }}
                                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold"
                            >
                                Not yet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isUnlocked && showFeedbackPrompt && (
                <div className="fixed inset-0 z-[70] bg-slate-900/45 backdrop-blur-sm print:hidden p-4 flex items-center justify-center">
                    <div className="w-full max-w-[980px] bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl">
                        <p className="text-slate-900 font-extrabold text-[28px] mb-2">How was this resume output?</p>
                        <p className="text-slate-500 text-[14px] mb-5">Thanks for downloading. Submit quick feedback and we will take you back to Home.</p>

                        {feedbackSubmitted ? (
                            <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 text-[14px] font-semibold">
                                Thank you. Your feedback was saved. Redirecting to Home...
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setFeedbackRating(r)}
                                            className={`px-3 py-2 rounded-lg text-[13px] font-bold border ${feedbackRating === r
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                                                }`}
                                        >
                                            {r} / 5
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {[
                                        ['tone', 'Tone mismatch'],
                                        ['accuracy', 'Not accurate'],
                                        ['missing_keywords', 'Missing keywords'],
                                        ['format', 'Format issue'],
                                        ['too_generic', 'Too generic'],
                                        ['grammar', 'Grammar awkward'],
                                        ['other', 'Other'],
                                    ].map(([value, label]) => (
                                        <button
                                            key={value}
                                            onClick={() => toggleFeedbackIssue(value)}
                                            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border ${feedbackIssues.includes(value)
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white text-slate-600 border-slate-300'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    placeholder="Optional: tell us what should be improved."
                                    className="w-full min-h-[110px] border border-slate-300 rounded-xl px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />

                                {feedbackError && <p className="text-red-500 text-[12px] font-semibold">{feedbackError}</p>}

                                <button
                                    onClick={submitFeedback}
                                    disabled={feedbackSubmitting}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[13px] font-bold disabled:opacity-60"
                                >
                                    {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isUnlocked && isCountdownActive && !showFeedbackPrompt && !showDownloadConfirmPrompt && (
                <div className="fixed inset-0 z-[69] bg-slate-900/35 backdrop-blur-[2px] print:hidden p-4 flex items-center justify-center">
                    <div className="bg-white border border-slate-200 rounded-2xl px-8 py-7 text-center shadow-2xl">
                        <p className="text-slate-900 font-extrabold text-2xl mb-2">Moving to feedback</p>
                        <p className="text-slate-500 text-sm mb-4">Please share quick feedback after download.</p>
                        <div className="text-blue-600 font-black text-4xl leading-none">{countdownSeconds}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
