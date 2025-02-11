import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  QrCode,
  User,
  GraduationCap,
  ArrowRight,
  Navigation,
  UserCog,
  Users
} from 'lucide-react';
import './LoginPage.css'; // 添加新的 CSS 文件

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'password' | 'wechat'>('password');
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证用户名和密码
    if (userRole === 'admin' && username === 'admin' && password === '123456') {
      navigate('/admin/dashboard');
    } else if (userRole === 'student' && username === 'student' && password === '123456') {
      navigate('/student/dashboard');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 flex">
      {/* 左侧登录区域 */}
      <div className="w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <GraduationCap className="h-10 w-10 text-blue-600 absolute" style={{ filter: 'blur(8px)' }} />
                <GraduationCap className="h-10 w-10 text-blue-600 relative" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Infinite.ai
              </h1>
            </div>
          </div>

          {/* 登录卡片 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm dark:bg-gray-800">
            {/* 登录方式切换 */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold dark:text-white">欢迎回来</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setLoginMethod('password')}
                  className={`p-2 rounded-xl transition-colors ${
                    loginMethod === 'password'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <User className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setLoginMethod('wechat')}
                  className={`p-2 rounded-xl transition-colors ${
                    loginMethod === 'wechat'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                </button>
              </div>
            </div>

            {loginMethod === 'password' ? (
              // 账号密码登录
              <form onSubmit={handleLogin} className="space-y-6">
                {/* 用户角色选择 */}
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setUserRole('student')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      userRole === 'student'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>学生</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('admin')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      userRole === 'admin'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <UserCog className="h-5 w-5" />
                    <span>管理员</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      用户名
                    </label>
                    <div className="relative">
                      <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={userRole === 'admin' ? "请输入管理员用户名" : "请输入学生用户名"}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">记住我</span>
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    忘记密码？
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>登录</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              // 微信扫码登录
              <div className="text-center space-y-6">
                <div className="bg-white p-4 rounded-xl inline-block">
                  {/* 这里放微信二维码图片 */}
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center dark:bg-gray-700">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium dark:text-white">请使用微信扫码登录</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    打开微信，使用「扫一扫」即可登录
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                还没有账号？
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                  立即注册
                </button>
              </p>
            </div>
          </div>

          {/* 账号密码提示 - 独立的白色背景文本框 */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium dark:text-white">测试账号</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <p className="text-blue-600 dark:text-blue-400 font-medium">学生账号</p>
                </div>
                <div className="space-y-1 ml-6">
                  <p className="text-gray-600 dark:text-gray-300">用户名：<span className="font-medium">student</span></p>
                  <p className="text-gray-600 dark:text-gray-300">密码：<span className="font-medium">123456</span></p>
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserCog className="h-4 w-4 text-purple-500" />
                  <p className="text-purple-600 dark:text-purple-400 font-medium">管理员账号</p>
                </div>
                <div className="space-y-1 ml-6">
                  <p className="text-gray-600 dark:text-gray-300">用户名：<span className="font-medium">admin</span></p>
                  <p className="text-gray-600 dark:text-gray-300">密码：<span className="font-medium">123456</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧品牌展示区域 */}
      <div className="w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-center justify-center relative overflow-hidden">
        {/* 背景动画元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-container">
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
          </div>
          <div className="shooting-star"></div>
          <div className="shooting-star delay-2s"></div>
        </div>
        
        {/* 主圆形背景 */}
        <div className="absolute w-[800px] h-[800px] rounded-full -top-1/4 -right-1/4 backdrop-blur-3xl animate-pulse-slow" />
        
        {/* 品牌理念展示 */}
        <div className="relative text-white text-center space-y-8 max-w-lg">
          <div className="flex justify-center mb-12">
            <div className="w-40 h-40 backdrop-blur-sm rounded-full flex items-center justify-center hover-float">
              <Navigation className="h-20 w-20 text-white transform compass-spin" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">探索你的未来</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              通过 AI 智能规划，为每一位学子指明方向
              <br />开启璀璨未来
            </p>
          </div>
          <div className="pt-8 flex justify-center gap-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-sm font-medium text-white/90">智能选校</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Navigation className="h-8 w-8 text-white" />
              </div>
              <span className="text-sm font-medium text-white/90">未来规划</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 