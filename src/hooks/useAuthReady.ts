import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * 确保认证已完全就绪的 Hook
 * 用于需要 Supabase 认证的组件，防止在会话恢复前发起请求
 * 
 * @returns {boolean} 认证是否已完全就绪（会话已恢复且用户信息已加载）
 */
export const useAuthReady = (): boolean => {
  const { loading, user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 只有当认证不再加载，且有用户信息时，才认为已就绪
    if (!loading && user) {
      setIsReady(true);
    } else if (!loading && !user) {
      // 如果加载完成但没有用户，说明未登录，也设为就绪（让路由守卫处理跳转）
      setIsReady(true);
    }
  }, [loading, user]);

  return isReady;
};

