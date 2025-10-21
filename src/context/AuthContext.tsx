/**
 * 认证上下文
 * 提供全局的用户认证状态管理
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import {
  getCurrentUser,
  signOut as authSignOut,
  onAuthStateChange,
  Employee,
  StudentProfile,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  userType: 'admin' | 'student' | null;
  profile: Employee | StudentProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'admin' | 'student' | null>(null);
  const [profile, setProfile] = useState<Employee | StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const { user: currentUser, profile: currentProfile, userType: currentType } =
        await getCurrentUser();
      
      setUser(currentUser);
      setProfile(currentProfile);
      setUserType(currentType);
      
      // 同步到本地存储
      if (currentUser && currentProfile) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', currentType || '');
        
        if (currentType === 'admin') {
          localStorage.setItem('currentEmployee', JSON.stringify(currentProfile));
        } else if (currentType === 'student') {
          localStorage.setItem('currentStudent', JSON.stringify(currentProfile));
        }
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userType');
        localStorage.removeItem('currentEmployee');
        localStorage.removeItem('currentStudent');
      }
    } catch (error) {
      console.error('[AuthContext] 刷新用户信息失败:', error);
      setUser(null);
      setProfile(null);
      setUserType(null);
    }
  };

  // 登出
  const signOut = async () => {
    try {
      await authSignOut();
      setUser(null);
      setProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('[AuthContext] 登出失败:', error);
    }
  };

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthContext] 初始化认证状态');
        await refreshUser();
      } catch (error) {
        console.error('[AuthContext] 初始化失败:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 监听认证状态变化
    const { data } = onAuthStateChange((newUser, newUserType) => {
      console.log('[AuthContext] 认证状态变化:', newUser?.id, newUserType);
      if (newUser) {
        refreshUser();
      } else {
        setUser(null);
        setProfile(null);
        setUserType(null);
      }
    });

    // 清理监听
    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    userType,
    profile,
    loading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义Hook: 使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

