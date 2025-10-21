import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { updatePassword } from '../../services/authService';

function SettingsPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 密码强度检查
  const checkPasswordStrength = (password: string) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      score: [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
    };
  };

  const passwordStrength = checkPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 验证
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: '请填写所有字段' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: '新密码长度至少为8个字符' });
      return;
    }

    // 只要求包含字母和数字即可(不强制大写和特殊字符)
    if (!passwordStrength.hasLength || (!passwordStrength.hasUpper && !passwordStrength.hasLower) || !passwordStrength.hasNumber) {
      setMessage({ type: 'error', text: '密码必须至少8位,并包含字母和数字' });
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(oldPassword, newPassword);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: '密码修改成功！请使用新密码重新登录' });
        // 清空表单
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userType');
          localStorage.removeItem('currentEmployee');
          localStorage.removeItem('currentStudent');
          window.location.href = '/login';
        }, 3000);
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '修改密码失败，请稍后重试' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">密码设置</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* 修改密码卡片 */}
        <div className="bg-white rounded-2xl p-8 dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold dark:text-white">修改登录密码</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                密码需至少8位,包含字母和数字,建议定期更换
              </p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 原密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                原密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 pr-10"
                  placeholder="请输入原密码"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 新密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                新密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 pr-10"
                  placeholder="请输入新密码(至少8个字符)"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* 密码强度指示器 */}
              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.score
                            ? passwordStrength.score <= 2
                              ? 'bg-red-500'
                              : passwordStrength.score <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs space-y-1">
                    <p className={passwordStrength.hasLength ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-500 dark:text-red-400 font-medium'}>
                      {passwordStrength.hasLength ? '✓' : '✗'} 至少8个字符 <span className="text-red-500">*</span>
                    </p>
                    <p className={(passwordStrength.hasUpper || passwordStrength.hasLower) ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-500 dark:text-red-400 font-medium'}>
                      {(passwordStrength.hasUpper || passwordStrength.hasLower) ? '✓' : '✗'} 包含字母(大写或小写) <span className="text-red-500">*</span>
                    </p>
                    <p className={passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-500 dark:text-red-400 font-medium'}>
                      {passwordStrength.hasNumber ? '✓' : '✗'} 包含数字 <span className="text-red-500">*</span>
                    </p>
                    <p className={passwordStrength.hasUpper ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
                      {passwordStrength.hasUpper ? '✓' : '○'} 包含大写字母 (建议)
                    </p>
                    <p className={passwordStrength.hasSpecial ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
                      {passwordStrength.hasSpecial ? '✓' : '○'} 包含特殊字符 (建议)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 确认新密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                确认新密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 pr-10"
                  placeholder="请再次输入新密码"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  两次输入的密码不一致
                </p>
              )}
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
              >
                {loading ? '修改中...' : '确认修改'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage(null);
                }}
                disabled={loading}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
              >
                重置
              </button>
            </div>
          </form>

          {/* 安全提示 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              密码安全提示
            </h3>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <li>• 密码必须至少8位,包含字母和数字</li>
              <li>• 建议包含大写字母和特殊字符以提高安全性</li>
              <li>• 不要使用生日、姓名等容易被猜到的信息</li>
              <li>• 定期更换密码,建议每3-6个月更换一次</li>
              <li>• 不要在多个网站使用相同的密码</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 