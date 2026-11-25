import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CONTACT_EMAIL } from '../data/journalData';

export type PolicyPageType = 'privacy' | 'editorial' | 'terms' | 'not-found';

interface PolicyPagesProps {
  page: PolicyPageType;
  onBackToJournal: () => void;
}

export const PolicyPages: React.FC<PolicyPagesProps> = ({ page, onBackToJournal }) => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-14">
      <button
        type="button"
        onClick={onBackToJournal}
        className="inline-flex items-center gap-2 min-h-[44px] text-sm text-[#1E3A8A] hover:underline underline-offset-4 mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Digital Securities Journal</span>
      </button>

      {page === 'privacy' && (
        <article className="space-y-6 text-[#1C1917] leading-relaxed">
          <div className="border-b border-[#E2DBD0] pb-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
              Legal &amp; Data Governance · Effective 25 November 2026
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">
              Privacy Policy
            </h1>
          </div>

          <p className="text-[#57534E]">
            Digital Securities Journal (“DSJ”, “we”) respects reader and institutional subscriber privacy. This website operates on a strict data-minimisation basis aligned with Regulation (EU) 2016/679 (GDPR) principles.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">1. Information We Collect</h2>
          <p className="text-sm text-[#57534E]">
            We only collect personal details that you voluntarily submit through our mailing list subscription form, roadshow enquiry form, editorial submission form, or direct email correspondence ({CONTACT_EMAIL}). Submitted fields are limited to name/affiliation, email address, functional role, and message text.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">2. Cookies &amp; Analytics</h2>
          <p className="text-sm text-[#57534E]">
            This publication uses no third-party advertising networks, cross-site behavioural trackers, or invasive telemetry scripts. Essential local browser storage may be used solely to remember your cookie consent acknowledgement.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">3. Use &amp; Sharing of Information</h2>
          <p className="text-sm text-[#57534E]">
            Subscriber email addresses are used strictly to send Digital Securities Journal editions, research dispatches, and event invitations (including St. Moritz and Bengaluru symposia). We never sell, rent, or broker reader lists to external marketers.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">4. Retention &amp; Reader Rights</h2>
          <p className="text-sm text-[#57534E]">
            You may request access, correction, export, or permanent deletion of your subscription or enquiry records at any time by emailing{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-[#1E3A8A] underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </article>
      )}

      {page === 'editorial' && (
        <article className="space-y-6 text-[#1C1917] leading-relaxed">
          <div className="border-b border-[#E2DBD0] pb-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
              Charter &amp; Verification Standards · Updated 25 November 2026
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">
              Editorial Policy
            </h1>
          </div>

          <h2 className="font-display text-2xl font-semibold pt-2">1. Content Classification</h2>
          <p className="text-sm text-[#57534E]">
            Every published piece carries an explicit label distinguishing <strong>Reporting</strong>, <strong>Analysis</strong>, <strong>Opinion</strong>, <strong>Working Paper</strong>, and <strong>Proposed Architecture</strong>. Normative theses are explicitly separated from empirical market reporting.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">2. Measurement-Basis Discipline</h2>
          <p className="text-sm text-[#57534E]">
            Institutional figures are reported alongside their exact measurement basis—clearly distinguishing cumulative transaction flow (such as repo turnover), eligible custody universe, and assets under custody or on-chain AUM. Sources and verification dates appear on every lead feature and dataset.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">3. Independence &amp; Sponsorship Firewall</h2>
          <p className="text-sm text-[#57534E]">
            Commercial underwriting and edition sponsorships sustain print production and open archival access, and never purchase favourable coverage or editorial veto rights. Sponsored supplements are clearly labelled as such. Sponsorship enquiries are handled separately via{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-[#1E3A8A] underline">
              {CONTACT_EMAIL}
            </a>.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">4. Non-Affiliation Notice</h2>
          <p className="text-sm text-[#57534E]">
            Digital Securities Journal’s WEF 2027 Special Edition and Davos reading distributions are independent publications prepared for the institutional digital-assets community; DSJ is neither affiliated with nor endorsed by the World Economic Forum.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">5. Corrections Policy</h2>
          <p className="text-sm text-[#57534E]">
            Substantive factual errors are corrected transparently with a dated entry recorded in the article’s Updates &amp; Corrections log. Submit factual corrections to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-[#1E3A8A] underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </article>
      )}

      {page === 'terms' && (
        <article className="space-y-6 text-[#1C1917] leading-relaxed">
          <div className="border-b border-[#E2DBD0] pb-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#57534E]">
              Terms of Use · Effective 25 November 2026
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">
              Terms &amp; Conditions
            </h1>
          </div>

          <h2 className="font-display text-2xl font-semibold pt-2">1. Informational Purpose Only</h2>
          <p className="text-sm text-[#57534E]">
            Content published in Digital Securities Journal—including essays, working papers, interactive state calculators, and linked institutional outlooks—is provided solely for informational and scholarly research purposes. Nothing on this website constitutes investment, financial, tax, or legal advice.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">2. External Research &amp; Links</h2>
          <p className="text-sm text-[#57534E]">
            Our Resources directory links directly to third-party institutional reports (including banks, asset managers, BIS, ESMA, SEC, W3C, Coinbase, and Robinhood). All trademarks and copyrights in linked materials remain the property of their respective publishers.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-4">3. Contact &amp; Licensing</h2>
          <p className="text-sm text-[#57534E]">
            For bulk print licensing, reprint permissions, or event enquiries, contact{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-[#1E3A8A] underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </article>
      )}

      {page === 'not-found' && (
        <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-10 text-center space-y-5">
          <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
            Error 404 · Archival Folio Not Found
          </div>
          <h1 className="font-display text-4xl font-semibold text-[#1C1917]">
            The requested folio could not be located.
          </h1>
          <p className="text-sm text-[#57534E] max-w-lg mx-auto leading-relaxed">
            The essay, edition, or resource path may have moved or been archived. Return to the main Digital Securities Journal broadsheet or contact{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-[#1E3A8A] underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
          <button
            type="button"
            onClick={onBackToJournal}
            className="min-h-[44px] px-6 py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors cursor-pointer"
          >
            Return to Journal Home
          </button>
        </div>
      )}
    </section>
  );
};
