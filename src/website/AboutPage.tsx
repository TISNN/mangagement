import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Rocket, Users, Target } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 品牌叙述 */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_50%)]"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
              科技与美学的共鸣
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              我们相信，每一款优秀的产品都源自对美的追求与技术的执着。
              在2023年，我们开始了这场关于留学与AI的革命，以卓越的用户体验为目标，重构工具与服务的可能性。
              我们的愿景不仅是为用户解决问题，更是重新唤起技术与人类互动的魔力。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 品牌介绍与使命愿景 */}
      <section className="py-24 relative bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="inline-block mb-6 px-6 py-2 rounded-full bg-blue-50 border border-blue-200"
              >
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                  Infinite.ai
                </h2>
              </motion.div>
              <p className="text-xl text-gray-600 mb-8">
                智能导航与时代感结合，传递智能化引导的品牌调性
              </p>
              <div className="bg-white border border-gray-200 p-12 rounded-2xl shadow-sm">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Infinite.ai 源自"Navigation"（导航）与"Era"（时代）的创意组合，通过".ai"后缀彰显我们对人工智能技术的专注。
                  作为一家创新型教育科技公司，我们专注于将前沿AI技术与教育服务深度融合，打造了一个连接学习者、教育工作者和知识的
                  智能生态系统。通过技术创新重新定义学习体验，让教育服务更加智能、高效、个性化。在这里，每个人都能找到属于自己的
                  成长路径。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 使命 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm"
              >
                <Target className="w-8 h-8 text-blue-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  使命
                </h3>
                <p className="text-gray-600">
                  通过创新的AI技术和人性化的设计，为每一位学习者和教育工作者提供更智能、更高效的工具和服务。
                </p>
              </motion.div>

              {/* 愿景 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
                <Rocket className="w-8 h-8 text-blue-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  愿景
                </h3>
                <p className="text-gray-600">
                  成为教育科技领域的创新者和引领者，打造一个连接学习者、教育者和知识的智能生态系统。
                </p>
              </motion.div>

              {/* 价值观 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
                <Brain className="w-8 h-8 text-blue-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  价值观
                </h3>
                <p className="text-gray-600">
                  以创新驱动发展，以技术服务人性，让每一次学习都充满启发和愉悦。
                </p>
              </motion.div>

              {/* 理念 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
                <Sparkles className="w-8 h-8 text-blue-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  理念
                </h3>
                <p className="text-gray-600">
                  用科技重塑教育服务的边界，让知识的传递和学习的过程变得更加自然和高效。
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="py-24 relative bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
              核心优势
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 自研AI模型 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Brain className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                自研AI模型
              </h3>
              <p className="text-gray-600">
                基于大规模真实数据训练的专业AI模型，为用户提供精准的学习建议和申请指导。
              </p>
            </motion.div>

            {/* 创新交互设计 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Sparkles className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                创新交互设计
              </h3>
              <p className="text-gray-600">
                突破传统界面限制，通过流程图式界面和实时Agent支持，带来全新的学习体验。
              </p>
            </motion.div>

            {/* 专业服务团队 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Users className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                专业服务团队
              </h3>
              <p className="text-gray-600">
                由顶尖高校博士和行业专家组成的服务团队，确保服务质量和用户体验。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
              发展历程
            </h2>
          </motion.div>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="text-2xl font-bold text-blue-600 mr-4">2023</div>
                <h3 className="text-xl font-semibold text-gray-900">品牌创立</h3>
              </div>
              <p className="text-gray-600">
                开始这场关于学习与AI的革命，以卓越的用户体验为目标，重构学习工具与服务的可能性。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="text-2xl font-bold text-blue-600 mr-4">2024</div>
                <h3 className="text-xl font-semibold text-gray-900">产品升级</h3>
              </div>
              <p className="text-gray-600">
                推出全新的AI模型和交互界面，为用户带来更智能、更高效的服务体验。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 创始人团队 */}
      <section className="py-24 relative bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
              创始人团队
            </h2>
            <p className="text-xl text-gray-600">
              由顶尖高校博士和行业专家组成的核心团队，致力于用AI技术重新定义教育服务
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CEO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white border border-gray-200 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                Alice
              </h3>
              <p className="text-blue-600 font-medium mb-4">
                创始人 & CEO
              </p>
              <p className="text-gray-600">
                前Google AI研究员，斯坦福大学人工智能博士。在NLP和教育科技领域拥有多年研究经验，致力于将AI技术应用于教育服务。
              </p>
            </motion.div>

            {/* CTO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white border border-gray-200 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                Kevin
              </h3>
              <p className="text-blue-600 font-medium mb-4">
                联合创始人 & CTO
              </p>
              <p className="text-gray-600">
                前微软高级研究员，CMU计算机科学博士。专注于大规模AI系统架构设计和优化，主导开发多个创新性AI产品。
              </p>
            </motion.div>

            {/* CPO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white border border-gray-200 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                Grace
              </h3>
              <p className="text-blue-600 font-medium mb-4">
                联合创始人 & CPO
              </p>
              <p className="text-gray-600">
                哈佛大学教育学博士，20年教育行业经验。深谙教育产品设计与用户体验，推动产品持续创新与优化。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 加入我们 */}
      <section className="py-24 relative bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                加入我们，与AI共舞
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                如果您愿意与我们一起，加入塑造未来的旅程，我们期待您的到来。
              </p>
              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-medium relative overflow-hidden group shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">联系我们</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600"
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

export default AboutPage; 