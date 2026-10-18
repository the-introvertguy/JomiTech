'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { fetchParcels, ParcelSummary } from '@/lib/api';
import {
  Search,
  Filter,
  RotateCcw,
  MapPin,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ParcelSearchPage() {
  const { locale, t, formatNum } = useApp();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || searchParams.get('parcel') || '');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [mouza, setMouza] = useState('');
  const [dagNo, setDagNo] = useState('');
  const [khatianNo, setKhatianNo] = useState('');
  const [surveyType, setSurveyType] = useState('');
  
  const [parcels, setParcels] = useState<ParcelSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchParcels({
      q: q || undefined,
      division: division || undefined,
      district: district || undefined,
      upazila: upazila || undefined,
      mouza: mouza || undefined,
      dag_no: dagNo || undefined,
      khatian_no: khatianNo || undefined,
      survey_type: surveyType || undefined,
    });
    setParcels(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [q, division, district, upazila, mouza, dagNo, khatianNo, surveyType]);

  const handleReset = () => {
    setQ('');
    setDivision('');
    setDistrict('');
    setUpazila('');
    setMouza('');
    setDagNo('');
    setKhatianNo('');
    setSurveyType('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-pine-950 dark:text-pine-100 flex items-center gap-2.5">
            <Search className="w-6 h-6 text-pine-600 dark:text-pine-400" />
            <span>{t.nav.search}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {locale === 'bn'
              ? 'খতিয়ান, দাগ, মৌজা ও প্রশাসনিক এলাকা ভিত্তিক বিস্তারিত রেকর্ড অনুসন্ধান।'
              : 'Cadastral search across Khatians, Dags, Mouzas, and Administrative boundaries.'}
          </p>
        </div>

        {/* Quick Scenario Fillers */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-pine-600 dark:text-pine-400">
            {locale === 'bn' ? 'দৃশ্যপট:' : 'Fixture:'}
          </span>
          <button
            type="button"
            onClick={() => setQ('502')}
            className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-bold hover:bg-red-200"
          >
            {locale === 'bn' ? 'দাগ ৫০২ (দ্বৈত বিক্রয়)' : 'Dag 502 (Double Sale)'}
          </button>
          <button
            type="button"
            onClick={() => setQ('101')}
            className="text-xs px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-200"
          >
            {locale === 'bn' ? 'দাগ ১০১ (নিষ্কন্টক)' : 'Dag 101 (Clean)'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-civic-darkCard rounded-xl p-4 sm:p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-4">
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-pine-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'দাগ নম্বর, খতিয়ান, মৌজা, বা পার্সেল আইডি লিখুন...'
                : 'Search by Dag No., Khatian, Mouza, or Parcel ID...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-pine-200 dark:border-pine-800 bg-pine-50/30 dark:bg-pine-950/20 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pine-500"
          />
        </div>

        {/* Detailed Cadastral Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          
          {/* Division */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t.land.division}
            </label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-gray-200 dark:border-pine-900 bg-white dark:bg-civic-dark text-xs text-gray-800 dark:text-gray-200"
            >
              <option value="">{locale === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}</option>
              <option value="Dhaka">{locale === 'bn' ? 'ঢাকা' : 'Dhaka'}</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t.land.district}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-gray-200 dark:border-pine-900 bg-white dark:bg-civic-dark text-xs text-gray-800 dark:text-gray-200"
            >
              <option value="">{locale === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
              <option value="Dhaka">{locale === 'bn' ? 'ঢাকা' : 'Dhaka'}</option>
            </select>
          </div>

          {/* Upazila / Thana */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t.land.upazila}
            </label>
            <select
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-gray-200 dark:border-pine-900 bg-white dark:bg-civic-dark text-xs text-gray-800 dark:text-gray-200"
            >
              <option value="">{locale === 'bn' ? 'সকল থানা' : 'All Upazilas'}</option>
              <option value="Tejgaon">{locale === 'bn' ? 'তেজগাঁও' : 'Tejgaon'}</option>
              <option value="Gulshan">{locale === 'bn' ? 'গুলশান' : 'Gulshan'}</option>
              <option value="Dhanmondi">{locale === 'bn' ? 'ধানমন্ডি' : 'Dhanmondi'}</option>
              <option value="Mirpur">{locale === 'bn' ? 'মিরপুর' : 'Mirpur'}</option>
              <option value="Savar">{locale === 'bn' ? 'সাভার' : 'Savar'}</option>
            </select>
          </div>

          {/* Survey Type */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t.land.surveyType}
            </label>
            <select
              value={surveyType}
              onChange={(e) => setSurveyType(e.target.value)}
              className="w-full py-1.5 px-2 rounded-md border border-gray-200 dark:border-pine-900 bg-white dark:bg-civic-dark text-xs text-gray-800 dark:text-gray-200"
            >
              <option value="">{locale === 'bn' ? 'সকল সার্ভে' : 'All Surveys'}</option>
              <option value="CS">CS (সিএস)</option>
              <option value="SA">SA (এসএ)</option>
              <option value="RS">RS (আরএস)</option>
              <option value="BS">BS (বিএস)</option>
            </select>
          </div>

          {/* Dag No */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t.land.dagNo}
            </label>
            <input
              type="text"
              value={dagNo}
              onChange={(e) => setDagNo(e.target.value)}
              placeholder="e.g. 502"
              className="w-full py-1.5 px-2 rounded-md border border-gray-200 dark:border-pine-900 bg-white dark:bg-civic-dark text-xs text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-1.5 px-3 rounded-md border border-gray-300 dark:border-pine-800 hover:bg-gray-100 dark:hover:bg-pine-900/40 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.actions.reset}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>
            {locale === 'bn'
              ? `মোট প্রাপ্ত পার্সেল রেকর্ড: ${formatNum(parcels.length)} টি`
              : `Total parcels found: ${formatNum(parcels.length)}`}
          </span>
          <span className="text-[11px] font-medium text-pine-600 dark:text-pine-400">
            {locale === 'bn' ? 'সিন্থেটিক ডেমো ডেটাবেজ' : 'Synthetic Demo DB'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500 bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800">
            <div className="w-6 h-6 border-2 border-pine-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>{locale === 'bn' ? 'রেকর্ড অনুসন্ধান করা হচ্ছে...' : 'Searching cadastral records...'}</span>
          </div>
        ) : parcels.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800 space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {locale === 'bn' ? 'কোনো পার্সেল রেকর্ড পাওয়া যায়নি' : 'No Parcels Found'}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {locale === 'bn'
                ? 'দাগ নম্বর বা মৌজার নাম পরিবর্তন করে পুনরায় চেষ্টা করুন। যেমন: দাগ ৫০২ বা ১০১।'
                : 'Try adjusting your search criteria, or test with sample dags like 502 or 101.'}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-pine-700 dark:text-pine-300 font-bold underline"
            >
              {t.actions.reset}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parcels.map((parcel) => (
              <div
                key={parcel.id}
                className="p-5 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200/80 dark:border-pine-800/80 shadow-xs hover:border-pine-400 dark:hover:border-pine-600 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  
                  {/* Top Bar: Parcel ID + Risk Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-pine-100 dark:border-pine-800/60 pb-2.5">
                    <div>
                      <span className="font-mono text-xs font-bold text-pine-700 dark:text-pine-300">
                        {parcel.id}
                      </span>
                      <h3 className="text-base font-extrabold text-pine-950 dark:text-pine-100 mt-0.5">
                        {t.land.dagNo}: {formatNum(parcel.dag_no)}
                      </h3>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        parcel.risk_level === 'HIGH'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border border-red-300/50'
                          : parcel.risk_level === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/50'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/50'
                      }`}
                    >
                      <span>
                        {parcel.risk_level === 'HIGH'
                          ? t.risk.high
                          : parcel.risk_level === 'MEDIUM'
                          ? t.risk.medium
                          : t.risk.low}
                      </span>
                      <span className="font-mono text-[11px] opacity-80">
                        ({formatNum(parcel.risk_score)})
                      </span>
                    </span>
                  </div>

                  {/* Parcel Details Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-[11px]">
                        {t.land.mouza}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {locale === 'bn' ? parcel.administrative_area.mouza_bn : parcel.administrative_area.mouza}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-[11px]">
                        {t.land.upazila}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {locale === 'bn' ? parcel.administrative_area.upazila_bn : parcel.administrative_area.upazila}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-[11px]">
                        {t.land.area}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatNum(parcel.total_area)} {t.land.decimal}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-[11px]">
                        {locale === 'bn' ? 'জমির শ্রেণি' : 'Classification'}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {locale === 'bn' ? parcel.land_class_bn : parcel.land_class}
                      </span>
                    </div>
                  </div>

                  {/* Survey Lineage Tags */}
                  <div className="pt-3 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {locale === 'bn' ? 'সার্ভে দাগ:' : 'Surveys:'}
                    </span>
                    {parcel.cs_dag && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-pine-900/50 text-[10px] font-mono">
                        CS: {formatNum(parcel.cs_dag)}
                      </span>
                    )}
                    {parcel.sa_dag && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-pine-900/50 text-[10px] font-mono">
                        SA: {formatNum(parcel.sa_dag)}
                      </span>
                    )}
                    {parcel.rs_dag && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-pine-900/50 text-[10px] font-mono">
                        RS: {formatNum(parcel.rs_dag)}
                      </span>
                    )}
                    {parcel.bs_dag && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-pine-900/50 text-[10px] font-mono font-bold text-pine-700 dark:text-pine-300">
                        BS: {formatNum(parcel.bs_dag)}
                      </span>
                    )}
                  </div>

                  {/* Current Owners */}
                  {parcel.current_owners.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-pine-800/40 text-xs">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">
                        {t.land.currentHolder}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {parcel.current_owners.map((owner) => (
                          <span
                            key={owner.owner_id}
                            className="px-2 py-0.5 rounded-md bg-pine-50 dark:bg-pine-900/30 text-pine-900 dark:text-pine-200 text-xs font-semibold"
                          >
                            {locale === 'bn' ? owner.name_bn : owner.name}
                            {owner.share_ana && (
                              <span className="font-normal text-[11px] text-gray-500 ml-1">
                                ({owner.share_ana})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-pine-100 dark:border-pine-800/60 flex items-center justify-between gap-2">
                  <Link
                    href={`/${locale}/parcel/${parcel.id}`}
                    className="text-xs font-bold text-pine-700 dark:text-pine-300 hover:text-pine-900 flex items-center gap-1"
                  >
                    <span>{t.actions.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/${locale}/buyer-report?parcel=${parcel.id}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{locale === 'bn' ? 'ক্রয় পূর্ব যাচাই' : 'Buyer Report'}</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
