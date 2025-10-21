import React, { useState } from 'react';
import { X, Hash, Users } from 'lucide-react';
import { supabase } from '../supabase';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelName.trim()) {
      setError('频道名称不能为空');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 创建新频道
      const { error: insertError } = await supabase
        .from('chat_channels')
        .insert([
          {
            name: channelName.trim(),
            description: channelDescription.trim() || null,
            is_public: isPublic
          }
        ]);
        
      if (insertError) throw insertError;
      
      // 重置表单并关闭模态框
      setChannelName('');
      setChannelDescription('');
      setIsPublic(true);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('创建频道失败:', err);
      setError('创建频道失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">创建新频道</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              频道类型
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${
                isPublic 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm' 
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}>
                <input
                  type="radio"
                  name="channelType"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="sr-only"
                />
                <Hash size={20} className="mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">公开频道</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">所有人可见</p>
                </div>
              </label>
              
              <label className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${
                !isPublic 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm' 
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}>
                <input
                  type="radio"
                  name="channelType"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="sr-only"
                />
                <Users size={20} className="mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">私有频道</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">仅邀请的成员可见</p>
                </div>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              频道名称<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="channelName"
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="输入频道名称"
              required
            />
          </div>
          
          <div>
            <label htmlFor="channelDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              频道描述
            </label>
            <textarea
              id="channelDescription"
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="简要描述频道用途（可选）"
              rows={3}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md dark:bg-red-900/20 dark:text-red-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '创建中...' : '创建频道'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal; 