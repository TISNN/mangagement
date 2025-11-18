import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, List, Users, FileSpreadsheet, KanbanSquare, BarChart3 } from 'lucide-react';
import { useDataContext } from '../../../context/DataContext';
import SummaryCards from './components/SummaryCards';
import FilterBar from './components/FilterBar';
import ListView from './components/ListView';
import CardView from './components/CardView';
import DataGridView from './components/DataGridView';
import KanbanView from './components/KanbanView';
import InsightsView from './components/InsightsView';
import StudentDetailPanel from './components/StudentDetailPanel';
import { MentorRole, StudentRecord, StudentStatus, StudentView } from './types';
import { buildSummaryMetrics, KANBAN_COLUMNS, mapStudentRecord } from './utils';
import { exportStudentsDetailToCSV, exportStudentsToCSV, downloadCSV } from '../../../utils/export';
import StudentAddModal from '../../../components/StudentAddModal';
import MentorAssignmentModal from './components/MentorAssignmentModal';
import { peopleService } from '../../../services';
import { StudentDisplay } from '../StudentsPage/StudentsPage';
import { STUDY_APPLICATION_LINE } from '../../../context/studentBusinessLines';

const VIEW_TABS: Array<{ id: StudentView; label: string; icon: React.ElementType }> = [
  { id: 'list', label: '列表视图', icon: List },
  { id: 'card', label: '卡片视图', icon: Users },
  { id: 'grid', label: '表格视图', icon: FileSpreadsheet },
  { id: 'kanban', label: '服务看板', icon: KanbanSquare },
  { id: 'insights', label: '数据洞察', icon: BarChart3 },
];

const StudentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    students: rawStudents,
    loadingStudents,
    refreshStudents,
    mentors,
    loadingMentors,
  } = useDataContext();
  const [view, setView] = useState<StudentView>('list');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StudentStatus | '全部'>('活跃');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mentorModalStudent, setMentorModalStudent] = useState<StudentRecord | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<StudentDisplay | null>(null);

  const applicationStudents = useMemo(
    () => rawStudents.filter((student) => student.businessLines.includes(STUDY_APPLICATION_LINE)),
    [rawStudents],
  );

  const studentRecords = useMemo(() => applicationStudents.map(mapStudentRecord), [applicationStudents]);
  const summaryMetrics = useMemo(() => buildSummaryMetrics(studentRecords), [studentRecords]);

  const availableTags = useMemo(
    () =>
      Array.from(new Set(studentRecords.flatMap((student) => student.tags))).filter(Boolean),
    [studentRecords],
  );

  const availableAdvisors = useMemo(() => {
    const advisorSet = new Set<string>();
    studentRecords.forEach((student) => {
      if (student.advisor) advisorSet.add(student.advisor);
      student.mentorTeam.forEach((mentor) => {
        if (mentor) advisorSet.add(mentor);
      });
    });
    return Array.from(advisorSet);
  }, [studentRecords]);

  const filteredStudents = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    return studentRecords.filter((student) => {
      const matchesStatus = status === '全部' || student.status === status;
      if (!matchesStatus) return false;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => student.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()));
      if (!matchesTags) return false;
      const matchesAdvisor =
        selectedAdvisors.length === 0 ||
        selectedAdvisors.some((advisor) => {
          const normalized = advisor.toLowerCase();
          return (
            student.advisor.toLowerCase() === normalized ||
            student.mentorTeam.some((mentor) => mentor.toLowerCase() === normalized)
          );
        });
      if (!matchesAdvisor) return false;
      if (!trimmed) return true;
      return (
        student.name.toLowerCase().includes(trimmed) ||
        student.email?.toLowerCase().includes(trimmed) ||
        student.tags.some((tag) => tag.toLowerCase().includes(trimmed)) ||
        student.location?.toLowerCase().includes(trimmed) ||
        student.channel?.toLowerCase().includes(trimmed)
      );
    });
  }, [studentRecords, search, status, selectedTags, selectedAdvisors]);

  const handleAddStudentSuccess = async () => {
    await refreshStudents();
    setIsAddModalOpen(false);
    setStudentToEdit(null);
    setSelectedStudent(null);
  };

  const handleStudentModalClose = () => {
    setIsAddModalOpen(false);
    setStudentToEdit(null);
  };

  const handleOpenAddStudent = () => {
    setStudentToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleManageMentors = (student: StudentRecord) => {
    setMentorModalStudent(student);
  };

  const handleCloseMentorModal = () => {
    setMentorModalStudent(null);
  };

  const handleEditStudent = (student: StudentRecord) => {
    const source = applicationStudents.find((item) => item.id === student.id);
    if (source) {
      setStudentToEdit(source);
      setIsAddModalOpen(true);
    }
  };

  const handleSaveMentors = async (updates: Array<{ serviceId: string; mentorRoles: MentorRole[] }>) => {
    if (updates.length === 0) {
      setMentorModalStudent(null);
      return;
    }

    try {
      await Promise.all(
        updates.map(({ serviceId, mentorRoles }) =>
          peopleService.updateStudentServiceMentors(
            Number.parseInt(serviceId, 10),
            mentorRoles.map((role) => ({
              roleKey: role.roleKey,
              roleName: role.roleName,
              responsibilities: role.responsibilities,
              mentors: role.mentors.map((mentor) => ({
                id: mentor.id,
                name: mentor.name,
                isPrimary: Boolean(mentor.isPrimary),
              })),
            })),
          ),
        ),
      );
      await refreshStudents();
      setMentorModalStudent(null);
    } catch (error) {
      console.error('保存顾问团队失败', error);
    }
  };

  const handleExportBasic = async () => {
    try {
      setIsExporting(true);
      const csv = exportStudentsToCSV(applicationStudents);
      downloadCSV(csv, `students-basic-${Date.now()}.csv`);
    } catch (error) {
      console.error('导出基础信息失败', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDetailed = async () => {
    try {
      setIsExporting(true);
      const { studentCsv, serviceCsv } = exportStudentsDetailToCSV(applicationStudents);
      const timestamp = Date.now();
      downloadCSV(studentCsv, `students-detail-${timestamp}.csv`);
      downloadCSV(serviceCsv, `students-services-${timestamp}.csv`);
    } catch (error) {
      console.error('导出详细信息失败', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loadingStudents) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-300">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <span>学生数据加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">申请学生中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Application Students Center</p>
          <p className="max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            聚焦留学申请业务的学生，提供列表、卡片、表格、看板与洞察多视图。结合 AI 洞察、风险预警与服务进度，为申请顾问与运营团队提供高密度协作闭环。
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => navigate('/admin/students-legacy')}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              ← 学生管理总览
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500">|</span>
            <button
              onClick={() => navigate('/admin/service-chronology')}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              服务进度中心 →
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportDetailed}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60"
          >
            <Download className="h-4 w-4" />
            生成学生报告
          </button>
          <button
            onClick={handleOpenAddStudent}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
          >
            <Users className="h-4 w-4" />
            新增学生
          </button>
        </div>
      </div>

      <SummaryCards metrics={summaryMetrics} />

      <FilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onExportBasic={handleExportBasic}
        onExportDetailed={handleExportDetailed}
        isExporting={isExporting}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        availableAdvisors={availableAdvisors}
        selectedAdvisors={selectedAdvisors}
        onAdvisorsChange={setSelectedAdvisors}
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-2 dark:border-gray-700/60 dark:bg-gray-800">
        <div className="flex flex-wrap gap-2">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
            <button
              key={tab.id}
                onClick={() => setView(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  active
                  ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/60'
              }`}
            >
                <Icon className="h-4 w-4" />
              {tab.label}
            </button>
            );
          })}
        </div>
      </div>

      {view === 'list' && <ListView students={filteredStudents} onSelect={setSelectedStudent} />}
      {view === 'card' && <CardView students={filteredStudents} onSelect={setSelectedStudent} />}
      {view === 'grid' && <DataGridView students={filteredStudents} onExportExcel={handleExportDetailed} />}
      {view === 'kanban' && <KanbanView students={filteredStudents} columns={KANBAN_COLUMNS} />}
      {view === 'insights' && <InsightsView />}

      <StudentDetailPanel
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onManageMentors={handleManageMentors}
        onEdit={handleEditStudent}
        onStatusUpdated={refreshStudents}
      />

      <MentorAssignmentModal
        isOpen={Boolean(mentorModalStudent)}
        student={mentorModalStudent}
        mentors={mentors}
        loadingMentors={loadingMentors}
        onClose={handleCloseMentorModal}
        onSave={handleSaveMentors}
      />

      <StudentAddModal
        isOpen={isAddModalOpen}
        onClose={handleStudentModalClose}
        onStudentAdded={handleAddStudentSuccess}
        studentToEdit={studentToEdit ?? undefined}
      />
    </div>
  );
};

export default StudentManagementPage;

