import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染时显示错误UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary捕获到错误:', error, errorInfo);
    this.setState({ errorInfo });
    
    // 可以在这里发送错误到日志服务
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // 刷新页面可能是重置应用状态的最简单方法
    window.location.reload();
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // 默认错误UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4 text-yellow-500">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">应用发生错误</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                抱歉，应用运行时发生错误。您可以尝试刷新页面或回到首页。
              </p>
              {this.state.error && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto text-sm">
                  <p className="text-red-600 dark:text-red-400 font-mono">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <RefreshCw className="h-4 w-4" />
                刷新应用
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 