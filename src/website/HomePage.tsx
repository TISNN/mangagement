import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Brain, Sparkles, Rocket, Users, Target, Award, BookOpen, Zap, TrendingUp, Gift, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    controls.start({
      background: ['rgba(59,130,246,0.05)', 'rgba(37,99,235,0.08)', 'rgba(59,130,246,0.05)'],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    });
  }, []);

  const handleTryClick = () => {
    navigate('/login');
  };

  const handlePricingClick = () => {
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* 视频背景 */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
            style={{ filter: 'brightness(1.0)' }}
          >
            <source src="/uni.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              className="text-6xl font-bold mb-8 text-white"
              animate={{ 
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              让留学申请更加智能高效
            </motion.h1>
            <p className="text-xl text-white leading-relaxed mb-12">
              全球首个整合AI技术的留学服务数字化平台，连接学生、顾问和机构的智能生态系统。
              通过智能化工具、专业知识库和数字化服务，定义留学新范式。
            </p>
            <p className="text-xl text-white/90 leading-relaxed mb-12">
              不仅仅是工具，而是学习与成长的生态系统。
              重新定义学习与服务的未来。
            </p>

          </motion.div>
        </div>
      </section>




      {/* 核心价值 */}
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
              产品核心价值
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* 学生的全能助手 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Brain className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                学生的全能助手
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>AI文书优化与推荐：基于领先的AI模型，实时优化文书内容，提供院校与专业推荐</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>节点式学习与申请规划工具：动态可视化规划，轻松掌控整个申请流程</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>在线学习课程：从文书写作到科研方法，快速掌握关键技能</span>
                </li>
              </ul>
            </motion.div>

            {/* 留学机构的数字化转型伙伴 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Target className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                留学机构的数字化转型伙伴
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>智能CRM系统：提供从客户管理到数据分析的完整解决方案</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>自动化流程管理：支持院校推荐、文书批量优化和沟通管理</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>专业提升课程：帮助留学顾问掌握行业动态和专业技能</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 知识库的构建与售卖 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <BookOpen className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                知识库的构建与售卖
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>定制化知识库：创建、发布和管理专业知识，实现知识变现</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>共享与社群支持：将知识库与留学社群无缝连接</span>
                </li>
              </ul>
            </motion.div>

            {/* 领先的技术基础 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Zap className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                领先的技术基础
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>自研留学AI大模型：结合真实案例与数据，提供精准解决方案</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>AI对话支持：从灵感探讨到申请细节，全程陪伴，实时答疑</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>数据可视化：将学习和申请过程数字化、透明化</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 我们与众不同的地方 */}
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
              我们与众不同的地方
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 超越传统的交互体验 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Rocket className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                超越传统的交互体验
              </h3>
              <p className="text-gray-600">
                重新设计交互方式，将复杂任务拆解为动态节点，通过流程图式界面和实时Agent支持，实现学习与服务的全新升级。
              </p>
            </motion.div>

            {/* 知识即价值 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Award className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                知识即价值
              </h3>
              <p className="text-gray-600">
                通过定制化知识库，将专业知识体系化，支持发布与售卖功能，帮助用户将知识变现。
              </p>
            </motion.div>

            {/* 打造超级智能的终极容器 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Brain className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                打造超级智能的终极容器
              </h3>
              <p className="text-gray-600">
                学习与服务的未来不止于工具，而是与AI的深度共生。在这里，你将与AI共舞，解锁人机交互的新可能性。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 商业模式 */}
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
              商业模式：用户与机构的双向赋能
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 学生端 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Users className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                学生端：灵活的服务体系
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>免费版：基础文书模板、节点规划工具和社群互动</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>订阅版：解锁AI文书优化、课程学习、知识库使用等高级功能</span>
                </li>
              </ul>
            </motion.div>

            {/* 机构端 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Target className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                机构端：模块化解决方案
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>按需求提供CRM、自动化流程工具和数据分析功能</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>提供行业培训与社群活动支持，助力机构保持竞争优势</span>
                </li>
              </ul>
            </motion.div>

            {/* 独立顾问 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
            >
              <Users className="w-8 h-8 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                独立顾问
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>提供专业的AI工具和资源支持，助力顾问提升服务质量</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span>灵活的合作模式，帮助顾问拓展业务范围</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 定价优势 */}
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
              灵活的定价方案
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              低门槛起步，按需付费扩展。从个人老师到大型机构，都能找到最适合的解决方案
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl text-center shadow-sm"
            >
              <DollarSign className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                低门槛起步
              </h3>
              <p className="text-gray-600 mb-4">
                ¥99/月起，适合个人老师和独立顾问
              </p>
              <p className="text-sm text-gray-500">
                无需高额投入，即可享受专业级服务
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl text-center shadow-sm"
            >
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                按需付费
              </h3>
              <p className="text-gray-600 mb-4">
                灵活购买额外功能，只为需要的功能付费
              </p>
              <p className="text-sm text-gray-500">
                不浪费，更经济，随业务发展扩展
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-50 border border-gray-200 p-8 rounded-2xl text-center shadow-sm"
            >
              <Gift className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                14天免费试用
              </h3>
              <p className="text-gray-600 mb-4">
                无需信用卡，完整体验所有功能
              </p>
              <p className="text-sm text-gray-500">
                年度订阅可节省17%，新用户首年8折
              </p>
            </motion.div>
          </div>

          <div className="text-center">
            <motion.button
              onClick={handlePricingClick}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              查看完整定价方案
            </motion.button>
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
              <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                与AI共舞，定义未来
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                突破界限，让灵感与技术相遇，重新定义学习与服务的未来
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button 
                  onClick={handleTryClick}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-medium relative overflow-hidden group shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">免费开始使用</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                <motion.button
                  onClick={handlePricingClick}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all duration-300 border-2 border-blue-600 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  查看定价
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 