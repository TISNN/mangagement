import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { resetPassword } from '../services/authService';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('邮箱格式不正确');
      return;
    }

    setLoading(true);

    try {
      console.log('[ForgotPasswordPage] 发送密码重置邮件:', email);
      const result = await resetPassword(email);

      if (result.error) {
        console.error('[ForgotPasswordPage] 发送失败:', result.error);
        setError(result.error);
        return;
      }

      console.log('[ForgotPasswordPage] 密码重置邮件已发送');
      setSuccess(true);
    } catch (err: unknown) {
      console.error('[ForgotPasswordPage] 发送过程出错:', err);
      const errorMessage =
        err instanceof Error ? err.message : '发送失败，请稍后重试';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            邮件已发送！
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            我们已向 <span className="font-medium">{email}</span> 发送了密码重置链接
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            请检查您的邮箱，点击链接重置密码
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              返回登录
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              重新发送
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <GraduationCap
                className="h-10 w-10 text-blue-600 absolute"
                style={{ filter: 'blur(8px)' }}
              />
              <GraduationCap className="h-10 w-10 text-blue-600 relative" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-['Orbitron']">
              Infinite.ai
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            重置密码
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            输入您的邮箱地址，我们将发送密码重置链接
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的注册邮箱"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? '发送中...' : '发送重置链接'}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* 返回登录 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回登录</span>
          </button>
        </div>

        {/* 帮助信息 */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            💡 提示：如果没有收到邮件，请检查垃圾邮件文件夹，或联系客服
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

