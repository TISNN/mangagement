import React from 'react';
import { Search, Filter, FileCheck, BarChart3, BookOpen, BarChart, ArrowUpRight } from 'lucide-react';

function CaseStudiesPage() {
  return (
    <div className="space-y-6">
      {/* 顶部搜索和筛选 */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索学校、专业、本科院校或语言成绩"
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          />
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <Filter className="h-5 w-5" />
        </button>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
          <option>所有地区</option>
          <option>香港</option>
          <option>澳门</option>
          <option>英国</option>
          <option>美国</option>
        </select>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
          <option>所有学校</option>
          <option>香港中文大学</option>
          <option>澳门大学</option>
        </select>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
          <option>所有专业类型</option>
          <option>法学</option>
          <option>商科</option>
          <option>工程</option>
        </select>
      </div>

      {/* 添加数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: '成功案例',
            value: '1,286',
            change: '+12.5%',
            icon: FileCheck,
            bgColor: 'bg-[#E3F1E6]',
            iconBgColor: 'bg-[#CCE6D3]',
            iconColor: 'text-[#5BA970]'
          },
          {
            title: '平均GPA',
            value: '87.6',
            change: '+2.3%',
            icon: BarChart3,
            bgColor: 'bg-[#EEF2FF]',
            iconBgColor: 'bg-[#E0E7FF]',
            iconColor: 'text-[#6366F1]'
          },
          {
            title: '平均雅思',
            value: '7.0',
            change: '+0.5',
            icon: BookOpen,
            bgColor: 'bg-[#F5F3FF]',
            iconBgColor: 'bg-[#EDE9FE]',
            iconColor: 'text-[#8B5CF6]'
          },
          {
            title: '录取率',
            value: '92%',
            change: '+5.2%',
            icon: BarChart,
            bgColor: 'bg-[#FEF3F2]',
            iconBgColor: 'bg-[#FEE4E2]',
            iconColor: 'text-[#F04438]'
          }
        ].map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.iconBgColor} rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 案例列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            school: '澳门大学',
            major: '国际商法（英文）法学硕士',
            background: {
              school: '深圳大学',
              major: '法学',
              gpa: '87.4',
              language: '雅思6.5'
            }
          },
          {
            school: '澳门大学',
            major: '法学硕士（中文）',
            background: {
              school: '上海大学',
              major: '知识产权',
              gpa: '87.21',
              language: '雅思7.0',
            }
          },
          {
            school: '澳门大学',
            major: '法学硕士（中文）',
            background: {
              school: '中国农业大学',
              major: '法学',
              gpa: '3.35',
              language: '雅思7.0'
            }
          },
          {
            school: '澳门科技大学',
            major: '法律硕士',
            background: {
              school: '华东政法大学',
              major: '社会学',
              gpa: '88',
              language: '雅思6.5'
            }
          },
          {
            school: '香港中文大学',
            major: '中国商业法法学硕士',
            background: {
              school: '中国政法大学',
              major: '法学',
              gpa: '88.5',
              language: '雅思7.5'
            }
          }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 space-y-4 dark:bg-gray-800">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold dark:text-white">{item.school}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">专业：{item.major}</p>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">本科院校</span>
                <span className="dark:text-gray-300">{item.background.school}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">本科专业</span>
                <span className="dark:text-gray-300">{item.background.major}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">GPA</span>
                <span className="dark:text-gray-300">{item.background.gpa}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">语言成绩</span>
                <span className="dark:text-gray-300">{item.background.language}</span>
              </div>
              {item.background.experience && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">工作经验</span>
                  <span className="dark:text-gray-300">{item.background.experience}</span>
                </div>
              )}
              {item.background.type && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">工作经验</span>
                  <span className="dark:text-gray-300">{item.background.type}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CaseStudiesPage; 