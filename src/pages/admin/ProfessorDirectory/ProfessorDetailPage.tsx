import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Phone,
  ClipboardPenLine,
  ExternalLink,
  GraduationCap,
  Heart,
  ListChecks,
  Loader2,
  Mail,
  MapPin,
  Medal,
  NotebookPen,
  Quote,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfessorProfile } from './types';
import {
  fetchProfessorDetail,
  fetchProfessorFavorites,
  addProfessorFavorite,
  removeProfessorFavorite,
} from '@/services/professorDirectoryService';
import { useAuth } from '@/context/AuthContext';
import ProfessorMatchDrawer from './components/ProfessorMatchDrawer';
import { StudentMatchOption } from '@/services/professorDirectoryService';

const getProfessorAvatar = (profile: ProfessorProfile) => {
  if (profile.avatar) return profile.avatar;
  const seed = encodeURIComponent(profile.name || 'Professor');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&fontWeight=600&backgroundType=gradientLinear`;
};

type FeedbackState = {
  message: string;
  variant: 'success' | 'info' | 'error';
} | null;

const ProfessorDetailPage: React.FC = () => {
  const { professorId } = useParams<{ professorId: string }>();
  const navigate = useNavigate();
  const { userType, profile: userProfile, loading: authLoading } = useAuth();
  const employeeId = userType === 'admin' && userProfile ? Number(userProfile.id) : null;

  const [professor, setProfessor] = useState<ProfessorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoriteProfiles, setFavoriteProfiles] = useState<ProfessorProfile[]>([]);

  const [matchDrawerOpen, setMatchDrawerOpen] = useState(false);
  const [matchProfessor, setMatchProfessor] = useState<ProfessorProfile | null>(null);
  const [studentOptions] = useState<StudentMatchOption[]>([]);
  const [favoritesPanelOpen, setFavoritesPanelOpen] = useState(false);

  // 加载教授详情
  useEffect(() => {
    if (!professorId || authLoading) return;

    let active = true;
    setLoading(true);
    setError(null);

    fetchProfessorDetail(Number(professorId))
      .then((data) => {
        if (active && data) {
          setProfessor(data);
        } else if (active) {
          setError('未找到该教授信息');
        }
      })
      .catch((err) => {
        console.error('[ProfessorDetailPage] 加载教授详情失败', err);
        if (active) setError('加载教授详情失败，请稍后重试');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [professorId, authLoading]);

  // 加载收藏列表
  useEffect(() => {
    if (authLoading || !employeeId) {
      setFavoriteIds([]);
      setFavoriteProfiles([]);
      setFavoritesLoading(false);
      return;
    }

    let active = true;
    setFavoritesLoading(true);

    fetchProfessorFavorites(employeeId)
      .then((ids) => {
        if (active) setFavoriteIds(ids);
      })
      .catch((err) => {
        console.error('[ProfessorDetailPage] 加载收藏列表失败', err);
      })
      .finally(() => {
        if (active) setFavoritesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [employeeId, authLoading]);

  // 加载收藏的教授详情
  useEffect(() => {
    if (authLoading || favoriteIds.length === 0) {
      setFavoriteProfiles([]);
      return;
    }

    let active = true;

    const loadFavorites = async () => {
      try {
        const profiles = await Promise.all(
          favoriteIds.map((id) => fetchProfessorDetail(id))
        );
        if (active) {
          setFavoriteProfiles(profiles.filter((p): p is ProfessorProfile => p !== null));
        }
      } catch (err) {
        console.error('[ProfessorDetailPage] 加载收藏教授详情失败', err);
      }
    };

    loadFavorites();

    return () => {
      active = false;
    };
  }, [favoriteIds, authLoading]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleToggleFavorite = useCallback(
    async (nextState: boolean) => {
      if (!employeeId || !professor) {
        setFeedback({ message: '当前账号未关联员工信息，无法收藏。', variant: 'error' });
        return;
      }

      try {
        if (nextState) {
          await addProfessorFavorite(professor.id, employeeId);
          setFavoriteIds((prev) => (prev.includes(professor.id) ? prev : [...prev, professor.id]));
          setFeedback({ message: `已收藏 ${professor.name}`, variant: 'success' });
          setFavoritesPanelOpen(true);
        } else {
          await removeProfessorFavorite(professor.id, employeeId);
          setFavoriteIds((prev) => prev.filter((id) => id !== professor.id));
          setFeedback({ message: `已移除 ${professor.name} 收藏`, variant: 'info' });
        }
      } catch (err) {
        console.error('[ProfessorDetailPage] 更新收藏失败', err);
        setFeedback({ message: '更新收藏失败，请稍后再试。', variant: 'error' });
      }
    },
    [employeeId, professor]
  );

  const handleRemoveFavorite = useCallback(
    async (id: number) => {
      if (!employeeId) {
        setFeedback({ message: '当前账号未关联员工信息，无法移除收藏。', variant: 'error' });
        return;
      }

      try {
        await removeProfessorFavorite(id, employeeId);
        setFavoriteIds((prev) => prev.filter((existing) => existing !== id));
        setFeedback({ message: '已从收藏清单移除', variant: 'info' });
      } catch (err) {
        console.error('[ProfessorDetailPage] 移除收藏失败', err);
        setFeedback({ message: '移除收藏失败，请稍后重试。', variant: 'error' });
      }
    },
    [employeeId]
  );

  const handleOpenMatch = useCallback((profile: ProfessorProfile) => {
    setMatchProfessor(profile);
    setMatchDrawerOpen(true);
  }, []);

  const handleMatchSubmit = useCallback(
    async (prof: ProfessorProfile, _payload: { studentId: number; targetIntake: string; customNote?: string }) => {
      void _payload;
      // 这里应该调用匹配服务，暂时只显示成功消息
      setFeedback({
        message: `已为 ${prof.name} 创建匹配记录，申请工作台会提醒跟进。`,
        variant: 'success',
      });
    },
    []
  );

  const handleToggleFavoritesPanel = useCallback(() => {
    setFavoritesPanelOpen((prev) => !prev);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>正在加载教授详情...</span>
        </div>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="ghost" onClick={() => navigate('/admin/professor-directory')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回教授库
        </Button>
        <Alert className="rounded-2xl border-red-200 bg-red-50 text-red-700">
          <AlertDescription>{error || '未找到该教授信息'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const avatar = getProfessorAvatar(professor);
  const isFavorited = favoriteIds.includes(professor.id);
  const additionalTitles = professor.additionalTitles ?? [];
  const educationList = professor.education ?? [];
  const courses = professor.courses ?? [];
  const researchInterests = professor.researchInterests ?? [];
  const researchProjects = professor.researchProjects ?? [];
  const awards = professor.awards ?? [];
  const publications = professor.publications ?? [];
  const placements = professor.recentPlacements ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pb-8 dark:bg-gray-950">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-transparent">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/professor-directory')}
              className="gap-2 rounded-full bg-indigo-500 px-4 py-2 text-white shadow-sm hover:bg-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              返回教授库
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleToggleFavoritesPanel}
                className={`gap-2 rounded-full px-4 py-2 text-white shadow-sm ${
                  favoritesPanelOpen ? 'bg-indigo-700 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                {favoritesPanelOpen ? '收起收藏清单' : '教授收藏清单'}
              </Button>
              <Button
                variant={isFavorited ? 'default' : 'outline'}
                onClick={() => handleToggleFavorite(!isFavorited)}
                className={`gap-2 rounded-full px-4 py-2 shadow-sm ${
                  isFavorited ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? '已收藏' : '收藏'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {feedback && (
          <Alert
            className={`mb-6 rounded-2xl border ${
              feedback.variant === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : feedback.variant === 'info'
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}

        <div
          className={`grid gap-6 ${
            favoritesPanelOpen ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''
          }`}
        >
          {/* 主内容区 */}
          <div className="space-y-6">
            {/* 教授头部信息 */}
          <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 px-6 pb-6 pt-6 text-white shadow-lg">
            <div className="relative z-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <img
                    src={avatar}
                    alt={professor.name}
                    className="h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-indigo-400/40"
                  />
                  <h1 className="mt-4 text-2xl font-semibold">{professor.name}</h1>
                  {professor.primaryTitle && (
                    <p className="mt-1 text-sm text-indigo-100">{professor.primaryTitle}</p>
                  )}
                  {additionalTitles.length > 0 && (
                    <div className="mt-2 w-full text-xs text-indigo-100 sm:max-w-md">
                      {additionalTitles.map((title) => (
                        <p key={title} className="leading-relaxed">
                          {title}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex w-full flex-col items-center gap-1 text-xs text-indigo-100 sm:items-start sm:text-left">
                    <div className="inline-flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{professor.contactPhone || '暂无电话信息'}</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="break-all">
                        {professor.contactEmail || '暂无邮箱信息'}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {professor.profileUrl ? (
                        <a
                          href={professor.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-100 underline decoration-indigo-200/60 underline-offset-2 transition hover:text-white hover:decoration-white"
                        >
                          官方介绍链接
                        </a>
                      ) : (
                        <span>暂无官方介绍链接</span>
                      )}
                    </div>
                  </div>
                  {professor.phdSupervisionStatus && (
                    <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-indigo-300/50 bg-indigo-500/20 px-2 py-0.5 text-[11px] text-indigo-100">
                      <Sparkles className="h-3 w-3" />
                      {professor.phdSupervisionStatus}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center text-center text-xs text-indigo-100 sm:items-end sm:text-right">
                  <p className="text-sm font-semibold text-white sm:text-base">{professor.university}</p>
                  <p className="mt-1">{professor.college}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs sm:justify-end">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {professor.country}
                      {professor.city ? ` · ${professor.city}` : ''}
                    </span>
                  </p>
                </div>
              </div>
            </div>

              <div className="absolute -left-10 -top-24 hidden h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl sm:block" />
              <div className="absolute -right-10 -bottom-24 hidden h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl sm:block" />
            </div>

            {/* 教授简介 */}
            {professor.biography && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                  <Quote className="h-4 w-4 text-indigo-500" />
                  教授简介
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                  {professor.biography}
                </p>
              </div>
            )}

            {/* 教育背景与课程 */}
            {(educationList.length > 0 || courses.length > 0) && (
              <div className="space-y-4">
                {educationList.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <GraduationCap className="h-4 w-4 text-indigo-500" />
                      教育背景
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {educationList.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {courses.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <NotebookPen className="h-4 w-4 text-indigo-500" />
                      授课课程
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {courses.map((course) => (
                        <li key={course} className="flex items-start gap-2">
                          <ListChecks className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 研究方向与项目 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                研究方向与项目
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {professor.researchTags.length > 0 ? (
                  professor.researchTags.map((tag) => (
                    <Badge key={tag} className="rounded-full bg-indigo-50 text-xs text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500">暂无研究方向信息</span>
                )}
              </div>
              {researchInterests.length > 0 && (
                <div className="mt-4 rounded-xl bg-indigo-50/60 p-4 text-sm text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-100">
                  <p className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">研究兴趣</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {researchInterests.map((interest) => (
                      <Badge
                        key={interest}
                        className="rounded-full border border-indigo-200 bg-white/80 text-xs text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">当前重点项目</p>
                {researchProjects.length > 0 ? (
                  <ul className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    {researchProjects.map((project) => (
                      <li key={project.title} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{project.title}</p>
                        {project.description && (
                          <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{project.description}</p>
                        )}
                        {project.tags && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <Badge
                                key={`${project.title}-${tag}`}
                                className="rounded-full bg-indigo-500/10 text-[10px] text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-200"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : professor.signatureProjects.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {professor.signatureProjects.map((project) => (
                      <li key={project} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>{project}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">暂无具体项目介绍。</p>
                )}
              </div>
            </div>

            {/* 三列信息卡片 */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* 博士申请要求 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <ClipboardList className="h-4 w-4 text-indigo-500" />
                  博士申请要求
                </h4>
                <dl className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {professor.phdRequirements.languageTests.length > 0 && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-gray-400">语言要求</dt>
                      <dd className="mt-0.5">{professor.phdRequirements.languageTests.join(' / ')}</dd>
                    </div>
                  )}
                  {professor.phdRequirements.minimumGPA && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-gray-400">GPA</dt>
                      <dd className="mt-0.5">{professor.phdRequirements.minimumGPA}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">推荐信数量</dt>
                    <dd className="mt-0.5">{professor.phdRequirements.recommendationLetters} 封</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">科研经验</dt>
                    <dd className="mt-0.5">{professor.phdRequirements.researchExperience}</dd>
                  </div>
                </dl>
                {professor.phdRequirements.additionalNotes && (
                  <p className="mt-3 rounded-lg bg-gray-50 p-2 text-xs text-gray-500 dark:bg-gray-800/70 dark:text-gray-300">
                    {professor.phdRequirements.additionalNotes}
                  </p>
                )}
              </div>

              {/* 资助与奖学金 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <Award className="h-4 w-4 text-amber-500" />
                  资助与奖学金
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {professor.fundingOptions.map((option) => (
                    <li key={`${professor.id}-${option.type}`} className="flex items-start gap-2">
                      <Badge className="mt-0.5 flex-shrink-0 rounded-full bg-amber-100 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                        {option.type}
                      </Badge>
                      <span>{option.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* 代表论文 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                代表论文
              </h4>
              {publications.length > 0 ? (
                <ul className="mt-3 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                  {publications.map((pub) => (
                    <li key={`${pub.title}-${pub.year}`} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{pub.title}</p>
                      <p className="mt-1 text-xs text-gray-400">{pub.year}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">暂无论文信息。</p>
              )}
            </div>

            {/* 荣誉奖项 */}
            {awards.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <Medal className="h-4 w-4 text-amber-500" />
                  荣誉奖项
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {awards.map((award) => (
                    <li key={award} className="flex items-start gap-2">
                      <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 博士生去向与顾问备注 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">博士生去向与顾问备注</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {placements.length > 0 ? (
                    placements.map((placement) => (
                      <div
                        key={`${placement.year}-${placement.destination}-${placement.student}`}
                        className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/70"
                      >
                        <p className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100">
                          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                          {(placement.year || '未提供') + ' · ' + placement.destination}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {placement.student}
                          {placement.highlight ? ` · ${placement.highlight}` : ''}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-400 dark:bg-gray-800/70 dark:text-gray-500">
                      暂无博士生去向数据。
                    </p>
                  )}
                </div>
                <div className="rounded-lg bg-indigo-50/80 p-4 text-sm text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-100">
                  <p className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">顾问内部观察</p>
                  <p className="mt-2 leading-relaxed">{professor.internalNotes || '暂无备注'}</p>
                </div>
              </div>
            </div>

            {/* 底部操作提示 */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-indigo-50/80 p-4 dark:bg-indigo-500/10">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-indigo-700 dark:text-indigo-200">
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                <span>提示：在申请工作台中，可以直接调用该教授资料，自动生成"教授沟通"任务。</span>
              </div>
                      <Button
                        className="bg-indigo-600 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-indigo-100 dark:disabled:bg-indigo-500/30"
                        disabled={!professor.contactEmail}
                        onClick={() => professor.contactEmail && window.open(`mailto:${professor.contactEmail}`)}
                      >
                发送联系邮件
              </Button>
            </div>
          </div>

          {/* 右侧收藏清单 */}
          {favoritesPanelOpen && (
            <aside className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 dark:border-gray-800 dark:bg-gray-900">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">教授收藏清单</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">收藏的教授会同步到申请工作台。</p>
              </div>

              <div className="space-y-3">
                {favoritesLoading ? (
                  <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : favoriteProfiles.length === 0 ? (
                  <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                    还没有收藏的教授。点击左上角的"收藏"按钮将此教授加入清单。
                  </p>
                ) : (
                  favoriteProfiles.map((profile) => (
                    <div key={profile.id} className="flex items-start gap-3 rounded-xl border border-gray-100 p-3 dark:border-gray-700">
                      <img src={getProfessorAvatar(profile)} alt={profile.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{profile.university}</p>
                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 border-indigo-200 px-2 text-xs text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-500/10"
                            onClick={() => handleOpenMatch(profile)}
                          >
                            <ClipboardPenLine className="mr-1 h-3 w-3" />
                            匹配
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveFavorite(profile.id)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            移除
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {favoriteProfiles.length > 0 && (
                <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-100">
                  <p className="font-medium">下一步建议</p>
                  <p className="mt-1 flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    打开申请工作台 → 选择目标学生 → 导入教授清单。
                  </p>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>

      {/* 匹配学生抽屉 */}
      <ProfessorMatchDrawer
        open={matchDrawerOpen}
        onOpenChange={setMatchDrawerOpen}
        professor={matchProfessor}
        studentOptions={studentOptions}
        onSubmit={handleMatchSubmit}
      />
    </div>
  );
};

export default ProfessorDetailPage;

