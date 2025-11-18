/**
 * 配置表单组件
 */

import type { StudentProfile, AIMatchCriteria } from '../../types';

interface ConfigFormProps {
  student: StudentProfile;
  criteria: AIMatchCriteria;
  onCriteriaChange: (criteria: AIMatchCriteria) => void;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ student, criteria, onCriteriaChange }) => {
  return (
    <div className="space-y-6">
      {/* 学生基本信息(只读) */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">📋 学生基本信息</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">学生姓名:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{student.name}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">当前学校:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {criteria.currentSchool || '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">GPA:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {student.gpa || '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">语言成绩:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {student.languageScore || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* 匹配条件(可编辑) */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">⚙️ 匹配条件</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              目标国家
            </label>
            <div className="flex flex-wrap gap-2">
              {['美国', '英国', '加拿大', '澳大利亚', '新加坡'].map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    const newCountries = criteria.targetCountries.includes(country)
                      ? criteria.targetCountries.filter((c) => c !== country)
                      : [...criteria.targetCountries, country];
                    onCriteriaChange({ ...criteria, targetCountries: newCountries });
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    criteria.targetCountries.includes(country)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {country}
                  {criteria.targetCountries.includes(country) && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              专业方向
            </label>
            <div className="flex flex-wrap gap-2">
              {['CS', 'SE', 'AI', 'Data Science', 'Finance', 'Business'].map((program) => (
                <button
                  key={program}
                  onClick={() => {
                    const newPrograms = criteria.targetPrograms.includes(program)
                      ? criteria.targetPrograms.filter((p) => p !== program)
                      : [...criteria.targetPrograms, program];
                    onCriteriaChange({ ...criteria, targetPrograms: newPrograms });
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    criteria.targetPrograms.includes(program)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {program}
                  {criteria.targetPrograms.includes(program) && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              预算范围(人民币/年)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="最小预算"
                value={criteria.budgetRange?.min || ''}
                onChange={(e) =>
                  onCriteriaChange({
                    ...criteria,
                    budgetRange: {
                      ...criteria.budgetRange,
                      min: e.target.value ? parseInt(e.target.value) : undefined,
                      currency: 'CNY',
                    },
                  })
                }
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="最大预算"
                value={criteria.budgetRange?.max || ''}
                onChange={(e) =>
                  onCriteriaChange({
                    ...criteria,
                    budgetRange: {
                      ...criteria.budgetRange,
                      max: e.target.value ? parseInt(e.target.value) : undefined,
                      currency: 'CNY',
                    },
                  })
                }
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
