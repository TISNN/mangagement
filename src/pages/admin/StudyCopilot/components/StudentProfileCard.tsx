import React from 'react';
import { User, MapPin, GraduationCap, Award, Globe, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface StudentProfile {
  name: string;
  source: string;
  status: string;
  school: string;
  major: string;
  gpa: string;
  ranking?: string;
  language: string;
  retakeDate?: string;
  targetCountries: string[];
  targetMajor: string;
  budget: string;
  enrollmentTime: string;
  heat: 'high' | 'medium' | 'low';
  type: string;
  matchScore?: number;
  potentialIndex?: number;
}

interface StudentProfileCardProps {
  student: StudentProfile;
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ student }) => {
  const heatColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  };

  const statusColors = {
    '待沟通': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    '已沟通': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    '高意向': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6 sticky top-6">
      {/* 头部 */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {student.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                来源：{student.source}
              </p>
            </div>
          </div>
        </div>

        {/* 状态标签 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[student.status as keyof typeof statusColors] || statusColors['待沟通']}`}>
            {student.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${heatColors[student.heat]}`}>
            {student.heat === 'high' ? '🔥 高热度' : student.heat === 'medium' ? '⚡ 中热度' : '❄️ 低热度'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            {student.type}
          </span>
        </div>
      </div>

      {/* 学术背景 */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          学术背景
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">院校</span>
            <span className="text-gray-900 dark:text-white font-medium">{student.school}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">专业</span>
            <span className="text-gray-900 dark:text-white font-medium">{student.major}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">GPA</span>
            <span className="text-gray-900 dark:text-white font-medium">{student.gpa}</span>
          </div>
          {student.ranking && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">排名</span>
              <span className="text-gray-900 dark:text-white font-medium">{student.ranking}</span>
            </div>
          )}
        </div>
      </div>

      {/* 语言成绩 */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          语言成绩
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">当前成绩</span>
            <span className="text-gray-900 dark:text-white font-medium">{student.language}</span>
          </div>
          {student.retakeDate && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">计划重考</span>
              <span className="text-orange-600 dark:text-orange-400 font-medium">{student.retakeDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* 申请意向 */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          申请意向
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400 block mb-1">目标国家</span>
            <div className="flex flex-wrap gap-1">
              {student.targetCountries.map((country, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                  {country}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">目标专业</span>
            <span className="text-gray-900 dark:text-white font-medium">{student.targetMajor}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              预算
            </span>
            <span className="text-gray-900 dark:text-white font-medium">{student.budget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              入学时间
            </span>
            <span className="text-gray-900 dark:text-white font-medium">{student.enrollmentTime}</span>
          </div>
        </div>
      </div>

      {/* AI评估 */}
      {(student.matchScore !== undefined || student.potentialIndex !== undefined) && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            AI智能评估
          </h3>
          <div className="space-y-3">
            {student.matchScore !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">匹配度评分</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{student.matchScore}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${student.matchScore}%` }}
                  ></div>
                </div>
              </div>
            )}
            {student.potentialIndex !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">潜力指数</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{student.potentialIndex}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${student.potentialIndex}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileCard;

