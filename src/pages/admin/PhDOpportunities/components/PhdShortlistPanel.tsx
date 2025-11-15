import React from 'react';
import { ArrowRight, ExternalLink, Eye, MapPin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PhdPosition } from '@/types/phd';

interface PhdShortlistPanelProps {
  shortlist: PhdPosition[];
  onRemove: (id: string) => void;
  onViewDetail: (id: string) => void;
  onOpenOfficialLink: (url: string) => void;
}

const getPositionAvatar = (position: PhdPosition) => {
  const seed = encodeURIComponent(position.university || position.titleEn || 'PhD');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&fontWeight=600&backgroundType=gradientLinear`;
};

const formatLocation = (position: PhdPosition) => {
  if (!position.city && !position.country) {
    return '地点待更新';
  }
  if (position.city && position.country) {
    return `${position.city} · ${position.country.toUpperCase()}`;
  }
  return position.city ?? position.country ?? '地点待更新';
};

const PhdShortlistPanel: React.FC<PhdShortlistPanelProps> = ({
  shortlist,
  onRemove,
  onViewDetail,
  onOpenOfficialLink,
}) => {
  return (
    <aside className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/70">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">博士岗位收藏清单</h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          收藏的岗位会同步到申请工作台，便于为学生快速生成博士申请行动清单。
        </p>
      </div>

      <div className="space-y-3">
        {shortlist.length === 0 ? (
          <p className="rounded-2xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
            还没有收藏的岗位。点击列表中的“收藏岗位”即可加入候选清单。
          </p>
        ) : (
          shortlist.map((position) => (
            <div key={position.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 p-3 dark:border-gray-700">
              <img
                src={getPositionAvatar(position)}
                alt={position.titleZh ?? position.titleEn}
                className="h-12 w-12 cursor-pointer rounded-xl object-cover transition hover:ring-2 hover:ring-indigo-400"
                onClick={() => onViewDetail(position.id)}
              />
              <div className="flex-1 space-y-1">
                <p
                  className="cursor-pointer text-sm font-semibold text-gray-900 transition hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400"
                  onClick={() => onViewDetail(position.id)}
                >
                  {position.titleZh ?? position.titleEn}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{position.university}</p>
                <p className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                  <MapPin className="h-3 w-3 text-gray-300" />
                  {formatLocation(position)}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-indigo-200 px-2 text-xs text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-500/10"
                    onClick={() => onViewDetail(position.id)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    详情
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-emerald-200 px-2 text-xs text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
                    onClick={() => onOpenOfficialLink(position.officialLink)}
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    官网
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-gray-500 hover:text-red-500"
                    onClick={() => onRemove(position.id)}
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
            打开申请工作台 → 选择目标学生 → 导入博士收藏清单，一键生成沟通与材料计划。
          </p>
        </div>
      ) : null}
    </aside>
  );
};

export default PhdShortlistPanel;

