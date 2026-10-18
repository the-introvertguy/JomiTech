'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  const { t, locale } = useApp();

  return (
    <div
      role="region"
      aria-label="Civic Notice"
      className="w-full bg-amber-500/15 dark:bg-amber-950/40 border-b border-amber-500/30 text-amber-950 dark:text-amber-200 px-4 py-1.5 text-xs font-medium flex items-center justify-between"
    >
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
        <span className="font-bold tracking-wide">
          {locale === 'bn' ? '⚠️ ' : '⚠️ '}
          {t.demoNotice}
        </span>
        <span className="hidden md:inline text-amber-800/80 dark:text-amber-300/70 border-l border-amber-500/30 pl-2">
          {t.demoNoticeLong}
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>LandTech 2026 Sandbox</span>
      </div>
    </div>
  );
};
