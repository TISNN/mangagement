/**
 * 文字颜色选择器
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useCurrentEditor } from '@tiptap/react';
import { Palette } from 'lucide-react';

const COLORS = [
  { name: '默认', value: '' },
  { name: '黑色', value: '#000000' },
  { name: '深灰', value: '#4B5563' },
  { name: '灰色', value: '#6B7280' },
  { name: '红色', value: '#EF4444' },
  { name: '橙色', value: '#F97316' },
  { name: '黄色', value: '#F59E0B' },
  { name: '绿色', value: '#10B981' },
  { name: '青色', value: '#06B6D4' },
  { name: '蓝色', value: '#3B82F6' },
  { name: '靛蓝', value: '#6366F1' },
  { name: '紫色', value: '#8B5CF6' },
  { name: '粉色', value: '#EC4899' },
];

export default function ColorPicker() {
  const { editor } = useCurrentEditor();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  const currentColor = editor?.getAttributes('textStyle').color || '';

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const setColor = (color: string) => {
    if (!editor) return;
    
    if (color === '') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setIsOpen(false);
  };

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  if (!editor) {
    return null;
  }

  const dropdown = isOpen ? (
    <div 
      ref={dropdownRef}
      className="fixed p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl min-w-[200px]"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        zIndex: 99999 
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <p className="text-xs mb-2 text-gray-600 dark:text-gray-400">选择颜色</p>
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color.value || 'default'}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setColor(color.value);
            }}
            className="group relative w-10 h-10 rounded-lg border-2 hover:scale-110 transition-transform cursor-pointer"
            style={{
              backgroundColor: color.value || '#ffffff',
              borderColor: currentColor === color.value ? '#3B82F6' : '#E5E7EB',
            }}
            title={color.name}
            type="button"
          >
            {color.value === '' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-0.5 bg-red-500 rotate-45" />
              </div>
            )}
            {currentColor === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onMouseDown={handleToggle}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
        title="文字颜色"
        type="button"
      >
        <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        {currentColor && (
          <div 
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
            style={{ backgroundColor: currentColor }}
          />
        )}
      </button>

      {dropdown && typeof document !== 'undefined' && createPortal(dropdown, document.body)}
    </>
  );
}

