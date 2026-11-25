import React from 'react';
import { ArrowRight, Calendar, Mail, MapPin } from 'lucide-react';
import { CONTACT_EMAIL, EVENTS_DATA, ROADSHOW_IMAGE } from '../data/journalData';

interface EventsSectionProps {
  mode: 'preview' | 'full';
  onOpenEventsTab?: () => void;
  onRequestRoadshow: () => void;
  onRegisterEvent: (eventTitle: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  mode,
  onOpenEventsTab,
  onRequestRoadshow,
  onRegisterEvent,
}) => {
  return (
    <section
      id="events"
      className="max-w-6xl mx-auto px-6 py-14 border-b border-[#E2DBD0]"
      aria-labelledby="events-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E2DBD0]">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
            2027 Symposia &amp; Institutional Convenings
          </div>
          <h2
            id="events-heading"
            className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-2"
          >
            Events &amp; Private Roundtables
          </h2>
          <p className="text-[#57534E] mt-3 max-w-2xl leading-relaxed">
            In-person forums bringing together market infrastructure operators, legal scholars, asset servicers, and protocol engineers across Europe and Asia.
          </p>
        </div>

        {mode === 'preview' && onOpenEventsTab && (
          <button
            type="button"
            onClick={onOpenEventsTab}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 border border-[#1C1917] text-[#1C1917] text-xs font-medium rounded hover:bg-[#1C1917] hover:text-[#FBF9F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start"
          >
            <span>Open Full Events Programme</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Two Flagship 2027 Events */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-6">
          {EVENTS_DATA.map((ev) => (
            <article
              key={ev.id}
              className="bg-[#F3EFE6] border border-[#E2DBD0] p-6 sm:p-7 flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-wider text-[#1E3A8A]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {ev.date}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5 text-[#78350F]">
                    <MapPin className="w-3.5 h-3.5" />
                    {ev.location}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-3 leading-snug">
                  {ev.title}
                </h3>

                <div className="font-mono text-xs text-[#57534E] mt-1.5">
                  {ev.format} · {ev.theme}
                </div>

                <p className="text-sm text-[#1C1917] mt-4 leading-relaxed">{ev.summary}</p>

                {mode === 'full' && (
                  <ul className="mt-4 pt-4 border-t border-[#E2DBD0] space-y-2 text-sm text-[#57534E] list-disc list-inside">
                    {ev.highlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-[#E2DBD0] flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onRegisterEvent(ev.title)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors cursor-pointer"
                >
                  <span>Request Invitation / Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Event & Sponsorship Enquiry: ${ev.title}`)}`}
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono text-[#57534E] hover:text-[#1E3A8A] underline underline-offset-4"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Sponsor Enquiries</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Request a Roadshow Card with Thumbnail */}
        <aside className="lg:col-span-5 bg-[#FBF9F5] border border-[#1C1917] p-6 sm:p-7 flex flex-col justify-between gap-6">
          <div>
            <div className="aspect-[4/3] border border-[#E2DBD0] bg-[#F3EFE6] overflow-hidden mb-5">
              <img
                src={ROADSHOW_IMAGE}
                alt="Executive institutional briefing room showcasing Digital Securities Journal print monographs for private roadshows"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="font-mono text-[11px] uppercase tracking-widest text-[#78350F]">
              Private Institutional Briefings
            </div>
            <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-2">
              Request a Roadshow
            </h3>
            <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
              Host the Digital Securities Journal editorial team and contributing researchers for a closed-door briefing at your bank, central securities depository, asset manager, or regulatory forum in Zurich, London, New York, Singapore, or Bengaluru.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E2DBD0] space-y-1.5 text-xs text-[#57534E]">
              <div>Custom print bundles of the WEF 2027 Special Edition</div>
              <div>Briefings on asset servicing, multi-chain entitlements &amp; agentic controls</div>
              <div>
                Direct desk:{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Roadshow%20Briefing%20Request`}
                  className="font-mono text-[#1E3A8A] hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestRoadshow}
            className="w-full min-h-[44px] px-5 py-3 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors cursor-pointer"
          >
            Request a Roadshow Briefing
          </button>
        </aside>
      </div>
    </section>
  );
};
