import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from './ui/slider';
import { Info, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-neutral-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-5 text-left group"
            >
                <span className="font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="text-neutral-400 group-hover:text-blue-600" size={20} />
                ) : (
                    <ChevronDown className="text-neutral-400 group-hover:text-blue-600" size={20} />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function BonusCalculator() {
    // 0-100: Activity & Consistency Scale
    const [activityLevel, setActivityLevel] = useState([20]);
    const currentLevel = activityLevel[0];

    // Determine Status Conceptually
    let growthStage = "";
    let incentiveStatus = "";
    let returnLevel = ""; // qualitative range
    let stageColor = "";

    if (currentLevel < 35) {
        growthStage = "Ï¥àÍ∏∞ ÏßÑÏûÖ (Entry)";
        incentiveStatus = "ÎßàÏùº?§ÌÜ§ ?∏ÏÑº?∞Î∏å Í≤Ä???Ä??;
        returnLevel = "?±Ïû• Í≤©Î†§ (Start-up Benefits)";
        stageColor = "text-neutral-600 bg-neutral-100";
    } else if (currentLevel < 70) {
        growthStage = "?±Ïû• ?®Í≥Ñ (Growth)";
        incentiveStatus = "?±Í≥º Í∏∞Î∞ò ?∏ÏÑº?∞Î∏å Î≤îÏúÑ ÏßÑÏûÖ";
        returnLevel = "Ï§ëÏúÑÍ∂??òÏõê Î≤îÏúÑ (Standard Share)";
        stageColor = "text-blue-600 bg-blue-50";
    } else {
        growthStage = "ÏµúÏÉÅ???úÏÑ± (High Performance)";
        incentiveStatus = "?ÅÏúÑ ?òÏõê Íµ¨Í∞Ñ Î∞??åÌä∏?àÏã≠ ?ÅÏö©";
        returnLevel = "ÏµúÎ? ÎπÑÏú® ?òÏõê (Premium Share)";
        stageColor = "text-purple-600 bg-purple-50";
    }

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-neutral-50 text-neutral-900 border-t border-neutral-200">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-16 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-neutral-200"
                    >
                        <Activity size={14} />
                        Incentive Structure Guide
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight word-keep-half"
                    >
                        ?∏ÏÑº?∞Î∏å Íµ¨Ï°∞ ?¥Ìï¥?òÍ∏∞
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-600 text-lg leading-relaxed break-keep"
                    >
                        ???úÎ??àÏù¥?∞Îäî ?±Ïû• ?®Í≥Ñ???∞Îùº ?ÅÏö© Í∞Ä?•Ìïú<br />
                        ?∏ÏÑº?∞Î∏å Íµ¨Ï°∞Î•??¥Ìï¥?òÍ∏∞ ?ÑÌïú Í∞Ä?¥Îìú Í∞Ä?¥Îìú?ÖÎãà??
                    </motion.p>
                </div>

                {/* Simulator Card */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-200 shadow-xl mb-24">
                    <div className="space-y-12">
                        {/* Input Section */}
                        <div>
                            <div className="flex justify-between items-end mb-6">
                                <label className="text-sm font-medium text-neutral-700">?îÍ∞Ñ ?úÎèô ?òÏ? Î∞??±Ïû• ?ºÍ???/label>
                                <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${stageColor}`}>
                                    {growthStage}
                                </span>
                            </div>
                            <Slider
                                defaultValue={[20]}
                                max={100}
                                step={1}
                                value={activityLevel}
                                onValueChange={setActivityLevel}
                                className="py-4 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-neutral-400 font-medium px-1 uppercase tracking-widest mt-2">
                                <span>Entry</span>
                                <span>Growth</span>
                                <span>High Performance</span>
                            </div>
                        </div>

                        {/* Concept Visualization (Bar/Pie Chart Abstraction) */}
                        <div className="bg-neutral-50 rounded-2xl p-6 md:p-8 border border-neutral-100">
                            <h4 className="text-sm font-semibold mb-6 text-neutral-800">?àÏÉÅ ?∏ÏÑº?∞Î∏å Íµ¨Ï°∞ (Illustrative)</h4>

                            {/* Visual Bar without numbers */}
                            <div className="h-12 w-full flex rounded-lg overflow-hidden relative">
                                {/* Platform/Base Costs - Fixed-ish visual */}
                                <div className="h-full bg-neutral-200 w-[40%] flex items-center justify-center border-r border-white/50">
                                    <span className="text-[10px] md:text-xs font-medium text-neutral-500">?¥ÏòÅ Î∞?ÎπÑÏö©</span>
                                </div>

                                {/* Variable Incentive Share */}
                                <div className="h-full flex-1 bg-neutral-100 relative flex transition-all duration-500">
                                    {/* Creator Share - Grows with slider */}
                                    <motion.div
                                        className="h-full bg-blue-500/10 flex items-center justify-center border-r border-white/50"
                                        initial={false}
                                        animate={{ width: `${30 + (currentLevel * 0.4)}%` }} // Visual logic only
                                        transition={{ type: "spring", stiffness: 50 }}
                                    >
                                        <span className="text-[10px] md:text-xs font-bold text-blue-600 whitespace-nowrap px-2">
                                            ?¨Î¶¨?êÏù¥???òÏõê
                                        </span>
                                    </motion.div>

                                    {/* Agency Share - Shrinks/Adjusts */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <span className="text-[10px] md:text-xs font-medium text-neutral-400 whitespace-nowrap px-1">
                                            ?êÏù¥?ÑÏãú
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                    <Info size={10} />
                                    ?§Ï†ú ÎπÑÏ§ë?Ä ?îÍ∞Ñ ?±Í≥º Í≤Ä??Í≤∞Í≥º???∞Îùº ?¨ÎùºÏß????àÏäµ?àÎã§.
                                </span>
                            </div>
                        </div>

                        {/* Result Indicators */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                                <span className="text-xs font-medium text-neutral-400 mb-2 block uppercase tracking-wider">Incentive Status</span>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-blue-500" />
                                    <span className="font-semibold text-neutral-900 break-keep">{incentiveStatus}</span>
                                </div>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                                <span className="text-xs font-medium text-neutral-400 mb-2 block uppercase tracking-wider">Return Level</span>
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={18} className="text-purple-500" />
                                    <span className="font-medium text-neutral-900 break-keep">
                                        {returnLevel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Process & Disclaimer */}
                        <div className="border-t border-neutral-100 pt-8 mt-8">
                            <h4 className="text-sm font-semibold mb-4 text-neutral-800">?∏ÏÑº?∞Î∏å Í≤Ä???ÑÎ°ú?∏Ïä§</h4>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs text-neutral-500 mb-8">
                                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                                    <span className="block font-bold mb-1 text-neutral-800">1. ?±Í≥º Î¶¨Î∑∞</span>
                                    ?îÍ∞Ñ ?úÎèô Î∞??±Ïû• ÏßÄ??Ï¢ÖÌï© Í≤Ä??
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                                    <span className="block font-bold mb-1 text-neutral-800">2. ?àÏßà ?ïÏù∏</span>
                                    ÏΩòÌÖêÏ∏?Í±¥Ï†Ñ??Î∞??ïÏ±Ö Ï§Ä???¨Î?
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                                    <span className="block font-bold mb-1 text-neutral-800">3. ?ïÏ†ï ?àÎÇ¥</span>
                                    ÏßÄÍ∏??Ä???ïÏ†ï Î∞?Í∞úÎ≥Ñ ?µÏ?
                                </div>
                            </div>

                            <div className="flex items-start gap-2 bg-neutral-100/50 p-4 rounded-lg">
                                <ShieldCheck className="text-neutral-400 shrink-0 mt-0.5" size={16} />
                                <div className="space-y-1">
                                    <p className="text-xs text-neutral-500 leading-relaxed break-keep">
                                        Î≥??úÎ??àÏù¥?∞Îäî ?∏ÏÑº?∞Î∏å Íµ¨Ï°∞ ?¥Ìï¥Î•??ïÍ∏∞ ?ÑÌïú ?àÎÇ¥ ?ÑÍµ¨?ÖÎãà??
                                        ?§Ï†ú ?∏ÏÑº?∞Î∏å ÏßÄÍ∏??¨Î? Î∞?Î≤îÏúÑ???îÍ∞Ñ ?±Í≥º Î¶¨Î∑∞Î•??µÌï¥ ?ïÏ†ï?òÎ©∞,
                                        Íµ¨Ï≤¥?ÅÏù∏ ?òÏπò??Í∞úÎ≥Ñ ?àÎÇ¥?©Îãà??
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-8 text-center">?êÏ£º Î¨ªÎäî ÏßàÎ¨∏ (FAQ)</h3>
                    <div className="bg-white rounded-2xl border border-neutral-200 p-2 md:p-6">
                        <FAQItem
                            question="?∏ÏÑº?∞Î∏å???¥Îñ§ Í∏∞Ï??ºÎ°ú ÏßÄÍ∏âÎêò?òÏöî?"
                            answer="?ÑÏÑúÎ¶¨Ïïà?Ä ?¥Î? ?¨ÏÇ¨ Í∏∞Ï?(Î∞©ÏÜ°???±Ïã§?? ÏΩòÌÖêÏ∏?Í±¥Ï†Ñ?? ?±Í≥º ÏßÄ???????µÍ≥º???åÌä∏???¨Î¶¨?êÏù¥?∞ÏóêÍ≤??∏ÏÑº?∞Î∏åÎ•?ÏßÄÍ∏âÌï©?àÎã§. Íµ¨Ï≤¥?ÅÏù∏ ÏßÄÍ∏??îÍ±¥?Ä Í≥ÑÏïΩ Î∞??®Î≥¥??Í≥ºÏ†ï?êÏÑú ?ÅÏÑ∏???àÎÇ¥?úÎ¶Ω?àÎã§."
                        />
                        <FAQItem
                            question="ÏßÄ?êÍ∏à???¨Ïõê?Ä ?¥Îîî???òÏò§?òÏöî?"
                            answer="?¨Î¶¨?êÏù¥?∞Îãò???∞Ïàò??Î∞©ÏÜ° ?úÎèô?ºÎ°ú ?∏Ìï¥ ?êÏù¥?ÑÏãúÍ∞Ä ?¨ÏÑ±???±Í≥º ?òÏùµ???ºÎ?Î•??¨Î∂ÑÎ∞∞Ìïò??Íµ¨Ï°∞?ÖÎãà?? ?¥Îäî ?ÑÏÑúÎ¶¨Ïïà??ÏßÄ?•Ìïò??'?ôÎ∞ò ?±Ïû•' Ï≤†Ìïô???µÏã¨?ÖÎãà??"
                        />
                        <FAQItem
                            question="?±Í≥ºÍ∞Ä ??ïÑ??Î∂àÏù¥?µÏù¥ ?àÎÇò??"
                            answer="?ÑÎãà?? ?±Í≥ºÍ∞Ä Í∏∞Î???ÎØ∏ÏπòÏßÄ Î™ªÌïò?îÎùº??Î≥ÑÎèÑ??Î∂àÏù¥?µÏù¥???ÑÏïΩÍ∏àÏ? ?ÜÏäµ?àÎã§. ?§Ìûà???±Í≥ºÎ•?Í∞úÏÑ†?????àÎèÑÎ°?Îß§Îãà?ÄÍ∞Ä Ïª®ÏÑ§?ÖÍ≥º ?ºÎìúÎ∞±ÏùÑ ÏßÄ?êÌï¥ ?úÎ¶Ω?àÎã§."
                        />
                        <FAQItem
                            question="?ïÏÇ∞ ?¥Ïö©?Ä ?¨Î™Ö?òÍ≤å Í≥µÍ∞ú?òÎÇò??"
                            answer="Î¨ºÎ°†?ÖÎãà?? ÏßÄÍ∏âÎêò???∏ÏÑº?∞Î∏å???∞Ï†ï ?¥Ïó≠Í≥?ÏßÄÍ∏??úÍ∏∞???¨Î™Ö?òÍ≤å Í≥µÏú†?òÎ©∞, ?¨Î¶¨?êÏù¥?∞Îãò???∏Ï†ú??Î¨∏Ïùò?òÏã§ ???àÏäµ?àÎã§."
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
