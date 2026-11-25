import React, { useState } from 'react';
import { ArrowRight, ExternalLink, FileText, Globe, Layers } from 'lucide-react';
import {
  OUTLOOK_2027_REPORTS,
  TOKENISATION_AGENTIC_REPORTS,
} from '../data/journalData';

interface ResourcesSectionProps {
  mode: 'preview' | 'full';
  onOpenResourcesTab?: () => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  mode,
  onOpenResourcesTab,
}) => {
  const [outlookFilter, setOutlookFilter] = useState<string>('All');
  const [digitalFilter, setDigitalFilter] = useState<string>('All');

  const outlookCategories = [
    'All',
    'Global Macro & Wealth',
    'Fixed Income & Rates',
    'Equities & Private Markets',
  ];

  const digitalCategories = [
    'All',
    'Tokenisation & DLT',
    'Stablecoins & Money',
    'Agentic Wallets, Coinbase & Robinhood',
  ];

  const filteredOutlooks =
    outlookFilter === 'All'
      ? OUTLOOK_2027_REPORTS
      : OUTLOOK_2027_REPORTS.filter((r) => r.category === outlookFilter);

  const filteredDigital =
    digitalFilter === 'All'
      ? TOKENISATION_AGENTIC_REPORTS
      : TOKENISATION_AGENTIC_REPORTS.filter((r) => r.category === digitalFilter);

  const displayedOutlooks = mode === 'preview' ? OUTLOOK_2027_REPORTS.slice(0, 6) : filteredOutlooks;
  const displayedDigital =
    mode === 'preview' ? TOKENISATION_AGENTIC_REPORTS.slice(0, 4) : filteredDigital;

  return (
    <section
      id="resources"
      className="max-w-6xl mx-auto px-6 py-14 border-b border-[#E2DBD0]"
      aria-labelledby="resources-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E2DBD0]">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
            Market Maps · Infographics · Institutional Research Library
          </div>
          <h2
            id="resources-heading"
            className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-2"
          >
            Onchain Capital Markets Resources
          </h2>
          <p className="text-[#57534E] mt-3 max-w-2xl leading-relaxed">
            Architectural market maps, primary research across tokenisation, stablecoins, Coinbase Agentic Wallets, and Robinhood Chain, alongside sixteen verified institutional 2027 outlooks.
          </p>
        </div>

        {mode === 'preview' && onOpenResourcesTab && (
          <button
            type="button"
            onClick={onOpenResourcesTab}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 border border-[#1C1917] text-[#1C1917] text-xs font-medium rounded hover:bg-[#1C1917] hover:text-[#FBF9F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start"
          >
            <span>View All {OUTLOOK_2027_REPORTS.length + TOKENISATION_AGENTIC_REPORTS.length} Reports &amp; Maps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Part 1: Crisp Vector Market Map & Architecture Infographics */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Infographic 1: Onchain Capital Markets Stack */}
        <figure className="bg-[#F3EFE6] border border-[#E2DBD0] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#78350F] inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Infographic 01 · Architecture Stack</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#57534E]">
              DSJ Market Map
            </span>
          </div>
          <figcaption className="font-display text-xl font-semibold text-[#1C1917] mb-4">
            The Operating Stack of Onchain Capital Markets
          </figcaption>

          <svg
            viewBox="0 0 640 360"
            className="w-full h-auto bg-[#FBF9F5] border border-[#E2DBD0]"
            role="img"
            aria-label="Diagram of the five-layer Onchain Capital Markets architecture stack from Issuance and Custody down to Autonomous Agent Mandates"
          >
            <rect x="0" y="0" width="640" height="360" fill="#FBF9F5" />
            {/* Layer 1 */}
            <rect x="24" y="20" width="592" height="56" fill="#F3EFE6" stroke="#1C1917" strokeWidth="1" />
            <text x="40" y="43" fill="#1E3A8A" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              LAYER 05 · AGENT EXECUTION &amp; TREASURY MANDATES
            </text>
            <text x="40" y="62" fill="#1C1917" fontSize="13" fontFamily="Source Serif 4, Georgia, serif">
              Coinbase Agentic Wallets (TEE Enclaves) · x402 HTTP Payments · Robinhood Agents · Spend Caps
            </text>

            {/* Layer 2 */}
            <rect x="24" y="88" width="592" height="56" fill="#FBF9F5" stroke="#1C1917" strokeWidth="1" />
            <text x="40" y="111" fill="#78350F" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              LAYER 04 · TOKEN ENTITLEMENT &amp; ASSET SERVICING REGISTRY
            </text>
            <text x="40" y="130" fill="#1C1917" fontSize="13" fontFamily="Source Serif 4, Georgia, serif">
              Record-Date Snapshots (S_c) · Due-Bill Market Claims · Elections · Idempotent Payouts (D)
            </text>

            {/* Layer 3 */}
            <rect x="24" y="156" width="592" height="56" fill="#F3EFE6" stroke="#1C1917" strokeWidth="1" />
            <text x="40" y="179" fill="#1E3A8A" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              LAYER 03 · PRIVACY-PRESERVING COMPLIANCE &amp; IDENTITY
            </text>
            <text x="40" y="198" fill="#1C1917" fontSize="13" fontFamily="Source Serif 4, Georgia, serif">
              W3C VCDM v2.0 · SD-JWT Selective Disclosure · FATF Rec. 16 LEI · Bounded Query Budgets
            </text>

            {/* Layer 4 */}
            <rect x="24" y="224" width="592" height="56" fill="#FBF9F5" stroke="#1C1917" strokeWidth="1" />
            <text x="40" y="247" fill="#78350F" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              LAYER 02 · SETTLEMENT RAILS &amp; PAR MONEY LEG
            </text>
            <text x="40" y="266" fill="#1C1917" fontSize="13" fontFamily="Source Serif 4, Georgia, serif">
              Canton (CIP-56) · Besu (ERC-20) · Arbitrum Orbit (Robinhood Chain) · Wholesale CBDC / Stablecoins
            </text>

            {/* Layer 5 */}
            <rect x="24" y="292" width="592" height="52" fill="#1C1917" />
            <text x="40" y="313" fill="#E2DBD0" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              LAYER 01 · STATUTORY OWNERSHIP &amp; LEGAL CUSTODY ANCHOR
            </text>
            <text x="40" y="332" fill="#FBF9F5" fontSize="13" fontFamily="Source Serif 4, Georgia, serif">
              UCC Article 8 &amp; Article 12 (CERs) · DTC Digital Omnibus Account · EU DLT Pilot Regime
            </text>
          </svg>
        </figure>

        {/* Infographic 2: 2026-2027 Production Landscape */}
        <figure className="bg-[#F3EFE6] border border-[#E2DBD0] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#1E3A8A] inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Infographic 02 · Industry Landscape</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#57534E]">
              Verified Nov 2026
            </span>
          </div>
          <figcaption className="font-display text-xl font-semibold text-[#1C1917] mb-4">
            2026–2027 Production Milestones: Clearing, Equities &amp; Agentic Rails
          </figcaption>

          <svg
            viewBox="0 0 640 360"
            className="w-full h-auto bg-[#FBF9F5] border border-[#E2DBD0]"
            role="img"
            aria-label="Industry landscape quadrant map covering Institutional Clearing, Equities and Retail Tokenisation, Par Money and Stablecoins, and Agentic Payment Rails"
          >
            <rect x="0" y="0" width="640" height="360" fill="#FBF9F5" />
            {/* Quadrant 1 */}
            <rect x="20" y="20" width="292" height="152" fill="#F3EFE6" stroke="#E2DBD0" strokeWidth="1.5" />
            <text x="34" y="42" fill="#1E3A8A" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              CORE CLEARING &amp; REPO
            </text>
            <text x="34" y="66" fill="#1C1917" fontSize="14" fontFamily="Playfair Display, Georgia, serif" fontWeight="600">
              DTCC &amp; Broadridge
            </text>
            <text x="34" y="88" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • DTCC Tokenization live (28 Oct 2026)
            </text>
            <text x="34" y="108" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • 20 participants · 34 initial securities
            </text>
            <text x="34" y="128" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • Broadridge DLR: $7.6T Oct repo flow
            </text>
            <text x="34" y="148" fill="#78350F" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              Canton · Besu · Solana (H2 2027)
            </text>

            {/* Quadrant 2 */}
            <rect x="328" y="20" width="292" height="152" fill="#F3EFE6" stroke="#E2DBD0" strokeWidth="1.5" />
            <text x="342" y="42" fill="#78350F" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              PROGRAMMABLE EQUITIES
            </text>
            <text x="342" y="66" fill="#1C1917" fontSize="14" fontFamily="Playfair Display, Georgia, serif" fontWeight="600">
              Robinhood Chain &amp; 24/7 Markets
            </text>
            <text x="342" y="88" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • Arbitrum Orbit L2 live (1 Jul 2026)
            </text>
            <text x="342" y="108" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • 24/7 ERC-20 Stock Tokens (non-U.S.)
            </text>
            <text x="342" y="128" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • Robinhood Agents (HOOD Summit 2026)
            </text>
            <text x="342" y="148" fill="#1E3A8A" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              24/7 Trading vs. T+1 Servicing Clocks
            </text>

            {/* Quadrant 3 */}
            <rect x="20" y="188" width="292" height="152" fill="#F3EFE6" stroke="#E2DBD0" strokeWidth="1.5" />
            <text x="34" y="210" fill="#78350F" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              MONETARY &amp; STABLECOIN ANCHORS
            </text>
            <text x="34" y="234" fill="#1C1917" fontSize="14" fontFamily="Playfair Display, Georgia, serif" fontWeight="600">
              BIS &amp; Cross-Border Settlement
            </text>
            <text x="34" y="256" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • BIS AR 2026 Ch. III: Beyond Stablecoins
            </text>
            <text x="34" y="276" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • WP 1335: Fragmentation &amp; Bridge Risk
            </text>
            <text x="34" y="296" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • WP 1340: Stablecoin FX Spillovers
            </text>
            <text x="34" y="316" fill="#1E3A8A" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              Par Finality · Reserve Backing · FATF R16
            </text>

            {/* Quadrant 4 */}
            <rect x="328" y="188" width="292" height="152" fill="#F3EFE6" stroke="#E2DBD0" strokeWidth="1.5" />
            <text x="342" y="210" fill="#1E3A8A" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              AGENTIC WALLETS &amp; MACHINE RAILS
            </text>
            <text x="342" y="234" fill="#1C1917" fontSize="14" fontFamily="Playfair Display, Georgia, serif" fontWeight="600">
              Coinbase &amp; LF x402 Foundation
            </text>
            <text x="342" y="256" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • Coinbase Agentic Wallets (11 Feb 2026)
            </text>
            <text x="342" y="276" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • AWS Nitro Enclaves + Session Caps
            </text>
            <text x="342" y="296" fill="#57534E" fontSize="11.5" fontFamily="Source Serif 4, Georgia, serif">
              • HTTP 402 USDC Settlement on Base
            </text>
            <text x="342" y="316" fill="#78350F" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              Cloudflare · Google · Visa · Stripe · AWS
            </text>
          </svg>
        </figure>
      </div>

      {/* Part 2: Tokenisation, Stablecoins & Agentic Wallets Primary Dossier */}
      <div className="mt-14 pt-10 border-t border-[#E2DBD0]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
              Primary Research &amp; Platform Specifications
            </div>
            <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1.5">
              Tokenisation, Stablecoins, Agentic Wallets, Coinbase &amp; Robinhood
            </h3>
          </div>

          {mode === 'full' && (
            <div className="inline-flex flex-wrap p-1 bg-[#F3EFE6] border border-[#E2DBD0] rounded-md self-start">
              {digitalCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDigitalFilter(cat)}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    digitalFilter === cat
                      ? 'bg-[#1C1917] text-[#FBF9F5]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedDigital.map((rep) => (
            <a
              key={rep.id}
              href={rep.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#FBF9F5] border border-[#E2DBD0] hover:border-[#1E3A8A] p-5 flex flex-col justify-between gap-4 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider text-[#57534E]">
                  <span className="text-[#1E3A8A] font-medium">{rep.institution}</span>
                  <span>{rep.yearOrDate}</span>
                </div>
                <h4 className="font-display text-lg font-semibold text-[#1C1917] group-hover:text-[#1E3A8A] mt-2 leading-snug">
                  {rep.title}
                </h4>
                <p className="text-sm text-[#57534E] mt-2 leading-relaxed">{rep.summary}</p>
              </div>
              <div className="pt-3 border-t border-[#E2DBD0] flex items-center justify-between gap-3 text-xs font-mono text-[#78350F]">
                <span>{rep.category}</span>
                <span className="inline-flex items-center gap-1 text-[#1C1917] group-hover:text-[#1E3A8A]">
                  Open Source <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Part 3: 16 Verified Institutional 2027 Outlooks */}
      <div className="mt-14 pt-10 border-t border-[#E2DBD0]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
              Institutional Benchmarks · 16 Verified Reports
            </div>
            <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1.5">
              2027 Global Macro, Wealth, Rates &amp; Markets Outlooks
            </h3>
          </div>

          {mode === 'full' && (
            <div className="inline-flex flex-wrap p-1 bg-[#F3EFE6] border border-[#E2DBD0] rounded-md self-start">
              {outlookCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setOutlookFilter(cat)}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    outlookFilter === cat
                      ? 'bg-[#1C1917] text-[#FBF9F5]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedOutlooks.map((report) => (
            <a
              key={report.id}
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F3EFE6]/60 border border-[#E2DBD0] hover:border-[#1C1917] p-5 flex flex-col justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#57534E]">
                  <span className="text-[#78350F] font-medium">{report.institution}</span>
                  <span>{report.yearOrDate}</span>
                </div>
                <h4 className="font-display text-lg font-semibold text-[#1C1917] group-hover:text-[#1E3A8A] mt-2 leading-snug">
                  {report.title}
                </h4>
                <p className="text-xs text-[#57534E] mt-2 leading-relaxed">{report.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#E2DBD0] flex items-center justify-between gap-2 font-mono text-[10px] text-[#57534E]">
                <span className="inline-flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {report.accessNote}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#1C1917] group-hover:text-[#1E3A8A] shrink-0" />
              </div>
            </a>
          ))}
        </div>

        {mode === 'preview' && onOpenResourcesTab && (
          <div className="mt-6 text-right">
            <button
              type="button"
              onClick={onOpenResourcesTab}
              className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-medium text-[#1E3A8A] hover:underline underline-offset-4 cursor-pointer"
            >
              <span>Browse remaining {OUTLOOK_2027_REPORTS.length - 6} institutional outlooks &amp; primary reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
