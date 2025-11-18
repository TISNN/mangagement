import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Rocket, Gift, TrendingUp, Users, Building2 } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('institution');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const studentPlans = [
    {
      name: '基础版',
      price: '免费',
      yearlyPrice: '免费',
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
      yearlyPrice: '¥2,490/年',
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
      yearlyPrice: '¥4,980/年',
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
      name: '入门版',
      subtitle: '个人老师/独立顾问',
      price: '¥99/月',
      yearlyPrice: '¥990/年',
      users: '1个管理员',
      students: '最多20个活跃学生',
      storage: '5GB',
      features: [
        '控制台',
        '任务管理',
        '申请进度跟踪',
        '学生管理（基础版）',
        '服务进度时间轴',
        '知识库访问',
        '会议管理',
        '数据导出（每月1次）',
        '邮件支持（48小时响应）'
      ],
      highlight: false,
      delay: 0,
      targetUsers: ['个人老师', '独立顾问', '刚起步的小型工作室']
    },
    {
      name: '专业版',
      subtitle: '小型机构（1-5人）',
      price: '¥299/月',
      yearlyPrice: '¥2,990/年',
      users: '最多5个管理员',
      students: '最多100个活跃学生',
      storage: '20GB',
      features: [
        '入门版全部功能',
        '文书工作台',
        '选校规划工具',
        '客户线索管理（CRM）',
        '合同与签约管理',
        '项目市场浏览',
        '导师人才市场',
        '知识花园访问',
        '数据导出（每月5次）',
        '邮件+在线客服（24小时响应）',
        '基础API（限1000次/月）'
      ],
      highlight: true,
      delay: 0.2,
      targetUsers: ['小型机构', '成长型工作室', '需要完整CRM功能']
    },
    {
      name: '团队版',
      subtitle: '中型机构（6-20人）',
      price: '¥799/月',
      yearlyPrice: '¥7,990/年',
      users: '最多20个管理员',
      students: '最多500个活跃学生',
      storage: '100GB',
      features: [
        '专业版全部功能',
        '客户分群分析',
        '协同空间（Collaboration Hub）',
        '全球教授库',
        '全球博士岗位',
        '合作方管理',
        '财务中台（基础版）',
        '高级筛选和报表',
        '数据导出（无限次）',
        '优先支持（12小时响应）',
        '专属客户成功经理',
        '标准API（限10000次/月）',
        '品牌定制（Logo、颜色）'
      ],
      highlight: false,
      delay: 0.4,
      targetUsers: ['中型机构', '成熟工作室', '需要数据分析']
    },
    {
      name: '企业版',
      subtitle: '大型机构（20+人）',
      price: '定制报价',
      yearlyPrice: '定制报价',
      users: '无限管理员',
      students: '无限活跃学生',
      storage: '无限',
      features: [
        '团队版全部功能',
        '所有高级功能',
        '教育培训模块（可选）',
        '专属部署（可选）',
        '数据本地化（可选）',
        '单点登录（SSO）',
        '高级权限管理',
        '数据导出（无限次+批量）',
        '7×24小时专属支持',
        '专属客户成功经理',
        '定期培训',
        '无限API调用',
        '完全定制化',
        '99.9% SLA保障'
      ],
      highlight: false,
      delay: 0.6,
      targetUsers: ['大型机构', '连锁机构', '集团化运营']
    }
  ];

  const addOns = [
    {
      name: '高级分析模块',
      price: '¥199/月',
      features: ['客户价值分析（RFM模型）', '转化漏斗深度分析', '自定义报表和仪表盘', '数据可视化增强']
    },
    {
      name: '教育培训模块',
      price: '¥399/月',
      features: ['课程目录管理', '排课与教室管理', '学习中心', '教师授课中心', '分级测试与评估']
    },
    {
      name: 'AI智能助手',
      price: '¥99/月 + ¥0.1/次',
      features: ['AI选校推荐', '智能文书建议', '自动任务分配', '智能客户分群', '前1000次免费']
    },
    {
      name: '数据导出增强',
      price: '¥49-99/月',
      features: ['无限次导出', '批量导出', '自定义导出格式', '定时自动导出']
    },
    {
      name: 'API高级访问',
      price: '¥199-399/月',
      features: ['无限API调用', 'Webhook支持', '高级API权限', 'API使用分析']
    }
  ];

  const usageBasedFeatures = [
    {
      name: '文书工作台高级功能',
      items: [
        { name: 'AI文书润色', price: '¥5/次' },
        { name: '专业翻译', price: '¥10/次' },
        { name: '查重检测', price: '¥15/次' },
        { name: '批量处理', price: '¥0.5/份' }
      ]
    },
    {
      name: '选校规划AI推荐',
      items: [
        { name: 'AI智能选校', price: '¥20/次' },
        { name: '深度分析报告', price: '¥50/次' }
      ]
    },
    {
      name: '营销自动化',
      items: [
        { name: '短信发送', price: '¥0.1/条' },
        { name: '邮件营销', price: '¥0.05/封' }
      ]
    },
    {
      name: '存储空间扩展',
      items: [
        { name: '额外存储', price: '¥10/GB/月' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 标题区域 */}
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
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
              <Gift className="w-4 h-4" />
              <span>14天免费试用，无需信用卡</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
              选择适合您的方案
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-4">
              低门槛起步，按需付费扩展。专为留学教育行业设计，从个人老师到大型机构，都能找到最适合的解决方案。
            </p>
            <p className="text-lg text-gray-500">
              年度订阅可节省17%，新用户首年8折优惠
            </p>
          </motion.div>
        </div>
      </section>

      {/* 价格切换 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8 mb-16">
            {/* 用户类型切换 */}
            <div className="bg-gray-100 p-1 rounded-full">
              <button
                className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'student'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('student')}
              >
                学生用户
              </button>
              <button
                className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'institution'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('institution')}
              >
                机构用户
              </button>
            </div>

            {/* 计费周期切换（仅机构用户） */}
            {activeTab === 'institution' && (
              <div className="flex items-center gap-4">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  月度
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  年度
                  <span className="ml-2 text-blue-600 text-xs font-medium">省17%</span>
                </span>
              </div>
            )}
          </div>

          {/* 价格卡片 */}
          <div className={`grid gap-8 ${activeTab === 'institution' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
            {(activeTab === 'student' ? studentPlans : institutionPlans).map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: plan.delay }}
                className={`relative flex flex-col ${
                  plan.highlight
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-white border border-gray-200'
                } shadow-sm p-8 rounded-2xl hover:scale-105 hover:shadow-lg transition-all duration-300`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                      推荐方案
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {plan.name}
                  </h3>
                  {activeTab === 'institution' && 'subtitle' in plan && (
                    <p className="text-sm text-gray-500 mb-4">{plan.subtitle}</p>
                  )}
                  <div className="mb-4">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                      {activeTab === 'institution' && billingCycle === 'yearly' && plan.yearlyPrice !== '定制报价'
                        ? plan.yearlyPrice
                        : plan.price}
                    </span>
                    {activeTab === 'institution' && billingCycle === 'yearly' && plan.yearlyPrice !== '定制报价' && (
                      <span className="text-sm text-gray-500 ml-2">/年</span>
                    )}
                  </div>
                  {activeTab === 'institution' && 'users' in plan && (
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{plan.users}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{plan.students}</span>
                      </div>
                      <div className="text-gray-500">
                        <span>存储: {plan.storage}</span>
                      </div>
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-gray-600 text-sm">
                      <Check className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md mt-auto">
                  {plan.price === '定制报价' || plan.price === '免费' ? '联系销售' : '免费试用14天'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 按需付费模块（仅机构用户） */}
      {activeTab === 'institution' && (
        <section className="py-24 relative bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                按需付费模块
              </h2>
              <p className="text-gray-600 text-lg">
                灵活购买额外功能，只为需要的功能付费
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{addon.name}</h3>
                    <span className="text-blue-600 font-medium">{addon.price}</span>
                  </div>
                  <ul className="space-y-2">
                    {addon.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <Check className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* 按使用量计费 */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">按使用量计费</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {usageBasedFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
                  >
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">{feature.name}</h4>
                    <div className="space-y-2">
                      {feature.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{item.name}</span>
                          <span className="text-blue-600 font-medium">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 产品优势 */}
      <section className="py-24 relative bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500"
          >
            为什么选择我们
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: '低门槛起步',
                description: '¥99/月起，适合个人老师和小型机构。无需高额投入，即可享受专业级服务',
                delay: 0
              },
              {
                icon: Zap,
                title: '按需付费',
                description: '灵活购买额外功能，只为实际使用的功能付费。不浪费，更经济',
                delay: 0.2
              },
              {
                icon: Rocket,
                title: '平滑升级',
                description: '清晰的成长路径，随业务发展自然升级。从个人到团队，无缝过渡',
                delay: 0.4
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item.delay }}
                className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm"
              >
                <item.icon className="w-8 h-8 text-blue-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ部分 */}
      <section className="py-24 relative bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500"
          >
            常见问题
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                question: '如何选择合适的方案？',
                answer: '入门版适合个人老师和独立顾问，管理20个以内学生。专业版适合1-5人的小型机构，需要完整CRM功能。团队版适合6-20人的中型机构，需要数据分析和高级功能。企业版适合大型机构，提供完全定制化服务。您可以根据团队规模和学生数量选择，也可以先试用14天再决定。',
                delay: 0
              },
              {
                question: '可以随时更改我的订阅计划吗？',
                answer: '是的，您可以随时升级或降级您的订阅计划。升级后立即生效并享受更多功能，降级则在当前计费周期结束后生效。年度订阅用户升级时，我们会按比例计算差价。',
                delay: 0.2
              },
              {
                question: '年度订阅有什么优惠？',
                answer: '年度订阅可节省17%的费用。例如入门版月度¥99/月，年度仅需¥990/年（相当于¥82.5/月）。新用户首年还可享受8折优惠。',
                delay: 0.4
              },
              {
                question: '免费试用包含哪些功能？',
                answer: '14天免费试用包含所有功能，无需信用卡。您可以完整体验系统，包括CRM、学生管理、文书工作台、选校规划等所有核心功能。试用期结束后，您可以选择合适的套餐继续使用。',
                delay: 0.6
              },
              {
                question: '按需付费模块如何计费？',
                answer: '按需付费模块可以随时购买和取消。例如高级分析模块¥199/月，AI智能助手¥99/月+按调用次数计费（前1000次免费）。按使用量计费的功能（如AI文书润色¥5/次）只在您使用时收费。',
                delay: 0.8
              },
              {
                question: '如何获取技术支持？',
                answer: '入门版提供邮件支持（48小时响应），专业版提供邮件+在线客服（24小时响应），团队版提供优先支持（12小时响应）+专属客户成功经理，企业版提供7×24小时专属支持+定期培训。',
                delay: 1.0
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item.delay }}
                className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-24 relative bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                需要帮助？
              </h2>
              <p className="text-gray-600 mb-12 text-lg">
                如果您有任何问题或需要定制化方案，请随时联系我们的客服团队。
                我们将竭诚为您提供专业的咨询服务。
              </p>
              <div className="flex gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-md">
                  免费试用14天
                </button>
                <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all duration-300 border-2 border-blue-600 shadow-sm">
                  联系客服
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
