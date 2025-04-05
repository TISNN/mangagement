import React, { useState, useEffect, createContext, useContext } from 'react';
import { ClipboardCheck, Clock, BarChart3, Users, Search, Filter, ChevronDown } from 'lucide-react';

// 创建考勤上下文
interface AttendanceRecord {
  id: number;
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
  employeeId?: number;
  employeeName?: string;
  department?: string;
}

// 员工信息接口
interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  avatar: string;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  clockInStatus: boolean;
  setClockInStatus: React.Dispatch<React.SetStateAction<boolean>>;
  clockOutStatus: boolean;
  setClockOutStatus: React.Dispatch<React.SetStateAction<boolean>>;
  handleClockIn: () => void;
  handleClockOut: () => void;
  employees: Employee[];
  teamAttendanceRecords: AttendanceRecord[];
}

export const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// 提供者组件
export const AttendanceProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // 模拟员工数据
  const employeesList: Employee[] = [
    { id: 1, name: 'Evan Xu', department: '管理层', position: 'CEO', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: '李明', department: '技术部', position: '技术总监', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: '王霞', department: '人事部', position: '人事经理', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: 4, name: '张伟', department: '技术部', position: '高级工程师', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 5, name: '赵丽', department: '市场部', position: '市场总监', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { id: 6, name: '刘洋', department: '销售部', position: '销售经理', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
  ];

  // 模拟个人考勤记录
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, date: '2023-09-10', clockIn: '09:05', clockOut: '18:15', status: '正常' },
    { id: 2, date: '2023-09-11', clockIn: '08:50', clockOut: '18:10', status: '正常' },
    { id: 3, date: '2023-09-12', clockIn: '09:20', clockOut: '18:05', status: '迟到' },
    { id: 4, date: '2023-09-13', clockIn: '08:55', clockOut: '17:30', status: '早退' },
    { id: 5, date: '2023-09-14', clockIn: '08:58', clockOut: '18:30', status: '正常' },
  ]);

  // 模拟团队考勤记录
  const teamAttendanceData: AttendanceRecord[] = [
    { id: 101, employeeId: 2, employeeName: '李明', department: '技术部', date: '2023-09-14', clockIn: '08:45', clockOut: '18:20', status: '正常' },
    { id: 102, employeeId: 3, employeeName: '王霞', department: '人事部', date: '2023-09-14', clockIn: '08:50', clockOut: '18:15', status: '正常' },
    { id: 103, employeeId: 4, employeeName: '张伟', department: '技术部', date: '2023-09-14', clockIn: '09:10', clockOut: '18:30', status: '迟到' },
    { id: 104, employeeId: 5, employeeName: '赵丽', department: '市场部', date: '2023-09-14', clockIn: '08:55', clockOut: '17:45', status: '正常' },
    { id: 105, employeeId: 6, employeeName: '刘洋', department: '销售部', date: '2023-09-14', clockIn: '08:40', clockOut: '19:00', status: '正常' },
    { id: 106, employeeId: 2, employeeName: '李明', department: '技术部', date: '2023-09-13', clockIn: '08:55', clockOut: '18:10', status: '正常' },
    { id: 107, employeeId: 3, employeeName: '王霞', department: '人事部', date: '2023-09-13', clockIn: '09:20', clockOut: '18:05', status: '迟到' },
    { id: 108, employeeId: 4, employeeName: '张伟', department: '技术部', date: '2023-09-13', clockIn: '08:50', clockOut: '17:30', status: '早退' },
    { id: 109, employeeId: 5, employeeName: '赵丽', department: '市场部', date: '2023-09-13', clockIn: '09:30', clockOut: '18:20', status: '迟到' },
    { id: 110, employeeId: 6, employeeName: '刘洋', department: '销售部', date: '2023-09-13', clockIn: '08:45', clockOut: '18:45', status: '正常' },
  ];

  const [clockInStatus, setClockInStatus] = useState(false);
  const [clockOutStatus, setClockOutStatus] = useState(false);

  const handleClockIn = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    
    // 检查今天是否已打卡
    const todayRecord = attendanceRecords.find(record => record.date === today);
    
    if (todayRecord) {
      alert('今天已经打过上班卡了');
      return;
    }
    
    // 添加新打卡记录
    const newRecord = {
      id: attendanceRecords.length + 1,
      date: today,
      clockIn: time,
      clockOut: '',
      status: time > '09:00' ? '迟到' : '正常'
    };
    
    setAttendanceRecords([...attendanceRecords, newRecord]);
    setClockInStatus(true);
    alert(`打卡成功！时间: ${time}`);
  };

  const handleClockOut = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    
    // 检查今天是否已打上班卡
    const todayRecordIndex = attendanceRecords.findIndex(record => record.date === today);
    
    if (todayRecordIndex === -1) {
      alert('请先打上班卡');
      return;
    }
    
    if (attendanceRecords[todayRecordIndex].clockOut) {
      alert('今天已经打过下班卡了');
      return;
    }
    
    // 更新打卡记录
    const updatedRecords = [...attendanceRecords];
    updatedRecords[todayRecordIndex] = {
      ...updatedRecords[todayRecordIndex],
      clockOut: time,
      status: time < '18:00' ? '早退' : 
              updatedRecords[todayRecordIndex].status === '迟到' ? '迟到' : '正常'
    };
    
    setAttendanceRecords(updatedRecords);
    setClockOutStatus(true);
    alert(`打卡成功！时间: ${time}`);
  };

  useEffect(() => {
    // 检查今天是否已打卡
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const todayRecord = attendanceRecords.find(record => record.date === today);
    
    if (todayRecord) {
      setClockInStatus(true);
      setClockOutStatus(!!todayRecord.clockOut);
    } else {
      setClockInStatus(false);
      setClockOutStatus(false);
    }
  }, [attendanceRecords]);

  return (
    <AttendanceContext.Provider value={{
      attendanceRecords,
      setAttendanceRecords,
      clockInStatus,
      setClockInStatus,
      clockOutStatus,
      setClockOutStatus,
      handleClockIn,
      handleClockOut,
      employees: employeesList,
      teamAttendanceRecords: teamAttendanceData
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

// 自定义钩子用于访问上下文
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

const AttendancePage: React.FC = () => {
  const {
    attendanceRecords,
    clockInStatus,
    clockOutStatus,
    handleClockIn,
    handleClockOut,
    employees,
    teamAttendanceRecords
  } = useAttendance();

  // 视图模式：个人/团队
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('personal');
  
  // 筛选条件
  const [selectedDepartment, setSelectedDepartment] = useState<string>('全部');
  const [selectedDate, setSelectedDate] = useState<string>('本月');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  // 获取唯一的部门列表
  const departments = ['全部', ...new Set(employees.map(emp => emp.department))];

  // 筛选团队考勤记录
  const filteredTeamRecords = teamAttendanceRecords.filter(record => {
    // 部门筛选
    if (selectedDepartment !== '全部' && record.department !== selectedDepartment) {
      return false;
    }
    
    // 员工筛选
    if (selectedEmployee && record.employeeId !== selectedEmployee) {
      return false;
    }
    
    // 搜索查询
    if (searchQuery && !record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">考勤打卡</h1>
          <p className="text-gray-500 dark:text-gray-400">管理您的工作时间和出勤记录</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('personal')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'personal' ? 
              'bg-blue-500 text-white' : 
              'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            个人考勤
          </button>
          <button 
            onClick={() => setViewMode('team')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${viewMode === 'team' ? 
              'bg-blue-500 text-white' : 
              'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            <Users size={16} />
            团队考勤
          </button>
        </div>
      </div>

      {viewMode === 'personal' ? (
        <>
          {/* 个人考勤视图 */}
          
          {/* 打卡按钮区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">今日打卡</h2>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2 dark:text-white">
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handleClockIn}
                  disabled={clockInStatus}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white ${
                    clockInStatus ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <ClipboardCheck className="h-5 w-5" />
                  上班打卡
                </button>
                
                <button
                  onClick={handleClockOut}
                  disabled={!clockInStatus || clockOutStatus}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white ${
                    !clockInStatus || clockOutStatus ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  <ClipboardCheck className="h-5 w-5" />
                  下班打卡
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">本月统计</h2>
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">正常出勤</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">15天</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">迟到/早退</div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2天</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">加班</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">3天</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">请假</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">1天</div>
                </div>
              </div>
            </div>
          </div>

          {/* 个人打卡记录表格 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">个人打卡记录</h2>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option>本月</option>
                  <option>上月</option>
                  <option>最近3个月</option>
                </select>
                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                  导出记录
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">上班时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">下班时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">工时</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => {
                    // 计算工作时间
                    let workHours = '';
                    if (record.clockIn && record.clockOut) {
                      const clockInTime = new Date(`2023-01-01T${record.clockIn}:00`);
                      const clockOutTime = new Date(`2023-01-01T${record.clockOut}:00`);
                      const diffMs = clockOutTime.getTime() - clockInTime.getTime();
                      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      workHours = `${diffHrs}小时${diffMins}分钟`;
                    }
                    
                    return (
                      <tr key={record.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.clockIn}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.clockOut || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {workHours || '-'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.status === '正常' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            record.status === '迟到' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            record.status === '早退' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 团队考勤视图 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">团队考勤总览</h2>
              <div className="flex gap-2">
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select 
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option>本月</option>
                  <option>上月</option>
                  <option>最近3个月</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">员工人数</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedDepartment === '全部' ? employees.length : 
                   employees.filter(emp => emp.department === selectedDepartment).length}
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">正常出勤率</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">92%</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">迟到率</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">5%</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">早退率</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">3%</div>
              </div>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索员工姓名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">员工筛选:</span>
                <select 
                  value={selectedEmployee || ''}
                  onChange={(e) => setSelectedEmployee(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm min-w-[150px]"
                >
                  <option value="">全部员工</option>
                  {employees
                    .filter(emp => selectedDepartment === '全部' || emp.department === selectedDepartment)
                    .map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>
                    ))
                  }
                </select>
              </div>
              
              <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 whitespace-nowrap">
                导出统计
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">员工</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">部门</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">上班时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">下班时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">工时</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeamRecords.map((record) => {
                    // 计算工作时间
                    let workHours = '';
                    if (record.clockIn && record.clockOut) {
                      const clockInTime = new Date(`2023-01-01T${record.clockIn}:00`);
                      const clockOutTime = new Date(`2023-01-01T${record.clockOut}:00`);
                      const diffMs = clockOutTime.getTime() - clockInTime.getTime();
                      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      workHours = `${diffHrs}小时${diffMins}分钟`;
                    }
                    
                    // 查找员工信息
                    const employee = employees.find(emp => emp.id === record.employeeId);
                    
                    return (
                      <tr key={record.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <img 
                              src={employee?.avatar} 
                              alt={record.employeeName} 
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {record.employeeName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.department}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.clockIn}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {record.clockOut || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {workHours || '-'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.status === '正常' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            record.status === '迟到' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            record.status === '早退' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage; 