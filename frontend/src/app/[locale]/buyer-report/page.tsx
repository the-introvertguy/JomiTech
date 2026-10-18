'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { API_BASE_URL } from '@/lib/api';
import { CadastralLogo } from '@/components/CadastralLogo';
import {
  FileSearch,
  Printer,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  QrCode,
  Layers,
  History,
  FileText
} from 'lucide-react';

interface OwnerShare {
  owner_id: string;
  name: string;
  name_bn: string;
  father_name?: string;
  father_name_bn?: string;
  share_fraction: number;
  share_ana: string;
  area_owned: number;
}

interface KhatianTimeline {
  id: string;
  survey_type: string;
  khatian_no: string;
  khatian_no_bn?: string;
  survey_year?: number;
  predecessor_khatian_id?: string;
  owners?: OwnerShare[];
  remarks?: string;
}

interface TransferTimeline {
  id: string;
  deed_no: string;
  deed_no_bn?: string;
  registration_office_bn?: string;
  registration_date?: string;
  transferred_area: number;
  transferred_share: number;
  seller_name_bn?: string;
  buyer_name_bn?: string;
  status: string;
}

interface ParcelDetail {
  id: string;
  dag_no: string;
  dag_no_bn?: string;
  cs_dag?: string;
  sa_dag?: string;
  rs_dag?: string;
  bs_dag?: string;
  total_area: number;
  area_unit: string;
  land_class: string;
  land_class_bn?: string;
  administrative_area: {
    id?: string;
    division: string;
    division_bn: string;
    district: string;
    district_bn: string;
    upazila: string;
    upazila_bn: string;
    mouza: string;
    mouza_bn: string;
    jl_no: string;
    jl_no_bn?: string;
  };
  current_owners: OwnerShare[];
  encumbrances: Array<{
    encumbrance_type: string;
    details: string;
    details_bn: string;
    is_active: boolean;
  }>;
  khatians: KhatianTimeline[];
  transfers: TransferTimeline[];
  mutation_status: string;
  mutation_case_no?: string;
  risk_score: number;
  risk_level: string;
  risk_summary_bn?: string;
  risk_summary_en?: string;
}

interface RiskFinding {
  id: string;
  rule_code: string;
  severity: string;
  score_contribution: number;
  title_bn: string;
  title_en: string;
  evidence_data: Record<string, any>;
  recommended_action_bn: string;
  recommended_action_en: string;
  limitation_notice_bn?: string;
  limitation_notice_en?: string;
}

interface RiskAssessment {
  id: string;
  parcel_id: string;
  total_score: number;
  risk_level: string;
  rule_version: string;
  assessed_at: string;
  summary_bn?: string;
  summary_en?: string;
  findings: RiskFinding[];
}

