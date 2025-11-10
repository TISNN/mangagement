import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe2,
  Mail,
  MessageSquare,
  PlayCircle,
  Share2,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

interface SourcePreview {
  title: string;
  description: string;
  knowledge: string;
  type: string;
}

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

interface DetailData {
  id: string;
  title: string;
  typeLabel: string;
  heroImage: string;
  creator: {
    name: string;
    role: string;
    avatar: string;
    socials: Array<{ id: string; label: string; href: string }>;
  };
  about: string;
  aiQuestions: string[];
  sources: SourcePreview[];
  usageTips: string[];
  features: Array<{ title: string; description: string }>;
  stats: { users: number; sources: number; reviews: number; rating: number; price: string };
  notes: string[];
  comments: CommentItem[];
}

const DETAIL_DATA: DetailData = {
  id: 'flowith-2025',
  title: 'flowith 2025 春季招募',
  typeLabel: 'Knowledge Base',
  heroImage: 'https://images.unsplash.com/photo-1531972111231-7482a960e109?auto=format&fit=crop&w=1600&q=80',
  creator: {
    name: 'Bruce Guai',
    role: 'AI Knowledge Base Creator',
    avatar: 'https://i.pravatar.cc/120?img=34',
    socials: [
      { id: 'twitter', label: 'Twitter', href: '#' },
      { id: 'github', label: 'GitHub', href: '#' },
      { id: 'linkedin', label: 'LinkedIn', href: '#' },
      { id: 'website', label: 'Website', href: '#' },
    ],
  },
  about: `为什么加入 flowith？\n\nflowith 的第一位成员是极易专注、简单、狂热的创造者，我们由最爱我们所做的事情。\n\n乔布斯说：“人们会越来越不会去做伟大的事情，因为没有人鼓励或告诉他们去尝试，他们也没有被容许尝试。没有人会对他们说‘去做伟大的事情’。”当我们建立了这样的文化，那么人们就能完成比自己想象更伟大的事。\n\n加入 flowith 的团队，是想让我们记住“可能性”这件事情。我们向一个人、一小群人做一些伟大的事情，并在历史长河中被铭记。\n\n创造不同寻常体验的常春藤型团队，无论你是“创造”“实习”“全职”或“合伙人”的身份加入，我们不在意你曾否上过大学，是在大厂身兼多职，还是自驱动创业者，我们欢迎你。\n\n我们真正的薪酬是持续的灵感、惊叹记忆、股权跃升，并持续迭代交付。`,
  aiQuestions: ['为什么加入 flowith?', 'flowith 招募的公司定位是什么?', 'flowith 本次招募想要哪些岗位?'],
  sources: [
    { title: 'Prompt Engineer & Agent Builder AI 工程师', description: '负责设计和优化 AI 提示，构建智能 Agent，实现智能化的客户服务与流程自动化。', knowledge: '1 章节', type: 'Document' },
    { title: 'Flowith AI Platform', description: '介绍 flowith AI Native 平台的结构与工具包，以及项目实战案例。', knowledge: '1 章节', type: 'Document' },
    { title: 'Customer Service Operator 客户服务运营', description: '搭建用户体验链路，提升满意度与留存率，是服务团队关键岗位之一。', knowledge: '1 章节', type: 'Document' },
    { title: 'Unlock Full Access', description: '购买即可解锁全部资源与独家策略。', knowledge: '', type: 'Locked' },
  ],
  usageTips: [
    '明确需求：指定具体岗位名称，关注特定工作要求，询问具体工作场景。',
    '深入了解：要求补充的指标、了解企业文化与安全等级。',
    '实战技巧：结合自身经历提问，要求实际案例与执行细节。',
  ],
  features: [
    { title: 'Knowledge Garden', description: '在有机知识生态中可视化成长。' },
    { title: 'Smart Seeds', description: '将复杂知识转化为 AI 驱动的知识单元。' },
    { title: 'Cross-pollination', description: '发现隐藏关联，生成新的洞察。' },
    { title: 'Second Brain', description: 'AI 增强的个人知识系统，与创作者共同成长。' },
  ],
  stats: { users: 563, sources: 19, reviews: 60, rating: 10, price: '$0' },
  notes: ['付款后 80% 收益归创作者', '一次性购买终身访问', '禁止转售或再分发', '更新包含在访问权益内'],
  comments: [
    { id: 'c1', author: 'Li·李李', avatar: 'https://i.pravatar.cc/80?img=52', date: '2025-08-13 19:11', content: '对 AI 时代的室内设计师从业十三年，希望把自己的专业知识传授给更多不懂的人。' },
    { id: 'c2', author: '777', avatar: 'https://i.pravatar.cc/80?img=10', date: '2025-06-22 22:51', content: '今天刚投了前端的简历把我收进了吧嗒啵啵喵喵。' },
    { id: 'c3', author: 'fgi ghj', avatar: 'https://i.pravatar.cc/80?img=68', date: '2025-06-19 01:22', content: '对经验和能力层面的要求。' },
    { id: 'c4', author: 'Freddie', avatar: 'https://i.pravatar.cc/80?img=14', date: '2025-06-16 23:06', content: '想了解产品经理的要求。' },
    { id: 'c5', author: 'Man Super', avatar: 'https://i.pravatar.cc/80?img=50', date: '2025-05-30 17:40', content: '这个怎么听呢。' },
  ],
};

const audienceColors: Record<string, string> = {
  免费: 'bg-emerald-100 text-emerald-600',
  付费: 'bg-indigo-100 text-indigo-600',
  订阅: 'bg-purple-100 text-purple-600',
  企业授权: 'bg-amber-100 text-amber-600',
};

