import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import './LoginPage.css';
import { signIn } from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMethod, setLoginMethod] = useState<'password' | 'wechat'>('password');
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 组件挂载时检查是否有记住的登录信息
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedRole = localStorage.getItem('rememberedRole');
    const loginExpiry = localStorage.getItem('loginExpiry');
    
    if (rememberedEmail && rememberedRole) {
      setEmail(rememberedEmail);
      setUserRole(rememberedRole as 'student' | 'admin');
      setRememberMe(true);
    }

    // 检查是否在7天自动登录期内
    if (loginExpiry && Date.now() < parseInt(loginExpiry)) {
      const isAuth = localStorage.getItem('isAuthenticated');
      const userType = localStorage.getItem('userType');
      
      if (isAuth === 'true' && userType) {
        // 自动跳转到对应页面
        if (userType === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student');
        }
      }
    } else if (loginExpiry) {
      // 过期了,清除登录状态
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('loginExpiry');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // 基础验证
    if (!trimmedEmail || !trimmedPassword) {
      setError('请输入邮箱和密码');
      setLoading(false);
      return;
    }

    try {
      console.log(`[LoginPage] 开始登录 - 类型: ${userRole}`);

      // 使用真实的Supabase认证服务
      const result = await signIn(trimmedEmail, trimmedPassword, userRole);
      console.log('[LoginPage] signIn 返回结果:', {
        hasUser: Boolean(result.user),
        hasProfile: Boolean(result.profile),
        userType: result.userType,
        error: result.error,
      });

      if (result.error) {
        console.error('[LoginPage] 登录失败:', result.error);
        setError(result.error);
        return;
      }

      if (!result.user || !result.profile) {
        console.warn('[LoginPage] 登录返回缺少用户或资料:', {
          hasUser: Boolean(result.user),
          hasProfile: Boolean(result.profile),
        });
        setError('登录失败,请稍后重试');
        return;
      }

      console.log('[LoginPage] 登录成功:', result.profile);

      // 保存用户信息到本地存储
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', result.userType || '');
      
      // 处理"记住我"功能
      if (rememberMe) {
        // 保存邮箱和角色,方便下次自动填充
        localStorage.setItem('rememberedEmail', trimmedEmail);
        localStorage.setItem('rememberedRole', userRole);
        // 设置7天后过期 (7 * 24 * 60 * 60 * 1000 毫秒)
        const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('loginExpiry', expiryTime.toString());
      } else {
        // 不记住,清除之前保存的信息
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedRole');
        localStorage.removeItem('loginExpiry');
      }
      
      // 获取用户登录前想访问的页面
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';
      
      if (result.userType === 'admin') {
        localStorage.setItem('currentEmployee', JSON.stringify(result.profile));
        // 如果之前想访问的页面是admin相关的，跳转回去；否则去dashboard
        navigate(from.startsWith('/admin') ? from : '/admin/dashboard');
      } else {
        localStorage.setItem('currentStudent', JSON.stringify(result.profile));
        navigate('/student');
      }
    } catch (err: unknown) {
      console.error('[LoginPage] 登录过程错误:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : '登录失败，请稍后重试';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
              <div className="relative h-12 w-12">
                <img
                  src="/logo.png?v=1"
                  alt="StudyLandsEdu Workspace logo"
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    // 如果加载失败，可以设置一个默认的占位符
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <h1 className="text-2xl font-bold text-black font-['Orbitron']">
                StudyLandsEdu
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
                      邮箱
                    </label>
                    <div className="relative">
                      <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="请输入登录邮箱"
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      记住我 (7天内自动登录)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-black hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    忘记密码？
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>{loading ? '登录中...' : '登录'}</span>
                  {!loading && <ArrowRight className="h-4 w-4" />}
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
                <button
                  onClick={() => navigate('/register')}
                  className="text-black hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 ml-1"
                >
                  立即注册
                </button>
              </p>
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
            <h2 className="text-4xl font-bold">让留学申请更简单、更高效</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              通过数字化流程管理，从材料准备到录取结果，
              <br />一站式掌握每一步进度，让申请不再繁琐。
            </p>
          </div>
          <div className="pt-8 flex justify-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white/90">材料管理</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white/90">流程追踪</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-sm font-medium text-white/90">录取同步</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 