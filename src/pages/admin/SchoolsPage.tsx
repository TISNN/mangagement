import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Search, Filter, BarChart3, ExternalLink, ArrowUpRight } from 'lucide-react';
import { School as SchoolType } from '../../services/schoolService';
import { schoolService } from '../../services';

const SchoolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSchools, setFilteredSchools] = useState<SchoolType[]>([]);
  
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const data = await schoolService.getAllSchools();
        setSchools(data);
        setFilteredSchools(data);
      } catch (error) {
        console.error('获取学校列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, []);
  
  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSchools(schools);
      return;
    }
    
    const filtered = schools.filter(school => 
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredSchools(filtered);
  }, [searchQuery, schools]);
  
  const goToSchoolDetail = (schoolId: string) => {
    navigate(`/admin/school-detail/${schoolId}`);
  };
  
  // 统计信息
  const stats = [
    { 
      title: '学校总数',
      value: schools.length.toString(),
      change: '',
      icon: School,
      bgColor: 'bg-[#E3F1E6]',
      iconBgColor: 'bg-[#CCE6D3]',
      iconColor: 'text-[#5BA970]'
    },
    {
      title: '美国学校',
      value: schools.filter(s => s.country === '美国').length.toString(),
      change: '',
      icon: BarChart3,
      bgColor: 'bg-[#EEF2FF]',
      iconBgColor: 'bg-[#E0E7FF]',
      iconColor: 'text-[#6366F1]'
    },
    {
      title: '英国学校',
      value: schools.filter(s => s.country === '英国').length.toString(),
      change: '',
      icon: ExternalLink,
      bgColor: 'bg-[#F5F3FF]',
      iconBgColor: 'bg-[#EDE9FE]',
      iconColor: 'text-[#8B5CF6]'
    },
    {
      title: '平均排名',
      value: schools.length 
        ? Math.round(schools.reduce((acc, s) => acc + s.ranking, 0) / schools.length).toString()
        : '0',
      change: '',
      icon: BarChart3,
      bgColor: 'bg-[#FEF3F2]',
      iconBgColor: 'bg-[#FEE4E2]',
      iconColor: 'text-[#F04438]'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题和搜索 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">学校库</h1>
          <p className="text-gray-500 dark:text-gray-400">浏览和搜索全球顶尖学校</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索学校名称、国家或城市..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6 dark:bg-gray-800`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.iconBgColor} rounded-full dark:bg-gray-700`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor} dark:text-white`} />
              </div>
              {stat.change && (
                <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <ArrowUpRight className="h-4 w-4" />
                  {stat.change}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* 学校列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 dark:text-white">全部学校</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                onClick={() => goToSchoolDetail(school.id)}
                className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                    {school.logo_url ? (
                      <img src={school.logo_url} alt={school.name} className="w-full h-full object-cover" />
                    ) : (
                      <School className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{school.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{school.city}, {school.country}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                        世界排名: {school.ranking}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {school.description}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredSchools.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">没有找到匹配的学校</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsPage;