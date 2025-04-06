/**
 * 认证服务 - 处理用户登录、注册、权限等功能
 */
import { supabase } from '../lib/supabase';

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

// 用户信息类型
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
}

/**
 * 认证服务
 */
export const authService = {
  /**
   * 使用邮箱和密码登录
   * @param email 用户邮箱
   * @param password 用户密码
   * @returns 登录结果
   */
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // 获取更多用户信息
      if (data.user) {
        const userInfo = await this.getUserProfile(data.user.id);
        return {
          user: userInfo,
          session: data.session
        };
      }
      
      return data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },
  
  /**
   * 注册新用户
   * @param email 用户邮箱
   * @param password 用户密码
   * @param userData 用户信息
   * @returns 注册结果
   */
  async register(email: string, password: string, userData: Partial<User>) {
    try {
      // 创建认证用户
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || UserRole.STUDENT
          }
        }
      });
      
      if (error) throw error;
      
      // 创建用户资料
      if (data.user) {
        await this.createUserProfile({
          id: data.user.id,
          email: data.user.email || email,
          role: userData.role || UserRole.STUDENT,
          name: userData.name
        });
      }
      
      return data;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },
  
  /**
   * 退出登录
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('退出登录失败:', error);
      throw error;
    }
  },
  
  /**
   * 获取当前登录用户
   * @returns 当前用户信息
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) return null;
      
      // 获取用户完整信息
      return await this.getUserProfile(data.user.id);
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return null;
    }
  },
  
  /**
   * 获取用户资料
   * @param userId 用户ID
   * @returns 用户资料
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      // 首先尝试获取用户认证信息
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) return null;
      
      // 获取用户详细资料（可以根据具体数据库结构调整）
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116是"没有找到记录"的错误码
        throw error;
      }
      
      // 如果找不到用户资料，返回基本信息
      if (!data) {
        return {
          id: authData.user.id,
          email: authData.user.email || '',
          role: (authData.user.user_metadata?.role as UserRole) || UserRole.STUDENT,
          name: authData.user.user_metadata?.name
        };
      }
      
      // 返回完整用户资料
      return {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
        avatar_url: data.avatar_url
      };
    } catch (error) {
      console.error(`获取用户资料失败 [userId=${userId}]:`, error);
      return null;
    }
  },
  
  /**
   * 创建用户资料
   * @param userData 用户信息
   */
  async createUserProfile(userData: User) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          avatar_url: userData.avatar_url
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('创建用户资料失败:', error);
      throw error;
    }
  },
  
  /**
   * 更新用户资料
   * @param userId 用户ID
   * @param userData 要更新的用户信息
   */
  async updateUserProfile(userId: string, userData: Partial<User>) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  },
  
  /**
   * 重置密码
   * @param email 用户邮箱
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('重置密码请求失败:', error);
      throw error;
    }
  },
  
  /**
   * 更新密码
   * @param newPassword 新密码
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('更新密码失败:', error);
      throw error;
    }
  }
}; 