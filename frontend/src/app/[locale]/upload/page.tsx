'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { uploadDocumentFile, triggerExtractionJob, DocumentItem, ExtractionJobItem } from '@/lib/api';
import {
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  FileText,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function DocumentUploadPage() {
  const { locale, t, formatNum } = useApp();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<DocumentItem | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedJob, setExtractedJob] = useState<ExtractionJobItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(
          locale === 'bn'
            ? 'ফাইলের আকার ১০ মেগাবাইটের বেশি হতে পারবে না।'
            : 'File size exceeds maximum limit of 10MB.'
        );
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
      setUploadedDoc(null);
      setExtractedJob(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const doc = await uploadDocumentFile(formData);
    setIsUploading(false);

    if (doc) {
      setUploadedDoc(doc);
    } else {
      setErrorMessage(
        locale === 'bn'
          ? 'ফাইল আপলোডে ত্রুটি হয়েছে। অনুগ্রহ করে ফরম্যাট যাচাই করুন।'
          : 'Failed to upload document. Please check file format.'
      );
    }
  };

  const handleTriggerExtraction = async () => {
    if (!uploadedDoc) return;
    setIsExtracting(true);
    const job = await triggerExtractionJob(uploadedDoc.id);
    setIsExtracting(false);
    if (job) {
      setExtractedJob(job);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Title */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-200 text-xs font-bold mb-1">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>P1 Module: Digitize Old Records</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-pine-950 dark:text-pine-100">
          {t.nav.upload}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {locale === 'bn'
            ? 'নিরাপদ প্রাইভেট স্টোরেজ, SHA-256 সার্ভার-সাইড হ্যাশিং ও ওসিআর এক্সট্রাকশন।'
            : 'Secure private storage, server-side SHA-256 byte hashing, and OCR extraction pipeline.'}
        </p>
      </div>

      {/* Mandatory Privacy & Demo Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold">{t.demoNotice}:</strong>
          <p className="leading-relaxed">
            {locale === 'bn'
              ? 'শুধুমাত্র কাল্পনিক বা সিন্থেটিক টেস্ট দলিল আপলোড করুন। কোনো আসল নাগরিকের সংবেদনশীল ব্যক্তিগত বা জাতীয় পরিচয়পত্র ডেটা আপলোড করবেন না। সকল ফাইল নিয়ন্ত্রিত প্রাইভেট স্টোরেজে সংরক্ষিত থাকে।'
              : 'Upload synthetic test deeds only. Do not upload real personal identification or official government records. All uploads are stored in an isolated private directory with restricted download controls.'}
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-civic-darkCard rounded-2xl p-6 sm:p-8 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-6">
        
        <div className="border-2 border-dashed border-pine-300 dark:border-pine-700/80 rounded-xl p-8 text-center hover:border-pine-500 transition-colors bg-pine-50/20 dark:bg-pine-950/10">
          <input
            type="file"
            id="deedFileInput"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="deedFileInput" className="cursor-pointer space-y-3 block">
            <div className="w-12 h-12 rounded-full bg-pine-100 dark:bg-pine-900/60 text-pine-700 dark:text-pine-300 flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <span className="text-sm font-bold text-pine-900 dark:text-pine-100 hover:underline">
                {locale === 'bn' ? 'ফাইল নির্বাচন করতে ক্লিক করুন' : 'Click to select document'}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {locale === 'bn'
                  ? 'সমর্থিত ফরম্যাট: PDF, PNG, JPEG (সর্বোচ্চ ১০ মেগাবাইট)'
                  : 'Supported formats: PDF, PNG, JPEG (Max 10MB)'}
              </p>
            </div>
          </label>
        </div>

        {/* Selected File Details */}
        {selectedFile && (
          <div className="p-4 rounded-xl bg-pine-50/60 dark:bg-pine-950/30 border border-pine-200 dark:border-pine-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-pine-600 dark:text-pine-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  {formatNum((selectedFile.size / 1024).toFixed(1))} KB • {selectedFile.type || 'document'}
                </div>
              </div>
            </div>

            {!uploadedDoc && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg bg-pine-700 hover:bg-pine-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-2xs shrink-0"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{locale === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...'}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{t.actions.uploadDoc}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-800 dark:text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Uploaded Confirmation & SHA-256 Hash */}
        {uploadedDoc && (
          <div className="p-5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-300/60 dark:border-emerald-800/60 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{locale === 'bn' ? 'ফাইল সফলভাবে আপলোড ও সংরক্ষিত হয়েছে' : 'Document successfully uploaded and stored'}</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="text-gray-500">Document ID: <strong className="text-gray-900 dark:text-gray-100">{uploadedDoc.id}</strong></div>
              <div className="text-gray-500 break-all">
                SHA-256 Hash: <strong className="text-emerald-800 dark:text-emerald-300">{uploadedDoc.sha256_hash}</strong>
              </div>
            </div>

            {/* Trigger Extraction Step */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {!extractedJob ? (
                <button
                  type="button"
                  onClick={handleTriggerExtraction}
                  disabled={isExtracting}
                  className="px-4 py-2 rounded-lg bg-pine-800 hover:bg-pine-900 text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isExtracting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{locale === 'bn' ? 'ওসিআর পাঠোদ্ধার চলছে...' : 'Running OCR extraction...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{locale === 'bn' ? 'ওসিআর পাঠোদ্ধার শুরু করুন' : 'Start OCR Field Extraction'}</span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={`/${locale}/review-queue`}
                  className="px-4 py-2 rounded-lg bg-pine-700 hover:bg-pine-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{locale === 'bn' ? 'যাচাই কিউতে পর্যালোচনা করুন' : 'Review in Officer Queue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
