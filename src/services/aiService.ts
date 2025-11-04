/**
 * AI 服务
 * 处理所有 AI 相关的 API 调用
 */

// 默认使用 chatanywhere 提供的 OpenAI 兼容转发服务
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const AI_API_HOST =
  import.meta.env.VITE_AI_API_HOST?.replace(/\/$/, '') || 'https://api.chatanywhere.tech';
const AI_API_MODEL = import.meta.env.VITE_AI_API_MODEL || 'gpt-4o-mini';
const DEFAULT_MODEL_ID = 'default';

export interface AIModelOption {
  id: string;
  label: string;
  model: string;
  apiKey: string;
  apiHost: string;
}

const env = import.meta.env as Record<string, string | undefined>;

const defaultModelOption: AIModelOption = {
  id: DEFAULT_MODEL_ID,
  label: env.VITE_AI_API_MODEL_LABEL || `${AI_API_MODEL}（默认）`,
  model: AI_API_MODEL,
  apiKey: AI_API_KEY,
  apiHost: AI_API_HOST,
};

const EXTRA_MODEL_PREFIX = 'VITE_AI_MODEL_';
const extraModels: AIModelOption[] = Object.keys(env)
  .filter((key) => key.startsWith(EXTRA_MODEL_PREFIX))
  .filter((key) => key !== 'VITE_AI_MODEL' && key !== 'VITE_AI_API_MODEL_LABEL')
  .map((key) => {
    const modelValue = env[key];
    if (!modelValue) return null;

    const suffix = key.substring(EXTRA_MODEL_PREFIX.length);
    const normalizedId = suffix
      .toLowerCase()
      .replace(/_label$/i, '')
      .replace(/[^a-z0-9]+/g, '-');

    const labelEnvKey = `${EXTRA_MODEL_PREFIX}${suffix}_LABEL`;
    const apiKeyEnvKey = `VITE_AI_API_KEY_${suffix}`;
    const apiHostEnvKey = `VITE_AI_API_HOST_${suffix}`;

    const label =
      env[labelEnvKey] ||
      modelValue;
    const apiKey = env[apiKeyEnvKey] || AI_API_KEY;
    const apiHost = (env[apiHostEnvKey] || AI_API_HOST || '').replace(/\/$/, '');

    return {
      id: normalizedId || modelValue,
      label,
      model: modelValue,
      apiKey,
      apiHost,
    } as AIModelOption;
  })
  .filter((item): item is AIModelOption => !!item);

const modelMap = new Map<string, AIModelOption>();
const pushModel = (option: AIModelOption) => {
  if (!option.model) return;
  modelMap.set(option.id, option);
};
pushModel(defaultModelOption);
extraModels.forEach(pushModel);

const availableModels: AIModelOption[] = Array.from(modelMap.values());

let activeModelConfig: AIModelOption =
  availableModels.find((item) => item.apiKey) || availableModels[0] || defaultModelOption;

const modelListeners = new Set<() => void>();

function notifyModelListeners() {
  modelListeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error('AI model listener error:', error);
    }
  });
}

export function getAvailableModels(): AIModelOption[] {
  return availableModels;
}

export function getActiveModel(): AIModelOption {
  return activeModelConfig;
}

export function setActiveModel(modelId: string): void {
  const config = modelMap.get(modelId);
  if (config && config !== activeModelConfig) {
    activeModelConfig = config;
    notifyModelListeners();
  }
}

export function subscribeActiveModel(listener: () => void): () => void {
  modelListeners.add(listener);
  return () => {
    modelListeners.delete(listener);
  };
}

function resolveModelConfig(identifier?: string): AIModelOption {
  if (!identifier) {
    return activeModelConfig;
  }

  const mapped = modelMap.get(identifier);
  if (mapped) {
    return mapped;
  }

  // 如果没有找到对应的 ID，则认为传入的是模型名称，沿用当前 Key/Host
  return {
    ...activeModelConfig,
    model: identifier,
  };
}

/**
 * 调用 AI API
 */
