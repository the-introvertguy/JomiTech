import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'জমিটেক (JomiTech) — ভূমি রেকর্ড যাচাই ও ঝুঁকি গোয়েন্দা ব্যবস্থা',
  description: 'LandTech 2026 Bangladesh Land Record Verification & Risk Intelligence Prototype',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
