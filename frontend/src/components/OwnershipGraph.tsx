'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { KhatianTimeline, TransferTimeline } from '@/lib/api';
import { GitBranch, Table, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface OwnershipGraphProps {
  khatians: KhatianTimeline[];
  transfers: TransferTimeline[];
  parcelId: string;
}

export const OwnershipGraph: React.FC<OwnershipGraphProps> = ({
  khatians,
  transfers,
  parcelId,
}) => {
  const { locale, t, formatNum } = useApp();
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');

  return (
    <div className="bg-white dark:bg-civic-darkCard rounded-2xl p-6 sm:p-8 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-6">
      
      {/* Header with View Switcher Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-100 dark:border-pine-800/60 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-pine-950 dark:text-pine-100 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-pine-600 dark:text-pine-400" />
            <span>{locale === 'bn' ? 'মালিকানা হস্তান্তর শৃঙ্খল ও সংযোগ গ্রাফ' : 'Ownership Lineage & Transfer Graph'}</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {locale === 'bn'
              ? 'সিএস থেকে বিএস জরিপ ও দলিলের মধ্যকার ধারাবাহিক স্বত্ব হস্তান্তর চিত্র।'
              : 'Visual flow of title devolution from historical CS surveys to latest BS records.'}
          </p>
        </div>

        {/* View Mode Toggle Button Group */}
        <div className="inline-flex rounded-lg border border-pine-200 dark:border-pine-800 p-0.5 bg-pine-50/60 dark:bg-pine-950/40 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'graph'
                ? 'bg-pine-700 text-white shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-pine-800'
            }`}
            aria-pressed={viewMode === 'graph'}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'চিত্রিত গ্রাফ' : 'Visual Graph'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-pine-700 text-white shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-pine-800'
            }`}
            aria-pressed={viewMode === 'table'}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'অ্যাক্সেসিবল টেবিল' : 'Accessible Table'}</span>
          </button>
        </div>
      </div>

      {/* Visual Graph View */}
      {viewMode === 'graph' ? (
        <div className="p-4 sm:p-6 bg-pine-50/30 dark:bg-pine-950/20 rounded-xl border border-pine-100 dark:border-pine-800/60 overflow-x-auto">
          <div className="min-w-[650px] flex items-stretch justify-between gap-4 relative">
            
            {khatians.map((k, idx) => (
              <React.Fragment key={k.id}>
                {/* Survey Node Box */}
                <div className="flex-1 p-4 rounded-xl bg-white dark:bg-civic-dark border border-pine-200 dark:border-pine-700 shadow-xs flex flex-col justify-between space-y-3 z-10">
                  <div className="border-b border-gray-100 dark:border-pine-900 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-pine-800 text-white font-mono text-xs font-bold">
                        {k.survey_type}
                      </span>
                      {k.survey_year && (
                        <span className="font-mono text-[11px] text-gray-400">
                          {formatNum(k.survey_year)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-1.5">
                      {t.land.khatianNo}: {formatNum(k.khatian_no)}
                    </div>
                  </div>

                  {/* Owners in this Node */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      {t.land.owners}
                    </span>
                    {k.owners.map((o) => (
                      <div key={o.owner_id} className="p-1.5 rounded bg-pine-50/60 dark:bg-pine-900/30 text-pine-900 dark:text-pine-200 font-medium">
                        <div>{locale === 'bn' ? o.name_bn : o.name}</div>
                        {o.share_ana && (
                          <div className="text-[10px] text-gray-500 font-mono">
                            {o.share_ana} ({formatNum(o.share_fraction * 100)}%)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Predecessor Provenance */}
                  <div className="pt-2 text-[10px] font-mono text-gray-500 border-t border-gray-100 dark:border-pine-900 flex items-center gap-1">
                    {k.predecessor_khatian_id ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Link: {k.predecessor_khatian_id}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Origin Survey</span>
                    )}
                  </div>
                </div>

                {/* Connecting Transfer Vector Arrow */}
                {idx < khatians.length - 1 && (
                  <div className="flex flex-col items-center justify-center shrink-0 w-8 sm:w-12 text-pine-600 dark:text-pine-400">
                    <span className="text-[10px] font-mono text-gray-400 mb-1">
                      {locale === 'bn' ? 'হস্তান্তর' : 'Devolution'}
                    </span>
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            ))}

          </div>
        </div>
      ) : (
        /* Accessible Table Alternative View */
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-xs border-collapse"
            aria-label="Chain of Title and Ownership Devolution Table"
          >
            <caption className="sr-only">
              Chronological survey lineage and ownership progression for parcel {parcelId}
            </caption>
            <thead>
              <tr className="border-b border-pine-200 dark:border-pine-800 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider bg-pine-50/50 dark:bg-pine-950/40">
                <th scope="col" className="py-3 px-3">সার্ভে ধাপ</th>
                <th scope="col" className="py-3 px-3">খতিয়ান নম্বর</th>
                <th scope="col" className="py-3 px-3">জরিপের সাল</th>
                <th scope="col" className="py-3 px-3">রেকর্ডীয় মালিকগণ</th>
                <th scope="col" className="py-3 px-3">মালিকানা অংশ (আনা / ভগ্নাংশ)</th>
                <th scope="col" className="py-3 px-3">পূর্ববর্তী খতিয়ান লিংক</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-pine-900/50">
              {khatians.map((k) => (
                <tr key={k.id} className="hover:bg-pine-50/40 dark:hover:bg-pine-950/20">
                  <td className="py-3 px-3 font-mono font-bold text-pine-800 dark:text-pine-200">
                    {k.survey_type}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold">
                    {formatNum(k.khatian_no)}
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-600 dark:text-gray-300">
                    {k.survey_year ? formatNum(k.survey_year) : '—'}
                  </td>
                  <td className="py-3 px-3">
                    {k.owners.map((o) => (
                      <div key={o.owner_id} className="font-medium text-gray-900 dark:text-gray-100">
                        {locale === 'bn' ? o.name_bn : o.name}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {k.owners.map((o) => (
                      <div key={o.owner_id}>
                        {o.share_ana || '১৬ আনা'} ({formatNum((o.share_fraction * 100).toFixed(1))}%)
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs">
                    {k.predecessor_khatian_id ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {k.predecessor_khatian_id}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Root Predecessor</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
