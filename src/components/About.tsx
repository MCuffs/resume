import { useTranslation, Trans } from 'react-i18next';

export function About() {
  const { t } = useTranslation();
  const principles = t('home.about.items', { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200">
      <div className="max-w-6xl">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-16">
          {t('home.about.badge')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {principles.map((item, index) => (
            <div key={index} className="flex flex-col gap-6">
              <span className="text-4xl font-light text-neutral-300">0{index + 1}</span>
              <h3 className="text-xl font-medium tracking-tight">{item.title}</h3>
              <p className="text-neutral-600 leading-relaxed text-[15px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 max-w-2xl">
          <p className="text-2xl md:text-3xl font-medium leading-tight text-neutral-900 leading-relaxed">
            <Trans
              i18nKey="home.about.statement"
              components={{ b: <b className="text-neutral-400" />, br: <br /> }}
            />
          </p>
        </div>
      </div>
    </section>
  );
}
