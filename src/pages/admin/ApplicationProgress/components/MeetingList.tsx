/**
 * 会议列表组件
 */

import React, { useState } from 'react';
import { Calendar, Clock, Users, FileText, Plus, Link as LinkIcon } from 'lucide-react';
import { StudentMeeting } from '../types';
import { formatDateTime } from '../../../../utils/dateUtils';
import AddMeetingModal from './AddMeetingModal';

interface MeetingListProps {
  meetings: StudentMeeting[];
  studentId: number;
  onAddMeeting?: (meeting: Partial<StudentMeeting>) => Promise<void>;
}

export default function MeetingList({ meetings, studentId, onAddMeeting }: MeetingListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const handleAddMeeting = async (meeting: Partial<StudentMeeting>) => {
    if (onAddMeeting) {
      await onAddMeeting(meeting);
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">会议记录</h2>
          {onAddMeeting && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              添加会议
            </button>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无会议记录</p>
        
        {/* 添加会议模态框 */}
        {showAddModal && (
          <AddMeetingModal
            studentId={studentId}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddMeeting}
          />
        )}
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case '进行中':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case '已安排':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case '已取消':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case '初次咨询':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case '选校讨论':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case '文书指导':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold dark:text-white">会议记录</h2>
        {onAddMeeting && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            添加会议
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div 
            key={meeting.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* 标题和状态 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-base dark:text-white mb-1">{meeting.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {meeting.status && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  )}
                  {meeting.meeting_type && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(meeting.meeting_type)}`}>
                      {meeting.meeting_type}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 时间信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(meeting.start_time)}</span>
              </div>
              {meeting.end_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>至 {formatDateTime(meeting.end_time)}</span>
                </div>
              )}
            </div>

            {/* 概要 */}
            {meeting.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {meeting.summary}
              </p>
            )}

            {/* 参会人 */}
            {meeting.participants && meeting.participants.length > 0 && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">参会人:</span>
                <div className="flex flex-wrap gap-1">
                  {meeting.participants.map((participant, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 会议链接 */}
            {meeting.meeting_link && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">会议链接:</span>
                <a
                  href={meeting.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-xs"
                >
                  {meeting.meeting_link}
                </a>
              </div>
            )}

            {/* 会议文档 */}
            {meeting.meeting_documents && meeting.meeting_documents.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="text-gray-600 dark:text-gray-400">文档:</span>
                  <div className="mt-1 space-y-1">
                    {meeting.meeting_documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs hover:underline"
                      >
                        📄 {doc.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 会议笔记 */}
            {meeting.meeting_notes && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">笔记:</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{meeting.meeting_notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 添加会议模态框 */}
      {showAddModal && (
        <AddMeetingModal
          studentId={studentId}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMeeting}
        />
      )}
    </div>
  );
}

