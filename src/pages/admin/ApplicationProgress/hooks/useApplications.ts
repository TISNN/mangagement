/**
 * 申请进度管理 - 自定义Hooks
 */

import { useState, useEffect } from 'react';
import {
  ApplicationOverview,
  ApplicationStats,
  StudentProfile,
  StudentMeeting,
  FinalUniversityChoice,
  ApplicationDocument
} from '../types';
import applicationService from '../services/applicationService';

/**
 * 获取所有申请概览
 */
export function useApplicationOverviews() {
  const [overviews, setOverviews] = useState<ApplicationOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.overview.getAllApplications();
      setOverviews(data);
    } catch (err) {
      setError('获取申请列表失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviews();
  }, []);

  return { overviews, loading, error, reload: fetchOverviews };
}

/**
 * 获取申请统计数据
 */
export function useApplicationStats() {
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    urgent: 0,
    completed: 0,
    pending: 0,
    accepted: 0,
    completion_rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await applicationService.overview.getApplicationStats();
        setStats(data);
      } catch (err) {
        console.error('获取统计数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}

/**
 * 获取单个学生的完整申请数据
 */
export function useStudentApplication(studentId: number | null) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [meetings, setMeetings] = useState<StudentMeeting[]>([]);
  const [choices, setChoices] = useState<FinalUniversityChoice[]>([]);
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [overview, setOverview] = useState<ApplicationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 并行获取所有数据
      const [profileData, meetingsData, choicesData, documentsData, overviewData] = await Promise.all([
        applicationService.studentProfile.getProfileByStudentId(studentId),
        applicationService.meeting.getMeetingsByStudentId(studentId),
        applicationService.universityChoice.getChoicesByStudentId(studentId),
        applicationService.document.getDocumentsByStudentId(studentId),
        applicationService.overview.getStudentApplication(studentId)
      ]);

      setProfile(profileData);
      setMeetings(meetingsData);
      setChoices(choicesData);
      setDocuments(documentsData);
      setOverview(overviewData);
    } catch (err) {
      setError('获取学生数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  return {
    profile,
    meetings,
    choices,
    documents,
    overview,
    loading,
    error,
    reload: fetchData
  };
}

