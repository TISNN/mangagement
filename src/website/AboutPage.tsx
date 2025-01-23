import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Rocket, Users, School, BarChart, Target, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 标题区域 */}
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
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              关于 Navra.ai
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              首个整合AI技术的留学服务数字化平台，连接学生、个人顾问和机构的智能生态系统。
              通过智能化工具、专业知识库和数字化服务，重新定义留学申请体验。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 核心数据 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            核心数据
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: '提升申请成功率',
                value: '30%',
                description: '基于10000+真实申请案例统计',
                delay: 0
              },
              {
                icon: BarChart,
                title: '节省文书修改时间',
                value: '60%',
                description: 'AI辅助下平均每篇文书修改时间从3小时缩短至1.2小时',
                delay: 0.1
              },
              {
                icon: Award,
                title: '用户满意度',
                value: '98%',
                description: '基于2023年第四季度用户调研数据',
                delay: 0.2
              },
              {
                icon: School,
                title: '提升录取学校排名',
                value: '15-20位',
                description: '平均提升录取学校排名',
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
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 使命愿景 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                我们的使命
              </h3>
              <p className="text-gray-300 leading-relaxed">
                通过创新的AI技术，为全球留学生提供智能化、个性化的申请服务，
                让留学申请变得更简单、更高效、更有价值。我们致力于用科技创新解决
                留学申请过程中的痛点问题，让每一位学生都能获得高质量的留学咨询服务。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                我们的愿景
              </h3>
              <p className="text-gray-300 leading-relaxed">
                成为全球领先的AI驱动留学服务平台，帮助更多学生实现他们的留学梦想，
                推动教育行业的数字化转型。通过持续创新和技术突破，构建连接学生、
                顾问和机构的智能生态系统，为留学行业带来革命性的变革。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="py-24 relative bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            核心优势
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: '自研AI模型',
                description: '基于GPT-4的语言模型深度定制，针对留学申请场景优化，训练数据超过100万篇文书样本，提供精准的智能服务',
                delay: 0
              },
              {
                icon: Users,
                title: '专业服务团队',
                description: '由顶尖高校博士和行业专家组成，拥有丰富的AI研发和教育行业经验，服务超过10000+留学申请者',
                delay: 0.2
              },
              {
                icon: Rocket,
                title: '持续创新能力',
                description: '不断探索AI技术在教育领域的应用，持续优化产品体验，已与500+机构达成合作，遍布全国30+城市',
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
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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

      {/* 发展历程 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            发展历程
          </motion.h2>
          <div className="space-y-8">
            {[
              {
                year: '2024',
                title: '全新升级',
                description: '推出基于GPT-4的新一代AI留学助手，服务规模突破10000+，用户满意度达98%',
                delay: 0
              },
              {
                year: '2023',
                title: '快速发展',
                description: '完成A轮融资，产品矩阵不断扩充，合作机构超500家，覆盖全国30+城市',
                delay: 0.2
              },
              {
                year: '2022',
                title: '正式成立',
                description: '公司正式成立，发布首个AI文书优化工具，获得种子轮投资，开启留学服务数字化转型',
                delay: 0.4
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item.delay }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl flex items-start space-x-8"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 团队介绍 */}
      <section className="py-24 relative bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            核心团队
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: '张三',
                title: '创始人 & CEO',
                description: '前Google AI研究员，斯坦福大学人工智能博士，在NLP领域拥有多项专利',
                delay: 0
              },
              {
                name: '李四',
                title: '技术副总裁',
                description: '前微软高级研究员，CMU计算机科学博士，主导开发多个大规模AI系统',
                delay: 0.2
              },
              {
                name: '王五',
                title: '教育总监',
                description: '20年留学咨询经验，哈佛大学教育学博士，服务过数千名成功申请者',
                delay: 0.4
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
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-blue-400 font-medium mb-4">
                  {item.title}
                </p>
                <p className="text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
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
                加入我们，共创未来
              </h2>
              <p className="text-gray-300 mb-12">
                如果您对我们的使命感兴趣，欢迎加入我们的团队。
                我们正在寻找优秀的工程师、产品经理和教育顾问，
                一起用AI技术改变教育行业。
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105">
                联系我们
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 