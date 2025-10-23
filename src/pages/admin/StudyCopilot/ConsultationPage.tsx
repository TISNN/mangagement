import React, { useState } from 'react';
import { Sparkles, Users, ChevronLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentProfileCard from './components/StudentProfileCard';
import CommunicationPanel from './components/CommunicationPanel';
import AIAssessmentPanel from './components/AIAssessmentPanel';
import ActionControlPanel from './components/ActionControlPanel';
import toast from 'react-hot-toast';

const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // 模拟学生数据
  const mockStudent = {
    name: '张晓畅',
    source: '官网咨询',
    status: '已沟通',
    school: '中国人民大学',
    major: '新闻学',
    gpa: '3.6',
    ranking: 'Top 20%',
    language: '雅思6.5',
    retakeDate: '2025年12月',
    targetCountries: ['英国', '新加坡', '香港'],
    targetMajor: '传媒/新闻',
    budget: '30-40万',
    enrollmentTime: '2025年9月',
    heat: 'high' as const,
    type: '硕士申请',
    matchScore: 85,
    potentialIndex: 78,
  };

  // 线索列表
  const leadsList = [
    { id: 1, name: '张晓畅', source: '官网', status: '已沟通', heat: 'high' },
    { id: 2, name: '李明', source: '小红书', status: '待沟通', heat: 'medium' },
    { id: 3, name: '王芳', source: '朋友推荐', status: '高意向', heat: 'high' },
  ];

  const handleAddNote = (content: string) => {
    console.log('添加沟通记录:', content);
    toast.success('记录已保存');
  };

  const handleGenerateReport = () => {
    toast.success('正在生成评估报告...');
    setTimeout(() => {
      toast.success('报告生成成功！');
    }, 1500);
  };

  const handleCreateTask = () => {
    toast.success('已创建后续跟进任务');
  };

  const handleSendReport = () => {
    toast.success('报告已发送到学生邮箱');
  };

  const handleConvert = () => {
    toast.success('线索状态已更新，进入CRM转化流程');
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/study-copilot')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              咨询评估 - AI智能助手
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              学生背景采集与初步评估
            </p>
          </div>
        </div>

        {/* 线索选择器 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>选择线索:</span>
          </div>
          <select
            value={selectedLead?.id || ''}
            onChange={(e) => {
              const lead = leadsList.find(l => l.id === parseInt(e.target.value));
              setSelectedLead(lead);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">选择学生线索</option>
            {leadsList.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name} - {lead.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：学生档案卡 */}
        <div className="col-span-12 lg:col-span-3">
          <StudentProfileCard student={mockStudent} />
        </div>

        {/* 右侧：工作区 */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* 沟通记录 */}
          <CommunicationPanel onAddNote={handleAddNote} />

          {/* AI评估 */}
          <AIAssessmentPanel onGenerateReport={handleGenerateReport} />
        </div>
      </div>

      {/* 底部：任务与转化控制台 */}
      <ActionControlPanel
        onCreateTask={handleCreateTask}
        onSendReport={handleSendReport}
        onConvert={handleConvert}
      />
    </div>
  );
};

export default ConsultationPage;

