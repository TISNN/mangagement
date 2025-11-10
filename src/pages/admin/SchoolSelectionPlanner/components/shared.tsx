import React from 'react';

export type Accent = 'blue' | 'indigo' | 'purple' | 'emerald' | 'orange' | 'rose' | 'amber' | 'cyan' | 'gray';

const BADGE_ACCENT_MAP: Record<Accent, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-300',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300',
};

const ICON_ACCENT_MAP: Record<Accent, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300',
  gray: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const TEXT_ACCENT_MAP: Record<Accent, string> = {
  blue: 'text-blue-700 dark:text-blue-200',
  indigo: 'text-indigo-700 dark:text-indigo-200',
  purple: 'text-purple-700 dark:text-purple-200',
  emerald: 'text-emerald-700 dark:text-emerald-200',
  orange: 'text-orange-700 dark:text-orange-200',
  rose: 'text-rose-700 dark:text-rose-200',
  amber: 'text-amber-700 dark:text-amber-200',
  cyan: 'text-cyan-700 dark:text-cyan-200',
  gray: 'text-gray-700 dark:text-gray-200',
};

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, action }) => (
  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
    {action}
  </div>
);

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: Accent;
}

export const StatPill: React.FC<StatPillProps> = ({ icon, label, value, accent = 'blue' }) => {
  const iconStyles = ICON_ACCENT_MAP[accent];
  const valueStyles = TEXT_ACCENT_MAP[accent];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyles}`}>{icon}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className={`text-sm font-semibold ${valueStyles}`}>{value}</div>
      </div>
    </div>
  );
};

interface CandidateBadgeProps {
  value: string;
  accent?: Accent;
}

export const CandidateBadge: React.FC<CandidateBadgeProps> = ({ value, accent = 'blue' }) => {
  const badgeStyles = BADGE_ACCENT_MAP[accent];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${badgeStyles}`}>
      {value}
    </span>
  );
};

export const ICON_COLOR_MAP: Record<Accent, string> = {
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  purple: 'text-purple-500',
  emerald: 'text-emerald-500',
  orange: 'text-orange-500',
  rose: 'text-rose-500',
  amber: 'text-amber-500',
  cyan: 'text-cyan-500',
  gray: 'text-gray-500',
};
