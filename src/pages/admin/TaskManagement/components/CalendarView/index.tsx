/**
 * 日历视图组件
 * 按日期显示任务
 */

import React, { useState, useMemo } from 'react';
import { UITask } from '../../types/task.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  tasks: UITask[];
  onTaskClick: (task: UITask) => void;
  selectedTaskId?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskClick,
  selectedTaskId,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 获取当前月份的第一天和最后一天
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 获取日历显示的开始日期（可能包含上个月的日期）
  const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const calendarStartDate = new Date(firstDayOfMonth);
  calendarStartDate.setDate(calendarStartDate.getDate() - startDay);

  // 生成日历格子
  const calendarDays = useMemo(() => {
    const days = [];
    const date = new Date(calendarStartDate);
    
    // 生成6周的日期（42天）
    for (let i = 0; i < 42; i++) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  }, [calendarStartDate]);

  // 获取某一天的任务
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  // 切换月份
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 判断是否是今天
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // 判断是否是当前月份
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高':
        return 'bg-red-500';
      case '中':
        return 'bg-yellow-500';
      case '低':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            今天
          </button>
          <button
            onClick={previousMonth}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
        {calendarDays.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const today = isToday(date);
          const currentMonth = isCurrentMonth(date);
          
          return (
            <div
              key={index}
              className={`
                border-r border-b border-gray-200 dark:border-gray-700 p-2 min-h-[100px]
                ${!currentMonth ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'}
                ${index % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium
                    ${today 
                      ? 'w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white' 
                      : currentMonth
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-600'
                    }
                  `}
                >
                  {date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => {
                  const isSelected = selectedTaskId === task.id;
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className={`
                        text-xs p-1.5 rounded cursor-pointer truncate
                        transition-all
                        ${isSelected
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 ring-1 ring-purple-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        }
                      `}
                      title={task.title}
                    >
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                    +{dayTasks.length - 3} 更多
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;

