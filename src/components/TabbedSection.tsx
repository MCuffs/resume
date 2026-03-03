
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'creators' | 'brands' | 'studio';

export function TabbedSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('creators');

  const tabContent = {
    creators: {
      title: t('tabs.creators.title'),
      items: [
        t('tabs.creators.items.0'),
        t('tabs.creators.items.1'),
        t('tabs.creators.items.2')
      ]
    },
    brands: {
      title: t('tabs.brands.title'),
      items: [
        t('tabs.brands.items.0'),
        t('tabs.brands.items.1'),
        t('tabs.brands.items.2')
      ]
    },
    studio: {
      title: t('tabs.studio.title'),
      items: [
        t('tabs.studio.items.0'),
        t('tabs.studio.items.1'),
        t('tabs.studio.items.2')
      ]
    }
  };

  const influencers = [
    {
      name: 'Arthur',
      role: 'Lifestyle Creator',
      image: '/influencers/KakaoTalk_20260125_204145544.jpg',
      isPlaceholder: false
    },
    {
      name: t('tabs.influencers.next.name'),
      role: t('tabs.influencers.next.role'),
      image: '',
      isPlaceholder: true
    },
    {
      name: t('tabs.influencers.next.name'),
      role: t('tabs.influencers.next.role'),
      image: '',
      isPlaceholder: true
    }
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200">
      <div className="max-w-5xl">
        <div className="flex gap-8 mb-16 border-b border-neutral-200">
          {(Object.keys(tabContent) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg md:text-xl transition-colors relative ${activeTab === tab
                ? 'text-neutral-900 font-medium'
                : 'text-neutral-400 hover:text-neutral-600'
                }`}
            >
              {tabContent[tab].title}
              {activeTab === tab && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {tabContent[activeTab].items.map((item, index) => (
                <div key={index} className="text-lg md:text-xl text-neutral-700 flex items-start gap-3">
                  <span className="text-neutral-400 font-light select-none mt-2.5 w-1.5 h-1.5 rounded-full bg-neutral-300 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-20">
          <div className="text-sm uppercase tracking-wider text-neutral-500 mb-6">
            {t('tabs.influencers.title')}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {influencers.map((influencer, index) => (
              <div
                key={`${influencer.name}-${index}`}
                className="rounded-3xl border border-neutral-200 bg-white p-4"
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
                  {influencer.isPlaceholder ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400">
                      <div className="text-xl font-medium">
                        {influencer.name}
                      </div>
                      <div className="text-sm uppercase tracking-widest">
                        {influencer.role}
                      </div>
                    </div>
                  ) : (
                    <ImageWithFallback
                      src={influencer.image}
                      alt={influencer.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-lg font-medium text-neutral-900">
                    {influencer.name}
                  </div>
                  <div className="text-sm text-neutral-500">{influencer.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
