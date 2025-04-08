import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, ExternalLink, MapPin, DollarSign, Clock, BookOpen, Search, User, ChevronRight, Award, Building, Users, FileText, Briefcase } from 'lucide-react';

// 定义类型
interface Program {
  id: string;
  name: string;
  degree: string;
  duration: string;
  description: string;
  requirements: string;
  employment: string;
  category?: string;
  subCategory?: string;
  applyDeadline?: string;
  tuition?: string;
  courses?: string[];
  facultyMembers?: {
    name: string;
    title: string;
    researchArea?: string;
  }[];
}

interface School {
  id: string;
  name: string;
  location: string;
  country?: string;
  region?: string;
  programs: Program[];
  acceptance: string;
  ranking: string;
  tuition: string;
  description: string;
  logoUrl?: string;
}

// 成功案例类型
interface SuccessCase {
  id: string;
  studentName: string;
  admissionYear: string;
  program: string;
  background: string;
  story: string;
  avatarUrl?: string;
}

const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [successCases, setSuccessCases] = useState<SuccessCase[]>([]);

  // 模拟从API获取专业和学校数据
  useEffect(() => {
    const fetchProgramDetail = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        // 在实际项目中，应该从后端获取数据
        const mockProgram: Program = {
          id: programId || '1',
          name: '计算机科学与技术',
          degree: '硕士学位',
          duration: '2年',
          description: '计算机科学与技术专业是研究计算机硬件、软件与应用的学科。该专业培养具备良好的数学基础和工程背景，掌握计算机系统基本理论和专业知识与技能，能从事计算机科学与技术领域的科学研究、教育、开发和应用的高级专门人才。课程涵盖算法设计、编程语言、软件工程、人工智能、数据科学、计算机图形学等领域。',
          requirements: '申请者需要具备计算机科学、数学或相关领域的本科学位，GPA 3.5以上，GRE成绩1300+，托福成绩100+或雅思成绩7.0+。工作经验不是必须的，但有相关实习或工作经验的申请者将获得优先考虑。',
          employment: '毕业生主要就业于科技公司、金融机构、研究机构和高校等。就业方向包括软件工程师、数据科学家、人工智能工程师、研究人员等。平均起薪约为85,000美元/年。',
          category: '工科',
          subCategory: '计算机科学',
          applyDeadline: '2024-12-15',
          tuition: '$45,000/年',
          courses: [
            '高级算法设计与分析',
            '机器学习基础',
            '分布式系统',
            '人工智能',
            '计算机视觉',
            '大数据分析',
            '高级软件工程',
            '云计算'
          ],
          facultyMembers: [
            {
              name: 'John Smith',
              title: '教授',
              researchArea: '机器学习、计算机视觉'
            },
            {
              name: 'Sarah Johnson',
              title: '副教授',
              researchArea: '人工智能、自然语言处理'
            },
            {
              name: 'Michael Chen',
              title: '助理教授',
              researchArea: '数据挖掘、推荐系统'
            },
            {
              name: 'Emily Wang',
              title: '研究员',
              researchArea: '分布式系统、云计算'
            }
          ]
        };
        
        const mockSchool: School = {
          id: '1',
          name: '麻省理工学院',
          location: '美国剑桥市',
          country: '美国',
          ranking: '1',
          acceptance: '4%',
          tuition: '$58,000/年',
          description: '麻省理工学院（MIT）是世界顶尖的研究型大学，以工程和物理科学闻名，但在经济学、政治学、城市研究、语言学和哲学等领域也有很强的实力。',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png',
          programs: []
        };
        
        setProgram(mockProgram);
        setSchool(mockSchool);
        
        // 设置模拟成功案例数据
        setSuccessCases([
          {
            id: '1',
            studentName: '张明',
            admissionYear: '2023',
            program: '计算机科学硕士',
            background: '背景：本科985计算机科学专业，GPA 3.8，托福110，GRE 325',
            story: '张明大学期间参与了多个开源项目，并在国内知名互联网公司实习。他的申请文书重点突出了他在算法优化方面的研究经历和贡献。'
          },
          {
            id: '2',
            studentName: '李华',
            admissionYear: '2022',
            program: '计算机科学硕士',
            background: '背景：本科211计算机科学专业，GPA 3.7，托福105，GRE 320',
            story: '李华本科期间积极参与各类编程比赛，并拥有丰富的项目经验。他申请时强调了自己在机器学习领域的实践经验和研究兴趣。'
          },
          {
            id: '3',
            studentName: '王芳',
            admissionYear: '2022',
            program: '计算机科学硕士',
            background: '背景：本科985软件工程专业，GPA 3.9，托福108，GRE 330',
            story: '王芳在校期间积极参与学术研究，发表了两篇与计算机视觉相关的论文。她的申请材料展示了扎实的理论基础和实践能力。'
          }
        ]);
        
      } catch (error) {
        console.error('获取专业详情失败', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetail();
  }, [programId]);

  // 跳转到案例库页面
  const goToCasesPage = () => {
    navigate('/admin/cases');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!program || !school) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">未找到专业信息</h2>
        <button 
          onClick={() => navigate('/admin/school-assistant')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          返回专业列表
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* 顶部大图背景 */}
      <div className="relative h-64 bg-gradient-to-r from-blue-800 to-blue-600 overflow-hidden">
        {/* 返回按钮 */}
        <button 
          onClick={() => navigate('/admin/school-assistant')}
          className="absolute top-6 left-6 p-2 bg-white/20 rounded-full z-10 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        
        {/* 专业基本信息 */}
        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end bg-gradient-to-t from-black/60 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{program.name}</h1>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">{program.degree}</div>
              <button className="flex items-center gap-1 bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30">
                <Heart className="h-4 w-4" />
                收藏
              </button>
            </div>
            <div className="flex items-center text-white/90 gap-4">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{school.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{school.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{program.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* 内容区域 */}
        <div className="flex flex-col space-y-6">
          {/* 学校信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                {school.logoUrl ? (
                  <img src={school.logoUrl} alt={school.name} className="w-12 h-12 object-contain" />
                ) : (
                  <div className="text-blue-500 font-bold text-xl">MIT</div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold dark:text-white">{school.name}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{school.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>排名 {school.ranking}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>录取率 {school.acceptance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>学费 {school.tuition}</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{school.description}</p>
                <div className="mt-3">
                  <button 
                    onClick={() => navigate(`/admin/school-detail/${school.id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    查看学校详情
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 专业信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold dark:text-white mb-4">专业详情</h2>
            
            {/* 基本信息 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学位类型</div>
                <div className="font-semibold dark:text-white">{program.degree}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学制</div>
                <div className="font-semibold dark:text-white">{program.duration}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">申请截止</div>
                <div className="font-semibold dark:text-white">{program.applyDeadline || '待定'}</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学费</div>
                <div className="font-semibold dark:text-white">{program.tuition || school.tuition}</div>
              </div>
            </div>
            
            {/* 专业描述 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold dark:text-white mb-2">专业介绍</h3>
              <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
            </div>
            
            {/* 申请要求 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold dark:text-white mb-2">申请要求</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">{program.requirements}</p>
              </div>
            </div>
            
            {/* 就业前景 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold dark:text-white mb-2">就业前景</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">{program.employment}</p>
              </div>
            </div>
            
            {/* 课程设置 */}
            {program.courses && program.courses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold dark:text-white mb-3">核心课程</h3>
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
            )}
            
            {/* 师资力量 */}
            {program.facultyMembers && program.facultyMembers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold dark:text-white mb-3">师资力量</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.facultyMembers.map((faculty, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium dark:text-white">{faculty.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{faculty.title}</div>
                        {faculty.researchArea && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            研究方向: {faculty.researchArea}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 成功案例 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">成功案例</h2>
              <button 
                onClick={goToCasesPage}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                查看全部案例
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successCases.map((successCase) => (
                <div 
                  key={successCase.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium dark:text-white">{successCase.studentName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {successCase.admissionYear}年录取 | {successCase.program}
                      </div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                      成功录取
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {successCase.background}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {successCase.story}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 在线咨询按钮 */}
          <div className="fixed bottom-6 right-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors">
              <FileText className="h-5 w-5" />
              在线咨询
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage; 