const KnowledgeHubMarketDetailPage: React.FC = () => {
  const { id } = useParams();
  const data = DETAIL_DATA; // 后续可根据 id 拉取

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-white to-white pb-20 text-gray-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-6">
        <Link to="/admin/knowledge-hub/market" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <section className="relative mt-6 h-72 overflow-hidden rounded-3xl">
          <img src={data.heroImage} alt={data.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
              {data.typeLabel}
            </p>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">{data.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-3">
                <img src={data.creator.avatar} alt={data.creator.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/40" />
                <div>
                  <p className="text-white text-base font-semibold">{data.creator.name}</p>
                  <p>{data.creator.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">⭐ {data.stats.rating.toFixed(1)} Excellent</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">👥 {data.stats.users} Active Users</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <main className="space-y-8">
            <section className="rounded-3xl border border-gray-200 bg-white px-8 py-6 shadow-lg shadow-indigo-500/5 dark:border-gray-700 dark:bg-gray-900/80">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-300">{data.about}</div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white px-8 py-6 shadow-lg shadow-indigo-500/5 dark:border-gray-700 dark:bg-gray-900/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Try this knowledge base</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Test the difference between AI with and without knowledge base</p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  Compare in real-time
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium">
                {data.aiQuestions.map((q) => (
                  <button key={q} className="rounded-full bg-indigo-50 px-4 py-2 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {q}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-4 rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-inner dark:border-gray-700 dark:bg-gray-900/50 md:grid-cols-2">
                <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-6 dark:border-indigo-600/40 dark:from-indigo-900/40 dark:to-gray-900">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">Enhanced AI</span>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    With the knowledge base, I can provide more accurate and context-aware responses specific to this project...
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">Standard AI</span>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    I can provide general information but may not have specific details about this project...
                  </p>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">Type your question above to experience enhanced AI responses</p>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white px-8 py-6 shadow-lg shadow-indigo-500/5 dark:border-gray-700 dark:bg-gray-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sources Preview</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preview first 3 sources in this knowledge base</p>
                </div>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {data.sources.map((source, idx) => (
                  <div
                    key={source.title}
                    className={`flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 ${idx === data.sources.length - 1 ? 'border-dashed text-center text-gray-400 dark:text-gray-500' : ''}`}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-300">
                      <Sparkles className="h-4 w-4" /> {source.type}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{source.title}</h3>
                    <p className="mt-2 flex-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{source.description}</p>
                    {source.knowledge && <p className="mt-3 text-xs font-medium text-indigo-500 dark:text-indigo-300">{source.knowledge}</p>}
                    {idx === data.sources.length - 1 && (
                      <button className="mt-auto inline-flex items-center justify-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                        Unlock Full Access <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-indigo-100 bg-indigo-50/70 px-8 py-6 shadow-lg shadow-indigo-500/5 dark:border-indigo-500/40 dark:bg-indigo-900/20">
              <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">Usage Guidance</h2>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-indigo-600 dark:text-indigo-100">
                {data.usageTips.map((tip, index) => (
                  <li key={tip} className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-xs font-semibold text-indigo-600 shadow-sm dark:bg-indigo-800/60 dark:text-indigo-200">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {data.features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white px-8 py-6 shadow-lg shadow-indigo-500/5 dark:border-gray-700 dark:bg-gray-900/80">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h2>
              <div className="mt-4 space-y-4">
                {data.comments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
                    <div className="flex items-center gap-3">
                      <img src={comment.avatar} alt={comment.author} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <button className="rounded-full border border-gray-200 px-3 py-1 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:text-indigo-300">1</button>
                <button className="rounded-full border border-gray-200 px-3 py-1 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:text-indigo-300">2</button>
                <button className="rounded-full border border-gray-200 px-3 py-1 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:text-indigo-300">3</button>
                <span>…</span>
                <button className="rounded-full border border-gray-200 px-3 py-1 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:text-indigo-300">5</button>
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white px-6 py-6 shadow-lg shadow-indigo-500/5 dark:border-gray-700 dark:bg-gray-900/80">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 p-[2px]">
                  <div className="h-full w-full rounded-full bg-white dark:bg-gray-900/80">
                    <img src={data.creator.avatar} alt={data.creator.name} className="h-full w-full rounded-full object-cover" />
                  </div>
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">{data.creator.name}</h3>
                <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">{data.creator.role}</p>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex flex-wrap justify-center gap-2">
                  {data.creator.socials.map((social) => (
                    <button key={social.id} className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      {social.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white px-6 py-6 shadow-lg shadow-indigo-500/5 dark:border-gray-700 dark:bg-gray-900/80">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Statistics</h3>
              <div className="mt-4 grid gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between"><span>Active Users</span><span>{data.stats.users}</span></div>
                <div className="flex items-center justify-between"><span>Sources</span><span>{data.stats.sources}</span></div>
                <div className="flex items-center justify-between"><span>Reviews</span><span>{data.stats.reviews}</span></div>
                <div className="flex items-center justify-between"><span>Rating</span><span>{data.stats.rating.toFixed(1)} Excellent</span></div>
                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300"><span>Price</span><span>{data.stats.price}</span></div>
              </div>
              <div className="mt-6 space-y-3">
                <button className="w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                  Add to my knowledge garden
                </button>
                <button className="w-full rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  Share
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white px-6 py-6 shadow-lg shadow-indigo-500/5 dark:border-gray-700 dark:bg-gray-900/80">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Important Notes</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {data.notes.map((note) => (
                  <li key={note} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHubMarketDetailPage;