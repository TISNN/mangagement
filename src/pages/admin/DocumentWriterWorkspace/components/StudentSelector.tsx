/**
 * 学生选择器组件
 * 用于快速切换当前工作的学生
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, Clock, ChevronDown, X } from 'lucide-react';
import type { StudentInfo } from '../types';

interface StudentSelectorProps {
  currentStudentId: number | null;
  students: StudentInfo[];
  favoriteStudentIds: number[];
  onStudentChange: (studentId: number) => void;
  onToggleFavorite: (studentId: number) => void;
  isLoading?: boolean;
}

export default function StudentSelector({
  currentStudentId,
  students,
  favoriteStudentIds,
  onStudentChange,
  onToggleFavorite,
  isLoading = false,
}: StudentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStudent = students.find((s) => s.id === currentStudentId);

  // 过滤学生列表
  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.service_type?.toLowerCase().includes(query) ||
      student.current_stage?.toLowerCase().includes(query)
    );
  });

  // 收藏的学生
  const favoriteStudents = filteredStudents.filter((s) =>
    favoriteStudentIds.includes(s.id)
  );

  // 最近使用的学生（排除收藏的）
  const recentStudents = filteredStudents
    .filter((s) => !favoriteStudentIds.includes(s.id))
    .slice(0, 5);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleStudentSelect = (studentId: number) => {
    onStudentChange(studentId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 当前学生显示 - 精致设计 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-slate-200/80 dark:border-gray-700/80 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 disabled:opacity-50 group relative overflow-hidden"
      >
        {isLoading ? (
          <>
            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <span className="text-sm text-gray-500">加载中...</span>
          </>
        ) : currentStudent ? (
          <>
            {currentStudent.avatar ? (
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                {currentStudent.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {currentStudent.name}
            </span>
            {currentStudent.current_stage && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 font-medium">
                {currentStudent.current_stage}
              </span>
            )}
          </>
        ) : (
          <span className="text-sm text-slate-500 dark:text-slate-400">选择学生</span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-all duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 下拉菜单 - 优化设计 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 dark:border-gray-700/60 z-50 max-h-96 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
          {/* 搜索框 - 优化设计 */}
          <div className="p-4 border-b border-slate-200/60 dark:border-gray-700/60">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索学生姓名、服务或阶段..."
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl bg-slate-50/50 dark:bg-gray-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 学生列表 */}
          <div className="flex-1 overflow-y-auto">
            {/* 收藏学生 */}
            {favoriteStudents.length > 0 && (
              <div className="p-3">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  收藏学生
                </div>
                {favoriteStudents.map((student) => (
                  <StudentItem
                    key={student.id}
                    student={student}
                    isFavorite={true}
                    isSelected={student.id === currentStudentId}
                    onSelect={handleStudentSelect}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* 最近使用 */}
            {recentStudents.length > 0 && (
              <div className="p-3 border-t border-slate-200/60 dark:border-gray-700/60">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  最近使用
                </div>
                {recentStudents.map((student) => (
                  <StudentItem
                    key={student.id}
                    student={student}
                    isFavorite={favoriteStudentIds.includes(student.id)}
                    isSelected={student.id === currentStudentId}
                    onSelect={handleStudentSelect}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* 无结果 */}
            {filteredStudents.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                未找到匹配的学生
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface StudentItemProps {
  student: StudentInfo;
  isFavorite: boolean;
  isSelected: boolean;
  onSelect: (studentId: number) => void;
  onToggleFavorite: (studentId: number) => void;
}

function StudentItem({
  student,
  isFavorite,
  isSelected,
  onSelect,
  onToggleFavorite,
}: StudentItemProps) {
  return (
    <button
      onClick={() => onSelect(student.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        isSelected
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30 shadow-sm'
          : 'hover:bg-slate-50 dark:hover:bg-gray-800/50 hover:shadow-sm'
      }`}
    >
      {student.avatar ? (
        <img
          src={student.avatar}
          alt={student.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
          {student.name.charAt(0)}
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
          {student.name}
        </div>
        {student.service_type && (
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {student.service_type}
          </div>
        )}
      </div>
      {student.current_stage && (
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 font-medium">
          {student.current_stage}
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(student.id);
        }}
        className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 ${
          isFavorite ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'
        }`}
        title={isFavorite ? '取消收藏' : '收藏'}
      >
        <Star className={`h-4 w-4 transition-all ${isFavorite ? 'fill-current scale-110' : ''}`} />
      </button>
    </button>
  );
}

