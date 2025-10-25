import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  Calendar,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StandardizedTest, TestType } from '../types';

interface StandardizedTestsSectionProps {
  tests?: StandardizedTest[];
  onUpdate?: (tests: StandardizedTest[]) => void;
  readOnly?: boolean;
}

const TEST_TYPE_NAMES: Record<TestType, string> = {
  'IELTS': '雅思 (IELTS)',
  'TOEFL': '托福 (TOEFL)',
  'GRE': 'GRE',
  'GMAT': 'GMAT',
  'CET4': '大学英语四级 (CET-4)',
  'CET6': '大学英语六级 (CET-6)',
  'OTHER': '其他'
};

export const StandardizedTestsSection: React.FC<StandardizedTestsSectionProps> = ({
  tests = [],
  onUpdate,
  readOnly = true
}) => {
  // 编辑模式下默认展开所有考试记录,查看模式下默认收起
  const [expandedTests, setExpandedTests] = useState<Set<number>>(() => {
    if (!readOnly && tests.length > 0) {
      return new Set(tests.map((_, index) => index));
    }
    return new Set();
  });

  // 当 readOnly 状态改变时,更新展开状态
  useEffect(() => {
    if (!readOnly && tests.length > 0) {
      // 编辑模式:展开所有
      setExpandedTests(new Set(tests.map((_, index) => index)));
    } else {
      // 查看模式:收起所有
      setExpandedTests(new Set());
    }
  }, [readOnly, tests.length]);

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTests(newExpanded);
  };

  const addTest = () => {
    if (onUpdate) {
      onUpdate([...tests, { test_type: 'IELTS', has_account: false }]);
    }
  };

  const removeTest = (index: number) => {
    if (onUpdate) {
      const newTests = tests.filter((_, i) => i !== index);
      onUpdate(newTests);
    }
  };

  const updateTest = (index: number, field: keyof StandardizedTest, value: any) => {
    if (onUpdate) {
      const newTests = [...tests];
      newTests[index] = { ...newTests[index], [field]: value };
      onUpdate(newTests);
    }
  };

  // 渲染不同考试类型的分数输入
  const renderScoreInputs = (test: StandardizedTest, index: number) => {
    switch (test.test_type) {
      case 'IELTS':
      case 'TOEFL':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">总分</label>
              <input
                type="number"
                step="0.5"
                value={test.total_score || ''}
                onChange={(e) => updateTest(index, 'total_score', parseFloat(e.target.value) || undefined)}
                disabled={readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                placeholder="如: 7.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">听力</label>
                <input
                  type="number"
                  step="0.5"
                  value={test.listening_score || ''}
                  onChange={(e) => updateTest(index, 'listening_score', parseFloat(e.target.value) || undefined)}
                  disabled={readOnly}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">阅读</label>
                <input
                  type="number"
                  step="0.5"
                  value={test.reading_score || ''}
                  onChange={(e) => updateTest(index, 'reading_score', parseFloat(e.target.value) || undefined)}
                  disabled={readOnly}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">写作</label>
                <input
                  type="number"
                  step="0.5"
                  value={test.writing_score || ''}
                  onChange={(e) => updateTest(index, 'writing_score', parseFloat(e.target.value) || undefined)}
                  disabled={readOnly}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">口语</label>
                <input
                  type="number"
                  step="0.5"
                  value={test.speaking_score || ''}
                  onChange={(e) => updateTest(index, 'speaking_score', parseFloat(e.target.value) || undefined)}
                  disabled={readOnly}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>
            </div>
          </div>
        );

      case 'GRE':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Verbal (语文)</label>
                <input
                  type="number"
                  value={test.verbal_score || ''}
                  onChange={(e) => updateTest(index, 'verbal_score', parseInt(e.target.value) || undefined)}
                  disabled={readOnly}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  placeholder="130-170"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Quantitative (数学)</label>
                <input
                  type="number"
                  value={test.quantitative_score || ''}
                  onChange={(e) => updateTest(index, 'quantitative_score', parseInt(e.target.value) || undefined)}
                  disabled={readOnly}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  placeholder="130-170"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Analytical Writing (写作)</label>
              <input
                type="number"
                step="0.5"
                value={test.analytical_writing_score || ''}
                onChange={(e) => updateTest(index, 'analytical_writing_score', parseFloat(e.target.value) || undefined)}
                disabled={readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                placeholder="0-6"
              />
            </div>
          </div>
        );

      case 'GMAT':
      case 'CET4':
      case 'CET6':
      case 'OTHER':
        return (
          <div>
            {test.test_type === 'OTHER' && (
              <div className="mb-3">
                <label className="text-xs text-gray-600 dark:text-gray-400">考试名称</label>
                <input
                  type="text"
                  value={test.other_test_name || ''}
                  onChange={(e) => updateTest(index, 'other_test_name', e.target.value)}
                  disabled={readOnly}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  placeholder="请输入考试名称"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">总分</label>
              <input
                type="number"
                value={test.total_score || ''}
                onChange={(e) => updateTest(index, 'total_score', parseFloat(e.target.value) || undefined)}
                disabled={readOnly}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                placeholder="输入分数"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
          <Award className="h-4 w-4 mr-2" />
          标化成绩
        </h3>
        {!readOnly && (
          <button
            onClick={addTest}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Plus className="h-3 w-3" />
            添加考试成绩
          </button>
        )}
      </div>

      {tests.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">考试类型:</span>
            <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">考试时间:</span>
            <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">总分:</span>
            <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test, index) => {
            const isExpanded = expandedTests.has(index);
            return (
              <div 
                key={index} 
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-900/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {!readOnly ? (
                        <select
                          value={test.test_type}
                          onChange={(e) => updateTest(index, 'test_type', e.target.value as TestType)}
                          disabled={readOnly}
                          className="font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                        >
                          {Object.entries(TEST_TYPE_NAMES).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      ) : (
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {TEST_TYPE_NAMES[test.test_type]}
                          {test.test_type === 'OTHER' && test.other_test_name && ` - ${test.other_test_name}`}
                        </h4>
                      )}
                      
                      {test.test_date && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {test.test_date}
                        </span>
                      )}
                    </div>

                    {/* 快速预览分数 */}
                    {!isExpanded && test.total_score && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        总分: {test.total_score}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!readOnly && (
                      <button
                        onClick={() => removeTest(index)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleExpand(index)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title={isExpanded ? "收起" : "展开"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {/* 考试时间 */}
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400">考试时间</label>
                      <input
                        type="date"
                        value={test.test_date || ''}
                        onChange={(e) => updateTest(index, 'test_date', e.target.value)}
                        disabled={readOnly}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      />
                    </div>

                    {/* 分数输入 */}
                    {renderScoreInputs(test, index)}

                    {/* 账号密码 */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <input
                          type="checkbox"
                          checked={test.has_account || false}
                          onChange={(e) => updateTest(index, 'has_account', e.target.checked)}
                          disabled={readOnly}
                          className="rounded"
                        />
                        <span className="flex items-center gap-1">
                          {test.has_account ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          保存考试账号密码
                        </span>
                      </label>

                      {test.has_account && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">账号</label>
                            <input
                              type="text"
                              value={test.account || ''}
                              onChange={(e) => updateTest(index, 'account', e.target.value)}
                              disabled={readOnly}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">密码</label>
                            <input
                              type="text"
                              value={test.password || ''}
                              onChange={(e) => updateTest(index, 'password', e.target.value)}
                              disabled={readOnly}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

