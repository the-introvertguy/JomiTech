'use client';

import React, { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { useApp } from '@/context/AppContext';
import { Locale } from '@/lib/i18n/translations';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale, setLocale } = useApp();

  if (params.locale !== 'bn' && params.locale !== 'en') {
    notFound();
  }

  useEffect(() => {
    if (params.locale && (params.locale === 'bn' || params.locale === 'en')) {
      if (params.locale !== locale) {
        setLocale(params.locale as Locale);
      }
    }
  }, [params.locale]);

  return <AppLayout>{children}</AppLayout>;
}
