'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CadastralLogo } from '@/components/CadastralLogo';
import {
  UserCheck,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

export default function LoginPage() {
  const { locale, t, toLocalDigits, currentUser, switchUser, demoUsers } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState<string | null>(null);

  const handleDemoSelect = (user: typeof demoUsers[0]) => {
    switchUser(user.id);
    setLoginMsg(
      locale === 'bn'
        ? `সফলভাবে "${user.nameBn}" (${user.role}) হিসেবে লগইন করা হয়েছে।`
        : `Successfully switched to "${user.name}" (${user.role}).`
    );
    setTimeout(() => {
      if (user.role === 'citizen') {
        router.push(`/${locale}/search`);
      } else if (user.role === 'reviewer') {
        router.push(`/${locale}/review-queue`);
      } else if (user.role === 'officer') {
        router.push(`/${locale}/mutation-cases`);
      } else if (user.role === 'admin') {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <CadastralLogo className="w-12 h-12 text-pine-700 dark:text-pine-400 mx-auto" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 dark:text-pine-100">
          {locale === 'bn' ? 'জমিটেক সিস্টেমে প্রবেশ ও ভূমিকা নির্বাচন' : 'Sign in to JomiTech'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {locale === 'bn'
            ? 'হ্যাকার্থন ২০২৬ প্রদর্শনীর সুবিধার্থে নিচের যেকোনো ডেমো রোল নির্বাচন করে এক ক্লিকে সরাসরি প্রবেশ করুন।'
            : 'For the LandTech 2026 jury evaluation, select any pre-configured demo persona to switch roles instantly.'}
        </p>
      </div>

      {/* Success Notification */}
      {loginMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2 font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{loginMsg}</span>
        </div>
      )}

      {/* 1-Click Demo Persona Chooser */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-pine-950 dark:text-pine-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pine-600" />
            <span>{locale === 'bn' ? '১-ক্লিকে ডেমো অ্যাকাউন্ট নির্বাচন (প্রস্তাবিত)' : '1-Click Demo Personas (Recommended for Demo)'}</span>
          </h2>
          <span className="text-[11px] text-gray-400 font-mono">5 Roles Configured</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoUsers.map((u) => {
            const isCurrent = currentUser.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => handleDemoSelect(u)}
                className={`p-4 rounded-xl border cursor-pointer text-left transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-pine-50 dark:bg-pine-900/40 border-pine-600 dark:border-pine-400 shadow-md ring-2 ring-pine-600/30'
                    : 'bg-white dark:bg-civic-darkCard border-pine-200 dark:border-pine-800 hover:border-pine-400 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-300">
                      {u.role.toUpperCase()}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-pine-700 dark:text-pine-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {locale === 'bn' ? 'বর্তমান' : 'Active'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-pine-950 dark:text-pine-100">
                    {locale === 'bn' ? u.nameBn : u.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {locale === 'bn' ? u.designationBn : u.designation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-pine-100 dark:border-pine-800 flex items-center justify-between text-xs font-semibold text-pine-700 dark:text-pine-300">
                  <span>{locale === 'bn' ? 'সরাসরি প্রবেশ করুন' : 'Sign in as this user'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Credentials Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm space-y-4 max-w-md mx-auto">
        <h3 className="text-xs font-bold uppercase tracking-wider text-pine-950 dark:text-pine-100">
          {locale === 'bn' ? 'ম্যানুয়াল ক্রেডেনশিয়াল লগইন' : 'Manual Credential Login'}
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
              {locale === 'bn' ? 'ব্যবহারকারী ইমেইল' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@jomitech.demo"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-pine-200 dark:border-pine-800 bg-white dark:bg-pine-950/40 text-xs focus:outline-none focus:ring-2 focus:ring-pine-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
              {locale === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-pine-200 dark:border-pine-800 bg-white dark:bg-pine-950/40 text-xs focus:outline-none focus:ring-2 focus:ring-pine-600 font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => {
              // Quick helper
              const matched = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
              if (matched) {
                handleDemoSelect(matched);
              } else {
                handleDemoSelect(demoUsers[3]); // default to officer
              }
            }}
            className="w-full py-2.5 rounded-lg bg-pine-700 hover:bg-pine-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{locale === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
