import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { SERIES_SLOTS, type SeriesSlot } from '../data/series';

const CATEGORIES: Array<SeriesSlot['category'] | 'All'> = ['All', 'Tech', 'Beauty', 'Lifestyle', 'Food', 'Education', 'Finance', 'Other'];

export function SeriesHubPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return SERIES_SLOTS.filter((s) => {
      const matchesCat = cat === 'All' || s.category === cat;
      const hay =
        `${s.creatorName} ${s.creatorHandle} ${s.category} ${s.format} ${s.audienceNotes} ${s.sponsorGets.join(' ')}`.toLowerCase();
      const matchesQ = !query || hay.includes(query);
      return matchesCat && matchesQ;
    });
  }, [q, cat]);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <SEO
        title="Series Sponsorship"
        description="Buy recurring sponsor slots on Threads creator series. Not a one-off ad. A repeatable inventory."
        keywords={['Threads', '스폰서십', '연재', '크리에이터 협업', '브랜드 스레드']}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            Series Sponsorship
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-neutral-900">
            한 번이 아니라, 연재를 스폰서하세요.
          </h1>
          <p className="mt-6 text-lg text-neutral-500 font-light leading-relaxed">
            기존 매칭 플랫폼이 “캠페인”을 팔 때, 우리는 “인벤토리”를 팝니다.
            <br />
            매주 고정 코너(Series)의 스폰서 슬롯을 구매해 반복 노출과 브랜드 문맥을 쌓습니다.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-col sm:flex-row">
            <button
              onClick={() => navigate('/apply/brand')}
              className="inline-flex items-center justify-center px-8 py-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-colors"
            >
              스폰서십 문의하기 <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
            <NavLink
              to="/apply/creator"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border border-neutral-200 text-neutral-900 rounded-2xl font-bold text-sm hover:bg-neutral-50 transition-colors"
            >
              내 연재 등록하기
            </NavLink>
          </div>
        </div>

        <div className="sticky top-24 bg-white/85 backdrop-blur-md border border-neutral-100 shadow-sm rounded-2xl p-4 z-20">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search creators, format, audience..."
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end w-full">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={[
                    'px-4 py-2 rounded-full text-xs font-bold border transition-colors',
                    cat === c ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50',
                  ].join(' ')}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-4xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((s) => (
              <motion.div
                key={s.slug}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group"
              >
                <NavLink
                  to={`/series/${s.slug}`}
                  className="flex items-center gap-4 p-6 bg-white border border-neutral-100 rounded-2xl hover:border-neutral-300 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    {s.avatarUrl ? <img src={s.avatarUrl} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-neutral-900 truncate">{s.creatorName}</div>
                      <div className="text-sm text-neutral-500 font-medium truncate">{s.creatorHandle}</div>
                      <span className="ml-auto inline-flex items-center px-2 py-1 rounded-md bg-neutral-100 text-[10px] font-bold text-neutral-700">
                        {s.category}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      <span className="font-bold text-neutral-900">{s.cadence}</span> · {s.format}
                      <span className="text-neutral-400"> · </span>
                      {s.audienceNotes}
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold">
                        {s.startingPriceNote}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-[10px] font-bold text-neutral-700">
                        {s.availability}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white transition-colors shrink-0">
                    <ArrowUpRight size={16} />
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
              <p className="text-lg text-neutral-500">No series found.</p>
              <button onClick={() => { setQ(''); setCat('All'); }} className="mt-3 text-neutral-900 underline underline-offset-4">
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

