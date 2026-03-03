import { useState } from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Zap, BarChart3, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'creator' | 'brand';

export function BenefitPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('creator');

  return (
    <div className="bg-neutral-50 text-neutral-900 min-h-screen">
      <SEO
        title="Pricing & Fees"
        description="Transparent pricing and fee structure for creators and brands."
        url="/benefit"
      />

      {/* Header */}
      <section className="px-6 md:px-12 lg:px-24 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase mb-4">
            Pricing Structure
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            ?¬ëª…???˜ìµ êµ¬ì¡°?€ ë¹„ìš© ?•ì±…
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-12">
            ?¬ë¦¬?ì´?°ì—ê²ŒëŠ” ??ë§ì? ?˜ìµ?? ë¸Œëœ?œì—ê²ŒëŠ” ?©ë¦¬?ì¸ ë¹„ìš©???œì•ˆ?©ë‹ˆ??
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex bg-white p-1 rounded-full border border-neutral-200 shadow-sm relative">
            {(['creator', 'brand'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 ${activeTab === tab
                    ? 'text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                  }`}
              >
                {tab === 'creator' ? '?¬ë¦¬?ì´??(For Creator)' : 'ë¸Œëœ??(For Brand)'}
              </button>
            ))}
            {/* Sliding Background */}
            <motion.div
              className="absolute top-1 bottom-1 bg-neutral-900 rounded-full z-0"
              layoutId="activeTabBg"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                left: activeTab === 'creator' ? '4px' : '50%',
                width: 'calc(50% - 4px)',
                marginLeft: activeTab === 'brand' ? '0px' : '0'
              }}
            />
          </div>
        </div>
      </section>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'creator' ? (
          <motion.div
            key="creator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pb-24"
          >
            {/* Creator Fee Structure */}
            <section className="px-6 md:px-12 lg:px-24 pb-16">
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Platform Fee Card */}
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                    <BadgeCheck size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">?Œë«???´ìš©ë£?0??/h3>
                  <p className="text-neutral-600 mb-6">
                    ?„ì„œë¦¬ì•ˆ ?Œë«???±ë¡ ë°?ë§¤ì¹­ ?œì•ˆ?€ ë¬´ë£Œ?…ë‹ˆ?? ?‘ì—…???±ì‚¬?˜ê¸° ?„ê¹Œì§€???´ë– ??ë¹„ìš©??ë°œìƒ?˜ì? ?ŠìŠµ?ˆë‹¤.
                  </p>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-600">?±ë¡ë¹?/span>
                      <span className="font-bold text-green-600">0 KRW</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-neutral-600">??? ì?ë¹?/span>
                      <span className="font-bold text-green-600">0 KRW</span>
                    </div>
                  </div>
                </div>

                {/* Agency Fee Card */}
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">ë§¤ì¹­ ?˜ìˆ˜ë£?10%</h3>
                  <p className="text-neutral-600 mb-6">
                    ë¸Œëœ?œì? ?‘ì—…???±ì‚¬?˜ì—ˆ???Œë§Œ, ê³„ì•½ ê¸ˆì•¡??10%ë¥??˜ìˆ˜ë£Œë¡œ ì±…ì •?©ë‹ˆ?? ?…ê³„ ìµœì? ?˜ì??…ë‹ˆ??
                  </p>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-600">?˜ìµ ?ì–´</span>
                      <span className="font-bold text-neutral-900">90% (Creator)</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Estimated Earnings Table */}
            <section className="px-6 md:px-12 lg:px-24 pb-24">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-center">?Œë«?¼ë³„ ?ˆìƒ ?˜ìµ ?¨ê???/h2>
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-500">?Œë«??/th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-500">?¨ìœ„</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-500">?ˆìƒ ?¨ê? (Micro)</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-500">?ˆìƒ ?¨ê? (Macro)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      <tr className="group hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">TikTok</td>
                        <td className="px-6 py-4 text-neutral-600">Per Video</td>
                        <td className="px-6 py-4 text-neutral-900">??0,000 ~</td>
                        <td className="px-6 py-4 text-neutral-900">??00,000 ~</td>
                      </tr>
                      <tr className="group hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">YouTube</td>
                        <td className="px-6 py-4 text-neutral-600">Per Video (Branded)</td>
                        <td className="px-6 py-4 text-neutral-900">??50,000 ~</td>
                        <td className="px-6 py-4 text-neutral-900">??,000,000 ~</td>
                      </tr>
                      <tr className="group hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">Threads</td>
                        <td className="px-6 py-4 text-neutral-600">Per Thread</td>
                        <td className="px-6 py-4 text-neutral-900">??0,000 ~</td>
                        <td className="px-6 py-4 text-neutral-900">??00,000 ~</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-neutral-500 mt-4 text-center">
                  * ???¨ê????‰ê· ?ì¸ ?˜ì¹˜?´ë©°, ?”ë¡œ???? ì°¸ì—¬?? ì½˜í…ì¸??„ë¦¬?°ì— ?°ë¼ ?ì´?????ˆìŠµ?ˆë‹¤.
                </p>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="brand"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pb-24"
          >
            {/* Brand Fee Structure */}
            <section className="px-6 md:px-12 lg:px-24 pb-16">
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Connection Fee Card */}
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">?œë¹„???´ìš©ë£?/h3>
                  <p className="text-neutral-600 mb-6">
                    ë³µì¡???€???ˆì°¨ ?†ì´, ?°ì´??ê¸°ë°˜ ë§¤ì¹­ê³??±ê³¼ ë¶„ì„???¬í•¨???¬ì¸???œë¹„?¤ë? ?œê³µ?©ë‹ˆ??
                  </p>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-600">Standard</span>
                      <span className="font-bold text-neutral-900">ìº í˜???ˆì‚°??15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-neutral-600">Enterprise</span>
                      <span className="font-bold text-neutral-900">ë³„ë„ ?‘ì˜</span>
                    </div>
                  </div>
                </div>

                {/* Guarantee Card */}
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                    <HelpCircle size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">?±ê³¼ ë³´ì¥??/h3>
                  <p className="text-neutral-600 mb-6">
                    ?½ì†??ì¡°íšŒ?˜ë‚˜ ?„ë‹¬ ë²”ìœ„??ë¯¸ì¹˜ì§€ ëª»í•  ê²½ìš°, ì¶”ê? ì½˜í…ì¸??œì‘?´ë‚˜ ë³´ìƒ ê´‘ê³ ë¥??µí•´ ?±ê³¼ë¥?ë³´ì¥???œë¦½?ˆë‹¤.
                  </p>
                  <div className="bg-neutral-50 p-4 rounded-xl flex items-center gap-3">
                    <BadgeCheck className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-neutral-900">?ˆì „??ROI ë³´ì¥</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Brand Pricing Table */}
            <section className="px-6 md:px-12 lg:px-24 pb-24">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-center">ë¸Œëœ??ìº í˜???ˆìƒ ê²¬ì </h2>
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-500">?¨í‚¤ì§€</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-500">êµ¬ì„±</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-500">?ˆìƒ ë¹„ìš©</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      <tr className="group hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">Starter Pack</td>
                        <td className="px-6 py-4 text-neutral-600">Micro ?¸í”Œë£¨ì–¸??5ëª?(TikTok/Threads)</td>
                        <td className="px-6 py-4 text-neutral-900">??00,000 ~</td>
                      </tr>
                      <tr className="group hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">Growth Pack</td>
                        <td className="px-6 py-4 text-neutral-600">Macro ? íŠœë²?1ëª?+ Micro 10ëª?/td>
                        <td className="px-6 py-4 text-neutral-900">??,000,000 ~</td>
                      </tr>
                      <tr className="group hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">Viral Pack</td>
                        <td className="px-6 py-4 text-neutral-600">ì±Œë¦°ì§€ ê¸°íš + Mega ?¸í”Œë£¨ì–¸??ì°¸ì—¬</td>
                        <td className="px-6 py-4 text-neutral-900">??,000,000 ~</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="px-6 md:px-12 lg:px-24 py-16 bg-neutral-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">?©ë¦¬?ì¸ ë¹„ìš©?¼ë¡œ ?œì‘?˜ì„¸??/h2>
          <div className="flex gap-4 justify-center">
            <Link to="/#creator-application" className="px-8 py-3 bg-white text-neutral-900 rounded-lg font-bold hover:bg-neutral-100 transition-colors">
              ?¬ë¦¬?ì´???œì‘?˜ê¸°
            </Link>
            <Link to="/brand" className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors">
              ë¸Œëœ??ë¬¸ì˜?˜ê¸°
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
