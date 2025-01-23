import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Brain, Sparkles, Rocket, Users, LineChart, School, Target, Award, BookOpen, Zap, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    controls.start({
      background: ['rgba(59,130,246,0.1)', 'rgba(168,85,247,0.1)', 'rgba(59,130,246,0.1)'],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    });
  }, []);

  const handleTryClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black/95">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,112,243,0.1),transparent_50%)]"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% auto'
              }}
            >
              让留学申请更智能、更高效
            </motion.h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              首个整合AI技术的留学服务数字化平台，连接学生、顾问和机构的智能生态系统。
              通过智能化工具、专业知识库和数字化服务，重新定义留学申请体验。
            </p>
            <motion.button 
              onClick={handleTryClick}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-medium relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">免费开始使用</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 核心数据 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                value: '30%',
                label: '提升申请成功率',
                description: '基于10000+真实申请案例',
                delay: 0
              },
              {
                icon: LineChart,
                value: '60%',
                label: '节省文书修改时间',
                description: '从3小时缩短至1.2小时',
                delay: 0.1
              },
              {
                icon: Award,
                value: '98%',
                label: '用户满意度',
                description: '来自最新用户调研数据',
                delay: 0.2
              },
              {
                icon: School,
                value: '15-20',
                label: '提升录取学校排名',
                description: '平均提升名次区间',
                delay: 0.3
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item.delay }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl text-center"
              >
                <item.icon className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {item.value}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-24 relative bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              智能化留学工具
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              基于GPT-4的AI技术，为您提供全方位的留学申请支持
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI文书优化系统',
                features: [
                  '实时智能修改建议',
                  '多语言文书润色',
                  '文书查重对比',
                  '院校风格匹配度分析'
                ],
                delay: 0
              },
              {
                icon: Target,
                title: '选校选专业AI助手',
                features: [
                  '基于大数据的院校匹配',
                  '专业发展前景分析',
                  '录取概率预测',
                  '个性化申请策略制定'
                ],
                delay: 0.2
              },
              {
                icon: BookOpen,
                title: '标准化考试助手',
                features: [
                  '智能化学习规划',
                  '个性化题库推荐',
                  '成绩提升预测',
                  '考试技巧指导'
                ],
                delay: 0.4
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item.delay }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl"
              >
                <item.icon className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-2xl font-semibold mb-6 text-white">
                  {item.title}
                </h3>
                <ul className="space-y-4">
                  {item.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-gray-300">
                      <Sparkles className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 服务优势 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              为什么选择我们
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              专业的团队、创新的技术、可靠的服务
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: '专业团队',
                description: '顶尖高校博士和行业专家组成的服务团队',
                delay: 0
              },
              {
                icon: Rocket,
                title: '技术创新',
                description: '基于GPT-4的AI模型，100万+训练样本',
                delay: 0.1
              },
              {
                icon: Zap,
                title: '高效服务',
                description: '文书修改和网申效率提升60-75%',
                delay: 0.2
              },
              {
                icon: MessageSquare,
                title: '全程支持',
                description: '7*24小时在线服务，专业顾问指导',
                delay: 0.3
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item.delay }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl text-center"
              >
                <item.icon className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 用户反馈 */}
      <section className="py-24 relative bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              用户反馈
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              听听他们怎么说
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                content: '通过AI文书优化系统，我的文书质量得到了显著提升，最终成功申请到了理想的学校。整个过程高效且专业。',
                author: '张同学',
                school: '已录取 UCB',
                delay: 0
              },
              {
                content: 'AI选校助手帮我找到了最适合的学校和专业，录取概率预测非常准确，让申请更有方向。',
                author: '李同学',
                school: '已录取 CMU',
                delay: 0.2
              },
              {
                content: '标准化考试助手的个性化学习计划很实用，配合题库练习，托福成绩提高了15分，非常感谢！',
                author: '王同学',
                school: '已录取 Columbia',
                delay: 0.4
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item.delay }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl"
              >
                <p className="text-gray-300 mb-8 italic">
                  "{item.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{item.author}</p>
                    <p className="text-blue-400">{item.school}</p>
                  </div>
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA部分 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                开启您的留学之旅
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                立即体验AI驱动的智能留学服务，让申请变得更简单、更高效
              </p>
              <motion.button 
                onClick={handleTryClick}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-medium relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">免费开始使用</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 