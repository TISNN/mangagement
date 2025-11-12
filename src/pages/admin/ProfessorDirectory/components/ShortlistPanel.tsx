import React from 'react';
import { ArrowRight, ClipboardPenLine, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfessorProfile } from '../types';
import { Button } from '@/components/ui/button';

interface ShortlistPanelProps {
  shortlist: ProfessorProfile[];
  onRemove: (id: number) => void;
  onOpenMatch: (profile: ProfessorProfile) => void;
}

const getProfessorAvatar = (profile: ProfessorProfile) => {
  if (profile.avatar) return profile.avatar;
  const seed = encodeURIComponent(profile.name || 'Professor');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&fontWeight=600&backgroundType=gradientLinear`;
};

const ShortlistPanel: React.FC<ShortlistPanelProps> = ({ shortlist, onRemove, onOpenMatch }) => {
  const navigate = useNavigate();

  return (
    <aside className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/70">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">教授收藏清单</h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          收藏的教授会同步到申请工作台，方便为学生一键生成导师方案。
        </p>
      </div>

      <div className="space-y-3">
        {shortlist.length === 0 ? (
          <p className="rounded-2xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
            还没有收藏的教授。点击列表中的"收藏到清单"快速加入候选名单。
          </p>
        ) : (
          shortlist.map((profile) => (
            <div key={profile.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 p-3 dark:border-gray-700">
              <img 
                src={getProfessorAvatar(profile)} 
                alt={profile.name} 
                className="h-12 w-12 cursor-pointer rounded-xl object-cover transition hover:ring-2 hover:ring-indigo-400" 
                onClick={() => navigate(`/admin/professor-directory/${profile.id}`)}
              />
              <div className="flex-1 space-y-1">
                <p 
                  className="cursor-pointer text-sm font-semibold text-gray-900 transition hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400"
                  onClick={() => navigate(`/admin/professor-directory/${profile.id}`)}
                >
                  {profile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{profile.university}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-indigo-200 px-2 text-xs text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-500/10"
                    onClick={() => navigate(`/admin/professor-directory/${profile.id}`)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    详情
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-emerald-200 px-2 text-xs text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
                    onClick={() => onOpenMatch(profile)}
                  >
                    <ClipboardPenLine className="mr-1 h-3 w-3" />
                    匹配
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-gray-500 hover:text-red-500"
                    onClick={() => onRemove(profile.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    移除
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {shortlist.length > 0 ? (
        <div className="rounded-2xl bg-indigo-50 p-4 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-100">
          <p className="font-medium">下一步建议</p>
          <p className="mt-1 flex items-center gap-1">
            <ArrowRight className="h-3 w-3" />
            打开申请工作台 → 选择目标学生 → 导入教授清单，自动生成沟通任务。
          </p>
        </div>
      ) : null}
    </aside>
  );
};

export default ShortlistPanel;

