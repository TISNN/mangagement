import React from 'react';
import { ArrowUpRight, Award, Calendar, Check, Globe2, Mail, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfessorProfile } from '../types';

interface ProfessorCardProps {
  profile: ProfessorProfile;
  onViewDetail: (profile: ProfessorProfile) => void;
  onToggleFavorite: (profile: ProfessorProfile, nextState: boolean) => void;
  isFavorited: boolean;
  onOpenMatch: (profile: ProfessorProfile) => void;
}

const formatDate = (date: string) => {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  } catch (error) {
    return date;
  }
};

const getProfessorAvatar = (profile: ProfessorProfile) => {
  if (profile.avatar) return profile.avatar;
  const seed = encodeURIComponent(profile.name || 'Professor');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&fontWeight=600&backgroundType=gradientLinear`;
};

const ProfessorCard: React.FC<ProfessorCardProps> = ({
  profile,
  onViewDetail,
  onToggleFavorite,
  isFavorited,
  onOpenMatch,
}) => {
  const avatar = getProfessorAvatar(profile);
  const fundingLabel = profile.fundingOptions[0]?.type ?? '资助信息';

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-900/70">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start gap-4">
          <img
            src={avatar}
            alt={profile.name}
            className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover shadow-sm ring-2 ring-indigo-100 dark:ring-indigo-500/30"
          />
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
              <Badge
                variant="outline"
                className="border-indigo-200 bg-indigo-50 text-xs text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
              >
                匹配度 {profile.matchScore}%
              </Badge>
            </div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">{profile.university}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.country}
                {profile.city ? ` · ${profile.city}` : ''}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                截止 {formatDate(profile.applicationWindow.end)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                {fundingLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                {profile.phdSupervisionStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="line-clamp-2 text-gray-700 dark:text-gray-200">
            <span className="font-medium text-gray-900 dark:text-white">研究方向：</span>
            {profile.researchTags.join(' · ')}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/80 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
            <Globe2 className="h-3.5 w-3.5" />
            {profile.acceptsInternationalStudents ? '接受国际生' : '仅限本校/联合培养'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-500 dark:bg-gray-900 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5" />
            {profile.responseTime}
          </span>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <Button
            variant={isFavorited ? 'default' : 'outline'}
            className={
              isFavorited
                ? 'w-full bg-indigo-600 text-white hover:bg-indigo-500'
                : 'w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/50 dark:text-indigo-200 dark:hover:bg-indigo-500/10'
            }
            onClick={() => onToggleFavorite(profile, !isFavorited)}
          >
            {isFavorited ? (
              <span className="inline-flex items-center gap-1">
                <Check className="h-4 w-4" />
                已收藏
              </span>
            ) : (
              '收藏到清单'
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={() => onOpenMatch(profile)}
          >
            加入学生方案
          </Button>
          <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500" onClick={() => onViewDetail(profile)}>
            查看详情
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorCard;

