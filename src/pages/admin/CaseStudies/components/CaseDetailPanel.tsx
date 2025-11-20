import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Award, Briefcase, FileText, Link2, User, Users, Edit2, Share2, Lock } from 'lucide-react';
import { CaseStudy } from '../../../../types/case';
import { supabase } from '../../../../lib/supabase';

interface CaseDetailPanelProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onEdit?: (caseStudy: CaseStudy) => void;
  onShare?: (caseStudy: CaseStudy) => void;
  onUnshare?: (caseStudy: CaseStudy) => void;
}

const CaseDetailPanel: React.FC<CaseDetailPanelProps> = ({ caseStudy, onClose, onEdit, onShare, onUnshare }) => {
  const [programInfo, setProgramInfo] = useState<{ school: string; program: string } | null>(null);

  // 加载关联的专业信息
  useEffect(() => {
    const loadProgramInfo = async () => {
      if (!caseStudy?.program_id) return;
      
      try {
        const { data: programData } = await supabase
          .from('programs')
          .select('cn_name, en_name, school_id')
          .eq('id', caseStudy.program_id)
          .single();

        if (programData) {
          const { data: schoolData } = await supabase
            .from('schools')
            .select('cn_name')
            .eq('id', programData.school_id)
            .single();

          setProgramInfo({
            school: schoolData?.cn_name || '未知学校',
            program: programData.cn_name || programData.en_name || '未知专业'
          });
        }
      } catch (error) {
        console.error('加载专业信息失败:', error);
      }
    };

    loadProgramInfo();
  }, [caseStudy?.program_id]);

  if (!caseStudy) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 侧边面板 */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
        {/* 头部 */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {caseStudy.school || '未知学校'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{caseStudy.applied_program || '未知专业'}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300`}>
                  已录取
                </span>
                {caseStudy.admission_year && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {caseStudy.admission_year}年
                  </span>
                )}
                {caseStudy.student_name && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {caseStudy.student_name}
                  </span>
                )}
                {caseStudy.case_type === 'public' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    公共案例
                  </span>
                )}
                {caseStudy.is_anonymized && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    已去敏
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onShare && (
                <button
                  onClick={() => onShare(caseStudy)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="分享到公共库"
                >
                  <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
              )}
              {onUnshare && (
                <button
                  onClick={() => onUnshare(caseStudy)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="撤回分享"
                >
                  <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(caseStudy)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="编辑案例"
                >
                  <Edit2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="px-6 py-6 space-y-6">
          {/* 关联导师和学生 */}
          {(caseStudy.mentor || caseStudy.student) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 负责导师 */}
              {caseStudy.mentor && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">负责导师</div>
                      <div className="text-base font-medium text-blue-900 dark:text-blue-300">
                        {caseStudy.mentor.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 关联学生 */}
              {caseStudy.student && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-green-700 dark:text-green-400 mb-1">关联学生</div>
                      <div className="text-base font-medium text-green-900 dark:text-green-300">
                        {caseStudy.student.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 关联专业项目 */}
          {caseStudy.program_id && programInfo && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-purple-700 dark:text-purple-400 mb-1">关联专业项目</div>
                  <div className="text-base font-medium text-purple-900 dark:text-purple-300">
                    {programInfo.school} - {programInfo.program}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                    项目ID: {caseStudy.program_id.slice(0, 8)}...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 本科背景 */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              本科背景
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">本科院校</div>
                <div className="text-base font-medium text-gray-900 dark:text-white">
                  {caseStudy.bachelor_university || '-'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">本科专业</div>
                <div className="text-base font-medium text-gray-900 dark:text-white">
                  {caseStudy.bachelor_major || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* 硕士背景（如果有） */}
          {(caseStudy.master_school || caseStudy.master_major || caseStudy.master_gpa) && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                硕士背景
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {caseStudy.master_school && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">硕士院校</div>
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {caseStudy.master_school}
                    </div>
                  </div>
                )}
                {caseStudy.master_major && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">硕士专业</div>
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {caseStudy.master_major}
                    </div>
                  </div>
                )}
                {caseStudy.master_gpa && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">硕士GPA</div>
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {caseStudy.master_gpa}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 成绩信息 */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              成绩信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {caseStudy.gpa && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">GPA</div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    {caseStudy.gpa}
                  </div>
                </div>
              )}
              {caseStudy.language_scores && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">语言成绩</div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    {caseStudy.language_scores}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 相关经历 */}
          {caseStudy.experiecnce && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                相关经历
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                  {caseStudy.experiecnce}
                </div>
              </div>
            </div>
          )}

          {/* 录取详情 */}
          {(caseStudy.scholarship || caseStudy.offer_type) && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                录取详情
              </h3>
              <div className="space-y-3">
                {caseStudy.offer_type && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">录取类型</div>
                    <div className="text-base text-gray-900 dark:text-white">
                      {caseStudy.offer_type === 'unconditional' ? '无条件录取' : '有条件录取'}
                    </div>
                  </div>
                )}
                {caseStudy.scholarship && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">💰 奖学金</div>
                    <div className="text-base font-medium text-yellow-900 dark:text-yellow-300">
                      {caseStudy.scholarship}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 备注 */}
          {caseStudy.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                备注说明
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                  {caseStudy.notes}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CaseDetailPanel;

