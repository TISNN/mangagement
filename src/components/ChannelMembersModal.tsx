import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { supabase } from '../supabase';

interface Employee {
  id: string;
  name: string;
  avatar_url: string | null;
  position: string;
  email: string;
}

interface ChannelMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string | null;
  channelName: string;
}

const ChannelMembersModal: React.FC<ChannelMembersModalProps> = ({ 
  isOpen, 
  onClose, 
  channelId,
  channelName
}) => {
  const [members, setMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!isOpen || !channelId) return;
    
    const fetchMembers = async () => {
      setLoading(true);
      
      try {
        // 对于公共频道，获取所有员工
        const { data: channelData, error: channelError } = await supabase
          .from('chat_channels')
          .select('is_public')
          .eq('id', channelId)
          .single();
          
        if (channelError) throw channelError;
        
        if (channelData.is_public) {
          // 获取所有员工
          const { data: employeesData, error: employeesError } = await supabase
            .from('employees')
            .select('id, name, avatar_url, position, email')
            .order('name');
            
          if (employeesError) throw employeesError;
          
          setMembers(employeesData || []);
        } else {
          // 获取频道成员
          const { data: membersData, error: membersError } = await supabase
            .from('channel_members')
            .select(`
              member_id,
              employee:employees!inner(id, name, avatar_url, position, email)
            `)
            .eq('channel_id', channelId);
            
          if (membersError) throw membersError;
          
          // 转换数据结构 - 修复类型错误
          const formattedMembers = membersData?.map(item => ({
            id: item.employee.id,
            name: item.employee.name,
            avatar_url: item.employee.avatar_url,
            position: item.employee.position,
            email: item.employee.email
          })) || [];
          
          setMembers(formattedMembers);
        }
      } catch (error) {
        console.error('获取频道成员失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [isOpen, channelId]);
  
  if (!isOpen) return null;
  
  // 过滤成员列表
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.position && member.position.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {channelName ? `${channelName} - 成员` : '频道成员'}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filteredMembers.length})
            </span>
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索成员..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex justify-center items-center h-20 text-blue-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              加载成员中...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-center">没有找到匹配的成员</p>
            </div>
          ) : (
            <ul className="space-y-1 px-1">
              {filteredMembers.map(member => (
                <li key={member.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white truncate">{member.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.position || '未设置职位'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelMembersModal; 