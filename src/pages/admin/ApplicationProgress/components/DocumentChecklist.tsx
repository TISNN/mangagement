/**
 * 申请材料清单组件
 */

import React from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { ApplicationDocument } from '../types';
import { formatDate } from '../../../../utils/dateUtils';

interface DocumentChecklistProps {
  documents: ApplicationDocument[];
}

export default function DocumentChecklist({ documents }: DocumentChecklistProps) {
  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">申请材料清单</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无材料清单</p>
      </div>
    );
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case '已完成':
      case '已提交':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case '进行中':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case '未完成':
        return <FileText className="h-5 w-5 text-gray-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30';
      case '已提交':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30';
      case '进行中':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30';
      case '未完成':
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/10 dark:border-gray-700';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/10 dark:border-gray-700';
    }
  };

  // 计算总体进度
  const totalDocuments = documents.length;
  const completedDocuments = documents.filter(doc => 
    doc.status === '已完成' || doc.status === '已提交'
  ).length;
  const overallProgress = totalDocuments > 0 ? Math.round((completedDocuments / totalDocuments) * 100) : 0;

  // 检查是否有紧急任务(7天内到期且未完成)
  const urgentDocuments = documents.filter(doc => {
    if (!doc.due_date || doc.status === '已完成' || doc.status === '已提交') return false;
    const dueDate = new Date(doc.due_date);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold dark:text-white">申请材料清单</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedDocuments}/{totalDocuments} 已完成
          </span>
        </div>
      </div>

      {/* 总体进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">总体进度</span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{overallProgress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* 紧急提醒 */}
      {urgentDocuments.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {urgentDocuments.length} 个材料即将到期
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              请尽快完成以下材料准备
            </p>
          </div>
        </div>
      )}

      {/* 材料列表 */}
      <div className="space-y-3">
        {documents.map((doc) => {
          const isUrgent = urgentDocuments.some(ud => ud.id === doc.id);
          const progress = doc.progress || 0;
          
          return (
            <div 
              key={doc.id}
              className={`p-4 border rounded-lg ${getStatusColor(doc.status)} ${
                isUrgent ? 'ring-2 ring-red-300 dark:ring-red-700' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(doc.status)}
                <div className="flex-1">
                  {/* 标题和状态 */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm dark:text-white flex items-center gap-2">
                        {doc.document_name}
                        {doc.is_required && (
                          <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                            必需
                          </span>
                        )}
                        {isUrgent && (
                          <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                            紧急
                          </span>
                        )}
                      </h3>
                      {doc.document_type && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">{doc.document_type}</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      doc.status === '已完成' || doc.status === '已提交'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : doc.status === '进行中'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {doc.status || '未完成'}
                    </span>
                  </div>

                  {/* 进度条(如果进行中) */}
                  {doc.status === '进行中' && progress > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">完成度</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* 日期信息 */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    {doc.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>截止: {formatDate(doc.due_date)}</span>
                      </div>
                    )}
                    {doc.completed_date && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>完成: {formatDate(doc.completed_date)}</span>
                      </div>
                    )}
                  </div>

                  {/* 备注 */}
                  {doc.notes && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{doc.notes}</p>
                  )}

                  {/* 文件链接 */}
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      📎 查看文件
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

