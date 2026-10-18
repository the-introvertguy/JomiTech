'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { API_BASE_URL } from '@/lib/api';
import {
  GitPullRequest,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  HelpCircle,
  Calendar,
  XCircle,
  ArrowRight,
  Info
} from 'lucide-react';

interface PublicTrackResult {
  opaque_reference: string;
  case_no_masked: string;
  status: string;
  status_label_bn: string;
  status_label_en: string;
  office_label_bn: string;
  office_label_en: string;
  submitted_date: string;
  last_updated: string;
  simulation_notice_bn: string;
  simulation_notice_en: string;
  contains_pii: boolean;
}

const STAGES = [
  { key: 'SUBMITTED', bn: 'দাখিলকৃত', en: 'Submitted' },
  { key: 'FIELD_INVESTIGATION', bn: 'সরেজমিন তদন্ত', en: 'Field Investigation' },
  { key: 'HEARING_SCHEDULED', bn: 'শুনানি নির্ধারিত', en: 'Hearing Scheduled' },
  { key: 'OFFICER_REVIEW', bn: 'এসিল্যান্ড পর্যালোচনা', en: 'AC Land Review' },
  { key: 'APPROVED', bn: 'অনুমোদিত ও সৃজিত', en: 'Approved & Mutated' },
];

