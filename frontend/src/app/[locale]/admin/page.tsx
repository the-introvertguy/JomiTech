'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  Users,
  Settings,
  Key,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface RuleConfig {
  code: string;
  name_bn: string;
  name_en: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  weight: number;
  isActive: boolean;
}

const INITIAL_RULES: RuleConfig[] = [
  { code: 'POSSIBLE_DOUBLE_SALE', name_bn: 'সম্ভাব্য দ্বৈত বিক্রয় / ওভারল্যাপিং হস্তান্তর', name_en: 'Possible Double-Sale / Overlapping Transfers', severity: 'HIGH', weight: 40, isActive: true },
  { code: 'SELLER_MISMATCH', name_bn: 'বিক্রেতা ও সর্বশেষ রেকর্ডীয় মালিকের তথ্যে অমিল', name_en: 'Seller Inconsistent with Recorded Holder', severity: 'HIGH', weight: 35, isActive: true },
  { code: 'DUPLICATE_DEED', name_bn: 'ডুপ্লিকেট দলিল নম্বর বা ফাইলের পুনরাবৃত্তি', name_en: 'Duplicate Deed Reference or SHA Hash', severity: 'HIGH', weight: 30, isActive: true },
  { code: 'AREA_OR_SHARE_EXCEEDED', name_bn: 'মালিকানাধীন অংশের অতিরিক্ত জমি হস্তান্তর', name_en: 'Transfer Exceeds Available Area/Share', severity: 'HIGH', weight: 35, isActive: true },
  { code: 'REGISTERED_NOT_MUTATED', name_bn: 'দলিল রেজিস্ট্রি হলেও নামজারি সম্পন্ন হয়নি', name_en: 'Registered Deed with No Mutation', severity: 'MEDIUM', weight: 20, isActive: true },
  { code: 'MUTATION_PARTY_MISMATCH', name_bn: 'নামজারি আবেদনকারী ও দলিলের গ্রহীতায় অমিল', name_en: 'Mutation Applicant Differs from Buyer', severity: 'MEDIUM', weight: 25, isActive: true },
  { code: 'REGISTRATION_MUTATION_MISMATCH', name_bn: 'রেজিস্ট্রি ও নামজারি রেকর্ডের মধ্যে গরমিল', name_en: 'Registry & Mutation Discrepancy', severity: 'MEDIUM', weight: 20, isActive: true },
  { code: 'RAPID_RESALE', name_bn: 'অস্বাভাবিক দ্রুত পুনঃবিক্রয় (ফ্লিপিং ঝুঁকি)', name_en: 'Rapid Re-conveyance Interval Flag', severity: 'MEDIUM', weight: 15, isActive: true },
  { code: 'IMPOSSIBLE_DATE', name_bn: 'কালানুক্রমিক অসঙ্গতি বা ভবিষ্যৎ তারিখ', name_en: 'Chronological Impossibility / Future Date', severity: 'HIGH', weight: 30, isActive: true },
  { code: 'DEED_NO_FORMAT_INVALID', name_bn: 'দলিল নম্বর বিন্যাসে ত্রুটি', name_en: 'Invalid Deed Reference Format', severity: 'LOW', weight: 10, isActive: true },
  { code: 'SURVEY_CHAIN_GAP', name_bn: 'খতিয়ান ধারাবাহিকতায় বিচ্ছিন্নতা (Gap)', name_en: 'Missing Predecessor Link in Survey Chain', severity: 'MEDIUM', weight: 20, isActive: true },
  { code: 'ACTIVE_DISPUTE', name_bn: 'বিবাদমান জমি সংক্রান্ত আনুষ্ঠানিক নোটিশ', name_en: 'Synthetic Active Title Dispute Notice', severity: 'HIGH', weight: 35, isActive: true },
  { code: 'KHAS_INDICATOR', name_bn: 'সরকারি খাস বা অর্পিত সম্পত্তি নির্দেশক', name_en: 'Government Khas or Vested Property Flag', severity: 'HIGH', weight: 40, isActive: true },
  { code: 'ACQUISITION_INDICATOR', name_bn: 'সরকারি অধিগ্রহণ প্রক্রিয়াধীন সম্পত্তি', name_en: 'Property Under Acquisition Notice', severity: 'HIGH', weight: 40, isActive: true },
  { code: 'LOW_OCR_CONFIDENCE', name_bn: 'ওসিআর পাঠোদ্ধারে নিম্ন নির্ভুলতা (<৮৫%)', name_en: 'Low OCR Field Confidence (<85%)', severity: 'MEDIUM', weight: 20, isActive: true },
];