export default function BuyerReportPage() {
  const { locale, t, toLocalDigits } = useApp();
  const searchParams = useSearchParams();

  // Accept either ?parcel=... or ?parcelId=...
  const urlParcel = searchParams.get('parcel') || searchParams.get('parcelId') || 'PCL-DH-101';

  const [selectedParcelId, setSelectedParcelId] = useState<string>(urlParcel);
  const [parcel, setParcel] = useState<ParcelDetail | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state if URL query param changes
  useEffect(() => {
    const p = searchParams.get('parcel') || searchParams.get('parcelId');
    if (p && p !== selectedParcelId) {
      setSelectedParcelId(p);
    }
  }, [searchParams]);

  // Deterministic 12 Seeded Scenarios
  const sampleParcels = [
    { id: 'PCL-DH-101', label: 'PCL-DH-101 (স্বচ্ছ চেইন / Clean Chain)' },
    { id: 'PCL-DH-502', label: 'PCL-DH-502 (দ্বৈত বিক্রয় ঝুঁকি / Double-Sale Alert)' },
    { id: 'PCL-DH-703', label: 'PCL-DH-703 (মালিকানা ও বিক্রেতা অমিল / Seller Mismatch)' },
    { id: 'PCL-DH-204', label: 'PCL-DH-204 (ডুপ্লিকেট দলিল / Duplicate Deed Hash)' },
    { id: 'PCL-DH-605', label: 'PCL-DH-605 (অতিরিক্ত হিস্যা হস্তান্তর / Share Exceeded)' },
    { id: 'PCL-DH-306', label: 'PCL-DH-306 (নামজারিহীন দলিল / Unmutated Deed)' },
    { id: 'PCL-DH-807', label: 'PCL-DH-807 (আবেদনকারী তথ্যে অমিল / Party Mismatch)' },
    { id: 'PCL-DH-408', label: 'PCL-DH-408 (কালানুক্রমিক অসঙ্গতি / Impossible Date)' },
    { id: 'PCL-DH-909', label: 'PCL-DH-909 (সরকারি খাস বা অর্পিত সম্পত্তি / Khas Flag)' },
    { id: 'PCL-DH-310', label: 'PCL-DH-310 (খতিয়ান ধারাবাহিকতা বিচ্ছিন্ন / Survey Gap)' },
    { id: 'PCL-DH-511', label: 'PCL-DH-511 (নিম্ন ওসিআর নির্ভুলতা / Low OCR Confidence)' },
    { id: 'PCL-DH-901', label: 'PCL-DH-901 (বৈধ শরিকানা হস্তান্তর / Valid Co-Ownership)' },
  ];

  useEffect(() => {
    if (!selectedParcelId) return;

    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [parcelRes, riskRes] = await Promise.all([
          fetch(`${API_BASE_URL}/parcels/${selectedParcelId}`),
          fetch(`${API_BASE_URL}/parcels/${selectedParcelId}/risk`),
        ]);

        if (!parcelRes.ok) {
          throw new Error(
            locale === 'bn'
              ? `পার্সেল রেকর্ড (${selectedParcelId}) খুঁজে পাওয়া যায়নি।`
              : `Parcel record (${selectedParcelId}) could not be retrieved.`
          );
        }

        const parcelData: ParcelDetail = await parcelRes.json();
        const riskData: RiskAssessment | null = riskRes.ok ? await riskRes.json() : null;

        setParcel(parcelData);
        setRisk(riskData);
      } catch (err: any) {
        setError(err.message || 'প্রতিবেদন প্রস্তুত করা যায়নি।');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedParcelId, locale]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getRiskBadge = (level: string) => {
    const l = (level || 'LOW').toUpperCase();
    if (l === 'HIGH') {
      return {
        bg: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
        label: locale === 'bn' ? 'উচ্চ ঝুঁকি / ক্রয় স্থগিত রাখা বাঞ্ছনীয়' : 'HIGH RISK / Exercise Caution',
        icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      };
    }
    if (l === 'MEDIUM') {
      return {
        bg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
        label: locale === 'bn' ? 'মাঝারি ঝুঁকি / নথিপত্র পুনঃযাচাই প্রয়োজন' : 'MEDIUM RISK / Additional Review Advised',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      };
    }
    return {
      bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
      label: locale === 'bn' ? 'স্বাভাবিক / কোনো সুস্পষ্ট অসঙ্গতি চিহ্নিত হয়নি' : 'LOW RISK / Clean Chain Recorded',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    };
  };

  const latestKhatian = parcel?.khatians && parcel.khatians.length > 0
    ? parcel.khatians[parcel.khatians.length - 1]
    : null;

  const effectiveRiskLevel = risk?.risk_level || parcel?.risk_level || 'LOW';
  const effectiveScore = risk?.total_score ?? parcel?.risk_score ?? 0;
  const effectiveSummary = locale === 'bn'
    ? (risk?.summary_bn || parcel?.risk_summary_bn || 'মালিকানা শৃঙ্খল স্বাভাবিক।')
    : (risk?.summary_en || parcel?.risk_summary_en || 'Chain of title is clean.');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Non-printing Control Bar */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-200 dark:border-pine-800 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-pine-950 dark:text-pine-100">
              <FileSearch className="w-6 h-6 text-emerald-600" />
              <span>{t.nav.buyerReport}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {locale === 'bn'
                ? 'জমি কেনার আগে সম্ভাব্য ঝুঁকি, স্বত্বধারাবাহিকতা ও মাঠপর্যায়ের যাচাই চেকলিস্ট (এ৪ প্রিন্ট উপযোগী)'
                : 'Pre-purchase due diligence, title continuity audit & risk assessment (A4 Print-Ready)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={!parcel || loading}
              className="px-4 py-2 rounded-lg bg-pine-700 hover:bg-pine-800 disabled:opacity-50 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{locale === 'bn' ? 'প্রিন্ট / পিডিএফ সংরক্ষণ' : 'Print / Save PDF'}</span>
            </button>
          </div>
        </div>

        {/* Scenario Switcher in Screen View */}
        <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs font-semibold text-pine-900 dark:text-pine-100 shrink-0">
            {locale === 'bn' ? 'পার্সেল নির্বাচন:' : 'Select Parcel:'}
          </span>
          <div className="flex-1 flex gap-2 w-full">
            <select
              value={selectedParcelId}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              className="flex-1 p-2.5 rounded-lg border border-pine-300 dark:border-pine-700 bg-white dark:bg-pine-950/40 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-pine-600"
            >
              {sampleParcels.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-12 text-center text-xs text-gray-500 bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800">
          <div className="w-6 h-6 border-2 border-pine-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>{locale === 'bn' ? 'যাচাই প্রতিবেদন সংকলন করা হচ্ছে...' : 'Assembling due diligence report...'}</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-900 dark:text-red-200 text-sm flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="font-semibold">{locale === 'bn' ? 'প্রতিবেদন লোড করা যায়নি' : 'Report Load Error'}</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* A4 REPORT CONTAINER */}
      {parcel && !loading && (
        <div className="bg-white text-gray-900 p-8 sm:p-12 rounded-2xl border border-pine-200 shadow-md print:border-none print:shadow-none print:p-0 print:m-0 max-w-[210mm] mx-auto print:max-w-none">
          
          {/* Civic Header / Letterhead */}
          <div className="border-b-2 border-pine-800 pb-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <CadastralLogo className="w-12 h-12 text-pine-800" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-pine-950 tracking-tight">
                    {locale === 'bn' ? 'জমিটেক — জমি ক্রয়-পূর্ব অনুসন্ধান ও ঝুঁকি প্রতিবেদন' : 'JomiTech — Pre-Purchase Land Diligence Report'}
                  </h1>
                  <p className="text-xs text-pine-700 font-medium">
                    {locale === 'bn'
                      ? 'নাগরিক রেকর্ড বিশ্লেষণ ও স্বয়ংক্রিয় অসঙ্গতি পর্যবেক্ষণ ব্যবস্থা'
                      : 'Citizen Land Record Intelligence & Discrepancy Prevention'}
                  </p>
                </div>
              </div>

              {/* Report Reference & Stamp */}
              <div className="text-right text-xs">
                <div className="inline-block p-1 bg-pine-50 border border-pine-200 rounded">
                  <QrCode className="w-10 h-10 text-pine-900 mx-auto" />
                </div>
                <p className="font-mono text-[10px] text-gray-500 mt-1">
                  REP-{parcel.id}-{new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Mandatory Civic Disclaimer */}
            <div className="mt-4 p-2.5 rounded bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {locale === 'bn' ? 'আইনি সীমাবদ্ধতা ও ঘোষণা:' : 'Civic Disclaimer & Limitation:'}
                </span>{' '}
                {locale === 'bn'
                  ? 'এই প্রতিবেদনটি একটি গবেষণা ও প্রদর্শনী প্রোটোটাইপের কাল্পনিক সিন্থেটিক ডেটার ভিত্তিতে স্বয়ংক্রিয়ভাবে প্রস্তুত। এটি কোনো আদালতীয় স্বত্ব প্রত্যয়নপত্র, সরকারি মালিকানা সনদ বা আইনি পরামর্শ নয়। জমি কেনার পূর্বে সংশ্লিষ্ট সাব-রেজিস্ট্রি ও সহকারী কমিশনার (ভূমি) অফিস থেকে মূল নথিপত্র যাচাই এবং মাঠপর্যায়ে সরেজমিন দখল অনুসন্ধান আবশ্যক।'
                  : 'This report is automatically assembled from synthetic demonstration records. It does not certify legal title or substitute official government verification. Physical possession inquiries, volume inspections at the Sub-Registry, and record checks at the AC Land office remain mandatory.'}
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary & Overall Risk */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-pine-900 border-l-4 border-pine-700 pl-2">
                {locale === 'bn' ? '১. সারসংক্ষেপ ও সামগ্রিক ঝুঁকি সূচক' : '1. Executive Summary & Overall Risk Rating'}
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                {locale === 'bn' ? 'তারিখ: ' : 'Date: '}
                {toLocalDigits(new Date().toISOString().split('T')[0])}
              </span>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${getRiskBadge(effectiveRiskLevel).bg}`}>
              <div className="flex items-center gap-3">
                {getRiskBadge(effectiveRiskLevel).icon}
                <div>
                  <span className="text-xs uppercase font-bold tracking-wide">
                    {locale === 'bn' ? 'মূল্যায়ন স্থিতি' : 'Assessment Result'}
                  </span>
                  <h3 className="text-base font-extrabold">
                    {getRiskBadge(effectiveRiskLevel).label}
                  </h3>
                  <p className="text-xs mt-0.5">
                    {effectiveSummary}
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-current/20 sm:pl-4 shrink-0">
                <span className="text-[10px] uppercase font-semibold block">
                  {locale === 'bn' ? 'ঝুঁকি স্কোর' : 'Risk Score'}
                </span>
                <span className="text-2xl font-black font-mono">
                  {toLocalDigits(effectiveScore)}/১০০
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Parcel Identification */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-pine-900 border-l-4 border-pine-700 pl-2">
              {locale === 'bn' ? '২. জমির মৌলিক পরিচিতি ও তপশিল' : '2. Parcel Identification & Cadastral Schedule'}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-gray-200 rounded-lg p-3 bg-gray-50/50">
              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'পার্সেল আইডি' : 'Parcel ID'}</span>
                <span className="font-mono font-bold text-pine-950">{parcel.id}</span>
              </div>
              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'বিভাগ ও জেলা' : 'Division & District'}</span>
                <span className="font-semibold">
                  {locale === 'bn'
                    ? `${parcel.administrative_area.division_bn}, ${parcel.administrative_area.district_bn}`
                    : `${parcel.administrative_area.division}, ${parcel.administrative_area.district}`}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'উপজেলা ও মৌজা' : 'Upazila & Mouza'}</span>
                <span className="font-semibold">
                  {locale === 'bn'
                    ? `${parcel.administrative_area.upazila_bn}, ${parcel.administrative_area.mouza_bn}`
                    : `${parcel.administrative_area.upazila}, ${parcel.administrative_area.mouza}`}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'জেএল নম্বর' : 'J.L. No.'}</span>
                <span className="font-mono font-semibold">{toLocalDigits(parcel.administrative_area.jl_no_bn || parcel.administrative_area.jl_no)}</span>
              </div>

              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'দাগ নম্বর' : 'Dag / Plot'}</span>
                <span className="font-semibold font-mono">
                  {toLocalDigits(parcel.dag_no_bn || parcel.dag_no)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'সর্বশেষ খতিয়ান' : 'Latest Khatian'}</span>
                <span className="font-semibold font-mono">
                  {latestKhatian ? `${latestKhatian.survey_type} ${toLocalDigits(latestKhatian.khatian_no_bn || latestKhatian.khatian_no)}` : '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'রেকর্ডীয় পরিমাণ' : 'Recorded Area'}</span>
                <span className="font-bold text-pine-900">
                  {toLocalDigits(parcel.total_area)} {locale === 'bn' ? 'শতক' : 'Decimal'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">{locale === 'bn' ? 'জমির শ্রেণি' : 'Land Class'}</span>
                <span className="font-semibold">
                  {locale === 'bn' ? (parcel.land_class_bn || parcel.land_class) : parcel.land_class}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Recorded Owners & Shares */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-pine-900 border-l-4 border-pine-700 pl-2">
              {locale === 'bn' ? '৩. রেকর্ডীয় মালিকগণ ও হিস্যা' : '3. Recorded Owners & Share Allocation'}
            </h2>

            <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-pine-50 border-b border-gray-200 text-pine-950 font-semibold text-left">
                <tr>
                  <th className="p-2.5">{locale === 'bn' ? 'মালিকের নাম' : 'Owner Name'}</th>
                  <th className="p-2.5">{locale === 'bn' ? 'পিতা/স্বামীর নাম' : 'Father / Spouse'}</th>
                  <th className="p-2.5 text-center">{locale === 'bn' ? 'মালিকানা অংশ' : 'Share Fraction'}</th>
                  <th className="p-2.5 text-center">{locale === 'bn' ? 'আনা হিস্যা' : 'Share (Ana)'}</th>
                  <th className="p-2.5 text-right">{locale === 'bn' ? 'প্রাপ্য জমি (শতক)' : 'Entitled Area (Dec)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(parcel.current_owners || []).map((o, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2.5 font-medium">
                      {locale === 'bn' ? o.name_bn : o.name}
                    </td>
                    <td className="p-2.5 text-gray-500">
                      {locale === 'bn' ? (o.father_name_bn || o.father_name || '—') : (o.father_name || '—')}
                    </td>
                    <td className="p-2.5 text-center font-mono">
                      {toLocalDigits(o.share_fraction)}
                    </td>
                    <td className="p-2.5 text-center font-medium">
                      {o.share_ana}
                    </td>
                    <td className="p-2.5 text-right font-mono font-semibold">
                      {toLocalDigits(o.area_owned || (parcel.total_area * o.share_fraction).toFixed(2))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Chain of Title Lineage (CS to BS) */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-pine-900 border-l-4 border-pine-700 pl-2">
              {locale === 'bn' ? '৪. খতিয়ান ধারাবাহিকতা ও জরিপ শৃঙ্খল (CS → SA → RS → BS)' : '4. Chain of Title Progression (CS → SA → RS → BS)'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              {(parcel.khatians || []).map((k) => (
                <div key={k.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50/70">
                  <span className="font-mono font-bold text-pine-800 text-[11px] block">
                    {k.survey_type} {locale === 'bn' ? 'খতিয়ান' : 'Khatian'}
                  </span>
                  <p className="font-mono text-sm font-extrabold text-pine-950 mt-0.5">
                    {toLocalDigits(k.khatian_no_bn || k.khatian_no)}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {k.survey_year ? `${locale === 'bn' ? 'জরিপ সন: ' : 'Survey Year: '}${toLocalDigits(k.survey_year)}` : '—'}
                  </p>
                  {k.predecessor_khatian_id && (
                    <p className="text-[9px] text-gray-400 font-mono mt-0.5 truncate">
                      Ancestry: {k.predecessor_khatian_id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Risk Intelligence Findings & Evidence */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-pine-900 border-l-4 border-pine-700 pl-2">
              {locale === 'bn' ? '৫. চিহ্নিত ঝুঁকি, অসঙ্গতি ও প্রমাণক' : '5. Identified Risks, Discrepancies & Evidence'}
            </h2>

            {risk && risk.findings && risk.findings.length > 0 ? (
              <div className="space-y-3">
                {risk.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                      f.severity === 'HIGH'
                        ? 'bg-red-50/70 border-red-200'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {f.severity === 'HIGH' ? (
                          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="font-bold text-gray-900">
                          {locale === 'bn' ? f.title_bn : f.title_en}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border font-semibold">
                        {f.rule_code}
                      </span>
                    </div>

                    {/* Evidence Points */}
                    {f.evidence_data && Object.keys(f.evidence_data).length > 0 && (
                      <div className="bg-white p-2.5 rounded border border-gray-200 space-y-1">
                        <span className="font-semibold text-gray-700 text-[10px] block">
                          {locale === 'bn' ? 'শনাক্তকৃত অসঙ্গতির প্রমাণসমূহ:' : 'Evidence References:'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-700">
                          {Object.entries(f.evidence_data).map(([key, val], eIdx) => (
                            <div key={eIdx} className="flex items-start gap-1">
                              <span className="font-medium text-gray-900 capitalize shrink-0">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="font-mono">
                                {Array.isArray(val)
                                  ? val.join(', ')
                                  : typeof val === 'object'
                                  ? JSON.stringify(val)
                                  : toLocalDigits(String(val))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-pine-900 font-medium pt-1">
                      <span className="font-bold">{locale === 'bn' ? 'সুপারিশকৃত পদক্ষেপ: ' : 'Recommended Action: '}</span>
                      <span>{locale === 'bn' ? f.recommended_action_bn : f.recommended_action_en}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {locale === 'bn'
                    ? 'কোনো সক্রিয় দ্বৈত বিক্রয় বা প্রতারণামূলক অসঙ্গতি পাওয়া যায়নি। স্বত্ব শৃঙ্খল স্বাভাবিক।'
                    : 'No active double-selling or severe discrepancies detected in recorded lineage.'}
                </span>
              </div>
            )}
          </div>

          {/* Section 6: Pre-Purchase Physical & Legal Verification Checklist */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-pine-900 border-l-4 border-pine-700 pl-2">
              {locale === 'bn' ? '৬. জমি ক্রেতার জন্য মাঠপর্যায়ের অপরিহার্য যাচাই চেকলিস্ট' : '6. Buyer Due Diligence Action Checklist'}
            </h2>

            <div className="space-y-2 border border-gray-200 rounded-lg p-3.5 text-xs bg-gray-50/40">
              {[
                {
                  bn: '১. সরেজমিন পরিদর্শন ও দখলদার যাচাই: বিক্রেতার প্রকৃত শারীরিক দখল আছে কিনা এবং সীমানা চিহ্নিত কিনা নিশ্চিত হোন।',
                  en: '1. Physical Inspection & Possession: Verify actual physical possession and boundary pillars on the ground.',
                },
                {
                  bn: '২. সহকারী কমিশনার (ভূমি) অফিস: মূল নামজারি নথি, প্রস্তাব খতিয়ান ও হাল সনের দাখিলা/ভূমি উন্নয়ন কর পরিশোধ যাচাই করুন।',
                  en: '2. AC Land Office: Confirm registered mutation khatian, DCR receipt, and up-to-date land tax (Dakhila) clearance.',
                },
                {
                  bn: '৩. সাব-রেজিস্ট্রি অফিসে ভলিউম তল্লাশি: গত ১২ বছরের মধ্যে এই দাগে অন্য কোনো বায়নাপত্র বা হস্তান্তর রেজিস্ট্রি হয়েছে কিনা (১২ নং ফরম তল্লাশি)।',
                  en: '3. Sub-Registry Volume Search: Search registered index volumes for the last 12 years to rule out unrecorded encumbrances or prior sales (Form 12).',
                },
                {
                  bn: '৪. ওয়ারিশান সনদ ও অংশীদারিত্ব: বিক্রেতা উত্তরাধিকারসূত্রে মালিক হলে স্থানীয় জনপ্রতিনিধির বৈধ ওয়ারিশান সনদ ও শরিকদের হিস্যা পরীক্ষা করুন।',
                  en: '4. Legal Heirship Certification: If acquired via inheritance, verify legitimate family tree certificate and co-heir shares.',
                },
                {
                  bn: '৫. সরকারি অধিগ্রহণ বা মামলা যাচাই: জেলা প্রশাসকের ভূমি অধিগ্রহণ শাখা ও সংশ্লিষ্ট আদালতে কোনো মামলা বিচারাধীন নেই মর্মে নিশ্চিত হোন।',
                  en: '5. Non-Acquisition & Non-Encumbrance: Ascertain absence of pending government acquisition or court injunctions.',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-gray-700">
                  <div className="w-3.5 h-3.5 rounded border border-gray-400 mt-0.5 shrink-0" />
                  <span>{locale === 'bn' ? item.bn : item.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Footer */}
          <div className="pt-6 border-t-2 border-gray-200 text-center text-[10px] text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700">
              {locale === 'bn'
                ? 'জমিটেক — বাংলাদেশ ভূমি রেকর্ড যাচাই ও প্রযুক্তি প্ল্যাটফর্ম ২০২৬ (প্রোটোটাইপ)'
                : 'JomiTech — Bangladesh Land Record Intelligence Platform 2026 (Research Prototype)'}
            </p>
            <p>
              {locale === 'bn'
                ? 'এই নথিটি কম্পিউটার দ্বারা স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত। কোনো শারীরিক স্বাক্ষরের প্রয়োজন নেই।'
                : 'This diligence report is computer-generated. No physical signature is required.'}
            </p>
            <p className="font-mono text-gray-400">
              Verification Hash: SHA256-SYNTHETIC-{parcel.id}-VERIFIED
            </p>
          </div>

        </div>
      )}

      {/* Back to Parcel Link */}
      {parcel && (
        <div className="print:hidden flex justify-between items-center text-xs text-pine-700 dark:text-pine-300 pt-2">
          <Link
            href={`/${locale}/parcel/${parcel.id}`}
            className="flex items-center gap-1.5 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'পার্সেল বিস্তারিত পাতায় ফিরে যান' : 'Back to Parcel Details'}</span>
          </Link>
          <span className="text-gray-400">
            {locale === 'bn' ? 'ব্রাউজার থেকে সরাসরি A4 আকারে প্রিন্ট নেওয়া যাবে' : 'Directly printable to A4 from any modern browser'}
          </span>
        </div>
      )}
    </div>
  );
}
