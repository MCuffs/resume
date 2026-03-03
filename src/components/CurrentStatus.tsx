export function CurrentStatus() {
  const statusItems = [
    { label: 'Creator applications', status: 'Open' },
    { label: 'Brand partnerships', status: 'Selective' },
    { label: 'New channels', status: 'In progress' }
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 border-t border-neutral-200 bg-white">
      <div className="max-w-5xl">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-12">
          Current Status
        </h2>
        <div className="space-y-6">
          {statusItems.map((item, index) => (
            <div key={index} className="flex justify-between items-baseline border-b border-neutral-200 pb-4">
              <span className="text-lg md:text-xl text-neutral-700">{item.label}</span>
              <span className="text-lg md:text-xl text-neutral-900">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
