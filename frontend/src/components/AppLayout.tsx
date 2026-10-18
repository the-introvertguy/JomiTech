'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DemoNoticeBanner } from './DemoNoticeBanner';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Info } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, locale } = useApp();

  return (
    <div className="min-h-screen bg-civic-light dark:bg-civic-dark text-gray-900 dark:text-gray-100 flex flex-col antialiased selection:bg-pine-200 selection:text-pine-900">
      {/* 1. Persistent Top Demo Notice Banner */}
      <DemoNoticeBanner />

      {/* 2. Global Header */}
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 3. Left Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* 4. Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            {children}
          </div>

          {/* 5. Civic Footer */}
          <footer className="mt-auto border-t border-pine-200 dark:border-pine-800/80 bg-white/70 dark:bg-civic-darkCard/70 py-6 px-4 sm:px-8 text-xs text-pine-800/80 dark:text-pine-300/80">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pine-600 dark:text-pine-400" />
                <span className="font-semibold text-pine-950 dark:text-pine-100">
                  {t.appName}
                </span>
                <span>— {t.appTagline}</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                <span>LandTech 2026 Prototype</span>
                <span>•</span>
                <span>{locale === 'bn' ? 'সকল রেকর্ড কাল্পনিক' : 'All records synthetic'}</span>
                <span>•</span>
                <span>{locale === 'bn' ? 'ব্যক্তিগত তথ্য মুক্ত' : 'Zero PII Stored'}</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
