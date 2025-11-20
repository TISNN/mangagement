/**
 * 会议记录面板组件
 * 显示与学生相关的会议记录
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import type { MeetingRecord } from '../../types';

interface MeetingRecordsPanelProps {
  studentId: number;
}

export default function MeetingRecordsPanel({ studentId }: MeetingRecordsPanelProps) {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, [studentId]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_meetings')
        .select('*')
        .eq('student_id', studentId)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      setMeetings((data || []) as MeetingRecord[]);
    } catch (error) {
      console.error('加载会议记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        暂无会议记录
      </div>
    );
  }

  return (
    <div className="p-5 space-y-3">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}

interface MeetingCardProps {
  meeting: MeetingRecord;
}

function MeetingCard({ meeting }: MeetingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 border border-slate-200/60 dark:border-gray-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 hover:border-slate-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex-1">
          {meeting.title}
        </h4>
        <a
          href={`/admin/meetings/${meeting.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <div className="p-1 rounded-lg bg-slate-100 dark:bg-gray-700">
            <Calendar className="h-3 w-3" />
          </div>
          <span className="font-medium">{formatDate(meeting.start_time)}</span>
        </div>
        {meeting.meeting_type && (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium">
              {meeting.meeting_type}
            </span>
          </div>
        )}
        {meeting.participants && meeting.participants.length > 0 && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <div className="p-1 rounded-lg bg-slate-100 dark:bg-gray-700">
              <Users className="h-3 w-3" />
            </div>
            <span>{meeting.participants.join(', ')}</span>
          </div>
        )}
        {meeting.summary && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 pl-4 py-2 rounded-lg bg-slate-50/50 dark:bg-gray-800/50">
            {meeting.summary}
          </p>
        )}
      </div>
    </div>
  );
}

