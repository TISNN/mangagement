import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Loader2,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react';
import { MentorRole, MentorTeamMember, StudentRecord } from '../types';

interface MentorOption {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string;
  specializations?: string[];
  expertise_level?: string;
}

interface MentorAssignmentModalProps {
  isOpen: boolean;
  student: StudentRecord | null;
  mentors: MentorOption[];
  loadingMentors: boolean;
  onClose: () => void;
  onSave: (updates: Array<{ serviceId: string; mentorRoles: MentorRole[] }>) => Promise<void>;
}

const DEFAULT_ROLE_PRESETS: Array<{ roleKey: string; roleName: string; responsibilities: string }>
  = [
    {
      roleKey: 'primary',
      roleName: '主导师',
      responsibilities: '统筹整体申请策略与关键节点决策',
    },
    {
      roleKey: 'associate',
      roleName: '副导师',
      responsibilities: '跟进执行进度，协调沟通安排',
    },
    {
      roleKey: 'essay',
      roleName: '文书导师',
      responsibilities: '负责文书策划、撰写与润色',
    },
    {
      roleKey: 'application',
      roleName: '网申导师',
      responsibilities: '负责网申系统填写、材料上传与检查',
    },
  ];

const generateRoleKey = (roleName: string) => {
  const base = roleName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'custom-role';
  return `${base}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
};

const cloneMentor = (mentor: MentorTeamMember): MentorTeamMember => ({ ...mentor });

const cloneRole = (role: MentorRole): MentorRole => ({
  roleKey: role.roleKey || generateRoleKey(role.roleName || '未命名角色'),
  roleName: role.roleName,
  responsibilities: role.responsibilities,
  mentors: role.mentors.map(cloneMentor),
});

const normalizeAssignments = (
  assignments: Record<string, MentorRole[]>,
): Record<string, Array<{
  roleKey: string;
  roleName: string;
  responsibilities: string;
  mentors: Array<{ id: number; name: string; isPrimary: boolean }>;
}>> => {
  const entries = Object.entries(assignments).map(([serviceId, roles]) => {
    const normalizedRoles = roles
      .map((role) => ({
        roleKey: role.roleKey,
        roleName: role.roleName.trim(),
        responsibilities: (role.responsibilities ?? '').trim(),
        mentors: role.mentors
          .map((mentor) => ({
            id: mentor.id,
            name: mentor.name,
            isPrimary: Boolean(mentor.isPrimary),
          }))
          .sort((a, b) => a.id - b.id),
      }))
      .sort((a, b) => a.roleKey.localeCompare(b.roleKey));

    return [serviceId, normalizedRoles] as const;
  });

  entries.sort((a, b) => a[0].localeCompare(b[0]));
  return Object.fromEntries(entries);
};

const hydrateRolesFromMembers = (members: MentorTeamMember[]): MentorRole[] => {
  const roleMap = new Map<string, MentorRole>();

  members.forEach((member) => {
    const roleKey = member.roleKey || generateRoleKey(member.roleName || '协同导师');
    const roleName = member.roleName || '协同导师';
    const responsibilities = member.responsibilities;

    if (!roleMap.has(roleKey)) {
      roleMap.set(roleKey, {
        roleKey,
        roleName,
        responsibilities,
        mentors: [],
      });
    }

    const role = roleMap.get(roleKey)!;
    role.mentors.push({
      ...member,
      roleKey,
      roleName,
      responsibilities,
    });
  });

  return Array.from(roleMap.values()).map(cloneRole);
};

const buildAssignmentsFromStudent = (student: StudentRecord): Record<string, MentorRole[]> => {
  const assignments: Record<string, MentorRole[]> = {};

  student.services.forEach((service) => {
    let roles: MentorRole[] = [];

    if (service.mentorRoles && service.mentorRoles.length > 0) {
      roles = service.mentorRoles.map((role) => {
        const cloned = cloneRole(role);
        if (!cloned.roleKey) {
          cloned.roleKey = generateRoleKey(cloned.roleName || '未命名角色');
        }
        cloned.mentors = cloned.mentors.map((mentor) => ({
          ...mentor,
          roleKey: cloned.roleKey,
          roleName: cloned.roleName,
          responsibilities: cloned.responsibilities,
        }));
        return cloned;
      });
    } else if (service.mentorMembers && service.mentorMembers.length > 0) {
      roles = hydrateRolesFromMembers(service.mentorMembers);
    } else {
      roles = DEFAULT_ROLE_PRESETS.map((preset) => ({
        roleKey: preset.roleKey,
        roleName: preset.roleName,
        responsibilities: preset.responsibilities,
        mentors: [],
      }));
    }

    assignments[service.id] = roles;
  });

  return assignments;
};

const MentorAssignmentModal: React.FC<MentorAssignmentModalProps> = ({
  isOpen,
  student,
  mentors,
  loadingMentors,
  onClose,
  onSave,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [roleAssignments, setRoleAssignments] = useState<Record<string, MentorRole[]>>({});
  const [mentorSearch, setMentorSearch] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleResponsibilities, setNewRoleResponsibilities] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggingMentorId, setDraggingMentorId] = useState<number | null>(null);
  const [activeDropTarget, setActiveDropTarget] = useState<{
    serviceId: string;
    roleKey: string;
  } | null>(null);

  const initialSerializedRef = useRef<string>('');

  useEffect(() => {
    if (isOpen && student) {
      const assignments = buildAssignmentsFromStudent(student);
      setRoleAssignments(assignments);

      const firstServiceId = student.services[0]?.id ?? '';
      setSelectedServiceId(firstServiceId);

      const normalized = normalizeAssignments(assignments);
      initialSerializedRef.current = JSON.stringify(normalized);

      setMentorSearch('');
      setNewRoleName('');
      setNewRoleResponsibilities('');
      setError(null);
    }

    if (!isOpen) {
      setRoleAssignments({});
      setSelectedServiceId('');
      setMentorSearch('');
      setNewRoleName('');
      setNewRoleResponsibilities('');
      setSaving(false);
      setError(null);
    }
  }, [isOpen, student]);

  useEffect(() => {
    if (!selectedServiceId && student?.services.length) {
      setSelectedServiceId(student.services[0].id);
    }
  }, [selectedServiceId, student]);

  const hasChanges = useMemo(() => {
    if (!student || Object.keys(roleAssignments).length === 0) return false;
    const serialized = JSON.stringify(normalizeAssignments(roleAssignments));
    return serialized !== initialSerializedRef.current;
  }, [roleAssignments, student]);

  const currentRoles = useMemo(() => {
    if (!selectedServiceId) return [] as MentorRole[];
    return roleAssignments[selectedServiceId] ?? [];
  }, [roleAssignments, selectedServiceId]);

  const filteredMentors = useMemo(() => {
    if (!mentorSearch.trim()) return mentors;
    const keyword = mentorSearch.trim().toLowerCase();
    return mentors.filter((mentor) => {
      const candidates = [
        mentor.name,
        mentor.email,
        mentor.specializations?.join(' '),
        mentor.expertise_level,
      ]
        .filter(Boolean)
        .map((item) => item!.toLowerCase());
      return candidates.some((value) => value.includes(keyword));
    });
  }, [mentors, mentorSearch]);

  const updateRoleAssignments = (
    serviceId: string,
    updater: (roles: MentorRole[]) => MentorRole[],
  ) => {
    setRoleAssignments((prev) => ({
      ...prev,
      [serviceId]: updater(prev[serviceId] ?? []),
    }));
  };

  const handleAddMentorToRole = (serviceId: string, roleKey: string, mentor: MentorOption) => {
    if (!serviceId) {
      setError('请先选择服务，再分配导师');
      return;
    }
    if (!roleKey) {
      setError('请先选择要加入的角色');
      return;
    }

    updateRoleAssignments(serviceId, (roles) =>
      roles.map((role) => {
        const clonedRole = cloneRole(role);
        if (clonedRole.roleKey !== roleKey) return clonedRole;

        const alreadyExists = clonedRole.mentors.some((member) => member.id === mentor.id);
        if (alreadyExists) return clonedRole;

        const newMember: MentorTeamMember = {
          id: mentor.id,
          name: mentor.name,
          roleKey: clonedRole.roleKey,
          roleName: clonedRole.roleName,
          responsibilities: clonedRole.responsibilities,
          isPrimary: clonedRole.roleKey === 'primary',
        };

        clonedRole.mentors = [...clonedRole.mentors.map(cloneMentor), newMember];
        return clonedRole;
      }),
    );

    setError(null);
  };

  const handleRemoveMentorFromRole = (serviceId: string, roleKey: string, mentorId: number) => {
    updateRoleAssignments(serviceId, (roles) =>
      roles.map((role) => {
        const clonedRole = cloneRole(role);
        if (clonedRole.roleKey !== roleKey) return clonedRole;
        clonedRole.mentors = clonedRole.mentors
          .map(cloneMentor)
          .filter((member) => member.id !== mentorId);
        return clonedRole;
      }),
    );
  };

  const handleTogglePrimary = (serviceId: string, roleKey: string, mentorId: number) => {
    updateRoleAssignments(serviceId, (roles) =>
      roles.map((role) => {
        const clonedRole = cloneRole(role);
        if (clonedRole.roleKey !== roleKey) return clonedRole;
        clonedRole.mentors = clonedRole.mentors.map((member) =>
          member.id === mentorId
            ? {
                ...member,
                isPrimary: !member.isPrimary,
              }
            : member,
        );
        return clonedRole;
      }),
    );
  };

  const handleRoleNameChange = (serviceId: string, roleKey: string, value: string) => {
    updateRoleAssignments(serviceId, (roles) =>
      roles.map((role) => {
        const clonedRole = cloneRole(role);
        if (clonedRole.roleKey !== roleKey) return clonedRole;
        clonedRole.roleName = value;
        clonedRole.mentors = clonedRole.mentors.map((member) => ({
          ...member,
          roleName: value,
        }));
        return clonedRole;
      }),
    );
  };

  const handleRoleResponsibilitiesChange = (serviceId: string, roleKey: string, value: string) => {
    updateRoleAssignments(serviceId, (roles) =>
      roles.map((role) => {
        const clonedRole = cloneRole(role);
        if (clonedRole.roleKey !== roleKey) return clonedRole;
        clonedRole.responsibilities = value;
        clonedRole.mentors = clonedRole.mentors.map((member) => ({
          ...member,
          responsibilities: value,
        }));
        return clonedRole;
      }),
    );
  };

  const handleRemoveRole = (serviceId: string, roleKey: string) => {
    if (!serviceId) return;
    updateRoleAssignments(serviceId, (roles) =>
      roles
        .filter((role) => role.roleKey !== roleKey)
        .map(cloneRole),
    );
  };

  const handleAddRole = (serviceId: string) => {
    if (!serviceId) {
      setError('请先选择服务，再新增角色');
      return;
    }

    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      setError('角色名称不能为空');
      return;
    }

    const roleKey = generateRoleKey(trimmedName);
    const responsibilities = newRoleResponsibilities.trim();

    updateRoleAssignments(serviceId, (roles) => [
      ...roles.map(cloneRole),
      {
        roleKey,
        roleName: trimmedName,
        responsibilities,
        mentors: [],
      },
    ]);

    setNewRoleName('');
    setNewRoleResponsibilities('');
    setError(null);
  };

  const handleSave = async () => {
    if (!student) return;

    const initialNormalizedMap = JSON.parse(initialSerializedRef.current || '{}');

    const updates = Object.entries(roleAssignments).reduce<Array<{
      serviceId: string;
      mentorRoles: MentorRole[];
    }>>((accumulator, [serviceId, roles]) => {
      const initialNormalized = initialNormalizedMap[serviceId] ?? [];
      const currentNormalized = normalizeAssignments({ [serviceId]: roles })[serviceId] ?? [];

      if (JSON.stringify(initialNormalized) === JSON.stringify(currentNormalized)) {
        return accumulator;
      }

      const sanitizedRoles = roles.map((role) => ({
        roleKey: role.roleKey,
        roleName: role.roleName.trim() || '未命名角色',
        responsibilities: (role.responsibilities ?? '').trim(),
        mentors: role.mentors.map((mentor) => ({
          ...mentor,
          roleKey: role.roleKey,
          roleName: role.roleName.trim() || '未命名角色',
          responsibilities: (role.responsibilities ?? '').trim(),
          isPrimary: Boolean(mentor.isPrimary),
        })),
      }));

      accumulator.push({ serviceId, mentorRoles: sanitizedRoles });
      return accumulator;
    }, []);

    if (updates.length === 0) {
      onClose();
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave(updates);
      const normalized = normalizeAssignments(roleAssignments);
      initialSerializedRef.current = JSON.stringify(normalized);
      onClose();
    } catch (err) {
      console.error('保存顾问团队失败', err);
      setError('保存失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
      <div className="h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700/60 dark:bg-gray-900">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800/60">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">组建顾问团队</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              根据学生的背景与申请需求，为每项服务配置主导师、协同导师与专项导师。角色和职责均可自定义。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)] flex-col overflow-hidden">
          {student.services.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-6 text-sm text-gray-500 dark:text-gray-400">
              当前学生暂无服务，请先为学生添加服务后再配置顾问团队。
            </div>
          ) : (
            <div className="grid h-full flex-1 gap-6 overflow-hidden px-6 py-6 lg:grid-cols-[320px,1fr]">
              <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800/60 dark:bg-gray-900/60">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <Users className="h-4 w-4" />
                  导师资源库
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200"
                    placeholder="搜索导师姓名、邮箱或擅长方向"
                    value={mentorSearch}
                    onChange={(event) => setMentorSearch(event.target.value)}
                  />
                </div>

                <div className="mt-4 flex-1 overflow-y-auto pr-1">
                  {loadingMentors ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      导师列表加载中...
                    </div>
                  ) : filteredMentors.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                      暂无匹配的导师，可调整搜索条件。
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 px-4 py-3 text-xs text-blue-600 dark:border-blue-500/40 dark:bg-blue-900/20 dark:text-blue-200">
                        将导师从列表中拖拽到右侧对应的角色卡片，即可完成分配。
                      </div>
                      {filteredMentors.map((mentor) => {
                        const specializationText = mentor.specializations?.join(' · ');
                        const assignedRoles = selectedServiceId
                          ? (roleAssignments[selectedServiceId] ?? []).filter((role) =>
                              role.mentors.some((member) => member.id === mentor.id),
                            )
                          : [];
                        const isDragging = draggingMentorId === mentor.id;

                        return (
                          <div
                            key={mentor.id}
                            draggable
                            onDragStart={(event) => {
                              setDraggingMentorId(mentor.id);
                              event.dataTransfer.effectAllowed = 'copyMove';
                              event.dataTransfer.setData('application/x-mentor-id', mentor.id.toString());
                              event.dataTransfer.setData('text/plain', mentor.id.toString());
                            }}
                            onDragEnd={() => {
                              setDraggingMentorId((current) => (current === mentor.id ? null : current));
                              setActiveDropTarget((prev) =>
                                prev && prev.serviceId === selectedServiceId ? null : prev,
                              );
                            }}
                            className={`rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:hover:border-blue-500/40 ${
                              isDragging
                                ? 'border-blue-400 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-900/20'
                                : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{mentor.name}</p>
                                {mentor.email ? (
                                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{mentor.email}</p>
                                ) : null}
                                {specializationText ? (
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    擅长：{specializationText}
                                  </p>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                onClick={() => window.open(`/admin/mentor-management/${mentor.id}`, '_blank')}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200"
                              >
                                详情
                                <ArrowUpRight className="h-3 w-3" />
                              </button>
                            </div>

                            {assignedRoles.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                                {assignedRoles.map((role) => (
                                  <span
                                    key={`${mentor.id}-${role.roleKey}`}
                                    className="inline-flex items-center rounded-full bg-blue-100/70 px-2 py-0.5 text-blue-500 dark:bg-blue-900/40 dark:text-blue-200"
                                  >
                                    已在 {role.roleName}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">尚未加入任何角色</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </aside>

              <section className="flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {student.services.map((service) => {
                      const active = service.id === selectedServiceId;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setSelectedServiceId(service.id)}
                          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                            active
                              ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-200'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400/50'
                          }`}
                        >
                          <span>{service.name}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{service.status}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto pr-1">
                  {currentRoles.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                      暂无角色，请先创建角色后再添加导师。
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentRoles.map((role) => {
                        const isActiveDrop =
                          activeDropTarget?.serviceId === selectedServiceId &&
                          activeDropTarget?.roleKey === role.roleKey;

                        return (
                          <div
                            key={role.roleKey}
                            onDragOver={(event) => {
                              if (!selectedServiceId) return;
                              event.preventDefault();
                              event.dataTransfer.dropEffect = 'copy';
                              if (draggingMentorId !== null) {
                                setActiveDropTarget((prev) =>
                                  prev &&
                                  prev.serviceId === selectedServiceId &&
                                  prev.roleKey === role.roleKey
                                    ? prev
                                    : { serviceId: selectedServiceId, roleKey: role.roleKey },
                                );
                              }
                            }}
                            onDragEnter={(event) => {
                              if (!selectedServiceId) return;
                              event.preventDefault();
                              if (draggingMentorId !== null) {
                                setActiveDropTarget({ serviceId: selectedServiceId, roleKey: role.roleKey });
                              }
                            }}
                            onDragLeave={() => {
                              setActiveDropTarget((prev) =>
                                prev &&
                                prev.serviceId === selectedServiceId &&
                                prev.roleKey === role.roleKey
                                  ? null
                                  : prev,
                              );
                            }}
                            onDrop={(event) => {
                              if (!selectedServiceId) return;
                              event.preventDefault();
                              const rawId =
                                event.dataTransfer.getData('application/x-mentor-id') ||
                                event.dataTransfer.getData('text/plain');
                              const parsedId = Number.parseInt(rawId, 10);
                              if (Number.isNaN(parsedId)) {
                                setActiveDropTarget(null);
                                return;
                              }
                              const mentorOption = mentors.find((item) => item.id === parsedId);
                              if (!mentorOption) {
                                setActiveDropTarget(null);
                                return;
                              }
                              handleAddMentorToRole(selectedServiceId, role.roleKey, mentorOption);
                              setActiveDropTarget(null);
                              setDraggingMentorId((current) => (current === parsedId ? null : current));
                            }}
                            className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition dark:border-gray-800 dark:bg-gray-900/80 ${
                              isActiveDrop
                                ? 'border-blue-400 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-900/10'
                                : ''
                            }`}
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1">
                                <label className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                  角色名称
                                </label>
                                <input
                                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400"
                                  value={role.roleName}
                                  onChange={(event) =>
                                    handleRoleNameChange(selectedServiceId, role.roleKey, event.target.value)
                                  }
                                />
                                <label className="mt-3 block text-xs font-medium text-gray-400 dark:text-gray-500">
                                  职责描述
                                </label>
                                <textarea
                                  rows={3}
                                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400"
                                  placeholder="可说明该角色负责的具体任务，例如背景梳理、选校方案、文书统筹等"
                                  value={role.responsibilities ?? ''}
                                  onChange={(event) =>
                                    handleRoleResponsibilitiesChange(
                                      selectedServiceId,
                                      role.roleKey,
                                      event.target.value,
                                    )
                                  }
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveRole(selectedServiceId, role.roleKey)}
                                className="self-start rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 transition hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:text-gray-500 dark:hover:border-red-400/60 dark:hover:text-red-300"
                              >
                                移除角色
                              </button>
                            </div>

                            <div className="mt-4 rounded-xl bg-gray-50/80 p-4 dark:bg-gray-800/60">
                              <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                <span>角色成员（{role.mentors.length}）</span>
                                <span>可多选主导师</span>
                              </div>

                              {role.mentors.length === 0 ? (
                                <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                                  将左侧导师拖到此区域即可添加成员。
                                </p>
                              ) : (
                                <div className="mt-3 space-y-2">
                                  {role.mentors.map((mentor) => (
                                    <div
                                      key={`${role.roleKey}-${mentor.id}`}
                                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
                                    >
                                      <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-100">
                                          {mentor.name}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                          角色：{role.roleName}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <label className="inline-flex items-center gap-1 text-xs text-blue-500 dark:text-blue-300">
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-blue-300 text-blue-500 focus:ring-blue-500"
                                            checked={Boolean(mentor.isPrimary)}
                                            onChange={() => handleTogglePrimary(selectedServiceId, role.roleKey, mentor.id)}
                                          />
                                          主导师
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveMentorFromRole(selectedServiceId, role.roleKey, mentor.id)}
                                          className="text-xs text-gray-400 transition hover:text-red-500 dark:text-gray-500 dark:hover:text-red-300"
                                        >
                                          移除
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900/60">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">新增角色</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-gray-400 dark:text-gray-500">角色名称</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400"
                        placeholder="例如：社团导师 / 背景规划导师"
                        value={newRoleName}
                        onChange={(event) => setNewRoleName(event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 dark:text-gray-500">角色职责（可选）</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400"
                        placeholder="说明该角色负责的任务"
                        value={newRoleResponsibilities}
                        onChange={(event) => setNewRoleResponsibilities(event.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddRole(selectedServiceId)}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    添加角色
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-400/60 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800/60">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            disabled={saving}
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                正在保存
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                保存顾问团队
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorAssignmentModal;

