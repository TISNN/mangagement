import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Rocket } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('student');

  const studentPlans = [
    {
      name: '基础版',
      price: '免费',
      features: [
        '基础文书模板库',
        '学校信息查询',
        '社区交流功能',
        '基础数据分析',
        '基础选校推荐',
        '申请材料管理'
      ],
      highlight: false,
      delay: 0
    },
    {
      name: '高级版',
      price: '¥299/月',
      features: [
        'AI文书优化系统',
        '智能选校匹配',
        '申请材料管理',
        '基础AI申请助手',
        '标准化考试助手',
        '7*24小时在线支持',
        '一对一咨询（1次/月）'
      ],
      highlight: true,
      delay: 0.2
    },
    {
      name: '专业版',
      price: '¥599/月',
      features: [
        '高级AI文书优化',
        '深度选校匹配',
        '全套申请材料管理',
        '高级AI申请助手',
        '考试规划指导',
        '优先技术支持',
        '一对一咨询（4次/月）',
        '定制化申请方案'
      ],
      highlight: false,
      delay: 0.4
    }
  ];

  const institutionPlans = [
    {
      name: '标准版',
      price: '¥999/月',
      features: [
        '智能CRM系统',
        '文书管理工具',
        '数据分析报告',
        '基础AI助手',
        '5个用户账号',
        '基础技术支持',
        '运营效率工具'
      ],
      highlight: false,
      delay: 0
    },
    {
      name: '企业版',
      price: '¥2999/月',
      features: [
        '高级CRM功能',
        'AI文书优化工具',
        '高级数据分析',
        '团队协作功能',
        '20个用户账号',
        'API访问权限',
        '多渠道营销工具',
        '定制化培训'
      ],
      highlight: true,
      delay: 0.2
    },
    {
      name: '定制版',
      price: '联系销售',
      features: [
        '私有化部署',
        '定制化开发',
        '无限用户账号',
        '专属技术支持',
        '一对一咨询服务',
        '高级数据分析',
        'API完全访问',
        '专属解决方案'
      ],
      highlight: false,
      delay: 0.4
    }
  ];

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
              选择适合您的方案
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              我们提供灵活的定价方案，满足不同用户的需求。
              无论您是学生还是教育机构，都能找到最适合的解决方案。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 价格切换 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-16">
            <div className="bg-white/5 backdrop-blur-lg p-1 rounded-full">
              <button
                className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'student'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('student')}
              >
                学生用户
              </button>
              <button
                className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'institution'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('institution')}
              >
                机构用户
              </button>
            </div>
          </div>

          {/* 价格卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(activeTab === 'student' ? studentPlans : institutionPlans).map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: plan.delay }}
                className={`relative ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10'
                    : 'bg-white/5'
                } backdrop-blur-lg border ${
                  plan.highlight ? 'border-blue-500/20' : 'border-white/10'
                } p-8 rounded-2xl hover:scale-105 transition-all duration-300`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm">
                      推荐方案
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      {plan.price}
                    </span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 mr-3 text-blue-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                  立即开始
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 产品优势 */}
      <section className="py-24 relative bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            为什么选择我们
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: '智能化服务',
                description: '基于前沿的AI大模型，提供智能文书优化、选校匹配、申请管理等全方位服务',
                delay: 0
              },
              {
                icon: Zap,
                title: '高效率工具',
                description: '文书修改时间缩短60%，网申效率提升75%，让申请过程更简单高效',
                delay: 0.2
              },
              {
                icon: Rocket,
                title: '专业支持',
                description: '专业顾问团队提供一对一指导，确保申请质量，提升录取成功率',
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
                <h3 className="text-2xl font-semibold mb-4 text-white">
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

      {/* FAQ部分 */}
      <section className="py-24 relative bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            常见问题
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                question: '如何选择合适的方案？',
                answer: '您可以根据自己的需求选择合适的方案。基础版适合初步了解和体验，高级版适合正在申请的学生，提供全面的AI辅助功能。专业版则为需要深度支持的用户提供一对一咨询和定制化服务。',
                delay: 0
              },
              {
                question: '可以随时更改我的订阅计划吗？',
                answer: '是的，您可以随时升级或降级您的订阅计划。升级后立即生效并享受更多功能，降级则在当前计费周期结束后生效。我们确保您能灵活选择最适合的方案。',
                delay: 0.2
              },
              {
                question: '如何获取技术支持？',
                answer: '我们提供多种支持渠道：7*24小时在线客服、邮件支持、社区问答等。高级版和专业版用户还可以获得优先技术支持和一对一咨询服务。',
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
                <h3 className="text-xl font-semibold mb-4 text-white">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
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
                需要帮助？
              </h2>
              <p className="text-gray-300 mb-12">
                如果您有任何问题或需要定制化方案，请随时联系我们的客服团队。
                我们将竭诚为您提供专业的咨询服务。
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105">
                联系客服
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage; 