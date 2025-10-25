/**
 * 申请详情页 - 显示单个学生的完整申请档案
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Loader2, 
  AlertCircle, 
  User,
  Calendar as CalendarIcon,
  School,
  FileText, 
  TrendingUp
} from 'lucide-react';
import { useStudentApplication } from './ApplicationProgress/hooks/useApplications';
import EditableProfileSection from './ApplicationProgress/components/EditableProfileSection';
import MeetingList from './ApplicationProgress/components/MeetingList';
import UniversityChoiceList from './ApplicationProgress/components/UniversityChoiceList';
import DocumentChecklist from './ApplicationProgress/components/DocumentChecklist';
import ProgressBar from './ApplicationProgress/components/ProgressBar';
import { studentProfileService, studentMeetingService, universityChoiceService } from './ApplicationProgress/services/applicationService';
import { StudentProfile, StudentMeeting, FinalUniversityChoice, UniversityChoiceForm } from './ApplicationProgress/types';

function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'meetings' | 'schools' | 'documents'>('profile');

  const {
    profile,
    meetings,
    choices,
    documents,
    overview,
    loading,
    error,
    reload
  } = useStudentApplication(id ? Number(id) : null);

  // 保存学生档案
  const handleSaveProfile = async (updates: Partial<StudentProfile>) => {
    if (!id) return;
    
    try {
      await studentProfileService.updateProfile(Number(id), updates);
      // 重新加载数据
      await reload();
      alert('保存成功!');
      } catch (error) {
      console.error('保存失败:', error);
      throw error;
    }
  };

  // 添加会议记录
  const handleAddMeeting = async (meeting: Partial<StudentMeeting>) => {
    if (!id) return;
    
    try {
      await studentMeetingService.createMeeting(meeting as any);
      // 重新加载数据
      await reload();
      alert('会议记录添加成功!');
    } catch (error) {
      console.error('添加会议记录失败:', error);
      throw error;
    }
  };

  // 添加选校记录
  const handleAddChoice = async (choice: Partial<FinalUniversityChoice>) => {
    if (!id) return;
    try {
      await universityChoiceService.createChoice(choice as UniversityChoiceForm);
      await reload();
      alert('添加成功!');
    } catch (error) {
      console.error('添加选校失败:', error);
      throw error;
    }
  };

  // 如果没有id,返回列表页
  useEffect(() => {
    if (!id) {
      navigate('/admin/applications');
    }
  }, [id, navigate]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">加载申请详情中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="p-6">
        <Link 
          to="/admin/applications"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回申请列表
        </Link>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">加载失败</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
              <button 
              onClick={reload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
              重新加载
              </button>
            </div>
          </div>
      </div>
    );
  }

  // 无数据状态
  if (!overview) {
    return (
      <div className="p-6">
        <Link 
          to="/admin/applications"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回申请列表
        </Link>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到申请记录</h3>
            <p className="text-gray-500 dark:text-gray-400">无法找到该学生的申请信息</p>
            </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: '学生档案', icon: User, count: profile ? 1 : 0 },
    { id: 'meetings' as const, label: '会议记录', icon: CalendarIcon, count: meetings.length },
    { id: 'schools' as const, label: '选校列表', icon: School, count: choices.length },
    { id: 'documents' as const, label: '材料清单', icon: FileText, count: documents.length }
  ];

  // 跳转到选校规划页
  const handleViewPlanning = () => {
    navigate(`/admin/applications/${id}/planning`);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 返回按钮 */}
      <Link 
        to="/admin/applications"
        className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        返回申请列表
      </Link>

      {/* 头部信息卡片 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={overview.student_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${overview.student_name}`}
              alt={overview.student_name}
              className="h-16 w-16 rounded-xl object-cover border-2 border-white/30"
            />
        <div>
              <h1 className="text-2xl font-bold mb-1">{overview.student_name}</h1>
              <p className="text-blue-100 text-sm">学生ID: {overview.student_id}</p>
              {overview.mentor_name && (
                <p className="text-blue-100 text-sm mt-1">负责导师: {overview.mentor_name}</p>
              )}
      </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-2xl font-bold">{overview.overall_progress}%</span>
            </div>
            <p className="text-blue-100 text-sm">总体进度</p>
                  </div>
                </div>

        {/* 统计摘要 */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{overview.total_applications}</div>
            <div className="text-blue-100 text-xs">申请总数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{overview.submitted_applications}</div>
            <div className="text-blue-100 text-xs">已提交</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{overview.accepted_applications}</div>
            <div className="text-blue-100 text-xs">已录取</div>
            </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{overview.pending_applications}</div>
            <div className="text-blue-100 text-xs">待处理</div>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">申请阶段</h2>
        <ProgressBar progress={overview.overall_progress} />
      </div>

      {/* 标签页导航 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.count}
                        </span>
                      )}
              </button>
            );
          })}
            </div>

        {/* 标签页内容 */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <EditableProfileSection 
              profile={profile} 
              studentId={Number(id)}
              onSave={handleSaveProfile}
            />
          )}
          {activeTab === 'meetings' && (
            <MeetingList 
              meetings={meetings} 
              studentId={Number(id)}
              onAddMeeting={handleAddMeeting}
            />
          )}
          {activeTab === 'schools' && (
            <div className="space-y-4">
              {choices.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleViewPlanning}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
                  >
                    <School className="h-4 w-4" />
                    查看完整选校规划
                    </button>
                </div>
              )}
              <UniversityChoiceList 
                choices={choices} 
                studentId={Number(id)}
                onAddChoice={handleAddChoice}
              />
            </div>
          )}
          {activeTab === 'documents' && <DocumentChecklist documents={documents} />}
            </div>
          </div>

      {/* 紧急提醒 */}
      {overview.urgent_tasks && overview.urgent_tasks.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                紧急任务提醒
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                有 {overview.urgent_tasks.length} 个材料即将到期,请尽快处理
              </p>
              <button
                onClick={() => setActiveTab('documents')}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                查看材料清单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationDetailPage; 
