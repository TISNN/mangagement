import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { peopleService, syncService } from '../services';
import { StudentDisplay } from '../pages/admin/StudentsPage/StudentsPage';
import { ServiceType } from '../types/service';

// 导入服务类型类型（如果需要的话）
// 这里声明一个接口，匹配peopleService返回的服务类型
interface ServiceTypeData {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

// 定义上下文状态类型
interface DataContextType {
  // 学生数据
  students: StudentDisplay[];
  loadingStudents: boolean;
  refreshStudents: () => Promise<void>;
  
  // 服务类型数据
  serviceTypes: ServiceTypeData[]; // 修改为ServiceTypeData类型
  loadingServiceTypes: boolean;
  refreshServiceTypes: () => Promise<void>;
  
  // 通用刷新方法
  refreshAll: () => Promise<void>;
}

// 创建上下文
const DataContext = createContext<DataContextType | undefined>(undefined);

// 上下文提供者组件
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 状态定义
  const [students, setStudents] = useState<StudentDisplay[]>([]);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeData[]>([]); // 修改为ServiceTypeData类型
  const [loadingServiceTypes, setLoadingServiceTypes] = useState<boolean>(true);
  
  // 订阅ID引用，用于在组件卸载时清理订阅
  const subscriptionIds = useRef<string[]>([]);
  
  // 添加订阅并跟踪订阅ID
  const addSubscription = useCallback((id: string) => {
    subscriptionIds.current.push(id);
  }, []);
  
  // 获取学生数据
  const fetchStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      const data = await peopleService.getAllStudentsFromView();
      console.log('获取到学生数据原始内容:', data);
      
      // 处理学生数据
      const studentDisplays: StudentDisplay[] = await Promise.all(
        data.map(async (student) => {
          // 获取学生服务
          const services = await peopleService.getStudentServices(student.id);
          
          // 构建StudentDisplay对象
          const studentDisplay = {
            id: student.id.toString(),
            person_id: student.id,
            name: student.name,
            email: student.email || '',
            avatar: student.avatar_url || 
              `https://api.dicebear.com/7.x/lorelei/svg?seed=${student.name}&backgroundColor=${
                // @ts-expect-error student可能有gender属性
                student.gender === '男' ? 'b6e3f4' : 
                // @ts-expect-error student可能有gender属性
                student.gender === '女' ? 'ffdfbf' : 'c0aede'
              }&gender=${
                // @ts-expect-error student可能有gender属性
                student.gender === '男' ? 'male' : 
                // @ts-expect-error student可能有gender属性
                student.gender === '女' ? 'female' : 'neutral'
              }`,
            enrollmentDate: student.created_at ? student.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            // 优先使用status字段，如果不存在则根据is_active字段推断
            status: student.status || (student.is_active ? '活跃' : '休学'),
            // 添加学校和教育水平
            school: student.school || '',
            education_level: student.education_level || '',
            // 添加其他学生信息
            major: student.major || '',
            graduation_year: student.graduation_year,
            // 添加地理位置信息
            location: student.location || '',
            address: student.address || '',
            // 添加联系信息
            contact: student.contact || '',
            services: services.map(service => ({
              id: service.id.toString(),
              serviceType: (service.service_type?.name || '未知服务') as ServiceType,
              status: service.status === 'in_progress' ? '进行中' : 
                      service.status === 'completed' ? '已完成' : 
                      service.status === 'on_hold' ? '已暂停' : 
                      service.status === 'cancelled' ? '已取消' : '未开始',
              enrollmentDate: service.enrollment_date,
              endDate: service.end_date,
              mentors: service.mentor ? [
                {
                  id: service.mentor.id.toString(),
                  name: service.mentor.name || '未知导师',
                  avatar: service.mentor.avatar_url || `https://randomuser.me/api/portraits/men/${service.mentor.id}.jpg`,
                  roles: service.mentor.specializations || ['导师'],
                  isPrimary: true
                }
              ] : []
            }))
          };
          
          console.log(`学生${student.id}(${student.name})的状态:`, {
            原始status: student.status,
            is_active: student.is_active,
            最终状态: studentDisplay.status
          });
          
          return studentDisplay;
        })
      );
      
      setStudents(studentDisplays);
    } catch (error) {
      console.error('获取学生数据失败:', error);
    } finally {
      setLoadingStudents(false);
    }
  }, []);
  
  // 获取服务类型数据
  const fetchServiceTypes = useCallback(async () => {
    try {
      setLoadingServiceTypes(true);
      const data = await peopleService.getAllServiceTypes();
      console.log('获取到服务类型:', data.length);
      setServiceTypes(data);
    } catch (error) {
      console.error('获取服务类型失败:', error);
    } finally {
      setLoadingServiceTypes(false);
    }
  }, []);
  
  // 刷新所有数据
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchStudents(),
      fetchServiceTypes()
    ]);
  }, [fetchStudents, fetchServiceTypes]);
  
  // 初始化数据和订阅
  useEffect(() => {
    // 初始加载数据
    refreshAll();
    
    // 设置学生数据订阅
    const studentSub = syncService.subscribe(
      'students',
      '*',
      (payload) => {
        console.log('学生数据变化:', payload);
        fetchStudents(); // 简单重新获取所有数据
      }
    );
    addSubscription(studentSub);
    
    // 设置学生服务订阅
    const serviceSub = syncService.subscribe(
      'student_services',
      '*',
      (payload) => {
        console.log('学生服务数据变化:', payload);
        fetchStudents(); // 服务变化也需要刷新学生数据
      }
    );
    addSubscription(serviceSub);
    
    // 设置服务类型订阅
    const serviceTypeSub = syncService.subscribe(
      'service_types',
      '*',
      (payload) => {
        console.log('服务类型数据变化:', payload);
        fetchServiceTypes();
      }
    );
    addSubscription(serviceTypeSub);
    
    // 清理函数
    return () => {
      // 清理所有订阅
      subscriptionIds.current.forEach(id => {
        syncService.unsubscribe(id);
      });
    };
  }, [addSubscription, fetchStudents, fetchServiceTypes, refreshAll]);
  
  // 上下文值
  const contextValue: DataContextType = {
    students,
    loadingStudents,
    refreshStudents: fetchStudents,
    
    serviceTypes,
    loadingServiceTypes,
    refreshServiceTypes: fetchServiceTypes,
    
    refreshAll
  };
  
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// 自定义Hook，用于在组件中访问上下文
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext必须在DataProvider内部使用');
  }
  return context;
}; 