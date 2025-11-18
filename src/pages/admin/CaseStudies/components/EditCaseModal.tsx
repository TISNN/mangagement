import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CaseStudy } from '../../../../types/case';
import { supabase } from '../../../../lib/supabase';

interface EditCaseModalProps {
  isOpen: boolean;
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<CaseStudy>) => Promise<void>;
}

const EditCaseModal: React.FC<EditCaseModalProps> = ({ isOpen, caseStudy, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    student_name: '',
    school: '',
    applied_program: '',
    program_id: '',
    admission_year: new Date().getFullYear(),
    bachelor_university: '',
    bachelor_major: '',
    master_school: '',
    master_major: '',
    master_gpa: '',
    gpa: '',
    language_scores: '',
    experiecnce: '', // 注意数据库拼写
    region: '',
    admission_result: 'accepted' as const,
    offer_type: '',
    scholarship: '',
    notes: '',
    mentor_id: undefined as number | undefined,
    student_id: undefined as number | undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<{ id: string; school: string; program: string }[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [mentors, setMentors] = useState<{ id: number; name: string; specializations?: string[] }[]>([]);
  const [students, setStudents] = useState<{ id: number; name: string; education_level?: string }[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (caseStudy && isOpen) {
      setFormData({
        student_name: caseStudy.student_name || '',
        school: caseStudy.school || '',
        applied_program: caseStudy.applied_program || '',
        program_id: caseStudy.program_id || '',
        admission_year: caseStudy.admission_year || new Date().getFullYear(),
        bachelor_university: caseStudy.bachelor_university || '',
        bachelor_major: caseStudy.bachelor_major || '',
        master_school: caseStudy.master_school || '',
        master_major: caseStudy.master_major || '',
        master_gpa: caseStudy.master_gpa || '',
        gpa: caseStudy.gpa || '',
        language_scores: caseStudy.language_scores || '',
        experiecnce: caseStudy.experiecnce || '',
        region: caseStudy.region || '',
        admission_result: caseStudy.admission_result || 'accepted',
        offer_type: caseStudy.offer_type || '',
        scholarship: caseStudy.scholarship || '',
        notes: caseStudy.notes || '',
        mentor_id: caseStudy.mentor_id,
        student_id: caseStudy.student_id,
      });
    }
  }, [caseStudy, isOpen]);

  // 加载可选的专业项目列表
  useEffect(() => {
    const loadPrograms = async () => {
      setLoadingPrograms(true);
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('id, cn_name, en_name')
          .limit(100);

        if (error) {
          console.error('加载专业列表失败:', error);
          return;
        }

        if (data) {
          const programsWithSchools = await Promise.all(
            data.map(async (program) => {
              const { data: schoolData } = await supabase
                .from('schools')
                .select('cn_name')
                .eq('id', program.school_id)
                .single();
              
              return {
                id: program.id,
                school: schoolData?.cn_name || '未知学校',
                program: program.cn_name || program.en_name || '未知专业'
              };
            })
          );
          setPrograms(programsWithSchools);
        }
      } catch (error) {
        console.error('加载专业列表异常:', error);
      } finally {
        setLoadingPrograms(false);
      }
    };

    if (isOpen) {
      loadPrograms();
    }
  }, [isOpen]);

  // 加载导师列表
  useEffect(() => {
    const loadMentors = async () => {
      setLoadingMentors(true);
      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('id, name, specializations')
          .eq('is_active', true)
          .order('name')
          .limit(100);

        if (error) {
          console.error('加载导师列表失败:', error);
          return;
        }

        if (data) {
          setMentors(data);
        }
      } catch (error) {
        console.error('加载导师列表异常:', error);
      } finally {
        setLoadingMentors(false);
      }
    };

    if (isOpen) {
      loadMentors();
    }
  }, [isOpen]);

  // 加载学生列表
  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('id, name, education_level')
          .order('name')
          .limit(100);

        if (error) {
          console.error('加载学生列表失败:', error);
          return;
        }

        if (data) {
          setStudents(data);
        }
      } catch (error) {
        console.error('加载学生列表异常:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseStudy) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(caseStudy.id, formData);
      onClose();
    } catch (error) {
      console.error('更新案例失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* 模态框 */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* 头部 */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              编辑案例
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* 表单内容 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 录取信息 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">录取信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学生姓名
                  </label>
                  <input
                    type="text"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    placeholder="可选，保护隐私"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    录取年份
                  </label>
                  <input
                    type="number"
                    value={formData.admission_year}
                    onChange={(e) => setFormData({ ...formData, admission_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学校名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    地区
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">选择地区</option>
                    <option value="香港">香港</option>
                    <option value="澳门">澳门</option>
                    <option value="英国">英国</option>
                    <option value="美国">美国</option>
                    <option value="加拿大">加拿大</option>
                    <option value="澳大利亚">澳大利亚</option>
                    <option value="新加坡">新加坡</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    关联专业项目
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">（可选，从数据库选择）</span>
                  </label>
                  <select
                    value={formData.program_id}
                    onChange={(e) => {
                      const selectedProgram = programs.find(p => p.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        program_id: e.target.value,
                        school: selectedProgram?.school || formData.school,
                        applied_program: selectedProgram?.program || formData.applied_program
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={loadingPrograms}
                  >
                    <option value="">不关联专业项目（手动填写）</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.school} - {program.program}
                      </option>
                    ))}
                  </select>
                  {loadingPrograms && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">加载专业列表中...</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    负责导师
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">（可选）</span>
                  </label>
                  <select
                    value={formData.mentor_id || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      mentor_id: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={loadingMentors}
                  >
                    <option value="">不关联导师</option>
                    {mentors.map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </option>
                    ))}
                  </select>
                  {loadingMentors && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">加载导师列表中...</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    关联学生
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">（可选）</span>
                  </label>
                  <select
                    value={formData.student_id || ''}
                    onChange={(e) => {
                      const selectedStudentId = e.target.value ? parseInt(e.target.value) : undefined;
                      const selectedStudent = students.find(s => s.id === selectedStudentId);
                      setFormData({ 
                        ...formData, 
                        student_id: selectedStudentId,
                        student_name: selectedStudent?.name || formData.student_name
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={loadingStudents}
                  >
                    <option value="">不关联学生</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  {loadingStudents && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">加载学生列表中...</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    专业名称 {!formData.program_id && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={!formData.program_id}
                    value={formData.applied_program}
                    onChange={(e) => setFormData({ ...formData, applied_program: e.target.value })}
                    placeholder={formData.program_id ? '已从关联项目自动填充' : '手动输入专业名称'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={!!formData.program_id}
                  />
                </div>
              </div>
            </div>

            {/* 本科背景 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">本科背景</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    本科院校 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bachelor_university}
                    onChange={(e) => setFormData({ ...formData, bachelor_university: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    本科专业 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bachelor_major}
                    onChange={(e) => setFormData({ ...formData, bachelor_major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 硕士背景（可选） */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                硕士背景
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">（可选）</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    硕士院校
                  </label>
                  <input
                    type="text"
                    value={formData.master_school}
                    onChange={(e) => setFormData({ ...formData, master_school: e.target.value })}
                    placeholder="如果申请博士则填写"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    硕士专业
                  </label>
                  <input
                    type="text"
                    value={formData.master_major}
                    onChange={(e) => setFormData({ ...formData, master_major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    硕士GPA
                  </label>
                  <input
                    type="text"
                    value={formData.master_gpa}
                    onChange={(e) => setFormData({ ...formData, master_gpa: e.target.value })}
                    placeholder="例: 3.8 或 85"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 综合成绩 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">成绩信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    综合GPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="例: 3.8 或 85"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    语言成绩 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.language_scores}
                    onChange={(e) => setFormData({ ...formData, language_scores: e.target.value })}
                    placeholder="例: 雅思7.0 或 托福100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 额外信息 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">额外信息（可选）</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    相关经历
                  </label>
                  <textarea
                    value={formData.experiecnce}
                    onChange={(e) => setFormData({ ...formData, experiecnce: e.target.value })}
                    rows={3}
                    placeholder="工作经验、实习经历、科研经历等"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      奖学金
                    </label>
                    <input
                      type="text"
                      value={formData.scholarship}
                      onChange={(e) => setFormData({ ...formData, scholarship: e.target.value })}
                      placeholder="例: 全额奖学金"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      录取类型
                    </label>
                    <select
                      value={formData.offer_type}
                      onChange={(e) => setFormData({ ...formData, offer_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">选择类型</option>
                      <option value="unconditional">无条件录取</option>
                      <option value="conditional">有条件录取</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    备注
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCaseModal;