async function callAI(prompt: string, modelIdentifier?: string): Promise<string> {
  const { apiKey, apiHost, model } = resolveModelConfig(modelIdentifier);
  
  // 调试日志
  console.log('🤖 AI 调用信息:', {
    使用模型: model,
    API地址: apiHost,
    有API_Key: !!apiKey,
    提示词长度: prompt.length,
  });

  // 如果没有配置 API Key，返回模拟数据
  if (!apiKey) {
    console.warn('AI API Key 未配置，使用模拟数据');
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟延迟
    return `这是 AI 生成的示例内容。\n\n当前模型：${model}（未配置 API Key）。\n\n请在 .env 文件中配置 VITE_AI_API_KEY （可选 VITE_AI_API_HOST, VITE_AI_API_MODEL）以使用真实的 AI 功能。\n\n提示词：${prompt}`;
  }

  try {
    const host = (apiHost || AI_API_HOST || '').replace(/\/$/, '');
    if (!host) {
      throw new Error('未配置 AI API Host');
    }
    const endpoint = `${host}/v1/chat/completions`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert bilingual writing assistant. Reply in Chinese unless the user requests another language.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = errorData.error?.message || JSON.stringify(errorData);
      } catch {
        errorDetail = response.statusText;
      }
      
      const errorMsg = `AI API 返回异常 [${response.status}]\n模型: ${model}\nAPI: ${endpoint}\n详情: ${errorDetail}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      '';

    if (!content) {
      throw new Error('AI 没有返回内容');
    }

    return content;
  } catch (error) {
    console.error('AI 调用失败:', error);
    throw error;
  }
}

/**
 * AI 续写
 */
export async function aiContinue(currentText: string): Promise<string> {
  const prompt = `请根据以下内容续写下一段，保持风格和语气一致：\n\n${currentText}`;
  return await callAI(prompt);
}

/**
 * AI 改写（润色）
 */
export async function aiImprove(selectedText: string): Promise<string> {
  const prompt = `请优化以下文字，使其更专业、更流畅、更易读：\n\n${selectedText}`;
  return await callAI(prompt);
}

/**
 * AI 总结
 */
export async function aiSummarize(text: string): Promise<string> {
  const prompt = `请用3-5个要点总结以下内容：\n\n${text}`;
  return await callAI(prompt);
}

/**
 * AI 翻译
 */
export async function aiTranslate(text: string, targetLang: string = 'en'): Promise<string> {
  const langMap: Record<string, string> = {
    'en': '英文',
    'zh': '中文',
    'ja': '日文',
    'ko': '韩文'
  };
  
  const prompt = `请将以下内容翻译为${langMap[targetLang] || '英文'}：\n\n${text}`;
  return await callAI(prompt);
}

/**
 * AI 创作初稿
 */
export async function aiDraft(topic: string): Promise<string> {
  const prompt = `请围绕以下主题创作一篇内容：${topic}\n\n要求：结构清晰，内容充实，约300-500字。`;
  return await callAI(prompt);
}

/**
 * AI 起草提纲
 */
export async function aiOutline(topic: string): Promise<string> {
  const prompt = `请为以下主题起草一个详细提纲：${topic}\n\n要求：层次分明，要点完整。`;
  return await callAI(prompt);
}

/**
 * AI 自由写作
 */
export async function aiWrite(contextOrTopic: string): Promise<string> {
  const prompt = `请基于以下主题或上下文创作一段流畅、具备故事性的内容，长度约为300字：\n\n${contextOrTopic}`;
  return await callAI(prompt);
}

/**
 * AI 头脑风暴
 */
export async function aiBrainstorm(topic: string): Promise<string> {
  const prompt = `请围绕以下主题进行头脑风暴，提供10个创意想法：${topic}`;
  return await callAI(prompt);
}

/**
 * AI 制作表格（以 Markdown 表格形式返回）
 */
export async function aiTable(topicOrContext: string): Promise<string> {
  const prompt = `请根据以下主题或上下文整理一份 Markdown 表格，包含至少3列和4行：\n\n${topicOrContext}\n\n请只返回 Markdown 表格内容。`;
  return await callAI(prompt);
}

/**
 * AI 制作流程图步骤
 */
export async function aiFlowchart(topicOrContext: string): Promise<string> {
  const prompt = `请将以下主题拆解为流程步骤，返回编号步骤列表，并在每一步说明关键要点：\n\n${topicOrContext}`;
  return await callAI(prompt);
}

/**
 * AI 帮助编写代码
 */
export async function aiCode(prompt: string, context?: string): Promise<string> {
  const mergedPrompt = context
    ? `以下是相关上下文：\n${context}\n\n请根据上下文，完成这项编码请求：${prompt}`
    : `请帮助完成以下编码请求，并提供必要的说明：${prompt}`;
  return await callAI(mergedPrompt);
}

/**
 * AI 自由问答
 */
export async function aiCustom(question: string, context?: string): Promise<string> {
  let prompt = question;
  if (context) {
    prompt = `参考以下内容：\n${context}\n\n问题：${question}`;
  }
  return await callAI(prompt);
}
