/**
 * 智能选校Agent - 主页面
 * 集成智选模式、智研模式和AI顾问
 */

import React, { useState, useMemo } from 'react';
import { Brain, Zap, Search, MessageSquare, FileDown } from 'lucide-react';
import { useSchools } from '../SchoolLibrary';
import { usePrograms } from '../ProgramLibrary';
import { QuickMatchMode } from './components/QuickMatchMode';
import {
  UserCriteria,
  MatchStrategy,
  QuickMatchResult,
  QuickMatchPlan
} from './types/agent.types';
import { performQuickMatch } from './services/matchEngine';

type TabType = 'quick' | 'deep' | 'advisor';

const SmartSchoolSelectionPage: React.FC = () => {
  // 数据加载
  const { schools, loading: schoolsLoading } = useSchools();
  const { programs, loading: programsLoading } = usePrograms();
  
  // 当前标签页
  const [activeTab, setActiveTab] = useState<TabType>('quick');
  
  // 用户条件
  const [criteria, setCriteria] = useState<UserCriteria>({
    countries: ['英国'],
    majors: ['计算机'],
    degreeLevel: 'master',
    gpa: 3.5,
    budgetMin: 200000,
    budgetMax: 400000
  });
  
  // 匹配策略
  const [strategy, setStrategy] = useState<MatchStrategy>('balanced');
  
  // 匹配结果
  const [quickResults, setQuickResults] = useState<QuickMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 执行快速匹配
  const handleQuickMatch = () => {
    setLoading(true);
    setTimeout(() => {
      const results = performQuickMatch(schools, programs, criteria, strategy);
      setQuickResults(results);
      setLoading(false);
    }, 1000); // 模拟AI处理时间
  };
  
  // 锁定结果
  const handleLockResult = (index: number) => {
    setQuickResults(prev => prev.map((r, i) => 
      i === index ? { ...r, locked: !r.locked } : r
    ));
  };
  
  // 进入智研模式
  const handleEnterDeepMode = (result: QuickMatchResult) => {
    // TODO: 实现智研模式跳转
    setActiveTab('deep');
    console.log('进入智研模式:', result);
  };
  
  const tabs = [
    { id: 'quick' as TabType, label: '智选模式', icon: Zap, desc: '快速智能匹配' },
    { id: 'deep' as TabType, label: '智研模式', icon: Search, desc: '深度分析研究' },
    { id: 'advisor' as TabType, label: '智能顾问', icon: MessageSquare, desc: 'AI对话咨询' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  智能选校 Agent
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  AI驱动的智能选校决策系统 · 精准匹配你的理想院校
                </p>
              </div>
            </div>
            
            {/* 统计信息 */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{schools.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">院校数据</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{programs.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">专业数据</div>
              </div>
            </div>
          </div>
          
          {/* 标签页导航 */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-sm font-semibold">{tab.label}</div>
                      {isActive && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {tab.desc}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 条件输入区(通用) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              筛选条件
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">填写你的背景信息</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 国家 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                目标国家
              </label>
              <select
                value={criteria.countries[0] || ''}
                onChange={(e) => setCriteria({ ...criteria, countries: [e.target.value] })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">选择国家</option>
                <option value="英国">英国</option>
                <option value="美国">美国</option>
                <option value="澳大利亚">澳大利亚</option>
                <option value="加拿大">加拿大</option>
                <option value="新加坡">新加坡</option>
                <option value="香港">香港</option>
              </select>
            </div>
            
            {/* 专业 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                专业方向
              </label>
              <input
                type="text"
                value={criteria.majors[0] || ''}
                onChange={(e) => setCriteria({ ...criteria, majors: [e.target.value] })}
                placeholder="如: 计算机、金融..."
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* GPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GPA (满分4.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={criteria.gpa || ''}
                onChange={(e) => setCriteria({ ...criteria, gpa: parseFloat(e.target.value) })}
                placeholder="如: 3.5"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* 预算范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                预算下限 (人民币/年)
              </label>
              <input
                type="number"
                value={criteria.budgetMin || ''}
                onChange={(e) => setCriteria({ ...criteria, budgetMin: parseInt(e.target.value) })}
                placeholder="如: 200000"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                预算上限 (人民币/年)
              </label>
              <input
                type="number"
                value={criteria.budgetMax || ''}
                onChange={(e) => setCriteria({ ...criteria, budgetMax: parseInt(e.target.value) })}
                placeholder="如: 400000"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* 学历层次 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                学历层次
              </label>
              <select
                value={criteria.degreeLevel}
                onChange={(e) => setCriteria({ ...criteria, degreeLevel: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="bachelor">本科</option>
                <option value="master">硕士</option>
                <option value="phd">博士</option>
                <option value="diploma">文凭课程</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* 内容区 */}
        {activeTab === 'quick' && (
          <QuickMatchMode
            criteria={criteria}
            strategy={strategy}
            onStrategyChange={setStrategy}
            onGenerate={handleQuickMatch}
            results={quickResults}
            loading={loading}
            onLockResult={handleLockResult}
            onEnterDeepMode={handleEnterDeepMode}
          />
        )}
        
        {activeTab === 'deep' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              智研模式 - 开发中
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              深度分析功能即将推出,敬请期待
            </p>
          </div>
        )}
        
        {activeTab === 'advisor' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              智能顾问 - 开发中
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI对话功能即将推出,敬请期待
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSchoolSelectionPage;

