/**
 * 历史任务提示横幅组件
 * 用于提示用户完善缺少任务域或关联对象信息的历史任务
 */

import React, { useMemo } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { UITask } from '../../types/task.types';

interface LegacyTaskBannerProps {
  tasks: UITask[];
  onDismiss?: () => void;
}

const LegacyTaskBanner: React.FC<LegacyTaskBannerProps> = ({ tasks, onDismiss }) => {
  // 统计缺少域/关联信息的任务
  const legacyStats = useMemo(() => {
    const missingDomain = tasks.filter(t => !t.domain || t.domain === 'general').length;
    const missingEntity = tasks.filter(t => !t.relatedEntityType || t.relatedEntityType === 'none').length;
    const bothMissing = tasks.filter(t => 
      (!t.domain || t.domain === 'general') && 
      (!t.relatedEntityType || t.relatedEntityType === 'none')
    ).length;
    
    return {
      missingDomain,
      missingEntity,
      bothMissing,
      totalLegacy: tasks.filter(t => 
        (!t.domain || t.domain === 'general') || 
        (!t.relatedEntityType || t.relatedEntityType === 'none')
      ).length
    };
  }, [tasks]);

  // 如果没有遗留任务，不显示横幅
  if (legacyStats.totalLegacy === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
            发现 {legacyStats.totalLegacy} 个历史任务需要完善信息
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
            为了提升任务管理效率，建议为这些任务补充任务域和关联对象信息：
          </p>
          
          <div className="flex flex-wrap gap-4 text-xs text-amber-700 dark:text-amber-300">
            {legacyStats.missingDomain > 0 && (
              <div>
                • <span className="font-medium">{legacyStats.missingDomain}</span> 个任务缺少任务域
              </div>
            )}
            {legacyStats.missingEntity > 0 && (
              <div>
                • <span className="font-medium">{legacyStats.missingEntity}</span> 个任务缺少关联对象
              </div>
            )}
          </div>
          
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            💡 点击任务卡片，在侧边栏中可以编辑任务域和关联对象
          </p>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LegacyTaskBanner;

