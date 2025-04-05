import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  Target,
  Clock,
  Globe,
  Award,
  FileText,
  CheckCircle,
  ExternalLink,
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

// 竞赛类型定义
interface Competition {
  id: string;
  name: string;
  organizer: string;
  type: string;
  level: string;
  registrationDeadline: string;
  competitionDate: string;
  participants: string;
  requirements: string[];
  description: string;
  awards: string[];
  tags: string[];
  website: string;
  content?: string;
  registrationProcess?: string[];
}

const CompetitionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 模拟数据 - 实际项目中应该从API获取
  const competition: Competition = {
    id: "1",
    name: "ACM国际大学生程序设计竞赛",
    organizer: "ACM/ICPC基金会",
    type: "编程竞赛",
    level: "国际级",
    registrationDeadline: "2024-09-15",
    competitionDate: "2024-10-20",
    participants: "本科生",
    requirements: [
      "在校本科生",
      "熟练掌握C++/Java等编程语言",
      "具备算法和数据结构基础",
      "团队合作能力",
      "在压力下解决问题的能力"
    ],
    description: "ACM-ICPC是全球最具影响力的大学生程序设计竞赛，旨在展示大学生创新能力、团队精神和在压力下编写程序、分析和解决问题能力。",
    awards: [
      "金牌：奖金$3000",
      "银牌：奖金$2000",
      "铜牌：奖金$1000",
      "优秀奖：奖金$500",
      "最佳创新奖：奖金$1500"
    ],
    tags: ["算法", "编程", "团队赛"],
    website: "https://icpc.global",
    content: "ACM国际大学生程序设计竞赛（英文全称：ACM International Collegiate Programming Contest，简称ACM-ICPC或ICPC）是由美国计算机协会（ACM）主办的，一项旨在展示大学生创新能力、团队精神和在压力下编写程序、分析和解决问题能力的年度竞赛。\n\n经过近40年的发展，ACM国际大学生程序设计竞赛已经发展成为全球最具影响力的大学生程序设计竞赛，赛事由IBM公司赞助。\n\n比赛的历史可以上溯到1970年，当时在美国德克萨斯A&M大学举办了首届比赛。当时的主办方是the Alpha Chapter of the UPE Computer Science Honor Society。作为一种全新的发现和培养计算机科学顶尖学生的方式，竞赛很快得到发展。\n\n1977年，在ACM计算机科学会议期间举办了首次总决赛，并演变成为当前的一种多层次的竞赛活动。\n\n竞赛的目标是让参赛者有机会体验解决实际问题的挑战，培养团队合作精神，激发创造力和加强编程技能。",
    registrationProcess: [
      "组建3人团队",
      "在官方网站注册账号",
      "填写团队信息和个人信息",
      "缴纳报名费用",
      "等待审核通过",
      "参加区域赛",
      "获得晋级资格后参加全球总决赛"
    ]
  };

  // 获取状态样式
  const getLevelStyle = (level: string) => {
    switch (level) {
      case '国际级':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case '国家级':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case '企业级':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 返回按钮和标题 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/student/competitions')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">竞赛详情</h1>
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

      {/* 竞赛基本信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-6">
            <div>
              <h2 className="text-2xl font-bold dark:text-white mb-2">{competition.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {competition.organizer}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelStyle(competition.level)}`}>
                    {competition.level}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {competition.participants}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold dark:text-white mb-2">竞赛简介</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {competition.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {competition.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="md:w-1/3 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">报名截止日期</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  <span className="font-semibold dark:text-white">
                    {new Date(competition.registrationDeadline).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">比赛日期</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold dark:text-white">
                    {new Date(competition.competitionDate).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">官方网站</h3>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  <a
                    href={competition.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1"
                  >
                    访问官网
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
              立即报名
            </button>
          </div>
        </div>
      </motion.div>

      {/* 竞赛详细内容 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* 竞赛详情 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">竞赛详情</h3>
            <div className="prose dark:prose-invert max-w-none">
              {competition.content?.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 dark:text-gray-300 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* 参赛要求 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">参赛要求</h3>
            <ul className="space-y-3">
              {competition.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{requirement}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 报名流程 */}
          {competition.registrationProcess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold dark:text-white mb-4">报名流程</h3>
              <ol className="space-y-4">
                {competition.registrationProcess.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {/* 奖项设置 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold dark:text-white">奖项设置</h3>
            </div>
            <ul className="space-y-3">
              {competition.awards.map((award, index) => (
                <li key={index} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Trophy className={`h-5 w-5 ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-400' : 
                    index === 2 ? 'text-amber-600' : 'text-blue-500'
                  }`} />
                  <span className="text-gray-700 dark:text-gray-300">{award}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 相关文件 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-semibold dark:text-white">相关文件</h3>
            </div>
            <ul className="space-y-3">
              {[
                { name: "竞赛规则.pdf", size: "1.2MB" },
                { name: "报名表格.docx", size: "0.5MB" },
                { name: "往届题目示例.zip", size: "3.8MB" }
              ].map((file, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{file.size}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 相关竞赛推荐 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold dark:text-white mb-4">相关竞赛</h3>
            <div className="space-y-4">
              {[
                { id: "2", name: "蓝桥杯大赛", deadline: "2024-05-20" },
                { id: "3", name: "华为软件精英挑战赛", deadline: "2024-03-10" },
                { id: "4", name: "中国大学生计算机设计大赛", deadline: "2024-04-15" }
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/student/competitions/${item.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {item.deadline}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailPage; 