import { StudentDisplay } from '../pages/admin/StudentsPage/StudentsPage';

// 数据导出工具类

// 将学生数据导出为CSV格式
export const exportStudentsToCSV = (students: StudentDisplay[]) => {
  // 定义CSV列头
  const headers = [
    '姓名',
    '邮箱',
    '状态',
    '入学日期',
    '服务数量',
    '服务类型',
    '服务状态'
  ];
  
  // 将学生数据转换为CSV行
  const rows = students.map(student => {
    // 基础学生信息
    const basicInfo = [
      student.name,
      student.email || '',
      student.status,
      formatDate(student.enrollmentDate),
      student.services.length.toString()
    ];
    
    // 服务信息（以逗号分隔的字符串形式）
    const servicesInfo = student.services.map(service => service.serviceType).join(', ');
    const servicesStatus = student.services.map(service => service.status).join(', ');
    
    return [...basicInfo, servicesInfo, servicesStatus];
  });
  
  // 创建CSV内容
  const csvContent = [
    headers.join(','), // 表头
    ...rows.map(row => row.join(',')) // 数据行
  ].join('\n');
  
  return csvContent;
};

// 导出为更详细的CSV格式，分别包含学生信息和服务信息
export const exportStudentsDetailToCSV = (students: StudentDisplay[]) => {
  // 学生信息CSV
  const studentHeaders = [
    'ID',
    '姓名',
    '邮箱',
    '状态',
    '入学日期',
    '服务数量'
  ];
  
  const studentRows = students.map(student => [
    student.id,
    student.name,
    student.email || '',
    student.status,
    formatDate(student.enrollmentDate),
    student.services.length.toString()
  ]);
  
  const studentCsv = [
    studentHeaders.join(','),
    ...studentRows.map(row => row.map(escapeCSVValue).join(','))
  ].join('\n');
  
  // 服务信息CSV
  const serviceHeaders = [
    '学生ID',
    '学生姓名',
    '服务ID',
    '服务类型',
    '服务状态',
    '开始日期',
    '结束日期',
    '服务时长',
    '导师数量',
    '主导师'
  ];
  
  const serviceRows: string[][] = [];
  
  students.forEach(student => {
    student.services.forEach(service => {
      const primaryMentor = service.mentors.find(m => m.isPrimary)?.name || '';
      
      serviceRows.push([
        student.id,
        student.name,
        service.id,
        service.serviceType,
        service.status,
        formatDate(service.enrollmentDate),
        service.endDate ? formatDate(service.endDate) : '',
        calculateServiceDuration(service.enrollmentDate, service.endDate),
        service.mentors.length.toString(),
        primaryMentor
      ]);
    });
  });
  
  const serviceCsv = [
    serviceHeaders.join(','),
    ...serviceRows.map(row => row.map(escapeCSVValue).join(','))
  ].join('\n');
  
  return { studentCsv, serviceCsv };
};

// 下载CSV文件
export const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// 计算服务时长
const calculateServiceDuration = (startDate: string, endDate?: string) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays}天`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}个月`;
  }
  
  const years = Math.floor(diffDays / 365);
  const remainingMonths = Math.floor((diffDays % 365) / 30);
  return remainingMonths > 0 ? `${years}年${remainingMonths}个月` : `${years}年`;
};

// 处理CSV值，确保包含逗号、引号和换行符的值正确转义
const escapeCSVValue = (value: string) => {
  // 如果值包含引号、逗号或换行符，则用引号包裹，并将内部的引号替换为两个引号
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}; 