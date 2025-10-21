import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  Download,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Share2,
  Link,
  Send,
  FileSignature,
  X,
  Upload,
  FileUp,
  DollarSign,
  Users,
  CalendarDays
} from 'lucide-react';

function ContractsPage() {
  const [showSignModal, setShowSignModal] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">合同管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索合同..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            <Filter className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setShowNewContractModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            新建合同
          </button>
          <button 
            onClick={() => setShowSignModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <FileSignature className="h-4 w-4" />
            发起签署
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '全部合同', value: '286', icon: FileText, color: 'blue' },
          { title: '待签署', value: '24', icon: Clock, color: 'yellow' },
          { title: '已生效', value: '186', icon: CheckCircle, color: 'green' },
          { title: '已到期', value: '76', icon: AlertCircle, color: 'red' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 合同列表 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部合同', '待签署', '已生效', '已到期', '已作废'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">合同编号</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">合同名称</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">签约方</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">合同金额</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">签署日期</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 'CT-2024001',
                name: '留学申请服务协议',
                party: 'Evan',
                amount: '¥15,800',
                status: '已生效',
                date: '2024-03-15'
              },
              {
                id: 'CT-2024002',
                name: '语言培训服务合同',
                party: '李华',
                amount: '¥12,000',
                status: '待签署',
                date: '-'
              },
              {
                id: 'CT-2024003',
                name: '留学咨询服务合同',
                party: '王芳',
                amount: '¥18,600',
                status: '已生效',
                date: '2024-03-10'
              },
              {
                id: 'CT-2024004',
                name: '课程辅导协议',
                party: '赵伟',
                amount: '¥8,800',
                status: '已到期',
                date: '2024-02-15'
              },
            ].map((contract, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{contract.id}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium dark:text-white">{contract.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{contract.party}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{contract.amount}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contract.status === '已生效'
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : contract.status === '待签署'
                      ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {contract.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{contract.date}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowSignModal(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FileSignature className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 分页 */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 10 条，共 286 条
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, 3, '...', 29].map((page, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-xl text-sm ${
                    page === 1
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 新建合同模态框 */}
      {showNewContractModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold dark:text-white">新建合同</h3>
              <button 
                onClick={() => setShowNewContractModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    合同名称
                  </label>
                  <input
                    type="text"
                    placeholder="请输入合同名称"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    合同编号
                  </label>
                  <input
                    type="text"
                    placeholder="系统自动生成"
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* 签约方信息 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  签约方信息
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="签约方名称"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="联系人"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="联系电话"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                    <input
                      type="email"
                      placeholder="电子邮箱"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* 合同金额和日期 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    合同金额
                  </label>
                  <div className="relative">
                    <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      placeholder="请输入金额"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    生效日期
                  </label>
                  <div className="relative">
                    <CalendarDays className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* 合同文件上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  合同文件
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 dark:border-gray-700">
                  <div className="flex flex-col items-center justify-center text-center">
                    <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      拖拽文件到此处或
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        点击上传
                      </button>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      支持格式：PDF、Word、Excel (最大20MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowNewContractModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 发起签署模态框 */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold dark:text-white">发起合同签署</h3>
              <button 
                onClick={() => setShowSignModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 签署方信息 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  签署方信息
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="姓名"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="手机号"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="邮箱"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* 签署截止时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  签署截止时间
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>

              {/* 签署方式选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  签署方式
                </label>
                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Link className="h-5 w-5" />
                    生成链接
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    <Send className="h-5 w-5" />
                    邮件发送
                  </button>
                </div>
              </div>

              {/* 签署链接 */}
              <div className="p-4 bg-gray-50 rounded-xl dark:bg-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    https://example.com/sign/contract/123456
                  </span>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    <Share2 className="h-4 w-4" />
                    复制
                  </button>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                  确认发起
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractsPage; 