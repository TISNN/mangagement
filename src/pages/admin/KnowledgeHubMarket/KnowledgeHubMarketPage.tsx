import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  Mail,
  Search,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

interface GardenCard {
  id: string;
  title: string;
  cover: string;
  description: string;
  score: number;
  reviews: number;
  sources: number;
  seeds: number;
  users: number;
  priceLabel: string;
  priceType: 'free' | 'paid' | 'subscription' | 'enterprise';
  author: {
    name: string;
    avatar: string;
  };
}

interface LeaderboardItem {
  id: string;
  title: string;
  author: string;
  metric: string;
  priceLabel: string;
  type: 'free' | 'paid' | 'subscription' | 'enterprise';
}

const HERO_TABS = ['Knowledge Market', 'Earn from Sharing', 'Connected Insights', 'Growing Together'];

const FEATURED_GARDENS: GardenCard[] = [
  {
    id: 'g1',
    title: 'Deepseek AI 竞品信息知识库',
    cover: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=960&q=80',
    description: '适合学习者与顾问使用，持续更新的 Deepseek 竞品资料库。',
    score: 10,
    reviews: 85,
    sources: 36,
    seeds: 205,
    users: 7303,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'Bruce Guai', avatar: 'https://i.pravatar.cc/80?img=34' },
  },
  {
    id: 'g2',
    title: '通往 AGI 之路：AI 研究与案例',
    cover: 'https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=960&q=80',
    description: '梳理 AGI 领域最新研究进展与成功案例，为技术顾问提供策略支持。',
    score: 8,
    reviews: 70,
    sources: 296,
    seeds: 700,
    users: 3865,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: '西柚', avatar: 'https://i.pravatar.cc/80?img=15' },
  },
  {
    id: 'g3',
    title: "The Founder's Advantage: Paul Graham Case",
    cover: 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=960&q=80',
    description: '创业者成长路径的深度分析，包含实战案例与投后策略建议。',
    score: 8,
    reviews: 29,
    sources: 14,
    seeds: 29,
    users: 1422,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'Bruce Guai', avatar: 'https://i.pravatar.cc/80?img=7' },
  },
  {
    id: 'g4',
    title: '张无弓的 AI 家庭教师课',
    cover: 'https://images.unsplash.com/photo-1443916568596-df5a58c445e9?auto=format&fit=crop&w=960&q=80',
    description: '融汇 AI 学习路径与家长陪伴指南，适合 K12 学习者与家长。',
    score: 8,
    reviews: 14,
    sources: 159,
    seeds: 426,
    users: 592,
    priceLabel: '$1.99',
    priceType: 'paid',
    author: { name: '张无弓', avatar: 'https://i.pravatar.cc/80?img=22' },
  },
];

const DISCOVER_TABS = ['For Students', 'For Advisors', 'For Partners'];

const DISCOVER_CONTENT: Record<string, GardenCard[]> = {
  'For Students': [
    {
      id: 's1',
      title: 'IELTS 7.5 冲刺营',
      cover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=960&q=80',
      description: '30 天口语、写作、听力全覆盖训练，附赠打卡工具包。',
      score: 9,
      reviews: 120,
      sources: 64,
      seeds: 320,
      users: 2103,
      priceLabel: '$4.99',
      priceType: 'paid',
      author: { name: 'Language Lab', avatar: 'https://i.pravatar.cc/80?img=45' },
    },
    {
      id: 's2',
      title: '英国申请文书写作诊所',
      cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=960&q=80',
      description: '精选真实范文与点评，帮助学生快速提升写作逻辑与语言。',
      score: 8,
      reviews: 58,
      sources: 45,
      seeds: 210,
      users: 1244,
      priceLabel: 'FREE',
      priceType: 'free',
      author: { name: 'UKEdu Lab', avatar: 'https://i.pravatar.cc/80?img=31' },
    },
  ],
  'For Advisors': [
    {
      id: 'a1',
      title: '北美高端案例打法 2025',
      cover: 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&w=960&q=80',
      description: '汇总 30+ 高难度案例与投后跟进 SOP，适合资深顾问。',
      score: 9,
      reviews: 76,
      sources: 56,
      seeds: 186,
      users: 982,
      priceLabel: 'FREE',
      priceType: 'free',
      author: { name: 'Advisor Guild', avatar: 'https://i.pravatar.cc/80?img=3' },
    },
    {
      id: 'a2',
      title: '家长期望管理与沟通话术',
      cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=960&q=80',
      description: '场景化沟通脚本、应对策略与复盘记录，降低投诉风险。',
      score: 8,
      reviews: 64,
      sources: 32,
      seeds: 142,
      users: 613,
      priceLabel: '$2.99',
      priceType: 'paid',
      author: { name: 'Service Ops', avatar: 'https://i.pravatar.cc/80?img=58' },
    },
  ],
  'For Partners': [
    {
      id: 'p1',
      title: 'B2B 产品培训全集',
      cover: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=960&q=80',
      description: '面向高校与教育机构的 SaaS 产品培训手册与案例库。',
      score: 8,
      reviews: 24,
      sources: 28,
      seeds: 92,
      users: 203,
      priceLabel: 'Enterprise',
      priceType: 'enterprise',
      author: { name: 'Partnership Lab', avatar: 'https://i.pravatar.cc/80?img=19' },
    },
    {
      id: 'p2',
      title: '海外招生活动手册',
      cover: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=960&q=80',
      description: '协助合作伙伴快速搭建海外学生活动与宣讲体系。',
      score: 7,
      reviews: 36,
      sources: 18,
      seeds: 66,
      users: 164,
      priceLabel: '$9.99',
      priceType: 'paid',
      author: { name: 'Global EDU', avatar: 'https://i.pravatar.cc/80?img=8' },
    },
  ],
};

