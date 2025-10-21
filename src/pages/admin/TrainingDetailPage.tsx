import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video,
  Users,
  Clock,
  Calendar,
  Edit,
  Download,
  MessageSquare,
  Star,
  Send,
  Mic,
  Camera,
  ScreenShare,
  Settings,
  X,
  Upload
} from 'lucide-react';
import { Training, getTraining, updateTraining } from '../../services/trainingService';

const TrainingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [message, setMessage] = useState('');
  const [training, setTraining] = useState<Training | null>(null);
  const [editForm, setEditForm] = useState<Partial<Training>>({});

  useEffect(() => {
    if (id) {
      const trainingData = getTraining(id);
      if (trainingData) {
        setTraining(trainingData);
        setEditForm(trainingData);
      } else {
        navigate('/admin/interview');
      }
    }
  }, [id, navigate]);

  const handleStartSession = () => {
    if (training && training.id) {
      updateTraining(training.id, { status: 'ongoing' });
      setTraining(prev => prev ? { ...prev, status: 'ongoing' } : null);
      setIsLiveSession(true);
    }
  };

  const handleEndSession = () => {
    if (training && training.id) {
      updateTraining(training.id, { status: 'completed' });
      setTraining(prev => prev ? { ...prev, status: 'completed' } : null);
      setIsLiveSession(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: 发送消息
    setMessage('');
  };

  const handleSaveEdit = () => {
    if (training && training.id && editForm) {
      const updatedTraining = updateTraining(training.id, editForm);
      if (updatedTraining) {
        setTraining(updatedTraining);
        setIsEditing(false);
      }
    }
  };

  if (!training) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLiveSession ? (
        // 在线培训会议界面
        <div className="h-screen flex flex-col">
          {/* 视频区域 */}
          <div className="flex-1 bg-gray-900 p-6">
            <div className="grid grid-cols-4 gap-4 h-full">
              {/* 主讲人视频 */}
              <div className="col-span-3 bg-gray-800 rounded-2xl overflow-hidden">
                <video className="w-full h-full object-cover" />
              </div>
              {/* 参会者列表 */}
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl aspect-video overflow-hidden">
                    <video className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 控制栏 */}
          <div className="h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="h-full flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-xl ${
                    isMicOn ? 'bg-gray-100 dark:bg-gray-700' : 'bg-red-500'
                  }`}
                >
                  <Mic className={`h-6 w-6 ${isMicOn ? 'text-gray-600' : 'text-white'}`} />
                </button>
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-3 rounded-xl ${
                    isCameraOn ? 'bg-gray-100 dark:bg-gray-700' : 'bg-red-500'
                  }`}
                >
                  <Camera className={`h-6 w-6 ${isCameraOn ? 'text-gray-600' : 'text-white'}`} />
                </button>
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-xl ${
                    isScreenSharing ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <ScreenShare className={`h-6 w-6 ${isScreenSharing ? 'text-white' : 'text-gray-600'}`} />
                </button>
              </div>

              <button
                onClick={handleEndSession}
                className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                结束培训
              </button>
            </div>
          </div>

          {/* 聊天区域 */}
          <div className="fixed right-0 top-0 bottom-20 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium dark:text-white">培训讨论</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {/* 聊天消息 */}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    placeholder="发送消息..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-lg"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 培训详情界面
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            {/* 标题和操作按钮 */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold dark:text-white mb-2">{training.title}</h1>
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{training.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{training.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{training.maxStudents}人</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Edit className="h-5 w-5" />
                  <span>编辑</span>
                </button>
                {training.status === 'upcoming' && (
                  <button
                    onClick={handleStartSession}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Video className="h-5 w-5" />
                    <span>开始培训</span>
                  </button>
                )}
              </div>
            </div>

            {/* 培训详情 */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold dark:text-white mb-4">培训介绍</h2>
                  <div className="prose dark:prose-invert">
                    {training.description.split('\n').map((line, index) => (
                      <p key={index} className="text-gray-600 dark:text-gray-300">{line}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold dark:text-white mb-4">培训材料</h2>
                  <div className="space-y-3">
                    {training.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Download className="h-5 w-5 text-blue-500" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">{material}</span>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600">
                          下载
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h2 className="text-lg font-semibold dark:text-white mb-4">讲师信息</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${training.instructor}`}
                      alt={training.instructor}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium dark:text-white">{training.instructor}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">资深面试培训师</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star className="h-5 w-5" fill="currentColor" />
                    <Star className="h-5 w-5" fill="currentColor" />
                    <Star className="h-5 w-5" fill="currentColor" />
                    <Star className="h-5 w-5" fill="currentColor" />
                    <Star className="h-5 w-5" fill="currentColor" />
                    <span className="ml-2 text-gray-600 dark:text-gray-300">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑模态框 */}
      {isEditing && training && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-white">编辑培训信息</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  培训标题
                </label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  培训描述
                </label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    培训讲师
                  </label>
                  <input
                    type="text"
                    value={editForm.instructor || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, instructor: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    培训人数
                  </label>
                  <input
                    type="number"
                    value={editForm.maxStudents || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, maxStudents: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={editForm.date || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    开始时间
                  </label>
                  <input
                    type="time"
                    value={editForm.time || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    培训时长
                  </label>
                  <input
                    type="text"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="如：90分钟"
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
                      checked={editForm.type === 'online'}
                      onChange={() => setEditForm(prev => ({ ...prev, type: 'online' }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">线上培训</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={editForm.type === 'offline'}
                      onChange={() => setEditForm(prev => ({ ...prev, type: 'offline' }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">线下培训</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDetailPage; 