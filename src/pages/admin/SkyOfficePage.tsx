import { useMemo, useRef, useState } from 'react';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/use-toast';

/**
 * SkyOffice 虚拟会议室页面
 *
 * - 通过 iframe 将 SkyOffice Web 客户端嵌入管理系统
 * - 支持一键在新窗口打开，便于多屏协同
 * - 在加载和失败场景记录日志，便于故障排查
 */
const DEFAULT_SKYOFFICE_URL = 'https://sky-office.co/';

export const SkyOfficePage = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const skyOfficeUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_SKYOFFICE_URL;
    if (envUrl && typeof envUrl === 'string') {
      return envUrl;
    }

    console.warn(
      '[SkyOffice] 未检测到 VITE_SKYOFFICE_URL 环境变量，使用默认线上站点。',
    );
    return DEFAULT_SKYOFFICE_URL;
  }, []);

  const handleOpenInNewWindow = () => {
    window.open(skyOfficeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRetry = () => {
    if (!iframeRef.current) {
      return;
    }

    // 通过更新 iframe src 强制刷新
    const iframeElement = iframeRef.current;
    iframeElement.src = `${skyOfficeUrl}?timestamp=${Date.now()}`;
    setIsIframeLoaded(false);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              SkyOffice 虚拟会议室
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              支持多场景在线协作，建议在进入前允许浏览器访问麦克风与摄像头。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              刷新房间
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              新窗口打开
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300">
            如需切换至自建部署，可在环境变量中配置
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
              VITE_SKYOFFICE_URL
            </code>
            ，并在 `系统设置 → 线上会议` 中维护密钥与回调。
          </p>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-950/5 shadow-inner dark:border-slate-800">
        {!isIframeLoaded && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 text-slate-600 backdrop-blur dark:bg-slate-950/80 dark:text-slate-300">
            <span className="text-sm">正在连接 SkyOffice 会议室...</span>
            <span className="text-xs">如长时间未响应，可点击右上角“刷新房间”</span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="SkyOffice Virtual Office"
          src={skyOfficeUrl}
          className="h-full w-full border-0"
          allow="camera; microphone; clipboard-write; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            setIsIframeLoaded(true);
            console.info('[SkyOffice] 会议室页面加载完成');
            toast.success('SkyOffice 已加载，你可以开始会议或邀请同事加入。');
          }}
          onError={(event) => {
            console.error('[SkyOffice] iframe 加载失败', event);
            toast.error('SkyOffice 加载失败，请检查网络或稍后重试。');
          }}
        />
      </div>
    </div>
  );
};

export default SkyOfficePage;

