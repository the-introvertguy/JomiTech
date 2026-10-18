'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { HelpCircle, ShieldAlert, CheckCircle2, AlertOctagon, BookOpen, Layers } from 'lucide-react';

export default function HelpPage() {
  const { locale, t } = useApp();

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Title */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4">
        <div className="flex items-center gap-2.5 text-pine-800 dark:text-pine-200">
          <BookOpen className="w-6 h-6 text-pine-600 dark:text-pine-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t.nav.help}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {locale === 'bn'
            ? 'জমিটেক প্ল্যাটফর্মের কার্যপদ্ধতি, ঝুঁকি বিশ্লেষণ নীতি ও আইনি সীমাবদ্ধতা।'
            : 'Operational methodology, explainable fraud-prevention logic, and civic limitations.'}
        </p>
      </div>

      {/* Mandatory Civic Disclaimer Box */}
      <div className="p-5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-400">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{t.demoNotice}</span>
        </div>
        <p className="text-xs leading-relaxed">
          {locale === 'bn'
            ? 'জমিটেক কোনো সরকারি দপ্তর, সাব-রেজিস্ট্রি বা ভূমি রেকর্ড কোর্ট নয়। এটি ল্যান্ডটেক ২০২৬ হ্যাকাথনের জন্য নির্মিত একটি কৃত্রিম বুদ্ধিমত্তা ও অ্যালগরিদমিক গবেষণা প্রোটোটাইপ। অ্যাপ্লিকেশনের সমস্ত তথ্য, খতিয়ান ও দলিল কাল্পনিক সিন্থেটিক ডেটা। এই বিশ্লেষণের ফলাফলকে কোনো প্রকার আইনি প্রত্যয়ন বা স্বত্বাধিকারের প্রমাণ হিসেবে ব্যবহার করা যাবে না।'
            : 'JomiTech is not an official government entity, sub-registry, or land court. It is an algorithmic civic intelligence prototype built for LandTech 2026. All data, khatians, and deeds are synthetic. Risk findings indicate statistical or factual discrepancies requiring official verification, not certified proof of title or final legal fraud determinations.'}
        </p>
      </div>

      {/* Modules Explanation */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-pine-950 dark:text-pine-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-pine-600 dark:text-pine-400" />
          <span>{locale === 'bn' ? 'কার্যপ্রণালী ও সমস্যা সমাধান' : 'Core Modules & Problem Solved'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-pine-800 dark:text-pine-300">
              P3: Catch Fraud & Double-Selling
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {locale === 'bn'
                ? 'একই দাগের জমি একই বা ভিন্ন ব্যক্তির নিকট স্বল্প ব্যবধানে একাধিকবার বিক্রি, মালিকের অংশের অতিরিক্ত জমি বিক্রয়, অথবা পূর্ববর্তী খতিয়ানে নাম না থাকা বিক্রেতাকে শনাক্ত করতে ১২টি নির্ধারিত নিয়ম কাজ করে।'
                : 'Deterministic rule engine catching conflicting sales, un-mutated transfers, fractional share exceedances, and vendor title mismatches without black-box scoring.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-pine-800 dark:text-pine-300">
              P1: Digitize Old Records
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {locale === 'bn'
                ? 'বাংলা ও ইংরেজি দলিলের ওসিআর এবং হিউরিস্টিক এক্সট্রাকশন। মানুষের অনুমোদন ছাড়া কোনো তথ্য স্বয়ংক্রিয়ভাবে মূল সার্চ ডাটাবেজে অন্তর্ভুক্ত হয় না।'
                : 'OCR extraction with side-by-side human-in-the-loop verification before posting into searchable parcel archives.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-pine-800 dark:text-pine-300">
              P2: Verify Deeds & Ownership
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {locale === 'bn'
                ? 'ব্লকচেইনের অপ্রয়োজনীয় জটিলতা ছাড়া শক্তিশালী SHA-256 বাইট হ্যাশিং ও Ed25519 ক্রিপ্টোগ্রাফিক ডিজিটাল সিগনেচার। কিউআর কোডে কোনো ব্যক্তিগত ডেটা ফাঁস হয় না।'
                : 'Cryptographic SHA-256 hashing and Ed25519 signatures providing verifiable integrity receipts without privacy leakage.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-pine-800 dark:text-pine-300">
              P4 & P5: Mutation & Buyer Report
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {locale === 'bn'
                ? 'সিমুলেটেড ই-নামজারি ট্র্যাকার এবং ক্রেতাদের জন্য এ৪ ফরম্যাটে প্রিন্টযোগ্য দ্বি-ভাষিক ডিউ-ডিলিজেন্স প্রতিবেদন।'
                : 'Simulated mutation state transitions and A4 bilingual printable due-diligence report highlighting evidence, conflicts, and next steps.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