export default function TrackMutationPage() {
  const { locale, t, toLocalDigits } = useApp();
  const [referenceInput, setReferenceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicTrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleRefs = [
    { label: 'নমুনা কেস ১ (রিভিউ)', ref: 'mut-ref-847291a9b' },
    { label: 'নমুনা কেস ২ (রিভিউ)', ref: 'mut-ref-6dda39773a' },
  ];

  const handleTrack = async (refToUse?: string) => {
    const query = (refToUse || referenceInput).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/public/mutation-track/${encodeURIComponent(query)}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            locale === 'bn'
              ? 'এই ট্র্যাকিং রেফারেন্স নম্বরে কোনো নামজারি রেকর্ড পাওয়া যায়নি।'
              : 'No mutation record found for this tracking reference.'
          );
        }
        throw new Error(`সার্ভার সাড়া দেয়নি (স্ট্যাটাস: ${res.status})`);
      }
      const data: PublicTrackResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'অনুসন্ধান সম্পন্ন করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: string) => {
    if (status === 'REJECTED') return -1;
    const idx = STAGES.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-pine-100 dark:bg-pine-900/40 text-pine-700 dark:text-pine-300 flex items-center justify-center">
            <GitPullRequest className="w-5 h-5 text-pine-700 dark:text-pine-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-pine-950 dark:text-pine-100">
              {t.nav.trackMutation}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {locale === 'bn'
                ? 'গোপনীয়তা-সুরক্ষিত পাবলিক ই-নামজারি অগ্রগতি পর্যবেক্ষণ (ব্যক্তিগত তথ্যবিহীন)'
                : 'Privacy-safe simulated e-mutation public stage tracker (Zero PII disclosure)'}
            </p>
          </div>
        </div>
      </div>

      {/* Tracker Search Box */}
      <div className="p-6 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm space-y-4">
        <label className="block text-sm font-semibold text-pine-900 dark:text-pine-100">
          {locale === 'bn' ? 'অস্বচ্ছ ট্র্যাকিং রেফারেন্স আইডি দিন' : 'Enter Opaque Tracking Reference ID'}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              placeholder="e.g. mut-ref-847291a9b"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-pine-300 dark:border-pine-700 bg-white dark:bg-pine-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
          </div>
          <button
            onClick={() => handleTrack()}
            disabled={loading || !referenceInput.trim()}
            className="px-6 py-2.5 rounded-lg bg-pine-700 hover:bg-pine-800 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{locale === 'bn' ? 'ট্র্যাক করুন' : 'Track Status'}</span>
          </button>
        </div>

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-gray-500">{locale === 'bn' ? 'পরীক্ষামূলক রেফারেন্স:' : 'Quick test:'}</span>
          {sampleRefs.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setReferenceInput(s.ref);
                handleTrack(s.ref);
              }}
              className="px-2.5 py-1 rounded-md bg-pine-50 hover:bg-pine-100 dark:bg-pine-900/30 dark:hover:bg-pine-900/50 text-pine-700 dark:text-pine-300 border border-pine-200 dark:border-pine-800 font-mono transition-colors"
            >
              {s.ref}
            </button>
          ))}
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-red-900 dark:text-red-200">{locale === 'bn' ? 'রেকর্ড পাওয়া যায়নি' : 'Tracking Failed'}</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Success Track View */}
      {result && (
        <div className="space-y-6">
          {/* Main Status Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pine-100 dark:border-pine-900">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-300">
                  {locale === 'bn' ? 'মাস্ককৃত কেস নম্বর' : 'Masked Case Reference'}
                </span>
                <h2 className="text-xl font-mono font-bold text-pine-950 dark:text-pine-100 mt-1">
                  {result.case_no_masked}
                </h2>
                <p className="text-xs font-mono text-gray-500">ID: {result.opaque_reference}</p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-xs text-gray-500">{locale === 'bn' ? 'বর্তমান স্থিতি' : 'Current Status'}</span>
                <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  result.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : result.status === 'REJECTED'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{locale === 'bn' ? result.status_label_bn : result.status_label_en}</span>
                </div>
              </div>
            </div>

            {/* Stepper Progress */}
            {result.status !== 'REJECTED' ? (
              <div className="py-2">
                <p className="text-xs font-semibold text-gray-500 mb-4">
                  {locale === 'bn' ? 'নামজারি অগ্রগতির পর্যায়ক্রম:' : 'Mutation Lifecycle Stages:'}
                </p>
                
                {/* Horizontal Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {STAGES.map((s, idx) => {
                    const currentIdx = getStageIndex(result.status);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div
                        key={s.key}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                            : isCurrent
                            ? 'bg-pine-50 dark:bg-pine-900/40 border-pine-500 dark:border-pine-400 ring-2 ring-pine-500/30 text-pine-950 dark:text-pine-100 font-semibold'
                            : 'bg-gray-50 dark:bg-zinc-900/30 border-gray-200 dark:border-zinc-800 text-gray-400'
                        }`}
                      >
                        <div className="flex justify-center mb-1.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full bg-pine-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                              {toLocalDigits(idx + 1)}
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-zinc-700 text-gray-400 flex items-center justify-center text-xs">
                              {toLocalDigits(idx + 1)}
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-medium">{locale === 'bn' ? s.bn : s.en}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-900 dark:text-red-200 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>
                  {locale === 'bn'
                    ? 'আবেদনটি সরকারি নীতি বা তথ্যের অমিলের কারণে নামঞ্জুর করা হয়েছে।'
                    : 'The mutation case was rejected during official review.'}
                </span>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-pine-100 dark:border-pine-900 text-xs">
              <div className="p-3 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
                <span className="text-gray-500 flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-pine-600" />
                  <span>{locale === 'bn' ? 'সংশ্লিষ্ট ভূমি অফিস' : 'Assigned Land Office'}</span>
                </span>
                <p className="font-semibold text-pine-950 dark:text-pine-100">
                  {locale === 'bn' ? result.office_label_bn : result.office_label_en}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
                <span className="text-gray-500 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-pine-600" />
                  <span>{locale === 'bn' ? 'আবেদন দাখিল' : 'Submitted Date'}</span>
                </span>
                <p className="font-semibold text-pine-950 dark:text-pine-100 font-mono">
                  {toLocalDigits(result.submitted_date)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
                <span className="text-gray-500 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-pine-600" />
                  <span>{locale === 'bn' ? 'সর্বশেষ হালনাগাদ' : 'Last Updated'}</span>
                </span>
                <p className="font-semibold text-pine-950 dark:text-pine-100 font-mono">
                  {toLocalDigits(result.last_updated)}
                </p>
              </div>
            </div>

            {/* Privacy Guarantee Banner */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">
                  {locale === 'bn' ? 'জিরো-পিআইআই পাবলিক প্রোটোকল:' : 'Zero-PII Public Privacy Guarantee:'}
                </span>{' '}
                {locale === 'bn'
                  ? 'এই ট্র্যাকিং পাতায় নাগরিকের ব্যক্তিগত তথ্যের সুরক্ষায় আবেদনকারীর নাম, এনআইডি নম্বর, ফোন বা নথির কপি সম্পূর্ণ গোপন রাখা হয়।'
                  : 'To protect personal privacy, citizen names, national IDs, and uploaded deed scans are strictly omitted from public tracking responses.'}
              </div>
            </div>

            {/* Simulation Banner */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">
                  {locale === 'bn' ? 'সিমুলেশন ঘোষণা:' : 'Simulation Notice:'}
                </span>{' '}
                {locale === 'bn' ? result.simulation_notice_bn : result.simulation_notice_en}
              </div>
            </div>

          </div>

          {/* Citizen Guidance Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 text-xs space-y-3">
            <h3 className="text-sm font-bold text-pine-950 dark:text-pine-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-pine-600" />
              <span>{locale === 'bn' ? 'নাগরিক জ্ঞাতব্য ও পরামর্শ' : 'Citizen Guidance & Important Tips'}</span>
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
              <li>
                {locale === 'bn'
                  ? 'নামজারি অনুমোদনের পর নতুন ডি-সি-আর (DCR) ফি পরিশোধ সাপেক্ষে অনলাইন খতিয়ান ডাউনলোড করা যায়।'
                  : 'Following mutation approval and DCR fee clearance, the newly generated khatian can be accessed.'}
              </li>
              <li>
                {locale === 'bn'
                  ? 'শুনানি ধার্য হলে মূল দলিল ও ওয়ারিশান সনদসহ সংশ্লিষ্ট সহকারী কমিশনার (ভূমি) অফিসে নির্ধারিত তারিখে উপস্থিত থাকা প্রয়োজন।'
                  : 'If a hearing is scheduled, original deeds and inheritance certifications must be presented to the AC Land office.'}
              </li>
              <li>
                {locale === 'bn'
                  ? 'কোনো সহ-শরিক বা তৃতীয় পক্ষের আপত্তি থাকলে তা শুনানির সময় নিষ্পত্তি করা হয়।'
                  : 'Any objections filed by co-sharers or third parties are addressed and documented during the hearing.'}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
