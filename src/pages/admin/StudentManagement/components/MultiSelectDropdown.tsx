import React, { useEffect, useMemo, useRef, useState } from 'react';

interface MultiSelectDropdownProps {
  label: string;
  icon: React.ReactNode;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  emptyText?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  icon,
  options,
  selected,
  onChange,
  emptyText = '暂无可选项',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener('mousedown', handler);
    }
    return () => {
      window.removeEventListener('mousedown', handler);
    };
  }, [open]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleSelectAll = () => {
    onChange(options);
  };

  const handleClear = () => {
    onChange([]);
  };

  const sortedOptions = useMemo(() => {
    const normalized = options.map((item) => item.trim()).filter(Boolean);
    return [...new Set(normalized)].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  }, [options]);

  const buttonLabel = useMemo(() => {
    if (selected.length === 0) return label;
    if (selected.length === 1) return `${label} · ${selected[0]}`;
    return `${label} · 已选 ${selected.length}`;
  }, [label, selected]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60"
      >
        {icon}
        {buttonLabel}
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            <span>共 {sortedOptions.length} 项</span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
              >
                清空
              </button>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-blue-500 transition hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                全选
              </button>
            </div>
          </div>
          <div className="max-h-60 divide-y divide-gray-100 overflow-y-auto text-sm dark:divide-gray-700/60">
            {sortedOptions.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
                {emptyText}
              </div>
            )}
            {sortedOptions.map((option) => {
              const active = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left transition ${
                    active
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60'
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {active && <span className="text-xs font-medium">已选</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;

