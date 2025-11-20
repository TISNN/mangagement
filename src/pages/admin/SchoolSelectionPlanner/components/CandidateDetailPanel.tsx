/**
 * 候选项目详情面板
 * 显示候选项目的完整信息
 */

import React from 'react';
import { X, School, GraduationCap, Target, CheckCircle2, XCircle, Clock, User, Sparkles, FileText, TrendingUp, AlertCircle, Star } from 'lucide-react';
import type { CandidateProgram } from '../types';
import { CandidateBadge } from './shared';

interface CandidateDetailPanelProps {
  candidate: CandidateProgram;
  onClose: () => void;
  onUpdate?: (candidate: CandidateProgram) => void;
}

const STAGE_ACCENT_MAP: Record<CandidateProgram['stage'], string> = {
  冲刺: 'rose',
  匹配: 'indigo',
  保底: 'emerald',
};

const STATUS_ACCENT_MAP: Record<CandidateProgram['status'], string> = {
  待讨论: 'amber',
  通过: 'emerald',
  淘汰: 'rose',
};

export const CandidateDetailPanel: React.FC<CandidateDetailPanelProps> = ({
  candidate,
  onClose,
  onUpdate,
}) => {
  const stageAccent = STAGE_ACCENT_MAP[candidate.stage];
  const statusAccent = STATUS_ACCENT_MAP[candidate.status];
  const sourceAccent = candidate.source === 'AI推荐' ? 'indigo' : 'cyan';

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 详情面板 */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl dark:bg-gray-900">
        {/* 头部 */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                stageAccent === 'rose'
                  ? 'bg-rose-100 dark:bg-rose-900/30'
                  : stageAccent === 'indigo'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30'
                  : 'bg-emerald-100 dark:bg-emerald-900/30'
              }`}>
                <School className={`h-5 w-5 ${
                  stageAccent === 'rose'
                    ? 'text-rose-600 dark:text-rose-400'
                    : stageAccent === 'indigo'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  项目详情
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {candidate.school} · {candidate.program}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="px-6 py-6 space-y-6">
          {/* 基本信息卡片 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              基本信息
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">学校</div>
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{candidate.school}</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">专业项目</div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{candidate.program}</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">策略分类</div>
                <div className="mt-1">
                  <CandidateBadge value={candidate.stage} accent={stageAccent as any} />
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">当前状态</div>
                <div className="mt-1">
                  <CandidateBadge value={candidate.status} accent={statusAccent as any} />
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">来源</div>
                <div className="mt-1">
                  <CandidateBadge value={candidate.source} accent={sourceAccent as any} />
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">负责人</div>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{candidate.owner}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI推荐信息（如果是AI推荐） */}
          {candidate.source === 'AI推荐' && (
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm dark:border-indigo-800 dark:from-indigo-900/20 dark:to-blue-900/20">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">AI 推荐信息</h3>
              </div>
              
              {candidate.matchScore !== undefined && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">匹配度评分</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {candidate.matchScore} 分
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
                      style={{ width: `${candidate.matchScore}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              )}

              {candidate.matchReason && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">匹配理由</span>
                  </div>
                  <p className="rounded-lg bg-white/60 p-3 text-sm leading-relaxed text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                    {candidate.matchReason}
                  </p>
                </div>
              )}

              {candidate.rationale && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">推荐理由</span>
                  </div>
                  <p className="rounded-lg bg-white/60 p-3 text-sm leading-relaxed text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                    {candidate.rationale}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 备注信息 */}
          {candidate.notes && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                备注信息
              </h3>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/40">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {candidate.notes}
                </p>
              </div>
            </div>
          )}

          {/* 操作建议 */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-800 dark:bg-amber-900/20">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">操作建议</h3>
            </div>
            <div className="space-y-2">
              {candidate.status === '待讨论' && (
                <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">待讨论状态</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      建议与学生或团队讨论此项目的可行性，确定是否加入最终选校列表
                    </div>
                  </div>
                </div>
              )}
              {candidate.status === '通过' && (
                <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">已通过审核</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      此项目已确认加入选校列表，可以开始准备申请材料
                    </div>
                  </div>
                </div>
              )}
              {candidate.status === '淘汰' && (
                <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                  <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">已淘汰</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      此项目已从选校列表中移除，如需重新考虑可联系负责人
                    </div>
                  </div>
                </div>
              )}
              {candidate.stage === '冲刺' && (
                <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                  <Star className="h-4 w-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">冲刺档位</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      建议重点准备申请材料，突出个人优势，争取获得录取机会
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              关闭
            </button>
            {onUpdate && (
              <button
                onClick={() => {
                  // 这里可以添加编辑功能
                  onClose();
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                编辑信息
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

