-- 插入programs表数据 (批次 9/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Management', '管理学理学硕士', 
                    '1.5年', 39967.0, '- 不要求具备工作经验
- 具有声誉好的院校颁发的良好本科学位（不限专业背景）
- 具有良好的GMAT（600+被视为有竞争力）/GRE/SMU入学考试（T-Score 55/80被视为有竞争力）成绩
- 需要提交2篇个人陈述，其中1篇需要对指定问题（3选1）进行回答',
                    NOW(), NOW(), '无', '管理者会计 Accounting for Managers; 企业传播 Corporate Communications; 伦理、企业价值与社会价值 Ethics, the Corporation and Social Value; 产业研究项目—理论 Industry Research Project (IRP) - Theory; 国际商务 International Business; 市场营销 Marketing; 公共部门及非营利组织管理 Public and Non-Profit Management',
                    '商科, 管理, 商学院', '新加坡管理大学管理学理学硕士课程为期12个月，采用全日制授课模式。该课程是专门为没有商科工作经验，但有本科学历并有意进入商业领域的人士开设的。课程旨在帮助学生建立稳固而扎实的管理学知识体系。新加坡管理大学管理学硕士课程提供了密集式的研究生水平的管理学教育，并通过一系列实践性课程设置，帮助学生毕业后顺利进入商业领域，拥有最广泛的职业选择机会。作为一项学术严谨的研究生课程，它锻炼学生掌握适用于不断变化的商业世界的技能，包括适应性、创造性、灵活性和批判性思维等。新加坡管理大学管理学理学硕士课程面向全球，专注于亚洲领域的独特设置，让毕业生拥有独特的优势，能够在复杂的商业环境中，抓住新趋势，顺势而为。', '商学院',
                    '管理', '1/8月', '机面（kira）/真人单面',
                    '本课程专为无商科工作经验但持有本科学历并希望进入商业领域的人士设计。该项目的目标是通过全面而深入的课程，帮助学生建立坚实的管理学知识体系。作为享有盛誉的李光前商学院的一部分，该项目的课程获得了AACSB、EQUIS和EMBA的“三皇冠”认证。该项目提供金融市场、运营及风险管理、营销跟踪和可持续发展等不同的专业方向。课程为期18个月，其中包括6个月的实习机会。



就业服务：毕业生主要就业于管理咨询公司如麦肯锡、波士顿、埃森哲等，以及世界500强企业如沃尔玛、通用、宝洁等的管理岗位。毕业生的平均起薪为5200新币/月（新币：人民币约为5：1）。在新加坡工作1-2年后，学生可以申请绿卡。

招生特点：完成在线申请表后，学生将首先被邀请完成录制的视频面试，作为评估的第一阶段。入围的候选人将被邀请与招生委员会进行第二次面试，并在必要时进行后续测试。该项目对申请的评估过程非常认真，希望能找到最优秀的人才加入该项目的学习社区。

班级概况：22fall班级整体人数在50人左右，其中中国学生占比较高，新加坡本地人较少。同学背景方面，有很多海本学生，陆本大多数是应届生与工作两年以内的学生，有不少本科是名校的学生。', 'https://masters.smu.edu.sg/programme/msc-in-management'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Professional Education (Training and Development)', '专业教育（培训与发展）文学硕士', 
                    '1年', 44145.0, '具有良好的学士学位，最好是荣誉学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具备以下领域至少1年工作经验：教师专业发展，教育领导，高等教育，继续教育及培训
具备其他相关成人教育或管理经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '专业实践探究技能 Professional Practice Inquiry Skills; 专业实践探究项目 Professional Practice Inquiry Project; 学习和教学基础 Foundations of Learning and Instruction; 教学设计模型和实践 Instructional Design Models and Practices; 促进工作中的学习和绩效改善 Facilitating Learning and Performance Improvements at Work; 学习型组织的质量保证过程 Quality Assurance Processes for Learning Organizations; 工作场所辅导 Workplace Coaching and Mentoring',
                    '社科, 教育, 教育学院', '南洋理工大学专业教育（培训与发展）文学硕士课程旨在从社会、哲学、心理学、跨国和规范的角度，提供对教育实践和制度的严格理解。促进对学习和发展、教育和培训的中心问题的理解，以及在各种专业背景下的教育领导。其具体目标是培养具有价值观和信念的专业教育工作者，并使他们具备一套独特的技能，以推动指导和指导、创新培训、评估和设计实践。', '教育学院',
                    '教育', '8月', '真人单面',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-in-professional-education-(training-and-development)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Science)', '教育学硕士（科学）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，需要科学相关学科背景，或具有相关的南洋理工大学FlexiMasters且成绩优秀 
