import axios from 'axios';

// API密钥应该存储在环境变量或服务器端
// 这里为了演示，我们直接使用，但实际生产环境应该更安全地处理
const API_KEY = 'sk-DMVVheSxs56jFFWG9Tu8hEt7iK48rnj5Xs34mFJEKhUA24zJ';
// 尝试使用备用URL
const BASE_URL = 'https://api.chatanywhere.org/v1';

const aiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 增加超时时间至30秒
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 应用内消息类型定义
interface AppMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  media?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

// 简单的测试接口连通性函数
export async function testConnection() {
  try {
    const response = await aiClient.get('/models');
    console.log('连接测试成功，可用模型:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('连接测试失败:', error);
    return { success: false, error };
  }
}

export async function sendChatMessage(messages: ChatMessage[]) {
  try {
    console.log('发送请求到OpenAI API:', JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages
    }, null, 2));
    
    const response = await aiClient.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });
    
    console.log('OpenAI API响应:', response.status);
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message;
    } else {
      console.error('API返回数据格式不正确:', response.data);
      return {
        role: 'assistant',
        content: '我好像遇到了一些问题，请稍后再试。'
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios错误详情:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // 根据不同的错误类型返回不同的提示
      if (error.code === 'ECONNABORTED') {
        return { role: 'assistant', content: '连接超时，请检查您的网络并稍后再试。' };
      }
      
      if (error.response?.status === 401) {
        return { role: 'assistant', content: 'API授权失败，请检查API密钥是否有效。' };
      }
      
      if (error.response?.status === 429) {
        return { role: 'assistant', content: 'API请求频率超限，请稍后再试。' };
      }
    }
    
    console.error('Error calling OpenAI API:', error);
    return { 
      role: 'assistant', 
      content: '抱歉，连接AI服务时出现了问题。请检查网络连接或稍后再试。错误详情: ' + (error instanceof Error ? error.message : '未知错误')
    };
  }
}

// 将文本消息转换为ChatMessage格式
export function formatMessagesForAPI(messages: AppMessage[]): ChatMessage[] {
  // 添加系统消息，指导AI的行为
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `你是一个名叫"小IN"的智能留学顾问，拥有超过三十年的专业留学咨询经验。
    
专业背景:
- 三十多年国际教育和留学咨询经验
- 精通世界各国留学申请流程和政策
- 帮助过数千名学生成功申请海外名校
- 对各国教育体系和入学要求有深入了解

知识范围:
- 美国、英国、加拿大、澳洲、新西兰、欧洲和亚洲主要留学国家的教育体系
- 本科、硕士、博士及高中不同阶段的申请策略
- 奖学金申请和经济资助信息
- 留学签证办理流程和技巧
- 海外生活适应和职业规划建议

回答风格:
- 以资深顾问的专业口吻提供建议
- 根据学生情况给出个性化的建议
- 提供准确、实用的信息，不夸大也不误导
- 关注细节，提供全面的解决方案
- 回答时使用清晰的段落划分，每个主题一个段落
- 段落之间必须空一行，确保良好的阅读体验和清晰的结构
- 列举要点时使用分点格式，便于用户理解
- 适当使用emoji表情符号增加亲和力和生动性
- 在每个重要观点前添加相关的emoji，增强视觉识别

咨询方式:
- 耐心倾听学生需求，提出有针对性的建议
- 解答留学过程中的各种疑问和担忧
- 在专业领域提供权威、可靠的指导
- 鼓励学生根据自身情况做出合适的选择

emoji使用指南:
- 使用🎓表示学术相关内容
- 使用🌍表示国家或地区信息
- 使用📝表示申请流程和材料
- 使用💰表示奖学金和费用相关
- 使用✈️表示签证和出国准备
- 使用🏫表示院校相关信息
- 使用⏰表示时间线和截止日期
- 使用💡表示建议和提示
- 使用🔍表示深入分析和见解
- 使用👍表示优势和积极因素

请以专业、友善的态度回应用户关于留学的各类问题，并提供具体、实用的建议。确保回答具有良好的结构，分段清晰，要点明确，并合理使用emoji增强表达。在不同主题或段落之间必须使用空行分隔，以提高可读性。`
  };
  
  const formattedMessages = messages.map(msg => ({
    role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content
  }));
  
  return [systemMessage, ...formattedMessages];
} 