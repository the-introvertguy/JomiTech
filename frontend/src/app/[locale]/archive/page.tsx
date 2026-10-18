'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Archive,
  Search,
  Filter,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Layers,
  ShieldCheck,
  FolderLock
} from 'lucide-react';

interface ArchiveRecord {
  id: string;
  synthetic_id: string;
  survey_type: string;
  dag_no: string;
  dag_no_bn?: string;
  khatian_no: string;
  khatian_no_bn?: string;
  area_recorded: number;
  land_class: string;
  mouza: string;
  mouza_bn: string;
  district: string;
  district_bn: string;
  upazila: string;
  upazila_bn: string;
  jl_no: string;
  status: string;
}

export default function ArchivePage() {
  const { locale, t, toLocalDigits } = useApp();
  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState<string>('ALL');

  useEffect(() => {
    const fetchArchive = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/parcels');
        if (res.ok) {
          const data = await res.json();
          // Transform parcel summaries into archive entries
          const mapped = data.map((p: any) => ({
            id: p.id,
            synthetic_id: p.synthetic_id,
            survey_type: p.survey_type,
            dag_no: p.dag_no,
            dag_no_bn: p.dag_no_bn,
            khatian_no: p.khatian_no,
            khatian_no_bn: p.khatian_no_bn,
            area_recorded: p.area_recorded,
            land_class: p.land_class,
            mouza: p.mouza,
            mouza_bn: p.mouza_bn,
            district: p.district,
            district_bn: p.district_bn,
            upazila: p.upazila,
            upazila_bn: p.upazila_bn,
            jl_no: p.jl_no || '24',
            status: p.status,
          }));
          setRecords(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, []);

  const filtered = records.filter(r => {
    if (selectedSurvey !== 'ALL' && r.survey_type !== selectedSurvey) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.dag_no.includes(q) ||
        r.khatian_no.includes(q) ||
        r.mouza.toLowerCase().includes(q) ||
        (r.mouza_bn && r.mouza_bn.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pine-100 dark:bg-pine-900/40 text-pine-700 dark:text-pine-300 flex items-center justify-center">
            <Archive className="w-5 h-5 text-pine-700 dark:text-pine-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-pine-950 dark:text-pine-100">
              {t.nav.archive}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {locale === 'bn'
                ? 'অনুমোদিত ও অপরিবর্তনীয় ঐতিহাসিক খতিয়ান ও দলিলের ডিজিটাল মহাফেজখানা'
                : 'Digital Archive of Approved Historical Khatians & Synthetic Registered Records'}
            </p>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="p-3.5 rounded-xl bg-pine-50/70 dark:bg-pine-900/30 border border-pine-200 dark:border-pine-800 text-xs text-pine-900 dark:text-pine-200 flex items-center gap-3">
        <FolderLock className="w-4 h-4 text-pine-600 shrink-0" />
        <div>
          <span className="font-semibold">
            {locale === 'bn' ? 'সংরক্ষণাগার নিরাপত্তা প্রোটোকল:' : 'Archive Integrity Standard:'}
          </span>{' '}
          {locale === 'bn'
            ? 'এই মহাফেজখানায় কেবল অনুমোদিত, অপরিবর্তনীয় ও ক্রিপ্টোগ্রাফিক হ্যাশযুক্ত রেকর্ড সংরক্ষিত হয়। যেকোনো খসড়া বা অপ্রমাণিত দলিল সাধারণ অনুসন্ধান থেকে সম্পূর্ণ পৃথক রাখা হয়।'
            : 'Only approved, immutable records with cryptographic byte hashes are indexed in the public archive repository.'}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'দাগ নম্বর, খতিয়ান নম্বর, মৌজা বা পার্সেল আইডি দিয়ে খুঁজুন...'
                : 'Search by dag no, khatian no, mouza, or parcel ID...'
            }
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-pine-200 dark:border-pine-800 bg-white dark:bg-pine-950/40 text-xs focus:outline-none focus:ring-2 focus:ring-pine-600"
          />
        </div>

        {/* Survey Type Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
          {['ALL', 'BS', 'RS', 'SA', 'CS'].map((survey) => (
            <button
              key={survey}
              onClick={() => setSelectedSurvey(survey)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedSurvey === survey
                  ? 'bg-pine-700 text-white'
                  : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
              }`}
            >
              {survey === 'ALL'
                ? locale === 'bn' ? 'সকল সার্ভে' : 'All Surveys'
                : survey}
            </button>
          ))}
        </div>
      </div>

      {/* Archive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs text-gray-400 bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800">
            {locale === 'bn' ? 'মহাফেজখানা সূচি প্রস্তুত হচ্ছে...' : 'Loading archive index...'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-gray-400 bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800">
            {locale === 'bn' ? 'কোনো সংরক্ষিত রেকর্ড মেলেনি।' : 'No archived records match your criteria.'}
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm hover:border-pine-400 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-bold text-xs text-pine-950 dark:text-pine-100">
                    {r.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-300 font-mono">
                    {r.survey_type}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100">
                  {locale === 'bn'
                    ? `মৌজা: ${r.mouza_bn}, জেএল: ${toLocalDigits(r.jl_no)}`
                    : `Mouza: ${r.mouza}, JL: ${r.jl_no}`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {locale === 'bn'
                    ? `${r.upazila_bn}, ${r.district_bn}`
                    : `${r.upazila}, ${r.district}`}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-pine-100 dark:border-pine-900 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">
                      {locale === 'bn' ? 'দাগ নম্বর' : 'Dag No.'}
                    </span>
                    <span className="font-semibold text-pine-900 dark:text-pine-200 font-mono">
                      {toLocalDigits(r.dag_no_bn || r.dag_no)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">
                      {locale === 'bn' ? 'খতিয়ান নম্বর' : 'Khatian No.'}
                    </span>
                    <span className="font-semibold text-pine-900 dark:text-pine-200 font-mono">
                      {toLocalDigits(r.khatian_no_bn || r.khatian_no)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">
                      {locale === 'bn' ? 'রেকর্ডীয় জমি' : 'Area Recorded'}
                    </span>
                    <span className="font-semibold text-pine-900 dark:text-pine-200">
                      {toLocalDigits(r.area_recorded)} {locale === 'bn' ? 'শতক' : 'Dec'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">
                      {locale === 'bn' ? 'জমির শ্রেণি' : 'Land Class'}
                    </span>
                    <span className="font-semibold text-pine-900 dark:text-pine-200">
                      {r.land_class}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-pine-100 dark:border-pine-900 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{locale === 'bn' ? 'হ্যাশ সংরক্ষিত' : 'Byte-Indexed'}</span>
                </span>

                <Link
                  href={`/${locale}/parcel/${r.id}`}
                  className="px-3 py-1.5 rounded-lg bg-pine-50 hover:bg-pine-100 dark:bg-pine-900/40 dark:hover:bg-pine-900/70 text-pine-800 dark:text-pine-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>{locale === 'bn' ? 'রেকর্ড দেখুন' : 'View Record'}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
