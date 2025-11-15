import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

import type { LeadFormValues } from '../types';
import { LEAD_STAGE_OPTIONS } from '../types';

const INITIAL_VALUES: LeadFormValues = {
  name: '',
  project: '',
  stage: LEAD_STAGE_OPTIONS[0],
  owner: '',
  channel: '',
  campaign: '',
  nextAction: '',
};

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: LeadFormValues) => void;
}

const CreateLeadDialog: React.FC<CreateLeadDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [formValues, setFormValues] = useState<LeadFormValues>(INITIAL_VALUES);

  const isSubmitDisabled = useMemo(() => formValues.name.trim().length === 0 || formValues.project.trim().length === 0, [formValues]);

  const handleClose = (nextState: boolean) => {
    onOpenChange(nextState);
    if (!nextState) {
      setFormValues(INITIAL_VALUES);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>创建新线索</DialogTitle>
          <DialogDescription>录入线索基础信息，系统将自动保存到列表并提示跟进。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-name">线索名称</Label>
              <Input
                id="lead-name"
                placeholder="例如：赵思敏"
                value={formValues.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-project">意向项目</Label>
              <Input
                id="lead-project"
                placeholder="例如：2025FALL 美国 CS 硕士"
                value={formValues.project}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues((prev) => ({ ...prev, project: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-stage">当前阶段</Label>
              <Select
                value={formValues.stage}
                onValueChange={(value) =>
                  setFormValues((prev) => ({ ...prev, stage: value as typeof formValues.stage }))
                }
              >
                <SelectTrigger id="lead-stage">
                  <SelectValue placeholder="请选择阶段" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STAGE_OPTIONS.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-owner">负责人</Label>
              <Input
                id="lead-owner"
                placeholder="例如：丁若楠"
                value={formValues.owner}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues((prev) => ({ ...prev, owner: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-channel">来源渠道</Label>
              <Input
                id="lead-channel"
                placeholder="例如：官网表单"
                value={formValues.channel}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues((prev) => ({ ...prev, channel: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-campaign">归属活动（可选）</Label>
              <Input
                id="lead-campaign"
                placeholder="例如：2025 北美宣讲会"
                value={formValues.campaign}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues((prev) => ({ ...prev, campaign: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-next-action">下一步动作</Label>
            <textarea
              id="lead-next-action"
              className="min-h-[90px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              placeholder="例如：48 小时内安排 Demo，并发送高校案例资料"
              value={formValues.nextAction}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormValues((prev) => ({ ...prev, nextAction: event.target.value }))
              }
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" type="button" onClick={() => handleClose(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitDisabled}>
              保存线索
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;
