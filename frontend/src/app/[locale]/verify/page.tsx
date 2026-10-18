'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '@/context/AppContext';
import { verifyReceiptPublic, verifyCandidateCopy, PublicVerifyData } from '@/lib/api';
import {
  QrCode,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSearch,
  FileCheck2,
  UploadCloud,
  FileText,
  Lock,
  Sparkles,
  Info,
  RefreshCw,
  Copy,
} from 'lucide-react';

export default function VerifyQrPage() {
  const { locale, t, formatNum } = useApp();
  const searchParams = useSearchParams();
  const initialReceipt = searchParams.get('receipt') || 'receipt-uuid-clean-101';

  const [activeTab, setActiveTab] = useState<'qr' | 'copy'>('qr');
  const [receiptInput, setReceiptInput] = useState(initialReceipt);
  const [verifyResult, setVerifyResult] = useState<PublicVerifyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Verify copy state
  const [refDocId, setRefDocId] = useState('DOC-101-01');
  const [copyFile, setCopyFile] = useState<File | null>(null);
  const [copyResult, setCopyResult] = useState<any>(null);
  const [isVerifyingCopy, setIsVerifyingCopy] = useState(false);

  const handleVerifyReceipt = async (idToVerify?: string) => {
    const target = idToVerify || receiptInput.trim();
    if (!target) return;
    setIsLoading(true);
    const data = await verifyReceiptPublic(target);
    setVerifyResult(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialReceipt) {
      handleVerifyReceipt(initialReceipt);
    }
  }, [initialReceipt]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${locale}/verify?receipt=${receiptInput}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyCopySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyFile || !refDocId) return;
    setIsVerifyingCopy(true);
    const formData = new FormData();
    formData.append('file', copyFile);
    const res = await verifyCandidateCopy(refDocId, formData);
    setCopyResult(res);
    setIsVerifyingCopy(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Title */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold mb-1">
          <QrCode className="w-3.5 h-3.5" />
          <span>P2 Module: Verify Deeds & Ownership Evidence</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-pine-950 dark:text-pine-100">
          {t.verify.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {locale === 'bn'
            ? 'Ed25519 ডিজিটাল স্বাক্ষর, SHA-256 হ্যাশ ও সম্পূর্ণ ব্যক্তিগত গোপনীয়তা-সুরক্ষিত কিউআর যাচাই ব্যবস্থা।'
            : 'Ed25519 digital signatures, server-side SHA-256 byte hashing, and zero-PII privacy-safe verification.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-pine-200 dark:border-pine-800 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'qr'
              ? 'border-pine-600 text-pine-900 dark:text-pine-100'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{locale === 'bn' ? 'কিউআর ও ডিজিটাল রসিদ যাচাই' : 'Verify QR Receipt'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('copy')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'copy'
              ? 'border-pine-600 text-pine-900 dark:text-pine-100'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>{locale === 'bn' ? 'কপির বিশুদ্ধতা পরীক্ষা' : 'Verify a Copy (Byte Match)'}</span>
        </button>
      </div>

      {/* TAB 1: QR & DIGITAL RECEIPT */}
      {activeTab === 'qr' && (
        <div className="space-y-6">
          
          {/* Privacy Notice Banner */}
          <div className="p-4 rounded-xl bg-teal-500/10 dark:bg-teal-950/30 border border-teal-500/30 text-teal-950 dark:text-teal-200 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold">{locale === 'bn' ? 'ব্যক্তিগত তথ্য সুরক্ষা নোটিশ:' : 'Zero-PII Privacy Notice:'}</strong>{' '}
              {t.verify.privacyNotice}
            </p>
          </div>

          {/* Receipt Input Card */}
          <div className="bg-white dark:bg-civic-darkCard rounded-xl p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              {t.verify.enterHash}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={receiptInput}
                onChange={(e) => setReceiptInput(e.target.value)}
                placeholder="e.g. receipt-uuid-clean-101"
                className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-lg border border-pine-200 dark:border-pine-800 bg-white dark:bg-civic-dark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-pine-500"
              />
              <button
                type="button"
                onClick={() => handleVerifyReceipt()}
                disabled={isLoading || !receiptInput.trim()}
                className="px-5 py-2.5 rounded-lg bg-pine-700 hover:bg-pine-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-2xs"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{locale === 'bn' ? 'যাচাই করুন' : 'Verify'}</span>
              </button>
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-500">
              <span className="font-semibold">{locale === 'bn' ? 'টেস্ট রসিদ আইডি:' : 'Sample IDs:'}</span>
              <button
                type="button"
                onClick={() => {
                  setReceiptInput('receipt-uuid-clean-101');
                  handleVerifyReceipt('receipt-uuid-clean-101');
                }}
                className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono hover:bg-emerald-200"
              >
                receipt-uuid-clean-101 (Valid)
              </button>
              <button
                type="button"
                onClick={() => {
                  setReceiptInput('rcp-tampered-sample-id');
                  handleVerifyReceipt('rcp-tampered-sample-id');
                }}
                className="px-2 py-0.5 rounded bg-gray-100 dark:bg-pine-900/60 text-gray-700 dark:text-gray-300 font-mono hover:bg-gray-200"
              >
                rcp-tampered-sample (Unknown)
              </button>
            </div>
          </div>

          {/* Verification Result Card */}
          {verifyResult && (
            <div className="bg-white dark:bg-civic-darkCard rounded-2xl p-6 sm:p-8 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-6 animate-in fade-in">
              
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-100 dark:border-pine-800/60 pb-5">
                <div className="flex items-center gap-3">
                  {verifyResult.status === 'VALID' ? (
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                  ) : verifyResult.status === 'REVOKED' ? (
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono uppercase ${
                          verifyResult.status === 'VALID'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : verifyResult.status === 'REVOKED'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {verifyResult.status}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">
                        Zero-PII Safe
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-extrabold text-pine-950 dark:text-pine-100 mt-1">
                      {verifyResult.status === 'VALID'
                        ? t.verify.statusValid
                        : verifyResult.status === 'REVOKED'
                        ? t.verify.statusRevoked
                        : t.verify.statusUnknown}
                    </h2>
                  </div>
                </div>

                {/* QR Code Graphic */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs self-start shrink-0">
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/verify?receipt=${verifyResult.opaque_id}`}
                    size={90}
                    level="M"
                  />
                  <div className="text-[9px] font-mono text-center text-gray-400 mt-1">
                    JomiTech QR
                  </div>
                </div>
              </div>

              {/* Cryptographic Details Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-civic-dark border border-gray-100 dark:border-pine-900">
                  <span className="text-[10px] text-gray-500 uppercase block mb-0.5">
                    Opaque QR Receipt ID
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 break-all font-bold">
                    {verifyResult.opaque_id}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-civic-dark border border-gray-100 dark:border-pine-900">
                  <span className="text-[10px] text-gray-500 uppercase block mb-0.5">
                    Signing Key ID
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    {verifyResult.key_id || 'ed25519-jomitech-2026-v1'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-civic-dark border border-gray-100 dark:border-pine-900">
                  <span className="text-[10px] text-gray-500 uppercase block mb-0.5">
                    Server SHA-256 Byte Hash
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 break-all">
                    {verifyResult.document_sha256 || 'N/A'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-civic-dark border border-gray-100 dark:border-pine-900">
                  <span className="text-[10px] text-gray-500 uppercase block mb-0.5">
                    Synthetic Reference ID
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {verifyResult.synthetic_reference_id || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Civic Integrity Caveat Notice */}
              <div className="p-4 rounded-xl bg-pine-50/60 dark:bg-pine-950/30 border border-pine-200 dark:border-pine-800 text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <strong className="font-bold text-pine-900 dark:text-pine-200">
                  {locale === 'bn' ? 'ক্রিপ্টোগ্রাফিক সত্যতার আইনি অর্থ:' : 'Civic Integrity Explanation:'}
                </strong>
                <p className="leading-relaxed">
                  {locale === 'bn' ? verifyResult.civic_explanation_bn : verifyResult.civic_explanation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-pine-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? (locale === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (locale === 'bn' ? 'লিংক কপি করুন' : 'Copy Verification Link')}</span>
                </button>

                <Link
                  href={`/${locale}/parcel/PCL-DH-101`}
                  className="text-xs font-bold text-pine-700 dark:text-pine-300 hover:underline flex items-center gap-1"
                >
                  <span>{locale === 'bn' ? 'সংশ্লিষ্ট পার্সেল রেকর্ড দেখুন' : 'Inspect related parcel'}</span>
                </Link>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: VERIFY A CANDIDATE COPY */}
      {activeTab === 'copy' && (
        <form onSubmit={handleVerifyCopySubmit} className="bg-white dark:bg-civic-darkCard rounded-2xl p-6 sm:p-8 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-pine-950 dark:text-pine-100">
              {locale === 'bn' ? 'আপনার দলিলের কপির ডিজিটাল মিল যাচাই' : 'Test Document Copy Against Reference Hash'}
            </h2>
            <p className="text-xs text-gray-500">
              {locale === 'bn'
                ? 'আপনার ডিভাইসে থাকা পিডিএফ বা স্ক্যান কপিটি আপলোড করে সার্ভারের মূল হ্যাশের সাথে শতভাগ মিল পরীক্ষা করুন।'
                : 'Upload a local copy of the document to compute its SHA-256 and verify against the approved reference.'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {locale === 'bn' ? 'রেফারেন্স ডকুমেন্ট আইডি:' : 'Reference Document ID:'}
              </label>
              <input
                type="text"
                value={refDocId}
                onChange={(e) => setRefDocId(e.target.value)}
                placeholder="e.g. DOC-101-01"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-pine-800 bg-white dark:bg-civic-dark text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {locale === 'bn' ? 'যাচাই করার জন্য কপি ফাইল নির্বাচন করুন:' : 'Select Copy File to Test:'}
              </label>
              <input
                type="file"
                onChange={(e) => setCopyFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pine-100 file:text-pine-800 hover:file:bg-pine-200 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifyingCopy || !copyFile}
              className="px-5 py-2.5 rounded-lg bg-pine-700 hover:bg-pine-800 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {isVerifyingCopy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck2 className="w-3.5 h-3.5" />}
              <span>{locale === 'bn' ? 'হ্যাশ তুলনা করুন' : 'Compare SHA-256 Hashes'}</span>
            </button>
          </div>

          {/* Copy Result Display */}
          {copyResult && (
            <div
              className={`p-5 rounded-xl border space-y-3 animate-in fade-in ${
                copyResult.exact_match
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-950 dark:text-emerald-100'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-950 dark:text-amber-100'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {copyResult.exact_match ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <span>
                  {copyResult.exact_match
                    ? (locale === 'bn' ? 'ডিজিটাল বাইট শতভাগ হুবহু মিলেছে' : 'Exact Cryptographic Byte Match')
                    : (locale === 'bn' ? 'কোনো হুবহু মিল পাওয়া যায়নি' : 'No Exact Match Found')}
                </span>
              </div>

              <p className="text-xs leading-relaxed">
                {locale === 'bn' ? copyResult.message_bn : copyResult.message}
              </p>

              <div className="space-y-1 text-[11px] font-mono opacity-80 pt-1">
                <div>Reference Hash: {copyResult.reference_sha256}</div>
                <div>Candidate Hash: {copyResult.candidate_sha256}</div>
              </div>
            </div>
          )}
        </form>
      )}

    </div>
  );
}
