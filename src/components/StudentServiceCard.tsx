import React, { useState } from 'react';
import { MoreHorizontal, Languages, BookOpen, Award, PenTool, Book, FileCheck, Layers, Briefcase, TrendingUp } from 'lucide-react';
import { ServiceType, getServiceStatusStyle } from '../types/service';
import { formatDate } from '../utils/dateUtils';
import ServiceProgressModal from './ServiceProgressModal';

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  roles: string[];
  isPrimary?: boolean;
}

interface StudentServiceProps {
  id: string;
  serviceType: ServiceType;
  standardizedTestType?: string;
  status: string;
  enrollmentDate: string;
  endDate?: string;
  progress?: number;
  mentors: Mentor[];
  fee?: string;
  paymentStatus?: string;
  onClick?: () => void;
  onProgressUpdated?: () => void;
}

const StudentServiceCard: React.FC<StudentServiceProps> = ({
  id,
  serviceType,
  standardizedTestType,
  status,
  enrollmentDate,
  endDate,
  progress = 0,
  mentors,
  fee,
  paymentStatus,
  onClick,
  onProgressUpdated
}) => {
  const [showProgressModal, setShowProgressModal] = useState(false);

  // 服务类型图标
  const getServiceIcon = () => {
    switch (serviceType) {
      case '语言培训':
        return <Languages className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case '标化培训':
        return <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case '全包申请':
        return <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case '半DIY申请':
        return <Layers className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case '研学':
        return <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case '课业辅导':
        return <Book className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case '科研指导':
        return <FileCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      case '作品集辅导':
        return <PenTool className="h-5 w-5 text-pink-600 dark:text-pink-400" />;
      default:
        return <FileCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  // 计算服务时长
  const calculateServiceDuration = () => {
    const start = new Date(enrollmentDate);
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

  // 处理进度更新
  const handleProgressUpdate = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发点击卡片事件
    setShowProgressModal(true);
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${status === '进行中' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              {getServiceIcon()}
            </div>
            <div>
              <h4 className="text-lg font-semibold dark:text-white">
                {serviceType}
                {standardizedTestType && ` (${standardizedTestType})`}
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                {formatDate(enrollmentDate)} 
                {endDate ? ` 至 ${formatDate(endDate)}` : ' 至今'}
                {' · '}
                {calculateServiceDuration()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getServiceStatusStyle(status)}`}>
              {status}
            </span>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50">
          {fee && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">服务费用</p>
              <p className="font-semibold dark:text-white">¥{fee}</p>
            </div>
          )}
          
          {paymentStatus && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">缴费状态</p>
              <p className="font-semibold dark:text-white">{paymentStatus}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">服务进度</p>
            <div className="flex items-center gap-2">
              <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600">
                <div 
                  className="h-2 bg-blue-500 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium dark:text-white">{progress}%</span>
            </div>
          </div>
        </div>
        
        {mentors.length > 0 && (
          <div className="mt-4">
            <h5 className="font-semibold mb-3 dark:text-white">负责导师</h5>
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name} 
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium dark:text-white">
                        {mentor.name}
                        {mentor.isPrimary && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                            主导师
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {mentor.roles.join('、')}
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    联系导师
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 dark:bg-gray-700/50 dark:border-gray-700">
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          查看详情
        </button>
        <button 
          onClick={handleProgressUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          更新进度
        </button>
      </div>

      {/* 进度更新模态框 */}
      <ServiceProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onProgressUpdated={() => {
          if (onProgressUpdated) {
            onProgressUpdated();
          }
          if (onClick) {
            onClick();
          }
        }}
        serviceId={parseInt(id)}
        currentProgress={progress}
        serviceName={serviceType}
      />
    </div>
  );
};

export default StudentServiceCard; 