import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Download,
  Plus,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStudentSelections, SchoolPlanningRecord, SchoolPlan } from '../../services/schoolPlanningService';

interface ApplicationDetailPageProps {
  setCurrentPage?: (page: string) => void;
  studentId?: number;
}

function ApplicationDetailPage({ setCurrentPage, studentId = 1 }: ApplicationDetailPageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // 最近的选校记录
  const [recentSelection, setRecentSelection] = useState<{
    id: string;
    name: string;
    date: string;
  } | null>(null);

  // 选校规划记录数据
  const [schoolPlanningRecords] = useState<SchoolPlanningRecord[]>([
    {
      id: 1,
      date: '2024-03-01',
      title: '初次选校规划',
      version: 'V1.0',
      planner: '王老师',
      description: '根据学生背景进行首次选校规划，确定英国作为主要申请国家',
      schools: [
        {
          school: '伦敦大学学院',
          program: '计算机科学 本科',
          type: '冲刺院校',
          status: 'pending',
          requirements: {
            gpa: '85+',
            ielts: '7.0 (各单项不低于6.5)',
            deadline: '2024-05-15',
            preferences: [
              '较强的数学和编程基础',
              '计算机相关竞赛获奖经历',
              '相关研究或项目经验',
              '课外活动领导力表现'
            ]
          },
          notes: '建议申请时强调编程竞赛经历和数学能力，准备针对性推荐信'
        },
        {
          school: '曼彻斯特大学',
          program: '计算机科学 本科',
          type: '目标院校',
          status: 'pending',
          requirements: {
            gpa: '80+',
            ielts: '6.5 (各单项不低于6.0)',
            deadline: '2024-06-30',
            preferences: [
              '良好的数理基础',
              '编程相关实践经验',
              '团队合作能力',
              '创新思维能力'
            ]
          },
          notes: '符合学生背景，有较高把握，需做好文书准备'
        },
        {
          school: '利兹大学',
          program: '计算机科学 本科',
          type: '保底院校',
          status: 'pending',
          requirements: {
            gpa: '75+',
            ielts: '6.0 (各单项不低于5.5)',
            deadline: '2024-07-15',
            preferences: [
              '基础的数学能力',
              '对计算机科学的浓厚兴趣',
              '良好的学习态度',
              '基础编程知识'
            ]
          },
          notes: '安全院校，较大把握可录取'
        }
      ]
    },
    {
      id: 2,
      date: '2024-03-15',
      title: '选校方案调整',
      version: 'V2.0',
      planner: '王老师',
      description: '根据学生最新雅思成绩和GPA情况，调整选校方案，增加爱丁堡大学作为备选',
      schools: [
        {
          school: '伦敦大学学院',
          program: '计算机科学 本科',
          type: '冲刺院校',
          status: 'pending',
          requirements: {
            gpa: '85+',
            ielts: '7.0 (各单项不低于6.5)',
            deadline: '2024-05-15',
            preferences: [
              '较强的数学和编程基础',
              '计算机相关竞赛获奖经历',
              '相关研究或项目经验',
              '课外活动领导力表现'
            ]
          },
          notes: '与学生背景匹配度提升，推荐保持首选'
        },
        {
          school: '爱丁堡大学',
          program: '计算机科学 本科',
          type: '目标院校',
          status: 'pending',
          requirements: {
            gpa: '82+',
            ielts: '6.5 (各单项不低于6.0)',
            deadline: '2024-06-15',
            preferences: [
              '扎实的数理基础',
              '创新能力与批判性思维',
              '团队合作能力',
              '对技术前沿的关注'
            ]
          },
          notes: '新增院校，项目设置更符合学生兴趣'
        },
        {
          school: '曼彻斯特大学',
          program: '计算机科学 本科',
          type: '目标院校',
          status: 'pending',
          requirements: {
            gpa: '80+',
            ielts: '6.5 (各单项不低于6.0)',
            deadline: '2024-06-30',
            preferences: [
              '良好的数理基础',
              '编程相关实践经验',
              '团队合作能力',
              '创新思维能力'
            ]
          },
          notes: '保持申请，建议加强课外项目经历'
        },
        {
          school: '利兹大学',
          program: '计算机科学 本科',
          type: '保底院校',
          status: 'pending',
          requirements: {
            gpa: '75+',
            ielts: '6.0 (各单项不低于5.5)',
            deadline: '2024-07-15',
            preferences: [
              '基础的数学能力',
              '对计算机科学的浓厚兴趣',
              '良好的学习态度',
              '基础编程知识'
            ]
          },
          notes: '安全院校，维持原方案'
        }
      ]
    },
    {
      id: 3,
      date: '2024-04-02',
      title: '最终选校方案',
      version: 'V3.0',
      planner: '李老师',
      description: '结合学生最新背景和院校特点，确定最终申请名单',
      schools: [
        {
          school: '伦敦大学学院',
          program: '计算机科学 本科',
          type: '冲刺院校',
          requirements: {
            gpa: '85+',
            ielts: '7.0 (各单项不低于6.5)',
            deadline: '2024-05-15',
            preferences: [
              '较强的数学和编程基础',
              '计算机相关竞赛获奖经历',
              '相关研究或项目经验',
              '课外活动领导力表现'
            ]
          },
          status: 'current',
          notes: '最终确定为首选院校，目前正在准备申请材料'
        },
        {
          school: '爱丁堡大学',
          program: '计算机科学 本科',
          type: '目标院校',
          requirements: {
            gpa: '82+',
            ielts: '6.5 (各单项不低于6.0)',
            deadline: '2024-06-15',
            preferences: [
              '扎实的数理基础',
              '创新能力与批判性思维',
              '团队合作能力',
              '对技术前沿的关注'
            ]
          },
          status: 'pending',
          notes: '确定为第二志愿，准备专门的个人陈述'
        },
        {
          school: '曼彻斯特大学',
          program: '计算机科学 本科',
          type: '目标院校',
          requirements: {
            gpa: '80+',
            ielts: '6.5 (各单项不低于6.0)',
            deadline: '2024-06-30',
            preferences: [
              '良好的数理基础',
              '编程相关实践经验',
              '团队合作能力',
              '创新思维能力'
            ]
          },
          status: 'pending',
          notes: '确定为第三志愿，准备论述对英国教育的向往'
        }
      ]
    }
  ]);
  
  // 加载学生的选校方案
  useEffect(() => {
    const loadStudentSelections = async () => {
      if (!studentId) return;
      
      try {
        setIsLoading(true);
        // 获取学生的选校方案
        const selections = await getStudentSelections(studentId);
        
        // 如果有选校方案，获取最新的一个
        if (selections.length > 0) {
          const latest = selections.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          
          setRecentSelection({
            id: latest.id,
            name: latest.name,
            date: new Date(latest.timestamp).toLocaleDateString('zh-CN')
          });
        }
        
        // 这里可以添加同步数据库中的选校规划记录的逻辑
        // 实际项目中应该从API获取
      } catch (error) {
        console.error('加载学生选校方案失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudentSelections();
  }, [studentId]);

  // 规划历史区域
  const PlanningHistory = () => {
    const navigate = useNavigate();
    
    // 存储选中的规划ID
    const handlePlanningClick = (planId: number) => {
      localStorage.setItem('selectedPlanningId', planId.toString());
      navigate('/admin/applications/planning-detail');
    };

    // 打开选校助手
    const openSchoolAssistant = () => {
      navigate('/admin/school-assistant');
    };
    
    return (
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">选校规划记录</h2>
          
          <button 
            onClick={openSchoolAssistant}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Plus className="h-4 w-4" />
            创建新选校方案
          </button>
        </div>
        
        {/* 显示最近从选校助手同步的选校方案 */}
        {recentSelection && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900/30 dark:text-green-300">
                    新同步
                  </span>
                  <h3 className="font-medium dark:text-white">{recentSelection.name}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  同步日期: {recentSelection.date}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button 
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                onClick={openSchoolAssistant}
              >
                查看详情
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* 原有规划记录保持不变 */}
          {[...schoolPlanningRecords].reverse().map((record) => (
            <div 
              key={record.id}
              onClick={() => handlePlanningClick(record.id)}
              className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                record.id === 3 
                  ? 'bg-blue-50 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30 dark:hover:bg-blue-900/20' 
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium dark:text-white">{record.title}</h3>
                    {record.id === 3 && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900/30 dark:text-green-300">
                        最终方案
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    规划老师: {record.planner} | {record.date}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  record.id === 3
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {record.version}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                {record.description}
              </p>
              <div className="flex justify-end mt-3">
                <div className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                  查看详情
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Evan的申请</h1>
        </div>
        <div className="flex gap-4">
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            导出申请
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            编辑申请
          </button>
        </div>
      </div>

      {/* 申请进度追踪 - 调整为全宽 */}
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">申请进度追踪</h3>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">60% 完成</span>
          </div>
          
          {/* 进度阶段和进度条 */}
          <div className="relative">
            {/* 进度条背景 */}
            <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700">
              <div 
                className="absolute left-0 h-2 bg-blue-600 rounded-full dark:bg-blue-500"
                style={{ width: '60%' }}
              />
            </div>

            {/* 进度节点 */}
            <div className="flex justify-between mt-2">
              {[
                { label: '材料准备', progress: 20, status: 'completed' },
                { label: '文书撰写', progress: 40, status: 'completed' },
                { label: '材料提交', progress: 60, status: 'current' },
                { label: '面试准备', progress: 80, status: 'pending' },
                { label: '录取结果', progress: 100, status: 'pending' }
              ].map((stage, index) => (
                <div key={index} className="relative flex flex-col items-center" style={{ width: '20%' }}>
                  {/* 节点标记 */}
                  <div 
                    className={`absolute -top-3 w-4 h-4 rounded-full border-2 ${
                      stage.status === 'completed'
                        ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                        : stage.status === 'current'
                        ? 'bg-white border-blue-600 dark:border-blue-500'
                        : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                    }`}
                    style={{ left: 'calc(50% - 0.5rem)' }}
                  />
                  
                  {/* 阶段标签 */}
                  <div className="mt-4 text-center">
                    <span className={`text-sm font-medium ${
                      stage.status === 'completed' || stage.status === 'current'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {stage.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stage.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧主要内容 */}
        <div className="col-span-2 space-y-6">
          {/* 选校规划 */}
          <PlanningHistory />

          {/* 申请进度 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-6 dark:text-white">申请进度</h2>
            <div className="space-y-8">
              {[
                { 
                  title: '个人信息',
                  status: 'completed',
                  date: '2024-03-01',
                  description: '基本信息已完善'
                },
                {
                  title: '学术背景',
                  status: 'completed',
                  date: '2024-03-05',
                  description: '成绩单和学历证明已上传'
                },
                {
                  title: '语言成绩',
                  status: 'current',
                  date: '2024-03-10',
                  description: '雅思成绩单待补充'
                },
                {
                  title: '文书材料',
                  status: 'pending',
                  date: null,
                  description: '个人陈述待撰写'
                },
                {
                  title: '在线提交',
                  status: 'pending',
                  date: null,
                  description: '等待材料齐全后提交'
                }
              ].map((step, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* 时间线 */}
                  <div className="absolute left-6 top-10 bottom-0 w-px bg-gray-100 dark:bg-gray-700" />
                  
                  {/* 状态图标 */}
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : step.status === 'current'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-50 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : step.status === 'current' ? (
                      <Clock className="h-6 w-6" />
                    ) : (
                      <AlertCircle className="h-6 w-6" />
                    )}
                  </div>

                  {/* 步骤内容 */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium dark:text-white">{step.title}</h3>
                      {step.date && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {step.date}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 申请材料 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">申请材料</h2>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400">
                <Plus className="h-4 w-4" />
                上传文件
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: '本科成绩单.pdf',
                  size: '2.5MB',
                  date: '2024-03-01',
                  status: 'verified'
                },
                {
                  name: '学位证书.pdf',
                  size: '1.8MB',
                  date: '2024-03-05',
                  status: 'verified'
                },
                {
                  name: '个人陈述.docx',
                  size: '568KB',
                  date: '2024-03-10',
                  status: 'draft'
                }
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{file.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {file.size} · {file.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'verified' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        已验证
                      </span>
                    )}
                    {file.status === 'draft' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                        草稿
                      </span>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧信息栏 */}
        <div className="space-y-6">
          {/* 申请信息 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">申请信息</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">申请项目</span>
                <p className="mt-1 dark:text-white">计算机科学 本科</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">申请学校</span>
                <p className="mt-1 dark:text-white">伦敦大学学院</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">申请截止日期</span>
                <p className="mt-1 dark:text-white">2024-05-15</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">负责导师</span>
                <p className="mt-1 dark:text-white">刘老师</p>
              </div>
            </div>
          </div>

          {/* 申请记录 - 改进版 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">申请记录</h2>
            <div className="space-y-6">
              {[
                {
                  date: '2024-03-15',
                  records: [
                    {
                      time: '14:30',
                      action: '提交了雅思成绩单',
                      user: 'Evan',
                      type: 'document',
                      detail: 'Overall: 7.0 (L:7.0, R:7.0, W:6.5, S:7.0)'
                    },
                    {
                      time: '10:15',
                      action: '完成文书修改',
                      user: '刘老师',
                      type: 'review',
                      detail: '个人陈述第三稿完成修改，重点突出了学术背景和研究兴趣'
                    }
                  ]
                },
                {
                  date: '2024-03-10',
                  records: [
                    {
                      time: '16:45',
                      action: '上传推荐信',
                      user: 'Evan',
                      type: 'document',
                      detail: '上传了来自王教授的学术推荐信'
                    },
                    {
                      time: '09:30',
                      action: '文书指导会议',
                      user: '刘老师',
                      type: 'meeting',
                      detail: '讨论个人陈述修改方向，建议加强学术背景描述'
                    }
                  ]
                },
                {
                  date: '2024-03-05',
                  records: [
                    {
                      time: '15:20',
                      action: '确认选校方案',
                      user: '系统',
                      type: 'milestone',
                      detail: '确定UCL为首选院校，完成三所院校的申请规划'
                    }
                  ]
                },
                {
                  date: '2024-03-01',
                  records: [
                    {
                      time: '09:00',
                      action: '开始申请',
                      user: '系统',
                      type: 'milestone',
                      detail: '创建申请档案，开始UCL计算机科学本科申请'
                    }
                  ]
                }
              ].map((day, dayIndex) => (
                <div key={dayIndex}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {day.date}
                    </span>
                    <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700" />
                  </div>
                  <div className="space-y-4">
                    {day.records.map((record, recordIndex) => (
                      <div key={recordIndex} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          record.type === 'document'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : record.type === 'review'
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                            : record.type === 'meeting'
                            ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium dark:text-white">{record.action}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {record.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {record.detail}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            操作人: {record.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailPage; 