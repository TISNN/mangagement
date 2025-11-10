import { Calendar, Download, Filter, Search, Tag } from 'lucide-react';

interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export const FilterBar = ({ search, setSearch }: FilterBarProps) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800 xl:flex-row xl:items-center xl:justify-between">
    <div className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-700/60">
      <Search className="h-4 w-4 text-gray-400" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索导师姓名/标签/语言..."
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
      />
    </div>
    <div className="flex flex-wrap gap-2">
      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
        <Filter className="h-4 w-4" />
        角色
      </button>
      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
        <Tag className="h-4 w-4" />
        标签
      </button>
      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
        <Calendar className="h-4 w-4" />
        排班
      </button>
      <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
        <Download className="h-4 w-4" />
        导出导师数据
      </button>
    </div>
  </div>
);
