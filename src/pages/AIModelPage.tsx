import React from 'react';
import { 
  Search, 
  GraduationCap, 
  Brain,
  Target,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  School,
  Globe,
  Sparkles
} from 'lucide-react';

function AIModelPage() {
  return (
    <div className="space-y-6">

      {/* AI 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'AI 选校助手',
            description: '智能分析学生背景,推荐最适合的申请院校和专业',
            icon: School,
            color: 'blue',
            features: [
              '智能匹配院校',
              '专业适配度分析',
              '录取概率预测',
              '申请策略建议'
            ]
          },
          {
            title: 'AI 背景评估',
            description: '全方位评估学生背景实力,提供提升建议',
            icon: Target,
            color: 'purple',
            features: [
              '学术能力评估',
              '竞争力分析',
              '背景提升建议',
              '申请优势分析'
            ]
          },
          {
            title: 'AI 文书助手',
            description: '智能辅助文书写作,提供修改建议和优化方案',
            icon: FileText,
            color: 'green',
            features: [
              '文书结构建议',
              '内容优化建议',
              '语言表达改进',
              '文书评分反馈'
            ]
          },
          {
            title: 'AI 学习规划',
            description: '制定个性化学习计划,追踪学习进度',
            icon: BookOpen,
            color: 'yellow',
            features: [
              '学习目标制定',
              '时间规划建议',
              '学习进度追踪',
              '效果评估反馈'
            ]
          },
          {
            title: 'AI 面试教练',
            description: '模拟面试训练,提供面试技巧和建议',
            icon: MessageSquare,
            color: 'orange',
            features: [
              '面试问题模拟',
              '答题技巧指导',
              '表达能力训练',
              '面试表现评估'
            ]
          },
          {
            title: 'AI 留学顾问',
            description: '智能解答留学相关问题,提供咨询建议',
            icon: Globe,
            color: 'indigo',
            features: [
              '政策解读咨询',
              '留学费用规划',
              '生活适应建议',
              '签证指导咨询'
            ]
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 bg-${feature.color}-50 rounded-xl dark:bg-${feature.color}-900/20`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                开始使用
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.features.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 使用统计 */}
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-6 dark:text-white">使用统计</h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { title: '总使用次数', value: '12,856', icon: Brain, color: 'blue' },
            { title: '本月使用', value: '2,365', icon: BarChart3, color: 'purple' },
            { title: '活跃用户', value: '856', icon: Sparkles, color: 'green' },
            { title: '平均评分', value: '4.8', icon: Target, color: 'yellow' }
          ].map((stat, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-xl font-bold mt-1 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIModelPage; 