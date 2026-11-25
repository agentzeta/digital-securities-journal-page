import React, { useState } from 'react';
import { Check, Copy, Download, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { CONTACT_EMAIL } from '../data/journalData';

interface ScrapedHeadline {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
  relevanceScore: number;
}

interface FeedStatus {
  source: string;
  status: 'ok' | 'error';
  count: number;
  message?: string;
}

export const NewsletterDesk: React.FC = () => {
  // Mailing List state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Asset Servicer / Custodian');
  const [websiteTrap, setWebsiteTrap] = useState(''); // anti-spam honeypot
  const [submitting, setSubmitting] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState<string | null>(null);
  const [subscribeErr, setSubscribeErr] = useState<string | null>(null);

  // Live Scraper & Newsletter Generator state
  const [scraping, setScraping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scrapedAt, setScrapedAt] = useState<string | null>(null);
  const [feedStatus, setFeedStatus] = useState<FeedStatus[]>([]);
  const [headlines, setHeadlines] = useState<ScrapedHeadline[]>([]);
  const [focusTopic, setFocusTopic] = useState('Tokenisation, Custody, Stablecoins & Agentic Wallets');
  const [digestMarkdown, setDigestMarkdown] = useState<string | null>(null);
  const [digestMode, setDigestMode] = useState<string | null>(null);
  const [scraperError, setScraperError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeErr(null);
    setSubscribeMsg(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubscribeErr('Please enter a valid institutional email address.');
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          role,
          website: websiteTrap,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setSubscribeErr(data.error || 'Unable to process subscription.');
      } else {
        setSubscribeMsg(data.message || 'Subscribed to Digital Securities Journal dispatches.');
        setEmail('');
      }
    } catch {
      setSubscribeErr('Network error while subscribing. Email Digitalsecuritiesjournal@proton.me directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScrape = async (): Promise<ScrapedHeadline[]> => {
    setScraping(true);
    setScraperError(null);
    try {
      const resp = await fetch('/api/newsletter/scrape');
      const data = await resp.json();
      if (!resp.ok) {
        setScraperError(data.error || 'Failed to fetch live feeds.');
        return [];
      }
      setScrapedAt(data.scrapedAt || null);
      setFeedStatus(data.feedStatus || []);
      setHeadlines(data.items || []);
      return data.items || [];
    } catch {
      setScraperError('Could not connect to live feed scraper.');
      return [];
    } finally {
      setScraping(false);
    }
  };

  const handleGenerateNewsletter = async () => {
    setScraperError(null);
    let currentItems = headlines;
    if (currentItems.length === 0) {
      currentItems = await handleScrape();
    }
    if (currentItems.length === 0) return;

    setGenerating(true);
    try {
      const resp = await fetch('/api/newsletter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: currentItems,
          focusTopic,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setScraperError(data.error || 'Failed to synthesize newsletter.');
      } else {
        setDigestMarkdown(data.markdown || '');
        setDigestMode(data.mode || 'rss-digest');
      }
    } catch {
      setScraperError('Network error generating newsletter.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyDigest = async () => {
    if (!digestMarkdown) return;
    await navigator.clipboard.writeText(digestMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDigest = () => {
    if (!digestMarkdown) return;
    const blob = new Blob([digestMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsj-newsletter-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="newsletter"
      className="max-w-6xl mx-auto px-6 py-14 border-b border-[#E2DBD0]"
      aria-labelledby="newsletter-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Mailing List Subscription */}
        <div className="lg:col-span-5 bg-[#F3EFE6] border border-[#E2DBD0] p-6 sm:p-7 space-y-5">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
              Mailing List &amp; Print Dispatches
            </div>
            <h2
              id="newsletter-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-2"
            >
              Subscribe to the Journal
            </h2>
            <p className="text-sm text-[#57534E] mt-2.5 leading-relaxed">
              Receive verified dispatches covering institutional tokenisation, corporate-action standards, stablecoin settlement, and event invitations for St. Moritz and Bengaluru.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4" noValidate>
            {/* Anti-spam honeypot */}
            <div className="hidden" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={websiteTrap}
                  onChange={(e) => setWebsiteTrap(e.target.value)}
                />
              </label>
            </div>

            <label className="block">
              <span className="font-mono text-xs text-[#57534E]">Work or Institutional Email</span>
              <input
                type="email"
                required
                placeholder="name@institution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
              />
            </label>

            <label className="block">
              <span className="font-mono text-xs text-[#57534E]">Primary Function</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
              >
                <option>Asset Servicer / Custodian</option>
                <option>CSD / Clearing &amp; Settlement</option>
                <option>Asset Manager / Allocator</option>
                <option>Legal, Compliance &amp; Regulatory</option>
                <option>Protocol &amp; Agentic Infrastructure</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[44px] px-5 py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'Recording Subscription…' : 'Subscribe to Mailing List'}
            </button>

            {subscribeErr && (
              <p className="text-xs text-[#78350F] font-medium">{subscribeErr}</p>
            )}
            {subscribeMsg && (
              <div className="bg-[#FBF9F5] border border-[#E2DBD0] p-3 text-xs text-[#1E3A8A] inline-flex items-center gap-2 w-full">
                <Check className="w-4 h-4 shrink-0" />
                <span>{subscribeMsg}</span>
              </div>
            )}
          </form>

          <p className="text-[11px] text-[#57534E] leading-relaxed border-t border-[#E2DBD0] pt-4">
            Zero advertising trackers or third-party data resale. Unsubscribe anytime or write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-[#1E3A8A] hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </div>

        {/* Right: Live News Scraper & Auto-Generated Newsletter Feature */}
        <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E2DBD0] p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2DBD0] pb-5">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
                Automated Editorial Wire · Live RSS Scraper
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1.5">
                Auto-Generated Market Newsletter
              </h3>
              <p className="text-sm text-[#57534E] mt-2 leading-relaxed">
                Fetches current filings and headlines from SEC, BIS, and CoinDesk feeds, filters for tokenisation, custody, stablecoins, and agentic payments, and compiles a source-linked newsletter dispatch.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <label className="flex-1 block">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#57534E]">
                Dispatch Focus Filter
              </span>
              <input
                type="text"
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] bg-[#F3EFE6] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
              />
            </label>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleScrape}
                disabled={scraping || generating}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 border border-[#1C1917] text-[#1C1917] text-xs font-medium rounded hover:bg-[#F3EFE6] transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${scraping ? 'animate-spin' : ''}`} />
                <span>{scraping ? 'Scraping Feeds…' : 'Scrape Latest News'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateNewsletter}
                disabled={scraping || generating}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 bg-[#1E3A8A] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1C1917] transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{generating ? 'Compiling Dispatch…' : 'Auto-Generate Newsletter'}</span>
              </button>
            </div>
          </div>

          {scraperError && (
            <div className="bg-[#F3EFE6] border border-[#78350F] p-3 text-xs text-[#78350F]">
              {scraperError}
            </div>
          )}

          {feedStatus.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-[#57534E] border-b border-[#E2DBD0] pb-3">
              {feedStatus.map((fs) => (
                <span key={fs.source}>
                  {fs.source}:{' '}
                  <strong className="text-[#1C1917]">
                    {fs.status === 'ok' ? `${fs.count} items` : 'Unavailable'}
                  </strong>
                </span>
              ))}
              {scrapedAt && (
                <span className="ml-auto tabular-nums">
                  Fetched {new Date(scrapedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}

          {digestMarkdown ? (
            <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#1E3A8A]">
                  Compiled Newsletter ({digestMode === 'ai-synthesized' ? 'AI-Synthesized Dispatch' : 'Verified RSS Digest'})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDigest}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 bg-[#FBF9F5] border border-[#E2DBD0] text-xs text-[#1C1917] rounded hover:border-[#1C1917] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#1E3A8A]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadDigest}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 bg-[#1C1917] text-[#FBF9F5] text-xs rounded hover:bg-[#1E3A8A] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save .MD</span>
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap font-serif text-sm text-[#1C1917] leading-relaxed max-h-[340px] overflow-y-auto bg-[#FBF9F5] border border-[#E2DBD0] p-4">
                {digestMarkdown}
              </pre>
            </div>
          ) : headlines.length > 0 ? (
            <div className="divide-y divide-[#E2DBD0] max-h-[340px] overflow-y-auto border border-[#E2DBD0] px-4">
              {headlines.slice(0, 8).map((item, idx) => (
                <div key={idx} className="py-3">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#57534E]">
                    <span className="text-[#78350F]">{item.source}</span>
                    <span>{item.publishedAt}</span>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-base font-medium text-[#1C1917] hover:text-[#1E3A8A] inline-flex items-center gap-1.5 mt-1"
                  >
                    <span>{item.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  {item.summary && (
                    <p className="text-xs text-[#57534E] mt-1 leading-relaxed">{item.summary}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#F3EFE6]/60 border border-[#E2DBD0] p-6 text-sm text-[#57534E]">
              Click <strong className="text-[#1C1917]">Scrape Latest News</strong> or{' '}
              <strong className="text-[#1C1917]">Auto-Generate Newsletter</strong> above to pull real-time headlines from SEC, BIS, and CoinDesk RSS feeds and compile today’s institutional dispatch.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
