/**
 * Supabase 认证服务
 * 提供完整的用户认证功能,包括登录、注册、登出、密码重置等
 */

import { supabase } from '../lib/supabase';
import { AuthError, User, Session } from '@supabase/supabase-js';

export interface Employee {
  id: number;
  name: string;
  email: string;
  contact?: string;
  department?: string;
  position?: string;
  skills?: string[];
  is_active: boolean;
  auth_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentProfile {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  gender?: string;
  education_level?: string;
  school?: string;
  major?: string;
  target_countries?: string[];
  status: string;
  auth_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
  userType: 'admin' | 'student' | null;
  profile: Employee | StudentProfile | null;
  error: string | null;
}

/**
 * 登录功能 - 使用Supabase Auth
 * @param email 用户邮箱
 * @param password 密码
 * @param userType 用户类型 (admin 或 student)
 * @returns AuthResult 包含用户信息、会话、用户类型和个人资料
 */
export async function signIn(
  email: string,
  password: string,
  userType: 'admin' | 'student' = 'admin'
): Promise<AuthResult> {
  try {
    console.log(`[AuthService] 开始登录流程 - 邮箱: ${email}, 类型: ${userType}`);

    // 1. 使用Supabase Auth进行认证
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      console.error('[AuthService] 认证失败:', authError);
      return {
        user: null,
        session: null,
        userType: null,
        profile: null,
        error: getAuthErrorMessage(authError),
      };
    }

    if (!authData.user) {
      return {
        user: null,
        session: null,
        userType: null,
        profile: null,
        error: '认证失败,未返回用户信息',
      };
    }

    console.log('[AuthService] Supabase认证成功:', authData.user.id);

    // 2. 根据用户类型获取对应的个人资料
    let profile: Employee | StudentProfile | null = null;

    if (userType === 'admin') {
      // 查询员工表
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email.trim())
        .eq('is_active', true)
        .single();

      if (employeeError) {
        console.error('[AuthService] 查询员工信息失败:', employeeError);
        // 如果找不到员工记录,登出并返回错误
        await supabase.auth.signOut();
        return {
          user: null,
          session: null,
          userType: null,
          profile: null,
          error: '该邮箱未在员工系统中注册,请联系管理员',
        };
      }

      console.log('[AuthService] 查询员工信息成功，记录ID:', employeeData?.id);

      profile = employeeData;
      console.log('[AuthService] 员工信息获取成功:', employeeData);

      // 如果员工记录没有关联auth_id,更新它
      if (!employeeData.auth_id || employeeData.auth_id !== authData.user.id) {
        const { error: updateError } = await supabase
          .from('employees')
          .update({ auth_id: authData.user.id })
          .eq('id', employeeData.id);

        if (updateError) {
          console.error('[AuthService] 更新员工auth_id失败:', updateError);
        } else {
          console.log('[AuthService] 员工auth_id已更新');
        }
      }
    } else {
      // 查询学生表
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (studentError) {
        console.error('[AuthService] 查询学生信息失败:', studentError);
        // 如果找不到学生记录,登出并返回错误
        await supabase.auth.signOut();
        return {
          user: null,
          session: null,
          userType: null,
          profile: null,
          error: '该邮箱未在学生系统中注册,请联系管理员',
        };
      }

      profile = studentData;
      console.log('[AuthService] 学生信息获取成功:', studentData);

      // 如果学生记录没有关联auth_id,更新它
      if (!studentData.auth_id || studentData.auth_id !== authData.user.id) {
        const { error: updateError } = await supabase
          .from('students')
          .update({ auth_id: authData.user.id })
          .eq('id', studentData.id);

        if (updateError) {
          console.error('[AuthService] 更新学生auth_id失败:', updateError);
        } else {
          console.log('[AuthService] 学生auth_id已更新');
        }
      }
    }

    console.log('[AuthService] 登录成功');

    return {
      user: authData.user,
      session: authData.session,
      userType,
      profile,
      error: null,
    };
  } catch (error) {
    console.error('[AuthService] 登录过程出错:', error);
    return {
      user: null,
      session: null,
      userType: null,
      profile: null,
      error: error instanceof Error ? error.message : '登录失败,请稍后重试',
    };
  }
}

