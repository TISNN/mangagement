/**
 * 学生档案区域组件
 */

import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Award, Users, Globe, CreditCard, Briefcase, TrendingUp, FileText } from 'lucide-react';
import { StudentProfile } from '../types';
import { StandardizedTestsSection } from './StandardizedTestsSection';

interface ProfileSectionProps {
  profile: StudentProfile | null;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  // 辅助函数: 显示字段值或空白
  const displayValue = (value: string | number | undefined | null) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-sm font-medium dark:text-white"></span>;
    }
    return <span className="text-sm font-medium dark:text-white">{value}</span>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-6 dark:text-white">学生档案</h2>
      
      {!profile && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 提示: 该学生暂无档案信息,请完善以下信息
          </p>
        </div>
      )}
      
      {/* 基本信息 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <User className="h-4 w-4 mr-2" />
          基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">姓名:</span>
            {displayValue(profile?.full_name)}
          </div>
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">性别:</span>
            {displayValue(profile?.gender)}
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">出生日期:</span>
            {displayValue(profile?.date_of_birth)}
          </div>
          <div className="flex items-start gap-2">
            <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">国籍:</span>
            {displayValue(profile?.nationality)}
          </div>
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">电话:</span>
            {displayValue(profile?.phone_number)}
          </div>
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">申请邮箱:</span>
            {displayValue(profile?.application_email)}
          </div>
          <div className="flex items-start gap-2">
            <CreditCard className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">护照号:</span>
            {displayValue(profile?.passport_number)}
          </div>
          <div className="flex items-start gap-2 md:col-span-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-500 dark:text-gray-400 w-24">现居地址:</span>
            {displayValue(profile?.current_address)}
          </div>
        </div>
      </div>

      {/* 本科教育背景 */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3 flex items-center">
          <GraduationCap className="h-4 w-4 mr-2" />
          本科教育背景
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">学校:</span>
            <div className="mt-1">{displayValue(profile?.undergraduate_school)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">专业:</span>
            <div className="mt-1">{displayValue(profile?.undergraduate_major)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">学位:</span>
            <div className="mt-1">{displayValue(profile?.undergraduate_degree)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">GPA:</span>
            <div className="mt-1">{displayValue(profile?.undergraduate_gpa)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">均分:</span>
            <div className="mt-1">{displayValue(profile?.undergraduate_score)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">学习时间:</span>
            <div className="mt-1">
              {profile?.undergraduate_start_date || profile?.undergraduate_end_date ? (
                <span className="text-sm font-medium dark:text-white">
                  {profile.undergraduate_start_date || ''} ~ {profile.undergraduate_end_date || ''}
                </span>
              ) : (
                <span className="text-sm font-medium dark:text-white"></span>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">核心课程:</span>
            <div className="mt-1">
              {profile?.undergraduate_core_courses && profile.undergraduate_core_courses.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {profile.undergraduate_core_courses.map((course, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                      {course}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-medium dark:text-white"></span>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center mb-1">
              <Award className="h-3 w-3 mr-1" />
              奖学金:
            </span>
            {profile?.undergraduate_scholarships && profile.undergraduate_scholarships.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.undergraduate_scholarships.map((scholarship, idx) => (
                  <span key={idx} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded">
                    {scholarship}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm font-medium dark:text-white"></span>
            )}
          </div>
        </div>
      </div>

      {/* 硕士教育背景 */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
        <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-3 flex items-center">
          <GraduationCap className="h-4 w-4 mr-2" />
          硕士教育背景
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">学校:</span>
            <div className="mt-1">{displayValue(profile?.graduate_school)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">专业:</span>
            <div className="mt-1">{displayValue(profile?.graduate_major)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">学位:</span>
            <div className="mt-1">{displayValue(profile?.graduate_degree)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">GPA:</span>
            <div className="mt-1">{displayValue(profile?.graduate_gpa)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">均分:</span>
            <div className="mt-1">{displayValue(profile?.graduate_score)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">学习时间:</span>
            <div className="mt-1">
              {profile?.graduate_start_date || profile?.graduate_end_date ? (
                <span className="text-sm font-medium dark:text-white">
                  {profile.graduate_start_date || ''} ~ {profile.graduate_end_date || ''}
                </span>
              ) : (
                <span className="text-sm font-medium dark:text-white"></span>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">核心课程:</span>
            <div className="mt-1">
              {profile?.graduate_core_courses && profile.graduate_core_courses.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {profile.graduate_core_courses.map((course, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded">
                      {course}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-medium dark:text-white"></span>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center mb-1">
              <Award className="h-3 w-3 mr-1" />
              奖学金:
            </span>
            {profile?.graduate_scholarships && profile.graduate_scholarships.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.graduate_scholarships.map((scholarship, idx) => (
                  <span key={idx} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded">
                    {scholarship}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm font-medium dark:text-white"></span>
            )}
          </div>
        </div>
      </div>

      {/* 标化成绩 */}
      <StandardizedTestsSection tests={profile?.standardized_tests} readOnly={true} />

      {/* 实习/工作经历 */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
        <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-3 flex items-center">
          <Briefcase className="h-4 w-4 mr-2" />
          实习/工作经历
        </h3>
        {profile?.work_experiences && profile.work_experiences.length > 0 ? (
          <div className="space-y-3">
            {profile.work_experiences.map((exp, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-900/30">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                  </div>
                  {exp.is_current && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                      在职
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{exp.start_date} ~ {exp.is_current ? '至今' : (exp.end_date || '')}</span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      主要成就:
                    </p>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, aIdx) => (
                        <li key={aIdx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">公司名称:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">职位:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">开始日期:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">结束日期:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">工作描述:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">主要成就:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
          </div>
        )}
      </div>

      {/* 文书材料 */}
      {profile?.document_files && profile.document_files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">文书材料</h3>
          <div className="space-y-2">
            {profile.document_files.map((doc, idx) => (
              <a
                key={idx}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium dark:text-white">{doc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{doc.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    查看文件 →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
