'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  ShieldAlert,
  FileCheck2,
  GitPullRequest,
  FileSpreadsheet,
  QrCode,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileSearch,
  Building2,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function DashboardPage() {
  const { locale, t, toLocalDigits, currentUser } = useApp();
  const [metrics, setMetrics] = useState({
    totalParcels: 12,
    highRiskAlerts: 7,
    pendingOcr: 2,
    activeMutations: 2,
    receiptsCount: 4,
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-300">
              {currentUser.role.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">
              {locale === 'bn' ? currentUser.designationBn : currentUser.designation}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-pine-950 dark:text-pine-100 mt-1">
            {locale === 'bn' ? 'ভূমি কর্মকর্তা ও অডিট অপারেশনাল ড্যাশবোর্ড' : 'Officer Operational Intelligence Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {locale === 'bn'
              ? 'ভূমি রেকর্ড যাচাই, ওসিআর পাঠোদ্ধার এবং নামজারি ওয়ার্কফ্লো পর্যবেক্ষণ'
              : 'Land records verification, OCR extraction queue & mutation workflow metrics'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            {locale === 'bn' ? 'সিস্টেম স্ট্যাটাস: স্বাভাবিক' : 'System: Operational'}
          </span>
        </div>
      </div>

      {/* 5 Key Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Parcels */}
        <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">{locale === 'bn' ? 'মোট পার্সেল' : 'Total Parcels'}</span>
            <Building2 className="w-4 h-4 text-pine-600" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-pine-950 dark:text-pine-100">
              {toLocalDigits(metrics.totalParcels)}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">{locale === 'bn' ? '১২টি সিন্থেটিক দৃশ্যপট' : '12 synthetic scenarios'}</p>
          </div>
        </div>

        {/* High Risk Alerts */}
        <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-red-200 dark:border-red-900/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-600 dark:text-red-400 mb-2">
            <span className="text-xs font-medium">{locale === 'bn' ? 'উচ্চ ঝুঁকি সতর্কতা' : 'High Risk Flags'}</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
              {toLocalDigits(metrics.highRiskAlerts)}
            </span>
            <p className="text-[10px] text-red-500 mt-0.5">{locale === 'bn' ? 'দ্বৈত বিক্রয় ও অমিল' : 'Double-sale & mismatch'}</p>
          </div>
        </div>

        {/* Pending OCR */}
        <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-amber-200 dark:border-amber-900/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-medium">{locale === 'bn' ? 'ওসিআর যাচাই কিউ' : 'Pending OCR Jobs'}</span>
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {toLocalDigits(metrics.pendingOcr)}
            </span>
            <p className="text-[10px] text-amber-500 mt-0.5">{locale === 'bn' ? 'পর্যালোচনা অপেক্ষমাণ' : 'Awaiting review'}</p>
          </div>
        </div>

        {/* Mutation Cases */}
        <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-blue-200 dark:border-blue-900/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <span className="text-xs font-medium">{locale === 'bn' ? 'নামজারি নথি' : 'Mutation Cases'}</span>
            <GitPullRequest className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {toLocalDigits(metrics.activeMutations)}
            </span>
            <p className="text-[10px] text-blue-500 mt-0.5">{locale === 'bn' ? 'এসিল্যান্ড পর্যালোচনাধীন' : 'Under AC Land review'}</p>
          </div>
        </div>

        {/* Receipts Issued */}
        <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-medium">{locale === 'bn' ? 'ডিজিটাল রসিদ' : 'Ed25519 Receipts'}</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {toLocalDigits(metrics.receiptsCount)}
            </span>
            <p className="text-[10px] text-emerald-500 mt-0.5">{locale === 'bn' ? 'জিরো-পিআইআই স্বাক্ষরিত' : 'Signed & Zero-PII'}</p>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-pine-950 dark:text-pine-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-pine-600" />
          <span>{locale === 'bn' ? 'দ্রুত অ্যাকশন ও কার্যপরিচালনা' : 'Operational Quick Actions'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link
            href={`/${locale}/review-queue`}
            className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm hover:border-pine-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-pine-700 flex items-center justify-between">
              <span>{t.nav.reviewQueue}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'bn'
                ? 'স্ক্যানকৃত দলিলের ওসিআর ফলাফল পাশাপাশি রেখে সংশোধন ও অনুমোদন করুন।'
                : 'Side-by-side OCR review and field-level confidence validation.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/mutation-cases`}
            className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm hover:border-pine-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-pine-700 flex items-center justify-between">
              <span>{t.nav.mutationCases}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'bn'
                ? 'বিধিবদ্ধ চেকলিস্ট পূরণ, শুনানির আদেশ ও ই-নামজারি ফাইল নিষ্পত্তি।'
                : 'Statutory verification checklist and multi-stage mutation execution.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/risk-alerts`}
            className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm hover:border-pine-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-pine-700 flex items-center justify-between">
              <span>{t.nav.riskAlerts}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'bn'
                ? '১৫টি বিধিবদ্ধ নিয়মের ব্যাখ্যাযোগ্য অসঙ্গতি পর্যবেক্ষণ ও প্রমাণক।'
                : '15 deterministic fraud rules with transparent evidence breakdown.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/upload`}
            className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm hover:border-pine-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-pine-50 dark:bg-pine-900/40 text-pine-600 dark:text-pine-400 flex items-center justify-center mb-3">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-pine-700 flex items-center justify-between">
              <span>{t.nav.upload}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'bn'
                ? 'পুরাতন ঐতিহাসিক দলিল বা খতিয়ান আপলোড ও স্বয়ংক্রিয় প্রসেসিং।'
                : 'Upload deed scans or old khatians for SHA-256 byte hashing and OCR.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/buyer-report`}
            className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm hover:border-pine-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-pine-700 flex items-center justify-between">
              <span>{t.nav.buyerReport}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'bn'
                ? 'ক্রেতার জমি ক্রয়-পূর্ব সার্বিক যাচাই ও এ৪ প্রতিবেদন প্রস্তুতকরণ।'
                : 'Pre-purchase title continuity audit & printable A4 due diligence report.'}
            </p>
          </Link>

          <Link
            href={`/${locale}/verify`}
            className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm hover:border-pine-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100 group-hover:text-pine-700 flex items-center justify-between">
              <span>{t.nav.verifyQr}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'bn'
                ? 'এড২৫৫১৯ ক্রিপ্টোগ্রাফিক কিউআর রসিদ ও কপির বিশুদ্ধতা পরীক্ষা।'
                : 'Ed25519 digital signature and document copy hash integrity checker.'}
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}
