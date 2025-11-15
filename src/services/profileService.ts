import { supabase } from '../lib/supabase';
import type { Employee, StudentProfile } from './authService';

export const PROFILE_AVATAR_BUCKET = 'profile-avatars';
export const PROFILE_AVATAR_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
export const PROFILE_AVATAR_MAX_SIZE_MB = 3;

const MAX_FILE_SIZE_BYTES = PROFILE_AVATAR_MAX_SIZE_MB * 1024 * 1024;

type UploadProfileAvatarParams = {
  file: File;
  userId: string;
  previousUrl?: string | null;
};

type UploadProfileAvatarResult = {
  url?: string;
  error?: string;
};

const extractStoragePath = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${PROFILE_AVATAR_BUCKET}/`;
    const markerIndex = parsed.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(parsed.pathname.substring(markerIndex + marker.length));
  } catch (error) {
    console.warn('[ProfileService] 解析 Storage 路径失败:', error);
    return null;
  }
};

export async function uploadProfileAvatar(params: UploadProfileAvatarParams): Promise<UploadProfileAvatarResult> {
  try {
    const { file, userId, previousUrl } = params;

    if (!PROFILE_AVATAR_ALLOWED_TYPES.includes(file.type)) {
      return { error: '头像仅支持 JPG、PNG 或 WebP 格式' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { error: `头像大小需小于 ${PROFILE_AVATAR_MAX_SIZE_MB}MB` };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[ProfileService] 上传头像失败:', uploadError);
      return { error: uploadError.message };
    }

    if (previousUrl) {
      const previousPath = extractStoragePath(previousUrl);
      if (previousPath) {
        const { error: removeError } = await supabase.storage.from(PROFILE_AVATAR_BUCKET).remove([previousPath]);
        if (removeError) {
          console.warn('[ProfileService] 删除旧头像失败:', removeError);
        }
      }
    }

    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .getPublicUrl(filePath);

    if (publicUrlError) {
      console.error('[ProfileService] 获取头像链接失败:', publicUrlError);
      return { error: publicUrlError.message };
    }

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    console.error('[ProfileService] 上传头像出现异常:', error);
    return {
      error: error instanceof Error ? error.message : '头像上传失败，请稍后重试',
    };
  }
}

type UpdateProfileParams = {
  profileId: number;
  userType: 'admin' | 'student';
  name?: string;
  avatarUrl?: string | null;
};

type UpdateProfileResult = {
  error: string | null;
  profile?: Employee | StudentProfile | null;
};

export async function updateUserProfile(params: UpdateProfileParams): Promise<UpdateProfileResult> {
  const { profileId, userType, name, avatarUrl } = params;

  const updates: Record<string, unknown> = {};
  if (typeof name === 'string' && name.trim().length > 0) {
    updates.name = name.trim();
  }
  if (avatarUrl !== undefined) {
    updates.avatar_url = avatarUrl;
  }

  if (Object.keys(updates).length === 0) {
    return { error: null, profile: null };
  }

  const tableName = userType === 'admin' ? 'employees' : 'students';

  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', profileId)
      .select('*')
      .single();

    if (error) {
      console.error('[ProfileService] 更新个人资料失败:', error);
      return { error: error.message };
    }

    return { error: null, profile: data as Employee | StudentProfile };
  } catch (error) {
    console.error('[ProfileService] 更新个人资料异常:', error);
    return {
      error: error instanceof Error ? error.message : '更新个人资料失败，请稍后再试',
    };
  }
}

