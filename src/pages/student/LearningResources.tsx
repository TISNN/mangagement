import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  Clock,
  Star,
  BarChart2,
  Calendar,
  Users,
  Search,
  Filter,
  ChevronRight,
  BookMarked,
  GraduationCap,
  Brain,
  Target,
  Trophy,
  Timer
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  progress: number;
  enrolled: number;
  rating: number;
  image: string;
}

const LearningResources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    '全部',
    '语言考试',
    '文书写作',
    '选校择专业',
    '面试技巧',
    '留学规划'
  ];

  const courses: Course[] = [
    {
      id: 1,
      title: 'TOEFL 口语高分技巧',
      category: '语言考试',
      instructor: 'Sarah Johnson',
      duration: '24课时',
      progress: 45,
      enrolled: 1280,
      rating: 4.8,
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=1'
    },
    {
      id: 2,
      title: '留学文书写作精讲',
      category: '文书写作',
      instructor: 'Michael Chen',
      duration: '16课时',
      progress: 75,
      enrolled: 960,
      rating: 4.9,
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=2'
    },
    {
      id: 3,
      title: '美国名校申请攻略',
      category: '选校择专业',
      instructor: 'Emily Wang',
      duration: '20课时',
      progress: 30,
      enrolled: 1560,
      rating: 4.7,
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=3'
    }
  ];

  const learningStats = [
    {
      title: '已学课程',
      value: '12门',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: '学习时长',
      value: '86小时',
      icon: Clock,
      color: 'purple'
    },
    {
      title: '完课率',
      value: '85%',
      icon: Target,
      color: 'green'
    },
    {
      title: '获得证书',
      value: '6个',
      icon: Trophy,
      color: 'yellow'
    }
  ];

  const recommendedCourses = [
    {
      title: 'GRE 数学满分攻略',
      instructor: 'David Zhang',
      level: '进阶',
      duration: '32课时'
    },
    {
      title: '英国名校申请指南',
      instructor: 'Lisa Wang',
      level: '入门',
      duration: '18课时'
    }
  ];

  const upcomingLessons = [
    {
      title: 'TOEFL 口语课程',
      time: '今天 14:30',
      instructor: 'Sarah Johnson',
      duration: '45分钟'
    },
    {
      title: '文书写作指导',
      time: '明天 10:00',
      instructor: 'Michael Chen',
      duration: '60分钟'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 顶部搜索和筛选 */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="p-2 ml-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* 学习统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {learningStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 进行中的课程 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <div className="aspect-video bg-gray-100 dark:bg-gray-700">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-500 font-medium">{course.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{course.rating}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{course.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{course.instructor}</span>
                <span>·</span>
                <span>{course.duration}</span>
                <span>·</span>
                <span>{course.enrolled}人学习</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">学习进度</span>
                  <span className="font-medium dark:text-white">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 推荐课程和即将开始的课程 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 推荐课程 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">推荐课程</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {recommendedCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <BookMarked className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{course.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.instructor} · {course.level} · {course.duration}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* 即将开始的课程 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">即将开始</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
              查看日程
            </button>
          </div>
          <div className="space-y-4">
            {upcomingLessons.map((lesson, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Timer className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{lesson.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lesson.time} · {lesson.instructor} · {lesson.duration}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                  进入课程
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResources; 