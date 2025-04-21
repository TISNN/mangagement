/**
 * 简单的通知提示工具
 * 如果项目中已经使用了其他提示库，可以替换为对应的实现
 */
interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * 创建一个Toast元素
 */
const createToastElement = (message: string, type: string, options: ToastOptions = {}) => {
  const { duration = 3000, position = 'top-right' } = options;
  
  // 创建toast容器，如果不存在
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.zIndex = '9999';
    
    // 根据position设置位置
    switch (position) {
      case 'top':
        container.style.top = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        break;
      case 'top-right':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'top-left':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      case 'bottom-right':
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
      case 'bottom-left':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
    }
    
    document.body.appendChild(container);
  }
  
  // 创建toast元素
  const toast = document.createElement('div');
  toast.style.minWidth = '200px';
  toast.style.margin = '10px';
  toast.style.padding = '15px';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  toast.style.backgroundColor = '#fff';
  toast.style.color = '#333';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease-in-out';
  
  // 根据类型设置样式
  switch (type) {
    case 'success':
      toast.style.borderLeft = '4px solid #4caf50';
      break;
    case 'error':
      toast.style.borderLeft = '4px solid #f44336';
      break;
    case 'warning':
      toast.style.borderLeft = '4px solid #ff9800';
      break;
    case 'info':
      toast.style.borderLeft = '4px solid #2196f3';
      break;
  }
  
  // 设置内容
  toast.textContent = message;
  
  // 添加到容器
  container.appendChild(toast);
  
  // 显示toast
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // 设置自动隐藏
  setTimeout(() => {
    toast.style.opacity = '0';
    
    // 移除元素
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
      
      // 如果没有更多的toast，移除容器
      if (container.childElementCount === 0) {
        document.body.removeChild(container);
      }
    }, 300);
  }, duration);
  
  return toast;
};

/**
 * Toast工具对象
 */
const toast = {
  success: (message: string, options?: ToastOptions) => {
    return createToastElement(message, 'success', options);
  },
  error: (message: string, options?: ToastOptions) => {
    return createToastElement(message, 'error', options);
  },
  warning: (message: string, options?: ToastOptions) => {
    return createToastElement(message, 'warning', options);
  },
  info: (message: string, options?: ToastOptions) => {
    return createToastElement(message, 'info', options);
  }
};

export default toast; 