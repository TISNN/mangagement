import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  BookOpen,
  GraduationCap,
  Target,
  Heart,
  Edit3,
  Save,
  X,
  FileText,
  Download,
  Share2,
  Clock,
  Users,
  Building,
  Award
} from 'lucide-react';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  type: 'progress' | 'requirement' | 'contact' | 'other';
}

const ProgramDetailPage: React.FC = () => {
  const { schoolId, programId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('progress');
  const [notes, setNotes] = useState<Note[]>([]);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // 模拟获取学校和项目数据
  const program = {
    id: programId,
    name: '计算机科学',
    degree: '理学硕士',
    duration: '2年',
    description: '斯坦福大学的计算机科学专业是全美最顶尖的项目之一，专注于人工智能、机器学习和软件工程等领域。',
    deadline: '2024-12-15',
    tuition: '$55,000/年',
    requirements: [
      { type: 'GRE', value: '320+' },
      { type: 'TOEFL', value: '100+' },
      { type: 'GPA', value: '3.5+' },
      { type: '推荐信', value: '3封' },
      { type: '工作经验', value: '2年以上优先' }
    ],
    courses: [
      '高级算法分析',
      '机器学习',
      '人工智能',
      '分布式系统',
      '计算机视觉'
    ],
    careers: [
      '软件工程师',
      '研究科学家',
      '技术主管',
      '创业者'
    ],
    faculty: [
      { name: 'John Smith', title: '教授', research: 'AI和机器学习' },
      { name: 'Sarah Johnson', title: '副教授', research: '计算机视觉' }
    ],
    statistics: {
      acceptance_rate: '8%',
      enrolled: 120,
      international: '35%',
      employment_rate: '95%'
    }
  };

  const school = {
    id: schoolId,
    name: 'Stanford University',
    location: 'California, USA',
    ranking: '#2',
    website: 'https://www.stanford.edu',
    description: 'Stanford University是世界顶尖的研究型大学，以其创新和创业精神闻名。'
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    
    setNotes([
      ...notes,
      {
        id: Date.now().toString(),
        content: noteContent,
        timestamp: new Date(),
        type: noteType
      }
    ]);
    setNoteContent('');
    setIsEditing(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleGenerateReport = () => {
    // TODO: 实现报告生成功能
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* 返回按钮和标题 */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/school-assistant')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>返回选校助手</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：项目详情 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 学校信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold dark:text-white mb-2">{school.name}</h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{school.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>排名 {school.ranking}</span>
                  </div>
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    <span>访问官网</span>
                  </a>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">{school.description}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Heart className="h-6 w-6 text-red-500" />
              </button>
            </div>
          </div>

          {/* 项目信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold dark:text-white mb-4">{program.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <GraduationCap className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">学位</div>
                <div className="font-medium dark:text-white">{program.degree}</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">学制</div>
                <div className="font-medium dark:text-white">{program.duration}</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">申请截止</div>
                <div className="font-medium dark:text-white">{program.deadline}</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-orange-600 mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">学费</div>
                <div className="font-medium dark:text-white">{program.tuition}</div>
              </div>
            </div>

            <div className="space-y-6">
              {/* 项目描述 */}
              <div>
                <h3 className="text-lg font-medium dark:text-white mb-2">项目介绍</h3>
                <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
              </div>

              {/* 申请要求 */}
              <div>
                <h3 className="text-lg font-medium dark:text-white mb-3">申请要求</h3>
                <div className="flex flex-wrap gap-3">
                  {program.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2"
                    >
                      <span className="text-gray-600 dark:text-gray-300">{req.type}:</span>
                      <span className="font-medium dark:text-white">{req.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 课程设置 */}
              <div>
                <h3 className="text-lg font-medium dark:text-white mb-3">核心课程</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {program.courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">{course}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 就业方向 */}
              <div>
                <h3 className="text-lg font-medium dark:text-white mb-3">就业方向</h3>
                <div className="flex flex-wrap gap-3">
                  {program.careers.map((career, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg"
                    >
                      {career}
                    </div>
                  ))}
                </div>
              </div>

              {/* 师资力量 */}
              <div>
                <h3 className="text-lg font-medium dark:text-white mb-3">师资力量</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.faculty.map((faculty, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="font-medium dark:text-white">{faculty.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{faculty.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        研究方向：{faculty.research}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 项目数据 */}
              <div>
                <h3 className="text-lg font-medium dark:text-white mb-3">项目数据</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {program.statistics.acceptance_rate}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">录取率</div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {program.statistics.enrolled}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">录取人数</div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <Globe className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {program.statistics.international}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">国际生比例</div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <Building className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {program.statistics.employment_rate}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">就业率</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：备注和操作 */}
        <div className="space-y-6">
          {/* 优先级设置 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-medium dark:text-white mb-4">申请优先级</h3>
            <div className="flex gap-3">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                    priority === p
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                </button>
              ))}
            </div>
          </div>

          {/* 备注列表 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium dark:text-white">申请备注</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Edit3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {isEditing && (
              <div className="mb-4 space-y-4">
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as Note['type'])}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700"
                >
                  <option value="progress">申请进度</option>
                  <option value="requirement">申请材料</option>
                  <option value="contact">联系记录</option>
                  <option value="other">其他</option>
                </select>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="添加备注..."
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    保存
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {note.timestamp.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      note.type === 'progress'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : note.type === 'requirement'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : note.type === 'contact'
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {note.type === 'progress' ? '进度'
                        : note.type === 'requirement' ? '材料'
                        : note.type === 'contact' ? '联系'
                        : '其他'
                      }
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="space-y-3">
              <button
                onClick={handleGenerateReport}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <FileText className="h-5 w-5" />
                <span>生成申请报告</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <Download className="h-5 w-5" />
                <span>下载项目介绍</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <Share2 className="h-5 w-5" />
                <span>分享</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage; 