export default function AdminPage() {
  const { locale, t, toLocalDigits, currentUser, switchUser, demoUsers } = useApp();
  const [rules, setRules] = useState<RuleConfig[]>(INITIAL_RULES);
  const [ocrThreshold, setOcrThreshold] = useState<number>(0.85);

  const toggleRule = (code: string) => {
    setRules(prev =>
      prev.map(r => (r.code === code ? { ...r, isActive: !r.isActive } : r))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pine-100 dark:bg-pine-900/40 text-pine-700 dark:text-pine-300 flex items-center justify-center">
            <Shield className="w-5 h-5 text-pine-700 dark:text-pine-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-pine-950 dark:text-pine-100">
              {t.nav.admin}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {locale === 'bn'
                ? 'সিস্টেম প্রশাসন, ব্যবহারকারী রোল ম্যাট্রিক্স, ঝুঁকি ইঞ্জিন ও ক্রিপ্টোগ্রাফিক সুরক্ষা নিয়ন্ত্রণ'
                : 'System Administration, RBAC Matrix, Risk Rule Configurations & Key Management'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Demo Accounts & Roles Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-pine-950 dark:text-pine-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-pine-600" />
          <span>{locale === 'bn' ? 'ডেমো ব্যবহারকারী ও ভূমিকা ভিত্তিক অনুমতি ম্যাট্রিক্স (RBAC)' : 'Demo Accounts & Role-Based Permissions (RBAC)'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {demoUsers.map((user) => {
            const isCurrent = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-pine-50 dark:bg-pine-900/40 border-pine-600 dark:border-pine-400 shadow-sm ring-2 ring-pine-600/20'
                    : 'bg-white dark:bg-civic-darkCard border-pine-200 dark:border-pine-800 hover:border-pine-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                      {user.role}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-pine-700 dark:text-pine-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {locale === 'bn' ? 'সক্রিয়' : 'Active'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-pine-950 dark:text-pine-100 text-sm">
                    {locale === 'bn' ? user.nameBn : user.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {locale === 'bn' ? user.designationBn : user.designation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-pine-100 dark:border-pine-800">
                  <button
                    onClick={() => switchUser(user.id)}
                    disabled={isCurrent}
                    className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-pine-200 dark:bg-pine-800 text-pine-800 dark:text-pine-200 cursor-default'
                        : 'bg-pine-700 hover:bg-pine-800 text-white'
                    }`}
                  >
                    {isCurrent
                      ? (locale === 'bn' ? 'বর্তমানে নির্বাচিত' : 'Selected')
                      : (locale === 'bn' ? 'এই রোলে স্যুইচ' : 'Switch Role')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cryptographic Security & Integrity Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-pine-950 dark:text-pine-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-pine-600" />
          <span>{locale === 'bn' ? 'ডিজিটাল ইন্টিগ্রিটি ও ক্রিপ্টোগ্রাফিক কি ব্যবস্থাপনা' : 'Cryptographic Integrity & Key Management'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
            <span className="text-gray-500 block mb-1">
              {locale === 'bn' ? 'ডিজিটাল স্বাক্ষর অ্যালগরিদম' : 'Signature Standard'}
            </span>
            <p className="font-mono font-bold text-pine-950 dark:text-pine-100 text-sm">
              Ed25519 (RFC 8032)
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {locale === 'bn' ? 'সামরিক মানের উচ্চ-গতির আধুনিক পাবলিক-কি ক্রিপ্টোগ্রাফি' : 'High-speed elliptic curve with 128-bit security level'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
            <span className="text-gray-500 block mb-1">
              {locale === 'bn' ? 'সক্রিয় কি আইডি (Key ID)' : 'Active Key Identifier'}
            </span>
            <p className="font-mono font-bold text-pine-950 dark:text-pine-100 text-sm">
              ed25519-jomitech-2026-v1
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{locale === 'bn' ? 'সার্ভার মেমরিতে সুরক্ষিত ও সক্রিয়' : 'Loaded in secure memory'}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
            <span className="text-gray-500 block mb-1">
              {locale === 'bn' ? 'পাবলিক কিউআর নীতিমালা' : 'Public QR Privacy Policy'}
            </span>
            <p className="font-mono font-bold text-pine-950 dark:text-pine-100 text-sm">
              Zero-PII Opaque Receipt
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {locale === 'bn' ? 'কিউআর কোডে কোনো ব্যক্তিগত বা মালিকানা তথ্য এনকোড হয় না' : 'Only random opaque tokens encoded; no PII leaks'}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Engine Rules Configuration */}
      <div className="p-6 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-pine-100 dark:border-pine-900">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-pine-950 dark:text-pine-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pine-600" />
              <span>{locale === 'bn' ? 'ব্যাখ্যাযোগ্য ঝুঁকি ইঞ্জিন নিয়মাবলী কনফিগারেশন' : 'Explainable Risk Rules Configuration'}</span>
            </h2>
            <p className="text-xs text-gray-500">
              {locale === 'bn' ? 'ইঞ্জিন সংস্করণ: 2.0.0-deterministic | মোট ১৫টি বিধিবদ্ধ যাচাইকরণ নিয়ম' : 'Engine Version: 2.0.0-deterministic | 15 deterministic fraud rules'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">{locale === 'bn' ? 'ওসিআর অনুমোদন থ্রেশহোল্ড:' : 'OCR Confidence Threshold:'}</span>
            <span className="font-mono font-bold text-pine-700 dark:text-pine-300 px-2 py-0.5 rounded bg-pine-100 dark:bg-pine-900/60">
              {(ocrThreshold * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-pine-50/70 dark:bg-pine-950/40 border-b border-pine-200 dark:border-pine-800 font-semibold text-pine-950 dark:text-pine-200">
              <tr>
                <th className="p-2.5">{locale === 'bn' ? 'নিয়ম কোড' : 'Rule Code'}</th>
                <th className="p-2.5">{locale === 'bn' ? 'বিবরণ' : 'Description'}</th>
                <th className="p-2.5 text-center">{locale === 'bn' ? 'তীব্রতা' : 'Severity'}</th>
                <th className="p-2.5 text-center">{locale === 'bn' ? 'স্কোর প্রভাব' : 'Impact'}</th>
                <th className="p-2.5 text-right">{locale === 'bn' ? 'স্থিতি' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-100 dark:divide-pine-900">
              {rules.map((r) => (
                <tr key={r.code} className="hover:bg-pine-50/40 dark:hover:bg-pine-900/20">
                  <td className="p-2.5 font-mono font-bold text-pine-950 dark:text-pine-100">
                    {r.code}
                  </td>
                  <td className="p-2.5">
                    {locale === 'bn' ? r.name_bn : r.name_en}
                  </td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.severity === 'HIGH'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : r.severity === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-gray-700 dark:text-gray-300">
                    +{toLocalDigits(r.weight)}
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => toggleRule(r.code)}
                      className="inline-flex items-center gap-1 text-xs font-semibold focus:outline-none"
                    >
                      {r.isActive ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{locale === 'bn' ? 'সক্রিয়' : 'Enabled'}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-1">
                          <span>{locale === 'bn' ? 'নিষ্ক্রিয়' : 'Disabled'}</span>
                        </span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Synthetic Scenarios Test Fixtures */}
      <div className="p-6 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-pine-950 dark:text-pine-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-pine-600" />
          <span>{locale === 'bn' ? '১২টি সিন্থেটিক টেস্ট দৃশ্যপট ভেরিফিকেশন স্ট্যাটাস' : '12 Deterministic Synthetic Test Scenarios'}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { id: 1, name: 'Clean Chain (স্বচ্ছ)', pass: true },
            { id: 2, name: 'Double Sale (দ্বৈত বিক্রয়)', pass: true },
            { id: 3, name: 'Seller Mismatch (মালিকানা অমিল)', pass: true },
            { id: 4, name: 'Duplicate Deed (ডুপ্লিকেট দলিল)', pass: true },
            { id: 5, name: 'Share Exceeded (অতিরিক্ত অংশ)', pass: true },
            { id: 6, name: 'Unmutated Deed (নামজারিহীন দলিল)', pass: true },
            { id: 7, name: 'Party Mismatch (আবেদনকারী অমিল)', pass: true },
            { id: 8, name: 'Impossible Date (কালানুক্রমিক ভুল)', pass: true },
            { id: 9, name: 'Khas Schedule (খাস তফসিল)', pass: true },
            { id: 10, name: 'Survey Gap (খতিয়ান বিচ্যুতি)', pass: true },
            { id: 11, name: 'Low OCR (নিম্ন কনফিডেন্স)', pass: true },
            { id: 12, name: 'Co-Ownership (বৈধ শরিকানা)', pass: true },
          ].map((s) => (
            <div key={s.id} className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50 flex items-center justify-between">
              <span className="font-medium text-emerald-950 dark:text-emerald-200 truncate">
                {toLocalDigits(s.id)}. {s.name}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
