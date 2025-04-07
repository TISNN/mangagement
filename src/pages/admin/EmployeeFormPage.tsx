import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save,
  UserPlus,
  X,
  Upload
} from 'lucide-react';
import { employeeService, Employee } from '../../services/employeeService';
import { departmentOptions, statusOptions } from '../../utils/constants';

// 员工表单页面组件
const EmployeeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // 表单状态
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'active',
    location: '',
    join_date: '',
    skills: [],
    avatar_url: '',
    is_partner: false,
    projects: 0,
    tasks: {
      total: 0,
      completed: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // 如果是编辑模式，加载员工数据
  useEffect(() => {
    if (isEditMode) {
      const fetchEmployeeData = async () => {
        try {
          setLoading(true);
          const data = await employeeService.getEmployeeById(id);
          setFormData(data);
          setError(null);
        } catch (err) {
          console.error('获取员工信息失败:', err);
          setError('无法加载员工信息，请稍后重试');
        } finally {
          setLoading(false);
        }
      };
      
      fetchEmployeeData();
    }
  }, [id, isEditMode]);
  
  // 处理表单字段变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // 处理添加技能
  const handleAddSkill = () => {
    if (skillInput.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()]
    }));
    
    setSkillInput('');
  };
  
  // 处理删除技能
  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index)
    }));
  };
  
  // 生成随机头像
  const generateAvatar = () => {
    if (!formData.name) return;
    
    const seed = formData.name;
    const randomStyle = ['bottts', 'lorelei', 'micah', 'avataaars', 'big-smile'][Math.floor(Math.random() * 5)];
    const colors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffdfbf', 'ffd5dc'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    const avatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}&backgroundColor=${bgColor}`;
    
    setFormData(prev => ({
      ...prev,
      avatar_url: avatarUrl
    }));
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // 验证必填字段
    if (!formData.name || !formData.email || !formData.position) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 如果没有设置头像，生成一个
      if (!formData.avatar_url) {
        generateAvatar();
      }
      
      await employeeService.upsertEmployee(formData);
      navigate('/admin/employees');
      
    } catch (err) {
      console.error('保存员工信息失败:', err);
      setError('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/employees')}
            className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">
            {isEditMode ? '编辑员工' : '添加员工'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 rounded-lg text-white flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>保存</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold dark:text-white">基本信息</h2>
            
            {/* 头像上传 */}
            <div className="flex flex-col items-center space-y-4">
              {formData.avatar_url ? (
                <div className="relative">
                  <img 
                    src={formData.avatar_url} 
                    alt="头像预览" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserPlus className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={generateAvatar}
                  className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-1"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>生成头像</span>
                </button>
              </div>
            </div>
            
            {/* 名称和职位 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    formSubmitted && !formData.name
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="输入员工姓名"
                />
                {formSubmitted && !formData.name && (
                  <p className="mt-1 text-sm text-red-500">请输入员工姓名</p>
                )}
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  职位 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    formSubmitted && !formData.position
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="输入员工职位"
                />
                {formSubmitted && !formData.position && (
                  <p className="mt-1 text-sm text-red-500">请输入员工职位</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_partner"
                  name="is_partner"
                  checked={formData.is_partner || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_partner: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="is_partner" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  设为合伙人
                </label>
              </div>
            </div>
          </div>
          
          {/* 右侧表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold dark:text-white">联系方式</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  电子邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    formSubmitted && !formData.email
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="输入电子邮箱"
                />
                {formSubmitted && !formData.email && (
                  <p className="mt-1 text-sm text-red-500">请输入电子邮箱</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  联系电话
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="输入联系电话"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  所在地区
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="输入所在地区"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 部门和状态 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold dark:text-white">工作信息</h2>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                所属部门
              </label>
              <select
                id="department"
                name="department"
                value={formData.department || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">选择部门</option>
                {departmentOptions.filter(dep => dep.id !== 'all').map(department => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                员工状态
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || 'active'}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statusOptions.filter(status => status.id !== 'all').map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="join_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                入职日期
              </label>
              <input
                type="date"
                id="join_date"
                name="join_date"
                value={formData.join_date || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          {/* 技能 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold dark:text-white">专业技能</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="添加技能"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
              >
                添加
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills?.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {(!formData.skills || formData.skills.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">暂无技能，请添加</p>
              )}
            </div>
          </div>
        </div>
        
        {/* 提交按钮（移动端显示） */}
        <div className="md:hidden">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 rounded-lg text-white flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? '保存中...' : '保存'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormPage; 