import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Building2, Clock, DollarSign, User, Phone, Mail, Share2, Bookmark, BookmarkCheck } from "lucide-react";

// 内推岗位类型定义
interface ReferralPosition {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  requirements: string[];
  description: string;
  salary: string;
  postedDate: string;
  deadline: string;
  responsibilities: string[];
  benefits: string[];
  applicationProcess: string[];
  referralContact: string;
  referralProcess: string;
  contactPhone: string;
  contactEmail: string;
}

const ReferralDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 模拟数据 - 实际项目中应该从API获取
  const position: ReferralPosition = {
    id: "1",
    title: "产品经理实习生",
    company: "字节跳动",
    location: "北京",
    type: "实习",
    duration: "3-6个月",
    requirements: [
      "产品设计相关专业在读学生",
      "良好的沟通能力和团队协作能力",
      "数据分析能力",
      "对互联网产品有浓厚兴趣",
      "有产品实习经验优先",
      "英语能力良好"
    ],
    description: "作为字节跳动产品经理实习生，你将参与核心产品的产品设计和优化工作，与产品团队紧密协作，负责产品功能的规划、设计和落地。这是一个难得的机会，让你在真实的工作环境中学习和成长。",
    salary: "20-30k/月",
    postedDate: "2024-03-17",
    deadline: "2024-04-17",
    responsibilities: [
      "参与产品功能规划和设计",
      "进行用户研究和数据分析",
      "编写产品需求文档",
      "与设计、开发团队协作",
      "跟踪产品上线效果"
    ],
    benefits: [
      "具有竞争力的实习薪资",
      "灵活的工作时间",
      "导师指导计划",
      "免费工作餐",
      "健身房会员",
      "医疗保险"
    ],
    applicationProcess: [
      "提交简历至学屿",
      "学屿内部筛选",
      "内推至字节跳动",
      "面试安排",
      "发放offer"
    ],
    referralContact: "张老师",
    referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至字节跳动 4. 面试安排",
    contactPhone: "400-123-4567",
    contactEmail: "referral@xueyu.com"
  };

  return (
    <div className="space-y-6 p-6">
      {/* 返回按钮和标题 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/student/internships')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">内推岗位详情</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="h-5 w-5 text-green-500" />
                <span>已收藏</span>
              </>
            ) : (
              <>
                <Bookmark className="h-5 w-5" />
                <span>收藏</span>
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
            <Share2 className="h-5 w-5" />
            <span>分享</span>
          </button>
        </div>
      </div>

      {/* 职位基本信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-4">
            <div>
              <h2 className="text-2xl font-bold dark:text-white mb-2">{position.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {position.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {position.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {position.duration}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold dark:text-white mb-2">职位介绍</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {position.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {position.requirements.slice(0, 3).map((req, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div className="md:w-1/3 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">薪资待遇</h3>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="font-semibold dark:text-white">{position.salary}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">申请截止日期</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  <span className="font-semibold dark:text-white">{position.deadline}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">发布日期</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold dark:text-white">{position.postedDate}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors">
              申请内推
            </button>
          </div>
        </div>
      </motion.div>

      {/* 详细内容 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* 工作职责 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">工作职责</h3>
            <ul className="space-y-3">
              {position.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 任职要求 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">任职要求</h3>
            <ul className="space-y-3">
              {position.requirements.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* 内推信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">内推信息</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <User className="h-5 w-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">内推联系人：{position.referralContact}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Phone className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">联系电话：{position.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Mail className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">联系邮箱：{position.contactEmail}</span>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2 dark:text-white">内推流程</h4>
                <p className="text-gray-600 dark:text-gray-300 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">{position.referralProcess}</p>
              </div>
            </div>
          </motion.div>

          {/* 福利待遇 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">福利待遇</h3>
            <div className="flex flex-wrap gap-2">
              {position.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-2 text-sm">
                  {benefit}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* 申请流程 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">申请流程</h3>
            <ol className="space-y-4">
              {position.applicationProcess.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDetailPage; 