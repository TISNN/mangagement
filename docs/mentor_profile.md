Page({
  data: {
    currentTab: 'apply',
    teachers: [
      {
        id: 1,
        name: 'Evan',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/evan.png',
        tags: ['博士', '招生官', '学屿创始人'],
        education: 'Ph.D. 阿姆斯特丹大学 人工智能\n荷兰理学院 招生官\n英国注册留学顾问',
        serviceType: '留学申请/文书写作/留学咨询',
        rating: '5.0',
        serviceCount: '389',
        category: ['apply', 'subject']
      },
      {
        id: 2,
        name: 'Zoe',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/zoe.png',
        tags: ['硕士', '招生官', '学屿创始人'],
        education: 'Master ESCP 欧洲高等商学院\n市场与管理\nSAI（法国商学院联盟）招生官',
        serviceType: '留学申请/文书写作/留学咨询',
        rating: '5.0',
        serviceCount: '192',
        category: ['apply', 'subject']
      },
      {
        id: 3,
        name: 'Young',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Young.png',
        tags: ['本科', '牛剑导师', '竞赛金奖'],
        education: 'Bachelor 剑桥大学 土地经济\n雅思总分8.0分（口语8.0）\n全球金奖\n辅导多位学生入围John Locke',
        serviceType: '留学申请/竞赛培训/语言培训',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 4,
        name: 'Jane',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/jane.png',
        tags: ['硕士', '语言专家'],
        education: 'Master 莫纳什大学 语言测试\n雅思总分8.5分\n官方认证教师 TESOL证书\n澳大利亚三年英语教学经验',
        serviceType: '留学申请/文书写作/语言培训',
        category: ['apply', 'language']
      },
      {
        id: 5,
        name: 'Paisley',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Paisley.png',
        tags: ['硕士', '联合国'],
        education: 'Master 美国西北大学 传播学\n托福 115分\n就职于联合国纽约文教办',
        serviceType: '留学申请/文书写作/语言培训',
        category: ['apply', 'language']
      },
      {
        id: 6,
        name: 'Ingi',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/ingi.png',
        tags: ['雅思教研组长', '资深教师'],
        education: '某头部国际学校 超十年教学经验\n雅思总分9.0分\n教授学员2000+人\n授课10000+小时',
        serviceType: '雅思培训/全科辅导',
        rating: '4.98',
        serviceCount: '2000',
        category: 'language'
      },
      {
        id: 7,
        name: 'Kayn',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/kayn.png',
        tags: ['本科', '竞赛金奖', '学屿创始人'],
        education: 'Bachelor 伦敦大学学院 数学\n港大本科全奖\nA-Level 5A*\nAMC12 全球前1%',
        serviceType: '数学辅导/竞赛培训/留学咨询',
        rating: '4.95',
        serviceCount: '156',
        category: 'subject'
      },
      {
        id: 8,
        name: 'Leo',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/leo.png',
        tags: ['化学导师', 'A-Level满分'],
        education: 'Bachelor 伦敦大学学院 化学\nA-Level 5A*',
        serviceType: '化学辅导/竞赛培训/留学咨询',
        rating: '4.93',
        serviceCount: '143',
        category: 'subject'
      },
      {
        id: 9,
        name: 'Chris',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Chris.png',
        tags: ['本科', 'NEC金奖'],
        education: 'Bachelor 伦敦政经学院 纯经济\nNEC全国金奖获得者\nA-Level 5A*',
        serviceType: '经济辅导/竞赛培训/留学咨询',
        rating: '4.97',
        serviceCount: '168',
        category: 'subject'
      },
      {
        id: 10,
        name: 'Pansy',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Pansy.png',
        tags: ['数学导师', '金融导师'],
        education: 'Master&Bachelor 帝国理工学院\n数学与统计金融\n上海某知名国际高中老师',
        serviceType: '数学/统计/金融辅导/留学咨询',
        rating: '4.96',
        serviceCount: '178',
        category: 'subject'
      },
      {
        id: 11,
        name: 'Zhao',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Zhao.png',
        tags: ['数学导师', 'A-Level数学'],
        education: 'Master UCL 数学与统计\nBachelor UCL 数学与统计\nA-Level 5A*',
        serviceType: '数学辅导',
        rating: '4.94',
        serviceCount: '165',
        category: 'subject'
      },
      {
        id: 12,
        name: 'Mike',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Mike.png',
        tags: ['计算机导师', '机械工程师'],
        education: 'Master 澳洲国立大学 计算机\nBachelor 上海理工大学 机械工程\n擅长计算机视觉、机器学习、凸优化、网络科学、离散数学、算法等',
        serviceType: '留学申请/计算机辅导/留学咨询',
        rating: '4.93',
        serviceCount: '143',
        category: 'subject'
      },
      {
        id: 13,
        name: 'Bill',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Bill.png',
        tags: ['博士'],
        education: 'Ph.D. & Master 香港大学 计算机\nBachelor 澳门科技大学 计算机',
        serviceType: '计算机/数学辅导/留学咨询',
        rating: '4.96',
        serviceCount: '167',
        category: 'subject'
      },
      {
        id: 14,
        name: 'CAI',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/CAI.png',
        tags: ['硕士'],
        education: 'Master 新加坡国立大学 供应链\nBachelor 俄亥俄州立大学 供应链\n托福总分105分',
        serviceType: '留学申请/学科辅导/留学咨询',
        rating: '4.94',
        serviceCount: '158',
        category: ['apply', 'subject']
      },
      {
        id: 15,
        name: 'Sebastian',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Sebastian.png',
        tags: ['硕士'],
        education: 'Master 香港中文大学\n英语第二语言教学\n雅思总分8.0分',
        serviceType: '留学申请/语言培训/留学咨询',
        rating: '4.95',
        serviceCount: '176',
        category: ['apply', 'subject']
      },
      {
        id: 16,
        name: 'Aaron',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Aaron.png',
        tags: ['博士'],
        education: '博士 澳门科技大学 人工智能\n硕士 澳门科技大学 互动媒体',
        serviceType: '留学申请/计算机辅导/留学咨询',
        rating: '4.93',
        serviceCount: '149',
        category: ['apply', 'subject']
      },
      {
        id: 17,
        name: 'Ricardo',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Ricardo.png',
        tags: ['博士','口译'],
        education: 'Ph.D. 昆士兰大学 管理\n雅思总分8.0分\nTESOL剑桥商务英语等证书',
        serviceType: '留学申请/语言培训/留学咨询',
        rating: '4.96',
        serviceCount: '182',
        category: ['apply', 'language']
      },
      {
        id: 18,
        name: 'Hedy',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Hedy.png',
        tags: ['博士', '英国助理教授'],
        education: 'Ph.D. 雷丁大学 国际商务和管理\n助理教授 诺丁汉大学 国际商务与战略',
        serviceType: '留学申请/留学咨询',
        rating: '4.97',
        serviceCount: '176',
        category: ['apply', 'subject']
      },
      {
        id: 19,
        name: 'Lidia',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Lidia.png',
        tags: ['博士', '牛剑导师'],
        education: 'Ph.D. & Master 剑桥大学 经济学\nBachelor 武汉大学 经济学数学',
        serviceType: '留学申请/经济学辅导/留学咨询',
        rating: '4.98',
        serviceCount: '184',
        category: ['apply', 'subject']
      },
      {
        id: 20,
        name: 'OINI',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/oini.png',
        tags: ['硕士'],
        education: '哥伦比亚大学 企业风险管理 硕士\n杜伦大学 金融 学士',
        serviceType: '留学申请/金融辅导',
        rating: '4.95',
        serviceCount: '169',
        category: ['apply', 'subject']
      },
      {
        id: 21,
        name: 'Lee',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/lee2.png',
        tags: ['硕士'],
        education: '华盛顿大学 数学统计 硕士\n清华大学 数学统计 学士\n就职于国内头部金融二级市场',
        serviceType: '留学申请/数学统计辅导',
        rating: '4.96',
        serviceCount: '172',
        category: ['apply', 'subject']
      },
      {
        id: 22,
        name: 'HUI',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/hui.png',
        tags: ['博士', '美国'],
        education: 'Ph.D. UCB 东亚语言和文化\nMS. Cornell 亚洲研究\nBA. UCB 艺术和科学',
        serviceType: '留学申请/人文学科辅导/留学咨询',
        rating: '4.94',
        serviceCount: '165',
        category: ['apply', 'subject']
      },
      {
        id: 23,
        name: 'Yufei',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Yufei.png',
        tags: ['博士', '欧洲'],
        education: 'Ph.D. 格罗宁根大学 传媒\nMS. 阿姆斯特丹大学 媒体研究\nBA. Scripps College 人类学\n托福106 GRE 333 日语 N1',
        serviceType: '留学申请/语言培训/留学咨询',
        rating: '4.97',
        serviceCount: '178',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 24,
        name: 'Yuki',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/yuki.png',
        tags: ['硕士'],
        education: 'Master 阿姆斯特丹大学 语言学\n托福总分112分',
        serviceType: '留学申请/语言培训/留学咨询',
        rating: '4.95',
        serviceCount: '171',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 25,
        name: 'JING',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/jing.png',
        tags: ['硕士','作品集辅导'],
        education: 'Master 法国ESRA 制片与发行\nBachelor 法国CLCF 副导演\n法语C1',
        serviceType: '留学申请/作品集辅导/留学咨询',
        rating: '4.94',
        serviceCount: '163',
        category: ['apply', 'subject']
      },
      {
        id: 26,
        name: 'Emma',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/emma.png',
        tags: ['硕士', '战略顾问'],
        education: 'Master 法国里昂高等商学院 会计学\nBachelor 北京科技大学 战略与咨询',
        serviceType: '留学申请/商科辅导/留学咨询',
        rating: '4.95',
        serviceCount: '175',
        category: ['apply', 'subject']
      },
      {
        id: 27,
        name: 'Murphy',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/murphy.png',
        tags: ['硕士'],
        education: 'Master ESCP法国高商 管理学\nBachelor 东北大学 德语系',
        serviceType: '留学申请/商科辅导/语言培训',
        rating: '4.96',
        serviceCount: '188',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 28,
        name: 'George',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/George.png',
        tags: ['硕士', '语言导师'],
        education: 'MA. ESSEC 法国高商 金融\nBA. ESCP 法国高商 金融\n法语C1 雅思总分8.0 GMAT750\n就职于巴黎银行',
        serviceType: '留学申请/金融辅导/语言培训',
        rating: '4.97',
        serviceCount: '194',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 29,
        name: 'Xaiver',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Xavier.png',
        tags: ['硕士','招生官', '面试培训'],
        education: 'Master HEC Paris 商科\nSAI（法国商学院联盟）招生官\n就职于国内头部投行',
        serviceType: '留学申请/面试培训/留学咨询',
        rating: '4.98',
        serviceCount: '205',
        category: ['apply', 'subject']
      },
      {
        id: 30,
        name: 'Dery',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Dery.png',
        tags: ['博士'],
        education: 'Ph.D. 伦敦大学学院 社会学\nMaster 伦敦大学学院 TESOL\n雅思总分8.0\n13年学术英语和雅思教学经验',
        serviceType: '留学申请/学科辅导/语言培训',
        rating: '4.99',
        serviceCount: '215',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 31,
        name: 'Vivan',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/Vivan.png',
        tags: ['博士', 'IB考官'],
        education: '博士 利兹大学 教育学\n硕士 伦敦大学学院 教育学\n本科 上海交通大学 英语语言文学\nIB考官、教师培训官\n雅思总分8.0分',
        serviceType: '留学申请/教育辅导/语言培训',
        rating: '4.97',
        serviceCount: '198',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 32,
        name: 'Nix',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/nix.png',
        tags: ['硕士', '英语母语', '作品集'],
        education: '硕士 帝国理工&皇家艺术学院\n全球创新设计\n本科 康奈尔大学 设计与环境分析\nBeyer Award 贝尔奖\n清华大学+南洋理工交换\n擅长跨学科设计和艺术类申请',
        serviceType: '留学申请/作品集辅导/留学咨询',
        category: ['apply', 'subject']
      },
      {
        id: 33,
        name: 'Beck',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/beck.png',
        tags: ['硕士', '艺术创业'],
        education: '硕士 新加坡国立大学\n艺术与文化创业\n本科 上海外国语大学 广告学\n雅思7.0',
        serviceType: '留学申请/学科辅导/留学咨询',
        category: ['apply', 'subject']
      },
      {
        id: 34,
        name: 'Danny',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/danny.png',
        tags: ['硕士', '外教', '面试官'],
        education: 'Master 伯明翰大学 医学\n生物 化学 Alevel学科带头人\n6年外教 雅思口语与STEM课程\n7年加拿大生活和工作经验\n加拿大高中面试官 面试800+学生\n曾在哈佛医学院、多伦多大学、清华大学担任研究助理',
        serviceType: '学科辅导/语言培训',
        rating: '4.97',
        serviceCount: '186',
        category: ['subject', 'language']
      },
      {
        id: 35,
        name: 'Kevin',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/kevin.png',
        tags: ['博士', '全科导师'],
        education: 'Ph.D. 伦敦大学学院 社会学\nMaster 伦敦大学学院 经济学\n雅思总分8.0分 GRE330\n帮助过近百名学生全科提分',
        serviceType: '留学申请/学科辅导/语言培训',
        rating: '4.98',
        serviceCount: '98',
        category: ['apply', 'subject', 'language']
      },
      {
        id: 36,
        name: 'Felix',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/felix.png',
        tags: ['硕士', '金融导师', '风控专家'],
        education: 'Master 帝国理工学院\n风险管理与金融工程\nBachelor 帝国理工学院\n数学与金融统计\n就职于互联网大厂风控部门',
        serviceType: '留学申请/留学咨询/面试培训',
        rating: '4.96',
        serviceCount: '165',
        category: ['apply', 'subject']
      },
      {
        id: 37,
        name: 'Hythlodaeus',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/hythlodaeus.png',
        tags: ['博士', '哲学导师', '语言专家'],
        education: 'Ph.D. 香港中文大学 哲学\nMaster 香港中文大学 哲学\nBachelor 澳门科技大学 新闻学\n雅思7.5(写作8.0) 日语N2\n5年文书经验 辅导200+名学生',
        serviceType: '留学申请/哲学辅导/语言培训',
        rating: '4.97',
        serviceCount: '200',
        category: ['apply', 'subject']
      },
      {
        id: 38,
        name: 'Queenie',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/queenie.png',
        tags: ['硕士', '政经导师', '双学位'],
        education: 'Master 伦敦大学学院 政治与国际经济\nBachelor 华东政法大学 经济学&法学\n雅思7.5 GRE322',
        serviceType: '留学申请/政经法律辅导/留学咨询',
        rating: '4.95',
        serviceCount: '170',
        category: ['apply', 'subject']
      },
      {
        id: 39,
        name: 'Jerry',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/jerry.png',
        tags: ['硕士', '生物导师', ],
        education: 'Master 新加坡国立大学 生物多样性保护\n气候解决方案理学硕士\nBachelor 迈阿密大学(佛罗里达) 生物学\n辅修教育学',
        serviceType: '留学申请/生物辅导/留学咨询',
        rating: '4.95',
        serviceCount: '160',
        category: ['apply', 'subject']
      },
      {
        id: 40,
        name: 'Wen',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/wen.png',
        tags: ['博士', '政经导师', '全奖'],
        education: 'Ph.D. 伦敦国王学院 政治经济学 全奖\nMaster LSE 社会科学研究方法\nBachelor 澳门大学 国际与公共事务\n清华大学 国际政治 交换生',
        serviceType: '留学申请/政经辅导/留学咨询',
        rating: '4.96',
        serviceCount: '175',
        category: ['apply', 'subject']
      },
      {
        id: 41,
        name: 'Victoria',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/victoria.png',
        tags: ['硕士', '社会学导师', '北美'],
        education: 'Master 密歇根大学安娜堡分校 社会工作\nBachelor 武汉理工大学 社会学\n擅长管理、社会学、教育、传媒、公共政策等方向',
        serviceType: '留学申请/社会学辅导/留学咨询',
        rating: '4.95',
        serviceCount: '180',
        category: ['apply', 'subject']
      },
      {
        id: 42,
        name: 'Debbie',
        avatar: 'cloud://studylandsedu-5ghqlvav3719746e.7374-studylandsedu-5ghqlvav3719746e-1334219542/images/teacher/debbie.png',
        tags: ['硕士', '商科导师', '法国高商'],
        education: 'Master ESCP 欧洲高等商学院\n市场与管理\nBachelor 海南大学 旅游管理\n校园Ambassador\n五年教学经验',
        serviceType: '留学申请/商科辅导/留学咨询',
        rating: '4.96',
        serviceCount: '185',
        category: ['apply', 'subject']
      }
    ],
    filteredTeachers: []
  },

  onLoad() {
    this.filterTeachers()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.filterTeachers()
  },

  filterTeachers() {
    const filtered = this.data.teachers.filter(teacher => {
      if (Array.isArray(teacher.category)) {
        return teacher.category.includes(this.data.currentTab)
      }
      return teacher.category === this.data.currentTab
    })
    this.setData({ filteredTeachers: filtered })
  },

  onSearchTap() {
    wx.navigateTo({
      url: '/pages/teacher/search/index'
    })
  },


  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '学屿教育 - 专注海外名校留学',
      path: '/pages/teacher/index',
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '学屿教育 - 专注海外名校留学',
      query: '',
      imageUrl: '/images/logo/学屿logo.jpg' // 分享封面图，可选
    }
  },


  onTeacherTap(e) {
    const teacherId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/teacher/detail/index?id=${teacherId}`
    })
  }
}) 