具有理科教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年科学教育或其相关领域的相关工作经验
具有科学相关教育的实践经验，并在本科阶段学习过科学相关课程',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 科学基础与科学教育 Foundations of Science & Science Education; 科学课程改革与课程评价 Science Curriculum Change and Curriculum Evaluation; 科学即实践 Science as Practice; 科学学习中的另类观念与观念转变 Alternative Conceptions and Conceptual Change in Science Learning; 科学话语：语言、读写与论证 Science Discourse: Language, Literacy & Argumentation; 科学教育中的表现与新媒体 Representations & New Media in Science Education',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（科学）项目旨在为科学教育工作者提供理论和实践基础，用于开发课程，在学校中采用创新的教学法，并获得与科学教育相关的基本研究技能，该课程还提高了学生对科学和STEM教育各个方面的知识和理解，包括自然、历史、哲学、教学、学习、课程开发、实施、评价和评估。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(science)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Economics', '经济学硕士', 
                    '1年', 56650.0, '具有新加坡国立大学荣誉学位（二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要经济学或相关领域背景（如金融、会计、数学、统计学、物理、工程、运筹学）；或
具有学士学位或同等学历且平均成绩至少达到B或同等水平，需要经济学或相关领域背景，并成功完成由至少3名经济学硕士委员会成员进行的口头面试形式的入学考试；或
具有研究生委员会认可的其他资格和经验。
需要提供存款证明60,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '高级微观经济理论 Advanced Microeconomic Theory 核心课程; 高级宏观经济理论 Advanced Macroeconomic Theory 核心课程; 应用计量经济学 Applied Econometrics 核心课程; 定量方法 Quantitative Methods 核心课程; 微观经济学* Microeconomics* 核心必修课程; 宏观经济学* Macroeconomics* 核心必修课程; 定量与计算方法* Quantitative and Computing Methods* 核心必修课程',
                    '商科, 经济, 人文社科学院', '新加坡国立大学经济学硕士项目分为应用经济学和数量经济学两种进修方向。因此，学生在申请时需要注明自己的心仪方向以及是否愿意调剂。学生在首选的进修方向完成第一学期的学习后，如满足要求，可以调换至另一个进修方向。在新加坡国立大学经济学硕士项目中，应用经济学方向强调经济学理论在企业和决策等方面的应用，适合想成为专业经济学家、经济顾问或进入政府机构工作的学生；而数量经济学方向则重视学术研究，致力于为学生提供前沿的高级经济学理论和量化分析技能，帮助学生为攻读相关博士学位打下坚实基础。', '人文社科学院',
                    '经济', '8月', '真人单面',
                    '专业原名为应用经济学硕士，2019年8月后新名称“经济学硕士”分为AE（职业导向，应用经济学）和QE（学术导向，量化经济学），应用经济学方向是为希望将经济学应用于公司，决策者和其他利益相关者所面临的各种挑战性情况的学生而设计的。定量经济学方向则为学生提供经济学和职业方面的博士学位研究的准备。



就业服务：毕业生就业方向十分广泛，可在贸易业务、金融业务、证券投资、银行系统、保险业等领域；也可在学校、科研单位从事科研教学工作；还可以在政府相关部门从事有关投资政策制定和政策管理等工作。学校设有就业指导中心，每周推送知名企业的实习/工作岗位。

招生特点：NUS 经济项目也是一个“名校控”，偏好录取985强校和财经211背景的学生，双非和海本的学生占比不是很高。并且基本上属于先到先得，从录取学生的本科专业上看，金融、经济、会计专业的占比最高，其他像国贸，财务管理，金工，统计学专业的学生也可以申请，GPA方面大部分是高于85的。 

班级概况：22fall班级整体人数在150人左右，其中90%以上是中国学生，还有几个印度同学。同学背景方面，基本都是985+财经211+强双非，海本同学比较多。985+财经211学校主要有吉林大学、山东大学、深圳大学、暨南大学、西南财经大学、中南财经政法大学、北京大学、中国人民大学等学校，强双非主要有深圳大学、外交学院等学校。', 'https://fass.nus.edu.sg/ecs/master-of-economics/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master in Public Administration', '公共管理硕士', 
                    '1年', 49485.0, '具有良好的新加坡国立大学荣誉学位（二等及以上）或同等学历（例如，4年制学士学位，平均成绩至少达到B或同等水平）；或
