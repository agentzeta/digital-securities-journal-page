import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, Mail, Menu, X } from 'lucide-react';
import {
  Article,
  CONTACT_EMAIL,
  DeskId,
  HERO_IMAGE,
  INAUGURAL_2019_COVER,
  LAUNCH_ARTICLES,
  LOGO_IMAGE,
  PRINT_TOC,
  VERIFIED_MARKET_FACTS,
  WEF_2027_COVER,
} from './data/journalData';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { StandardsWorkbench } from './components/StandardsWorkbench';
import { EventsSection } from './components/EventsSection';
import { ResourcesSection } from './components/ResourcesSection';
import { NewsletterDesk } from './components/NewsletterDesk';
import { PolicyPages, PolicyPageType } from './components/PolicyPages';

type ActiveView = 'journal' | 'events' | 'resources' | 'standards' | PolicyPageType;
type InquiryMode = 'contribute' | 'sponsor' | 'print' | 'roadshow' | 'event';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window === 'undefined') return 'journal';
    const path = window.location.pathname;
    const isRepoRoot =
      path === '/' ||
      path === '/index.html' ||
      path === '/digital-securities-journal-page' ||
      path === '/digital-securities-journal-page/' ||
      path === '/digital-securities-journal-page/index.html';
    if (!isRepoRoot) return 'not-found';
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (
      viewParam === 'events' ||
      viewParam === 'resources' ||
      viewParam === 'standards' ||
      viewParam === 'privacy' ||
      viewParam === 'editorial' ||
      viewParam === 'terms'
    ) {
      return viewParam;
    }
    const hash = window.location.hash;
    if (hash === '#privacy-policy') return 'privacy';
    if (hash === '#editorial-policy') return 'editorial';
    if (hash === '#terms') return 'terms';
    if (hash === '#404') return 'not-found';
    return 'journal';
  });

  const [selectedDesk, setSelectedDesk] = useState<'All' | DeskId>('All');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const slug = new URLSearchParams(window.location.search).get('article');
    if (!slug) return null;
    const match = LAUNCH_ARTICLES.find((a) => a.slug === slug || a.id === slug);
    return match ? match.id : null;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subscribe Modal (Primary CTA)
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subRole, setSubRole] = useState('Asset Servicer / Custodian');
  const [subTrap, setSubTrap] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [subDone, setSubDone] = useState(false);

  // Inquiry Modal (Contribute / Sponsor / Print / Roadshow / Event)
  const [inquiryMode, setInquiryMode] = useState<InquiryMode | null>(null);
  const [inquiryContext, setInquiryContext] = useState('');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryNote, setInquiryNote] = useState('');
  const [inquiryTrap, setInquiryTrap] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Cookie Consent Banner
  const [cookieDismissed, setCookieDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dsj_cookie_consent') === 'acknowledged';
    } catch {
      return false;
    }
  });

  const [heroImgError, setHeroImgError] = useState(false);
  const [cardImgErrors, setCardImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy-policy') setActiveView('privacy');
      else if (hash === '#editorial-policy') setActiveView('editorial');
      else if (hash === '#terms') setActiveView('terms');
      else if (hash === '#404') setActiveView('not-found');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activeArticle: Article | undefined = LAUNCH_ARTICLES.find(
    (a) => a.id === activeArticleId
  );

  useEffect(() => {
    if (activeArticle) {
      document.title = `${activeArticle.title} | Digital Securities Journal`;
      return;
    }
    const titles: Record<ActiveView, string> = {
      journal: 'Digital Securities Journal — Onchain Capital Markets',
      events: '2027 Events & Roadshows | Digital Securities Journal',
      resources: 'Onchain Capital Markets Resources & 2027 Outlooks | Digital Securities Journal',
      standards: 'Token Entitlement & Privacy Standards | Digital Securities Journal',
      privacy: 'Privacy Policy | Digital Securities Journal',
      editorial: 'Editorial Policy | Digital Securities Journal',
      terms: 'Terms & Conditions | Digital Securities Journal',
      'not-found': '404 Folio Not Found | Digital Securities Journal',
    };
    document.title = titles[activeView];
  }, [activeView, activeArticle]);

  const filteredArticles =
    selectedDesk === 'All'
      ? LAUNCH_ARTICLES
      : LAUNCH_ARTICLES.filter((a) => a.desk === selectedDesk);

  const leadArticle = LAUNCH_ARTICLES[0];

  const navigateToSection = (sectionId: string) => {
    setActiveView('journal');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const openTopView = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribeModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail.trim())) {
      setSubError('Please enter a valid institutional email address.');
      return;
    }
    setSubLoading(true);
    try {
      const resp = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subEmail.trim(),
          role: subRole,
          website: subTrap,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setSubError(data.error || 'Unable to process subscription.');
      } else {
        setSubDone(true);
      }
    } catch {
      setSubError(`Network error. Email ${CONTACT_EMAIL} directly.`);
    } finally {
      setSubLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError(null);
    if (inquiryName.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryEmail.trim())) {
      setInquiryError('Please provide your name and a valid email address.');
      return;
    }
    setInquiryLoading(true);
    try {
      const resp = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: inquiryMode,
          name: inquiryName.trim(),
          email: inquiryEmail.trim(),
          note: inquiryContext ? `${inquiryContext} — ${inquiryNote}` : inquiryNote,
          website: inquiryTrap,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setInquiryError(data.error || 'Unable to submit enquiry.');
      } else {
        setInquirySubmitted(true);
      }
    } catch {
      setInquiryError(`Network error. Email ${CONTACT_EMAIL} directly.`);
    } finally {
      setInquiryLoading(false);
    }
  };

  const openInquiry = (mode: InquiryMode, context = '') => {
    setInquiryMode(mode);
    setInquiryContext(context);
    setInquirySubmitted(false);
    setInquiryError(null);
    setInquiryName('');
    setInquiryEmail('');
    setInquiryNote('');
    setInquiryTrap('');
  };

  const acknowledgeCookies = () => {
    setCookieDismissed(true);
    try {
      localStorage.setItem('dsj_cookie_consent', 'acknowledged');
    } catch {
      // Ignore storage quota restrictions
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col overflow-x-hidden">
      {/* Top Bar Contract: Exactly 3 zones (Logo+Wordmark, 5 single-line links, 1 Primary CTA) */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E2DBD0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6 lg:gap-8">
          {/* Zone 1: Monogram Logo + Wordmark */}
          <button
            type="button"
            onClick={() => openTopView('journal')}
            className="inline-flex items-center gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
          >
            <img
              src={LOGO_IMAGE}
              alt="Digital Securities Journal monogram"
              className="w-9 h-9 object-cover border border-[#E2DBD0] shrink-0"
            />
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#1C1917]">
              Digital Securities Journal
            </span>
          </button>

          {/* Zone 2: 5 concise single-line text links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#57534E]" aria-label="Primary">
            <button
              type="button"
              onClick={() => navigateToSection('latest')}
              className={`hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
                activeView === 'journal'
                  ? 'text-[#1C1917] underline underline-offset-8 decoration-[#1E3A8A]'
                  : ''
              }`}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('editions')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
            >
              Editions
            </button>
            <button
              type="button"
              onClick={() => openTopView('events')}
              className={`hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
                activeView === 'events'
                  ? 'text-[#1C1917] underline underline-offset-8 decoration-[#1E3A8A]'
                  : ''
              }`}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => openTopView('resources')}
              className={`hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
                activeView === 'resources'
                  ? 'text-[#1C1917] underline underline-offset-8 decoration-[#1E3A8A]'
                  : ''
              }`}
            >
              Resources
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('newsletter')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
            >
              Newsletter
            </button>
          </nav>

          {/* Zone 3: 1 Clear Primary CTA + Mobile Drawer Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSubDone(false);
                setSubError(null);
                setSubscribeOpen(true);
              }}
              className="hidden sm:inline-flex items-center min-h-[44px] px-4 py-2 text-xs font-medium text-[#FBF9F5] bg-[#1C1917] rounded hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Subscribe
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#1C1917] border border-[#E2DBD0] rounded cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2DBD0] bg-[#FBF9F5] px-6 py-4 flex flex-col gap-1 text-sm">
            <button
              type="button"
              onClick={() => navigateToSection('latest')}
              className="text-left min-h-[44px] py-2 text-[#1C1917]"
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('editions')}
              className="text-left min-h-[44px] py-2 text-[#1C1917]"
            >
              Editions
            </button>
            <button
              type="button"
              onClick={() => openTopView('events')}
              className="text-left min-h-[44px] py-2 text-[#1C1917]"
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => openTopView('resources')}
              className="text-left min-h-[44px] py-2 text-[#1C1917]"
            >
              Resources
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('newsletter')}
              className="text-left min-h-[44px] py-2 text-[#1C1917]"
            >
              Newsletter
            </button>
            <button
              type="button"
              onClick={() => openTopView('standards')}
              className="text-left min-h-[44px] py-2 text-[#57534E]"
            >
              Reference Standards
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSubDone(false);
                setSubscribeOpen(true);
              }}
              className="mt-2 min-h-[44px] px-4 py-2.5 text-xs font-medium text-[#FBF9F5] bg-[#1C1917] rounded text-center"
            >
              Subscribe
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {activeView === 'events' && (
          <EventsSection
            mode="full"
            onRequestRoadshow={() => openInquiry('roadshow')}
            onRegisterEvent={(title) => openInquiry('event', title)}
          />
        )}

        {activeView === 'resources' && <ResourcesSection mode="full" />}

        {activeView === 'standards' && <StandardsWorkbench />}

        {(activeView === 'privacy' ||
          activeView === 'editorial' ||
          activeView === 'terms' ||
          activeView === 'not-found') && (
          <PolicyPages
            page={activeView}
            onBackToJournal={() => {
              const baseHome = window.location.pathname.startsWith('/digital-securities-journal-page')
                ? '/digital-securities-journal-page/'
                : '/';
              window.history.replaceState(null, '', baseHome);
              openTopView('journal');
            }}
          />
        )}

        {activeView === 'journal' && (
          <>
            {/* 1. Institutional Hero */}
            <section className="max-w-6xl mx-auto px-6 py-12 lg:py-18 border-b border-[#E2DBD0]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
                      The Operating System of Onchain Capital Markets
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-[#1C1917] mt-4 leading-[1.08]">
                      Capital markets are moving onchain. Rights must move with them.
                    </h1>
                    <p className="text-lg text-[#57534E] mt-6 max-w-xl leading-relaxed">
                      An independent print and digital journal examining tokenisation, investor ownership, asset servicing, stablecoin settlement, agentic execution boundaries, and institutional finance.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E2DBD0] flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigateToSection('desks')}
                      className="inline-flex items-center gap-2 min-h-[44px] px-5 py-3 bg-[#1C1917] text-[#FBF9F5] text-sm font-medium rounded hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Explore Launch Essays</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToSection('editions')}
                      className="inline-flex items-center min-h-[44px] px-5 py-3 border border-[#E2DBD0] text-[#1C1917] text-sm font-medium rounded hover:border-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      DSJ WEF 2027 Special Edition
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col">
                  <div className="flex-1 min-h-[260px] border border-[#E2DBD0] overflow-hidden bg-[#F3EFE6]">
                    {!heroImgError ? (
                      <img
                        src={HERO_IMAGE}
                        alt="Neoclassical stone clearinghouse architecture symbolising institutional financial permanence"
                        onError={() => setHeroImgError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                        <BookOpen className="w-8 h-8 text-[#78350F] mb-3" />
                        <span className="font-display text-xl text-[#1C1917]">
                          Digital Securities Journal
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-serif italic text-[#57534E] mt-2.5">
                    WEF 2027 Special Edition · Winter 2026–27 — Examining the legal and operational layer beneath tokenised assets.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Lead Analysis + Verified Market Record */}
            <section id="latest" className="max-w-6xl mx-auto px-6 py-14 border-b border-[#E2DBD0]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-6">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
                    Lead Analysis · Markets &amp; Infrastructure · Verified {leadArticle.verifiedDate}
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-3 leading-tight">
                    {leadArticle.title}
                  </h2>
                  <p className="text-base text-[#57534E] mt-4 leading-relaxed">
                    {leadArticle.standfirst}
                  </p>
                  <p className="text-sm text-[#1C1917] mt-4 leading-relaxed">
                    {leadArticle.paragraphs[0]}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-5">
                    <button
                      type="button"
                      onClick={() => setActiveArticleId(leadArticle.id)}
                      className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-[#1E3A8A] hover:underline underline-offset-4 cursor-pointer"
                    >
                      <span>Read Full Lead Feature</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openTopView('standards')}
                      className="min-h-[44px] text-sm text-[#57534E] hover:text-[#1C1917] underline underline-offset-4 cursor-pointer"
                    >
                      Open Entitlement &amp; Privacy Standards
                    </button>
                  </div>
                </div>

                {/* Adjacent Verified Market Record */}
                <div className="lg:col-span-6 bg-[#F3EFE6] border border-[#E2DBD0] p-6">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
                    Verified Market &amp; Regulatory Ledger (25 Nov 2026)
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#1C1917] mt-1.5 mb-4">
                    Distinguishing Settlement Flow from Custody Stock
                  </h3>
                  <div className="divide-y divide-[#E2DBD0]">
                    {VERIFIED_MARKET_FACTS.map((fact) => (
                      <div key={fact.event} className="py-3.5 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-medium text-sm text-[#1C1917]">{fact.event}</span>
                          <span className="font-mono text-[11px] text-[#57534E] tabular-nums">
                            {fact.date}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-[#1E3A8A] mt-0.5 tabular-nums">
                          {fact.reportedFigure} ({fact.measurementBasis})
                        </div>
                        <p className="text-xs text-[#57534E] mt-1 leading-relaxed">{fact.caution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Print Editions: DSJ WEF 2027 Special Edition & DSJ 2019 Inaugural Issue */}
            <section id="editions" className="max-w-6xl mx-auto px-6 py-14 border-b border-[#E2DBD0]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* WEF 2027 Special Edition Thumbnail + 2019 Inaugural Issue Thumbnail */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-5">
                    <div className="aspect-[3/4] max-w-[300px] mx-auto border border-[#1C1917] bg-[#FBF9F5] overflow-hidden shadow-sm">
                      <img
                        src={WEF_2027_COVER}
                        alt="Digital Securities Journal WEF 2027 Special Edition print cover thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="font-mono text-[11px] uppercase tracking-widest text-[#78350F]">
                        Current Print Monograph · Winter 2026–27
                      </div>
                      <h3 className="font-display text-xl font-semibold text-[#1C1917] mt-1">
                        DSJ WEF 2027 Special Edition
                      </h3>
                      <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                        Prepared for institutional readers ahead of January 2027 briefings in Davos and St. Moritz. Independent publication; neither affiliated with nor endorsed by the World Economic Forum.
                      </p>
                    </div>
                  </div>

                  {/* DSJ 2019 Inaugural Issue Thumbnail (Placeholder for future edit) */}
                  <div className="bg-[#FBF9F5] border border-[#E2DBD0] p-5 flex flex-col sm:flex-row gap-5 items-center">
                    <div className="w-28 aspect-[3/4] shrink-0 border border-[#1C1917] bg-[#F3EFE6] overflow-hidden">
                      <img
                        src={INAUGURAL_2019_COVER}
                        alt="Digital Securities Journal 2019 Inaugural Issue archival cover thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[#57534E]">
                        Founding Archive · Placeholder Preview
                      </div>
                      <h4 className="font-display text-lg font-semibold text-[#1C1917] mt-1">
                        DSJ 2019 Inaugural Issue
                      </h4>
                      <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                        Archival cover thumbnail reserved for our founding 2019 digital securities monograph (cover &amp; contents pending final archival upload).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Table of Contents & Print Request */}
                <div className="lg:col-span-7">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#57534E]">
                    Print-to-Digital Archive · WEF 2027 Special Edition
                  </div>
                  <h2 className="font-display text-3xl font-semibold text-[#1C1917] mt-2">
                    The Architecture of Investor Rights
                  </h2>
                  <p className="text-base text-[#57534E] mt-4 leading-relaxed max-w-2xl">
                    Every feature in our print special edition links directly to a source-verified digital folio with full editorial disclosures and correction histories.
                  </p>

                  <div className="mt-7 border-t border-[#E2DBD0] divide-y divide-[#E2DBD0]">
                    {PRINT_TOC.map((entry, idx) => {
                      const targetArticle = LAUNCH_ARTICLES[idx];
                      return (
                        <button
                          key={entry.num}
                          type="button"
                          onClick={() => targetArticle && setActiveArticleId(targetArticle.id)}
                          className="w-full min-h-[44px] py-3.5 flex items-baseline justify-between gap-4 text-left group cursor-pointer"
                        >
                          <div className="flex items-baseline gap-4">
                            <span className="font-mono text-xs text-[#78350F] tabular-nums">
                              {entry.num}
                            </span>
                            <div>
                              <span className="font-display text-lg font-medium text-[#1C1917] group-hover:text-[#1E3A8A] transition-colors">
                                {entry.title}
                              </span>
                              <div className="font-mono text-[11px] uppercase tracking-wider text-[#57534E] mt-0.5">
                                {entry.desk}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-[#57534E] tabular-nums shrink-0">
                            {entry.page}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => openInquiry('print', 'DSJ WEF 2027 Special Edition')}
                      className="min-h-[44px] px-5 py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Request Print Edition
                    </button>
                    <button
                      type="button"
                      onClick={() => openInquiry('sponsor', 'DSJ WEF 2027 Special Edition')}
                      className="min-h-[44px] px-5 py-2.5 border border-[#E2DBD0] text-[#1C1917] text-xs font-medium rounded hover:border-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Sponsor This Edition
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Homepage Events Feature */}
            <EventsSection
              mode="preview"
              onOpenEventsTab={() => openTopView('events')}
              onRequestRoadshow={() => openInquiry('roadshow')}
              onRegisterEvent={(title) => openInquiry('event', title)}
            />

            {/* 5. Three Editorial Desks & Fact-Checked Launch Archive */}
            <section id="desks" className="max-w-6xl mx-auto px-6 py-14 border-b border-[#E2DBD0]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E2DBD0]">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#57534E]">
                    Three Editorial Desks &amp; Research Taxonomy
                  </div>
                  <h2 className="font-display text-3xl font-semibold text-[#1C1917] mt-2">
                    Launch Essays &amp; Working Papers
                  </h2>
                </div>

                {/* Interactive Desk Filter Bar */}
                <div className="inline-flex flex-wrap p-1 bg-[#F3EFE6] border border-[#E2DBD0] rounded-md self-start">
                  {(['All', 'Markets', 'Infrastructure', 'Ownership & Governance'] as const).map(
                    (desk) => (
                      <button
                        key={desk}
                        type="button"
                        onClick={() => setSelectedDesk(desk)}
                        className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedDesk === desk
                            ? 'bg-[#1C1917] text-[#FBF9F5]'
                            : 'text-[#57534E] hover:text-[#1C1917]'
                        }`}
                      >
                        {desk === 'All' ? 'All Desks' : desk}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col justify-between border-t border-[#1C1917]/20 pt-5"
                  >
                    <div>
                      {article.image && (
                        <div className="mb-4 aspect-[4/3] border border-[#E2DBD0] bg-[#F3EFE6] overflow-hidden">
                          {!cardImgErrors[article.id] ? (
                            <img
                              src={article.image}
                              alt={article.title}
                              onError={() =>
                                setCardImgErrors((prev) => ({ ...prev, [article.id]: true }))
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-4 text-center">
                              <span className="font-display text-sm text-[#57534E]">
                                {article.desk}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Zero-Pill Metadata Discipline */}
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#57534E]">
                        <span className="text-[#1E3A8A] font-medium">{article.desk}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.classification}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-2.5 leading-snug">
                        <button
                          type="button"
                          onClick={() => setActiveArticleId(article.id)}
                          className="text-left hover:text-[#1E3A8A] transition-colors cursor-pointer"
                        >
                          {article.title}
                        </button>
                      </h3>

                      <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                        {article.standfirst}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#E2DBD0] flex items-center justify-between gap-4">
                      <span className="font-mono text-[11px] text-[#57534E]">
                        Verified {article.verifiedDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveArticleId(article.id)}
                        className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-medium text-[#1C1917] hover:text-[#1E3A8A] cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Read Essay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 6. Homepage Resources & Market Maps Preview */}
            <ResourcesSection
              mode="preview"
              onOpenResourcesTab={() => openTopView('resources')}
            />

            {/* 7. Homepage Newsletter Scraper & Mailing List Subscription */}
            <NewsletterDesk />

            {/* 8. Contribute vs Sponsor Separation + Contact Email */}
            <section className="max-w-6xl mx-auto px-6 py-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-7 flex flex-col justify-between gap-6">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
                      Editorial Submissions
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-2">
                      Contribute an Article or Working Paper
                    </h3>
                    <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                      We invite practitioners, market-structure researchers, custodians, and legal scholars to submit rigorous reporting, technical architectures, and empirical servicing analyses.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => openInquiry('contribute')}
                      className="min-h-[44px] px-5 py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Submit Editorial Pitch
                    </button>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Editorial%20Pitch`}
                      className="text-xs font-mono text-[#57534E] hover:text-[#1E3A8A] underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-7 flex flex-col justify-between gap-6">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
                      Sponsorship &amp; Commercial Enquiries
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-2">
                      Sponsor an Edition, Symposium, or Roadshow
                    </h3>
                    <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                      Underwriting sustains print production, St. Moritz and Bengaluru convenings, and open archival research. Sponsored supplements are strictly separated from independent editorial judgment.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => openInquiry('sponsor')}
                      className="min-h-[44px] px-5 py-2.5 border border-[#1C1917] text-[#1C1917] text-xs font-medium rounded hover:bg-[#1C1917] hover:text-[#FBF9F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Request Sponsorship Prospectus
                    </button>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Sponsorship%20%26%20Partnership%20Enquiry`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E3A8A] hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{CONTACT_EMAIL}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[#E2DBD0] pt-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#57534E]">
                  Editorial Independence Statement
                </div>
                <p className="text-xs text-[#57534E] mt-2 max-w-4xl leading-relaxed">
                  Digital Securities Journal separates Reporting, Analysis, Opinion, Working Papers, Proposed Architectures, and Sponsored Content across every print and digital edition. Market figures record exact measurement bases (flow vs. custody stock vs. eligible universe).
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Quiet Archival Footer */}
      <footer className="border-t border-[#E2DBD0] bg-[#F3EFE6]">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-4 text-xs text-[#57534E]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-display font-semibold text-[#1C1917]">
                Digital Securities Journal
              </span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>The operating system of onchain capital markets</span>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono text-[#1E3A8A] hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="pt-4 border-t border-[#E2DBD0] flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider">
            <button
              type="button"
              onClick={() => openTopView('standards')}
              className="min-h-[36px] hover:text-[#1C1917] cursor-pointer"
            >
              Standards
            </button>
            <button
              type="button"
              onClick={() => openTopView('events')}
              className="min-h-[36px] hover:text-[#1C1917] cursor-pointer"
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => openTopView('resources')}
              className="min-h-[36px] hover:text-[#1C1917] cursor-pointer"
            >
              Resources
            </button>
            <button
              type="button"
              onClick={() => openTopView('privacy')}
              className="min-h-[36px] hover:text-[#1C1917] cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => openTopView('editorial')}
              className="min-h-[36px] hover:text-[#1C1917] cursor-pointer"
            >
              Editorial Policy
            </button>
            <button
              type="button"
              onClick={() => openTopView('terms')}
              className="min-h-[36px] hover:text-[#1C1917] cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </footer>

      {/* Compact Cookie Consent Banner */}
      {!cookieDismissed && (
        <aside
          aria-label="Cookie notice"
          className="fixed bottom-4 left-4 right-4 z-40 max-w-xl ml-auto bg-[#FBF9F5] border border-[#1C1917] px-4 py-3 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <p className="text-xs text-[#57534E] leading-snug">
            Essential storage only—zero ad trackers. Read our{' '}
            <button
              type="button"
              onClick={() => openTopView('privacy')}
              className="text-[#1E3A8A] underline cursor-pointer"
            >
              Privacy Policy
            </button>.
          </p>
          <button
            type="button"
            onClick={acknowledgeCookies}
            className="min-h-[36px] px-4 py-1.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] shrink-0 cursor-pointer"
          >
            Acknowledge
          </button>
        </aside>
      )}

      {/* Article Reader Modal */}
      {activeArticle && (
        <ArticleReaderModal
          article={activeArticle}
          allArticles={LAUNCH_ARTICLES}
          onClose={() => setActiveArticleId(null)}
          onSelectArticle={(id) => setActiveArticleId(id)}
        />
      )}

      {/* Primary Subscribe Modal */}
      {subscribeOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1C1917]/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Subscribe to Digital Securities Journal"
        >
          <div className="bg-[#FBF9F5] border border-[#E2DBD0] max-w-md w-full p-7 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#78350F]">
                  Institutional Dispatch
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1">
                  Subscribe to the Journal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSubscribeOpen(false)}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {subDone ? (
              <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-5 space-y-2">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A8A]">
                  <Check className="w-4 h-4" />
                  <span>Subscription Confirmed</span>
                </div>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Registered <span className="font-mono text-xs text-[#1C1917]">{subEmail}</span> ({subRole}). Enquiries:{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1E3A8A] underline">
                    {CONTACT_EMAIL}
                  </a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeModalSubmit} className="space-y-4" noValidate>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Receive WEF 2027 Special Edition dispatches, verified research roundups, and St. Moritz / Bengaluru event invitations.
                </p>

                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={subTrap}
                    onChange={(e) => setSubTrap(e.target.value)}
                  />
                </div>

                <label className="block">
                  <span className="font-mono text-xs text-[#57534E]">Institutional Email</span>
                  <input
                    type="email"
                    required
                    placeholder="name@institution.com"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="mt-1.5 w-full min-h-[44px] bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-xs text-[#57534E]">Primary Function</span>
                  <select
                    value={subRole}
                    onChange={(e) => setSubRole(e.target.value)}
                    className="mt-1.5 w-full min-h-[44px] bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
                  >
                    <option>Asset Servicer / Custodian</option>
                    <option>CSD / Clearing Infrastructure</option>
                    <option>Legal / Regulatory Supervision</option>
                    <option>Asset Manager / Issuer</option>
                    <option>Protocol &amp; Agentic Systems</option>
                  </select>
                </label>

                {subError && <p className="text-xs text-[#78350F]">{subError}</p>}

                <button
                  type="submit"
                  disabled={subLoading}
                  className="w-full min-h-[44px] py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {subLoading ? 'Subscribing…' : 'Confirm Subscription'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Inquiry Modal (Contribute / Sponsor / Print / Roadshow / Event) */}
      {inquiryMode && (
        <div
          className="fixed inset-0 z-50 bg-[#1C1917]/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FBF9F5] border border-[#E2DBD0] max-w-md w-full p-7 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#1E3A8A]">
                  {inquiryMode === 'contribute'
                    ? 'Editorial Desk'
                    : inquiryMode === 'sponsor'
                    ? 'Commercial Partnerships'
                    : inquiryMode === 'roadshow'
                    ? 'Institutional Roadshows'
                    : inquiryMode === 'event'
                    ? '2027 Symposia'
                    : 'Print Circulation'}
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1">
                  {inquiryMode === 'contribute'
                    ? 'Submit Article Proposal'
                    : inquiryMode === 'sponsor'
                    ? 'Edition Sponsorship Enquiry'
                    : inquiryMode === 'roadshow'
                    ? 'Request a Roadshow'
                    : inquiryMode === 'event'
                    ? inquiryContext || 'Event Invitation Request'
                    : 'Request Print Copy'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInquiryMode(null)}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-5 space-y-2">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A8A]">
                  <Check className="w-4 h-4" />
                  <span>Enquiry Recorded</span>
                </div>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Thank you, {inquiryName}. Your {inquiryMode} request has been logged. Direct correspondence:{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-xs text-[#1E3A8A] underline">
                    {CONTACT_EMAIL}
                  </a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4" noValidate>
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={inquiryTrap}
                    onChange={(e) => setInquiryTrap(e.target.value)}
                  />
                </div>

                <label className="block">
                  <span className="font-mono text-xs text-[#57534E]">Full Name &amp; Affiliation</span>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="mt-1.5 w-full min-h-[44px] bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-xs text-[#57534E]">Email</span>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="mt-1.5 w-full min-h-[44px] bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-xs text-[#57534E]">
                    {inquiryMode === 'contribute'
                      ? 'Proposed Desk & Abstract'
                      : inquiryMode === 'roadshow'
                      ? 'Preferred City, Date & Audience'
                      : inquiryMode === 'sponsor'
                      ? 'Edition / Event / Scope Interest'
                      : 'Notes or Delivery Details'}
                  </span>
                  <textarea
                    rows={3}
                    value={inquiryNote}
                    onChange={(e) => setInquiryNote(e.target.value)}
                    className="mt-1.5 w-full bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
                  />
                </label>

                {inquiryError && <p className="text-xs text-[#78350F]">{inquiryError}</p>}

                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="w-full min-h-[44px] py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {inquiryLoading ? 'Sending…' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
