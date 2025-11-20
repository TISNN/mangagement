/**
 * 学生信息面板组件
 * 显示当前学生的详细信息
 */

import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Award, Briefcase, Globe, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';

interface StudentInfoPanelProps {
  studentId: number;
}

interface StudentProfile {
  id: number;
  name: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  phone_number?: string;
  application_email?: string;
  education_level?: string;
  school?: string;
  major?: string;
  gpa?: number;
  target_countries?: string[];
  target_schools?: string[];
}

export default function StudentInfoPanel({ studentId }: StudentInfoPanelProps) {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    loadStudentInfo();
  }, [studentId]);

  const loadStudentInfo = async () => {
    try {
      setLoading(true);
      // 从students表获取基本信息
      const { data: studentData, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) throw error;

      // 从people表获取个人信息
      if (studentData.person_id) {
        const { data: personData } = await supabase
          .from('people')
          .select('*')
          .eq('id', studentData.person_id)
          .single();

        if (personData) {
          setStudent({
            ...studentData,
            name: personData.full_name || studentData.name,
            gender: personData.gender,
            date_of_birth: personData.date_of_birth,
            nationality: personData.nationality,
            phone_number: personData.phone_number,
            application_email: personData.application_email,
          });
        } else {
          setStudent(studentData);
        }
      } else {
        setStudent(studentData);
      }
    } catch (error) {
      console.error('加载学生信息失败:', error);
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

  if (!student) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        未找到学生信息
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      {/* 基本信息 - 优化设计 */}
      <InfoSection title="基本信息" icon={User}>
        <InfoItem label="姓名" value={student.name} />
        {student.gender && <InfoItem label="性别" value={student.gender} />}
        {student.date_of_birth && (
          <InfoItem label="出生日期" value={student.date_of_birth} />
        )}
        {student.nationality && <InfoItem label="国籍" value={student.nationality} />}
        {student.phone_number && (
          <InfoItem label="电话" value={student.phone_number} />
        )}
        {student.application_email && (
          <InfoItem label="申请邮箱" value={student.application_email} />
        )}
      </InfoSection>

      {/* 教育背景 */}
      {(student.education_level || student.school || student.major) && (
        <InfoSection title="教育背景" icon={GraduationCap}>
          {student.education_level && (
            <InfoItem label="学历" value={student.education_level} />
          )}
          {student.school && <InfoItem label="学校" value={student.school} />}
          {student.major && <InfoItem label="专业" value={student.major} />}
          {student.gpa && <InfoItem label="GPA" value={student.gpa.toString()} />}
        </InfoSection>
      )}

      {/* 申请目标 */}
      {(student.target_countries?.length || student.target_schools?.length) && (
        <InfoSection title="申请目标" icon={Globe}>
          {student.target_countries && student.target_countries.length > 0 && (
            <InfoItem
              label="目标国家"
              value={student.target_countries.join(', ')}
            />
          )}
          {student.target_schools && student.target_schools.length > 0 && (
            <InfoItem
              label="目标学校"
              value={student.target_schools.join(', ')}
            />
          )}
        </InfoSection>
      )}

      {/* 查看完整档案 - 优化设计 */}
      <div className="pt-5 border-t border-slate-200/60 dark:border-gray-800/60">
        <a
          href={`/admin/students/${studentId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-4 py-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 group"
        >
          <span>查看完整档案</span>
          <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function InfoSection({ title, icon: Icon, children }: InfoSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span>{title}</span>
      </div>
      <div className="pl-8 space-y-2.5">{children}</div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="text-sm py-1.5 px-3 rounded-lg bg-slate-50/50 dark:bg-gray-800/50 border border-slate-200/60 dark:border-gray-700/60">
      <span className="text-slate-500 dark:text-slate-400 font-medium">{label}:</span>{' '}
      <span className="text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

