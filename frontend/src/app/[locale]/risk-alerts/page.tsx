'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { fetchParcels, fetchParcelRisk, ParcelSummary, RiskAssessment, RiskFinding } from '@/lib/api';
import {
  AlertOctagon,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Info,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export default function RiskCenterPage() {
  const { locale, t, formatNum } = useApp();
  const searchParams = useSearchParams();
  const parcelParam = searchParams.get('parcel') || '';

  const [parcels, setParcels] = useState<ParcelSummary[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState(parcelParam || 'PCL-DH-502');
  const [activeRisk, setActiveRisk] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  useEffect(() => {
    async function init() {
      setLoading(true);
      const list = await fetchParcels();
      setParcels(list);
      const targetId = selectedParcelId || (list[0]?.id ?? 'PCL-DH-502');
      setSelectedParcelId(targetId);
      const riskData = await fetchParcelRisk(targetId);
      setActiveRisk(riskData);
      setLoading(false);
    }
    init();
  }, []);

  const handleSelectParcel = async (id: string) => {
    setSelectedParcelId(id);
    setLoading(true);
    const riskData = await fetchParcelRisk(id);
    setActiveRisk(riskData);
    setLoading(false);
  };

  const filteredFindings = (activeRisk?.findings || []).filter((f) => {
    if (severityFilter === 'ALL') return true;
    return f.severity === severityFilter;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Title */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-bold mb-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>P3 Module: Catch Fraud & Double-Selling</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-pine-950 dark:text-pine-100">
            {t.nav.riskAlerts}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {locale === 'bn'
              ? 'নির্ধারিত ১২টি অ্যালগরিদমিক নিয়মের আলোকে তথ্যের অসঙ্গতি ও দ্বি-ভাষিক প্রমাণ বিশ্লেষণ।'
              : 'Deterministic 12-rule engine detecting conflicting sales, title defects, and lineage gaps.'}
          </p>
        </div>

        {/* Selected Parcel Indicator */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/buyer-report?parcel=${selectedParcelId}`}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{t.actions.generateReport}</span>
          </Link>
        </div>
      </div>

      {/* Parcel Selector Strip */}
      <div className="bg-white dark:bg-civic-darkCard rounded-xl p-4 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-2">
        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          {locale === 'bn' ? 'যাচাই করার জন্য পার্সেল দৃশ্যকল্প নির্বাচন করুন:' : 'Select Parcel Scenario to Audit:'}
        </label>
        <div className="flex flex-wrap gap-2">
          {parcels.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectParcel(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                selectedParcelId === p.id
                  ? 'bg-pine-800 text-white font-bold ring-2 ring-pine-500 shadow-xs'
                  : 'bg-pine-50 dark:bg-pine-950/40 text-gray-800 dark:text-gray-200 hover:bg-pine-100 border border-pine-200/60 dark:border-pine-800'
              }`}
            >
              <span className="font-mono">{p.id}</span>
              <span className="text-[11px] opacity-75">
                (দাগ {formatNum(p.dag_no)})
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  p.risk_level === 'HIGH'
                    ? 'bg-red-500'
                    : p.risk_level === 'MEDIUM'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-sm text-gray-500">
          <div className="w-6 h-6 border-2 border-pine-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>{locale === 'bn' ? 'ঝুঁকি বিশ্লেষণ গণনা করা হচ্ছে...' : 'Computing risk evaluation...'}</span>
        </div>
      ) : activeRisk ? (
        <div className="space-y-6">

          {/* Assessment Score Hero Card */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border transition-all ${
              activeRisk.risk_level === 'HIGH'
                ? 'bg-red-500/10 dark:bg-red-950/40 border-red-500/40 text-red-950 dark:text-red-100'
                : activeRisk.risk_level === 'MEDIUM'
                ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/40 text-amber-950 dark:text-amber-100'
                : 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${
                      activeRisk.risk_level === 'HIGH'
                        ? 'bg-red-600 text-white'
                        : activeRisk.risk_level === 'MEDIUM'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {activeRisk.risk_level === 'HIGH'
                      ? t.risk.high
                      : activeRisk.risk_level === 'MEDIUM'
                      ? t.risk.medium
                      : t.risk.low}
                  </span>
                  <span className="text-xs opacity-75 font-mono">
                    Engine {activeRisk.rule_version}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold">
                  {locale === 'bn' ? activeRisk.summary_bn : activeRisk.summary_en}
                </h2>
                
                <p className="text-xs opacity-80 leading-relaxed max-w-2xl">
                  {t.risk.limitationNotice}
                </p>
              </div>

              {/* Big Score Gauge */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/80 dark:bg-civic-darkCard/90 border border-current/20 shadow-xs shrink-0 min-w-[140px]">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                  {t.risk.score}
                </span>
                <span className="text-4xl sm:text-5xl font-black my-1">
                  {formatNum(activeRisk.total_score)}
                </span>
                <span className="text-[10px] opacity-70 font-mono">
                  Scale: 0 - 100
                </span>
              </div>
            </div>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center justify-between gap-2 border-b border-pine-200 dark:border-pine-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-pine-600 dark:text-pine-400" />
              <span className="text-xs font-bold text-pine-950 dark:text-pine-100">
                {locale === 'bn' ? 'তীব্রতা অনুযায়ী ফিল্টার:' : 'Filter by Severity:'}
              </span>
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverityFilter(lvl)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    severityFilter === lvl
                      ? 'bg-pine-700 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-pine-100 dark:hover:bg-pine-900/40'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <span className="text-xs text-gray-500 font-mono">
              {formatNum(filteredFindings.length)} Findings
            </span>
          </div>

          {/* Rule Findings Detailed Cards ("কেন এই সতর্কতা?") */}
          {filteredFindings.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {locale === 'bn' ? 'এই ক্যাটাগরিতে কোনো অসঙ্গতি নেই' : 'No findings in this category'}
              </h3>
              <p className="text-xs text-gray-500">
                {locale === 'bn' ? 'নির্বাচিত ফিল্টারে সকল রেকর্ড স্বাভাবিক।' : 'All checked indicators evaluated clean.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="bg-white dark:bg-civic-darkCard rounded-xl p-5 sm:p-6 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-4"
                >
                  {/* Rule Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-pine-800/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          finding.severity === 'HIGH'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-pine-950 dark:text-pine-100">
                        {locale === 'bn' ? finding.title_bn : finding.title_en}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200/60 dark:border-red-800/60">
                        +{formatNum(finding.score_contribution)} pts
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">
                        {finding.rule_code}
                      </span>
                    </div>
                  </div>

                  {/* Why This Alert? ("কেন এই সতর্কতা?") Evidence Section */}
                  <div className="p-4 rounded-xl bg-pine-50/40 dark:bg-pine-950/20 border border-pine-100 dark:border-pine-900/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-pine-900 dark:text-pine-200">
                      <HelpCircle className="w-4 h-4 text-pine-600 dark:text-pine-400" />
                      <span>{t.risk.whyAlert}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {Object.entries(finding.evidence_data).map(([k, v]) => (
                        <div key={k} className="p-2 rounded bg-white dark:bg-civic-dark border border-gray-100 dark:border-pine-900">
                          <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase">
                            {k.replace(/_/g, ' ')}
                          </span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            {Array.isArray(v) ? v.join(', ') : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action & Limitation Notice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                        {t.risk.recommendedAction}:
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {locale === 'bn' ? finding.recommended_action_bn : finding.recommended_action_en}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-pine-950/30 border border-gray-200 dark:border-pine-800/40">
                      <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        {locale === 'bn' ? 'বিধিবদ্ধ সীমাবদ্ধতা:' : 'Rule Limitation Notice:'}
                      </span>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                        {locale === 'bn' ? finding.limitation_notice_bn : finding.limitation_notice_en}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
}
