import React, { useMemo, useState } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MatchCandidatePayload, ProfessorProfile } from '../types';
import { StudentMatchOption } from '@/services/professorDirectoryService';

interface ProfessorMatchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professor: ProfessorProfile | null;
  studentOptions: StudentMatchOption[];
  onSubmit: (professor: ProfessorProfile, payload: MatchCandidatePayload) => Promise<void> | void;
}

const ProfessorMatchDrawer: React.FC<ProfessorMatchDrawerProps> = ({
  open,
  onOpenChange,
  professor,
  studentOptions,
  onSubmit,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [targetIntake, setTargetIntake] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const defaultIntake = useMemo(() => professor?.intake ?? professor?.applicationWindow.intake ?? '', [professor]);

  React.useEffect(() => {
    if (open && professor) {
      setSelectedStudentId('');
      setTargetIntake(professor.intake || professor.applicationWindow.intake);
      setCustomNote('');
      setSubmitting(false);
    }
  }, [open, professor]);

  if (!professor) {
    return null;
  }

  const handleSubmit = async () => {
    if (selectedStudentId === '') {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(professor, {
        studentId: Number(selectedStudentId),
        targetIntake: targetIntake || defaultIntake,
        customNote: customNote.trim() ? customNote.trim() : undefined,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-0 dark:border-gray-700/60 dark:bg-gray-900">
        <DialogHeader className="space-y-2 rounded-t-3xl bg-indigo-600 px-6 py-6 text-left text-white">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="h-5 w-5" />
            添加到学生申请方案
          </DialogTitle>
          <DialogDescription className="text-xs text-indigo-100">
            选择一个目标学生，系统会在申请工作台内生成“教授沟通”任务，并同步对应的博士招募信息。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-700/70 dark:text-gray-300">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{professor.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{professor.university}</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {professor.phdSupervisionStatus} · 截止 {professor.applicationWindow.end}
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
              选择学生
              <select
                className="h-11 rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900/70"
                value={selectedStudentId === '' ? '' : String(selectedStudentId)}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedStudentId(value ? Number(value) : '');
                }}
              >
                <option value="">请选择要匹配的学生</option>
                {studentOptions.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                    {student.educationLevel ? ` · ${student.educationLevel}` : ''}
                    {student.status ? ` · ${student.status}` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
              目标入学季
              <input
                type="text"
                value={targetIntake}
                onChange={(event) => setTargetIntake(event.target.value)}
                placeholder={defaultIntake}
                className="h-11 rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900/70"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
              备注（可选）
              <textarea
                value={customNote}
                onChange={(event) => setCustomNote(event.target.value)}
                rows={4}
                placeholder="可以记录沟通重点、学生背景亮点或需提前准备的材料..."
                className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900/70"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800" onClick={() => onOpenChange(false)} disabled={submitting}>
              取消
            </Button>
            <Button
            className="bg-indigo-600 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleSubmit}
              disabled={!selectedStudentId || submitting}
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              生成沟通任务
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessorMatchDrawer;

