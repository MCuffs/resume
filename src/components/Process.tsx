export function Process() {
  const steps = [
    {
      number: "01",
      title: "Channel Building",
      description: "Establishing presence and systems from zero"
    },
    {
      number: "02",
      title: "Creator Development",
      description: "Training and nurturing talent for long-term growth"
    },
    {
      number: "03",
      title: "Brand Collaboration",
      description: "Connecting creators with aligned partnerships"
    },
    {
      number: "04",
      title: "Ongoing Growth",
      description: "Sustained development beyond initial success"
    }
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200">
      <div className="max-w-5xl">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-16">
          What We Do
        </h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-y-20">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="text-xs text-neutral-400 mb-3">{step.number}</div>
              <h3 className="text-xl md:text-2xl mb-3">{step.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
