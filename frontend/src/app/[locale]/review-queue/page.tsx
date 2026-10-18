'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  fetchReviewQueue,
  updateExtractionFieldCorrections,
  approveExtractionJob,
  rejectExtractionJob,
  ExtractionJobItem,
} from '@/lib/api';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  HelpCircle,
  FileText,
  Save,
  RotateCcw,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function ReviewQueuePage() {
  const { locale, t, formatNum } = useApp();
  
  const [jobs, setJobs] = useState<ExtractionJobItem[]>([]);
  const [selectedJob, setSelectedJob] = useState<ExtractionJobItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Field editing state
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Rejection modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadQueue = async () => {
    setLoading(true);
    const list = await fetchReviewQueue();
    setJobs(list);
    if (list.length > 0) {
      setSelectedJob(list[0]);
      initFieldValues(list[0]);
    } else {
      setSelectedJob(null);
    }
    setLoading(false);
  };

  const initFieldValues = (job: ExtractionJobItem) => {
    const vals: Record<string, string> = {};
    for (const f of job.fields) {
      vals[f.field_name] = f.reviewer_value || f.normalized_value || f.raw_value || '';
    }
    setFieldValues(vals);
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleSelectJob = (job: ExtractionJobItem) => {
    setSelectedJob(job);
    initFieldValues(job);
    setActionSuccess(null);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSaveCorrections = async () => {
    if (!selectedJob) return;
    setIsSaving(true);
    const corrections = Object.entries(fieldValues).map(([field_name, reviewer_value]) => ({
      field_name,
      reviewer_value,
    }));
    const updated = await updateExtractionFieldCorrections(selectedJob.id, corrections);
    setIsSaving(false);
    if (updated) {
      setSelectedJob(updated);
      setActionSuccess(locale === 'bn' ? 'সংশোধিত তথ্য সংরক্ষিত হয়েছে।' : 'Corrections saved successfully.');
    }
  };

  const handleApprove = async () => {
    if (!selectedJob) return;
    setIsSaving(true);
    // Auto-save corrections first if any
    const corrections = Object.entries(fieldValues).map(([field_name, reviewer_value]) => ({
      field_name,
      reviewer_value,
    }));
    await updateExtractionFieldCorrections(selectedJob.id, corrections);

    const approved = await approveExtractionJob(selectedJob.id);
    setIsSaving(false);
    if (approved) {
      setActionSuccess(locale === 'bn' ? 'নথিটি সফলভাবে অনুমোদিত ও পোস্ট করা হয়েছে!' : 'Document approved and indexed!');
      loadQueue();
    }
  };

  const handleReject = async () => {
    if (!selectedJob || !rejectionReason.trim()) return;
    setIsSaving(true);
    const rejected = await rejectExtractionJob(selectedJob.id, rejectionReason.trim());
    setIsSaving(false);
    setIsRejectModalOpen(false);
    setRejectionReason('');
    if (rejected) {
      setActionSuccess(locale === 'bn' ? 'নথিটি প্রত্যাখ্যাত হয়েছে।' : 'Document rejected.');
      loadQueue();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Title */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-200 text-xs font-bold mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Human-in-the-Loop OCR Verification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-pine-950 dark:text-pine-100">
            {t.nav.reviewQueue}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {locale === 'bn'
              ? 'ওসিআর দ্বারা পাঠোদ্ধারকৃত দলিলের তথ্যাদি মূল কপির সাথে মিলিয়ে অনুমোদন বা সংশোধন করুন।'
              : 'Side-by-side inspection of OCR fields against raw document text. Human approval mandatory before posting.'}
          </p>
        </div>

        <button
          type="button"
          onClick={loadQueue}
          className="px-3 py-1.5 rounded-lg border border-pine-200 dark:border-pine-800 hover:bg-pine-50 text-xs font-semibold flex items-center gap-1.5 text-pine-800 dark:text-pine-200 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'কিউ রিফ্রেশ' : 'Refresh Queue'}</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-sm text-gray-500">
          <div className="w-6 h-6 border-2 border-pine-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>{locale === 'bn' ? 'যাচাই কিউ লোড হচ্ছে...' : 'Loading review queue...'}</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-civic-darkCard rounded-xl border border-pine-200 dark:border-pine-800 space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {locale === 'bn' ? 'যাচাই কিউ সম্পূর্ণ খালি' : 'Review Queue Clear'}
          </h3>
          <p className="text-xs text-gray-500">
            {locale === 'bn' ? 'বর্তমানে পর্যালোচনার জন্য কোনো মুলতবি দলিল নেই।' : 'No pending extraction jobs awaiting officer review.'}
          </p>
        </div>
      ) : selectedJob ? (
        <div className="space-y-4">
          
          {/* Job Selector Tab Strip */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => handleSelectJob(job)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors ${
                  selectedJob.id === job.id
                    ? 'bg-pine-800 text-white shadow-xs'
                    : 'bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 text-gray-700 dark:text-gray-300 hover:bg-pine-50'
                }`}
              >
                <span>{job.id}</span>
                <span className="opacity-75 ml-1.5 text-[10px]">
                  ({job.average_confidence * 100}%)
                </span>
              </button>
            ))}
          </div>

          {/* Side-by-Side Review Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left Pane: Original Document Raw OCR / Preview */}
            <div className="bg-white dark:bg-civic-darkCard rounded-xl p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-pine-100 dark:border-pine-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pine-600 dark:text-pine-400" />
                    <span className="text-xs font-bold text-pine-950 dark:text-pine-100">
                      {locale === 'bn' ? 'মূল নথির স্ক্যান ও ওসিআর টেক্সট' : 'Raw Document Scan & OCR Text'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    Engine: {selectedJob.ocr_engine}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-civic-dark border border-gray-200 dark:border-pine-900 font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                  {selectedJob.raw_ocr_text || 'No raw text extracted'}
                </div>
              </div>

              {/* Document Meta Footer */}
              <div className="pt-2 border-t border-gray-100 dark:border-pine-800/60 text-[11px] text-gray-500 font-mono flex items-center justify-between">
                <span>File: {selectedJob.document.original_filename}</span>
                <span>SHA-256: {selectedJob.document.sha256_hash.slice(0, 16)}...</span>
              </div>
            </div>

            {/* Right Pane: Extracted Structured Fields & Officer Corrections */}
            <div className="bg-white dark:bg-civic-darkCard rounded-xl p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-pine-100 dark:border-pine-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-pine-950 dark:text-pine-100">
                      {locale === 'bn' ? 'পাঠোদ্ধারকৃত ফিল্ড ও সংশোধন' : 'Extracted Fields & Verification'}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-pine-100 dark:bg-pine-900 text-pine-800 dark:text-pine-200 font-mono">
                    Avg Conf: {formatNum((selectedJob.average_confidence * 100).toFixed(0))}%
                  </span>
                </div>

                {/* Fields List */}
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {selectedJob.fields.map((field) => (
                    <div
                      key={field.id}
                      className="p-3 rounded-lg border border-gray-100 dark:border-pine-900/60 bg-pine-50/20 dark:bg-pine-950/20 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          {field.field_name.replace(/_/g, ' ')}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              field.confidence >= 0.85
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {formatNum((field.confidence * 100).toFixed(0))}%
                          </span>
                          <button
                            type="button"
                            onClick={() => handleFieldChange(field.field_name, 'unknown')}
                            className="text-[10px] text-gray-400 hover:text-red-500 font-mono underline"
                            title="Mark as unknown"
                          >
                            {t.actions.unknown}
                          </button>
                        </div>
                      </div>

                      {/* Editable Input for Reviewer Correction */}
                      <input
                        type="text"
                        value={fieldValues[field.field_name] ?? ''}
                        onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 dark:border-pine-800 bg-white dark:bg-civic-dark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-pine-500 font-medium"
                      />

                      {field.raw_value && field.raw_value !== fieldValues[field.field_name] && (
                        <div className="text-[10px] text-gray-400 font-mono">
                          Raw OCR: &ldquo;{field.raw_value}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Save, Approve, Reject */}
              <div className="pt-3 border-t border-pine-100 dark:border-pine-800/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleSaveCorrections}
                  disabled={isSaving}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-pine-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.actions.save}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={isSaving}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 hover:bg-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t.actions.reject}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.actions.approve}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : null}

      {/* Reject Reason Dialog Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-civic-darkCard rounded-2xl max-w-md w-full p-6 border border-pine-200 dark:border-pine-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{locale === 'bn' ? 'প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করুন' : 'Provide Reason for Rejection'}</span>
            </div>

            <p className="text-xs text-gray-500">
              {locale === 'bn'
                ? 'প্রত্যাখ্যাত নথির কোনো তথ্য সার্চ ডেটাবেজে যুক্ত হবে না। অডিট লগে কারণটি লিপিবদ্ধ থাকবে।'
                : 'Rejected extractions will not update parcel history. The rejection reason is permanently recorded in the audit trail.'}
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={locale === 'bn' ? 'যেমন: স্ক্যান অস্পষ্ট, বালাম পাতার সাথে সিল মিলছে না...' : 'e.g. Blurred registration seal, volume mismatch...'}
              rows={3}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-pine-800 bg-white dark:bg-civic-dark text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                {t.actions.cancel}
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {locale === 'bn' ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