const TRENDING: LeaderboardItem[] = [
  { id: 't1', title: '投资大师案例集', author: 'Ted W', metric: 'Downloads 1600', priceLabel: 'FREE', type: 'free' },
  { id: 't2', title: '东方智慧｜周易路径', author: 'newjeans', metric: 'Seeds 186', priceLabel: 'FREE', type: 'free' },
  { id: 't3', title: '设计人生案例库', author: 'RA', metric: 'Users 886', priceLabel: 'FREE', type: 'free' },
  { id: 't4', title: '亚马逊的商业智慧', author: 'RA', metric: 'Users 790', priceLabel: 'FREE', type: 'free' },
];

const NEW_RELEASES: LeaderboardItem[] = [
  { id: 'n1', title: '段永平的投资哲学', author: 'c2077', metric: 'New · 762 Users', priceLabel: 'FREE', type: 'free' },
  { id: 'n2', title: '八字命理案例拆解', author: 'Lize Zhang', metric: 'New · 615 Seeds', priceLabel: 'FREE', type: 'free' },
  { id: 'n3', title: '思维智库：认知升级', author: 'William Ye', metric: 'New · 710 Users', priceLabel: 'FREE', type: 'free' },
  { id: 'n4', title: 'Flowith 2025 春季招募', author: 'Bruce Guai', metric: 'New · 563 Users', priceLabel: 'FREE', type: 'free' },
];

const TOP_RATED: LeaderboardItem[] = [
  { id: 'r1', title: '北美申请案例拆解', author: 'Advisor Guild', metric: 'Rating 9.3', priceLabel: 'FREE', type: 'free' },
  { id: 'r2', title: '雅思口语 7.5 黄金模板', author: 'Language Lab', metric: 'Rating 9.1', priceLabel: '$4.99', type: 'paid' },
  { id: 'r3', title: '企业售后 FAQ 手册', author: 'Service Ops', metric: 'Rating 8.9', priceLabel: 'Enterprise', type: 'enterprise' },
  { id: 'r4', title: '家长沟通情绪导航', author: 'Service Ops', metric: 'Rating 8.7', priceLabel: '$2.99', type: 'paid' },
];

