'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  GitPullRequest,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const { locale, t, formatNum } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/${locale}/search`);
    }
  };

  // 12 synthetic showcase scenarios for one-click diligence testing
  const sampleScenarios = [
    {
      id: 'PCL-DH-101',
      titleBn: 'দৃশ্যকল্প ১: নিষ্কন্টক মালিকানা ধারাবাহিকতা',
      titleEn: 'Scenario 1: Clean Chain of Title',
      mouzaBn: 'মৌজা: তেজগাঁও, দাগ ১০১ (CS → BS)',
      mouzaEn: 'Mouza: Tejgaon, Plot 101 (CS → BS)',
      risk: 'low',
      riskBn: 'স্বাভাবিক (০)',
      riskEn: 'Low Risk (0)',
      href: `/${locale}/parcel/PCL-DH-101`,
    },
    {
      id: 'PCL-DH-502',
      titleBn: 'দৃশ্যকল্প ২: সম্ভাব্য দ্বৈত বিক্রয় (Double-Selling)',
      titleEn: 'Scenario 2: Possible Double-Sale Detected',
      mouzaBn: 'মৌজা: গুলশান, দাগ ৫০২ (১৫ দিনে দুই দলিল)',
      mouzaEn: 'Mouza: Gulshan, Plot 502 (2 deeds in 15 days)',
      risk: 'high',
      riskBn: 'উচ্চ ঝুঁকি (৬৫)',
      riskEn: 'High Risk (65)',
      href: `/${locale}/parcel/PCL-DH-502`,
    },
    {
      id: 'PCL-DH-901',
      titleBn: 'দৃশ্যকল্প ১২: বৈধ সহ-মালিকানা ও আংশিক হস্তান্তর',
      titleEn: 'Scenario 12: Valid Co-ownership & Partial Share',
      mouzaBn: 'মৌজা: ধানমন্ডি, দাগ ৯০১ (০.১৬৬৬ অংশ বিক্রয়)',
      mouzaEn: 'Mouza: Dhanmondi, Plot 901 (0.1666 share transfer)',
      risk: 'low',
      riskBn: 'বৈধ অংশ (০)',
      riskEn: 'Valid Share (0)',
      href: `/${locale}/parcel/PCL-DH-901`,
    },
  ];

  return (
    <div className="space-y-10">
      
      {/* Civic Hero Section with Primary Search */}
      <section className="bg-gradient-to-b from-pine-900 to-pine-950 text-white rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-pine-800">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          {/* Subtle cadastral plot watermark */}
          <svg width="400" height="400" viewBox="0 0 100 100" fill="none">
            <polygon points="10,20 80,10 90,80 30,95" stroke="#ffffff" strokeWidth="2" />
            <line x1="10" y1="20" x2="90" y2="80" stroke="#ffffff" strokeWidth="1" />
            <line x1="80" y1="10" x2="30" y2="95" stroke="#ffffff" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-800/80 border border-pine-700/60 text-pine-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pine-300" />
            <span>LandTech 2026 • {t.risk.ruleCodes.POSSIBLE_DOUBLE_SALE}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {locale === 'bn' ? (
              <>
                ভূমি রেকর্ড যাচাই ও <br className="hidden sm:inline" />
                <span className="text-pine-300">প্রতারণা প্রতিরোধক</span> বিশ্লেষণ ব্যবস্থা
              </>
            ) : (
              <>
                Explainable Land Record Intelligence & <br className="hidden sm:inline" />
                <span className="text-pine-300">Fraud Prevention</span> Platform
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-pine-100/90 leading-relaxed max-w-2xl">
            {locale === 'bn'
              ? 'খতিয়ানের ধারাবাহিকতা পরীক্ষা, দলিলের সত্যতা নিরূপণ, এবং একই জমি একাধিক ব্যক্তির নিকট বিক্রয়ের ঝুঁকি তাৎক্ষণিকভাবে শনাক্ত করুন।'
              : 'Trace ownership lineage from CS to BS surveys, verify digital document integrity, and spot conflicting or double-selling transfers before purchasing.'}
          </p>

          {/* Obvious Parcel Search Bar */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white dark:bg-civic-darkCard p-2 rounded-xl shadow-lg border border-pine-200 dark:border-pine-700">
              <div className="flex-1 flex items-center gap-2.5 px-3">
                <Search className="w-5 h-5 text-pine-600 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    locale === 'bn'
                      ? 'দাগ নম্বর (যেমন ৫০২), খতিয়ান নম্বর, বা পার্সেল আইডি...'
                      : 'Enter Dag / Plot No. (e.g. 502), Khatian, or Parcel ID...'
                  }
                  className="w-full py-2 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-pine-700 hover:bg-pine-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>{t.actions.search}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Filter Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-pine-200">
            <span className="font-semibold text-pine-300">
              {locale === 'bn' ? 'দ্রুত পরীক্ষা:' : 'Quick Try:'}
            </span>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/search?q=502`)}
              className="px-2 py-0.5 rounded bg-pine-800/80 hover:bg-pine-700 border border-pine-600/50 underline transition-colors"
            >
              {locale === 'bn' ? 'দাগ ৫০২ (দ্বৈত বিক্রয়)' : 'Dag 502 (Double-Sale)'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/search?q=101`)}
              className="px-2 py-0.5 rounded bg-pine-800/80 hover:bg-pine-700 border border-pine-600/50 underline transition-colors"
            >
              {locale === 'bn' ? 'দাগ ১০১ (নিষ্কন্টক)' : 'Dag 101 (Clean)'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/search?q=901`)}
              className="px-2 py-0.5 rounded bg-pine-800/80 hover:bg-pine-700 border border-pine-600/50 underline transition-colors"
            >
              {locale === 'bn' ? 'দাগ ৯০১ (সহ-মালিকানা)' : 'Dag 901 (Partial Share)'}
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Pillar Service Modules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-pine-950 dark:text-pine-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-pine-600 dark:text-pine-400" />
            <span>{locale === 'bn' ? 'মূল যাচাই সেবাসমূহ' : 'Core Verification Modules'}</span>
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {locale === 'bn' ? 'নাগরিক ও ক্রেতা ডিলিজেন্স' : 'Citizen Due Diligence'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Module 1: Parcel Search */}
          <Link
            href={`/${locale}/search`}
            className="group p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 hover:border-pine-500 dark:hover:border-pine-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-pine-100 dark:bg-pine-900/60 text-pine-700 dark:text-pine-300 flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-pine-600 dark:group-hover:text-pine-400 transition-colors">
                {t.nav.search}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {locale === 'bn'
                  ? 'বিভাগ, জেলা, থানা ও মৌজা ভিত্তিক খতিয়ান ও দাগের বিস্তারিত তথ্য অনুসন্ধান।'
                  : 'Multi-parameter cadastral search across Division, District, Mouza and Dag.'}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-pine-600 dark:text-pine-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{t.actions.viewDetails}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Module 2: Check Before Buying */}
          <Link
            href={`/${locale}/buyer-report`}
            className="group p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 hover:border-pine-500 dark:hover:border-pine-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-emerald-600 transition-colors">
                {t.nav.buyerReport}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {locale === 'bn'
                  ? 'জমি কেনার আগে এ৪ সাইজের সম্পূর্ণ প্রাক-ক্রয় ডিলিজেন্স প্রতিবেদন ও ঝুঁকি বিশ্লেষণ।'
                  : 'A4 due-diligence report detailing title continuity, conflicts, and missing records.'}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{t.actions.generateReport}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Module 3: QR Integrity Verification */}
          <Link
            href={`/${locale}/verify`}
            className="group p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 hover:border-pine-500 dark:hover:border-pine-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-teal-600 transition-colors">
                {t.nav.verifyQr}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {locale === 'bn'
                  ? 'SHA-256 হ্যাশ ও ডিজিটাল স্বাক্ষরিত রসিদের সত্যতা যাচাই। কোনো ব্যক্তিগত তথ্য প্রকাশ পায় না।'
                  : 'Verify document hash and Ed25519 signature status with zero privacy leakage.'}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{t.actions.verifyCopy}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Module 4: Mutation Tracker */}
          <Link
            href={`/${locale}/track-mutation`}
            className="group p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 hover:border-pine-500 dark:hover:border-pine-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-blue-600 transition-colors">
                {t.nav.trackMutation}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {locale === 'bn'
                  ? 'নামজারি মামলার অগ্রগতি ট্র্যাক করুন। কেবল স্টেজ ও তারিখ প্রদর্শিত হয়।'
                  : 'Track simulated mutation case progression using opaque tracking references.'}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{t.nav.trackMutation}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </section>

      {/* Synthetic Scenarios Testbed Showcase */}
      <section className="bg-white dark:bg-civic-darkCard rounded-xl p-6 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pine-100 dark:border-pine-800/60 pb-3">
          <div>
            <h2 className="text-base font-bold text-pine-950 dark:text-pine-100">
              {locale === 'bn' ? 'পরীক্ষামূলক সিন্থেটিক দৃশ্যকল্পসমূহ (১২টি দৃশ্যপট)' : 'Deterministic Scenario Showcase (12 Fixtures)'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {locale === 'bn'
                ? 'সরাসরি ক্লিক করে P3 ঝুঁকি ইঞ্জিন ও দ্বি-ভাষিক প্রতিবেদন যাচাই করুন।'
                : 'Click to inspect how the deterministic P3 engine evaluates fraud indicators.'}
            </p>
          </div>
          <Link
            href={`/${locale}/search`}
            className="text-xs font-semibold text-pine-700 dark:text-pine-300 hover:underline inline-flex items-center gap-1"
          >
            <span>{locale === 'bn' ? 'সকল দৃশ্যকল্প দেখুন' : 'View all 12 fixtures'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sampleScenarios.map((scen) => (
            <Link
              key={scen.id}
              href={scen.href}
              className="p-3.5 rounded-lg border border-pine-100 dark:border-pine-800 hover:border-pine-400 dark:hover:border-pine-600 bg-pine-50/30 dark:bg-pine-950/20 transition-colors flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-pine-700 dark:text-pine-300">
                    {scen.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scen.risk === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {locale === 'bn' ? scen.riskBn : scen.riskEn}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {locale === 'bn' ? scen.titleBn : scen.titleEn}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {locale === 'bn' ? scen.mouzaBn : scen.mouzaEn}
                </p>
              </div>

              <div className="text-[11px] font-semibold text-pine-600 dark:text-pine-400 flex items-center gap-1 pt-1">
                <span>{locale === 'bn' ? 'পার্সেল বিশ্লেষণ দেখুন' : 'Inspect parcel'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Civic Transparency Notice */}
      <section className="p-4 rounded-xl bg-pine-100/40 dark:bg-pine-950/40 border border-pine-200/80 dark:border-pine-800/80 text-xs text-pine-900 dark:text-pine-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">{t.demoNotice}:</strong>{' '}
            {t.risk.limitationNotice}
          </p>
        </div>
        <Link
          href={`/${locale}/help`}
          className="text-pine-700 dark:text-pine-300 font-bold underline shrink-0 hover:text-pine-800"
        >
          {locale === 'bn' ? 'নীতিমালা ও সীমাবদ্ধতা' : 'Methodology & Limitations'}
        </Link>
      </section>

    </div>
  );
}
