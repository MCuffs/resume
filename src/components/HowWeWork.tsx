import { useTranslation } from 'react-i18next';

export function HowWeWork() {
  const { t } = useTranslation();
  const principles = t('home.howWeWork.principles', { returnObjects: true }) as string[];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200">
      <div className="max-w-4xl">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-12">
          {t('home.howWeWork.badge')}
        </h2>
        <div className="space-y-8">
          {principles.map((principle, index) => (
            <p key={index} className="text-lg md:text-xl lg:text-2xl text-neutral-700">
              {principle}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
