/**
 * 专业卡片组件
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import { Program } from '../types/program.types';
import { School } from '../../SchoolLibrary/types/school.types';

interface ProgramCardProps {
  program: Program;
  school?: School;
  isProgramInterested: (schoolId: string, programId: string) => boolean;
  onToggleProgramInterest: (schoolId: string, programId: string) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  school,
  isProgramInterested,
  onToggleProgramInterest
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 cursor-pointer"
      onClick={() => navigate(`/admin/programs/${program.id}`)}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {/* 学校logo */}
            {school && (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                {school.logoUrl || school.rawData?.logo_url ? (
                  <img src={school.logoUrl || school.rawData?.logo_url} alt={school.name} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="text-blue-500 dark:text-blue-400 font-bold text-xs">
                    {school.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex-1 flex flex-col min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {program.cn_name || program.en_name}
              </h3>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {school && (
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                    {school.name}
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {program.faculty} · {program.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:flex gap-4">
                <span>{program.degree}</span>
                <span>{program.duration}</span>
                {program.tuition_fee && <span>{program.tuition_fee}</span>}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleProgramInterest(program.school_id, program.id);
                }}
                className={`p-2 rounded-full ${
                  isProgramInterested(program.school_id, program.id)
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400'
                }`}
              >
                <Heart className="h-4 w-4" />
              </button>
              
              <a
                href={program.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

