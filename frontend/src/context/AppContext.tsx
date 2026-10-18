'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale } from '@/lib/i18n/translations';
import { formatNumeral } from '@/lib/numeral';

export type Role = 'citizen' | 'data_entry' | 'reviewer' | 'officer' | 'admin';
export type FontSize = 'small' | 'default' | 'large' | 'xlarge';
export type Theme = 'light' | 'dark';
export type NumeralMode = 'bn' | 'en';

export interface User {
  id: string;
  name: string;
  nameBn: string;
  email: string;
  role: Role;
  designation?: string;
  designationBn?: string;
}

export const DEMO_USERS: User[] = [
  {
    id: 'usr_citizen_01',
    name: 'Md. Tareq Hasan',
    nameBn: 'মোঃ তারেক হাসান',
    email: 'tareq.citizen@example.com',
    role: 'citizen',
    designation: 'Citizen / Prospective Buyer',
    designationBn: 'নাগরিক / জমি ক্রেতা',
  },
  {
    id: 'usr_entry_01',
    name: 'Farzana Akter',
    nameBn: 'ফারজানা আক্তার',
    email: 'farzana.entry@example.com',
    role: 'data_entry',
    designation: 'Data Entry Assistant',
    designationBn: 'ডেটা এন্ট্রি সহকারী',
  },
  {
    id: 'usr_reviewer_01',
    name: 'Shafiqul Islam',
    nameBn: 'শফিকুল ইসলাম',
    email: 'shafiqul.review@example.com',
    role: 'reviewer',
    designation: 'Senior Record Reviewer',
    designationBn: 'ঊর্ধ্বতন রেকর্ড যাচাইকারী',
  },
  {
    id: 'usr_officer_01',
    name: 'Nazmul Haque',
    nameBn: 'নাজমুল হক',
    email: 'nazmul.officer@example.com',
    role: 'officer',
    designation: 'Assistant Commissioner (Land) Sim.',
    designationBn: 'সহকারী কমিশনার (ভূমি) সিমুলেশন',
  },
  {
    id: 'usr_admin_01',
    name: 'System Admin',
    nameBn: 'সিস্টেম প্রশাসক',
    email: 'admin.jomitech@example.com',
    role: 'admin',
    designation: 'Platform Administrator',
    designationBn: 'প্ল্যাটফর্ম অ্যাডমিনিস্ট্রেটর',
  },
];

interface AppContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  theme: Theme;
  setTheme: (thm: Theme) => void;
  toggleTheme: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  numeralMode: NumeralMode;
  setNumeralMode: (mode: NumeralMode) => void;
  toggleNumeralMode: () => void;
  currentUser: User;
  demoUsers: User[];
  switchUser: (roleOrId: Role | string) => void;
  t: typeof translations['bn'];
  formatNum: (val: string | number | null | undefined) => string;
  toLocalDigits: (val: string | number | null | undefined) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('bn');
  const [theme, setThemeState] = useState<Theme>('light');
  const [fontSize, setFontSizeState] = useState<FontSize>('default');
  const [numeralMode, setNumeralModeState] = useState<NumeralMode>('bn');
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]); // Default citizen

  // Load persisted preferences on mount
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('jomitech_locale') as Locale | null;
      if (savedLocale && (savedLocale === 'bn' || savedLocale === 'en')) {
        setLocaleState(savedLocale);
      }

      const savedTheme = localStorage.getItem('jomitech_theme') as Theme | null;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeState(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark');
      }

      const savedFontSize = localStorage.getItem('jomitech_font_size') as FontSize | null;
      if (savedFontSize && ['small', 'default', 'large', 'xlarge'].includes(savedFontSize)) {
        setFontSizeState(savedFontSize);
      }

      const savedNumeral = localStorage.getItem('jomitech_numeral') as NumeralMode | null;
      if (savedNumeral && (savedNumeral === 'bn' || savedNumeral === 'en')) {
        setNumeralModeState(savedNumeral);
      }

      const savedRole = localStorage.getItem('jomitech_demo_role') as Role | null;
      if (savedRole) {
        const found = DEMO_USERS.find((u) => u.role === savedRole);
        if (found) setCurrentUser(found);
      }
    } catch {
      // LocalStorage unavailable in SSR / sandbox fallback
    }
  }, []);

  // Sync HTML attributes whenever preferences change
  useEffect(() => {
    try {
      document.documentElement.lang = locale;
      document.documentElement.setAttribute('data-font-size', fontSize);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Browser environment guard
    }
  }, [locale, theme, fontSize]);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    try {
      localStorage.setItem('jomitech_locale', loc);
    } catch {}
  };

  const setTheme = (thm: Theme) => {
    setThemeState(thm);
    try {
      localStorage.setItem('jomitech_theme', thm);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    try {
      localStorage.setItem('jomitech_font_size', size);
    } catch {}
  };

  const setNumeralMode = (mode: NumeralMode) => {
    setNumeralModeState(mode);
    try {
      localStorage.setItem('jomitech_numeral', mode);
    } catch {}
  };

  const toggleNumeralMode = () => {
    const next = numeralMode === 'bn' ? 'en' : 'bn';
    setNumeralMode(next);
  };

  const switchUser = (roleOrId: Role | string) => {
    const user =
      DEMO_USERS.find((u) => u.role === roleOrId) ||
      DEMO_USERS.find((u) => u.id === roleOrId) ||
      DEMO_USERS[0];
    setCurrentUser(user);
    try {
      localStorage.setItem('jomitech_demo_role', user.role);
    } catch {}
  };

  const t = translations[locale];

  const formatNum = (val: string | number | null | undefined): string => {
    return formatNumeral(val, numeralMode);
  };

  const toLocalDigits = formatNum;

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        theme,
        setTheme,
        toggleTheme,
        fontSize,
        setFontSize,
        numeralMode,
        setNumeralMode,
        toggleNumeralMode,
        currentUser,
        demoUsers: DEMO_USERS,
        switchUser,
        t,
        formatNum,
        toLocalDigits,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