具有良好的学士学位；或
具有经新加坡国立大学研究生院批准后可接受的其他资格。
申请者应具有至少5年相关工作经验并在其职业生涯中担任过中层管理职位。他们渴望担任管理职务并表现出致力于公共服务。需要熟练掌握英语书面和口语。
需要提供2篇论文以及组织架构图',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '经济分析 Economic Analysis; 政策分析 Policy Analysis; 政策管理 Public Management; 治理研究项目 Governance Study Project',
                    '社科, 公共政策与事务, 李光耀公共政策学院', '为期一年的新加坡国立大学公共管理硕士项目为学生在公共部门担任高级管理职务做好准备。它为希望研究影响国家、区域和全球政策和项目的日益复杂的问题的专业人士提供了密集的跨学科学习课程。新加坡国立大学公共管理硕士项目旨在为组织以及政府机构和机构的未来领导者提供必要的技能，以承担公共部门的领导职责。在该计划的过程中，参与者将接触到研究人员、公共管理人员、领导者以及政策从业者使用的有效技能和知识。申请人未来有能力发展他们的国内和国际人际关系网络，并提高他们的领导和管理能力。', '李光耀公共政策学院',
                    '公共政策与事务', '8月', '无',
                    '无', 'https://lkyspp.nus.edu.sg/graduate-programmes/master-in-public-administration-mpa'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MDes Integrated Design', '集成设计设计学硕士', 
                    '1年', 54500.0, '具有认可机构颁发的学士学位（达到优异或二等荣誉学位），需要相关设计学科或与申请学习专业相关的领域背景
学校也可能考虑具有其他资格和成就并且被认为已为学习该课程做好适当准备的申请者
需要提交作品集和短视频',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '综合设计工作室1 Integrated Design Studio 1; 设计研究方法 Design Research Methods; 设计中的新兴主题 Emerging Topics in Design; 先进设计平台1 Advanced Design Platform 1; 综合设计工作室2 Integrated Design Studio 2; 设计策略与领导力 Design Strategies & Leadership; 协同设计 Collaborative Design',
                    '社科, 其他社科, 工程学院', '无', '工程学院',
                    '其他社科', '8月', '无',
                    '无', 'https://cde.nus.edu.sg/did/mdes/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0', 'Master of Architecture', '建筑硕士', 
                    '1年', 52078.0, '至少拥有经认可大学颁发的建筑学学士学位，需要证明相关工作经验及其持续时间，以满足建筑师委员会关于攻读认可硕士课程的要求具有使用 Python、JavaScript、C++、C# 等现代语言进行编程的经验，拥有Rhino 3D、Grasshopper 和数字制造的一些知识需要相关学术和/或行业作品集、奖项、出版物等',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '结构化实习 Structured Internship; 专业实践II Professional Practice II; 专业实践I Professional Practice I; 论文 Thesis; 论文准备 Thesis Preparation; 可持续设计选项工作室 3 Sustainable Design Option Studio 3; 迈向碳中和建筑和城市设计 Toward Carbon-Neutral Architecture and Urban Design',
                    '社科, 建筑, 硕士项目', '新加坡科技设计大学建筑硕士项目提供面向未来的专业学位课程，强调可持续发展的设计和研究以及建筑行业的数字化转型。该项目通过强调论文项目中的独立批判性思维，并与教师在前沿研究方面的密切合作来支持，从而开启建筑领域领导者的职业生涯。
