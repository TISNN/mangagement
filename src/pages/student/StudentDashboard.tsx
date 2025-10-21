import React from 'react';
import { 
  GraduationCap, 
  FileText, 
  MessageSquare, 
  Calendar,
  ChevronRight,
  Bell,
  BookOpen,
  PenTool,
  BarChart2,
  Globe,
  BookMarked,
  Lightbulb,
  Trophy,
  Users,
  Timer,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 顶部欢迎语与通知 */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold dark:text-white">欢迎回来，张同学</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 relative">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {/* 申请进度概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '申请院校',
            value: '8所',
            desc: '2所已提交',
            icon: GraduationCap,
            color: 'blue'
          },
          {
            title: '文书状态',
            value: '5篇',
            desc: '3篇待修改',
            icon: FileText,
            color: 'purple'
          },
          {
            title: '咨询记录',
            value: '12次',
            desc: '导师评分 4.9',
            icon: MessageSquare,
            color: 'green'
          },
          {
            title: '最近DDL',
            value: '12.15',
            desc: 'UCB截止',
            icon: Calendar,
            color: 'red'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 学习资源中心 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">学习资源中心</h2>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'TOEFL备考指南',
              progress: '75%',
              icon: BookMarked,
              color: 'blue'
            },
            {
              title: 'GRE词汇课程',
              progress: '45%',
              icon: BookOpen,
              color: 'purple'
            },
            {
              title: '文书写作技巧',
              progress: '60%',
              icon: PenTool,
              color: 'green'
            }
          ].map((course, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <course.icon className={`h-5 w-5 text-${course.color}-500`} />
                <h3 className="font-medium dark:text-white">{course.title}</h3>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                <div 
                  className={`h-full bg-${course.color}-500 rounded-full`}
                  style={{ width: course.progress }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                完成度 {course.progress}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 申请进度时间轴 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">申请进度</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
              查看全部
            </button>
          </div>
          <div className="space-y-6">
            {[
              {
                school: 'UCB',
                program: 'Master of Computer Science',
                status: '材料审核中',
                date: '2024.12.15',
                color: 'blue'
              },
              {
                school: 'Stanford',
                program: 'Master of Computer Science',
                status: '文书修改中',
                date: '2024.12.20',
                color: 'yellow'
              },
              {
                school: 'MIT',
                program: 'Master of Computer Science',
                status: '准备材料中',
                date: '2025.01.05',
                color: 'gray'
              }
            ].map((app, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full bg-${app.color}-500`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold dark:text-white">{app.school}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{app.program}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium dark:text-white">{app.status}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{app.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 待办事项 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">待办事项</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
              添加待办
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                title: '完成UCB文书修改',
                deadline: '今天 23:59',
                priority: 'high'
              },
              {
                title: '准备Stanford成绩单',
                deadline: '明天 18:00',
                priority: 'medium'
              },
              {
                title: '预约导师咨询',
                deadline: '12月10日',
                priority: 'low'
              }
            ].map((todo, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className={`w-2 h-2 rounded-full ${
                  todo.priority === 'high' ? 'bg-red-500' :
                  todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium dark:text-white">{todo.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{todo.deadline}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 考试准备追踪 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">考试准备</h2>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
            设置目标
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              test: 'TOEFL',
              current: '95',
              target: '100',
              date: '2024.02.15',
              icon: Globe,
              color: 'blue'
            },
            {
              test: 'GRE',
              current: '320',
              target: '325',
              date: '2024.03.20',
              icon: BookOpen,
              color: 'purple'
            },
            {
              test: 'GMAT',
              current: '680',
              target: '700',
              date: '2024.04.10',
              icon: Trophy,
              color: 'yellow'
            },
            {
              test: 'IELTS',
              current: '7.0',
              target: '7.5',
              date: '2024.01.30',
              icon: BookOpen,
              color: 'green'
            }
          ].map((exam, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <exam.icon className={`h-5 w-5 text-${exam.color}-500`} />
                  <h3 className="font-medium dark:text-white">{exam.test}</h3>
                </div>
                <Timer className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">当前分数</p>
                  <p className="font-semibold dark:text-white">{exam.current}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">目标分数</p>
                  <p className="font-semibold text-blue-500">{exam.target}</p>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  考试日期: {exam.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 个性化推荐 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">推荐院校</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                school: 'Stanford University',
                program: 'MS in Computer Science',
                match: '95%',
                deadline: '2024.12.15'
              },
              {
                school: 'Carnegie Mellon University',
                program: 'MS in Software Engineering',
                match: '92%',
                deadline: '2024.12.31'
              }
            ].map((school, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium dark:text-white">{school.school}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{school.program}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-500">{school.match} 匹配度</p>
                  <p className="text-xs text-gray-400">截止: {school.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">学习建议</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'TOEFL口语提分技巧',
                type: '视频课程',
                duration: '45分钟',
                instructor: 'Sarah Johnson'
              },
              {
                title: '顶尖院校文书写作要点',
                type: '在线讲座',
                duration: '60分钟',
                instructor: 'Michael Chen'
              }
            ].map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium dark:text-white">{course.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{course.type}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{course.duration}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 推荐活动 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">推荐活动</h2>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: '留学申请讲座',
              date: '12月15日 19:00',
              desc: '了解2025年申请趋势和策略',
              icon: Lightbulb,
              color: 'yellow'
            },
            {
              title: '校友分享会',
              date: '12月18日 20:00',
              desc: '哈佛大学校友经验分享',
              icon: Users,
              color: 'blue'
            },
            {
              title: '模拟面试训练',
              date: '12月20日 15:00',
              desc: '提前适应面试环境和问题',
              icon: Trophy,
              color: 'green'
            }
          ].map((event, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <event.icon className={`h-5 w-5 text-${event.color}-500`} />
                  <h3 className="font-medium dark:text-white">{event.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{event.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 快捷功能入口 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '数据分析',
            desc: '申请追踪',
            icon: BarChart2,
            color: 'blue',
            path: '/student/analytics'
          },
          {
            title: '材料管理',
            desc: '文件管理',
            icon: FileText,
            color: 'purple',
            path: '/student/materials'
          },
          {
            title: '实习库',
            desc: '实习机会',
            icon: Briefcase,
            color: 'indigo',
            path: '/student/internships'
          },
          {
            title: '我的选校',
            desc: '选校记录',
            icon: GraduationCap,
            color: 'teal',
            path: '/student/school-selection'
          },
          {
            title: '竞赛库',
            desc: '学术竞赛',
            icon: Trophy,
            color: 'amber',
            path: '/student/competitions'
          },
          {
            title: '学习资源',
            desc: '备考课程',
            icon: BookOpen,
            color: 'green',
            path: '/student/resources'
          },
          {
            title: '社区交流',
            desc: '经验分享',
            icon: Users,
            color: 'orange',
            path: '/student/community'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate(feature.path)}
          >
            <div className={`p-3 bg-${feature.color}-50 rounded-xl w-fit dark:bg-${feature.color}-900/20 mb-4`}>
              <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
            </div>
            <h3 className="font-semibold dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard; 