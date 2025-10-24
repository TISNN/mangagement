/**
 * 学校卡片组件
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, ChevronDown, ExternalLink } from 'lucide-react';
import { School as SchoolIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { School } from '../types/school.types';

// 莫兰迪色系
const morandiColors = {
  pink: 'bg-[#e8c4c4] text-[#9e7878]',
  green: 'bg-[#c8d6bf] text-[#7d9470]',
  blue: 'bg-[#b8c9d0] text-[#6e878f]',
  grey: 'bg-[#d0d0d0] text-[#808080]',
  yellow: 'bg-[#e0d6c2] text-[#9a8b6a]',
  purple: 'bg-[#c9c3d5] text-[#7b738b]',
  brown: 'bg-[#d4c9bc] text-[#8d7e6d]'
};

const darkMorandiColors = {
  pink: 'dark:bg-[#5c4747] dark:text-[#e8c4c4]',
  green: 'dark:bg-[#414f3a] dark:text-[#c8d6bf]',
  blue: 'dark:bg-[#384852] dark:text-[#b8c9d0]',
  grey: 'dark:bg-[#4a4a4a] dark:text-[#d0d0d0]',
  yellow: 'dark:bg-[#4e4636] dark:text-[#e0d6c2]',
  purple: 'dark:bg-[#413b50] dark:text-[#c9c3d5]',
  brown: 'dark:bg-[#494339] dark:text-[#d4c9bc]'
};

interface SchoolCardProps {
  school: School;
  isInterested: boolean;
  expandedPrograms: string[];
  onToggleInterest: (school: School) => void;
  onToggleExpand: (schoolId: string) => void;
  onToggleProgramInterest: (schoolId: string, programId: string) => void;
  isProgramInterested: (schoolId: string, programId: string) => boolean;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  isInterested,
  expandedPrograms,
  onToggleInterest,
  onToggleExpand,
  onToggleProgramInterest,
  isProgramInterested
}) => {
  const navigate = useNavigate();
  const isExpanded = expandedPrograms.includes(`school-${school.id}`);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-5 flex items-start">
        <div className="flex-shrink-0 mr-5">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/50">
            {school.logoUrl ? (
              <img src={school.logoUrl} alt={school.name} className="w-full h-full object-contain p-1" />
            ) : (
              <SchoolIcon className="h-8 w-8 text-gray-400 dark:text-gray-300" />
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">{school.name}</h3>
                {school.tags && Array.isArray(school.tags) && school.tags.length > 0 && (
                  <>
                    {school.tags.slice(0, 3).map((tag, idx) => {
                      const colorKeys = Object.keys(morandiColors);
                      const colorKey = colorKeys[idx % colorKeys.length] as keyof typeof morandiColors;
                      const lightColorClass = morandiColors[colorKey];
                      const darkColorClass = darkMorandiColors[colorKey];

                      return (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 text-xs rounded-full ${lightColorClass} ${darkColorClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                    {school.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        +{school.tags.length - 3}
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 inline" />
                {school.location}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-[#e8e8e8] text-gray-700 text-sm rounded-lg dark:bg-gray-700/50 dark:text-gray-300 font-medium">
                #{school.ranking.replace('#', '')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">录取率</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.acceptance}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">学费</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.tuition}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">专业数</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.programs.length}</p>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 ml-4 flex flex-col gap-2">
          <button
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleInterest(school);
            }}
          >
            <Heart className={`h-4 w-4 ${
              isInterested
                ? 'text-rose-500 fill-rose-500'
                : 'text-gray-400 dark:text-gray-500'
            }`} />
            收藏
          </button>
          <button
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(`school-${school.id}`);
            }}
          >
            <ChevronDown className={`h-4 w-4 text-gray-400 duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} />
            专业
          </button>
          <button
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-800 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/school-detail/${school.id}`);
            }}
          >
            <ExternalLink className="h-4 w-4" />
            详情
          </button>
        </div>
      </div>

      {/* 展开的专业列表 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-5 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">专业列表</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {school.programs.length > 0 ? (
                  school.programs.map(program => (
                    <div
                      key={program.id}
                      className="flex justify-between items-center p-2.5 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/programs/${program.id}`);
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate text-gray-700 dark:text-gray-200">
                          {program.cn_name || program.en_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {program.degree} · {program.duration}
                        </p>
                      </div>
                      <button
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleProgramInterest(school.id, program.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${
                          isProgramInterested(school.id, program.id)
                            ? 'text-rose-500 fill-rose-500'
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2 col-span-2">
                    暂无专业信息
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

