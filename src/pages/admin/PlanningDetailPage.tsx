import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  Download,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { SchoolPlan, SchoolPlanningRecord } from './ApplicationDetailPage';
import { Link, useNavigate } from 'react-router-dom';

interface PlanningDetailPageProps {
  setCurrentPage: (page: string) => void;
}

// 模拟的规划数据
const planningRecordsData: SchoolPlanningRecord[] = [
  {
    id: 1,
    date: '2024-03-01',
    title: '初次选校规划',
    planner: '王老师',
    description: '根据学生背景进行首次选校规划，确定英国作为主要申请国家',
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
        notes: '建议申请时强调编程竞赛经历和数学能力，准备针对性推荐信'
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
        notes: '符合学生背景，有较高把握，需做好文书准备'
      },
      {
        school: '利兹大学',
        program: '计算机科学 本科',
        type: '保底院校',
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
    planner: '王老师',
    description: '根据学生最新雅思成绩和GPA情况，调整选校方案，增加爱丁堡大学作为备选',
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
        notes: '与学生背景匹配度提升，推荐保持首选'
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
        notes: '新增院校，项目设置更符合学生兴趣'
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
        notes: '保持申请，建议加强课外项目经历'
      },
      {
        school: '利兹大学',
        program: '计算机科学 本科',
        type: '保底院校',
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
];

function PlanningDetailPage({ setCurrentPage }: PlanningDetailPageProps) {
  const [planningRecord, setPlanningRecord] = useState<SchoolPlanningRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 从localStorage中获取planningId
    const planningId = localStorage.getItem('selectedPlanningId');
    if (!planningId) {
      navigate('/admin/applications/detail');
      return;
    }
    
    // 模拟数据加载
    setTimeout(() => {
      // 这里应该是从API获取数据
      const mockPlanningData = {
        id: parseInt(planningId),
        title: `规划方案 ${planningId}`,
        date: '2023-11-15',
        version: `V${planningId}.0`,
        author: 'Sarah Johnson',
        status: parseInt(planningId) === 3 ? 'finalized' : 'draft',
        schools: [
          {
            school: '哥伦比亚大学',
            program: '计算机科学硕士',
            type: '冲刺院校',
            status: 'current',
            requirements: {
              gpa: '3.8+',
              ielts: '7.0+',
              deadline: '2023-12-15',
              preferences: ['研究经验', '相关实习', '编程技能']
            },
            notes: '需要强化研究背景，准备详细的研究计划。GRE分数需要在325以上。'
          },
          {
            school: '纽约大学',
            program: '人工智能硕士',
            type: '目标院校',
            status: 'pending',
            requirements: {
              gpa: '3.5+',
              ielts: '6.5+',
              deadline: '2024-01-10',
              preferences: ['项目经验', '技术背景', '数学能力']
            },
            notes: '竞争较大，需要强调AI相关的项目经验和研究兴趣。'
          },
          {
            school: '波士顿大学',
            program: '软件工程硕士',
            type: '保底院校',
            status: 'pending',
            requirements: {
              gpa: '3.3+',
              ielts: '6.5+',
              deadline: '2024-01-20',
              preferences: ['工作经验', '项目管理', '软件开发']
            },
            notes: '录取率相对较高，但需要展示软件开发的实际经验和项目成果。'
          }
        ],
        changes: [
          {
            type: '添加',
            content: '添加了波士顿大学作为保底选择'
          },
          {
            type: '修改',
            content: '调整了纽约大学的申请策略'
          },
          {
            type: '删除',
            content: '移除了UCB的申请计划'
          }
        ],
        comparison: {
          previous: '规划方案 2',
          added: ['波士顿大学软件工程硕士'],
          removed: ['UCB计算机科学硕士'],
          modified: ['纽约大学人工智能硕士申请策略']
        }
      };
      
      setPlanningRecord(mockPlanningData);
      setLoading(false);
    }, 800);
  }, [navigate]);

  // 返回申请详情页
  const handleBackToApplication = () => {
    setCurrentPage('applicationDetail');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!planningRecord) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="mb-4 text-red-500">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">无法加载规划记录</h2>
          <p className="text-gray-500 dark:text-gray-400">无法找到请求的规划记录或发生了错误。</p>
          <Link 
            to="/admin/applications/detail" 
            className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回申请详情
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* 返回按钮 */}
      <Link 
        to="/admin/applications/detail" 
        className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        返回申请详情
      </Link>
      
      {/* 标题和元数据 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold dark:text-white">{planningRecord.title}</h1>
              {planningRecord.id === 3 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  最终方案
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>{planningRecord.date}</span>
              <span className="inline-block w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              <span>创建人: {planningRecord.author}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              planningRecord.id === 3
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            }`}>
              {planningRecord.version}
            </span>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg">
              <Edit className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {planningRecord.id === 3 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">这是最终申请方案</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  此规划方案已被确定为申请人的最终院校申请计划。所有申请材料和流程将基于此方案执行。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2">
          <Edit className="h-4 w-4" />
          编辑规划
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center gap-2">
          <Download className="h-4 w-4" />
          导出规划
        </button>
        {planningRecord.id !== 3 && (
          <button className="px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 flex items-center gap-2">
            <Check className="h-4 w-4" />
            采用此方案
          </button>
        )}
      </div>
      
      {/* 变更对比 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">变更对比</h2>
        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            相较于 <span className="font-medium text-gray-700 dark:text-gray-300">{planningRecord.comparison.previous}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          {planningRecord.comparison.added.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 dark:bg-green-900/20">
                <span className="text-green-600 dark:text-green-400">+</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">新增</h3>
                <ul className="mt-1 space-y-1">
                  {planningRecord.comparison.added.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {planningRecord.comparison.removed.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 dark:bg-red-900/20">
                <span className="text-red-600 dark:text-red-400">-</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">移除</h3>
                <ul className="mt-1 space-y-1">
                  {planningRecord.comparison.removed.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {planningRecord.comparison.modified.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 dark:bg-yellow-900/20">
                <span className="text-yellow-600 dark:text-yellow-400">~</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">修改</h3>
                <ul className="mt-1 space-y-1">
                  {planningRecord.comparison.modified.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 院校列表 */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold dark:text-white">院校列表</h2>
        {planningRecord.schools.map((school, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-2xl p-6 dark:bg-gray-800 border ${
              planningRecord.id === 3 && school.status === 'current'
                ? 'border-blue-200 dark:border-blue-800 shadow-md shadow-blue-100 dark:shadow-none'
                : 'border-gray-100 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-lg dark:text-white">{school.school}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    school.type === '冲刺院校'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : school.type === '目标院校'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {school.type}
                  </span>
                  {school.status === 'current' && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      当前申请
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {school.program}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  截止日期: {school.requirements.deadline}
                </span>
                <button className="mt-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* 申请要求 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">申请要求</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">GPA要求</span>
                    <span className="font-medium dark:text-gray-300">{school.requirements.gpa}</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">语言要求</span>
                    <span className="font-medium dark:text-gray-300">{school.requirements.ielts}</span>
                  </div>
                </div>
              </div>

              {/* 招生偏好 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">招生偏好</h4>
                <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                  <div className="space-y-2">
                    {school.requirements.preferences.map((preference, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        <span>{preference}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 规划备注 */}
            {school.notes && (
              <div className={`mt-4 p-4 rounded-lg ${
                planningRecord.id === 3 && school.status === 'current'
                  ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  planningRecord.id === 3 && school.status === 'current'
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>规划备注</h4>
                <p className={`text-sm ${
                  planningRecord.id === 3 && school.status === 'current'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>{school.notes}</p>
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                查看详情
              </button>
              {planningRecord.id === 3 && school.status === 'current' ? (
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  当前申请中
                </button>
              ) : (
                <button className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                  将此院校添加到申请
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanningDetailPage; 