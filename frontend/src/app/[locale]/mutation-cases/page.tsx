'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { API_BASE_URL } from '@/lib/api';
import {
  FileSpreadsheet,
  CheckSquare,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  User,
  History,
  Send,
  RefreshCw,
  Search
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  item_code: string;
  label_bn: string;
  label_en: string;
  is_checked: boolean;
  checked_by?: string;
  checked_at?: string;
}

interface MutationEventItem {
  id: string;
  from_stage: string;
  to_stage: string;
  actor_name: string;
  notes?: string;
  created_at: string;
}

interface MutationCaseDetail {
  id: string;
  case_no: string;
  case_no_bn: string;
  opaque_reference: string;
  parcel_id: string;
  deed_id?: string;
  applicant_name: string;
  applicant_name_bn: string;
  applicant_nid?: string;
  status: string;
  office_name: string;
  office_name_bn: string;
  remarks?: string;
  submitted_at: string;
  updated_at: string;
  checklist: ChecklistItem[];
  events: MutationEventItem[];
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ['FIELD_INVESTIGATION', 'REJECTED'],
  FIELD_INVESTIGATION: ['HEARING_SCHEDULED', 'OFFICER_REVIEW', 'REJECTED'],
  HEARING_SCHEDULED: ['OFFICER_REVIEW', 'REJECTED'],
  OFFICER_REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: [],
  REJECTED: [],
};

const STAGE_LABELS: Record<string, { bn: string; en: string }> = {
  SUBMITTED: { bn: 'দাখিলকৃত', en: 'Submitted' },
  FIELD_INVESTIGATION: { bn: 'সরেজমিন তদন্ত', en: 'Field Investigation' },
  HEARING_SCHEDULED: { bn: 'শুনানি নির্ধারিত', en: 'Hearing Scheduled' },
  OFFICER_REVIEW: { bn: 'এসিল্যান্ড পর্যালোচনা', en: 'AC Land Review' },
  APPROVED: { bn: 'নামজারি মঞ্জুর ও সৃজিত', en: 'Approved & Mutated' },
  REJECTED: { bn: 'নামজারি না-মঞ্জুর', en: 'Rejected' },
};

