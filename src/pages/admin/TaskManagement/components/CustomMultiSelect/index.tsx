/**
 * 自定义多选下拉组件
 * 支持多选负责人
 */

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

interface CustomMultiSelectProps {
  value: (string | number)[];
  options: Option[];
  onChange: (values: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = '请选择',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 选中的选项
  const selectedOptions = options.filter(opt => value.includes(opt.value));

  // 过滤选项
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 打开时聚焦搜索框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter(v => v !== optionValue);
    onChange(newValue);
  };

  const handleToggleAll = () => {
    if (selectedOptions.length === filteredOptions.length) {
      // 取消选择所有过滤后的选项
      const filteredValues = filteredOptions.map(opt => opt.value);
      onChange(value.filter(v => !filteredValues.includes(v)));
    } else {
      // 选择所有过滤后的选项
      const newValues = [...new Set([...value, ...filteredOptions.map(opt => opt.value)])];
      onChange(newValues);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 选择框 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 min-h-[40px]
          bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600
          rounded-lg text-sm
          hover:border-purple-400 dark:hover:border-purple-500
          focus:outline-none focus:ring-2 focus:ring-purple-500
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-purple-500 border-purple-500' : ''}
        `}
      >
        <div className="flex items-center gap-2 flex-1 text-left flex-wrap">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-md text-xs"
              >
                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                <span className="truncate max-w-[120px]">{option.label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(option.value, e)}
                  className="flex-shrink-0 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
          {selectedOptions.length > 3 && (
            <span className="text-xs text-gray-500">
              +{selectedOptions.length - 3} 更多
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* 搜索框 (如果选项超过5个) */}
          {options.length > 5 && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索..."
                className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* 全选/取消全选 */}
          {filteredOptions.length > 0 && (
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleToggleAll}
                className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                  selectedOptions.length === filteredOptions.length
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {selectedOptions.length === filteredOptions.length ? '取消全选' : '全选'}
              </button>
            </div>
          )}

          {/* 选项列表 */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400 text-center">
                无匹配结果
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left
                      hover:bg-purple-50 dark:hover:bg-purple-900/20
                      transition-colors duration-150
                      ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}
                      <span className={`
                        ${isSelected 
                          ? 'text-purple-600 dark:text-purple-400 font-medium' 
                          : 'text-gray-900 dark:text-white'}
                      `}>
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
