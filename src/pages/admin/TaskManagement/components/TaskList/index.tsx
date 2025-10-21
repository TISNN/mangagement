/**
 * 任务列表组件
 */

import React from 'react';
import { UITask } from '../../types/task.types';
import TaskListItem from './TaskListItem';

interface TaskListProps {
  tasks: UITask[];
  onTaskClick: (task: UITask) => void;
  onEditTask: (task: UITask) => void;
  onDeleteTask: (task: UITask) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium mb-1">暂无任务</p>
        <p className="text-sm">点击"新建任务"按钮创建第一个任务</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {tasks.map(task => (
        <TaskListItem
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task)}
          onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
        />
      ))}
    </div>
  );
};

export default TaskList;

