'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { fetchParcelDetail, fetchParcelRisk, ParcelDetail, RiskAssessment } from '@/lib/api';
import {
  Layers,
  MapPin,
  FileCheck2,
  AlertTriangle,
  History,
  FileText,
  ShieldCheck,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  AlertOctagon,
  FileSearch,
} from 'lucide-react';
import { OwnershipGraph } from '@/components/OwnershipGraph';

export default function ParcelDetailPage({ params }: { params: { id: string } }) {
  const { locale, t, formatNum } = useApp();
  const [parcel, setParcel] = useState<ParcelDetail | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [p, r] = await Promise.all([
        fetchParcelDetail(params.id),
        fetchParcelRisk(params.id),
      ]);
      setParcel(p);
      setRisk(r);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-gray-500">
        <div className="w-8 h-8 border-2 border-pine-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>{locale === 'bn' ? 'পার্সেল রেকর্ড লোড হচ্ছে...' : 'Loading parcel records...'}</span>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="p-12 text-center bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800 space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold">
          {locale === 'bn' ? 'পার্সেল রেকর্ড খুঁজে পাওয়া যায়নি' : 'Parcel Record Not Found'}
        </h2>
        <Link href={`/${locale}/search`} className="text-xs text-pine-700 dark:text-pine-300 font-bold underline">
          {locale === 'bn' ? 'অনুসন্ধান পাতায় ফিরে যান' : 'Back to search'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <Link href={`/${locale}/search`} className="hover:text-pine-700 dark:hover:text-pine-300">
          {t.nav.search}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-mono font-medium">{parcel.administrative_area.mouza}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-pine-900 dark:text-pine-100">{parcel.id}</span>
      </div>

      {/* Title & Core Overview Header */}
      <div className="bg-white dark:bg-civic-darkCard rounded-2xl p-6 sm:p-8 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-pine-100 dark:border-pine-800/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-200 text-xs font-mono font-bold">
              <span>{parcel.id}</span>
              <span>•</span>
              <span>{parcel.administrative_area.mouza_bn} ({parcel.administrative_area.jl_no_bn ? `জেএল ${parcel.administrative_area.jl_no_bn}` : ''})</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 dark:text-pine-100 mt-2">
              {t.land.dagNo}: {formatNum(parcel.dag_no)}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-pine-600 shrink-0" />
              <span>
                {locale === 'bn'
                  ? `${parcel.administrative_area.mouza_bn}, ${parcel.administrative_area.upazila_bn}, ${parcel.administrative_area.district_bn} জেলা`
                  : `${parcel.administrative_area.mouza}, ${parcel.administrative_area.upazila}, ${parcel.administrative_area.district} District`}
              </span>
            </p>
          </div>

          {/* Diligence Report Button */}
          <Link
            href={`/${locale}/buyer-report?parcel=${parcel.id}`}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors self-start"
          >
            <FileSearch className="w-4 h-4" />
            <span>{t.actions.generateReport}</span>
          </Link>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-pine-50/50 dark:bg-pine-950/20 border border-pine-100 dark:border-pine-800/60">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
              {t.land.area}
            </span>
            <div className="text-lg font-extrabold text-pine-950 dark:text-pine-100 mt-0.5">
              {formatNum(parcel.total_area)} {t.land.decimal}
            </div>
            <span className="text-[10px] text-gray-400">
              ({formatNum((parcel.total_area / 100).toFixed(3))} {t.land.acre})
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-pine-50/50 dark:bg-pine-950/20 border border-pine-100 dark:border-pine-800/60">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
              {locale === 'bn' ? 'জমির শ্রেণি' : 'Land Class'}
            </span>
            <div className="text-lg font-extrabold text-pine-950 dark:text-pine-100 mt-0.5">
              {locale === 'bn' ? parcel.land_class_bn : parcel.land_class}
            </div>
            <span className="text-[10px] text-gray-400">
              {locale === 'bn' ? 'অনুমোদিত ব্যবহার' : 'Classified Use'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-pine-50/50 dark:bg-pine-950/20 border border-pine-100 dark:border-pine-800/60">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
              {t.land.mutationStatus}
            </span>
            <div className="text-sm font-extrabold text-pine-950 dark:text-pine-100 mt-1 truncate">
              {parcel.mutation_status
                ? t.mutation.stages[parcel.mutation_status as keyof typeof t.mutation.stages] || parcel.mutation_status
                : locale === 'bn' ? 'রেকর্ড মেলেনি' : 'No Record'}
            </div>
            <span className="text-[10px] text-gray-400">
              {parcel.mutation_case_no || (locale === 'bn' ? 'সিমুলেশন' : 'Simulation')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-pine-50/50 dark:bg-pine-950/20 border border-pine-100 dark:border-pine-800/60">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
              {t.risk.score}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-lg font-black ${
                  parcel.risk_level === 'HIGH'
                    ? 'text-red-600'
                    : parcel.risk_level === 'MEDIUM'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {formatNum(parcel.risk_score)}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  parcel.risk_level === 'HIGH'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                    : parcel.risk_level === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}
              >
                {parcel.risk_level}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              {locale === 'bn' ? 'অ্যালগরিদমিক সূচক' : 'Deterministic score'}
            </span>
          </div>
        </div>

      </div>

      {/* P3 Risk Intelligence Alerts Box */}
      {risk && risk.findings.length > 0 && (
        <section className="bg-red-500/10 dark:bg-red-950/30 border border-red-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <h2 className="text-base font-extrabold text-red-950 dark:text-red-200">
                  {t.risk.title} ({formatNum(risk.findings.length)} টি অসঙ্গতি চিহ্নিত)
                </h2>
                <p className="text-xs text-red-800/80 dark:text-red-300/80">
                  {locale === 'bn' ? risk.summary_bn : risk.summary_en}
                </p>
              </div>
            </div>

            <Link
              href={`/${locale}/risk-alerts?parcel=${parcel.id}`}
              className="text-xs font-bold text-red-700 dark:text-red-300 hover:underline shrink-0"
            >
              {locale === 'bn' ? 'পূর্ণাঙ্গ বিশ্লেষণ' : 'Full analysis'}
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {risk.findings.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-white/90 dark:bg-civic-darkCard border border-red-200 dark:border-red-900/60 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span>{locale === 'bn' ? f.title_bn : f.title_en}</span>
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-bold">
                    +{formatNum(f.score_contribution)} pts
                  </span>
                </div>

                {/* Evidence Details */}
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-pine-950/40 border border-gray-100 dark:border-pine-900 text-xs font-mono space-y-1">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">
                    {t.risk.whyAlert}
                  </div>
                  {Object.entries(f.evidence_data).map(([key, val]) => (
                    <div key={key} className="text-gray-800 dark:text-gray-200">
                      <span className="text-gray-500">{key}:</span> {Array.isArray(val) ? val.join(', ') : String(val)}
                    </div>
                  ))}
                </div>

                {/* Recommended Human Action */}
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <strong className="text-pine-800 dark:text-pine-300">{t.risk.recommendedAction}:</strong>{' '}
                  {locale === 'bn' ? f.recommended_action_bn : f.recommended_action_en}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Survey Lineage Timeline (CS -> SA -> RS -> BS) */}
      <section className="bg-white dark:bg-civic-darkCard rounded-2xl p-6 sm:p-8 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-pine-100 dark:border-pine-800/60 pb-3">
          <h2 className="text-base font-bold text-pine-950 dark:text-pine-100 flex items-center gap-2">
            <History className="w-5 h-5 text-pine-600 dark:text-pine-400" />
            <span>{locale === 'bn' ? 'জরিপ ও খতিয়ানের কালানুক্রমিক ধারাবাহিকতা (CS → BS)' : 'Cadastral Survey Lineage (CS → BS)'}</span>
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {formatNum(parcel.khatians.length)} Records
          </span>
        </div>

        <div className="space-y-4">
          {parcel.khatians.map((k, index) => (
            <div
              key={k.id}
              className="p-4 rounded-xl border border-pine-100 dark:border-pine-800/80 bg-pine-50/20 dark:bg-pine-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-pine-700 text-white font-mono text-xs font-bold">
                    {k.survey_type}
                  </span>
                  <span className="text-sm font-bold text-pine-950 dark:text-pine-100">
                    {t.land.khatianNo}: {formatNum(k.khatian_no)}
                  </span>
                  {k.survey_year && (
                    <span className="text-xs text-gray-400 font-mono">
                      ({formatNum(k.survey_year)} {locale === 'bn' ? 'সাল' : ''})
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 pt-1">
                  <span className="font-semibold">{t.land.owners}: </span>
                  {k.owners.map((o) => (
                    <span key={o.owner_id} className="mr-2">
                      {locale === 'bn' ? o.name_bn : o.name}
                      {o.share_ana && <span className="opacity-75"> ({o.share_ana})</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-pine-700 dark:text-pine-300 font-mono font-medium shrink-0">
                {k.predecessor_khatian_id ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Link: {k.predecessor_khatian_id}</span>
                  </span>
                ) : (
                  <span className="text-gray-400">{index === 0 ? 'Root Survey' : 'No Predecessor Link'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ownership & Transfer Graph (Screen 8) with Accessible Table Toggle */}
      <OwnershipGraph
        khatians={parcel.khatians}
        transfers={parcel.transfers}
        parcelId={parcel.id}
      />

      {/* Transfers and Registered Deeds */}
      <section className="bg-white dark:bg-civic-darkCard rounded-2xl p-6 sm:p-8 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-pine-100 dark:border-pine-800/60 pb-3">
          <h2 className="text-base font-bold text-pine-950 dark:text-pine-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pine-600 dark:text-pine-400" />
            <span>{t.land.transfers}</span>
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            {formatNum(parcel.transfers.length)} Transactions
          </span>
        </div>

        {parcel.transfers.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            {locale === 'bn' ? 'কোনো হস্তান্তর দলিল রেকর্ড পাওয়া যায়নি।' : 'No registered transfer deeds recorded.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-pine-100 dark:border-pine-800 text-gray-500 dark:text-gray-400 font-bold uppercase">
                  <th className="py-2.5 px-3">দলিল নম্বর</th>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">বিক্রেতা</th>
                  <th className="py-2.5 px-3">ক্রেতা</th>
                  <th className="py-2.5 px-3">অংশ / পরিমাণ</th>
                  <th className="py-2.5 px-3">রেজিস্ট্রি অফিস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-pine-900/40">
                {parcel.transfers.map((tx) => (
                  <tr key={tx.id} className="hover:bg-pine-50/40 dark:hover:bg-pine-950/20">
                    <td className="py-3 px-3 font-mono font-bold text-pine-900 dark:text-pine-100">
                      {formatNum(tx.deed_no)}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-600 dark:text-gray-300">
                      {tx.registration_date.split('T')[0]}
                    </td>
                    <td className="py-3 px-3 text-gray-800 dark:text-gray-200">
                      {tx.seller_name_bn}
                    </td>
                    <td className="py-3 px-3 font-semibold text-pine-800 dark:text-pine-200">
                      {tx.buyer_name_bn}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {formatNum(tx.transferred_share * 100)}% ({formatNum(tx.transferred_area)} {t.land.decimal})
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {tx.registration_office_bn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
