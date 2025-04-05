// 简单的toast通知实现
export interface ToastOptions {
    title?: string;
    description: string;
    variant?: 'default' | 'destructive' | 'success';
  }
  
  // toast创建函数
  function createToast(options: ToastOptions) {
    const { title, description, variant = 'default' } = options;
    
    // 根据variant选择样式
    let bgColor = 'bg-blue-500';
    if (variant === 'destructive') {
      bgColor = 'bg-red-500';
    } else if (variant === 'success') {
      bgColor = 'bg-green-500';
    }
    
    // 创建一个临时div元素
    const toastElement = document.createElement('div');
    toastElement.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg z-50 animate-in slide-in-from-top-5`;
    
    // 添加标题如果提供了
    if (title) {
      const titleElement = document.createElement('div');
      titleElement.className = 'font-bold';
      titleElement.innerText = title;
      toastElement.appendChild(titleElement);
    }
    
    // 添加描述
    const descElement = document.createElement('div');
    descElement.innerText = description;
    toastElement.appendChild(descElement);
    
    // 添加到DOM
    document.body.appendChild(toastElement);
    
    // 设置自动消失
    setTimeout(() => {
      toastElement.className = toastElement.className.replace('animate-in', 'animate-out') + ' slide-out-to-right-5';
      setTimeout(() => {
        document.body.removeChild(toastElement);
      }, 300);
    }, 3000);
  }
  
  // 导出toast函数和方法
  export const toast = {
    // 原来的方法
    success: (message: string) => {
      createToast({
        description: message,
        variant: 'success'
      });
    },
    
    error: (message: string) => {
      createToast({
        description: message,
        variant: 'destructive'
      });
    },
    
    info: (message: string) => {
      createToast({
        description: message
      });
    },
    
    warn: (message: string) => {
      createToast({
        description: message
      });
    }
  };