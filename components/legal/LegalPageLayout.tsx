'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { ChevronRight, Calendar, ShieldCheck, Printer, HelpCircle, ArrowUp } from 'lucide-react';

export interface PolicySectionItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  canonicalUrl: string;
  metaDescription: string;
  sections: PolicySectionItem[];
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  lastUpdated = 'August 2026',
  canonicalUrl,
  metaDescription,
  sections,
  children,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      {/* Head Metadata */}
      <title>{`${title} | GrowthZen Trends`}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={`${title} | GrowthZen Trends`} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      <Container className="flex flex-col gap-8">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Legal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">{title}</span>
        </nav>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official Policy
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Last Updated: {lastUpdated}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white border-l-2 border-emerald-500 pl-2.5">
                Table of Contents
              </h2>
              <nav className="flex flex-col gap-1">
                {sections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="py-1.5 px-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{idx + 1}. {section.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 shrink-0" />
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <HelpCircle className="w-4 h-4" /> Have questions? Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Policy Content Body */}
          <main className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs flex flex-col gap-8">
            <article className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {children}
            </article>

            {/* Back to top button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                &copy; GrowthZen Trends legal document.
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" /> Back to top
              </button>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default LegalPageLayout;
