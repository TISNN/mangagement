import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Loader2,
  Mail,
  NotebookText,
  PenSquare,
  Phone,
  Users,
  Check,
  ExternalLink,
  Briefcase,
  FileText,
} from 'lucide-react';
import { StudentRecord } from '../types';
import { RISK_TAG_CLASS, STATUS_TAG_CLASS } from '../utils';
import {
  SERVICE_STATUS_OPTIONS,
  getServiceStatusStyle,
  getServiceStatusLabel,
  getServiceStatusValue,
  StudentServiceStatusValue,
} from '../../../../types/service';
import { peopleService } from '../../../../services';

interface StudentDetailPanelProps {
  student: StudentRecord | null;
  onClose: () => void;
  onManageMentors: (student: StudentRecord) => void;
  onEdit: (student: StudentRecord) => void;
  onStatusUpdated?: () => void;
}

const StudentDetailPanel: React.FC<StudentDetailPanelProps> = ({
  student,
  onClose,
  onManageMentors,
  onEdit,
  onStatusUpdated,
}) => {
  const navigate = useNavigate();
  
  // 所有 hooks 必须在早期返回之前调用
  const [statusMenuForService, setStatusMenuForService] = useState<string | null>(null);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(null);
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!student) return;
    const map = Object.fromEntries(student.services.map((service) => [service.id, service.status]));
    setServiceStatuses(map);
    setStatusMenuForService(null);
    setUpdatingServiceId(null);
  }, [student]);

  useEffect(() => {
    if (!statusMenuForService) return;
    const handleClickOutside = () => setStatusMenuForService(null);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [statusMenuForService]);

  // 早期返回必须在所有 hooks 之后
  if (!student) return null;

  const handleToggleStatusMenu = (serviceId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setStatusMenuForService((prev) => (prev === serviceId ? null : serviceId));
  };

  const handleSelectStatus = async (serviceId: string, value: StudentServiceStatusValue) => {
    const numericId = Number.parseInt(serviceId, 10);
    if (Number.isNaN(numericId)) {
      console.error('服务ID无效，无法更新状态:', serviceId);
      setStatusMenuForService(null);
      return;
    }

    setUpdatingServiceId(serviceId);
    try {
      await peopleService.updateStudentServiceStatus(numericId, value);
      const nextLabel = getServiceStatusLabel(value);
      setServiceStatuses((prev) => ({
        ...prev,
        [serviceId]: nextLabel,
      }));
      setStatusMenuForService(null);
      if (onStatusUpdated) {
        await onStatusUpdated();
      }
    } catch (error) {
      console.error('更新服务状态失败:', error);
      window.alert('状态更新失败，请稍后再试');
    } finally {
      setUpdatingServiceId(null);
    }
  };

  const getServiceStatusDisplay = (serviceId: string, fallback: string) =>
    serviceStatuses[serviceId] ?? fallback;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-4xl overflow-y-auto rounded-l-3xl border-l border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700/60 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={student.avatar}
                alt={student.name}
                className="h-14 w-14 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-700"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{student.school}</p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_TAG_CLASS[student.status]}`}
                  >
                    {student.status}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${RISK_TAG_CLASS[student.risk]}`}
                  >
                    风险 {student.risk}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(student)}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400/60 dark:hover:text-blue-200"
              >
                <PenSquare className="h-3.5 w-3.5" />
                编辑资料
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate(`/admin/students/${student.id}`);
                  onClose();
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400/60 dark:hover:text-blue-200"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                查看完整档案
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate(`/admin/application-workbench?studentId=${student.id}`);
                  onClose();
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400/60 dark:hover:text-blue-200"
              >
                <Briefcase className="h-3.5 w-3.5" />
                申请工作台
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                {student.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                {student.phone}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                主要顾问：{student.advisor}
              </div>
              <div className="flex items-center gap-2">
                <NotebookText className="h-4 w-4 text-emerald-500" />
                任务待办：{student.tasksPending}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <Users className="h-4 w-4 text-blue-500" />
                  顾问团队
                </div>
                <button
                  type="button"
                  onClick={() => onManageMentors(student)}
                  disabled={student.services.length === 0}
                  className="text-sm text-blue-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:text-blue-300/50 dark:text-blue-300 dark:hover:text-blue-200 dark:disabled:text-blue-300/30"
                >
                  管理顾问团队
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {student.mentorTeam.length > 0 ? (
                  student.mentorTeam.map((mentor) => (
                    <span
                      key={mentor}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
                    >
                      {mentor}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500">暂未分配顾问团队</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60"
          >
            关闭
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">服务摘要</h3>
              <button
                onClick={() => {
                  navigate(`/admin/service-chronology?studentId=${student.id}`);
                  onClose();
                }}
                className="text-sm text-blue-500 transition hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
              >
                查看服务进度中心
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {student.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/80"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{service.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">负责人：{service.advisor}</p>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(event) => handleToggleStatusMenu(service.id, event)}
                        className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 text-[11px] font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300"
                        disabled={updatingServiceId === service.id}
                      >
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getServiceStatusStyle(
                            getServiceStatusDisplay(service.id, service.status),
                          )}`}
                        >
                          {getServiceStatusDisplay(service.id, service.status)}
                        </span>
                        {updatingServiceId === service.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </button>
                      {statusMenuForService === service.id ? (
                        <div
                          className="absolute right-0 top-8 z-30 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                          onMouseDown={(event) => event.stopPropagation()}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {SERVICE_STATUS_OPTIONS.map((option) => {
                            const active =
                              option.value === getServiceStatusValue(getServiceStatusDisplay(service.id, service.status));
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelectStatus(service.id, option.value)}
                                disabled={updatingServiceId === service.id && !active}
                                className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors ${
                                  active
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-200'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60'
                                }`}
                              >
                                <span>{option.label}</span>
                                {active && <Check className="h-4 w-4" />}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${service.progress}%` }} />
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{service.progress}%</span>
                  </div>
                  {service.mentorRoles.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {service.mentorRoles.map((role) => (
                        <div key={`${service.id}-${role.roleKey}`} className="rounded-lg bg-blue-50/40 p-3 dark:bg-blue-900/20">
                          <div className="flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-200">
                            <span>{role.roleName}</span>
                            {role.responsibilities ? (
                              <span className="text-[11px] text-blue-400 dark:text-blue-300/70">
                                {role.responsibilities}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {role.mentors.map((mentor) => (
                              <span
                                key={`${service.id}-${role.roleKey}-${mentor.id}`}
                                className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-blue-600 shadow-sm ring-1 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-100 dark:ring-blue-800"
                              >
                                {mentor.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">暂未分配顾问角色</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">沟通记录</h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                最近一次沟通时间：{student.updatedAt} · 学生反馈良好，建议保持周频次沟通，关注考试压力。
              </p>
              <button className="mt-4 inline-flex items-center gap-2 text-sm text-blue-500 dark:text-blue-300">
                查看完整沟通记录
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI 服务洞察</h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                当前处于文书冲刺阶段，建议：
                <br />
                1. 加强与学生沟通节奏，协调课程与文书时间。
                <br />
                2. 提前准备推荐信材料，避免期末高峰期。
                <br />
                3. 关注服务满意度变化，记录阶段亮点。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPanel;

