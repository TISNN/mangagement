export type TemplateChannel = '电话' | '邮件' | '微信' | '会议' | '短信';

export interface TemplateScriptSection {
  title: string;
  bullets: string[];
}

export interface TemplatePlaybook {
  id: string;
  title: string;
  channel: TemplateChannel;
  stage: string;
  scenario: string;
  description: string;
  owner: string;
  lastUpdated: string;
  usage: number;
  rating: number;
  highlights: string[];
  nextAction: string;
  scriptSections: TemplateScriptSection[];
  aiPrompt: string;
}

