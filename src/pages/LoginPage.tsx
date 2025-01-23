import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  QrCode,
  User,
  GraduationCap,
  ArrowRight,
  Navigation
} from 'lucide-react';

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

function LoginPage({ setCurrentPage }: LoginPageProps) {
  const [loginMethod, setLoginMethod] = useState<'password' | 'wechat'>('password');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage('dashboard'); // 登录成功后跳转到控制台
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
                Navra.ai
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
              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      邮箱
                    </label>
                    <div className="relative">
                      <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="请输入邮箱"
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
                        placeholder="请输入密码"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

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
                  onClick={handleLogin}
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
        </div>
      </div>

      {/* 右侧品牌展示区域 */}
      <div className="w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-center justify-center relative overflow-hidden">
        {/* 简化装饰元素 - 只保留一个大圆形作为背景 */}
        <div className="absolute w-[800px] h-[800px] rounded-full -top-1/4 -right-1/4 backdrop-blur-3xl" />
        
        {/* 品牌理念展示 */}
        <div className="relative text-white text-center space-y-8 max-w-lg">
          <div className="flex justify-center mb-12">
            <div className="w-40 h-40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Navigation className="h-20 w-20 text-white transform" />
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
}

export default LoginPage; 