import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  ArrowLeft, 
  Eye, 
  Download, 
  Tag, 
  ThumbsUp, 
  MessageSquare,
  Edit,
  FileText,
  Save,
  X,
  Share,
  Copy,
  Check,
  Twitter,
  Link
} from 'lucide-react';

// 定义知识资源的接口
interface KnowledgeResource {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  fileSize: string;
  lastUpdated: string;
  author: string;
  views: number;
  downloads: number;
  tags: string[];
  isFeatured: boolean;
  isBookmarked: boolean;
  thumbnailUrl: string;
  fileUrl: string;
}

// 评论接口
interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

const KnowledgeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<KnowledgeResource | null>(null);
  const [relatedResources, setRelatedResources] = useState<KnowledgeResource[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 模拟获取资源详情的API调用
  const getResourceById = (resourceId: string | undefined): KnowledgeResource => {
    // 这里应该是从API获取数据，这里用模拟数据
    return {
      id: resourceId || 'K001',
      title: '如何准备托福考试',
      type: '指南',
      category: '考试准备',
      description: '本指南详细介绍了托福考试的各个部分（阅读、听力、口语和写作），并提供了针对性的备考策略和练习方法。适合初次准备托福考试的学生。',
      fileSize: '5.2 MB',
      lastUpdated: '2023-10-15',
      author: '刘明',
      views: 1250,
      downloads: 450,
      tags: ['托福', '考试', '英语', '留学'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/toefl-preparation-guide.pdf'
    };
  };

  // 获取相关资源
  const getRelatedResources = (): KnowledgeResource[] => {
    // 基于当前资源的标签或类别推荐相关资源
    return [
      {
        id: 'K002',
        title: '雅思考试备考指南',
        type: '指南',
        category: '考试准备',
        description: '全面的雅思考试准备指南，涵盖听说读写四个部分的技巧和策略。',
        fileSize: '4.8 MB',
        lastUpdated: '2023-09-20',
        author: '张华',
        views: 980,
        downloads: 320,
        tags: ['雅思', '考试', '英语', '留学'],
        isFeatured: false,
        isBookmarked: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        fileUrl: '/files/ielts-guide.pdf'
      },
      {
        id: 'K003',
        title: 'GRE考试词汇表',
        type: '资料',
        category: '考试准备',
        description: '精选3000个GRE高频词汇，带有中文释义和例句。',
        fileSize: '2.1 MB',
        lastUpdated: '2023-08-05',
        author: '王立',
        views: 1500,
        downloads: 850,
        tags: ['GRE', '词汇', '英语', '留学'],
        isFeatured: true,
        isBookmarked: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        fileUrl: '/files/gre-vocabulary.pdf'
      }
    ];
  };

  // 获取模拟评论数据
  const getComments = (): Comment[] => {
    return [
      {
        id: 'c1',
        user: '李学生',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: '这份资料对我准备托福考试非常有帮助，特别是口语部分的建议很实用！',
        date: '2023-11-05',
        likes: 12
      },
      {
        id: 'c2',
        user: '张同学',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        content: '写作部分的模板很棒，按照指南练习后我的写作分数提高了不少。',
        date: '2023-10-28',
        likes: 8
      }
    ];
  };

  useEffect(() => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      const fetchedResource = getResourceById(id);
      setResource(fetchedResource);
      setIsBookmarked(fetchedResource.isBookmarked);
      setRelatedResources(getRelatedResources());
      setComments(getComments());
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 这里应该有一个API调用来更新收藏状态
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `c${comments.length + 1}`,
      user: '当前用户',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    // 这里应该有一个API调用来保存评论
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      // 进入编辑模式
      setEditedDescription(resource?.description || '');
      setIsEditing(true);
    } else {
      // 取消编辑
      setIsEditing(false);
    }
  };

  const handleSaveEdit = () => {
    if (resource) {
      // 更新资源描述
      const updatedResource = { ...resource, description: editedDescription };
      setResource(updatedResource);
      // 这里应该有一个API调用来保存编辑内容
      setIsEditing(false);
      alert('内容已保存！在实际应用中，这里会调用API将修改保存到服务器。');
    }
  };

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
    if (!showPreview && resource) {
      // 模拟获取预览内容
      setPreviewContent(`
# ${resource.title}
**作者:** ${resource.author} | **更新于:** ${resource.lastUpdated}

## 内容简介
${resource.description}

## 主要内容
1. 托福考试的基本介绍
2. 听力部分备考策略
   - 听力材料分类
   - 常见题型分析
   - 答题技巧
3. 阅读部分备考策略
   - 阅读文章类型
   - 速度与准确性训练
   - 生词处理技巧
4. 口语部分备考策略
   - 六个任务详解
   - 评分标准解析
   - 常用模板与表达
5. 写作部分备考策略
   - 独立写作与综合写作区别
   - 高分写作结构
   - 实用句型与词汇

## 推荐学习计划
- 第1-2周：熟悉考试结构与题型
- 第3-6周：系统练习各部分题目
- 第7-8周：模拟考试与查漏补缺
- 考前1周：调整心态与考试策略

## 实用资源推荐
- 官方真题集
- 推荐备考软件
- 学习网站与论坛
      `);
    }
  };

  const handleDownload = () => {
    if (resource) {
      // 模拟下载逻辑
      alert(`开始下载文件: ${resource.fileUrl}`);
      // 创建一个模拟的下载链接
      const link = document.createElement('a');
      link.href = resource.thumbnailUrl; // 在实际应用中，这应该是真实的文件URL
      link.download = `${resource.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 这里应该有一个API调用来增加下载计数
    }
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('无法复制链接: ', err);
        alert('复制链接失败，请手动复制浏览器地址栏中的URL');
      });
  };

  const shareToWeChat = () => {
    // 微信分享通常需要调用微信SDK
    // 这里是模拟实现
    alert('请截图或分享此链接到微信: ' + window.location.href);
    setShowShareMenu(false);
  };

  const shareToWeibo = () => {
    // 实际应用中应使用微博分享API
    const title = resource?.title || '知识资源分享';
    const url = window.location.href;
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(weiboUrl, '_blank');
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    // 实际应用中应使用Twitter分享API
    const title = resource?.title || '知识资源分享';
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">资源未找到</h2>
        <button
          onClick={() => navigate('/admin/knowledge')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          返回知识库
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮和标题 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin/knowledge')}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          返回知识库
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviewToggle}
            className={`flex items-center px-3 py-1.5 rounded ${
              showPreview 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <FileText className="h-4 w-4 mr-1" />
            {showPreview ? '关闭预览' : '在线预览'}
          </button>
          <button
            onClick={handleEditToggle}
            className={`flex items-center px-3 py-1.5 rounded ${
              isEditing 
                ? 'bg-amber-100 text-amber-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Edit className="h-4 w-4 mr-1" />
            {isEditing ? '取消编辑' : '编辑内容'}
          </button>
          <div className="relative">
            <button
              onClick={handleShareClick}
              className="flex items-center px-3 py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Share className="h-4 w-4 mr-1" />
              分享
            </button>
            
            {/* 分享菜单 */}
            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-lg overflow-hidden z-10 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 py-2">
                    分享到
                  </div>
                  <button 
                    onClick={shareToWeChat}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5,4C5.36,4 2,6.69 2,10C2,11.89 3.08,13.56 4.78,14.66L4,17L6.5,15.5C7.39,15.81 8.37,16 9.41,16C9.15,15.37 9,14.7 9,14C9,10.69 12.13,8 16,8C16.19,8 16.38,8.01 16.56,8.03C15.54,5.69 12.78,4 9.5,4M6.5,6.5A1,1 0 0,1 7.5,7.5A1,1 0 0,1 6.5,8.5A1,1 0 0,1 5.5,7.5A1,1 0 0,1 6.5,6.5M11.5,6.5A1,1 0 0,1 12.5,7.5A1,1 0 0,1 11.5,8.5A1,1 0 0,1 10.5,7.5A1,1 0 0,1 11.5,6.5M16,9C13.24,9 11,11.24 11,14C11,16.76 13.24,19 16,19C16.67,19 17.31,18.88 17.89,18.65L20,20L19.38,17.93C20.95,16.82 22,15.5 22,14C22,11.24 19.76,9 16,9M14,11.5A1,1 0 0,1 15,12.5A1,1 0 0,1 14,13.5A1,1 0 0,1 13,12.5A1,1 0 0,1 14,11.5M18,11.5A1,1 0 0,1 19,12.5A1,1 0 0,1 18,13.5A1,1 0 0,1 17,12.5A1,1 0 0,1 18,11.5Z" />
                      </svg>
                    </div>
                    <span>微信</span>
                  </button>
                  <button 
                    onClick={shareToWeibo}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.82,13.31C9.47,13.15 9.04,13.25 8.89,13.59C8.74,13.93 8.85,14.32 9.2,14.47C9.56,14.62 9.97,14.5 10.12,14.17C10.28,13.83 10.16,13.46 9.82,13.31M11.69,14.53C11.36,14.5 11.13,14.74 11.1,15.05C11.07,15.36 11.28,15.62 11.61,15.65C11.94,15.68 12.2,15.45 12.23,15.12C12.27,14.81 12.04,14.56 11.69,14.53M11.04,15.45C10.15,15.16 9.58,14.5 9.72,13.93C9.86,13.36 10.64,13.1 11.54,13.39C12.43,13.68 13.01,14.34 12.87,14.91C12.72,15.47 11.93,15.75 11.04,15.45M15.03,16.39C15.3,16.8 15.22,17.37 14.83,17.76C14.44,18.16 13.86,18.23 13.6,17.83C13.34,17.43 13.43,16.87 13.82,16.47C14.21,16.07 14.77,16 15.03,16.39M15.76,14.55C15.73,14.55 15.7,14.55 15.67,14.56C15.31,14.6 15.05,14.93 15.1,15.27C15.14,15.61 15.5,15.84 15.86,15.79C16.23,15.75 16.69,15.96 16.94,16.44C17.19,16.91 17.16,17.37 16.95,17.61C16.69,17.91 16.27,18.05 15.86,17.96C15.5,17.89 15.1,18.05 15.03,18.38C14.96,18.71 15.13,19.07 15.5,19.14C16.5,19.35 17.5,18.96 18.17,18.11C18.88,17.21 19.11,16.08 18.62,15.18C18.34,14.69 17.83,14.31 17.17,14.15C16.5,13.99 15.77,14.14 15.49,14.5C15.43,14.53 15.36,14.54 15.3,14.55H15.76M6.82,15.5C6.84,15.5 6.87,15.5 6.89,15.5C7.32,15.46 7.66,15.11 7.62,14.73C7.57,14.35 7.2,14.05 6.77,14.1C5.47,14.24 4.96,16.04 5.37,17.25C5.49,17.61 5.89,17.82 6.28,17.72C6.67,17.6 6.88,17.23 6.77,16.88C6.59,16.27 6.74,15.55 6.82,15.5M4.86,18.05C4.04,19.62 4.64,21.73 6.35,22.5C8.06,23.27 9.13,22.6 9.47,22.36C9.89,22.07 10.01,21.54 9.72,21.13C9.42,20.73 8.84,20.61 8.43,20.9C8.3,21 7.75,21.31 6.85,20.93C5.94,20.55 5.64,19.35 6.16,18.49C6.41,18.07 6.27,17.54 5.84,17.29C5.42,17.05 4.86,17.17 4.62,17.6C4.59,17.64 4.57,17.68 4.55,17.73L4.86,18.05M20,11.82C20,7.5 15.5,4 10,4C5.26,4 1.3,6.76 0.17,10.33C0.06,10.8 0.25,11.29 0.73,11.4C1.19,11.5 1.68,11.33 1.78,10.86V10.86C2.75,7.86 6.12,5.54 10,5.54C14.7,5.54 18.45,8.5 18.45,11.82C18.45,14.06 16.96,16.18 14.34,17.24C13.92,17.42 13.72,17.91 13.9,18.32H13.9C14.08,18.73 14.57,18.93 14.99,18.75C18.19,17.45 20,14.77 20,11.82Z"/>
                      </svg>
                    </div>
                    <span>微博</span>
                  </button>
                  <button 
                    onClick={shareToTwitter}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-400 text-white rounded">
                      <Twitter className="h-3.5 w-3.5" />
                    </div>
                    <span>Twitter</span>
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-500 text-white rounded">
                      {copySuccess ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Link className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span>{copySuccess ? "已复制链接" : "复制链接"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleBookmark}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <Bookmark className={`h-5 w-5 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? '已收藏' : '收藏'}
          </button>
        </div>
      </div>

      {/* 在线预览模式 */}
      {showPreview && resource && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">文档预览</h2>
            <button 
              onClick={handlePreviewToggle}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="prose max-w-none">
              {previewContent.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold my-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold my-3">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold my-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6">{line.substring(2)}</li>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-bold">{line.substring(2, line.length - 2)}</p>;
                } else if (line === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="my-2">{line}</p>;
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* 资源详情 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={resource.thumbnailUrl}
              alt={resource.title}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {resource.type} • {resource.category}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{resource.title}</h1>
            <p className="mt-2 text-gray-500">作者: {resource.author} • 最后更新: {resource.lastUpdated}</p>
            
            {isEditing ? (
              <div className="mt-4">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    保存修改
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-gray-600">{resource.description}</p>
            )}
            
            <div className="mt-6 flex items-center">
              <div className="flex items-center mr-8">
                <Eye className="h-5 w-5 text-gray-400 mr-1" />
                <span>{resource.views} 次浏览</span>
              </div>
              <div className="flex items-center">
                <Download className="h-5 w-5 text-gray-400 mr-1" />
                <span>{resource.downloads} 次下载</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleDownload}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                下载资源 ({resource.fileSize})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 评论区 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">讨论区 ({comments.length})</h2>
        
        {/* 评论列表 */}
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex">
              <img
                className="h-10 w-10 rounded-full mr-4"
                src={comment.avatar}
                alt={comment.user}
              />
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className="font-bold text-gray-800">{comment.user}</h4>
                  <span className="ml-2 text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
                <div className="mt-2 flex items-center text-gray-500">
                  <button className="flex items-center mr-4 hover:text-blue-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center hover:text-blue-500">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>回复</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 发表评论 */}
        <form onSubmit={handleSubmitComment} className="mt-6">
          <div className="mb-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="分享你的想法..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              发表评论
            </button>
          </div>
        </form>
      </div>

      {/* 相关资源 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">相关资源推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedResources.map((relatedResource) => (
            <div
              key={relatedResource.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
              onClick={() => navigate(`/admin/knowledge/detail/${relatedResource.id}`)}
            >
              <img
                className="w-full h-40 object-cover"
                src={relatedResource.thumbnailUrl}
                alt={relatedResource.title}
              />
              <div className="p-4">
                <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                  {relatedResource.type}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {relatedResource.title}
                </h3>
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {relatedResource.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{relatedResource.author}</span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Eye className="h-3 w-3 mr-1" />
                    {relatedResource.views} 次浏览
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeDetailPage; 