'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp, Role } from '@/context/AppContext';
import {
  LayoutDashboard,
  Search,
  FileSearch,
  QrCode,
  GitPullRequest,
  HelpCircle,
  UploadCloud,
  FileCheck2,
  FolderLock,
  AlertOctagon,
  FileSpreadsheet,
  Archive,
  History,
  Shield,
  Settings,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: Role[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { locale, currentUser, t } = useApp();
  const pathname = usePathname();

  const citizenNav: NavItem[] = [
    { href: `/${locale}`, label: t.nav.overview, icon: LayoutDashboard },
    { href: `/${locale}/search`, label: t.nav.search, icon: Search },
    { href: `/${locale}/buyer-report`, label: t.nav.buyerReport, icon: FileSearch },
    { href: `/${locale}/verify`, label: t.nav.verifyQr, icon: QrCode },
    { href: `/${locale}/track-mutation`, label: t.nav.trackMutation, icon: GitPullRequest },
    { href: `/${locale}/help`, label: t.nav.help, icon: HelpCircle },
  ];

  const staffNav: NavItem[] = [
    {
      href: `/${locale}/dashboard`,
      label: t.nav.staffDashboard,
      icon: Layers,
      allowedRoles: ['data_entry', 'reviewer', 'officer', 'admin'],
    },
    {
      href: `/${locale}/upload`,
      label: t.nav.upload,
      icon: UploadCloud,
      allowedRoles: ['data_entry', 'reviewer', 'officer', 'admin'],
    },
    {
      href: `/${locale}/review-queue`,
      label: t.nav.reviewQueue,
      icon: FileCheck2,
      allowedRoles: ['reviewer', 'admin'],
    },
    {
      href: `/${locale}/records`,
      label: t.nav.records,
      icon: FolderLock,
      allowedRoles: ['data_entry', 'reviewer', 'officer', 'admin'],
    },
    {
      href: `/${locale}/risk-alerts`,
      label: t.nav.riskAlerts,
      icon: AlertOctagon,
      allowedRoles: ['reviewer', 'officer', 'admin'],
    },
    {
      href: `/${locale}/mutation-cases`,
      label: t.nav.mutationCases,
      icon: FileSpreadsheet,
      allowedRoles: ['officer', 'admin'],
    },
    {
      href: `/${locale}/archive`,
      label: t.nav.archive,
      icon: Archive,
      allowedRoles: ['reviewer', 'officer', 'admin'],
    },
    {
      href: `/${locale}/audit`,
      label: t.nav.audit,
      icon: History,
      allowedRoles: ['admin'],
    },
    {
      href: `/${locale}/admin`,
      label: t.nav.admin,
      icon: Shield,
      allowedRoles: ['admin'],
    },
  ];

  const visibleStaffNav = staffNav.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(currentUser.role);
  });

  const isActive = (href: string) => {
    if (href === `/${locale}` && pathname === `/${locale}`) return true;
    return href !== `/${locale}` && pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-pine-50/50 dark:bg-civic-dark/95 border-r border-pine-200/80 dark:border-pine-800/60 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          
          {/* Citizen Public Services */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-pine-600 dark:text-pine-400 uppercase">
              {locale === 'bn' ? 'নাগরিক সেবা সমূহ' : 'Citizen Services'}
            </div>
            <nav className="space-y-0.5">
              {citizenNav.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-pine-700 text-white font-semibold shadow-xs'
                        : 'text-pine-900 dark:text-pine-200 hover:bg-pine-100/80 dark:hover:bg-pine-900/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-pine-600 dark:text-pine-400'}`} />
                    <span className="truncate">{item.label}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-pine-200" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Authorized Staff & Review Queue */}
          {visibleStaffNav.length > 0 && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-pine-600 dark:text-pine-400 uppercase flex items-center justify-between">
                <span>{locale === 'bn' ? 'দাপ্তরিক ও যাচাই মডিউল' : 'Officer Modules'}</span>
                <span className="text-[10px] px-1 py-0.2 bg-pine-200 dark:bg-pine-900 text-pine-800 dark:text-pine-300 rounded font-mono">
                  {currentUser.role}
                </span>
              </div>
              <nav className="space-y-0.5">
                {visibleStaffNav.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? 'bg-pine-700 text-white font-semibold shadow-xs'
                          : 'text-pine-900 dark:text-pine-200 hover:bg-pine-100/80 dark:hover:bg-pine-900/40'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-pine-600 dark:text-pine-400'}`} />
                      <span className="truncate">{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-pine-200" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Quick Settings */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-pine-600 dark:text-pine-400 uppercase">
              {locale === 'bn' ? 'সিস্টেম' : 'System'}
            </div>
            <Link
              href={`/${locale}/settings`}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive(`/${locale}/settings`)
                  ? 'bg-pine-700 text-white font-semibold'
                  : 'text-pine-900 dark:text-pine-200 hover:bg-pine-100/80 dark:hover:bg-pine-900/40'
              }`}
            >
              <Settings className="w-4 h-4 text-pine-600 dark:text-pine-400" />
              <span>{t.nav.settings}</span>
            </Link>
          </div>

        </div>

        {/* User Persona Profile Footer */}
        <div className="p-3 border-t border-pine-200/80 dark:border-pine-800/60 bg-white/60 dark:bg-civic-darkCard/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pine-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-pine-950 dark:text-pine-100 truncate">
                {locale === 'bn' ? currentUser.nameBn : currentUser.name}
              </div>
              <div className="text-[11px] text-pine-700/80 dark:text-pine-400 truncate">
                {locale === 'bn' ? currentUser.designationBn : currentUser.designation}
              </div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
