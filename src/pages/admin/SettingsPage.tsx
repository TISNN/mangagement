import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, UserCircle, UploadCloud } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updatePassword, type Employee, type StudentProfile } from '@/services/authService';
import {
  uploadProfileAvatar,
  updateUserProfile,
  PROFILE_AVATAR_ALLOWED_TYPES,
  PROFILE_AVATAR_MAX_SIZE_MB,
  PROFILE_AVATAR_BUCKET,
} from '@/services/profileService';

type AuthProfile = Employee | StudentProfile;

const normalizeMimeLabel = (mime: string) => {
  const [, subtype] = mime.split('/');
  const upper = (subtype || mime).toUpperCase();
  if (upper === 'JPEG') {
    return 'JPG';
  }
  return upper;
};

const READABLE_AVATAR_TYPES = Array.from(
  new Set(PROFILE_AVATAR_ALLOWED_TYPES.map((type) => normalizeMimeLabel(type))),
);
const AVATAR_ACCEPT_ATTRIBUTE = PROFILE_AVATAR_ALLOWED_TYPES.join(',');

const resolveProfileAvatar = (profile?: AuthProfile | null): string | null => {
  if (!profile) {
    return null;
  }

  const candidate =
    (typeof profile.avatar_url === 'string' && profile.avatar_url?.trim()) ||
    (typeof profile.avatarUrl === 'string' && profile.avatarUrl?.trim());

  return candidate && candidate.length > 0 ? candidate : null;
};

const getFallbackAvatar = (name?: string | null) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'InfiniteUser')}`;

type FeedbackMessage = { type: 'success' | 'error'; text: string };

function SettingsPage() {
  const { profile, userType, loading: authLoading, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileMessage, setProfileMessage] = useState<FeedbackMessage | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FeedbackMessage | null>(null);

  useEffect(() => {
    if (!profile) {
      setDisplayName('');
      setAvatarPreview(null);
      setAvatarFile(null);
      setObjectUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
      return;
    }

    setDisplayName(profile.name ?? '');
    setAvatarPreview(resolveProfileAvatar(profile));
    setAvatarFile(null);
    setObjectUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, [profile]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const isProfileReady = Boolean(profile && userType);
  const trimmedDisplayName = displayName.trim();
  const originalName = profile?.name?.trim() ?? '';
  const hasProfileChanges =
    isProfileReady &&
    Boolean(
      (trimmedDisplayName && trimmedDisplayName !== originalName) ||
        avatarFile,
    );
  const avatarToRender = avatarPreview || getFallbackAvatar(profile?.name);
  const profileEmail = profile?.email ?? '---';
  const disableProfileForm = !isProfileReady || profileSaving || authLoading;

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    if (!PROFILE_AVATAR_ALLOWED_TYPES.includes(file.type)) {
      setProfileMessage({
        type: 'error',
        text: `头像仅支持 ${READABLE_AVATAR_TYPES.join('/')} 格式`,
      });
      return;
    }

    const maxBytes = PROFILE_AVATAR_MAX_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setProfileMessage({
        type: 'error',
        text: `头像大小需小于 ${PROFILE_AVATAR_MAX_SIZE_MB}MB`,
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setObjectUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return previewUrl;
    });
    setAvatarPreview(previewUrl);
    setAvatarFile(file);
    setProfileMessage(null);
  };

  const handleProfileReset = () => {
    setProfileMessage(null);
    if (!profile) {
      setDisplayName('');
      setAvatarPreview(null);
      setAvatarFile(null);
      setObjectUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
      return;
    }

    setDisplayName(profile.name ?? '');
    setAvatarPreview(resolveProfileAvatar(profile));
    setAvatarFile(null);
    setObjectUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile || !userType) {
      setProfileMessage({
        type: 'error',
        text: '无法获取当前用户身份，请重新登录后再试',
      });
      return;
    }

    const nextName = trimmedDisplayName;
    if (!nextName) {
      setProfileMessage({
        type: 'error',
        text: '姓名不能为空',
      });
      return;
    }

    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const existingAvatar = resolveProfileAvatar(profile);
      let newAvatarUrl: string | undefined;

      if (avatarFile) {
        const uploadResult = await uploadProfileAvatar({
          file: avatarFile,
          userId: profile.auth_id ?? String(profile.id),
          previousUrl: existingAvatar ?? undefined,
        });

        if (uploadResult.error || !uploadResult.url) {
          throw new Error(uploadResult.error || '头像上传失败，请稍后重试');
        }

        newAvatarUrl = uploadResult.url;
        setAvatarPreview(uploadResult.url);
      }

      const { error } = await updateUserProfile({
        profileId: profile.id,
        userType,
        name: nextName !== originalName ? nextName : undefined,
        avatarUrl: newAvatarUrl,
      });

      if (error) {
        throw new Error(error);
      }

      await refreshUser();
      setAvatarFile(null);
      setProfileMessage({
        type: 'success',
        text: '个人资料更新成功',
      });
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '个人资料更新失败，请稍后重试',
      });
    } finally {
      setProfileSaving(false);
    }
  };

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
        <h1 className="text-2xl font-bold dark:text-white">系统设置</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* 个人资料 */}
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl p-8 dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold dark:text-white">个人资料</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                上传头像、更新姓名，资料会实时同步到全站
              </p>
            </div>
          </div>

          {profileMessage && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                profileMessage.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}
            >
              {profileMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-sm">{profileMessage.text}</span>
            </div>
          )}

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-col items-center gap-4 lg:w-1/3">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-sm">
                <img
                  src={avatarToRender}
                  alt={displayName || '头像预览'}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={handleAvatarButtonClick}
                  disabled={disableProfileForm}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-purple-300 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-300 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/30"
                >
                  <UploadCloud className="h-4 w-4" />
                  {avatarFile ? '重新选择头像' : '上传头像'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={AVATAR_ACCEPT_ATTRIBUTE}
                  onChange={handleAvatarFileChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  支持 {READABLE_AVATAR_TYPES.join('/')}，≤ {PROFILE_AVATAR_MAX_SIZE_MB}MB
                </p>
                <p className="text-xs text-gray-400 text-center dark:text-gray-500">
                  文件存储于 Supabase Storage（{PROFILE_AVATAR_BUCKET}）
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  maxLength={40}
                  placeholder="请输入真实姓名"
                  disabled={disableProfileForm}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  邮箱
                </label>
                <input
                  type="text"
                  value={profileEmail}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          {!isProfileReady && !authLoading && (
            <p className="mt-6 text-sm text-orange-500">
              未能获取当前登录用户，请重新登录后再试
            </p>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleProfileReset}
              disabled={!hasProfileChanges || disableProfileForm}
              className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              重置
            </button>
            <button
              type="submit"
              disabled={!hasProfileChanges || disableProfileForm}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {profileSaving ? '保存中...' : '保存资料'}
            </button>
          </div>
        </form>

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