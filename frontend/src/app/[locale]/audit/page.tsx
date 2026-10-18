'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  History,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Database,
  Lock,
  RefreshCw,
  FileText,
  AlertCircle
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  actor_id?: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  request_ip?: string;
  metadata_json?: string;
  created_at: string;
}

export default function AuditPage() {
  const { locale, t, toLocalDigits } = useApp();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/audit-logs?limit=100');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (selectedRole !== 'ALL' && log.actor_role !== selectedRole) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor_name.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entity_id.toLowerCase().includes(q) ||
        log.entity_type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-pine-200 dark:border-pine-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-pine-950 dark:text-pine-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <History className="w-5 h-5 text-purple-700 dark:text-purple-300" />
            </div>
            <span>{t.nav.audit}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {locale === 'bn'
              ? 'অপরিবর্তনীয় অডিট লগ ট্রেইল — সকল কর্মকর্তা ও সিস্টেম ক্রিয়াকলাপের ক্রিপ্টোগ্রাফিক সুরক্ষা রেকর্ড'
              : 'Immutable audit log trail — Tamper-evident record of all administrative and lifecycle actions'}
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="px-3 py-1.5 rounded-lg border border-pine-200 dark:border-pine-800 hover:bg-pine-50 dark:hover:bg-pine-900/30 text-xs font-medium text-pine-700 dark:text-pine-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{locale === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
        </button>
      </div>

      {/* Security Notice Banner */}
      <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-300 flex items-center gap-3">
        <Lock className="w-4 h-4 text-purple-600 shrink-0" />
        <div>
          <span className="font-semibold">
            {locale === 'bn' ? 'সংরক্ষিত নিরাপত্তা নীতি:' : 'Security & Privacy Guarantees:'}
          </span>{' '}
          {locale === 'bn'
            ? 'এই অডিট ট্রেইলে কোনো ব্যবহারকারী পাসওয়ার্ড, ব্যক্তিগত গোপন কি বা কাঁচা দলিলের কনটেন্ট সংরক্ষিত হয় না। কেবল ক্রিয়াকলাপ, সংশ্লিষ্ট আইডি ও টাইমস্ট্যাম্প অপরিবর্তনীয়ভাবে সংরক্ষিত থাকে।'
            : 'Audit records strictly omit passwords, cryptographic private keys, and raw document contents. Only action provenance and entity IDs are immutably persisted.'}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'কর্মকর্তার নাম, অ্যাকশন বা এন্টিটি আইডি দিয়ে ফিল্টার করুন...'
                : 'Filter by actor, action, or entity ID...'
            }
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-pine-200 dark:border-pine-800 bg-white dark:bg-pine-950/40 text-xs focus:outline-none focus:ring-2 focus:ring-pine-600"
          />
        </div>

        {/* Role Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
          {['ALL', 'officer', 'reviewer', 'data_entry', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedRole === role
                  ? 'bg-purple-700 text-white'
                  : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
              }`}
            >
              {role === 'ALL'
                ? locale === 'bn' ? 'সকল রোল' : 'All Roles'
                : role}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-civic-darkCard border border-pine-200 dark:border-pine-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-pine-600" />
            <span>{locale === 'bn' ? 'অডিট রেকর্ড লোড হচ্ছে...' : 'Loading audit log records...'}</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            {locale === 'bn' ? 'কোনো অডিট রেকর্ড মেলেনি।' : 'No audit records match the current filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-pine-50/70 dark:bg-pine-950/40 border-b border-pine-200 dark:border-pine-800 text-pine-950 dark:text-pine-200 font-semibold">
                <tr>
                  <th className="p-3">{locale === 'bn' ? 'টাইমস্ট্যাম্প' : 'Timestamp'}</th>
                  <th className="p-3">{locale === 'bn' ? 'কর্তৃপক্ষ / ভূমিকা' : 'Actor / Role'}</th>
                  <th className="p-3">{locale === 'bn' ? 'সম্পাদিত অ্যাকশন' : 'Action Performed'}</th>
                  <th className="p-3">{locale === 'bn' ? 'লক্ষ্যবস্তু' : 'Target Entity'}</th>
                  <th className="p-3 text-right">{locale === 'bn' ? 'নিরাপদ মেটাডেটা' : 'Safe Metadata'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pine-100 dark:divide-pine-900">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  let parsedMeta = null;
                  try {
                    parsedMeta = log.metadata_json ? JSON.parse(log.metadata_json) : null;
                  } catch (e) {
                    parsedMeta = log.metadata_json;
                  }

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-pine-50/40 dark:hover:bg-pine-900/20 transition-colors">
                        
                        {/* Timestamp */}
                        <td className="p-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                          {toLocalDigits(log.created_at.replace('T', ' ').slice(0, 19))}
                        </td>

                        {/* Actor & Role */}
                        <td className="p-3 whitespace-nowrap">
                          <span className="font-semibold text-pine-950 dark:text-pine-100 block">
                            {log.actor_name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-pine-100 dark:bg-pine-900/60 text-pine-800 dark:text-pine-300">
                            {log.actor_role}
                          </span>
                        </td>

                        {/* Action Code */}
                        <td className="p-3">
                          <span className="font-mono font-medium text-[11px] text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-900/50">
                            {log.action}
                          </span>
                        </td>

                        {/* Entity */}
                        <td className="p-3 whitespace-nowrap font-mono">
                          <span className="text-gray-500">{log.entity_type}: </span>
                          <span className="font-bold text-pine-900 dark:text-pine-200">{log.entity_id}</span>
                        </td>

                        {/* Metadata Toggle */}
                        <td className="p-3 text-right">
                          {log.metadata_json ? (
                            <button
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                              className="px-2 py-1 rounded border border-pine-200 dark:border-pine-800 hover:bg-pine-50 text-[11px] font-mono text-pine-700 dark:text-pine-300 transition-colors"
                            >
                              {isExpanded ? (locale === 'bn' ? 'সংক্ষিপ্ত' : 'Hide') : (locale === 'bn' ? 'বিস্তারিত' : 'Inspect')}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-[10px]">None</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable JSON Row */}
                      {isExpanded && parsedMeta && (
                        <tr className="bg-pine-50/20 dark:bg-pine-950/20 border-b border-pine-200 dark:border-pine-800">
                          <td colSpan={5} className="p-4">
                            <div className="p-3 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto">
                              <pre>{JSON.stringify(parsedMeta, null, 2)}</pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
