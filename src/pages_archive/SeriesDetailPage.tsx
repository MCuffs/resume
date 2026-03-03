import { useMemo } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Calendar, Check, Tag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { SERIES_SLOTS } from '../data/series';

export function SeriesDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const slot = useMemo(() => SERIES_SLOTS.find((s) => s.slug === slug), [slug]);

  if (!slot) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 px-6">
        <SEO title="Series Not Found" description="Series slot not found." />
        <div className="max-w-3xl mx-auto">
          <NavLink to="/series" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900">
            <ArrowLeft className="w-4 h-4" /> Back to Series
          </NavLink>
          <div className="mt-10 text-neutral-500">Not found.</div>
        </div>
      </div>
    );
  }

  const sponsorPrefill =
    `Series Sponsorship Inquiry\n` +
    `- Series: ${slot.creatorName} (${slot.creatorHandle}) / ${slot.slug}\n` +
    `- Cadence: ${slot.cadence}\n` +
    `- Format: ${slot.format}\n` +
    `- Availability: ${slot.availability}\n` +
    `\n` +
    `What we want:\n` +
    `- 목표(브랜딩/유입/전환): \n` +
    `- 제품/서비스: \n` +
    `- 예산/기간: \n` +
    `- 꼭 포함할 메시지: \n` +
    `- 금지 요소/주의사항: \n`;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6">
      <SEO
        title={`${slot.creatorName} Series Sponsorship`}
        description={`Sponsor ${slot.creatorName}'s recurring Threads series. ${slot.cadence} · ${slot.format}`}
      />

      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
          <NavLink to="/series" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900">
            <ArrowLeft className="w-4 h-4" /> Back to Series
          </NavLink>
          <div className="text-xs font-bold text-neutral-500">Opt-in inventory, not a one-off campaign.</div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                {slot.avatarUrl ? <img src={slot.avatarUrl} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 truncate">{slot.creatorName}</h1>
                <div className="text-neutral-500 font-medium truncate">{slot.creatorHandle}</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-neutral-100 py-6">
              <div>
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-wide flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Category
                </div>
                <div className="mt-2 font-bold text-neutral-900">{slot.category}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Cadence
                </div>
                <div className="mt-2 font-bold text-neutral-900">{slot.cadence}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-wide">Availability</div>
                <div className="mt-2 font-bold text-neutral-900">{slot.availability}</div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-neutral-900">Format</h2>
              <p className="mt-3 text-neutral-600 leading-relaxed">{slot.format}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-neutral-900">Audience</h2>
              <p className="mt-3 text-neutral-600 leading-relaxed">{slot.audienceNotes}</p>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold text-neutral-900">Sponsor Gets</h2>
              <div className="mt-4 space-y-3">
                {slot.sponsorGets.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="text-neutral-700 leading-relaxed">{b}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-neutral-500">
                Note: we do not promise numeric performance outcomes. Sponsorship is about recurring context and audience trust.
              </p>
            </div>

            {slot.exampleLinks.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-neutral-900">Examples</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {slot.exampleLinks.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-50 border border-neutral-200 text-sm font-bold text-neutral-900 hover:bg-white"
                    >
                      {l.label} <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-5">
            <div className="md:sticky top-32 bg-neutral-50 border border-neutral-100 rounded-3xl p-8">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Starting</div>
              <div className="mt-2 text-2xl font-black text-neutral-900">{slot.startingPriceNote}</div>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate(`/apply/brand?prefill=${encodeURIComponent(sponsorPrefill)}`)}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-colors"
                >
                  Sponsor This Series <ArrowUpRight className="w-4 h-4 ml-2" />
                </button>
                <NavLink
                  to="/apply/brand"
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-white border border-neutral-200 text-neutral-900 rounded-2xl font-bold hover:bg-neutral-50 transition-colors"
                >
                  General Brand Inquiry
                </NavLink>
              </div>

              <div className="mt-6 text-xs text-neutral-500 leading-relaxed">
                We will confirm category fit, disclosure requirements, and the exact sponsor copy before publishing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

