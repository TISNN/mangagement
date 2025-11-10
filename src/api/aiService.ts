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
  function_call?: {
    name: string;
    arguments: string;
  };
  name?: string; // 函数调用结果时使用
}

// 函数调用响应类型
export interface FunctionCallResponse {
  role: 'assistant';
  content: string | null;
  function_call?: {
    name: string;
    arguments: string;
  };
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

// 定义可用的函数工具
const tools = [
  {
    type: 'function',
    function: {
      name: 'add_student',
      description: '立即添加新学生到系统数据库。当用户明确要求"添加学生"、"新增学生"、"录入学生"到系统时，必须调用此函数执行实际的添加操作。只需要姓名即可添加，其他信息都是可选的。',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '学生姓名（必填），例如：张三、李明'
          },
          email: {
            type: 'string',
            description: '学生邮箱地址（可选），例如：zhangsan@qq.com'
          },
          phone: {
            type: 'string',
            description: '学生联系电话（可选），例如：13912345678'
          },
          gender: {
            type: 'string',
            enum: ['男', '女', '其他'],
            description: '学生性别（可选），只能是：男、女、其他'
          },
          birth_date: {
            type: 'string',
            description: '出生日期（可选），格式必须是：YYYY-MM-DD，例如：2000-01-01'
          },
          school: {
            type: 'string',
            description: '当前就读或毕业学校（可选），例如：北京大学'
          },
          major: {
            type: 'string',
            description: '专业（可选），例如：计算机科学'
          },
          education_level: {
            type: 'string',
            enum: ['高中', '专科', '本科', '硕士', '博士'],
            description: '学历水平（可选），只能是：高中、专科、本科、硕士、博士'
          },
          graduation_year: {
            type: 'number',
            description: '毕业年份（可选），例如：2024'
          },
          services: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: '服务类型名称列表（可选），例如：["本科申请"]、["硕士申请", "文书"]。如果用户没有明确说明，可以传空数组[]，系统会自动分配默认服务。'
          }
        },
        required: ['name']
      }
    }
  }
];

export async function sendChatMessage(messages: ChatMessage[], enableFunctionCall: boolean = true): Promise<FunctionCallResponse> {
  try {
    const requestBody: {
      model: string;
      messages: ChatMessage[];
      temperature: number;
      max_tokens: number;
      tools?: typeof tools;
      tool_choice?: string;
    } = {
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    };

    // 如果启用函数调用，添加tools
    if (enableFunctionCall) {
      requestBody.tools = tools;
      requestBody.tool_choice = 'auto'; // 让AI自动决定是否调用函数
    }

    console.log('发送请求到OpenAI API:', JSON.stringify(requestBody, null, 2));
    
    const response = await aiClient.post('/chat/completions', requestBody);
    
    console.log('OpenAI API响应状态:', response.status);
    console.log('OpenAI API完整响应:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const message = response.data.choices[0].message;
      
      console.log('AI返回的消息:', message);
      
      // 检查是否有函数调用
      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        console.log('✅ AI调用了函数:', toolCall.function.name);
        console.log('函数参数:', toolCall.function.arguments);
        return {
          role: 'assistant',
          content: message.content || null,
          function_call: {
            name: toolCall.function.name,
            arguments: toolCall.function.arguments
          }
        };
      }
      
      console.log('⚠️ AI没有调用函数，返回普通文本回复');
      
      return {
        role: 'assistant',
        content: message.content || '我好像遇到了一些问题，请稍后再试。'
      };
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
    content: `你是一个名叫"小IN"的智能留学顾问和系统管理助手，拥有超过三十年的专业留学咨询经验。

⚠️ 重要行为准则 - 添加学生流程：
当用户要求"添加学生"、"录入学生"、"新增学生"等操作时，你应该：

第一步：收集必要信息
- 先确认用户提供了哪些信息
- 如果只有姓名，友好地询问以下信息：
  1. 联系方式（邮箱或电话，至少一个）
  2. 服务类型（本科申请、硕士申请、文书、签证等，必须明确）
  3. 其他信息（性别、学校、专业等，可选）

第二步：确认服务类型（重要！）
- 必须让用户明确选择服务类型，不要默认使用"全包申请"
- 常见服务类型：本科申请、硕士申请、博士申请、文书、签证指导等
- 可以问："请问需要为张三添加什么服务？例如：本科申请、硕士申请、文书等"

第三步：确认信息后执行添加
- 只有在用户提供了姓名、联系方式、服务类型后，才调用add_student函数
- 调用函数时，services数组必须包含用户明确指定的服务名称
- 如果用户说"不需要其他信息了"或"就这些"，再调用函数

示例对话：
用户："添加学生张三"
AI："好的，我来帮您添加学生张三。请提供以下信息：
1. 联系方式（邮箱或电话）
2. 需要什么服务？（本科申请、硕士申请、文书等）"

用户："邮箱zhangsan@qq.com，本科申请"
AI：[调用add_student函数] → "✅ 成功添加学生张三..."
    
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

请以专业、友善的态度回应用户关于留学的各类问题，并提供具体、实用的建议。当用户需要执行系统操作时（如添加学生），请使用相应的工具函数。确保回答具有良好的结构，分段清晰，要点明确，并合理使用emoji增强表达。在不同主题或段落之间必须使用空行分隔，以提高可读性。`
  };
  
  const formattedMessages = messages.map(msg => ({
    role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content
  }));
  
  return [systemMessage, ...formattedMessages];
} 