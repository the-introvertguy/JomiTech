'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useApp, DEMO_USERS, Role, FontSize } from '@/context/AppContext';
import { CadastralLogo } from './CadastralLogo';
import {
  Sun,
  Moon,
  Globe,
  Type,
  UserCheck,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    fontSize,
    setFontSize,
    numeralMode,
    toggleNumeralMode,
    currentUser,
    switchUser,
    t,
  } = useApp();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'bn' ? 'en' : 'bn';
    setLocale(nextLocale);

    if (!pathname) {
      router.push(`/${nextLocale}`);
      return;
    }

    const segments = pathname.split('/');
    if (segments[1] === 'bn' || segments[1] === 'en') {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }

    const newPath = segments.join('/') || `/${nextLocale}`;
    const qs = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    router.push(`${newPath}${qs}`);
  };

  const fontSizes: { id: FontSize; label: string }[] = [
    { id: 'small', label: t.settings.small },
    { id: 'default', label: t.settings.defaultSize },
    { id: 'large', label: t.settings.large },
    { id: 'xlarge', label: t.settings.xlarge },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-civic-dark/95 backdrop-blur border-b border-pine-200 dark:border-pine-800/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-pine-800 dark:text-pine-200 hover:bg-pine-100 dark:hover:bg-pine-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <CadastralLogo size={36} showText={true} />
          </Link>
        </div>

        {/* Center: Search Quick Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <Link
            href={`/${locale}/search`}
            className="w-full flex items-center gap-2.5 px-3.5 py-1.5 text-sm bg-pine-50/60 dark:bg-pine-950/40 border border-pine-200/80 dark:border-pine-800/80 rounded-lg text-pine-700/80 dark:text-pine-300/80 hover:border-pine-400 dark:hover:border-pine-600 transition-colors shadow-2xs"
          >
            <Search className="w-4 h-4 text-pine-500 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {locale === 'bn'
                ? 'খতিয়ান, দাগ বা পার্সেল আইডি দিয়ে খুঁজুন...'
                : 'Search by Khatian, Dag or Parcel ID...'}
            </span>
            <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono font-medium px-1.5 py-0.5 bg-pine-200/60 dark:bg-pine-800/60 rounded text-pine-800 dark:text-pine-200">
              /
            </kbd>
          </Link>
        </div>

        {/* Right: Actions, Locales, Theme, Font, Demo Account Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Language Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-pine-800 dark:text-pine-200 bg-pine-100/70 dark:bg-pine-900/60 hover:bg-pine-200/70 dark:hover:bg-pine-800/60 border border-pine-300/50 dark:border-pine-700/50 transition-colors cursor-pointer"
            title={locale === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-pine-600 dark:text-pine-400" />
            <span className="uppercase">{locale === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Numeral Preference Toggle (Bangla vs English Numerals) */}
          <button
            type="button"
            onClick={toggleNumeralMode}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-pine-700 dark:text-pine-300 hover:bg-pine-100/60 dark:hover:bg-pine-900/40 border border-pine-200 dark:border-pine-800 transition-colors"
            title={numeralMode === 'bn' ? 'Use English digits (123)' : 'বাংলা সংখ্যা ব্যবহার করুন (১২৩)'}
            aria-label="Toggle numeral system"
          >
            <span className="font-mono text-xs">{numeralMode === 'bn' ? '১২৩' : '123'}</span>
          </button>

          {/* Font Size Selector Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
              className="p-2 rounded-lg text-pine-700 dark:text-pine-300 hover:bg-pine-100/60 dark:hover:bg-pine-900/40 border border-pine-200 dark:border-pine-800 transition-colors"
              title={t.settings.fontSize}
              aria-label="Adjust font size"
              aria-expanded={isFontMenuOpen}
            >
              <Type className="w-4 h-4" />
            </button>

            {isFontMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95"
                role="menu"
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-pine-500 uppercase tracking-wider">
                  {t.settings.fontSize}
                </div>
                {fontSizes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFontSize(item.id);
                      setIsFontMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-pine-50 dark:hover:bg-pine-900/40 ${
                      fontSize === item.id
                        ? 'font-bold text-pine-700 dark:text-pine-300 bg-pine-50 dark:bg-pine-900/30'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    role="menuitem"
                  >
                    <span>{item.label}</span>
                    {fontSize === item.id && <span className="w-1.5 h-1.5 rounded-full bg-pine-600 dark:bg-pine-400"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-pine-700 dark:text-pine-300 hover:bg-pine-100/60 dark:hover:bg-pine-900/40 border border-pine-200 dark:border-pine-800 transition-colors"
            title={theme === 'light' ? t.settings.dark : t.settings.light}
            aria-label="Toggle theme mode"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Demo User Role Switcher Dropdown */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-lg text-xs font-medium bg-pine-700 text-white hover:bg-pine-800 shadow-2xs transition-colors"
              aria-label="Switch Demo User Role"
              aria-expanded={isUserMenuOpen}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline font-semibold">
                {locale === 'bn' ? currentUser.nameBn : currentUser.name}
              </span>
              <span className="text-[10px] px-1 py-0.2 bg-pine-600 rounded text-pine-100 uppercase tracking-wider font-mono">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3 h-3 text-pine-200" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95"
                role="menu"
              >
                <div className="px-3.5 py-2 border-b border-pine-100 dark:border-pine-800/80">
                  <p className="text-xs font-semibold text-pine-900 dark:text-pine-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pine-500" />
                    <span>{t.actions.switchUser}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {locale === 'bn'
                      ? 'অনুমতি ও ভিউ পরীক্ষা করতে ভূমিকা পরিবর্তন করুন:'
                      : 'Switch role to test RBAC & interface views:'}
                  </p>
                </div>

                <div className="py-1">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        switchUser(user.role);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-pine-50 dark:hover:bg-pine-900/40 transition-colors ${
                        currentUser.role === user.role
                          ? 'bg-pine-50/80 dark:bg-pine-900/30 text-pine-800 dark:text-pine-200 font-semibold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      role="menuitem"
                    >
                      <div>
                        <div className="font-medium text-pine-950 dark:text-pine-100">
                          {locale === 'bn' ? user.nameBn : user.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                          {locale === 'bn' ? user.designationBn : user.designation}
                        </div>
                      </div>

                      {currentUser.role === user.role && (
                        <ShieldCheck className="w-4 h-4 text-pine-600 dark:text-pine-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
