import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Article } from '../data/journalData';

interface ArticleReaderModalProps {
  article: Article;
  onClose: () => void;
  onSelectArticle: (id: string) => void;
  allArticles: Article[];
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  onSelectArticle,
  allArticles,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    setProgress(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [article.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) {
      setProgress(100);
      return;
    }
    setProgress(Math.min(100, Math.round((el.scrollTop / max) * 100)));
  };

  const related = allArticles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#FBF9F5] overflow-y-auto"
      ref={scrollRef}
      onScroll={handleScroll}
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
    >
      {/* Thin editorial reading depth bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-[#E2DBD0] z-50">
        <div
          className="h-full bg-[#1E3A8A] transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top return bar */}
      <div className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E2DBD0]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 min-h-[44px] text-sm text-[#1C1917] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A8A]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </button>

          <div className="hidden sm:flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#57534E] truncate">
            <span>{article.desk}</span>
            <span aria-hidden="true">/</span>
            <span>{article.classification}</span>
            <span aria-hidden="true">/</span>
            <span className="tabular-nums">{progress}% read</span>
          </div>
        </div>
      </div>

      {/* 70 / 30 Asymmetric Reading Canvas */}
      <article className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <header className="max-w-3xl pb-10 border-b border-[#E2DBD0]">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#57534E]">
            <span className="text-[#1E3A8A] font-medium">{article.desk}</span>
            <span aria-hidden="true">·</span>
            <span>{article.classification}</span>
            <span aria-hidden="true">·</span>
            <span>{article.issue}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] mt-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#57534E] mt-5 leading-relaxed max-w-2xl">
            {article.standfirst}
          </p>

          <div className="mt-6 pt-5 border-t border-[#E2DBD0] flex flex-wrap items-center justify-between gap-4 text-sm text-[#57534E]">
            <div>
              <span className="font-medium text-[#1C1917]">{article.author}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{article.authorRole}</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-wider tabular-nums">
              Published {article.publishedDate} · Sources verified {article.verifiedDate}
            </div>
          </div>
        </header>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 70% Main Narrative */}
          <div className="lg:col-span-8 max-w-prose">
            {article.image && (
              <figure className="mb-10">
                {!imgError ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full aspect-[16/10] object-cover border border-[#E2DBD0]"
                  />
                ) : (
                  <div className="w-full aspect-[16/10] bg-[#F3EFE6] border border-[#E2DBD0] flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen className="w-6 h-6 text-[#78350F] mb-2" />
                    <span className="font-display text-lg text-[#1C1917]">{article.title}</span>
                  </div>
                )}
                {article.imageCaption && (
                  <figcaption className="text-xs font-serif italic text-[#57534E] mt-2.5">
                    {article.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="space-y-6 text-[17px] leading-[1.8] text-[#1C1917]">
              {article.paragraphs.map((para, idx) => (
                <React.Fragment key={idx}>
                  <p className={idx === 0 ? 'drop-cap' : ''}>{para}</p>
                  {idx === 1 && article.pullQuote && (
                    <blockquote className="my-10 py-6 border-t border-b border-[#E2DBD0] text-center">
                      <p className="font-display italic text-2xl sm:text-3xl text-[#1C1917] leading-snug">
                        “{article.pullQuote}”
                      </p>
                    </blockquote>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Sources & Citations */}
            <section className="mt-12 pt-8 border-t border-[#E2DBD0]">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#57534E] mb-4">
                Primary Sources &amp; References
              </h2>
              <ol className="space-y-2.5 text-sm text-[#57534E] list-decimal list-inside">
                {article.sources.map((src, i) => (
                  <li key={i} className="leading-relaxed">
                    {src}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* 30% Margin Notes & Provenance Rail */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-20">
            {article.marginNotes.map((note, idx) => (
              <div key={idx} className="bg-[#F3EFE6] border border-[#E2DBD0] p-5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#78350F] mb-1.5">
                  Margin Note · {note.anchor}
                </div>
                <h3 className="font-display text-base font-semibold text-[#1C1917] mb-2">
                  {note.title}
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{note.body}</p>
              </div>
            ))}

            {article.measurementBasis && (
              <div className="border-t border-[#E2DBD0] pt-5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#1E3A8A] mb-1.5">
                  Measurement Basis
                </div>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  {article.measurementBasis}
                </p>
              </div>
            )}

            <div className="border-t border-[#E2DBD0] pt-5 space-y-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#57534E] mb-1">
                  Editorial Disclosure
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed">{article.disclosure}</p>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#57534E] mb-1">
                  Updates &amp; Corrections
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {article.correctionHistory}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Further Reading */}
        <section className="mt-16 pt-10 border-t border-[#E2DBD0]">
          <div className="font-mono text-xs uppercase tracking-widest text-[#57534E] mb-6">
            Further in This Edition
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {related.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectArticle(item.id)}
                className="text-left border-t border-[#E2DBD0] pt-4 group cursor-pointer"
              >
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#57534E]">
                  {item.desk} · {item.classification}
                </div>
                <h3 className="font-display text-xl font-semibold text-[#1C1917] group-hover:text-[#1E3A8A] transition-colors mt-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[#57534E] mt-2 line-clamp-2">{item.standfirst}</p>
              </button>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};
