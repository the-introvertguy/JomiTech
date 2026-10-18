'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { API_BASE_URL } from '@/lib/api';
import {
  FolderLock,
  Search,
  Filter,
  Building2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  FileSearch
} from 'lucide-react';

interface ParcelRow {
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
  jl_no?: string;
  owners_summary?: string;
  status: string;
}

export default function RecordsPage() {
  const { locale, t, toLocalDigits } = useApp();
  const [parcels, setParcels] = useState<ParcelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState<string>('ALL');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/parcels`);
      if (res.ok) {
        const data = await res.json();
        setParcels(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = parcels.filter(p => {
    if (selectedSurvey !== 'ALL' && p.survey_type !== selectedSurvey) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.dag_no.includes(q) ||
        p.khatian_no.includes(q) ||
        p.mouza.toLowerCase().includes(q) ||
        (p.mouza_bn && p.mouza_bn.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-pine-950 dark:text-pine-100">
            <div className="w-8 h-8 rounded-lg bg-pine-100 dark:bg-pine-900/40 text-pine-700 dark:text-pine-300 flex items-center justify-center">
              <FolderLock className="w-5 h-5 text-pine-700 dark:text-pine-300" />
            </div>
            <span>{t.nav.records}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {locale === 'bn'
              ? 'ভূমি মন্ত্রণালয় নির্ধারিত ফরম্যাট অনুযায়ী অনুমোদিত ক্যাডাস্ট্রাল খতিয়ান ও দাগ রেকর্ড'
              : 'Approved Cadastral Khatians, Plot Allocations & Synthetic Land Ownership Register'}
          </p>
        </div>

        <button
          onClick={fetchRecords}
          className="px-3 py-1.5 rounded-lg border border-pine-200 dark:border-pine-800 hover:bg-pine-50 dark:hover:bg-pine-900/30 text-xs font-medium text-pine-700 dark:text-pine-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{locale === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'পার্সেল আইডি, দাগ নম্বর, খতিয়ান বা মৌজা দিয়ে খুঁজুন...'
                : 'Filter by Parcel ID, dag no, khatian no, or mouza...'
            }
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-pine-200 dark:border-pine-800 bg-white dark:bg-pine-950/40 text-xs focus:outline-none focus:ring-2 focus:ring-pine-600 font-mono"
          />
        </div>

        {/* Survey Type Pills */}
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

      {/* Parcels Table */}
      <div className="bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-pine-600" />
            <span>{locale === 'bn' ? 'খতিয়ান সূচি লোড হচ্ছে...' : 'Loading records register...'}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            {locale === 'bn' ? 'কোনো খতিয়ান রেকর্ড মেলেনি।' : 'No records match the current filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-pine-50/70 dark:bg-pine-950/40 border-b border-pine-200 dark:border-pine-800 text-pine-950 dark:text-pine-200 font-semibold">
                <tr>
                  <th className="p-3">{locale === 'bn' ? 'পার্সেল আইডি' : 'Parcel ID'}</th>
                  <th className="p-3">{locale === 'bn' ? 'মৌজা ও জেএল' : 'Mouza & J.L.'}</th>
                  <th className="p-3">{locale === 'bn' ? 'দাগ ও খতিয়ান' : 'Dag & Khatian'}</th>
                  <th className="p-3">{locale === 'bn' ? 'সার্ভে ধরন' : 'Survey'}</th>
                  <th className="p-3">{locale === 'bn' ? 'পরিমাণ (শতক)' : 'Area (Dec)'}</th>
                  <th className="p-3">{locale === 'bn' ? 'জমির শ্রেণি' : 'Land Class'}</th>
                  <th className="p-3 text-right">{locale === 'bn' ? 'পদক্ষেপ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pine-100 dark:divide-pine-900">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-pine-50/40 dark:hover:bg-pine-900/20 transition-colors">
                    
                    {/* Parcel ID */}
                    <td className="p-3 font-mono font-bold text-pine-950 dark:text-pine-100 whitespace-nowrap">
                      <Link
                        href={`/${locale}/parcel/${p.id}`}
                        className="hover:underline text-pine-700 dark:text-pine-300"
                      >
                        {p.id}
                      </Link>
                    </td>

                    {/* Mouza & JL */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                        {locale === 'bn' ? p.mouza_bn : p.mouza}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {locale === 'bn' ? `${p.upazila_bn}, ${p.district_bn}` : `${p.upazila}, ${p.district}`}
                      </span>
                    </td>

                    {/* Dag & Khatian */}
                    <td className="p-3 whitespace-nowrap font-mono">
                      <div>
                        <span className="text-gray-400 text-[10px] mr-1">{locale === 'bn' ? 'দাগ:' : 'Dag:'}</span>
                        <span className="font-bold">{toLocalDigits(p.dag_no_bn || p.dag_no)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] mr-1">{locale === 'bn' ? 'খতিয়ান:' : 'Khatian:'}</span>
                        <span className="font-bold">{toLocalDigits(p.khatian_no_bn || p.khatian_no)}</span>
                      </div>
                    </td>

                    {/* Survey Type */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-300 font-mono">
                        {p.survey_type}
                      </span>
                    </td>

                    {/* Area Recorded */}
                    <td className="p-3 font-mono font-bold whitespace-nowrap text-pine-900 dark:text-pine-200">
                      {toLocalDigits(p.area_recorded)}
                    </td>

                    {/* Land Class */}
                    <td className="p-3 whitespace-nowrap text-gray-700 dark:text-gray-300 font-medium">
                      {p.land_class}
                    </td>

                    {/* Action Links */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/${locale}/parcel/${p.id}`}
                          className="px-2.5 py-1 rounded bg-pine-50 hover:bg-pine-100 dark:bg-pine-900/40 dark:hover:bg-pine-900/70 text-pine-800 dark:text-pine-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>{locale === 'bn' ? 'বিস্তারিত' : 'Detail'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <Link
                          href={`/${locale}/buyer-report?parcelId=${p.id}`}
                          className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <FileSearch className="w-3 h-3" />
                          <span>{locale === 'bn' ? 'প্রতিবেদন' : 'Report'}</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
