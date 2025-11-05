/**
 * Dashboard 主页面（重构版）
 * 使用数据库数据，模块化组件结构
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Briefcase, MessageSquare, CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';

// Hooks
import { useDashboardData } from './hooks/useDashboardData';
import { useCurrentUser } from './hooks/useCurrentUser';

// Components
import { SearchHeader } from './components/SearchHeader';
import { StatsCards } from './components/StatsCards';
import { QuickActions } from './components/QuickActions';
import { TasksPanel } from './components/TasksPanel';
import { ActivityPanel } from './components/ActivityPanel';
import { EventsPanel } from './components/EventsPanel';
import { CreateStudentModal } from './components/QuickActionsModal/CreateStudentModal';
import { CreateTaskModal } from './components/QuickActionsModal/CreateTaskModal';
import { CreateLeadModal } from './components/QuickActionsModal/CreateLeadModal';
import CreateMeetingModal from '../MeetingManagement/components/CreateMeetingModal';
import { createMeeting } from '../MeetingManagement/services/meetingService';
import type { MeetingFormData } from '../MeetingManagement/types';

// Types
import { QuickAction } from './types/dashboard.types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const {
    stats,
    tasks,
    activities,
    events,
    loading,
    error,
    handleToggleTask,
    refreshStats,
    refreshActivities,
  } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState('');
  
  // 模态框状态
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false);
  const [showCreateMeetingModal, setShowCreateMeetingModal] = useState(false);

  // 获取时间问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 17) return '下午好';
    if (hour < 19) return '傍晚好';
    if (hour < 22) return '晚上好';
    return '夜深了';
  };

  // 获取时间段提示语
  const getTimeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '注意休息，保持健康';
    if (hour < 9) return '祝您开启愉快的一天';
    if (hour < 12) return '工作顺利，加油!';
    if (hour < 14) return '记得吃午饭哦';
    if (hour < 17) return '继续保持高效!';
    if (hour < 19) return '辛苦了一天';
    if (hour < 22) return '今天工作完成得如何?';
    return '早点休息，明天更美好';
  };

  // 成功回调
  const handleStudentCreated = () => {
    toast.success('学生添加成功！');
    refreshStats();
    refreshActivities();
  };

  const handleTaskCreated = () => {
    toast.success('任务创建成功！');
    refreshActivities();
  };

  const handleLeadCreated = () => {
    toast.success('线索新增成功！');
    refreshStats();
    refreshActivities();
  };

  const handleMeetingCreated = async (formData: MeetingFormData) => {
    try {
      if (!currentUser?.id) {
        toast.error('用户信息获取失败');
        return;
      }
      await createMeeting(formData, currentUser.id);
      toast.success('会议创建成功！');
      setShowCreateMeetingModal(false);
      refreshActivities();
    } catch (error) {
      console.error('创建会议失败:', error);
      toast.error('创建会议失败，请重试');
      throw error;
    }
  };

  // 快捷操作配置
  const quickActions: QuickAction[] = useMemo(() => [
    { 
      title: '添加学生', 
      icon: UserPlus, 
      color: 'blue', 
      onClick: () => setShowCreateStudentModal(true),
      description: '快速添加新学生'
    },
    { 
      title: '快速创建任务', 
      icon: Briefcase, 
      color: 'purple', 
      onClick: () => setShowCreateTaskModal(true),
      description: '创建新的待办任务'
    },
    { 
      title: '新增线索', 
      icon: MessageSquare, 
      color: 'orange', 
      onClick: () => setShowCreateLeadModal(true),
      description: '添加潜在客户线索'
    },
    { 
      title: '创建会议', 
      icon: CalendarPlus, 
      color: 'green', 
      onClick: () => setShowCreateMeetingModal(true),
      description: '快速创建新会议'
    },
  ], []);

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部欢迎语 + 全局搜索 */}
      <SearchHeader
        userName={currentUser?.name || '用户'}
        greeting={getGreeting()}
        timeMessage={getTimeMessage()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 关键数据统计卡片 */}
      <StatsCards stats={stats} loading={loading} />

      {/* 快捷操作 */}
      <QuickActions actions={quickActions} />
      
      {/* 主要内容区域 - 三栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 任务与提醒 */}
        <TasksPanel
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onViewAll={() => navigate('/admin/tasks')}
          loading={loading}
        />
        
        {/* 最新动态 */}
        <ActivityPanel
          activities={activities}
          loading={loading}
        />
        
        {/* 即将到来的日程 */}
        <EventsPanel
          events={events}
          loading={loading}
        />
      </div>

      {/* 快捷操作模态框 */}
      <CreateStudentModal
        isOpen={showCreateStudentModal}
        onClose={() => setShowCreateStudentModal(false)}
        onSuccess={handleStudentCreated}
      />

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSuccess={handleTaskCreated}
      />

      <CreateLeadModal
        isOpen={showCreateLeadModal}
        onClose={() => setShowCreateLeadModal(false)}
        onSuccess={handleLeadCreated}
      />

      {showCreateMeetingModal && (
        <CreateMeetingModal
          onClose={() => setShowCreateMeetingModal(false)}
          onSave={handleMeetingCreated}
        />
      )}
    </div>
  );
};

export default DashboardPage;

