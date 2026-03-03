import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { BrandApplication } from '../components/BrandApplication';

export function BrandPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-neutral-50 text-neutral-900">
      <SEO
        title="Brand Collaboration"
        description="ë¸Œëžœ?œì? ?¬ë¦¬?ì´?°ë? ê°€???ì—°?¤ëŸ½ê²??°ê²°?©ë‹ˆ?? ?±ê³¼ê°€ ì§€?ë˜???‘ì—…??ì§€?¥í•©?ˆë‹¤."
        url="/brand"
      />
      <section className="px-6 md:px-12 lg:px-24 py-24 border-b border-neutral-200">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-wider text-neutral-500 mb-6">
            {t('brand.collab')}
          </p>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">
            {t('brand.title')}
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 max-w-2xl">
            {t('brand.desc')}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-24 bg-white border-b border-neutral-200">
        <div className="max-w-5xl grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="text-xl font-medium mb-3">{t('brand.features.matching.title')}</h2>
            <p className="text-neutral-600">
              {t('brand.features.matching.desc')}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium mb-3">{t('brand.features.performance.title')}</h2>
            <p className="text-neutral-600">
              {t('brand.features.performance.desc')}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium mb-3">{t('brand.features.partnership.title')}</h2>
            <p className="text-neutral-600">
              {t('brand.features.partnership.desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-24">
        <div className="max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-medium mb-6">
            {t('brand.offering.title')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
                {t('brand.offering.brands.label')}
              </p>
              <p className="text-neutral-700">
                {t('brand.offering.brands.desc')}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
                {t('brand.offering.creators.label')}
              </p>
              <p className="text-neutral-700">
                {t('brand.offering.creators.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <BrandApplication />
    </div>
  );
}
