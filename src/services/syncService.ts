import { supabase } from '../lib/supabase';

// 回调函数类型定义
type DataChangeCallback = (payload: any) => void;

// 定义表名类型，确保只允许订阅系统中存在的表
type TableName = 
  | 'students' 
  | 'student_services' 
  | 'service_types' 
  | 'mentors'
  | 'service_progress'
  | 'finance_transactions';

// 定义事件类型
type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// 存储所有活跃订阅
interface Subscription {
  id: string;
  table: TableName;
  event: ChangeEvent;
  callback: DataChangeCallback;
  filter?: string;
}

export class SyncService {
  private subscriptions: Map<string, Subscription> = new Map();
  private activeChannels: Map<string, any> = new Map();
  
  /**
   * 订阅数据表的变化
   * @param table 要订阅的表名
   * @param event 事件类型：INSERT, UPDATE, DELETE 或 * (所有事件)
   * @param callback 当数据变化时调用的回调函数
   * @param filter 可选的过滤条件，例如 "id=eq.123"
   * @returns 订阅ID，用于后续取消订阅
   */
  subscribe(
    table: TableName, 
    event: ChangeEvent, 
    callback: DataChangeCallback, 
    filter?: string
  ): string {
    const subscriptionId = `${table}_${event}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[SyncService] 开始订阅: ${table} 表的 ${event} 事件, ID: ${subscriptionId}`);
    
    const events = event === '*' ? ['INSERT', 'UPDATE', 'DELETE'] : [event];
    
    const channel = supabase
      .channel(subscriptionId)
      .on('postgres_changes', {
        event: events as any,
        schema: 'public',
        table,
        ...(filter ? { filter: filter } : {})
      }, (payload) => {
        console.log(`[SyncService] 接收到 ${table} 表的 ${payload.eventType} 事件:`, payload);
        callback(payload);
      })
      .subscribe((status) => {
        console.log(`[SyncService] 订阅 ${table} 状态:`, status);
        if (status === 'SUBSCRIBED') {
          console.log(`[SyncService] 成功订阅 ${table} 表`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[SyncService] 订阅 ${table} 表失败`);
        }
      });
    
    // 存储订阅信息
    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      table,
      event,
      callback,
      filter
    });
    
    // 创建通道密钥
    const channelKey = `${table}_${event}${filter ? `_${filter}` : ''}`;
    
    // 如果此通道已存在，只需添加订阅，不需要创建新通道
    if (!this.activeChannels.has(channelKey)) {
      console.log(`创建新的实时数据通道: ${channelKey}`);
      
      // 创建Supabase通道
      const channel = supabase
        .channel(channelKey)
        .on(
          'postgres_changes',
          {
            event: event === '*' ? undefined : event,
            schema: 'public',
            table: table,
            ...(filter ? { filter: filter } : {})
          },
          (payload) => {
            // 通知所有此通道的订阅者
            this.subscriptions.forEach(subscription => {
              if (subscription.table === table && 
                  (subscription.event === '*' || subscription.event === payload.eventType) &&
                  (subscription.filter === filter || !subscription.filter)) {
                subscription.callback(payload);
              }
            });
          }
        )
        .subscribe((status) => {
          console.log(`通道 ${channelKey} 状态: ${status}`);
        });
      
      // 存储活跃通道
      this.activeChannels.set(channelKey, channel);
    }
    
    console.log(`已创建订阅: ${subscriptionId} 到 ${table}`);
    return subscriptionId;
  }
  
  /**
   * 取消特定订阅
   * @param subscriptionId 订阅ID
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      console.warn(`未找到订阅: ${subscriptionId}`);
      return;
    }
    
    // 从订阅列表中移除
    this.subscriptions.delete(subscriptionId);
    
    // 检查此表和事件是否还有其他订阅
    const hasOtherSubscriptions = Array.from(this.subscriptions.values()).some(
      s => s.table === subscription.table && 
           s.event === subscription.event &&
           s.filter === subscription.filter
    );
    
    // 如果没有其他订阅，关闭通道
    if (!hasOtherSubscriptions) {
      const channelKey = `${subscription.table}_${subscription.event}${subscription.filter ? `_${subscription.filter}` : ''}`;
      const channel = this.activeChannels.get(channelKey);
      
      if (channel) {
        console.log(`关闭通道: ${channelKey}`);
        supabase.removeChannel(supabase.channel(subscriptionId));
        this.activeChannels.delete(channelKey);
      }
    }
    
    console.log(`已取消订阅: ${subscriptionId}`);
  }
  
  /**
   * 取消组件的所有订阅
   * @param componentId 组件ID前缀
   */
  unsubscribeAll(componentId: string): void {
    const subscriptionsToRemove = Array.from(this.subscriptions.keys())
      .filter(id => id.startsWith(componentId));
    
    subscriptionsToRemove.forEach(id => this.unsubscribe(id));
  }

  /**
   * 获取所有活跃订阅
   * @returns 所有活跃订阅的列表
   */
  getActiveSubscriptions(): Record<string, {table: string, event: string, filter?: string}> {
    const result: Record<string, {table: string, event: string, filter?: string}> = {};
    
    this.subscriptions.forEach((subscription, id) => {
      result[id] = {
        table: subscription.table,
        event: subscription.event,
        filter: subscription.filter
      };
    });
    
    return result;
  }
} 