export default function MutationCasesPage() {
  const { locale, t, toLocalDigits, currentUser } = useApp();
  const [cases, setCases] = useState<MutationCaseDetail[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<MutationCaseDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [targetStage, setTargetStage] = useState<string>('');
  const [transitionReason, setTransitionReason] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch all mutation cases
  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mutation-cases`);
      if (res.ok) {
        const data = await res.json();
        setCases(data);
        if (data.length > 0 && !selectedCaseId) {
          setSelectedCaseId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Fetch details for selected case
  useEffect(() => {
    if (!selectedCaseId) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/mutation-cases/${selectedCaseId}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedCase(data);
          const allowed = ALLOWED_TRANSITIONS[data.status] || [];
          setTargetStage(allowed[0] || '');
          setTransitionReason('');
          setActionSuccess(null);
          setActionError(null);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDetail();
  }, [selectedCaseId]);

  // Handle checklist checkbox toggle
  const toggleChecklist = (code: string) => {
    if (!selectedCase) return;
    const updated = selectedCase.checklist.map(item =>
      item.item_code === code ? { ...item, is_checked: !item.is_checked } : item
    );
    setSelectedCase({ ...selectedCase, checklist: updated });
  };

  // Submit stage transition
  const handleTransition = async () => {
    if (!selectedCase || !targetStage) return;
    if (!transitionReason.trim()) {
      setActionError(
        locale === 'bn'
          ? 'অনুগ্রহ করে পরিবর্তনের স্বপক্ষে আদেশ বা কারণ উল্লেখ করুন।'
          : 'Please provide official order notes or rationale for this stage transition.'
      );
      return;
    }

    setTransitioning(true);
    setActionError(null);
    setActionSuccess(null);

    const checklistPayload: Record<string, boolean> = {};
    selectedCase.checklist.forEach(item => {
      checklistPayload[item.item_code] = item.is_checked;
    });

    try {
      const res = await fetch(`${API_BASE_URL}/mutation-cases/${selectedCase.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_stage: targetStage,
          reason: transitionReason,
          checklist_updates: checklistPayload,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'ট্রানজিশন প্রক্রিয়া ব্যর্থ হয়েছে।');
      }

      const updated = await res.json();
      setSelectedCase(updated);
      setActionSuccess(
        locale === 'bn'
          ? `কেস সফলভাবে "${STAGE_LABELS[targetStage]?.bn || targetStage}" ধাপে স্থানান্তর করা হয়েছে এবং অডিট রেকর্ড লিপিবদ্ধ হয়েছে।`
          : `Case transitioned to "${STAGE_LABELS[targetStage]?.en || targetStage}" and audit log recorded.`
      );
      // Refresh cases list
      fetchCases();
    } catch (e: any) {
      setActionError(e.message || 'ব্যর্থ হয়েছে');
    } finally {
      setTransitioning(false);
    }
  };

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.case_no.toLowerCase().includes(q) ||
        c.applicant_name.toLowerCase().includes(q) ||
        c.parcel_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const allowedNextStages = selectedCase ? ALLOWED_TRANSITIONS[selectedCase.status] || [] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-pine-950 dark:text-pine-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-blue-700 dark:text-blue-300" />
            </div>
            <span>{t.nav.mutationCases}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {locale === 'bn'
              ? 'ভূমি কর্মকর্তা ইন্টারফেস — বিধিবদ্ধ চেকলিস্ট, শুনানির নোট ও ধাপভিত্তিক ই-নামজারি প্রক্রিয়া'
              : 'Officer Case Management — Statutory checklist, hearing orders, and state-machine transitions'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCases}
            className="px-3 py-1.5 rounded-lg border border-pine-200 dark:border-pine-800 hover:bg-pine-50 dark:hover:bg-pine-900/30 text-xs font-medium text-pine-700 dark:text-pine-300 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{locale === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Cases List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={locale === 'bn' ? 'কেস নং, পার্সেল বা আবেদনকারী...' : 'Case no, parcel, applicant...'}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-pine-200 dark:border-pine-800 bg-white dark:bg-civic-darkCard text-xs focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['ALL', 'SUBMITTED', 'OFFICER_REVIEW', 'APPROVED', 'REJECTED'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    statusFilter === f
                      ? 'bg-pine-700 text-white'
                      : 'bg-white dark:bg-civic-darkCard text-gray-600 dark:text-gray-300 border border-pine-200 dark:border-pine-800 hover:bg-pine-50'
                  }`}
                >
                  {f === 'ALL'
                    ? locale === 'bn' ? 'সকল' : 'All'
                    : locale === 'bn' ? STAGE_LABELS[f]?.bn || f : STAGE_LABELS[f]?.en || f}
                </button>
              ))}
            </div>
          </div>

          {/* List Cards */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800">
                {locale === 'bn' ? 'কোনো নামজারি কেস পাওয়া যায়নি।' : 'No mutation cases found.'}
              </div>
            ) : (
              filteredCases.map(c => {
                const isSelected = c.id === selectedCaseId;
                const stage = STAGE_LABELS[c.status] || { bn: c.status, en: c.status };
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-pine-50 dark:bg-pine-900/40 border-pine-600 dark:border-pine-400 shadow-sm'
                        : 'bg-white dark:bg-civic-darkCard border-pine-200 dark:border-pine-800 hover:border-pine-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-pine-950 dark:text-pine-100">
                        {c.case_no}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : c.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {locale === 'bn' ? stage.bn : stage.en}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1.5 truncate">
                      {locale === 'bn' ? c.applicant_name_bn : c.applicant_name}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 font-mono">
                      <span>{c.parcel_id}</span>
                      <span>{toLocalDigits(c.submitted_at.split('T')[0])}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Management & State Transition (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCase ? (
            <div className="p-6 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm space-y-6">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pine-100 dark:border-pine-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-mono text-pine-950 dark:text-pine-100">
                      {selectedCase.case_no}
                    </h2>
                    <span className="text-xs text-gray-500 font-sans">
                      ({selectedCase.case_no_bn})
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>
                      {locale === 'bn' ? selectedCase.office_name_bn : selectedCase.office_name}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-pine-700 dark:text-pine-300">
                      Ref: {selectedCase.opaque_reference}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/parcel/${selectedCase.parcel_id}`}
                    className="px-3 py-1.5 rounded-lg border border-pine-300 dark:border-pine-700 hover:bg-pine-50 dark:hover:bg-pine-900/30 text-xs font-medium text-pine-700 dark:text-pine-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>{locale === 'bn' ? 'পার্সেল রেকর্ড' : 'View Parcel'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Case Details Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
                  <span className="text-gray-500 block mb-0.5">{locale === 'bn' ? 'আবেদনকারী' : 'Applicant'}</span>
                  <p className="font-semibold text-pine-950 dark:text-pine-100">
                    {locale === 'bn' ? selectedCase.applicant_name_bn : selectedCase.applicant_name}
                  </p>
                  <p className="font-mono text-[11px] text-gray-500 mt-0.5">
                    NID: {selectedCase.applicant_nid ? toLocalDigits(selectedCase.applicant_nid) : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
                  <span className="text-gray-500 block mb-0.5">{locale === 'bn' ? 'সংযুক্ত পার্সেল' : 'Linked Parcel'}</span>
                  <p className="font-semibold font-mono text-pine-950 dark:text-pine-100">
                    {selectedCase.parcel_id}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {selectedCase.deed_id ? `Deed: ${selectedCase.deed_id}` : 'Direct Mutation'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-pine-50/50 dark:bg-pine-950/20 border border-pine-200/50 dark:border-pine-800/50">
                  <span className="text-gray-500 block mb-0.5">{locale === 'bn' ? 'বর্তমান পর্যায়' : 'Current Stage'}</span>
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                      selectedCase.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedCase.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {locale === 'bn'
                      ? STAGE_LABELS[selectedCase.status]?.bn || selectedCase.status
                      : STAGE_LABELS[selectedCase.status]?.en || selectedCase.status}
                  </span>
                </div>
              </div>

              {/* Statutory Checklist Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-pine-950 dark:text-pine-100 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-pine-600" />
                    <span>{locale === 'bn' ? 'বিধিবদ্ধ নথি ও তদন্ত চেকলিস্ট' : 'Statutory Verification Checklist'}</span>
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    {locale === 'bn' ? 'সহকারী কমিশনার দ্বারা টিক প্রদান আবশ্যক' : 'Official verification checkpoints'}
                  </span>
                </div>

                <div className="space-y-2 border border-pine-200 dark:border-pine-800 rounded-lg p-3 bg-white dark:bg-pine-950/20">
                  {selectedCase.checklist.map(item => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-pine-50 dark:hover:bg-pine-900/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.is_checked}
                        onChange={() => toggleChecklist(item.item_code)}
                        className="mt-0.5 h-4 w-4 rounded text-pine-600 focus:ring-pine-500 border-gray-300 dark:border-gray-600"
                      />
                      <div className="text-xs">
                        <span className={`font-medium ${item.is_checked ? 'text-pine-900 dark:text-pine-200' : 'text-gray-600 dark:text-gray-400'}`}>
                          {locale === 'bn' ? item.label_bn : item.label_en}
                        </span>
                        {item.checked_by && (
                          <span className="block text-[10px] text-gray-400 mt-0.5">
                            {locale === 'bn' ? `যাচাইকারী: ${item.checked_by}` : `Checked by: ${item.checked_by}`}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* State Machine Transition Form */}
              {allowedNextStages.length > 0 ? (
                <div className="p-4 rounded-xl bg-pine-50/70 dark:bg-pine-900/30 border border-pine-200 dark:border-pine-800 space-y-4">
                  <h4 className="text-xs font-bold text-pine-950 dark:text-pine-100 uppercase tracking-wider flex items-center gap-2">
                    <Send className="w-4 h-4 text-pine-600" />
                    <span>{locale === 'bn' ? 'পরবর্তী ধাপে স্থানান্তর ও আদেশ লিপিবদ্ধকরণ' : 'Stage Transition & Order Notes'}</span>
                  </h4>

                  {/* Transition Stage Selector */}
                  <div className="flex flex-wrap gap-2">
                    {allowedNextStages.map(stage => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => setTargetStage(stage)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          targetStage === stage
                            ? stage === 'APPROVED'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : stage === 'REJECTED'
                              ? 'bg-red-600 text-white border-red-600 shadow-sm'
                              : 'bg-pine-700 text-white border-pine-700 shadow-sm'
                            : 'bg-white dark:bg-civic-darkCard text-gray-700 dark:text-gray-200 border-pine-200 dark:border-pine-700 hover:bg-pine-100/50'
                        }`}
                      >
                        {locale === 'bn'
                          ? STAGE_LABELS[stage]?.bn || stage
                          : STAGE_LABELS[stage]?.en || stage}
                      </button>
                    ))}
                  </div>

                  {/* Notes / Reason Textarea */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {locale === 'bn' ? 'আদেশের সারসংক্ষেপ বা সিদ্ধান্তের বিবরণ (অডিটে সংরক্ষিত হবে):' : 'Official order reasoning & notes (Recorded in audit trail):'}
                    </label>
                    <textarea
                      value={transitionReason}
                      onChange={e => setTransitionReason(e.target.value)}
                      placeholder={
                        locale === 'bn'
                          ? 'উদা: সরেজমিন দখল ও খতিয়ান শৃঙ্খল সঠিক পাওয়া গেছে; নামজারি আবেদন মঞ্জুর করা হলো।'
                          : 'e.g. Field possession report and khatian lineage verified; mutation approved.'
                      }
                      rows={2}
                      className="w-full p-2.5 rounded-lg border border-pine-300 dark:border-pine-700 bg-white dark:bg-pine-950/40 text-xs focus:outline-none focus:ring-2 focus:ring-pine-600"
                    />
                  </div>

                  {/* Feedback alerts */}
                  {actionError && (
                    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950/50 border border-red-200 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{actionError}</span>
                    </div>
                  )}

                  {actionSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{actionSuccess}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleTransition}
                      disabled={transitioning || !targetStage}
                      className={`px-5 py-2 rounded-lg font-medium text-xs flex items-center gap-2 shadow-sm transition-colors text-white ${
                        targetStage === 'APPROVED'
                          ? 'bg-emerald-700 hover:bg-emerald-800'
                          : targetStage === 'REJECTED'
                          ? 'bg-red-700 hover:bg-red-800'
                          : 'bg-pine-700 hover:bg-pine-800'
                      }`}
                    >
                      {transitioning ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>
                        {locale === 'bn' ? 'আদেশ কার্যকর করুন' : 'Execute Official Order'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center text-xs text-gray-500">
                  {selectedCase.status === 'APPROVED'
                    ? locale === 'bn'
                      ? 'এই নামজারি কেসটি চূড়ান্তভাবে অনুমোদিত হয়েছে এবং নতুন খতিয়ান সৃষ্টি সম্পন্ন।'
                      : 'This mutation case is completed and marked APPROVED.'
                    : locale === 'bn'
                    ? 'এই নামজারি কেসটি না-মঞ্জুর বা সমাপ্ত।'
                    : 'This mutation case is terminated/rejected.'}
                </div>
              )}

              {/* Event History Timeline */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-pine-950 dark:text-pine-100 flex items-center gap-2">
                  <History className="w-4 h-4 text-pine-600" />
                  <span>{locale === 'bn' ? 'কার্যবিবরণী ও আদেশনামা ইতিহাস' : 'Official Event History & Order Trail'}</span>
                </h3>

                <div className="space-y-2 border-l-2 border-pine-200 dark:border-pine-800 ml-3 pl-4">
                  {selectedCase.events.map(ev => (
                    <div key={ev.id} className="relative pb-3 text-xs space-y-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-pine-600 absolute -left-[21px] top-1" />
                      <div className="flex items-center justify-between text-gray-500">
                        <span className="font-semibold text-pine-950 dark:text-pine-100">
                          {ev.from_stage} → {ev.to_stage}
                        </span>
                        <span className="font-mono text-[11px]">
                          {toLocalDigits(ev.created_at.replace('T', ' ').slice(0, 19))}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {ev.notes || (locale === 'bn' ? 'কোনো মন্তব্য লিপিবদ্ধ নেই' : 'No notes')}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {locale === 'bn' ? `কর্তৃপক্ষ: ${ev.actor_name}` : `Actor: ${ev.actor_name}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800">
              {locale === 'bn' ? 'তালিকা থেকে একটি কেস নির্বাচন করুন।' : 'Select a mutation case from the left list.'}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