const ALL_GARDENS: GardenCard[] = [
  {
    id: 'ag1',
    title: '投资大师案例集',
    cover: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=960&q=80',
    description: '深入解析华尔街与顶级私募的投资逻辑，附真实案例拆解。',
    score: 7,
    reviews: 46,
    sources: 61,
    seeds: 969,
    users: 1600,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'Ted W', avatar: 'https://i.pravatar.cc/80?img=54' },
  },
  {
    id: 'ag2',
    title: '东方智慧 | 周易路径',
    cover: 'https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=960&q=80',
    description: '结合命理、决策与气场管理的实战课程，助力顾问洞察家庭需求。',
    score: 8,
    reviews: 17,
    sources: 29,
    seeds: 186,
    users: 1064,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'newjeans', avatar: 'https://i.pravatar.cc/80?img=28' },
  },
  {
    id: 'ag3',
    title: '设计你的人生：职业与人生规划',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80',
    description: '基于设计思维的方法论，帮助学生明确职业路径并落实行动计划。',
    score: 8,
    reviews: 12,
    sources: 19,
    seeds: 57,
    users: 886,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'RA', avatar: 'https://i.pravatar.cc/80?img=39' },
  },
  {
    id: 'ag4',
    title: '亚马逊的商业智慧',
    cover: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=960&q=80',
    description: '从亚马逊发展史提炼商业模型、团队文化与增长策略。',
    score: 8,
    reviews: 16,
    sources: 26,
    seeds: 77,
    users: 790,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'RA', avatar: 'https://i.pravatar.cc/80?img=41' },
  },
  {
    id: 'ag5',
    title: '段永平的投资哲学',
    cover: 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=960&q=80',
    description: '通过语录与实战案例拆解价值投资理念，附投资工具包。',
    score: 9,
    reviews: 24,
    sources: 80,
    seeds: 295,
    users: 762,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'c2077', avatar: 'https://i.pravatar.cc/80?img=60' },
  },
  {
    id: 'ag6',
    title: '八字命理·案例课',
    cover: 'https://images.unsplash.com/photo-1529338296731-c4280a44fc47?auto=format&fit=crop&w=960&q=80',
    description: '通过真实八字案例演示断语技法，适合文化类顾问拓展兴趣。',
    score: 6,
    reviews: 28,
    sources: 28,
    seeds: 715,
    users: 723,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'Lize Zhang', avatar: 'https://i.pravatar.cc/80?img=20' },
  },
  {
    id: 'ag7',
    title: '认知升级 · 思维智库',
    cover: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=960&q=80',
    description: '聚合心理学、行为经济学与决策模型，帮助顾问与管理者快速升级认知。',
    score: 7,
    reviews: 30,
    sources: 29,
    seeds: 630,
    users: 710,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'William Ye', avatar: 'https://i.pravatar.cc/80?img=11' },
  },
  {
    id: 'ag8',
    title: 'flowith 2025 春季招募',
    cover: 'https://images.unsplash.com/photo-1531972111231-7482a960e109?auto=format&fit=crop&w=960&q=80',
    description: '面向留学机构与合作伙伴的联合项目介绍，包含运营手册与案例。',
    score: 10,
    reviews: 60,
    sources: 19,
    seeds: 193,
    users: 563,
    priceLabel: 'FREE',
    priceType: 'free',
    author: { name: 'Bruce Guai', avatar: 'https://i.pravatar.cc/80?img=34' },
  },
];

const TAGS = ['留学规划', '语言培训', '申请工具', '销售话术', '服务交付', '案例库', 'B2B 培训', '家长沟通', 'AI 辅助', '课程包'];

