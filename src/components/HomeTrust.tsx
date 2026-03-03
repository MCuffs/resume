export function HomeTrust() {
    return (
        <section className="px-6 md:px-12 lg:px-24 py-24 border-t border-dashed border-neutral-200">
            <div className="max-w-[1400px] mx-auto text-center">
                <p className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-8">Trusted by Market Leaders</p>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Logos - In a real app, use SVGs */}
                    {['SAMSUNG', 'LG Household', 'AMORE PACIFIC', 'CJ ENM', 'MUSINSA'].map((brand, i) => (
                        <div key={i} className="text-xl md:text-2xl font-bold font-serif text-neutral-800 flex items-center">
                            {brand}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