新加坡科技设计大学建筑硕士项目的课程强调选择的多样性和自我决定的机会。学生可以从各种选修课、设计工作室和论文顾问中进行选择，确定一条符合他们个人优势和热情的道路。严格的专业实践和研究准备研讨会为课程提供了共享的基础。国际客座讲座、评论和大师班为项目中的共享讨论提供了更多机会，让我们的学生能够听到不同的声音并更广泛地分享他们的工作和想法。', '硕士项目',
                    '建筑', '9月', '无',
                    '无', 'https://www.sutd.edu.sg/programme-listing/master-of-architecture-programme/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Sustainable Healthcare', '可持续医疗保健理学硕士', 
                    '1年', 58860.0, '具有学士学位，需要医疗保健相关领域（如医学、护理学、生物医学科学、卫生政策、公共卫生、联合保健学科）以及公共政策、社会科学、可持续发展和环境科学背景具有上述以外学历的候选人可根据个人具体情况予以考虑，但须经项目招生委员会批准',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '可持续医疗保健实践原理 Principles of Sustainable Healthcare Practices 核心课程; 净零排放分析基础 Foundations of Net Zero Analytics 核心课程; 气候、环境与健康 Climate, Environment & Health 核心课程; 实现并推行净零排放医疗保健 Delivering and Implementing Net Zero Healthcare 核心课程; 可持续医疗保健项目 I Sustainable Healthcare Implementation Project I 核心课程; 可持续医疗保健项目 II Sustainable Healthcare Implementation Project II 核心课程; 健康与绿色建筑环境 Well & Green Built Environment 选修课程',
                    '社科, 公共卫生, 杨潞龄医学院', '新加坡国立大学可持续医疗保健理学硕士项目为世界首创，旨在培养学生全面了解全球环境系统对人类健康的影响，打下可持续医疗保健实践原理的坚实基础，并掌握医疗保健领域碳核算等分析技能。学生将修读一系列本专业及跨学科的课程模块，并可根据自己的学习需求和职业目标灵活定制。', '杨潞龄医学院',
                    '公共卫生', '8月', '无',
                    '无', 'https://masters.nus.edu.sg/programmes/msc-in-sustainable-healthcare'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Teaching Chinese as an International Language', '对外汉语教学文学硕士', 
                    '1年', 48832.0, '申请者需要具有中文授课本科颁发的受认可的学士学位，或具备专门从事汉语教学的研究生教师教育资格',
                    NOW(), NOW(), '无', '汉语语码教学与应用 Language Code: Theory and Practice; 汉语词汇与语法教学 Vocabulary & Grammar: Theory and Practice; 汉英对比及其在教学中的应用 Chinese-English Contrastive Analysis & Its Application; 汉语口语技能教学 Teaching of Listening & Speaking Skills in TCIL; 汉语书面语技能教学 Teaching of Reading & Writing Skills in TCIL; 信息科技在国际汉语教学中的应用 Application of Information Technology in TCIL; 汉语测试与评估 Language Testing & Assessment in TCIL',
                    '社科, 教育, 教育学院', '南洋理工大学对外汉语教学文学硕士由新加坡南洋理工大学国立教育学院亚洲语言文化学部推出。该硕士课程顺应中国经济的腾飞，全球汉语热急剧升温，继而带动了国际汉语教师的强大需求，专为对国际汉语教学理论和实践具有浓厚兴趣，汉语为第一语，英语为第二语的学习者精心打造。外汉语教学硕士旨在培养中英双语的教育工作者，以便在汉语不是主要语言的国家教授汉语。该硕士课程主要针对希望专门从事对外汉语/第二语言/国际语言教学理论和实践的教育工作者（CIL学习者）。', '教育学院',
                    '教育', '1月', '无',
                    '只有春季入学。由新加坡南洋理工大学国立教育学院亚洲语言文化学部开设。



就业服务：毕业生有在新加坡本地就业，主要是在新加坡当地的国际学校、华文补习中心就业。另一类是回国内就业，主要集中在国际学校、大学的国际交流学院、公立学校、中外合办大学以及在线教育行业。

招生特点：语言要求较友好。除了雅思、托福外，可以用六级和专四申请。对申请者院校背景友好，双非学生也可申请。专业方面还是对口的对外汉语教育专业为主，也有少数其他语言专业。偏爱有教育经验的申请者。', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-(teaching-chinese-as-an-international-language)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (General)', '法学硕士', 
                    '1年', 37100.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '新加坡合同普通法 Singapore Common Law of Contract; 中国的仲裁与争议解决 Arbitration and Dispute Resolution in China; 中国内地及香港特区的资本市场法 Capital Markets Law in Mainland China and HKSAR; 高级合同法 Advanced Contract Law; 生物技术法 Biotechnology Law; 国际仲裁法律与实践的前沿问题 Advanced Issues in the Law & Practice of Int''l Arbitration; 国际仲裁高级实践 Advanced Practicum in International Arbitration',
                    '社科, 法律, 法学院', '新加坡国立大学法学硕士项目提供最大的课程选择灵活性，以满足学生的个人兴趣和爱好。学生可以自由选择感兴趣的特定领域。课程涵盖亚洲法律研究、企业与金融服务法、知识产权与技术法、国际与比较法、国际仲裁与争议解决、海商法、私法、法律与社会、研究与技能等多个学科门类。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '新加坡国立大学法学硕士项目可以根据学生的个人喜好和兴趣，在课程选择上提供最大的灵活性。学生可以不受限制地从事他们感兴趣的特定领域。课程涵盖亚洲法律研究、企业与金融服务法、知识产权与技术法、国际与比较法、国际仲裁与争议解决、海商法、私法、法律与社会、研究与技能等多个学科门类。细分方向为通识方向，亚洲法律研究，公司与金融服务法，知识产权与技术法，国际法与比较法，海商法，国际商法，国际仲裁与争议解决。', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
