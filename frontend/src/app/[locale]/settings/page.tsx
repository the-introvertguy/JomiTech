'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useApp, FontSize, Theme, NumeralMode } from '@/context/AppContext';
import { Locale } from '@/lib/i18n/translations';
import { Globe, Sun, Moon, Type, Hash, Settings, Check, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const {
    locale,
    setLocale,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    numeralMode,
    setNumeralMode,
    t,
  } = useApp();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSetLocale = (targetLocale: Locale) => {
    setLocale(targetLocale);
    if (!pathname) {
      router.push(`/${targetLocale}`);
      return;
    }
    const segments = pathname.split('/');
    if (segments[1] === 'bn' || segments[1] === 'en') {
      segments[1] = targetLocale;
    } else {
      segments.splice(1, 0, targetLocale);
    }
    const newPath = segments.join('/') || `/${targetLocale}`;
    const qs = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    router.push(`${newPath}${qs}`);
  };

  const fontOptions: { id: FontSize; label: string; desc: string }[] = [
    { id: 'small', label: t.settings.small, desc: '14px base font' },
    { id: 'default', label: t.settings.defaultSize, desc: '16px standard civic font' },
    { id: 'large', label: t.settings.large, desc: '18px increased readability' },
    { id: 'xlarge', label: t.settings.xlarge, desc: '20px maximum accessibility' },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Title */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4">
        <div className="flex items-center gap-2.5 text-pine-800 dark:text-pine-200">
          <Settings className="w-6 h-6 text-pine-600 dark:text-pine-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t.settings.title}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {locale === 'bn'
            ? 'পছন্দমতো ভাষা, থিম মোড, ফন্টের আকার ও সংখ্যা পদ্ধতি সমন্বয় করুন।'
            : 'Customize your language, visual theme, font accessibility scale, and numeral preferences.'}
        </p>
      </div>

      <div className="space-y-6">

        {/* 1. Language Preference */}
        <section className="bg-white dark:bg-civic-darkCard rounded-xl p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-pine-600 dark:text-pine-400" />
            <h2 className="text-sm font-bold text-pine-950 dark:text-pine-100">
              {t.settings.language}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSetLocale('bn')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                locale === 'bn'
                  ? 'border-pine-600 bg-pine-50 dark:bg-pine-900/40 text-pine-900 dark:text-pine-100 font-bold ring-1 ring-pine-500'
                  : 'border-gray-200 dark:border-pine-900 hover:border-pine-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div>
                <div className="text-sm">বাংলা (Bangla - Primary)</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  বাংলাদেশ ভূমি আইন ও রেকর্ডীয় পরিভাষা অনুযায়ী
                </div>
              </div>
              {locale === 'bn' && <Check className="w-4 h-4 text-pine-600 dark:text-pine-400" />}
            </button>

            <button
              type="button"
              onClick={() => handleSetLocale('en')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                locale === 'en'
                  ? 'border-pine-600 bg-pine-50 dark:bg-pine-900/40 text-pine-900 dark:text-pine-100 font-bold ring-1 ring-pine-500'
                  : 'border-gray-200 dark:border-pine-900 hover:border-pine-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div>
                <div className="text-sm">English (Complete Secondary)</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Complete translation across all screens and reports
                </div>
              </div>
              {locale === 'en' && <Check className="w-4 h-4 text-pine-600 dark:text-pine-400" />}
            </button>
          </div>
        </section>

        {/* 2. Visual Theme (Light / Dark) */}
        <section className="bg-white dark:bg-civic-darkCard rounded-xl p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-pine-600 dark:text-pine-400" />
            <h2 className="text-sm font-bold text-pine-950 dark:text-pine-100">
              {t.settings.theme}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                theme === 'light'
                  ? 'border-pine-600 bg-pine-50 text-pine-900 font-bold ring-1 ring-pine-500'
                  : 'border-gray-200 dark:border-pine-900 hover:border-pine-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-sm">{t.settings.light}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Warm neutral background with pine forest accents
                  </div>
                </div>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-pine-600" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                theme === 'dark'
                  ? 'border-pine-500 bg-pine-900/40 text-pine-100 font-bold ring-1 ring-pine-500'
                  : 'border-gray-200 dark:border-pine-900 hover:border-pine-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-pine-300" />
                <div>
                  <div className="text-sm">{t.settings.dark}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Charcoal and deep pine green night contrast
                  </div>
                </div>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-pine-400" />}
            </button>
          </div>
        </section>

        {/* 3. Global Font Size Scale */}
        <section className="bg-white dark:bg-civic-darkCard rounded-xl p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-pine-600 dark:text-pine-400" />
            <h2 className="text-sm font-bold text-pine-950 dark:text-pine-100">
              {t.settings.fontSize}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {fontOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFontSize(opt.id)}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  fontSize === opt.id
                    ? 'border-pine-600 bg-pine-50 dark:bg-pine-900/40 text-pine-900 dark:text-pine-100 font-bold ring-1 ring-pine-500'
                    : 'border-gray-200 dark:border-pine-900 hover:border-pine-300 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">{opt.label}</span>
                  {fontSize === opt.id && <Check className="w-3.5 h-3.5 text-pine-600 dark:text-pine-400" />}
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 font-normal">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Numeral System Preference */}
        <section className="bg-white dark:bg-civic-darkCard rounded-xl p-5 border border-pine-200/80 dark:border-pine-800/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-pine-600 dark:text-pine-400" />
            <h2 className="text-sm font-bold text-pine-950 dark:text-pine-100">
              {t.settings.numerals}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setNumeralMode('bn')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                numeralMode === 'bn'
                  ? 'border-pine-600 bg-pine-50 dark:bg-pine-900/40 text-pine-900 dark:text-pine-100 font-bold ring-1 ring-pine-500'
                  : 'border-gray-200 dark:border-pine-900 hover:border-pine-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div>
                <div className="text-sm">{t.settings.bengaliNumerals}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                  দাগ নং ৫০২, খতিয়ান নং ১২৮
                </div>
              </div>
              {numeralMode === 'bn' && <Check className="w-4 h-4 text-pine-600 dark:text-pine-400" />}
            </button>

            <button
              type="button"
              onClick={() => setNumeralMode('en')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                numeralMode === 'en'
                  ? 'border-pine-600 bg-pine-50 dark:bg-pine-900/40 text-pine-900 dark:text-pine-100 font-bold ring-1 ring-pine-500'
                  : 'border-gray-200 dark:border-pine-900 hover:border-pine-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div>
                <div className="text-sm">{t.settings.englishNumerals}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                  Dag No. 502, Khatian No. 128
                </div>
              </div>
              {numeralMode === 'en' && <Check className="w-4 h-4 text-pine-600 dark:text-pine-400" />}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