const priceBadgeClass = (type: GardenCard['priceType'] | LeaderboardItem['type']) => {
  switch (type) {
    case 'free':
      return 'bg-emerald-100 text-emerald-600';
    case 'paid':
      return 'bg-indigo-100 text-indigo-600';
    case 'subscription':
      return 'bg-purple-100 text-purple-600';
    case 'enterprise':
      return 'bg-amber-100 text-amber-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const GardenCard: React.FC<{ card: GardenCard }> = ({ card }) => (
  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700/70 dark:bg-gray-900/60">
    <div className="relative h-40 overflow-hidden">
      <img src={card.cover} alt={card.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-gray-900/10 to-transparent" />
      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur">
          <Star className="h-3 w-3 text-yellow-300" />
          {card.score.toFixed(1)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur">
          <Users className="h-3 w-3" />
          {card.reviews}
        </span>
      </div>
    </div>
    <div className="flex flex-1 flex-col p-4">
      <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition group-hover:text-indigo-600 dark:text-white">
        {card.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-gray-400 dark:text-gray-500">
        <div>
          <p className="font-medium text-gray-600 dark:text-gray-300">Sources</p>
          <p>{card.sources}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600 dark:text-gray-300">Seeds</p>
          <p>{card.seeds}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600 dark:text-gray-300">Users</p>
          <p>{card.users}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <img src={card.author.avatar} alt={card.author.name} className="h-8 w-8 rounded-full object-cover" />
          <span>{card.author.name}</span>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priceBadgeClass(card.priceType)}`}>{card.priceLabel}</span>
      </div>
      <Link
        to={`/admin/knowledge-hub/market/${card.id}`}
        className="mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        Explore <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

const LeaderboardColumn: React.FC<{ title: string; items: LeaderboardItem[] }> = ({ title, items }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/70 dark:bg-gray-900/60">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">View leaderboard</button>
    </div>
    <div className="mt-4 space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-start gap-3">
          <div className="mt-1 text-sm font-semibold text-gray-400 dark:text-gray-500">{index + 1}.</div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priceBadgeClass(item.type)}`}>{item.priceLabel}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.author}</p>
            <p className="mt-1 text-xs text-indigo-500 dark:text-indigo-300">{item.metric}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const KnowledgeHubMarketPage: React.FC = () => {
  const [heroTab, setHeroTab] = React.useState(0);
  const [discoverTab, setDiscoverTab] = React.useState<'For Students' | 'For Advisors' | 'For Partners'>('For Students');

  return (
    <div className="space-y-10 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-500/90 via-purple-500/80 to-blue-500/80 px-8 py-12 text-white shadow-lg shadow-indigo-500/30 dark:from-indigo-700/80 dark:via-purple-700/80 dark:to-blue-700/80">
        <div className="max-w-4xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            <Sparkles className="h-3.5 w-3.5" /> Knowledge Market
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Create and Flow with the Knowledge Garden</h1>
          <p className="text-sm text-white/80">
            集合顾问、导师、合作伙伴的精选知识花园，为不同角色提供订阅、付费与授权。通过这里可追踪市场表现，招募创作者并连接学习者。
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:text-indigo-700">
              Start Publishing <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              浏览知识市场
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70">
          {HERO_TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setHeroTab(index)}
              className={`rounded-full px-4 py-1.5 transition ${heroTab === index ? 'bg-white text-indigo-600 shadow-sm' : 'bg-white/15 hover:bg-white/25'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">精选内容</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Popular and trending knowledge gardens</p>
          </div>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {FEATURED_GARDENS.map((card) => (
            <GardenCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">角色推荐</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tailored curation for different audiences</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-medium">
            {DISCOVER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setDiscoverTab(tab as typeof discoverTab)}
                className={`rounded-full px-4 py-1.5 transition ${discoverTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {DISCOVER_CONTENT[discoverTab].map((card) => (
            <GardenCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <LeaderboardColumn title="Trending" items={TRENDING} />
        <LeaderboardColumn title="New Releases" items={NEW_RELEASES} />
        <LeaderboardColumn title="Top Rated" items={TOP_RATED} />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">全部知识花园</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Showing 16 of 599 gardens — sorted by popular</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="h-10 w-72 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none transition hover:border-indigo-300 focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                placeholder="搜索知识花园..."
              />
            </div>
            <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              <Filter className="h-4 w-4" /> 筛选
            </button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {ALL_GARDENS.map((card) => (
            <GardenCard key={card.id} card={card} />
          ))}
        </div>
        <div className="flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            Load more
          </button>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-lg dark:from-indigo-700 dark:via-purple-700 dark:to-blue-700">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Become a Creator</p>
            <h3 className="text-2xl font-bold">在知识市场发布内容，持续获得收益</h3>
            <p className="text-sm text-white/80">
              创作草稿 → 审核 → 上线 → 收益，完整流程在 24 小时内可完成。支持付费、订阅、企业授权，收益数据即时回传。
            </p>
            <div className="grid gap-2 text-sm text-white/80">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 审核 SLA &lt; 24h</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 智能定价推荐与优惠管理</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 受众标签 + 脱敏保护</div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition hover:text-indigo-700">
              查看发布指南 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-2xl bg-white/15 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Join Community</p>
            <h4 className="mt-2 text-lg font-semibold">加入 1,200+ 创作者社群</h4>
            <p className="mt-2 text-sm text-white/80">定期获取选题灵感、运营报告、收益技巧与工具包，分享经验共同成长。</p>
            <div className="mt-6 space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Creator Guild · 每周主题分享</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> Newsletter · 月度运营报告</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> 线下/线上 Workshop</div>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
              加入社群 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-10 dark:border-gray-700 dark:bg-gray-900/70">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explore by tags</h3>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {TAGS.map((tag) => (
            <Link
              key={tag}
              to="/knowledge-garden/search"
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KnowledgeHubMarketPage;
