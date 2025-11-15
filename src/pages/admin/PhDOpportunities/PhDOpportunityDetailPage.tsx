import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Globe2,
  GraduationCap,
  Heart,
  MapPin,
  Timer,
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import type { PhdFundingLevel, PhdPosition, PhdPositionStatus } from '../../../types/phd';
import { fetchPhdPositionById, fetchPhdPositions } from '../../../services/phdPositions';

const fundingLevelLabel: Record<PhdFundingLevel, string> = {
  full: '全额资助',
  partial: '部分资助',
  unspecified: '资助待确认',
};

const statusLabel: Record<PhdPositionStatus, string> = {
  open: '开放中',
  closing_soon: '即将截止',
  expired: '已截止',
};

const statusStyle: Record<PhdPositionStatus, string> = {
  open: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  closing_soon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  expired: 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400',
};

const fundingStyle: Record<PhdFundingLevel, string> = {
  full: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200',
  partial: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-200',
  unspecified: 'bg-slate-100 text-slate-500 dark:bg-slate-800/40 dark:text-slate-200',
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '待更新';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '待更新';
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCountryLabel = (code?: string | null) => {
  if (!code) return '未知地区';
  const upper = code.toUpperCase();
  if (upper === 'NL') return '荷兰';
  if (upper === 'US') return '美国';
  if (upper === 'UK') return '英国';
  return upper;
};

const getStatusTrendText = (status: PhdPositionStatus, deadline?: string | null) => {
  if (!deadline) return '申请截止时间待更新';
  const now = new Date();
  const positionDeadline = new Date(deadline);
  if (Number.isNaN(positionDeadline.getTime())) return '申请截止时间待更新';

  if (status === 'expired' || positionDeadline < now) {
    return '该岗位已截止';
  }

  const diffTime = positionDeadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    return '距离截止不足 1 天';
  }

  if (diffDays <= 7) {
    return `距离截止还有 ${diffDays} 天`;
  }

  return `距离截止还有约 ${Math.ceil(diffDays / 7)} 周`;
};

const splitParagraphs = (text: string | undefined) =>
  (text ?? '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const PhDOpportunityDetailPage = () => {
  const navigate = useNavigate();
  const { positionId } = useParams();
  const [position, setPosition] = useState<PhdPosition | null>(null);
  const [recommendedPositions, setRecommendedPositions] = useState<PhdPosition[]>([]);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDetail = async () => {
      if (!positionId) {
        setErrorMessage('缺少岗位 ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setErrorMessage(null);
        const current = await fetchPhdPositionById(positionId);
        if (!current) {
          setErrorMessage('未找到对应的博士岗位，请稍后重试。');
          setPosition(null);
          setRecommendedPositions([]);
          return;
        }
        setPosition(current);
        const { positions: related } = await fetchPhdPositions({
          limit: 6,
          tags: current.tags.slice(0, 3),
        });
        setRecommendedPositions(related.filter((item) => item.id !== current.id).slice(0, 2));
      } catch (error) {
        const message = error instanceof Error ? error.message : '加载岗位详情失败';
        setErrorMessage(message);
        setPosition(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [positionId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
          onClick={() => navigate('/admin/phd-opportunities')}
        >
          <ArrowLeft className="h-4 w-4" /> 返回博士岗位列表
        </Button>
        <Card className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
          岗位详情加载中，请稍候…
        </Card>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
          onClick={() => navigate('/admin/phd-opportunities')}
        >
          <ArrowLeft className="h-4 w-4" /> 返回博士岗位列表
        </Button>
        <Card className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
          {errorMessage ?? '未找到对应的博士岗位，请返回列表后重试。'}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
            onClick={() => navigate('/admin/phd-opportunities')}
          >
            <ArrowLeft className="h-4 w-4" /> 返回博士岗位列表
          </Button>
          <div className="flex items-center gap-3 text-sm text-indigo-500">
            <GraduationCap className="h-4 w-4" /> 全球博士岗位情报
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {position.titleZh ?? position.titleEn}
          </h1>
          <p className="text-sm text-indigo-500">{position.titleEn}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusStyle[position.status]}>{statusLabel[position.status]}</Badge>
            <Badge className={fundingStyle[position.fundingLevel]}>
              {fundingLevelLabel[position.fundingLevel]}
            </Badge>
            {position.supportsInternational && (
              <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
                支持国际学生
              </Badge>
            )}
            <Badge className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-100">
              匹配度 {position.matchScore}%
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant={isShortlisted ? 'default' : 'outline'}
            onClick={() => setIsShortlisted((prev) => !prev)}
            className={`rounded-full ${
              isShortlisted
                ? 'border-indigo-500 bg-indigo-500 text-white dark:border-indigo-400 dark:bg-indigo-500/80'
                : 'border-gray-300 text-gray-500 hover:text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100'
            }`}
          >
            <Heart className={`mr-2 h-4 w-4 ${isShortlisted ? 'fill-current' : ''}`} />
            {isShortlisted ? '已收藏岗位' : '加入收藏清单'}
          </Button>
          <Button
            className="rounded-full bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            onClick={() => window.open(position.officialLink, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="mr-2 h-4 w-4" /> 前往官网申请
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-indigo-50 p-3 text-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-200">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">院校</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{position.university}</p>
              {position.department && (
                <p className="text-xs text-gray-500">{position.department}</p>
              )}
            </div>
          </div>
        </Card>
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-200">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">城市/国家</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {position.city ? `${position.city}, ${getCountryLabel(position.country)}` : getCountryLabel(position.country)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-50 p-3 text-amber-500 dark:bg-amber-900/40 dark:text-amber-200">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">截止时间</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDate(position.deadline)}
              </p>
              <p className="text-xs text-gray-500">{getStatusTrendText(position.status, position.deadline)}</p>
            </div>
          </div>
        </Card>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">岗位简介</h2>
              <div className="space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {splitParagraphs(position.description).map((paragraph, index) => (
                  <p key={`desc-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">申请要求</h2>
              <div className="space-y-2 rounded-2xl border border-gray-100 bg-white/70 p-4 text-sm leading-relaxed text-gray-600 dark:border-gray-800 dark:bg-gray-800/30 dark:text-gray-300">
                {splitParagraphs(position.requirements).map((paragraph, index) => (
                  <p key={`req-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">申请流程</h2>
              <div className="space-y-2 rounded-2xl border border-gray-100 bg-white/70 p-4 text-sm leading-relaxed text-gray-600 dark:border-gray-800 dark:bg-gray-800/30 dark:text-gray-300">
                {splitParagraphs(position.applicationSteps).map((paragraph, index) => (
                  <p key={`steps-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">岗位标签</h2>
              <div className="flex flex-wrap gap-2">
                {position.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-100"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">申请准备提示</h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              <li>• 建议提前 2 周完成材料核对与导师沟通</li>
              <li>• 强调目标实验室或研究中心的匹配度</li>
              <li>• 准备对应的语言成绩、科研成果或作品集</li>
            </ul>
          </Card>

          <Card className="rounded-3xl border border-indigo-100 bg-indigo-50/80 p-6 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/30">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-200">与教授库联动建议</h3>
            <p className="mt-2 text-xs leading-relaxed text-indigo-600/80 dark:text-indigo-200/80">
              根据岗位描述中提及的研究方向，可在全球教授库中搜索相关教授，辅助学生建立目标导师名单。
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-full border-indigo-400 text-indigo-600 hover:text-indigo-700 dark:border-indigo-500 dark:text-indigo-200"
              onClick={() => navigate('/admin/professor-directory')}
            >
              <Globe2 className="mr-2 h-4 w-4" /> 浏览关联教授
            </Button>
          </Card>
        </div>
      </section>

      {recommendedPositions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">你可能还感兴趣</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendedPositions.map((item) => (
              <Card
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500/40"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={statusStyle[item.status]}>{statusLabel[item.status]}</Badge>
                    <Badge className={fundingStyle[item.fundingLevel]}>
                      {fundingLevelLabel[item.fundingLevel]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.titleZh ?? item.titleEn}
                    </p>
                    <p className="text-xs text-indigo-500">{item.titleEn}</p>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                    {item.university}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {item.city ? `${item.city}, ${getCountryLabel(item.country)}` : getCountryLabel(item.country)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-full bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                      onClick={() => navigate(`/admin/phd-opportunities/${item.id}`)}
                    >
                      查看详情
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-indigo-500 hover:text-indigo-600"
                      onClick={() => window.open(item.officialLink, '_blank', 'noopener,noreferrer')}
                    >
                      官网申请
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PhDOpportunityDetailPage;
