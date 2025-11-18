/**
 * 切换客户对话框组件
 */

import React, { useState } from 'react';
import { X, Search, User } from 'lucide-react';

interface CustomerSwitchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customerId: string) => void;
}

const CustomerSwitchDialog: React.FC<CustomerSwitchDialogProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟客户列表数据
  const customers = [
    { id: '1', name: '王欣然', project: '2025FALL 数据科学', advisor: '赵婧怡' },
    { id: '2', name: '李明', project: '2025FALL 计算机科学', advisor: '张伟' },
    { id: '3', name: '张华', project: '2025SPRING 金融工程', advisor: '刘芳' },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.includes(searchQuery) ||
      customer.project.includes(searchQuery) ||
      customer.advisor.includes(searchQuery)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">切换客户</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索客户姓名、项目或顾问..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">未找到匹配的客户</div>
            ) : (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    onSelect(customer.id);
                    onClose();
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{customer.project}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">顾问：{customer.advisor}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSwitchDialog;

