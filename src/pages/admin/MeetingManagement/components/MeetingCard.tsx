/**
 * 会议卡片组件
 */

import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Link as LinkIcon, FileText, Edit2, MoreVertical, Play, CheckCircle } from 'lucide-react';
import { Meeting } from '../types';
import { formatDateTime } from '../../../../utils/dateUtils';

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
  onEditDocument?: (e: React.MouseEvent) => void;
  onEditMeeting?: (e: React.MouseEvent) => void;
  onStartMeeting?: (e: React.MouseEvent) => void;
  onDeleteMeeting?: (e: React.MouseEvent) => void;
  onCompleteMeeting?: (e: React.MouseEvent) => void;
}

const statusColors = {
  '待举行': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  '进行中': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  '已完成': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  '已取消': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  '延期': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const typeColors = {
  '初次咨询': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  '选校讨论': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  '文书指导': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  '面试辅导': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  '签证指导': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  '行前准备': 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  '日常进度沟通': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  '团队例会': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
  '客户沟通': 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
  '项目评审': 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  '培训会议': 'bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400',
  '其他': 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
};

export default function MeetingCard({
  meeting,
  onClick,
  onEditDocument,
  onEditMeeting,
  onStartMeeting,
  onDeleteMeeting,
  onCompleteMeeting,
}: MeetingCardProps) {
  const [showActions, setShowActions] = useState(false);

  const handleActionClick = (
    event: React.MouseEvent,
    callback?: (event: React.MouseEvent) => void
  ) => {
    event.stopPropagation();
    setShowActions(false);
    callback?.(event);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
    >
      {/* 标题和状态 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {meeting.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              typeColors[meeting.meeting_type] || typeColors['其他']
            }`}>
              {meeting.meeting_type}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[meeting.status]
            }`}>
              {meeting.status}
            </span>
          </div>
        </div>
        {(onEditDocument || onEditMeeting || onDeleteMeeting || onCompleteMeeting) && (
          <div className="flex items-center gap-2">
            {onCompleteMeeting && meeting.status !== '已完成' && (
              <button
                onClick={(event) => handleActionClick(event, onCompleteMeeting)}
                className="rounded-full border border-blue-500 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20 flex items-center gap-1"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                完成
              </button>
            )}
            {onStartMeeting && (
              <button
                onClick={(event) => handleActionClick(event, onStartMeeting)}
                className="rounded-full border border-emerald-500 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
              >
                开始会议
              </button>
            )}
            <div className="relative">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setShowActions((prev) => !prev);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {showActions && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-10"
                  onMouseLeave={() => setShowActions(false)}
                >
                  {onEditMeeting && (
                    <button
                      onClick={(event) => handleActionClick(event, onEditMeeting)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <Edit2 className="h-4 w-4 text-indigo-500" />
                      编辑会议
                    </button>
                  )}
                  {onEditDocument && (
                    <button
                      onClick={(event) => handleActionClick(event, onEditDocument)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <FileText className="h-4 w-4 text-blue-500" />
                      编辑文档
                    </button>
                  )}
                  {onDeleteMeeting && (
                    <button
                      onClick={(event) => handleActionClick(event, onDeleteMeeting)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/30"
                    >
                      <MoreVertical className="h-4 w-4 rotate-90 text-red-500" />
                      删除会议
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 时间信息 */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDateTime(meeting.start_time)}</span>
          {meeting.end_time && (
            <>
              <span className="mx-2">→</span>
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatDateTime(meeting.end_time)}</span>
            </>
          )}
        </div>

        {/* 地点 */}
        {meeting.location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{meeting.location}</span>
          </div>
        )}

        {/* 会议链接 */}
        {meeting.meeting_link && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <LinkIcon className="h-4 w-4 mr-2" />
            <a
              href={meeting.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
            >
              {meeting.meeting_link}
            </a>
          </div>
        )}
      </div>

      {/* 参会人 */}
      {meeting.participants && meeting.participants.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {meeting.participants.slice(0, 5).map((participant, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {participant.name}
              </span>
            ))}
            {meeting.participants.length > 5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                +{meeting.participants.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 摘要 */}
      {meeting.summary && (
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="line-clamp-2">{meeting.summary}</p>
        </div>
      )}

      {/* 创建信息 */}
      {meeting.created_by_name && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            创建人: {meeting.created_by_name}
          </p>
        </div>
      )}
    </div>
  );
}

