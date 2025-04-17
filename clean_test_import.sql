-- 插入programs表数据
INSERT INTO public.programs (
    school_id, en_name, cn_name, duration, tuition_fee, 
    apply_requirements, created_at, updated_at, 
    language_requirements, curriculum, tags, 
    objectives, faculty, category, entry_month, interview, analysis, url
) VALUES (
    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Economics', '经济学理学硕士', 
    '1年', 49050, '- 具有良好的学士学位 - 具有良好的GMAT（600+）/GRE（Verbal和Quantitative均分156+）/SMU入学考试（Verbal/Numerical/Integrated Reasoning均分55+）成绩 *EQ方向要求定量部分成绩优秀 8月入学学费40,330新币，1月入学学费49,050新币',
    NOW(), NOW(), '无', '经济学基础 Foundations in Economics; 微观经济学分析 Microeconomics Analysis; 宏观经济学分析 Macroeconomics Analysis; 应用计量经济学 Applied Econometrics; 计量经济学分析I Econometrics Analysis I; 公共财政 Public Finance; 国际贸易 International Trade',
    '商科, 经济, 经济学院', '新加坡管理大学经济学理学硕士项目包括应用经济学（AE）、计量经济学和数量经济学（EQ），是一个提供经济学和经济数据分析深入研究的课程。该课程的特点是强大的核心课程，包括一个没有经济学方面事先培训的学生的入学途径，一个允许学生选择更注重实践、更具数据分析或更注重理论的轨道系统，以及一个开放类别，允许学生在学习轨道之外学习。该课程寻找对经济学有强烈目的感和好奇心的学生。虽然该课程为那些拥有经济学本科学位的人提供了深入学习经济学的机会，但该课程也适用于那些之前没有受过经济学培训的人。应用经济学专业的学生可以是在其公司或公共部门机构中做出或将要做出关键和战略决策的在职专业人士，他们可以从对市场和经济的良好理解中受益匪浅。计量经济学和数量经济学专业的学生可能希望学习更多关于数据分析的知识，特别关注经济、金融和社会数据。这些学生可能希望从事涉及技术经济学研究的职业，或继续攻读经济学研究生课程。', '经济学院',
    '经济', '1/8月', '真人单面',
    '无', 'https://masters.smu.edu.sg/programme/master-in-economics'
);

INSERT INTO public.programs (
    school_id, en_name, cn_name, duration, tuition_fee, 
    apply_requirements, created_at, updated_at, 
    language_requirements, curriculum, tags, 
    objectives, faculty, category, entry_month, interview, analysis, url
) VALUES (
    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc in Information Studies', '信息研究理学硕士', 
    '1年(全日制）/2年(非全日制)', 39000, '具有学士学位，包含很强的信息技术相关成分，例如工程或科学；或 具有学士学位，需要工程或相关学科背景并受过数学训练，同时具备2年相关行业经验。',
    NOW(), NOW(), '无', '无',
    '社科, 信息, 传媒与信息学院', '无', '传媒与信息学院',
    '信息', '8月', '无',
    '无', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-information-studies'
);

INSERT INTO public.programs (
    school_id, en_name, cn_name, duration, tuition_fee, 
    apply_requirements, created_at, updated_at, 
    language_requirements, curriculum, tags, 
    objectives, faculty, category, entry_month, interview, analysis, url
) VALUES (
    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA in Counselling and Guidance', '咨询与指导文学硕士', 
    '1年（全日制）', 38000, '必须在毕业后具备至少2年相关全职工作经验，相关工作经验包括在社区、学校、诊所或同等环境中为高危人群或弱势群体提供咨询 学校只会考虑具备适合辅导专业的个人特质及才能并有潜力为社会作出贡献的申请者，对获得MACG学位后成为专业咨询师有明确职业道路的申请者将优先考虑',
    NOW(), NOW(), '无', '无',
    '教育, 咨询, 教育学院', '无', '教育学院',
    '心理学', '1月/7月', '无',
    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-(counselling-and-guidance)'
);

INSERT INTO public.programs (
    school_id, en_name, cn_name, duration, tuition_fee, 
    apply_requirements, created_at, updated_at, 
    language_requirements, curriculum, tags, 
    objectives, faculty, category, entry_month, interview, analysis, url
) VALUES (
    'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0', 'Master of Technology (Design AI & Technology in Education)', '教育人工智能与技术硕士', 
    '1年（全日制）', 33800, '具有学士学位以及相关工作经验，偏好K-12教育、教师专业发展、继续教育和培训或其他相关成人教育；或 具备1年工作经验（需要提供工作证明/受雇证明）',
    NOW(), NOW(), '无', '这个令人兴奋的课程不仅面向教育工作者，还面向课程设计师、教育管理者、教育技术专业人士、教育技术专家和企业培训师。它将为学生提供专业知识，让他们能够利用人工智能和技术来创建以人为本的教育解决方案。学生将获得生成式人工智能、增强现实和快速原型设计等尖端工具的实践能力，同时掌握在不同环境中增强STEM教育的策略。',
    '科技, 教育, 人工智能', '无', '无',
    '科技与教育', '1月/8月', '无',
    '无', 'https://www.sutd.edu.sg/programme-listing/mtd-ai-and-technology-in-education/'
);

INSERT INTO public.programs (
    school_id, en_name, cn_name, duration, tuition_fee, 
    apply_requirements, created_at, updated_at, 
    language_requirements, curriculum, tags, 
    objectives, faculty, category, entry_month, interview, analysis, url
) VALUES (
    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'M.Sc. (Managerial Economics) - Executive MME Programme', '管理经济学理学硕士', 
    '1年（非全日制）', 31030, '招生特点：申请者需要将材料电邮至mailto:mme-c@ntu.edu.sg，并且必须将文件名加上姓名和申请号码后以PDF格式分开放在附件发送，否则项目可能无法打开压缩包。在录取背景方面，该课程主要面向985、财经211或海本背景的申请者，特别是商科尤其是经济类专业的学生。湖南大学的商科等合适专业、GPA84以上的申请者目前有100%的申请成功率。该课程分别开 设了7月班和11月班，其中7月班入学即为秋招，需要在6月30日确认毕业，7月中下旬发放证书和毕业典礼；11月班则是在结课时进行秋招，第三年1月毕业。',
    NOW(), NOW(), '无', '无',
    '经济, 商科, 南洋公共管理学院', '无', '南洋公共管理学院',
    '经济', '7月/11月', '无',
    '无', 'https://www.ntu.edu.sg/education/graduate-programme/ncpa-master-of-science-(managerial-economics)-(executive-mme-programme)(march-intake)--1'
); 