/**
 * 注册新用户
 * @param email 邮箱
 * @param password 密码
 * @param name 用户名
 * @param userType 用户类型
 * @returns AuthResult
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
  userType: 'admin' | 'student' = 'student'
): Promise<AuthResult> {
  try {
    console.log(`[AuthService] 开始注册流程 - 邮箱: ${email}, 类型: ${userType}`);

    // 1. 在Supabase Auth中创建用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          name: name.trim(),
          user_type: userType,
        },
      },
    });

    if (authError) {
      console.error('[AuthService] 注册失败:', authError);
      return {
        user: null,
        session: null,
        userType: null,
        profile: null,
        error: getAuthErrorMessage(authError),
      };
    }

    if (!authData.user) {
      return {
        user: null,
        session: null,
        userType: null,
        profile: null,
        error: '注册失败,未返回用户信息',
      };
    }

    console.log('[AuthService] Supabase注册成功:', authData.user.id);

    // 2. 在对应的表中创建用户资料
    let profile: Employee | StudentProfile | null = null;

    if (userType === 'student') {
      // 创建学生记录
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name: name.trim(),
          email: email.trim(),
          status: 'active',
          auth_id: authData.user.id,
        })
        .select()
        .single();

      if (studentError) {
        console.error('[AuthService] 创建学生记录失败:', studentError);
        // 删除已创建的Auth用户
        await supabase.auth.admin.deleteUser(authData.user.id);
        return {
          user: null,
          session: null,
          userType: null,
          profile: null,
          error: '创建学生资料失败,请联系管理员',
        };
      }

      profile = studentData;
      console.log('[AuthService] 学生记录创建成功');
    } else {
      // 管理员注册需要额外权限,这里仅返回提示
      return {
        user: null,
        session: null,
        userType: null,
        profile: null,
        error: '管理员账号需要由系统管理员创建,请联系管理员',
      };
    }

    return {
      user: authData.user,
      session: authData.session,
      userType,
      profile,
      error: null,
    };
  } catch (error) {
    console.error('[AuthService] 注册过程出错:', error);
    return {
      user: null,
      session: null,
      userType: null,
      profile: null,
      error: error instanceof Error ? error.message : '注册失败,请稍后重试',
    };
  }
}

/**
 * 登出当前用户
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    console.log('[AuthService] 开始登出流程');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[AuthService] 登出失败:', error);
      return { error: getAuthErrorMessage(error) };
    }

    // 清除本地存储
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentEmployee');
    localStorage.removeItem('userType');

    console.log('[AuthService] 登出成功');
    return { error: null };
  } catch (error) {
    console.error('[AuthService] 登出过程出错:', error);
    return {
      error: error instanceof Error ? error.message : '登出失败',
    };
  }
}

/**
 * 获取当前登录用户
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  profile: Employee | StudentProfile | null;
  userType: 'admin' | 'student' | null;
}> {
  try {
    // 1. 获取当前Supabase Auth用户
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, profile: null, userType: null };
    }

    // 2. 尝试从员工表查找
    const { data: employeeData } = await supabase
      .from('employees')
      .select('*')
      .eq('auth_id', user.id)
      .eq('is_active', true)
      .single();

    if (employeeData) {
      return { user, profile: employeeData, userType: 'admin' };
    }

    // 3. 尝试从学生表查找
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (studentData) {
      return { user, profile: studentData, userType: 'student' };
    }

    return { user, profile: null, userType: null };
  } catch (error) {
    console.error('[AuthService] 获取当前用户失败:', error);
    return { user: null, profile: null, userType: null };
  }
}

/**
 * 发送密码重置邮件
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    console.log('[AuthService] 发送密码重置邮件:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('[AuthService] 发送重置邮件失败:', error);
      return { error: getAuthErrorMessage(error) };
    }

    console.log('[AuthService] 密码重置邮件已发送');
    return { error: null };
  } catch (error) {
    console.error('[AuthService] 密码重置过程出错:', error);
    return {
      error: error instanceof Error ? error.message : '发送重置邮件失败',
    };
  }
}

/**
 * 更新密码 - 需要先验证原密码
 */
export async function updatePassword(
  oldPassword: string, 
  newPassword: string
): Promise<{ error: string | null }> {
  try {
    console.log('[AuthService] 开始更新密码流程');
    
    // 1. 获取当前用户邮箱
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError || !user || !user.email) {
      console.error('[AuthService] 获取用户信息失败:', getUserError);
      return { error: '获取用户信息失败，请重新登录' };
    }
    
    console.log('[AuthService] 当前用户邮箱:', user.email);
    
    // 2. 验证原密码 - 尝试用原密码重新登录
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword.trim(),
    });
    
    if (signInError) {
      console.error('[AuthService] 原密码验证失败:', signInError);
      return { error: '原密码错误，请重新输入' };
    }
    
    console.log('[AuthService] 原密码验证成功');
    
    // 3. 更新为新密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    });

    if (updateError) {
      console.error('[AuthService] 更新密码失败:', updateError);
      return { error: getAuthErrorMessage(updateError) };
    }

    console.log('[AuthService] 密码更新成功');
    return { error: null };
  } catch (error) {
    console.error('[AuthService] 更新密码过程出错:', error);
    return {
      error: error instanceof Error ? error.message : '更新密码失败',
    };
  }
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(
  callback: (user: User | null, userType: 'admin' | 'student' | null) => void
) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[AuthService] Auth状态变化:', event);

    if (event === 'SIGNED_IN' && session?.user) {
      // 确定用户类型
      const { userType } = await getCurrentUser();
      callback(session.user, userType);
    } else if (event === 'SIGNED_OUT') {
      callback(null, null);
    }
  });
}

/**
 * 将Supabase Auth错误转换为用户友好的消息
 */
function getAuthErrorMessage(error: AuthError): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': '邮箱或密码错误',
    'Email not confirmed': '邮箱未验证,请检查您的邮箱',
    'User already registered': '该邮箱已被注册',
    'Password should be at least 6 characters': '密码至少需要6个字符',
    'Unable to validate email address': '邮箱格式不正确',
    'Email rate limit exceeded': '发送邮件次数过多,请稍后再试',
  };

  return errorMessages[error.message] || error.message || '操作失败,请稍后重试';
}
