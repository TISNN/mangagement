/**
 * 进度条组件 - 显示申请进度的7个阶段
 */

import { applicationStages, getStageFromProgress } from '../utils/stageUtils';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  const currentStage = getStageFromProgress(progress);

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-center relative">
        {/* 背景连接线 */}
        <div className="absolute top-1/2 left-9 right-9 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
        
        {/* 进度连接线 */}
        <div 
          className="absolute top-1/2 left-9 h-0.5 bg-blue-600 dark:bg-blue-500 -translate-y-1/2" 
          style={{ 
            width: `${Math.min(progress, 100)}%`, 
            maxWidth: 'calc(100% - 72px)'
          }}
        ></div>
        
        {applicationStages.map((stage, stageIndex) => {
          const StageIcon = stage.icon;
          return (
            <div 
              key={stage.id} 
              className={`flex flex-col items-center z-10 ${
                stageIndex <= currentStage 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div className="relative">
                <div className={`rounded-full p-2 ${
                  stageIndex < currentStage 
                    ? 'bg-blue-600 dark:bg-blue-500' 
                    : stageIndex === currentStage 
                      ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-600 dark:border-blue-400' 
                      : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <StageIcon className={`h-5 w-5 ${
                    stageIndex < currentStage 
                      ? 'text-white' 
                      : stageIndex === currentStage 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500'
                  }`} />
                </div>
              </div>
              <span className="text-xs mt-2 font-medium whitespace-nowrap">{stage.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

