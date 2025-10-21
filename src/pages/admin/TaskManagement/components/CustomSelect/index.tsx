/**
 * 自定义下拉选择组件
 * 更有设计感和交互感
 */

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string | React.ReactNode;
  color?: string;
  icon?: React.ReactNode;
  searchText?: string; // 用于搜索的文本
}

interface CustomSelectProps {
  value: string | number;
  options: Option[];
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
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
  const selectedOption = options.find(opt => opt.value === value);

  // 过滤选项
  const filteredOptions = options.filter(opt => {
    // 优先使用searchText进行搜索
    if (opt.searchText) {
      return opt.searchText.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    if (typeof opt.label === 'string') {
      return opt.label.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // 如果label是React元素，尝试从React元素中提取文本内容进行搜索
    if (React.isValidElement(opt.label)) {
      // 递归提取React元素中的文本内容
      const extractText = (element: React.ReactNode): string => {
        if (typeof element === 'string') {
          return element;
        }
        if (typeof element === 'number') {
          return element.toString();
        }
        if (React.isValidElement(element)) {
          if (element.props.children) {
            if (Array.isArray(element.props.children)) {
              return element.props.children.map(extractText).join('');
            } else {
              return extractText(element.props.children);
            }
          }
        }
        return '';
      };
      
      const textContent = extractText(opt.label);
      return textContent.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

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
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 选择框 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2
          bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600
          rounded-lg text-sm
          hover:border-purple-400 dark:hover:border-purple-500
          focus:outline-none focus:ring-2 focus:ring-purple-500
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-purple-500 border-purple-500' : ''}
        `}
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          {selectedOption?.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}
          <div className={`flex-1 ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            {selectedOption?.label || placeholder}
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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

          {/* 选项列表 */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400 text-center">
                无匹配结果
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left
                    hover:bg-purple-50 dark:hover:bg-purple-900/20
                    transition-colors duration-150
                    ${option.value === value ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                  `}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <div className={`
                      flex-1
                      ${option.value === value 
                        ? 'text-purple-600 dark:text-purple-400 font-medium' 
                        : 'text-gray-900 dark:text-white'}
                    `}>
                      {option.label}
                    </div>
                  </div>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

