import React from 'react';
import { GraduationCap, BookOpen, Award, MapPin, User, Users } from 'lucide-react';
import { CaseStudy } from '../../../../types/case';

interface CaseListViewProps {
  cases: CaseStudy[];
  onCaseClick: (caseStudy: CaseStudy) => void;
}

const CaseListView: React.FC<CaseListViewProps> = ({ cases, onCaseClick }) => {
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
    <div className="space-y-4">
      {cases.map((caseStudy) => {
        return (
          <div
            key={caseStudy.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800"
            onClick={() => onCaseClick(caseStudy)}
          >
            <div className="flex items-start gap-6">
              {/* 左侧：学校和专业信息 */}
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {caseStudy.school || '未知学校'}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300`}>
                      已录取
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {caseStudy.applied_program || '未知专业'}
                  </p>
                  {caseStudy.admission_year && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {caseStudy.admission_year}年录取
                    </div>
                  )}
                  
                  {/* 关联导师和学生 */}
                  {(caseStudy.mentor || caseStudy.student) && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {caseStudy.mentor && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          <User className="w-3 h-3" />
                          <span>导师: {caseStudy.mentor.name}</span>
                        </div>
                      )}
                      {caseStudy.student && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          <Users className="w-3 h-3" />
                          <span>学生: {caseStudy.student.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 背景信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <GraduationCap className="w-3 h-3" />
                      本科院校
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {caseStudy.bachelor_university || '-'}
                    </p>
                    {caseStudy.master_school && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        硕士: {caseStudy.master_school}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-3 h-3" />
                      本科专业
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {caseStudy.bachelor_major || '-'}
                    </p>
                    {caseStudy.master_major && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        硕士: {caseStudy.master_major}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Award className="w-3 h-3" />
                      GPA
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {caseStudy.gpa || '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      语言成绩
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {caseStudy.language_scores || '-'}
                    </p>
                  </div>
                </div>

                {/* 额外标签 */}
                {(caseStudy.scholarship || caseStudy.offer_type || caseStudy.experiecnce) && (
                  <div className="flex items-center gap-2 flex-wrap">
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
                    {caseStudy.experiecnce && (
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                        💼 {caseStudy.experiecnce}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CaseListView;

