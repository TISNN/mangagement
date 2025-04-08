import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Plus, 
  Search, 
  Hash, 
  Lock, 
  MoreVertical, 
  PaperclipIcon,
  Smile,
  User,
  Bell,
  Users,
  Settings,
  Loader,
  MessageCircle,
  MessageSquare,
  UserPlus,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../../supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import '../../styles/TeamChat.css';
import CreateChannelModal from '../../components/CreateChannelModal';
import ChannelMembersModal from '../../components/ChannelMembersModal';

// 频道类型定义
interface Channel {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  created_at: string;
  is_public: boolean;
  type: 'channel' | 'direct'; // 添加类型字段
  display_name?: string; // 显示名称（用于私聊显示对方名称）
  unread_count?: number; // 未读消息数
}

// 消息类型定义
interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: number;
  sender_name?: string;
  sender_avatar_url?: string;
  attachments?: any;
  channel_id: string;
  sender?: Employee;
}

// 员工类型定义
interface Employee {
  id: number;
  name: string;
  avatar_url: string;
  position: string;
  email: string;
}

const TeamChatPage: React.FC = () => {
  // 状态管理
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'direct'>('channels');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 获取当前用户信息
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: employeeData, error } = await supabase
            .from('employees')
            .select('*')
            .eq('email', user.email)
            .single();
            
          if (error) {
            console.error('获取当前用户失败:', error);
            return;
          }
          
          setCurrentUser(employeeData);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };
    
    getCurrentUser();
  }, []);
  
  // 获取所有聊天和会话
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchConversations = async () => {
      try {
        // 使用会话视图获取所有频道和私聊
        const { data, error } = await supabase
          .from('user_conversations')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('updated_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // 转换数据格式以匹配Channel接口
        const conversationsData = data.map(conv => ({
          id: conv.id,
          name: conv.name,
          display_name: conv.display_name,
          description: conv.description,
          is_private: conv.is_private,
          is_public: !conv.is_private,
          created_at: conv.created_at,
          type: conv.type,
          unread_count: conv.unread_count || 0
        }));
        
        setChannels(conversationsData || []);
        if (conversationsData && conversationsData.length > 0 && !activeChannel) {
          setActiveChannel(conversationsData[0]);
        }
      } catch (error) {
        console.error('获取聊天和会话失败:', error);
      }
    };
    
    fetchConversations();
  }, [currentUser, activeChannel]);
  
  // 获取所有员工信息
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, avatar_url, position, email');
          
        if (error) {
          throw error;
        }
        
        setEmployees(data || []);
      } catch (error) {
        console.error('获取员工信息失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  // 获取活动频道的消息并设置实时订阅
  useEffect(() => {
    if (!activeChannel || !currentUser) return;
    
    setLoading(true);
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('channel_id', activeChannel.id)
          .order('created_at', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        // 在消息中添加发送者信息
        const messagesWithSenders = await Promise.all(
          (data || []).map(async (message) => {
            const sender = employees.find(emp => emp.id === message.sender_id);
            return { ...message, sender };
          })
        );
        
        setMessages(messagesWithSenders);
        
        // 清除未读消息计数
        if (activeChannel.unread_count && activeChannel.unread_count > 0) {
          updateUnreadCount(activeChannel.id, 0);
        }
      } catch (error) {
        console.error('获取消息失败:', error);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };
    
    fetchMessages();
    
    // 设置实时订阅
    const subscription = supabase
      .channel(`channel-${activeChannel.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel_id=eq.${activeChannel.id}`
      }, async (payload) => {
        const newMessage = payload.new as Message;
        const sender = employees.find(emp => emp.id === newMessage.sender_id);
        
        // 如果消息不是当前用户发送的，更新未读消息计数
        if (newMessage.sender_id !== currentUser.id) {
          updateUnreadCount(activeChannel.id, 1, true);  // 增加未读消息计数
        }
        
        setMessages(prev => [...prev, { ...newMessage, sender }]);
        scrollToBottom();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [activeChannel, employees, currentUser]);
  
  // 更新未读消息计数
  const updateUnreadCount = async (channelId: string, count: number, increment: boolean = false) => {
    if (!currentUser) return;
    
    try {
      // 首先检查是否存在记录
      const { data: existingRecord, error: fetchError } = await supabase
        .from('unread_messages')
        .select('id, count')
        .eq('user_id', currentUser.id)
        .eq('channel_id', channelId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 是"没有找到记录"错误
        console.error('检查未读消息记录失败:', fetchError);
        return;
      }
      
      if (existingRecord) {
        // 更新已有记录
        const newCount = increment ? existingRecord.count + count : count;
        
        const { error: updateError } = await supabase
          .from('unread_messages')
          .update({ count: newCount, last_read_at: new Date().toISOString() })
          .eq('id', existingRecord.id);
        
        if (updateError) {
          throw updateError;
        }
      } else {
        // 创建新记录
        const { error: insertError } = await supabase
          .from('unread_messages')
          .insert([{
            user_id: currentUser.id,
            channel_id: channelId,
            count: count
          }]);
        
        if (insertError) {
          throw insertError;
        }
      }
      
      // 更新本地状态
      setChannels(channels => channels.map(channel => 
        channel.id === channelId 
          ? { 
              ...channel, 
              unread_count: increment ? (channel.unread_count || 0) + count : count 
            }
          : channel
      ));
    } catch (error) {
      console.error('更新未读消息计数失败:', error);
    }
  };
  
  // 自动滚动到最新消息
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // 发送新消息
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel || !currentUser) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            channel_id: activeChannel.id,
            sender_id: currentUser.id,
            content: newMessage.trim()
          }
        ]);
        
      if (error) {
        throw error;
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };
  
  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // 开始私聊
  const startDirectMessage = async (employeeId: number) => {
    if (!currentUser) return;
    
    try {
      // 调用存储过程获取或创建私聊频道
      const { data, error } = await supabase
        .rpc('get_or_create_dm_channel', {
          user1_id: currentUser.id,
          user2_id: employeeId
        });
      
      if (error) {
        throw error;
      }
      
      // 刷新会话列表
      const { data: conversationsData, error: convError } = await supabase
        .from('user_conversations')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('updated_at', { ascending: false });
      
      if (convError) {
        throw convError;
      }
      
      // 转换数据格式
      const conversations = conversationsData.map(conv => ({
        id: conv.id,
        name: conv.name,
        display_name: conv.display_name,
        description: conv.description,
        is_private: conv.is_private,
        is_public: !conv.is_private,
        created_at: conv.created_at,
        type: conv.type,
        unread_count: conv.unread_count || 0
      }));
      
      setChannels(conversations);
      
      // 设置新的直接消息频道为活动频道
      const newDmChannel = conversations.find(c => c.id === data);
      if (newDmChannel) {
        setActiveChannel(newDmChannel);
        setActiveTab('direct');
      }
      
      // 关闭用户列表
      setIsUserListOpen(false);
    } catch (error) {
      console.error('创建私聊失败:', error);
    }
  };
  
  // 过滤频道和私聊列表
  const filteredChannels = channels.filter(channel =>
    (activeTab === 'channels' ? channel.type === 'channel' : channel.type === 'direct') &&
    (channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     channel.display_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <>
      <div className="team-chat-container">
        {/* 频道侧边栏 */}
        <div className="channels-sidebar">
          <div className="channels-header">
            <h2>消息中心</h2>
          </div>
          
          <div className="search-container">
            <div className="flex">
              <input
                type="text"
                className="search-input flex-1"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="new-channel-btn ml-2"
                onClick={() => activeTab === 'channels' ? setIsCreateChannelModalOpen(true) : setIsUserListOpen(true)}
                title={activeTab === 'channels' ? "创建新频道" : "开始新对话"}
              >
                {activeTab === 'channels' ? <Plus size={18} /> : <UserPlus size={18} />}
              </button>
            </div>
          </div>
          
          {/* 标签切换：频道/私聊 */}
          <div className="tabs-container">
            <button 
              className={`tab ${activeTab === 'channels' ? 'active' : ''}`}
              onClick={() => setActiveTab('channels')}
            >
              <Hash size={16} />
              <span>频道</span>
            </button>
            <button 
              className={`tab ${activeTab === 'direct' ? 'active' : ''}`}
              onClick={() => setActiveTab('direct')}
            >
              <MessageSquare size={16} />
              <span>私聊</span>
            </button>
          </div>
          
          <div className="channels-list">
            {filteredChannels.map(channel => (
              <div
                key={channel.id}
                className={`channel-item ${activeChannel?.id === channel.id ? 'active' : ''}`}
                onClick={() => setActiveChannel(channel)}
              >
                <div className="channel-icon">
                  {channel.type === 'direct' ? 
                    <MessageSquare size={18} /> : 
                    (channel.is_public ? <Hash size={18} /> : <Lock size={18} />)
                  }
                </div>
                <div className="channel-name">
                  {channel.type === 'direct' ? channel.display_name : channel.name}
                </div>
                {channel.unread_count ? (
                  <div className="unread-badge">
                    {channel.unread_count > 99 ? '99+' : channel.unread_count}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          
          {/* 用户列表弹出框 */}
          {isUserListOpen && (
            <div className="user-list-modal">
              <div className="user-list-header">
                <h3>选择联系人</h3>
                <button 
                  className="close-btn"
                  onClick={() => setIsUserListOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="user-list">
                {employees
                  .filter(emp => emp.id !== currentUser?.id)
                  .map(employee => (
                    <div 
                      key={employee.id} 
                      className="user-item"
                      onClick={() => startDirectMessage(employee.id)}
                    >
                      <div className="user-avatar">
                        {employee.avatar_url ? (
                          <img 
                            src={employee.avatar_url} 
                            alt={employee.name} 
                          />
                        ) : (
                          employee.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{employee.name}</div>
                        <div className="user-position">{employee.position || '员工'}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        
        {/* 聊天主界面 */}
        <div className="chat-main">
          {activeChannel ? (
            <>
              <div className="chat-header">
                <div className="chat-header-title">
                  {activeChannel.type === 'direct' ? (
                    <MessageSquare size={20} />
                  ) : (
                    activeChannel.is_public ? <Hash size={20} /> : <Lock size={20} />
                  )}
                  {activeChannel.type === 'direct' ? activeChannel.display_name : activeChannel.name}
                  {activeChannel.description && (
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                      {activeChannel.description}
                    </span>
                  )}
                </div>
                <div className="chat-header-actions">
                  {activeChannel.type === 'channel' && (
                    <button 
                      className="chat-header-action" 
                      title="查看成员"
                      onClick={() => setIsMembersModalOpen(true)}
                    >
                      <User size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="messages-container">
                {loading ? (
                  <div className="loading-container">
                    <Loader className="spinner" />
                    <span className="ml-2">加载消息中...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="empty-state">
                    <MessageCircle className="empty-state-icon" />
                    <p>还没有消息，成为第一个发言的人吧！</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isSelf = message.sender_id === currentUser?.id;
                    const isFirstMessageFromUser = index === 0 || 
                      messages[index - 1].sender_id !== message.sender_id;
                    
                    // 如果是同一用户的连续消息，不显示头像和名称
                    return (
                      <div key={message.id} className={`message ${isSelf ? 'self' : ''} ${!isFirstMessageFromUser ? 'follow-up' : ''}`}>
                        {isFirstMessageFromUser && (
                          <div className="message-avatar">
                            {message.sender?.avatar_url ? (
                              <img
                                src={message.sender.avatar_url}
                                alt={message.sender.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              message.sender?.name.charAt(0).toUpperCase() || '?'
                            )}
                          </div>
                        )}
                        {!isFirstMessageFromUser && <div className="message-spacer"></div>}
                        <div className="message-content-wrapper">
                          {isFirstMessageFromUser && !isSelf && (
                            <div className="message-sender">{message.sender?.name || '未知用户'}</div>
                          )}
                          <div className="message-content">
                            <div className="message-text">{message.content}</div>
                            <div className="message-time">
                              {format(new Date(message.created_at), 'HH:mm')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="message-input-container">
                <textarea
                  className="message-input"
                  placeholder={currentUser ? "输入消息..." : "请登录后发送消息"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!currentUser}
                />
                <button
                  className="send-button"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !currentUser}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <MessageCircle className="empty-state-icon" />
              <p>请选择一个频道或对话开始聊天</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 创建频道模态框 */}
      <CreateChannelModal 
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onSuccess={() => {
          // 成功创建频道后刷新频道列表
          if (!currentUser) return;
          const fetchConversations = async () => {
            try {
              const { data, error } = await supabase
                .from('user_conversations')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('updated_at', { ascending: false });
                
              if (error) {
                throw error;
              }
              
              // 转换数据格式
              const conversationsData = data.map(conv => ({
                id: conv.id,
                name: conv.name,
                display_name: conv.display_name,
                description: conv.description,
                is_private: conv.is_private,
                is_public: !conv.is_private,
                created_at: conv.created_at,
                type: conv.type,
                unread_count: conv.unread_count || 0
              }));
              
              setChannels(conversationsData || []);
              
              // 设置新创建的频道为活动频道
              const newChannels = conversationsData.filter(c => c.type === 'channel');
              if (newChannels.length > 0) {
                setActiveChannel(newChannels[0]);
                setActiveTab('channels');
              }
            } catch (error) {
              console.error('获取聊天频道失败:', error);
            }
          };
          
          fetchConversations();
        }}
      />
      
      {/* 查看频道成员模态框 */}
      <ChannelMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        channelId={activeChannel?.id || null}
        channelName={activeChannel?.name || ''}
      />
    </>
  );
};

export default TeamChatPage; 