import React from 'react';
import { 
  Settings, Lock, Bell, Shield, FileText, Database,
  ChevronRight, Mail, Phone, Smartphone
} from 'lucide-react';

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">系统设置</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 左侧设置菜单 */}
        <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
          <nav className="space-y-2">
            {[
              { name: '基本设置', icon: Settings, active: true },
              { name: '账号安全', icon: Lock },
              { name: '消息通知', icon: Bell },
              { name: '权限管理', icon: Shield },
              { name: '系统日志', icon: FileText },
              { name: '数据备份', icon: Database },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`h-4 w-4 ${item.active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              </button>
            ))}
          </nav>
        </div>

        {/* 右侧设置内容 */}
        <div className="md:col-span-3 space-y-6">
          {/* 基本设置 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">基本设置</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                恢复默认
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-sm text-gray-600 dark:text-gray-400">系统名称</label>
                <input
                  type="text"
                  defaultValue="Infinite.ai"
                  className="col-span-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-sm text-gray-600 dark:text-gray-400">系统语言</label>
                <select className="col-span-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <option>简体中文</option>
                  <option>English</option>
                </select>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-sm text-gray-600 dark:text-gray-400">时区设置</label>
                <select className="col-span-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <option>(GMT+08:00) 北京时间</option>
                  <option>(GMT+00:00) 格林威治标准时间</option>
                </select>
              </div>
              <div className="grid grid-cols-4 gap-4 items-start">
                <label className="text-sm text-gray-600 dark:text-gray-400">主题外观</label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" defaultChecked />
                      <span className="text-sm dark:text-gray-300">浅色</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" />
                      <span className="text-sm dark:text-gray-300">深色</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" />
                      <span className="text-sm dark:text-gray-300">跟随系统</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 账号安全 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-6 dark:text-white">账号安全</h2>
            <div className="space-y-4">
              {[
                {
                  icon: Lock,
                  title: '登录密码',
                  description: '建议定期更换密码，密码需包含字母和数字',
                  action: '修改'
                },
                {
                  icon: Phone,
                  title: '手机绑定',
                  description: '已绑定：138****8888',
                  action: '更换'
                },
                {
                  icon: Mail,
                  title: '邮箱绑定',
                  description: '已绑定：admin@navra.ai',
                  action: '更换'
                },
                {
                  icon: Smartphone,
                  title: '微信绑定',
                  description: '未绑定',
                  action: '绑定',
                  status: 'warning'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${
                      item.status === 'warning' 
                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <button className={`text-sm font-medium ${
                    item.status === 'warning'
                      ? 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400'
                      : 'text-blue-600 hover:text-blue-700 dark:text-blue-400'
                  }`}>
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 