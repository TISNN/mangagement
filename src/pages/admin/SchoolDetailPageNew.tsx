/**
 * 学校详情页 - 使用新架构
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchoolDetail, SchoolDetailView } from './SchoolLibrary';

const SchoolDetailPageNew: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const { school, programs, successCases, loading, error } = useSchoolDetail(schoolId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {error || '未找到学校信息'}
        </h2>
        <button 
          onClick={() => navigate('/admin/school-assistant')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          返回学校列表
        </button>
      </div>
    );
  }

  return (
    <SchoolDetailView 
      school={school}
      programs={programs}
      successCases={successCases}
    />
  );
};

export default SchoolDetailPageNew;

