import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ProfessorProfile } from '../types';
import ProfessorCard from './ProfessorCard';

interface ProfessorGridProps {
  profiles: ProfessorProfile[];
  onViewDetail: (profile: ProfessorProfile) => void;
  onToggleFavorite: (profile: ProfessorProfile, nextState: boolean) => void;
  favoriteProfessorIds: Set<number>;
  onOpenMatch: (profile: ProfessorProfile) => void;
}

const ProfessorGrid: React.FC<ProfessorGridProps> = ({
  profiles,
  onViewDetail,
  onToggleFavorite,
  favoriteProfessorIds,
  onOpenMatch,
}) => {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900/60">
        <AlertCircle className="mb-3 h-8 w-8 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">未找到符合条件的教授</h3>
        <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          尝试放宽筛选条件，或切换到“全部教授”模式查看更多结果。你也可以把筛选组合保存为常用方案，方便后续快速筛选。
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {profiles.map((profile) => (
        <ProfessorCard
          key={profile.id}
          profile={profile}
          onViewDetail={onViewDetail}
          onToggleFavorite={onToggleFavorite}
          isFavorited={favoriteProfessorIds.has(profile.id)}
          onOpenMatch={onOpenMatch}
        />
      ))}
    </div>
  );
};

export default ProfessorGrid;

