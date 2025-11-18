import React from 'react';
import { GraduationCap, BookOpen, Award, Eye, User, Users } from 'lucide-react';
import { CaseStudy } from '../../../../types/case';

interface CaseGridViewProps {
  cases: CaseStudy[];
  onCaseClick: (caseStudy: CaseStudy) => void;
}

const CaseGridView: React.FC<CaseGridViewProps> = ({ cases, onCaseClick }) => {
  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">暂无案例数据</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cases.map((caseStudy) => {
        return (
          <div
            key={caseStudy.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4 hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 group"
            onClick={() => onCaseClick(caseStudy)}
          >
            {/* 头部 */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                  {caseStudy.school || '未知学校'}
                </h3>
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {caseStudy.applied_program || '未知专业'}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300`}>
                  已录取
                </span>
                {caseStudy.admission_year && (
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {caseStudy.admission_year}年
                  </span>
                )}
                {caseStudy.program_id && (
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    🔗 已关联项目
                  </span>
                )}
              </div>
              
              {/* 关联导师和学生 */}
              {(caseStudy.mentor || caseStudy.student) && (
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  {caseStudy.mentor && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{caseStudy.mentor.name}</span>
                    </div>
                  )}
                  {caseStudy.student && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      <Users className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{caseStudy.student.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 背景信息 */}
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 truncate">
                  {caseStudy.bachelor_university || '未知院校'}
                  {caseStudy.master_school && ` → ${caseStudy.master_school}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 truncate">
                  {caseStudy.bachelor_major || '未知专业'}
                  {caseStudy.master_major && ` → ${caseStudy.master_major}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex items-center gap-3 flex-1">
                  {caseStudy.gpa && (
                    <span className="text-gray-900 dark:text-white font-medium">
                      GPA {caseStudy.gpa}
                    </span>
                  )}
                  {caseStudy.language_scores && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {caseStudy.language_scores}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 额外信息 */}
            {(caseStudy.scholarship || caseStudy.offer_type) && (
              <div className="flex items-center gap-2 pt-2">
                {caseStudy.scholarship && (
                  <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                    💰 {caseStudy.scholarship}
                  </span>
                )}
                {caseStudy.offer_type === 'unconditional' && (
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    无条件录取
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CaseGridView;

