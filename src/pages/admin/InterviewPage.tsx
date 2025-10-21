import React, { useState, useEffect } from 'react';
import { 
  Video,
  Users,
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Play,
  BookOpen,
  MessageSquare,
  Star,
  X,
  Link,
  Upload,
  Construction,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Training, getTrainings, saveTraining } from '../../services/trainingService';

interface TrainingForm {
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  maxStudents: string;
  type: 'online' | 'offline';
  materials: File[];
}

const InterviewPage: React.FC = () => {
  const [showNewTrainingForm, setShowNewTrainingForm] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingForm, setTrainingForm] = useState<TrainingForm>({
    title: '',
    description: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    maxStudents: '',
    type: 'online',
    materials: []
  });
  const [showDevNotice] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 加载培训列表
    const loadTrainings = () => {
      const trainingsData = getTrainings();
      setTrainings(trainingsData);
    };
    loadTrainings();
  }, []);

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 保存培训数据
    const newTraining = saveTraining({
      ...trainingForm,
      materials: trainingForm.materials.map(file => file.name)
    });
    
    // 更新培训列表
    setTrainings(prev => [...prev, newTraining]);
    
    // 重置表单并关闭模态框
    setTrainingForm({
      title: '',
      description: '',
      instructor: '',
      date: '',
      time: '',
      duration: '',
      maxStudents: '',
      type: 'online',
      materials: []
    });
    setShowNewTrainingForm(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* 顶部标题和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">面试培训</h1>
          <p className="text-gray-500 dark:text-gray-400">管理和安排学生面试培训课程</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索培训..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button 
            onClick={() => setShowNewTrainingForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="h-5 w-5" />
            <span>新建培训</span>
          </button>
        </div>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '培训课程',
            value: '24',
            change: '+12.5%',
            icon: Video,
            color: 'blue'
          },
          {
            title: '参训学生',
            value: '128',
            change: '+4.75%',
            icon: Users,
            color: 'green'
          },
          {
            title: '本周安排',
            value: '12',
            change: '+8.2%',
            icon: Calendar,
            color: 'purple'
          },
          {
            title: '总培训时长',
            value: '386h',
            change: '+5.25%',
            icon: Clock,
            color: 'orange'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 培训课程列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">培训课程</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              全部
            </button>
            <button className="px-3 py-1 text-sm rounded-full text-gray-600 dark:text-gray-400">
              进行中
            </button>
            <button className="px-3 py-1 text-sm rounded-full text-gray-600 dark:text-gray-400">
              已完成
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {trainings.map((training) => (
              <div
                key={training.id}
                onClick={() => navigate(`/admin/interview/${training.id}`)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Video className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{training.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {training.instructor}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {training.date} {training.time}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {training.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    training.status === 'upcoming' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                    training.status === 'ongoing' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                    'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {training.status === 'upcoming' ? '即将开始' :
                     training.status === 'ongoing' ? '进行中' : '已完成'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 培训资源和反馈 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">培训资源</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                title: '面试常见问题集',
                type: '文档',
                size: '2.5MB',
                icon: BookOpen
              },
              {
                title: '面试技巧视频教程',
                type: '视频',
                duration: '45分钟',
                icon: Play
              },
              {
                title: '模拟面试指南',
                type: '文档',
                size: '1.8MB',
                icon: MessageSquare
              }
            ].map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <resource.icon className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium dark:text-white">{resource.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.type} · {resource.size || resource.duration}
                    </p>
                  </div>
                </div>
                <button className="text-blue-500 hover:text-blue-600">
                  下载
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">学生反馈</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                student: '张同学',
                course: '商学院面试技巧培训',
                rating: 5,
                comment: '非常实用的培训课程，让我对面试更有信心了。'
              },
              {
                student: '李同学',
                course: '工程类院校面试指导',
                rating: 4,
                comment: '讲师经验丰富，针对性很强。'
              },
              {
                student: '王同学',
                course: 'MBA面试模拟训练',
                rating: 5,
                comment: '模拟面试环节特别有帮助。'
              }
            ].map((feedback, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium dark:text-white">{feedback.student}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {feedback.course}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: feedback.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 新建培训表单模态框 */}
      {showNewTrainingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-white">新建培训课程</h2>
              <button 
                onClick={() => setShowNewTrainingForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTraining} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    培训标题
                  </label>
                  <input
                    type="text"
                    value={trainingForm.title}
                    onChange={(e) => setTrainingForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入培训标题"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    培训描述
                  </label>
                  <textarea
                    value={trainingForm.description}
                    onChange={(e) => setTrainingForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入培训描述"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      培训讲师
                    </label>
                    <input
                      type="text"
                      value={trainingForm.instructor}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, instructor: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入讲师姓名"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      培训人数
                    </label>
                    <input
                      type="number"
                      value={trainingForm.maxStudents}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, maxStudents: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入最大人数"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      培训日期
                    </label>
                    <input
                      type="date"
                      value={trainingForm.date}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      开始时间
                    </label>
                    <input
                      type="time"
                      value={trainingForm.time}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      培训时长
                    </label>
                    <input
                      type="text"
                      value={trainingForm.duration}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如：90分钟"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    培训方式
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={trainingForm.type === 'online'}
                        onChange={() => setTrainingForm(prev => ({ ...prev, type: 'online' }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700 dark:text-gray-300">线上培训</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={trainingForm.type === 'offline'}
                        onChange={() => setTrainingForm(prev => ({ ...prev, type: 'offline' }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700 dark:text-gray-300">线下培训</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    培训材料
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>上传文件</span>
                          <input
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              setTrainingForm(prev => ({
                                ...prev,
                                materials: [...prev.materials, ...files]
                              }));
                            }}
                          />
                        </label>
                        <p className="pl-1">或拖拽文件到这里</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        支持 PDF、PPT、Word、图片等格式
                      </p>
                    </div>
                  </div>
                  {trainingForm.materials.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {trainingForm.materials.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setTrainingForm(prev => ({
                                ...prev,
                                materials: prev.materials.filter((_, i) => i !== index)
                              }));
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewTrainingForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  创建培训
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 开发中提示覆盖层 */}
      {showDevNotice && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-10 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-lg w-full text-center dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center dark:bg-blue-900/20">
                <Construction className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3 dark:text-white">面试培训功能开发中</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              我们正在努力开发面试培训功能，为学生提供高质量的面试辅导和模拟训练。这些功能即将推出，敬请期待！
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">即将推出</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="p-4 bg-gray-50 rounded-xl dark:bg-gray-700/30">
                <p>面试模拟训练</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl dark:bg-gray-700/30">
                <p>面试技巧培训</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl dark:bg-gray-700/30">
                <p>面试评估反馈</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl dark:bg-gray-700/30">
                <p>AI面试助手</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage; 