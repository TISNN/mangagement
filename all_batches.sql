-- 插入programs表数据 (批次 1/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Economics', '经济学理学硕士', 
                    '1年', 49050.0, '- 具有良好的学士学位
- 具有良好的GMAT（600+）/GRE（Verbal和Quantitative均分156+）/SMU入学考试（Verbal/Numerical/Integrated Reasoning均分55+）成绩
*EQ方向要求定量部分成绩优秀
8月入学学费40,330新币，1月入学学费49,050新币',
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
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Joint MSc Quantitative Finance (NUS-SJTU)', '定量金融理学硕士（新加坡国立大学-上海交通大学联合开设）', 
                    '2年', 130000.0, '申请者必须具有荣誉学位（或4年制学士学位），需要包含强大定量培训的学科背景，如数学、统计学、经济学、金融学、计算机科学、工程学、物理科学，或具有强大数学背景的同等学位
需要提交存款证明45,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '金融衍生工具的数学模型 Mathematical Models of Financial Derivatives; 金融模型与计算 Financial Modelling and Computation; 结构化产品 Structured Products; 风险管理 Risk Management; 金融时间序列：理论与计算 Financial Time Series: Theory and Computation; 数量金融专题一 Topics in Quantitative Finance I; 数量金融专题二 Topics in Quantitative Finance II',
                    '商科, 金工金数, 理学院', '新加坡国立大学与上海交通大学合作办学的定量金融理学硕士（新加坡国立大学-上海交通大学联合开设）课程旨在培养具有国际视野和较高外语水平，对量化金融有深入了解，并能解决中国金融行业实际问题的优秀人才。教学主要在上海交通大学校园内进行， 新加坡国立大学颁发量化金融理学硕士学位，上海交通大学颁发学习证明。', '理学院',
                    '金工金数', '8月', '真人单面',
                    '新加坡国立大学与上海交通大学合作办学的定量金融理学硕士课程旨在培养具有国际视野和较高外语水平，对量化金融有深入了解，并能解决中国金融行业实际问题的优秀人才。教学主要在上海交通大学校园内进行， 新加坡国立大学颁发量化金融理学硕士学位，上海交通大学颁发学习证明。



就业服务：校内的资源跟NUS的QF没什么差异。学校有专门的实习和工作平台NUS Career+，上面有很多国内外的公司可以直接投递，学院也会定期推送合作公司的实习机会，还有职业发展中心的老师可以线上预约进行专门的一对一咨询包括职业规划、简历修改等帮助。上海的实习机会也比较多，只要想做实习的，都能找到实习机会，职业方面大多集中在券商、保险、基金之类的传统金融机构。工作既有量化相关的也有行研的岗位。

招生特点：项目规模为30人，大部分是应届本科生，有个别是在职工作的，背景大多是985和中上游211，也有个别海本或合办院校这类学校的同学。本科专业以金融工程、金融数学、金融学、软件工程这类比较多数理和编程课程的为主，总的来说就是偏好数学和编程扎实，本科学校211以上或者具有海外背景的学生。', 'https://www.math.nus.edu.sg/pg/nus-sjtu-mqf/prospective-students/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Educational Assessment)', '教育学硕士（教育评估）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 评估原则与方法 Assessment Principles and Methods; 评估的范例与实践 Paradigms and Practices of Assessment; 项目反应理论 Item Response Theory; 心理构念的理论与评估 Theory and Assessment of Psychological Constructs; 项目评估 Programme Evaluation; 21世纪能力评估与发展 Assessment and Development of 21st Century Competencies',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（教育评估）项目旨在提供对评估与评价理论与实践的深入知识和理解，讨论的主题包括古典和现代测试理论的概念、态度测量、评估学校课程的方法和评估技术的使用，通过该课程，教师和其他教育专业人员有能力在教育学习的质量评估和评价方面发挥领导作用。毕业生可以在学校、教育部和其他机构担任资源人员，为所有与认知、情感和态度评估有关的问题提供专业知识和技术支持。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(educational-assessment)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Information Studies', '信息研究理学硕士', 
                    '1年', 41900.0, '具有良好的学士学位，不限专业背景
具备良好的沟通能力（英语书面和口语）
具备信息相关领域工作经验
对信息研究领域充满热情和兴趣
达到二等二/荣誉（优等）学位及以上水平或同等学历
实习经验不计入工作经验，建议申请者具备至少1年全职工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '图书馆科学方向 Library Science Track; 人类信息行为研究方法 Research Methods in Human Information Behaviour; 信息表示与检索 Information Representation & Retrieval; 信息组织 Information Organization; 信息管理 Information Management; 信息行业：文化、价值观、道德观 Information Professions: Heritage, Values and Ethics; 组织技术管理 Management of Technologies in Organisations',
                    '商科, 信息系统, 传媒与信息学院', '南洋理工大学信息研究理学硕士学位课程作为一门跨学科项目，课程注重理论与实践的相结合，以满足各行各业对专业信息技术人才日益增长的需求。该课程旨在丰富学生的专业知识，提高其充分整合利用信息资源，促进企业发展和创新的能力。南洋理工大学信息研究理学硕士学位课程同时为在图书馆或信息技术中心任职的工作人员提升信息管理的能力。南洋理工大学信息研究理学硕士学位课程为学生提供了两个具体专业研究方向的选择：图书馆科学方向：注重为学生提供图书馆信息管理工作中必须的专业知识。信息分析学方向：注重通过使用一定的方法、工具或框架来管理、分析、深入挖掘传统信息及数字信息（如：社会化数据、移动数据、云数据、大数据等等）；通过南洋理工大学信息研究理学硕士学位课程的学习，学生的领导力和分析能力都将得到提升，同时能够妥善地处理不同环境中的信息资源，学会辨识组织的信息需求与缺口；学会捕捉、检索、整合、分类、分析各种信息以便使用；学会构建与管理信息系统。', '传媒与信息学院',
                    '信息系统', '8月', '无',
                    '本项目旨在将理论与实践相结合，以满足组织对熟练信息专业人员日益增长的需求。课程为学生提供了整个信息研究领域的知识和技能，包括图书馆学和信息分析。在图书馆学方面，学生将学习到适用于任何类型的图书馆或信息管理工作的基本知识，如获取、搜索、组织、分类、分析和使用信息，并建立和管理信息组织。在信息分析方面，学生将学习使用方法、工具和框架来管理、分析传统以及数字信息资产，如社交、移动、云和大数据，并从中获得洞察力。毕业生将具备领导技能和分析能力，能够将信息置于不同的组织环境中，以便他们能够识别组织的信息需求和差距，捕获、搜索、组织、分类、分析和使用信息，以及建立和管理信息组织。 就业服务：本项目的毕业生在就业市场上具有广泛的就业前景。他们可以在各个行业中担任内容分析师、信息分析师、信息开发人员等职位，负责分析、处理和利用信息来支持组织决策和发展。同时，他们也可以在系统开发、IT架构、网络分析、网页设计等领域发挥专长，担任系统开发人员、高级IT架构师、网络分析师、网页设计师、企业门户开发人员、技术经理等职位。招生特点：任何学科的学士学位都可以申请，有信息相关领域的工作经验，不要求GRE或者GMAT。建议申请者至少拥有一年的全职工作经验，实习不计入工作经验。提交个人陈述和推荐信不是强制性的，但是，如果这对申请有帮助，申请人可以提交这些内容。往年的录取中也有小部分没有一年的全职工作经验，只有实习经历的应届生被录取的。想转专业的同学可以考虑这个项目，有无计算机背景的申请者被录取。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-information-studies'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree MBA - MPA', '工商管理硕士 - 公共管理硕士双学位', 
                    '2年', 74338.0, '具有良好的本科学位 具备至少2到5年专业经验，申请者应在其职业生涯中达到中层管理职位，并渴望担任管理职务，表现出对公共服务的投入，必须熟练掌握英语书面和口语 需要良好的GMAT/GRE成绩 有兴趣申请新加坡国立大学MBA-MPA双学位课程的申请者必须同时满足新加坡国立大学MBA和MPA课程的入学要求',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '经济分析 Economic Analysis; 政策分析 Policy Analysis; 公共管理 Public Management; 治理研究项目 Governance Study Project; 营销策略 Marketing Strategy; 管理运营与分析 Managerial Operations & Analytics; 有影响力的领导 Leading with Impact',
                    '商科, 工商管理, 商学院', '新加坡国立大学工商管理硕士 - 公共管理硕士双学位课程由商学院与李光耀公共政策学院合作提供，为有兴趣在政府和公共部门企业开展职业的未来领导者提供两个独特的课程，该课程针对的是有经验的公共部门专业人士，他们渴望将自己的职业生涯提升到一个新的水平。', '商学院',
                    '工商管理', '8月', '无',
                    '无', 'https://www.nus.edu.sg'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Applied Economics', '应用经济学理学硕士', 
                    '1年', 43700.0, '具有良好的经济学荣誉学士学位，或具有其他学科良好荣誉学士学位以及很强的定量背景
有相关工作经验者优先考虑
GRE成绩合格者优先考虑',
                    NOW(), NOW(), '雅思: 6.5; 托福: 85', '经济增长与发展 Economic Growth & Development 选修课程; 中国与国际政治经济学 China & the International Political Economy 选修课程; 实验经济学 Experimental Economics 选修课程; 高级国际贸易 Advanced International Trade 选修课程; 住房经济学 Housing Economics 选修课程; 金融计量经济学 Financial Econometrics 选修课程; 财务分析经济学 Economics of Financial Analysis 选修课程',
                    '商科, 经济, 社会科学学院', '新加坡南洋理工应用经济学理学硕士项目旨在为学生提供严格的研究生阶段专业知识，以便在未来进行私人和公共部门应用经济学所涉及的任何领域的课题研究。该项目的特色在于重点培养定量研究导向的经济学研究学者和具有深厚理论功底的经济分析师。新加坡南洋理工大学应用经济学理学硕士课程涵盖计量经济学、应用金融计量经济学、成本效益分析、项目评估和金融建模等专业知识，旨在使学生掌握必要的经济学计量分析技能，尤其是在经济政策分析相关领域。这些专业知识和技能有助于学生进行准确的经济分析，从而更好地了解社会政策和投资组合管理。新加坡南洋理工大学应用经济学理学硕士课程的毕业生可以在政府公共服务部门、投资银行、房地产经纪和经济咨询事务所等行业就业。', '社会科学学院',
                    '经济', '8/11月', '无',
                    'AE项目隶属于南洋理工大学社会科学学院，采用全英文教学，专注于培养具有强大理论洞察力的定量研究人员和分析师。通过利用计量经济学、金融应用计量经济学、成本效益分析、项目评估和金融建模等，为学生提供在经济政策分析方面的必要技能。项目开设了7月和11月入学，可根据实际情况进行申请。



就业服务：就业机会包括公共服务、投资银行、经纪行和咨询公司。走金融、互联网的比较多。受大环境影响，也有不少同学转向国企、银行。从学术路径上看，有不少同学申请博士，如果选择继续深造，许多教授都会招募同学进入自己的研究项目中，为将来的深造提供经历。如果希望毕业之后就业，学校有各种求职会（线上或是线下形式），知名的企业也会为同学们提供招聘宣讲会或是实习机会。学校邮箱里会发送大量这类通知，

招生特点：和NUS的应用经济学相比，这个专业的数理要求更高，重视定量分析和理论研究，录取的学生大部分都是985，211更多来自财经类院校，双非背景的学生极少。从录取学生的本科专业上看，金融、经济专业的占比最高，另外，学生有一定工作经验可以提高升学率。

班级概况：22fall班级整体人数在120人左右，其中大部分是中国学生，还有少数新加坡和印度学生。同学背景方面，海本学生大概占到一半，陆本学生主要来自复旦大学、上海财经大学、中南财经政法大学、山东大学等学校。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-applied-economics'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Building Performance and Sustainability', '建筑性能与可持续性理学硕士', 
                    '1年', 49050.0, '具有荣誉学士学位，需要相关学科背景，偏好具备相关实践经验的申请者
具有（非荣誉）学士学位的申请者需要具备至少3年相关工作经验',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '房屋性能和一体化总论 Total Building Performance and Integration; 气候变化和建成环境 Climate Change and the Built Environment; 绿色建筑一体化和评估 Green Building Integration and Evaluation Studio; 热工性能和室内空气质量性能 Thermal and Indoor Air Quality Performance; 采光性能和声学性能 Lighting and Acoustics Performance; 房屋结构系统和空间性能 Structural Systems and Spatial Performance; 建筑节能与可再生能源的应用 Energy Efficiency and Renewable Energy in Buildings',
                    '社科, 建筑, 工程学院', '新加坡国立大学建筑性能与可持续性理学硕士学位课程是多学科融合的项目，旨在为具有不同学科背景的，从事建筑系统与建筑物设施的设计、建造、调试、运行以及维护的人士提供一个深入理解房屋性能和持久性领域的专业知识和参与建筑性能与可持续性领域广泛实践的机会。21世纪以来，人类正面临着气候变化带来的不可逆影响，承受着潜在的不良后果，包括现在还有未来。这一现象要求该领域的专业工作者从单纯的向居住者提供舒适、健康的室内环境转向设计出具有可持续性的建筑。全球热带地区的快速城市化进程可能会影响超过二亿人口的生活，因此，建筑性能与可持续性理学硕士学位课程紧紧围绕热带地区建筑行业面临的挑战与难题，同样地，它还关注世界其他地区与气候和文化有关的类似基本问题。', '工程学院',
                    '建筑', '8月', '真人单面',
                    '无', 'https://cde.nus.edu.sg/dbe/graduate/msc-building-performance-and-sustainability/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Medical Pharmacology', '医学药理学理学硕士', 
                    '1年', 65400.0, '- 具有医学学位，如M.B.B.S.，或具有相关学士学位（偏好荣誉学位），需要生命科学（如生物化学、生物学、药理学）、护理学、生物工程、生物信息学、计算生物学、健康科学或相关学科背景
- 具备其他资格和相关行业经验的申请者将根据具体情况予以考虑，但需要经过项目委员会批准
入围申请者需要参加面试
需要提交存款证明（覆盖学杂费和18,000新币生活费）',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '顶石项目（临床方向） Capstone Project (Clinical) 核心课程; 科研有效沟通 Effective Scientific Communication 核心课程; 医学研究伦理与规范 Ethics & Good Practice in Medicinal Research 核心课程; 临床药理学 I Clinical Pharmacology I 核心课程; 临床药理学 II Clinical Pharmacology II 核心课程; 应用生物医学领导力 Leadership in Applied Biomedicine 核心课程; 高级生物统计学研究 Advanced Biostatistics for Research 核心课程',
                    '社科, 药学, 杨潞龄医学院', '新加坡国立大学医学药理学理学硕士项目由行业专家提供设计意见，旨在培养药理学、毒理学、药品监管科学及药理学教育等领域的卓越人才，致力于推动安全高效的药物研发，最终造福广大病患。项目特色将严谨的学术训练与丰富的实践体验密切结合，学生可根据自身职业发展规划，选择临床药理学、转化药理学或药理学教育作为专业方向。凭借扎实的专业知识与过硬的实践能力，毕业生在学术界、医疗机构、合同研究组织（CRO）、教育单位及制药产业等领域均具备卓越的竞争优势。', '杨潞龄医学院',
                    '药学', '8月', '无',
                    '无', 'https://medicine.nus.edu.sg/graduatestudies/education/msc-in-medical-pharmacology/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Creative Writing and Publishing', '创意写作与出版文学硕士', 
                    '1年', 40330.0, '具有良好的学士学位或同等学历
不需要具备先前的创意写作或出版课程工作或培训经验',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '创意写作 Creative Writing; 当代出版学 Contemporary Publishing; 叙述文体 Forms of Narrative; 发声 Voice; 地点与时间 Place and Time; 文学创作 Literary Production; 书写东南亚 Writing South East Asia',
                    '社科, 文化, 人文学院', '作为亚洲英语文化的中心，新加坡的社会和公民影响力和吸引力是巨大的。在培养和塑造下一代新加坡作家方面，南洋理工大学在过去十年中一直占据主导地位。从新加坡最伟大的诗人郑宝贞到国际知名的年轻小说家张志玲和李蔻，几乎没有哪位受人尊敬的新加坡作家与南洋理工大学没有关系。南洋理工大学创意写作与出版文学硕士项目旨在将这种影响力扩展到出版商——这支队伍不仅将在未来几十年塑造新加坡文学的公民吸引力，而且将在亚洲各地展开，并作为新加坡在其他文学和出版界的代表。', '人文学院',
                    '文化', '8月', '无',
                    '无', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-arts-in-creative-writing-and-publishing'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree MSc Management and Master in International Management (NUS-CEMS)', '管理学硕士和国际管理硕士双学位（新加坡国立大学-CEMS）', 
                    '1.5年', 42874.0, '具有良好的本科学位，需要商业或商业相关学科（CEMS要求申请者具有管理学或经济学或相关领域的学士学位，或在开课时至少成功完成全日制商科教育不低于60学分）
必须精通至少一门其他CEMS语言
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费64,310新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '业务分析与估值 BUSINESS ANALYSIS AND VALUATION; 企业融资 CORPORATE FINANCE; 家族企业的财务管理 FINANCIAL MANAGEMENT OF FAMILY BUSINESS; 金融科技管理 FINTECH MANAGEMENT; 如何衡量慈善事业和影响力投资的成功 MEASURING SUCCESS IN PHILANTHROPY AND IMPACT INVESTING; 金融专题：私募股权 SELECTED TOPICS IN FINANCE: PRIVATE EQUITY; 估值与并购 VALUATION AND MERGERS & ACQUISITION',
                    '商科, 管理, 商学院', '新加坡国立大学管理学硕士和国际管理硕士双学位项目并被广泛认为是国际职业生涯的最佳跳板之一。CEMS 毕业生的国际流动性在我们至少 100 个国家的 15,000 多名校友中得到了充分体现，他们目前在超过 75 个国家工作。其中超过 45% 的人在国外生活和工作。

在 CEMS MIM 学年期间，您将在两所领先的 CEMS 合作大学享受两个国际交换学期，完成全球管理方面的 CEMS 课程、集体研讨会和技能研讨会，并完成国际实习。通过 CEMS MIM，您将体验并加入一群就读于世界各地领先商学院的高素质、具有国际视野、多语言的学生。', '商学院',
                    '管理', '1月', '真人单面',
                    '无', 'https://mim.nus.edu.sg/cems-mim/'
                );
-- 插入programs表数据 (批次 10/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Entrepreneurship and Innovation', '创业与创新理学硕士', 
                    '1年', 59950.0, '- 具有良好的本科学位（不限专业背景）
- 具备1-5年工作经验，其他申请者根据其动机和先前经验也会被考虑
- 适合对商业和社会新价值创造充满热情的申请者
- 具有良好的GMAT/GRE/SMU入学考试成绩',
                    NOW(), NOW(), '无', '市场营销管理 Marketing Management; 金融 Finance; 机会识别与构思管理 Opportunity Recognition & Ideation Management; 创新工作中的组织意识 Organisational Aspects of Making Innovation Work; 创新发展 Innovation Development; 会计 Accounting; 战略管理 Strategic Management',
                    '商科, 创业与创新, 商学院', '新加坡管理大学创业与创新理学硕士课程提供相关的课程和创新的教学方法，适用于新加坡的中心以及满足该地区对新企业创造和创新的需求。该课程通过世界一流的教师提供跨学科、实用的创新和创业教育，定期与思想领先的实践者接触，在全球领先的商学院留学，以及进行实践创新项目。该课程旨在吸引、挑战和培养亚洲下一代创新和创业领袖。', '商学院',
                    '创业与创新', '8月', '无',
                    '无', 'https://masters.smu.edu.sg/programme/master-entrepreneurship-innovation'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Supply Chain Engineering', '供应链工程理学硕士', 
                    '1年', 51503.0, '具有良好的学士学位，需要机械或工业工程或相关学科背景并受过数学和生产方面的培训；或
具有学士学位，需要工程或相关学科背景并受过数学训练，同时具备2年相关行业经验。
相关学科包括但不限于南洋理工大学工程学院提供的学士学位课程，商科毕业生如果具备相关专业和/或相关经验也会被考虑；相关经验需要雇主出具证明',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '物流分析定量方法 Quantitative Methods for Logistics Analysis; 企业资源规划 Corporate Resource Planning; 供应链分析与设计 Supply Chain Analysis and Design; 制造与服务运营管理 Manufacturing and Service Operations Management; 采购与供应商开发 Procurement & Supplier Development; 物流功能管理 Management of Logistics Functions; 质量工程 Quality Engineering',
                    '商科, 供应链管理, 机械与航空航天工程学院', '供应行业是推动新加坡发展成为全球供应链关键枢纽的关键服务行业之一。随着全球化推动跨国公司在该地区扩张，新加坡公司所处的供应链变得更加复杂，对设计、分析和管理供应链的技能要求也更高。南洋理工大学供应链工程理学硕士课程旨在通过供应链工程综合和全面的课程解决制造业和服务业的需求，使毕业生具备正确的技能来管理端到端订单履行，包括采购和库存管理。该课程还提供候选人对物流功能的认识，如配送、仓储和运输，在促进供应链中发挥的作用。', '机械与航空航天工程学院',
                    '供应链管理', '8月', '无',
                    '旨在通过一个更加整合与综合的供应链工程项目来满足制造和服务业在供应链管理方面的需求，并为毕业生提供管理端到端订单履行的技能，包括采购和库存管理等。该项目还可以让学生了解物流功能（如配送、仓储和运输）在促进供应链方面发挥的作用。就业服务：毕业生可以从事的行业包括但不限于物流企业、港口、海关、货运公司和交通运输等等。就业市场可辐射到整个东南亚地区，东南亚地区向来是新加坡创业企业海外扩张的首选地。也可以选择读博。招生特点：22届班级人数约为35人，包括part-time和full-time学生，其中70%是中国人。专业背景包括交通运输、机械工程、工业工程、工商管理、物流管理、物流工程和会计学等（工科、商科和管理学）。', 'https://www.ntu.edu.sg/mae/admissions/programmes/graduate-programmes/detail/master-of-science-in-supply-chain-logistics'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Financial Engineering', '金融工程理学硕士', 
                    '1年', 63220.0, '具有良好的学士学位，需要很强的数学、统计学或计算机编程背景，或者具有应用数学、应用科学、统计学、计算机科学、工程学、经济学或其他量化领域的良好本科学位，学校也会考虑其他学科的申请者
具备良好的GMAT/GRE成绩
有金融行业工作经验者优先考虑（不强制要求）',
                    NOW(), NOW(), '雅思: 7; 托福: 105', '微积分和线性代数 Calculus & Linear Algebra; 资产定价随机模型 Stochastic Modeling in Asset Pricing; 金融随机运算 Stochastic Calculus for Finance; 概率与统计学 Probability & Statistics; 线性金融模型 Linear Financial Models; 公司金融学 Corporate Finance; 资产定价理论 Asset Pricing Theory',
                    '商科, 金工金数, 商学院', '新加坡南洋理工大学金融工程理学硕士课程是由南洋商学院与数理科学学院联合授课，课程内容涵盖了计算机科学、数学、金融等领域内的前沿广泛的专业知识，旨在加深学生对金融高新技术的认识。
新加坡南洋理工大学金融工程理学硕士课程旨在提高学生的逻辑思维能力，促使学生掌握金融高新技术，并能将其应用于实践中。而且，新加坡南洋理工大学金融工程理学硕士课程与美国卡耐基梅隆大学建立合作，致力于把东西方的金融实践知识生动地带入课堂教学中。
新加坡南洋理工大学金融工程理学硕士课程的毕业生大多任职于金融高新技术行业，从事风险管理、定量资产管理、产品结构分析、定量交易、定量研究、金融信息科技等工作。', '商学院',
                    '金工金数', '7月', '真人单面',
                    '商学院与物理数学学院合作下的项目，主要教授学生金融、计算机与数学这三个方面的知识。面向本科是应用数学、应用科学、统计、计算机科学、工程、经济学和其他定量相关专业的申请者。



就业服务：南洋商学院的研究生职业发展办公室会提供丰富的职业发展资源，例如各类讲座或培训，包括但不限于简历修改、模拟面试、行业洞见或社交礼仪等主题。有时也会邀请往届校友为同学们内推，或分享职业发展经验。大部分毕业生在金融服务行业工作，同时NTU的行业合作伙伴包括一流的金融机构、科技公司和跨国公司，其中包括新加坡发展银行（DBS）、渣打银行、摩根大通公司和高盛。毕业生工作领域主要围绕风险管理、量化资产管理、产品结构、量化交易、量化研究、金融信息技术以及其他高科技金融领域。雇主包括投资银行、商业银行、金融顾问、金融和数据库软件供应商、金融监管机构、跨国公司、交易所和能源公司的财富和财务部门。

招生特点：根据以往录取情况，看重本科学校，大多数中国学生来自985和211院校，偏好工作经验，平均工作年龄为2年，GMAT均分708，GRE均分320。 

班级概况：22fall班级整体人数在45人左右，中国学生近30人。学生背景方面，基本是985+211，有清华大学、复旦大学的学生，还包括一些海本学生。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-financial-engineering2'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master in Public Administration and Management', '高级公共行政与管理硕士', 
                    '1年', 44950.0, '- 四年制大学本科毕业，成绩优良，获得学士学位
- 有五年以上相关工作经验
- 具备同等学历和经验的优秀申请者，需报研究生院特批
需要提供当前工作简介',
                    NOW(), NOW(), '无', '公共部门应用经济学; 公共管理的理论和实践; 比较公共管理和公共政策：新加坡和亚洲的实例; 经济与商业环境; 公共财政和预算; 政策分析和项目评估',
                    '社科, 公共政策与事务, 李光耀公共政策学院', '随着中国经济的飞速发展以及与世界的快速接轨，政府官员及企事业单位的高级管理人员对提升公共治理能力的需求日益增加。为了满足中国及华人地区广大中高层领导、管理人才的学习需要，新加坡国立大学李光耀公共政策学院创办了以中文授课的高级公共行政与管理硕士（MPAM）学位课程，培养公共行政及国有企业管理的高级人才，使他们无论在各级政府中、国际舞台上、或者是私人企业界，都能胜任重要的管理职位。毕业生将获颁新加坡国立大学公共行政与管理硕士学位。高级公共行政于管理硕士项目于2019年获得由新加坡总理李显龙阁下颁发的通商中国企业奖。', '李光耀公共政策学院',
                    '公共政策与事务', '8月', '无',
                    '无', 'https://lkyspp.nus.edu.sg/graduate-programmes/mpam'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Accounting', '会计学理学硕士', 
                    '1年', 71940.0, '具有良好的本科学位，不限专业背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
不要求具备工作经验
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费71,940新币，生活费预算至少19,500新币/年）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '应用数据科学与可视化 Applied Data Science & Visualisation; 企业评估模型 Corporate Valuation Models; 管理计划与控制 Managerial Planning and Control; 编制财务报表 Preparing Financial Statements; 企业会计与报告 Corporate Accounting and Reporting; 分析与数据管理 Analytics & Data Management; 银行合规与风险管理 Bank Compliance and Risk Management',
                    '商科, 会计, 商学院', '新加坡国立大学会计学理学硕士课程旨在帮助应届毕业生适应会计领域的文化和技术变革。随着技术的日益普及，会计公司现在需要招募具有数据分析技能和会计知识相结合的员工。新加坡国立大学会计学理学硕士课程将为学生提供必要的技能，人际网络和知识，以使其在行业中具有竞争力。', '商学院',
                    '会计', '8月', '机面（kira）/真人单面',
                    '新加坡国立大学的会计学硕士项目是2021年新开设的项目，区别于传统的会计课程，NUS的会计项目更加注重将会计知识和数据分析技能相结合，以适应当下会计行业的技术转变。



就业服务：依托NUS商学院的雄厚实力，NUS会计硕士项目虽然开设时间不长，但依然能够提供丰富的就业资源和强大的校友网络。该项目开学初就会帮助学生修改简历、创建领英账户、安排职业规划导师，并且学校就业中心也会定期向学生推送各种招聘信息和讲座。

招生特点：NUS会计在21fall第一届招了四十多个学生，主要集中在985/211/双一流及海本院校；不限制专业背景，但对量化类学科有一定要求，看重数量统计和计算机编程知识。此外，该项目非常看重学生的相关实习实践经历，录取学生都有多份相关实习或工作。该项目申请过程中共有两轮面试，一轮AI面试，一轮视频真人面试。', 'https://mscacc.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Special Education)', '教育学硕士（特殊教育）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀 
具有教师资格（如新加坡国立教育学院颁发的特殊教育文凭、教育研究生文凭）以及至少1年残疾人士教学工作经验，或具备至少3年残疾人士教学或支持工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 特殊教育的问题与趋势 Issues and Trends in Special Education; 人类发展 Human Development; 学习障碍 Learning Disabilities; 早期干预 Early Intervention; 课程设计与开发 Curriculum Design and Development; 特殊教育中的循证实践 Evidence-based Practices in Special Education',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（特殊教育）项目旨在通过提供基于知识的理论、实践和研究来提高特殊教育的专业能力，该课程使学生能够建立教育理论和实践的联系，以开发满足学生多样化需求的课程和教学法。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(special-education)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Psychology (Clinical)', '心理学硕士（临床）', 
                    '2年', 41925.0, '一、主要入学条件 
所有申请者必须能够证明已准备好进行2年全日制研究生学习，并且必须满足以下最低要求：
1. 常规学术要求
1.1 持有认可大学颁发的良好荣誉学士学位（二等或以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要心理学或密切相关学科背景（如咨询、应用心理学等），在3或4年内完成的荣誉学位将会被考虑
学校不接受本科学习最后一年尚未毕业的学生的申请
或1.2 持有认可大学颁发的良好硕士学位，需要心理学分支学科或密切相关学科背景（如咨询、应用心理学等），这种情况下学校可能会考虑接受较低二等荣誉学位的申请者
2. 研究经历
成功完成荣誉研究论文，能够展示核心研究技能和完成研究项目的能力。没有荣誉论文的申请者将需要提供能够证明研究经验和能力的其他必要证据（即进行过独立研究，随后担任研究助理；在同行评审期刊上发表过研究成果；在随后的研究生课程中完成了一项研究项目/论文；等等），将根据具体情况进行评估
二、强烈建议申请者具备
直接临床工作经验（过去5年中）
具备至少1年全职或同等的兼职（不一定要连续就业）相关心理学实践/应用和/或相关临床研究经验（即担任心理学家、助理或副心理学家、治疗师、课堂助理、研究助理或研究员等；或在应用心理学、精神病学、特殊需要、社会服务或志愿福利组织环境中），理想情况下由心理学家/临床心理学家监督，总体评估中会在考虑进行工作的期限和质量
申请者如有少于1年的全职（或同等的兼职）直接临床工作经验，不建议申请
三、英语语言测试
所有成功的申请者都需要参加英语语言测试，根据学生在水平测试中的表现，学生将被安排参加研究生英语课程或免修该课程，硕士生要求英语课程达到中级水平（至少达到C级）
需要提供存款证明80,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '研究方法 Graduate Research Methods; 心理评估 Psychological Assessment; 成人精神病理学 Adult Psychopathology; 贯穿一生的健康 Health Across the Lifespan; 心理干预和治疗 Psychological Intervention and Therapy; 儿童精神病理学 Child Psychopathology; 研究计划 Research Proposal',
                    '社科, 心理学, 人文社科学院', '新加坡国立大学的心理学硕士（临床）课程是一项为期两年的全日制课程，旨在为那些计划在临床心理学领域从事专业工作的毕业生提供基本入门级的培训。该课程采用“科学家-实践者”模式作为基本研究方法，注重培养理论知识和核心胜任能力以满足临床实践的需求。课程教学方式包括课程作业、调查研究和专业实习等。', '人文社科学院',
                    '心理学', '8月', '无',
                    '无', 'https://fass.nus.edu.sg/psy/master-of-psychology-clinical/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (Intellectual Property & Technology Law)', '知识产权与技术法法学硕士', 
                    '1年', 37100.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '知识产权法 Law of Intellectual Property; 知识产权法基础 Foundations of IP Law; 娱乐法：流行肖像学及名人效应 Entertainment Law: Pop Iconography & Celebrity; 欧洲和国际竞争法 European & International Competition Law; 生物技术法 Biotechnology Law; 竞争法与政策 Competition Law and Policy; 知识产权的全球开发 Global Exploitation of IP',
                    '社科, 法律, 法学院', '新加坡国立大学法学硕士课程（知识产权与技术法法学硕士）重点关注因科技迅速发展引发的一系列问题。该课程主要包括传统的知识产权法，例如那些涉及版权、专利、设计、商标和机密信息的法律。同时，它也涵盖了其他集中于相关技术的法律，例如生物医学法、电信法和互联网法。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '新加坡国立大学法学硕士课程（知识产权与技术法法学硕士）重点关注因科技迅速发展引发的一系列问题。该课程主要包括传统的知识产权法，例如那些涉及版权、专利、设计、商标和保密信息的法律。同时，它也涵盖了其他侧重于相关技术的法律，例如生物医学法、电信法和互联网法。就业服务：毕业生可以在知识产权管理机构、科研院所等单位从事知识产权管理、研究工作；或者在知识产权中介服务机构、律师事务所或人民法院等单位从事知识产权服务工作或审判工作；此外，毕业生也可以担任大型企业的知识产权管理者、专利工程师、技术管理人员或法务。招生特点：拥有亚洲排名第一的法学院。托福92-99也可以申请（有机会），如果审核觉得可以，会收到面试或要求在开课前上英语课程。NUS法学院最多申请两个项目，申请时需要注意志愿排序，并寄送一份纸质材料给第一志愿的专业。如果申请IBL和一个llm的别的项目，非常优秀的同学有可能会收到两个Offer。软硬件要求都很高，偏好985、有多样化经历（暑校、交换等）的同学', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0', 'MSc Technology and Design (Architectural Design Computation)', '科技与设计（建筑设计运算）理学硕士', 
                    '1年', 54500.0, '至少拥有建筑学、工程学、建筑专业或建筑环境相关领域的学士学位 有兴趣的候选人若拥有不相关专业的本科学位，可能会根据具体情况进行考虑 相关项目和工作经验将被考虑录取 申请人需要提交一份作品集，重点介绍相关（顶点）项目，展示申请者的技能、能力和经验，以支持申请',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '设计创新 Innovation by Design; 运算设计 Computational Design; 数字化制造 Digital Fabrication; 设计科学 Design Science; 数字化设计交付 Digital Design Delivery; 创造性人工智能 Creative Artificial Intelligence; 设计技术方案 Design Technology Project',
                    '社科, 建筑, 硕士项目', '新加坡科技设计大学科技与设计（建筑设计运算）理学硕士课程以新加坡科技设计大学著名的设计计算课程为基础，融合了前沿主题和行业相关挑战，让学生掌握在不断发展的 AEC 领域脱颖而出所需的技能。学生将在计算设计、数字制造、数字设计交付和创意人工智能等关键领域获得实践经验。通过沉浸式学习体验，学生将掌握先进的计算技术，探索创新的制造技术，并深入了解数字项目交付和人工智能驱动的设计解决方案。这种实用、以技术为中心的方法确保毕业生不仅准备好满足当前的行业需求，而且还能推动建筑环境的未来创新。', '硕士项目',
                    '建筑', '9月', '无',
                    '无', 'https://www.sutd.edu.sg/programme-listing/mtd-architectural-design-computation/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Technopreneurship and Innovation (Chinese)', '科技创业与创新理学硕士（中文授课）', 
                    '1年', 61040.0, '具有教育部认可的学士学位以及良好的本科成绩
强烈的创业愿望和优秀的创业家素质或潜质
本科专业不限，理工科专业背景有一定优势
有一定创业经验或3年以上工程、管理或投资经验者可获优先考虑
品学兼优且立志创业的大学应届毕业生可申请，项目将酌情给予考虑并择优录取
需要提交创业点子陈述',
                    NOW(), NOW(), '无', '创业学概论 Introduction to Entrepreneurship; 创业营销与商务拓展 Entrepreneurial Marketing and Business Development; 新创企业融资 New Venture Financing; 管理成长型企业 Managing Growing Ventures; 科创思维 Technopreneurial Mindset; 设计与系统思维 Design and System Thinking; 科创挑战 Technopreneurship Challenge',
                    '商科, 创业与创新, 南洋科技创业中心', '南洋理工大学科技创业与创新理学硕士（中文授课）课程旨在培育创业生态群的领导者。这些领导者利用所学知识和接触到的先进科技，结合创业思维和商业技能，为社会和经济的发展创造价值。南洋理工大学科技创业与创新理学硕士（中文授课）课程注重体验式学习。在课程设置中，新兴科技与创新的商业模式和实践高度融合。针对创业型企业的发展周期，学科涵盖各个成长阶段的实战问题。在学期间，学员有机会与创业生态群中的不同成员进行互动。众多毕业生已从该课程获益，将他们的创业点子变成了成功的企业。', '南洋科技创业中心',
                    '创业与创新', '8月', '机面（kira）/真人群面',
                    '该专业是管理学下的商科专业，强调企业管理方向，并由业界精英授课，注重理论和实践结合。不同于其他商科专业，该专业对本科非985的学校较为友好，一般211院校的学生，成绩达到83分左右，加上优秀的创业点子或项目经验，对创业有热情和向往，都有机会申请。该专业更看重学生的应用能力，看是否具备将所学知识应用到实践中的能力。



就业服务：自主创业或在国内大厂就职；在新加坡shopee和字节跳动等公司就职；在创业领域做学术研究，如商业战略、社会学中的创业生态体系等。

招生特点：面试为4人一组的全中文面试，像创业者之间的交流，会问到申请者的创业项目及商业经验等。面试官有丰富的创业或技术相关经验，主要基于申请者的商业项目或商业提升案提问，以及为什么想来就读和将来的打算等普遍问题。氛围轻松愉悦，不用紧张。

班级概况：22fall班级整体人数在55人左右，其中95%以上都是中国学生，其他还有少数当地学生。同学背景方面，985和211本科居多，有少数海本，有工作经验的较多，平均工作年限4-7年，平均年龄25-30，有40%以上是应届生。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-technopreneurship-and-innovation-programme-cn'
                );
-- 插入programs表数据 (批次 11/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Art)', '教育学硕士（艺术）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀；或
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验。',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 艺术教育的研究与问题 Research and Issues in Art Education; 视觉艺术与创意 Visual Arts and Creativity; 艺术教育与科技 Arts Education and Technology; 艺术创作与美学探究 Art Making and Aesthetic Enquiry',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（艺术）项目为学校开发视觉艺术课程和教学法提供了理论和实践基础，使艺术教育者能够通过关注艺术和艺术教育的当代问题和发展，实现艺术教育的高级学术和专业发展，强调学术和学生自己的工作室实践，以丰富其在多元文化背景下的艺术知识。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(art)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'Executive MBA', '高级工商管理硕士', 
                    '1年', 119900.0, '- 具有声誉好的院校颁发的良好本科学位（不限专业背景）
*没有学士学位但具备显著职业成就的申请者将根据具体情况被考虑录取
- 具备至少10年专业工作经验，有高级管理经验者优先考虑
- 具有受认可的成就
- SMU EMBA课程寻求能够表现出卓越的领导能力和智力敏锐度的全球高级管理人员和管理者，他们有可能达到或已经在企业/组织中担任高层职位
- 具有良好的GMAT/GRE/SMU入学考试成绩
- 需要提交1篇Essay（300-500字）
- 入围申请者将被邀请参加面试',
                    NOW(), NOW(), '无', '全球环境中的领导 Leading in a Global Environment; 领导商业转型 Leading Business Transformation; 可持续性与伦理研讨会 Sustainability & Ethics Workshop; 战略倡议项目（SIP)简报会 Strategic Initiative Project (SIP) Briefing Session; 政治经济学：全球与区域 Political Economy: Global & Regional; 战略营销管理 Strategic Marketing Management; 创业企业融资 Financing Entrepreneurial Business',
                    '商科, 工商管理, 商学院', '新加坡管理大学高级工商管理硕士项目是一项创新性课程，旨在为学员提供独一无二的学习机会，让他们在一个课程内却能体验多所世界顶尖大学的教学资源。为期12个月的模块化课程包括知名合作大学的海外学习部分，例如上海交通大学安泰经济与管理学院、意大利 SDA 博科尼管理学院和美国纽约大学斯特恩商学院。EMBA 项目旨在将具备多年职能经验的领导者培养成为战略思想家。同时，它也非常适合高级管理人员繁忙的日程安排，尽量减少其对工作的干扰，并提供将课堂知识直接应用于现实世界的实践机会。', '商学院',
                    '工商管理', '8月', '无',
                    '无', 'https://masters.smu.edu.sg/programme/executive-master-of-business-administration'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree MSc Marketing Analytics and Insights and Master in International Management (NUS-CEMS)', '市场分析与洞察理学硕士与国际管理硕士双学位（新加坡国立大学-CEMS）', 
                    '2年', 43055.0, '具有良好的本科学位，需要商业或商业相关学科背景，除了具有良好的英语口语和书面能力外，还必须精通至少一门其他CEMS语言
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费86,110新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '全球战略 Global Strategy; CEMS 区块研讨会 CEMS Block Seminar; 全球领导力 Global Leadership; CEMS 商业项目 CEMS Business Project; CEMS 全球公民研讨会 CEMS Global Citizenship Seminar',
                    '商科, 市场营销, 商学院', '新加坡国立大学市场分析与洞察理学硕士与国际管理硕士双学位旨在使学生在领先的 CEMS 合作大学享受一个国际交换学期，完成全球管理方面的 CEMS 课程，参加商业项目和技能研讨会，并完成国际实习。通过 CEMS MIM，学生将体验并加入一群就读于世界各地领先商学院的高素质、具有国际视野、多语言的学生。', '商学院',
                    '市场营销', '8月', '真人单面',
                    '无', 'https://mscmarketing.nus.edu.sg/cems-mim/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Financial Technology (Digital Financial Services)', '金融科技理学硕士（数字金融服务）', 
                    '1年', 63220.0, '具有良好的学士学位，需要相关专业背景（如量化专业、商科、工程等）
具备良好的GRE或GMAT成绩者优秀考虑（不强制要求）
具备至少2年工作经验者优先考虑（不强制要求）',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '金融中的机器学习 Machine Learning in Finance; 统计建模基础 Foundations of Statistical Modelling; 金融科技概论 Introduction to ​FinTech; 金融科技生态系统与创新 FinTech Ecosystem and Innovations; 金融与风险管理原理 Principles of Finance and Risk Management; Python编程 Python Programming; Python数据分析 Python for Data Analysis',
                    '商科, 金工金数, 物理与数学科学学院', '南洋理工大学金融科技理学硕士（数字金融服务）课程以数据科学、人工智能和信息技术为基础，为学生提供必要的金融科技技能，以应对金融行业的不断变化。学生将深入掌握金融领域的颠覆性技术，包括金融自动化(例如，机器人顾问)、金融密码学(例如，区块链技术)和数字金融服务(例如，金融普惠)。数字金融服务方向是为对金融科技管理方面感兴趣的学生设计的。选择这一方向的候选人应具有相关专业背景（如定量专业、商科等）或在金融行业的相关工作经验。', '物理与数学科学学院',
                    '金工金数', '8月', '无',
                    '金融科技理学硕士课程由南洋理工大学物理与数学科学学院主办。该课程以数据科学、人工智能和信息技术为基础，为学生提供必要的FinTech技能，以应对金融行业不断变化的格局。重点是深入掌握金融领域的颠覆性技术，包括金融自动化（如机器人顾问）、金融密码学（如区块链技术）和数字金融服务（如普惠金融）。选择这一方向的候选人应具有相关专业背景（如定量专业、商科等）或在金融行业的相关工作经验。



就业服务：南大职业与实习办公室（CAO）通过个性化的职业指导、特定行业的咨询、就业技能讲习班和职业体验项目，帮助学生就业。学校与超过3500个全球和本地组织建立了联系，包括跨国公司、中小企业、公共服务部门和机构，会提供实习、社交活动和就业机会每年约有5,000名学生获安排到本地及海外实习，参与他们的学分实习计划。

招生特点：ntu金融科技录取方面沿袭着ntu一贯的对于名校的偏好，录取的案例中肉眼可见的很多top985，211财经院校，以及海本或者合办院校。专业方面也更偏好有定量背景的本科专业。同时新加坡这边对于软背景方面也是比较看中的，偏好有2年工作经验的，所以对于应届的同学要增加自己的竞争力，需要尽量增加相关的实习和科研竞赛了。

班级概况：22fall班级全日制人数有86人，中国学生占比70%-80%，有少数泰国、新加坡和马来西亚的学生。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-financial-technology'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (International & Comparative Law)', '国际法与比较法法学硕士', 
                    '1年', 37100.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '国际公法 Public International Law; 投资争端仲裁 Arbitration of Investment Disputes; 东盟经济共同体法律和政策 ASEAN Economic Community Law and Policy; 中国、印度和国际法律 China, India and International Law; 比较公司法 Comparative Corporate Law; 比较刑法学 Comparative Criminal Law; 比较环境法 Comparative Environmental Law',
                    '社科, 法律, 法学院', '新加坡国立大学法学硕士学位（国际法与比较法法学硕士）项目为学生提供国际公法、国际私法和比较法的课程，主要着眼于贸易、投资和商业议题，还涉及国际公法、人权和环境保护等主题。同时，该项目还开设了专门的课程模块，就中国、美国、欧盟、印度、印度尼西亚、韩国和越南等司法管辖区的法律进行比较研究。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '无', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master in Public Policy', '公共政策硕士', 
                    '2年', 44986.0, '优先考虑具备2-5年工作经验的申请者，申请者应表现出成熟度和对公共服务的投入，必须熟练掌握英语书面和口语
申请者必须表现出智力差异（通过先前的学术成就、推荐和分析培训来证明）和领导能力（通过先前在课外、公民或社区活动中的成就以及推荐信中的就业经历来证明）
具有新加坡国立大学学位（至少达到二等荣誉、二等一）或同等学历，例如4年制学士学位且平均成绩达到B或更高水平
经新加坡国立大学研究生院批准也可能接受其他资格和经验，申请者最好具备一些经济学和数学背景
可选择性提供GRE/GMAT
需要提供2篇论文',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '政策过程与制度 Policy Process and Institutions; 政治学与公共管理 Politics and Public Administration; 政策分析的量化研究方法I Quantitative Research Methods for Public Policy 1; 公共政策的经济基础 Economic Foundations for Public Policy; 政策挑战 Policy Challenges; 政策分析的量化研究方法II Quantitative Research Methods for Public Policy 2; 政策分析的定性研究方法 Qualitative Research Methods for Public Policy',
                    '社科, 公共政策与事务, 李光耀公共政策学院', '新加坡国立大学公共政策硕士项目为期两年，致力于为学生提供政策分析、项目管理和评估等方面的前沿理论和技能，为政策分析、课程评估和管理打下坚实的基础，该硕士项目为所有申请人提供了处理影响国家、区域和全球政策的复杂问题的机会。入学后，学生可以选择专攻经济和发展、政治和国际事务，或管理和领导等方向。', '李光耀公共政策学院',
                    '公共政策与事务', '8月', '无',
                    '该项目是1992年在哈佛大学肯尼迪政府学院协助下创办，同时李光耀公共政策学院也是起源于该项目。历经20多年的发展，李光耀公共政策学院已经发展成为亚洲首屈一指的公共政策学院。MPP是建立在公共政策、经济学、公共管理和政治学的强大跨学科知识基础上，并强调政策分析研究方法的培训。MPP 学生还可以通过学生交换和双学位课程扩展他们的学习。就业服务：毕业生可以在政府部门、国际组织和非营利机构从事政策分析与制定、项目管理等方面的工作；也可以在私营部门例如咨询公司、跨国企业从事企业社会责任、公共事务、可持续发展等领域的工作。招生特点：最好具有一定的经济学和数学背景，最好有GRE/GMAT；需要两篇论文；偏好有2-5年工作经验的申请者，应届生录的很少', 'https://lkyspp.nus.edu.sg/graduate-programmes/master-in-public-policy-mpp'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Clinical Mental Health & Psychotherapy', '临床心理健康与心理治疗硕士', 
                    '1.5年', 44934.0, '具有认可大学颁发的相关学士学位或同等学历（至少达到荣誉学位），需要心理学、医学、护理、职业治疗、联合健康、社会工作背景
优先考虑具备至少1-3年直接护理精神健康问题人士经验的申请者者，没有相关临床或工作经验的申请者将根据具体情况考虑
需要提供存款证明65,400新币',
                    NOW(), NOW(), '雅思: 7; 托福: 94', '未找到课程设置',
                    '社科, 医学, 杨潞龄医学院', '新加坡国立大学临床心理健康与心理治疗硕士项目是一个综合性、应用性和基于技能的学术培训项目，为心理健康状况、心理干预、心理治疗和咨询以及病例和护理协调提供坚实的基础。
它旨在提供高等教育和专业临床培训，以满足新加坡和该地区心理健康专业人员和从业者不断增长和不断变化的研究生学习需求。
临床心理健康专业人员需要多种治疗技能来有效满足客户的需求。新加坡国立大学临床心理健康与心理治疗硕士项目包括常见心理健康障碍的研究、筛查和评估、认知行为治疗、辩证行为治疗、人际心理治疗、正念、育儿、团体心理治疗、社交技能培训和行为干预。', '杨潞龄医学院',
                    '医学', '1月', '无',
                    '无', 'https://medicine.nus.edu.sg/nmsc/mcmhp/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0', 'MSc Urban Science, Policy and Planning', '城市科学、规划与政策理学硕士', 
                    '1年', 41430.0, '拥有学士学位或以上',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '城市社会进程理论与动态 Theory and Dynamics of Urban Social Processes; 城市分析研究方法 Research Methodology for Urban Analysis; 规划与政策的技巧与方法 Techniques and Methods of Planning and Policy; 全球智慧城市：新加坡领导与规划 Smart Global City: Leadership and Planning in Singapore; 城市研讨会 Urban Symposium; 计算城市分析 Computational Urban Analysis; 课题研究 Research Studio',
                    '社科, 建筑, 硕士项目', '新加坡科技设计大学城市科学、规划与政策理学硕士项目提供综合的实践课程。通过该项目的学习，学生将拥有良好的城市理论基础，善于处理、分析城市数据，并精通城市规划。新加坡科技设计大学城市科学、规划与政策理学硕士项目旨在培养下一代城市研究者、分析师与从业人员。新加坡科技设计大学城市科学、规划与政策理学硕士项目紧跟迅速扩大的全球化城市新范式，旨在帮助学生针对城市挑战寻找新的解决方案，诸如可持续迁移、包容性城市发展和21世纪新治理模式。新加坡科技设计大学城市科学、规划与政策理学硕士项目的学生将先进的社会与数据科学研究方法以及计算技术与城市理论、规划和实践相结合，探究现有和新兴的课题以塑造未来城市。', '硕士项目',
                    '建筑', '9月', '无',
                    '无', 'https://urbanscience.sutd.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Tamil Language)', '教育学硕士（泰米尔语）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 泰米尔语课程，包括信息技术在内的材料：选择与评估 Tamil Curriculum, Materials including IT: Selection and Evaluation; 教育中的泰米尔文学 Tamil Literature in Education; 教育中的泰米尔语 Tamil Language in Education; 功能泰米尔语语法 Functional Tamil Syntax; 泰米尔历史与文化简介 An Introduction to Tamil History and Culture of Tamil; 泰米尔语评估 Assessment for Tamil Language',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（泰米尔语）项目旨在为泰米尔语教育专业人士提供关于泰米尔语教育的实际和理论问题的广泛而深入的知识和观点，使学生能够应对职业生涯后期的挑战，该课程专注于教师和其他从事泰米尔语教育的专业人士的需求，帮助学生熟悉泰米尔语教育的最新问题和思想，以及课程设计和学习材料的出版。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(tamil-language)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Technopreneurship and Innovation (English)', '科技创业与创新理学硕士（英文授课）', 
                    '1年', 61040.0, '具有良好的学士学位或同等学历，不限专业背景
具有强烈的创业热情
有工作经验者优先考虑
需要提交一篇business idea statement',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '创业运筹与商业计划 Entrepreneurship & Business Planning; 新创企业营销 New Venture & Entrepreneurial Marketing; 创业融资 Venture Capital Financing; 知识产权，技术评估和科技成果产业化 Intellectual Property & Technology Evaluation & Commercialisation; 新创及成长期企业的财务 Accounting for New & Ongoing Ventures; 新创及成长期企业的战略人事管理 Strategic Human Resource Management for New & Ongoing Ventures; 新创及科技企业的战略管理 Strategic Management for New Ventures & Technology Firms',
                    '商科, 创业与创新, 南洋科技创业中心', '南洋理工大学科技创业与创新理学硕士（英文授课）课程创办于2002年，旨在培养学员必备的创业技能及商业潜能，进而将新颖的构想转化为成功的企业。南洋科技创业中心是南洋理工大学创新与创业教育的关键推行者，中心与美国考夫曼基金会合作创办了第一所考夫曼海外校园。南洋科技创业中心的课程不但开创了区域创业教育的先河，更为具有创业意愿的学员提供了一个与国际顶尖教育家、研究者和投资人合作的起步点。', '南洋科技创业中心',
                    '创业与创新', '8月', '真人群面/机面（kira）',
                    '创业与创新硕士课程注重体验式学习，将新兴科技与创新的商业模式和实践高度融合。该课程针对创业型企业的发展周期，涵盖起步公司在各个成长阶段的实战问题。在学期间，学员有机会与创业生态群中的不同成员进行互动，包括经验丰富的学者、从业者和企业家等。众多的毕业生已从该课程获益，将其创业点子成功地转变为创业型企业。



就业服务：该硕士课程为毕业生提供了多样化的职业前景，如业务分析师、商业管理顾问、风险分析师、大数据分析师和企业智能经理等。许多毕业生在知名公司如埃森哲、微软、星展银行、华侨银行和IBM等找到了工作。该专业提供实习和工作培训提供为期 5 个月的全职实习，实习公司包括埃森哲、IBM、华侨银行等。如果实习期间表现优秀，有可能在实习期结束后直接拿到工作offer。

班级概况：22fall班级整体人数在50人左右，其中基本都是中国学生，只有少数当地学生。同学背景方面，本科少数海本，有南洋理工大学、新加坡国立大学，国内的学校本科有中国人民大学、浙江大学、南京大学、南京航空航天大学、南京理工大学、西南财经政法大学、上海财经大学、中南财经政法大学、北京体育大学。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-technopreneurship-and-innovation-programme'
                );
-- 插入programs表数据 (批次 12/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Financial Technology (Intelligent Process Automation)', '金融科技理学硕士（智能过程自动化）', 
                    '1年', 63220.0, '具有良好的学士学位，需要相关专业背景（如量化专业、商科、工程等）
具备良好的GRE或GMAT成绩者优秀考虑（不强制要求）
具备至少2年工作经验者优先考虑（不强制要求）',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '金融中的机器学习 Machine Learning in Finance; 统计建模基础 Foundations of Statistical Modelling; 金融科技概论 Introduction to ​FinTech; 金融科技生态系统与创新 FinTech Ecosystem and Innovations; 金融与风险管理原理 Principles of Finance and Risk Management; Python编程 Python Programming; Python数据分析 Python for Data Analysis',
                    '商科, 金工金数, 物理与数学科学学院', '南洋理工大学金融科技理学硕士（智能过程自动化）课程以数据科学、人工智能和信息技术为基础，为学生提供必要的金融科技技能，以应对金融行业的不断变化。学生将深入掌握金融领域的颠覆性技术，包括金融自动化（如机器人顾问）、金融密码学（如区块链技术）和数字金融服务（如金融普惠）。智能过程自动化方向是为那些对金融科技的技术方面感兴趣的学生设计的，选择这一方向的候选人应该有良好的定量专业背景，或者在数学和编程学科具备良好背景（尤其是非理工科毕业生）', '物理与数学科学学院',
                    '金工金数', '8月', '无',
                    '金融科技理学硕士课程由南洋理工大学物理与数学科学学院主办。该课程以数据科学、人工智能和信息技术为基础，为学生提供必要的FinTech技能，以应对金融行业不断变化的格局。重点是深入掌握金融领域的颠覆性技术，包括金融自动化(如机器人顾问)、金融密码学(如区块链技术)和数字金融服务(如普惠金融)。



就业服务：南大职业与实习办公室(CAO)通过个性化的职业指导、特定行业的咨询、就业技能讲习班和职业体验项目，帮助学生就业。学校与超过3500个全球和本地组织建立了联系，包括跨国公司、中小企业、公共服务部门和机构，会提供实习、社交活动和就业机会每年约有5,000名学生获安排到本地及海外实习，参与他们的学分实习计划。

招生特点：NTU 金融科技招生特点沿袭着NTU一贯的对于名校的偏好，录取的案例中肉眼可见的很多top985，211财经院校，以及海本或者合办院校。专业方面也更偏好有定量背景的本科专业，如统计，金工，软工，自动化，计算机等等。同时新加坡这边对于软背景方面也是比较看中的，偏好有2年工作经验的，所以对于应届的同学要增加自己的竞争力，需要尽量增加相关的实习和科研竞赛了。

班级概况：22fall班级整体人数有80+，分为两个方向，每个方向大约40人左右，其中非全日制有10人左右，中国学生占绝大多数，也有少数泰国、新加坡和马来西亚的学生。国内的学生有中国人民大学、武汉大学、浙江大学和同济大学的，其专业主要是商科和计算机，还包括一些会计学、统计学、金融的学生。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-financial-technology'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Chinese Language)', '教育学硕士（汉语言）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 语言规划与语言教育 Language Planning and Language Education; 汉语言及其教学专题 Topics on Chinese Language and Its Teaching; 儿童与青少年文学在汉语言教学中的教学用途 The Instructional Use of Children and Young Adults’ Literature in Chinese Language Teaching and Learning; 中国文学与文化及其教学 Chinese Literature and Culture and Its teaching; 新加坡小学品格与公民教育及其教学法 Character and Citizenship Education and its Pedagogy in Singapore Primary Schools; 中国教育语言学 Chinese Educational Linguistics',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（汉语言）项目旨在为中国语言教育专业人士提供深入和广泛的中国语言教育理论和实践问题知识，使其能够在职业生涯的更高阶段迎接挑战，该课程主要关注中国语言教育领域的教师和其他专业人员的需求，涵盖课程和教学问题、语言理论和文化，讨论了当前的语言理论和研究方法有关的语言教学和学习，使学生能够实施与课程内容以及学校语言教学相关的小规模研究。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(chinese-language)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MBA', '工商管理硕士', 
                    '1年', 81750.0, '- 具备至少2年学位毕业后工作经验（参与者平均有5-6年工作经验）
- 具有声誉好的院校颁发的良好本科学位（不限专业背景）
- 具有强大的人际交往能力和国际视野，以及在不同的团队中工作的能力
- 任何杰出的专业成就、领导经验和潜力、学术才能和社区影响都将是额外的优势
- SMU MBA课程寻求能够表现出智力才能和领导能力、致力于学习、具备个人素质、能够为SMU MBA经历和更大社区做出贡献的申请者
- 具有良好的GMAT/GRE/SMU入学考试成绩
需要提交2篇个人陈述，其中1篇需要对指定问题（3选1）进行回答',
                    NOW(), NOW(), '无', '公司财务 Corporate Finance; 公司战略 Corporate Strategy; 组织行为与领导力 Organizational Behavior and Leadership; 决策分析 Decision Analysis; 财务会计 Financial Accounting; 管理经济学 Managerial Economics; 市场营销 Marketing',
                    '商科, 工商管理, 商学院', '新加坡管理大学工商管理硕士课程可以磨练学生的硬技能和软技能来加强领导力。学生不仅将学习批判性思考、战略制定、研究、分析业务决策和执行计划，还要学会了解自己和他人、沟通、协作、谈判、建立关系网和领导。凭借最先进的课程，能够将理论与实践联系起来，以及营销、金融、战略、创新、技术和供应链管理方面的广泛选修课，学生可以加快在东南亚或更远地区的下一个职业发展。学生将不仅获得的知识，还将通过该课程的各种体验式学习方法学习发展关键能力：区域案例研究、商业研究任务、国际交流、进入世界级公司的实习，以及与领先组织合作的基于项目的课程。', '商学院',
                    '工商管理', '1/8月', '无',
                    '无', 'https://masters.smu.edu.sg/programme/master-of-business-administration'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Architectural Conservation', '建筑保护文学硕士', 
                    '1年', 49050.0, '具有荣誉学士学位，需要建筑学、城市规划、城市设计、项目和设施管理；或
具有学士学位或以上学历，需要社会科学或人文学科中的建筑环境相关领域背景。
特殊情况下会根据具体情况考虑具有相关学科学士学位以及至少2年相关工作经验的申请者
设计背景的申请者需要提交1份设计作品集',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '新加坡建筑史 Architectural Histrory of Singapore; 保护方法和策略 Conservation Approaches and Philosophies; 城市保护与改造 Urban Conservation and Regeneration; 建筑遗产管理 Architechtural Heritage Management; 为可持续发展的保护政策方法论 Conservation Policy Methodology for Sustainable Development; 文化遗产的灾害风险管理 Disaster Risk Management of Cultural Heritage; 建筑保护设计 Design for Conservation',
                    '社科, 建筑, 工程学院', '新加坡国立大学建筑保护文学硕士（MAArC）是一项高级课程，通过为学生提供全面的知识和基本的动手培训以及丰富的经验，以发展其在历史建筑保护和建筑业的各种技能，从而提供了对亚洲多种文化的独特见解。MAArC具有鲜明的亚洲特色，侧重于“生活”和“本地”文化，而城市则侧重于城市。新加坡位于东西方的十字路口，以其独特的城市景观而著称：历史悠久的地区，文物建筑和国家历史遗迹与现代高层建筑无缝融合。在新加坡飞速发展的过程中，这些丰富多样的历史遗迹的生存只能通过深思熟虑、有意识的综合城市规划来实现。以城市国家作为跳板，提供丰富的背景，我们的目标是提供对建筑保护的教育，使其对亚洲历史悠久的城市所面临的各种挑战以及文化遗产的丰富性和社会经济因素提供的各种机会敏感该地区。', '工程学院',
                    '建筑', '8月', '真人单面',
                    '无', 'https://cde.nus.edu.sg/arch/programmes/master-of-arts-in-architectural-conservation/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Mathematics for Educators', '数学教育学理学硕士', 
                    '1年', 47415.0, '具有良好的理学学士学位或同等学历，具备强大的数学背景
应届毕业生无法申请秋季入学',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '数学探究 Mathematical Inquiry; 师范高等微积分学及应用 Advanced Calculus and Applications for Educators; 师范抽象代数 Abstract Algebra for Educators; 微积分教学中数学分析元素的应用 Elements of Mathematical Analysis with Applications in the Teaching of Calculus; 数论和算数教学 Number Theory and the Teaching of Arithmetic; 统计推理 Statistical Reasoning for Educators; 离散数学及问题解决 Discrete Mathematics and Problem Solving',
                    '社科, 教育, 教育学院', '新加坡南洋理工大学数学教育学理学硕士项目主要满足数学教育者的专业需求，致力于向学生传授数学领域内广泛深入的专业知识以及实用的数学教学技巧。在专业教师的积极指导下，学生们将有机会学习数学学科不同专业领域的课程。指导教师们大多数都具备数学教学资格。在数学教学过程中，对于数学知识的牢固掌握将有助于教师更好地进行教学，也有助于提升学生高层次思维能力。教育机构中的数学专家同样能够获益于本项目，因为通过课程学习，他们能够丰富自身数学专业知识、提高教学能力、娴熟应对数学教学方面的各种困难，例如当下严谨化课程的设计、数学教学评估、教学资源开发等等。新加坡南洋理工大学数学教育学理学硕士项目面向数学专业的本科毕业生，同时也招收数学功底扎实并且有志于进行数学硕士生深造的非数学专业本科毕业生。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-science-(mathematics-for-educators)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Nursing', '护理硕士', 
                    '1.5年', 50100.0, '具有护理学学士学位，需要为新加坡护理委员会认证的课程背景
GPA不低于3.20
持有新加坡护理委员会的正式注册及有效执业证书
作为注册护士具备至少5年连续临床执业经验
急症护理（重症护理和急救）和精神保健申请者需要持有临床专业的高级文凭/研究生文凭
申请者必须得到护士长、护理部主任和所属部门负责人的强烈推荐
申请者应满足新加坡卫生部规定的健康要求',
                    NOW(), NOW(), '雅思: 6.5; 托福: 85', '综合临床决策和管理 I Integrated Clinical Decision Making and Management I; 综合临床决策和管理 II Integrated Clinical Decision Making and Management II; 综合临床决策和管理 I（儿科） Integrated Clinical Decision Making and Management I; 综合临床决策和管理 II（儿科） Integrated Clinical Decision Making and Management II; 临床药理学和药物治疗学 I Clinical Pharmacology and Pharmacotherapeutics I; 临床药理学和药物治疗学 II Clinical Pharmacology and Pharmacotherapeutics II; 成人护理跨护理连续体 Adult Care Across Care Continuum',
                    '社科, 医学, 杨潞龄医学院', '新加坡国立大学护理硕士项目旨在为学生提供新加坡医疗保健系统复杂性的鸟瞰图，从而使学生能够制定一条清晰的道路，获得应对这些挑战所需的关键能力。该项目的目标是通过知识获取、案例研究讨论、临床接触、社区项目开发以及针对医疗保健挑战生成基于证据的解决方案来拓展学生的多维能力。
新加坡国立大学护理硕士项目的独特之处在于，我们采用体验式学习来促进学生的学习，通过模拟训练掌握临床技能，虚拟综合案例接触促进知识转化，临床决策训练平台掌握心理推理过程，以及聪明的学生以教学为中心的平台来监控您的学习进度。通过这些创新的教学法，学生的临床能力和领导能力将得到扩大和提高，从而使学生能够全面、安全地管理复杂的医疗保健条件和护理问题。
作为亚洲护理专业人员教学和发展的领导者，我们不仅寻求培养能够感知系统内异常并挑战现状的问题解决者，而且还寻求具有科学思维的创新思想家，能够找到解决方案并领导改变新加坡的护理环境。我们致力于培养终身学习者，使校友与学校保持密切联系，不断发展自己和护理专业。', '杨潞龄医学院',
                    '医学', '1月', '无',
                    '无', 'https://medicine.nus.edu.sg/nursing/education-programmes/postgraduate/masters/master-of-nursing/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (International Arbitration & Dispute Resolution)', '国际仲裁与争议解决法学硕士', 
                    '1年', 41300.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '合同治理：国际和比较视角 Governance Contract: International& Comparative Perspective; 国际商事仲裁 International Commercial Arbitration; 国际投资法 International Investment Law; 外国投资协议仲裁的法律和实践 Law & Practice of Investment Treaty Arbitration; 谈判 Negotiation; 跨国商业纠纷解决 Resolution of Transnational Commercial Disputes',
                    '社科, 法律, 法学院', '新加坡国立大学国际仲裁及争议解决法法学硕士项目旨在培养律师和学者，对相关争议解决问题进行严格独立的调查，推广跨国仲裁方法，表达批判性和有影响力的见解，并在当地和全球社区提出有益的解决方案。学生参加新加坡国立大学国际仲裁及争议解决法法学硕士的学习过程中，将有机会接触到世界顶尖的仲裁领域的专家学者和行业顶尖的人士。随着地区和国际上离岸法律事务的日益增加，新加坡国立大学国际仲裁及争议解决法法学硕士项目的课程设置涵盖了一些国际公法和国际私法的内容。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '无', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Real Estate', '房地产理学硕士', 
                    '1年', 59950.0, '具有良好的本科学位，不限专业背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
需要具备至少2年毕业后相关工作经验
需要提供能够覆盖学费与生活费金额的存款证明（2024学年学费59,950新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '房地产开发 Real Estate Development; 房地产投资 Real Estate Investment; 房地产经济学 Real Estate Economics; 不动产金融学 Real Estate Finance; 城市政策与房地产市场 Urban Policy & Real Estate Markets; 资产组合管理 Portfolio and Asset Management; 商业房地产评估 Commercial Real Estate Appraisal',
                    '商科, 房地产, 商学院', '新加坡国立大学房地产理学硕士学位课程是一个领先的全球房地产项目，在过去的三十年里已经很好地建立起来。该硕士旨在为具有非房地产背景的房地产专业人士提供正规教育。该硕士学位还吸引了来自世界各地对房地产感兴趣的人。这有助于该计划汇集不同国籍、不同背景的多样的组合，相互学习、分享和联系，并与房地产行业建立联系。', '商学院',
                    '房地产', '8月', '机面（kira）/真人单面',
                    '无', 'https://mscre.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MBA', '工商管理硕士', 
                    '1年', 81750.0, '具有学士学位
具备至少2年工作经验
具备有竞争力的GMAT/GRE成绩',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '会计学 Accounting; 科技与电子商务 Technology and e-Business; 金融学 Finance; 市场营销 Marketing; 运筹学 Operations; 战略管理 Strategic Management; 决策分析学 Analytics for Decision-Making*',
                    '商科, 工商管理, 商学院', '作为亚洲最富盛名的工商管理项目之一，南洋理工大学工商管理硕士项目在2019年又上榜英国《金融时报》全球MBA排行榜第30位，其吸引着来自世界各地的优秀人才。该项目是为期一年的全日制项目，可以通过五个专业方向的选修课以及全校知名学校的跨学科课程来定制他们的学习之旅 。强调基于应用的学习，学生有机会在南洋（SPAN）开展“实时”战略项目Strategy Projects，在团队中工作，以应对特定组织提出的现实战略挑战。该课程旨在帮助学生成长为具备在全球数字环境中脱颖而出的面向未来的领导者。', '商学院',
                    '工商管理', '7月', '真人单面',
                    '除了加强基本的业务管理技能外，参与者还可以拓宽业务分析、技术、电子商务和可持续发展等领域的知识。此外，参与者可以通过五个专业方向的选修课以及全校知名学院的跨学科课程来定制他们的学习旅程。强调基于应用的学习，参与者有机会参与南洋理工大学 (SPAN) 的“实时”战略项目“战略项目”，他们以团队形式工作，解决特定组织提出的现实战略挑战。参与者还将参加全面的领导力课程“全球领导力”(LPG)，并参加沉浸式学习之旅“商业考察团”(BSM)，这个是与全球60所大学合作的交流和暑期项目，学生可以自由选择其中一个开展实地考察。常规的目的地包括阿根廷、日本、缅甸、蒙古、新西兰和南非等。就业服务：毕业生可以从事管理人员会计、市场营销、商法、组织行为学与管理、企业财务、决策学、组织内的咨询、人力资源管理概论、有效的领导学、纠纷管理、项目管理、风险管理等工作。招生特点：申请人需要至少两年工作经验，具备良好G的成绩。', 'https://www.ntu.edu.sg/education/graduate-programme/nanyang-mba'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0', 'MSc Technology and Design (Human-Centred Design)', '科技与设计（人本设计）理学硕士', 
                    '1年', 54500.0, '要求相关学科背景，至少拥有文学学士/理学学士学位。有兴趣且拥有非相关专业本科学位的学生可能会根据具体情况进行考虑；相关工作经验将被考虑录取',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '设计创新 Innovation by Design; 用户体验 1：了解文化和行为 User Experience 1: Understanding Culture and Behaviour; 设计伦理 Design Ethics; 设计科学 Design Science; 用户体验 2：人类行为、技术和设计 User Experience 2: Human Behaviour, Technology and Design; 以人为本的设计的编码和人工智能 Coding and AI for Human-Centred Design; 设计与技术管理 Management of Design and Technology',
                    '社科, 其他社科, 硕士项目', '新加坡科技设计大学科技与设计（人本设计）理学硕士项目将把学生塑造成技术领域的人类专家，在每一个环节都强调以用户为中心。通过了解技术如何与人类行为和不同文化相互作用，该项目的毕业生将获得使设计更具包容性、公平性和社会责任感的技能，从而扩大设计影响力和市场潜力的范围。', '硕士项目',
                    '其他社科', '9月', '无',
                    '无', 'https://www.sutd.edu.sg/programme-listing/mtd-human-centred-design/'
                );
-- 插入programs表数据 (批次 13/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Asset and Wealth Management', '资产与财富管理理学硕士', 
                    '1年', 81750.0, '具有相关课程的良好学士学位
具备至少2年工作经验
具备有竞争力的GMAT/GRE成绩',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '合规、伦理及投资管理工具 Compliance, Ethics & Tools of Investment Management; 财务报表分析 Financial Statement Analysis; 金融市场经济学 Economics for Financial Markets; 数据科学与金融科技 Data-Science and Fintech; 权益与固定收益分析 Equity and Fixed Income Analysis; 公司金融 Corporate Finance; 投资产品策略 Investment Products Strategies',
                    '商科, 金融, 商学院', '南洋理工大学资产与财富管理理学硕士项目为期一年，该计划由财富管理学院（WMI）和南洋商学院（NBS）联合开发，旨在满足资产和财富管理领域对训练有素的专业知识日益增长的需求。这个为期一年的计划旨在培养面向未来的资产和财富管理专业人士，符合新加坡银行与金融学院（IBF）建立的最新行业技能框架。凭借WMI在基于实践的资产和财富管理教育方面的深厚行业联系和领域专业知识，以及一流大学的实力，资产与财富管理理学硕士项目为学生提供与当前和未来行业保持相关的前沿课程。', '商学院',
                    '金融', '7月', '真人单面',
                    '该项目由财富管理学院（WMI）和南洋商学院（NBS） 联合开设，包括两个专业方向：资产管理和财富管理。



招生特点：该项目偏向招录有2年以上的行业工作经验者，需要带GMAT/GRE申请，相对来说不太卡院校背景，往年录取过不少的双非学生，看重软件经历；初审通过后的同学会收到面试邀请，约10分钟左右的zoom面试。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-asset-wealth-management'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Urban Design', '城市设计文学硕士', 
                    '1年', 49050.0, '具有学士学位或以上学历，需要以设计为基础的建筑环境学科背景（建筑、城市或空间规划、景观建筑、环境设计）；或
具有学士学位或以上学历，需要相关学科背景（如房地产、交通规划、建筑环境、项目管理、人文地理学）
具备相关专业经验者优先考虑
需要提交1份设计作品集',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '城市设计工作室 Urban Design Studio; 城市设计理论及要素 Theory and Elements of Urban Design; 规划过程：量化和政策 Planning Process: Quantitative and Policy Dimensions; 城市设计和城市分析的方法 Methods of Urban Design and Urban Analysis; 可持续城市设计和发展 Sustainable Urban Design and Development; 论文 Dissertation; 环境规划 Environmental Planning',
                    '社科, 建筑, 工程学院', '新加坡国立大学城市设计文学硕士项目为期一年，项目课程以两个城市设计工作室和一套理论、方法和技术模块为基础。学生可以参加海外实地考察、实习实习和研究活动，以拓宽他们的视野，丰富他们的学习。新加坡国立大学城市设计文学硕士项目具有独特的优势，可以利用新加坡的经验及其作为该地区和世界中心枢纽的作用。为了应对瞬息万变和日益复杂的城市现实，该计划为学生提供了无与伦比的学习机会，利用新加坡和亚洲城市作为设计创新和实验室的经验。新加坡国立大学城市设计文学硕士旨在为毕业生提供前沿知识、社会责任感、创业精神和所有必要的技能，在快速城市化的世界中推动城市设计专业。该项目的学习围绕几个关键领域进行组织：1）高密度城市环境及其物理结构和社会条件；2）技术进步和数据增强设计；3）社会参与和社区发展；4）设计中的系统思考和协作。', '工程学院',
                    '建筑', '8月', '真人单面',
                    '该项目旨在为亚洲及全世界培养未来城市设计领袖。MAUD项目基于两门城市设计课(studio)，以及一系列理论、方法论和技术课程，实现跨学科教育。通过海外实地考察、实习和研究活动，学生得以开拓眼界，丰富所学，与行业互动。依托新加坡的经验及其作为区域及世界中心枢纽的战略位置，该项目具有独特的优势，使学生获得：1. 以全球视野应对亚洲城市挑战2. 新加坡作为高密度城市化的实验室3. 与业界和管理者深度产学合作4. 以“协作式学习”培育领导力就业服务：城市设计硕士项目的校友们活跃于城市建设、科学研究、公益服务、创意产业等领域：从设计公司到非政府组织，从地产开发商到政府部门，从城市设计咨询机构到创意行业。一些毕业生成为了企业家，也有的学生选择攻读博士学位并从事科研工作。MAUD与新加坡规划、建设、住房相关的公共部门（如市区重建局URA等）和知名设计、咨询机构（如DPArchitects等）建立了多样的合作关系。这些企业为MAUD学生提供优先实习机会。选择毕业设计（Dissertation）的学生还有机会与实践机构合作发展其研究和设计，由专业人士和本系教师共同指导。招生特点：申请者需要提供作品集，有工作经验优先；classsize小，2020/21学年共录取34人', 'https://cde.nus.edu.sg/arch/programmes/master-of-arts-in-urban-design/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Curriculum and Teaching)', '教育学硕士（课程与教学）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀 
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭以及至少1年教学经验，或具备至少3年教学经验或其他教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 课程：理论与问题 Curriculum: Theories and Issues; 精心设计课程 Crafting the Curriculum; 教育和学习中的评估：理论、矛盾与问题 Assessment in Education and Learning: Theories, Tensions and Issues; 理解教师与教学：理论与实践 Understanding Teachers and Teaching: Theory and Practice; 学习理论与观点 Theories and Perspectives of Learning; 课程实施与教育变革：概念与问题 Curriculum Implementation and Educational Change: Concepts and Issues',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（课程与教学）项目旨在促进经验丰富的教育工作者的成长，他们致力于发展课程和教学方面的专业知识，该课程为学生提供从设计、实施到评估课程制定过程的基础知识和理论基础，对本地和国际背景下的课程问题有知情和批判性的理解，让学生领会作为课程领导者的角色和责任。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(curriculum-and-teaching)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0', 'MSc Technology and Design (Sustainable Product Design)', '科技与设计（可持续产品设计）理学硕士', 
                    '1年', 54500.0, '要求工程、计算机和应用科学等科技学士学位。有兴趣的候选人若拥有非相关专业的本科学位，可能会根据具体情况进行考虑；相关工作经验将被学校考虑
没有相关学位的申请人可以提交一份作品集，突出他们的技能、能力和经验，以增强他们的申请',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '设计创新 Innovation by Design; 数字化制造 Digital Manufacturing; 设计中的材料和制造工艺选择 Materials and Manufacturing Process Selection in Design; 设计科学 Design Science; 可持续发展设计 Design for Sustainability; 设计项目1 Design Project 1; 产品展示、制造和装配 Product Representation, Manufacturing and Assembly',
                    '社科, 其他社科, 硕士项目', '新加坡科技设计大学科技与设计（可持续产品设计）理学硕士项目以设计核心与可持续发展选修课交织在一起为特色。它利用 SUTD 的教学法，通过提供设计科学和设计创新的基础来培训学生应对未来的挑战，这是技术和设计理学硕士课程的显着特点。', '硕士项目',
                    '其他社科', '9月', '无',
                    '无', 'https://www.sutd.edu.sg/programme-listing/mtd-sustainable-product-design/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (International Business Law)', '国际商法法学硕士', 
                    '1年', 35850.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '普通法推理与写作 Common Law Reasoning & Writing; 债权法（普通法） Common Law of Obligations; 公司法基本元素 Elements of Company Law; 海上货物运输法 Carriage of Goods by Sea; 中国企业和证券法 Chinese Corporate & Securities Law; 跨境贸易和跨国商法 Cross-Border Transactions & Transnational Commercial Law; 亚洲对外直接投资法律 Foreign Direct Investment Law in Asia',
                    '社科, 法律, 法学院', '新加坡国立大学法学院和中国顶级法律院校华东政法大学于2005年7月联合开设了国际商法法学硕士项目。新加坡国立大学国际商法硕士项目采取全英文授课，课程部分在新加坡授课，部分在上海授课。这也是新加坡国立大学法学院推出的首个海外合作项目。成功修毕本项目的学生将获得由新加坡国立大学独立颁发的国际商法硕士学位证书（即学位证书不是两校联合颁发的）。随着新加坡和中华人民共和国之间的合作不断扩大，新加坡国立大学推出了国际商法法学硕士项目，这是新加坡国立大学法学院向全球顶尖法学院这一奋斗目标跨出的创造性的一步。事实上，新加坡国立大学法学院在课程设置及发展方面已经处于领先水平，法学专业的教学更趋国际化水平，有了比较明确的定位。国际商法硕士项目拥有一流的教学人员，均毕业于世界各地卓越的法学院校，他们突出的教研活动在国际商法领域产生了重要的影响。中国当局对该项目的认可及合作进一步证明了新加坡国立大学法学院无论是在亚洲还是在全球都具有无可比拟的声誉，中国与新加坡国立大学合作项目的不断增加也充分证明了我院的科研及教学实力。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '这个项目是新加坡国立大学法学院和华东政法大学于2005年7月联合开设的，采取全英文授课，部分在新加坡授课，部分在上海授课。成功毕业的学生将获得由新加坡国立大学独立颁发的国际商法硕士学位证书（学位证书不是两校联合颁发）。教师的研究中有全球、区域和新加坡独特的法律问题视角，培养学生批判性和创造性思考的能力，使学生成为面向全球的律师。就业服务：毕业生可以进入律师事务所工作，负责国商业案件；担任跨国公司的高级法务，负责跨国贸易、兼并与收购等商业活动中涉及到的法律问题；进行国际商法领域的研究工作。招生特点：招生名额在50左右，竞争比较激烈，有难度。专业有笔面试，申请阶段需要寄送纸质材料。NUS法学院的专业每年申请期差不多都是9.15-11.15，雅思要求7，最好尽早把语言考出来。', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Pharmacy (Clinical Pharmacy)', '药学（临床药学）硕士', 
                    '1年', 50522.0, '具有以下学位之一或同等学历并达到二等二荣誉学位（或同等水平）：药学（荣誉）理学学士/（荣誉）药学学士
未达到规定学位/荣誉等级以及具有海外大学同等学位目前不在新加坡执业的申请者必须提交GRE
需要提交存款证明45,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '讲座与教学 Seminar & Teaching; 临床药代动力学与治疗药物监测 Clinical Pharmacokinetics & Therapeutic Drug Monitoring; 高级药物治疗 I Advanced Pharmacotherapy I; 高级药物治疗 II Advanced Pharmacotherapy II; 高级药物治疗 III Advanced Pharmacotherapy III; 特殊人群的高级药物治疗 Advanced Pharmacotherapy in Special Populations; 药物经济学 Pharmacoeconomics',
                    '社科, 药学, 理学院', '临床药学是一个充满活力的实践领域，需要药剂师不断发展他们的技能和知识。随着社会医疗保健需求的扩大，药剂师在医院、社区或初级保健等各种环境中提供护理方面的作用将继续增长，研究生培训为成为高级通才和专业药剂师提供了途径，以满足这些日益增长的需求。
新加坡国立大学药学（临床药学）硕士课程旨在提高学生的临床知识和实践技能，以提供以病人为本的服务，培养学生在专业发展中的应变能力和进取精神。此外，混合学习的教学方法与课堂案例讨论、辩论和口头报告相结合，将培养学生的质疑精神，促使学生挑战当前的临床药学实践，并带头发起创新的临床项目。此外，这样的课堂活动将使学生成为有效的沟通者，表达和捍卫自己的想法。
新加坡国立大学药学（临床药学）硕士项目的预期学习成果是将高水平的知识、批判性分析、问题解决和基于证据的决策应用于临床实践；管理急性和慢性疾病日益增加的复杂性和负担；实施药品质量使用原则；批判性地评价文献以提出研究问题；综合临床和循证信息，与一系列医疗保健专业人员和患者进行沟通；在临床实践中展现领导力和创新精神；反思学习和表现，以制定持续的专业实践发展。', '理学院',
                    '药学', '8月', '无',
                    '无', 'https://pharmacy.nus.edu.sg/study/postgraduate-programmes/master-of-pharmacy-clinical-pharmacy-programme/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Science of Learning', '学习科学理学硕士', 
                    '1年', 49050.0, '具有以下领域的学士学位：心理学、教育学、神经科学、认知科学、学习科学，或科学/技术相关领域（如工程、科学），或数学/统计学；或
具有学士学位以及相关工作经验，偏好K-12教育、教师专业发展、继续教育和培训或其他相关成人教育；或
具有相关的南洋理工大学FlexiMasters且成绩优秀，并具备相关工作经验，偏好K-12教育、教师专业发展、继续教育和培训或其他相关成人教育。',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '学习科学基础 Foundations in Science of Learning; 学习科学：研究方法 Science of Learning: Research Methods; 学习科学学习分析 Learning Analytics for Science of Learning; 教育神经科学：原理、观点、实践 Educational Neuroscience: Principles, Perspectives, Practices; 人工智能与神经科学交叉教育 Education at the Intersection of Artificial Intelligence and Neuroscience; 翻译教育神经科学 Translating Educational Neuroscience; 大脑、行为、认知 Brain, Behaviour, Cognition',
                    '社科, 教育, 教育学院', '生物学和神经科学的进步展示了我们的大脑和认知发展是如何受到学习经验和环境的影响的。南洋理工大学学习科学理学硕士是一个独特的跨学科课程，学生将获得强大的学习科学基础，并了解神经科学、认知科学、认知科学的最新进展。技术涉及教育的基本问题——人们如何学习，以及我们可以用来优化学习的工具。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-science-(science-of-learning)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Supply Chain Management', '供应链管理理学硕士', 
                    '1年', 55590.0, '持有认可院校颁发的工程、科学、计算机、数学、工商管理或任何相关学科的荣誉（优异）学位或同等学历 
酌情优先考虑在物流/供应链管理行业具备至少2年工作经验的申请者',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '供应链管理思想和实践 Supply Chain Management Thinking and Practice; 供应链协调和风险管理 Supply Chain Coordination and Risk Management; 供应链系统建模 Modelling for Supply Chain Systems; 课题研究项目 Research Project; 供应链运营规划与管制 Operations Planning and Control; 工程概率和仿真 Engineering Probability and Simulation; 物流系统 Material Flow Systems',
                    '商科, 供应链管理, 工程学院', '如今，新加坡国立大学供应链管理理学硕士课程已经享有很高的声誉，受到越来越多的人的欢迎。新加坡国立大学供应链管理理学硕士课程是一项跨学科的课程，融合了亚太物流研究院、新加坡国立大学工程学院的工业与系统工程系以及商学院的决策科学系等多个院系的共同努力。
新加坡国立大学供应链管理理学硕士课程适合已在工程学、数学、计算机学、工商管理和其他相关学科取得荣誉学位、且想要在物流与供应链产业领域提升自身工作能力的毕业生。
新加坡国立大学供应链管理理学硕士课程的师资力量融合了来自亚太物流研究所、工业与系统工程系以及决策科学系的顶尖学者，并已获得新加坡最高经济规划部门、经济发展局、新加坡劳动力发展局、新加坡标准委员会、新加坡国家生产力与生产标准以及中小企业促进局的认可。
新加坡国立大学供应链管理理学硕士课程融合了商业与工程学科的知识教学，旨在全面培养学生在规划、设计和运营亚太地区现代化供应链方面的能力；尤为强调让学生应用决策和分析理论解决现实问题。同时，通过参与必修的工程项目，学生将能够有效地胜任物流与供应链行业内的工作。学生还将有机会到物流与制造公司进行参观考察。
课程完成之际，供应链管理理学硕士课程的毕业生将能够掌握全球物流知识和工业工程知识，从而更好地承担物流与供应链行业内具有挑战性的工作。', '工程学院',
                    '供应链管理', '1/8月', '无',
                    'SCM课程致力于培养亚洲中高级专业人员成为物流和供应链管理方面的专家，课程设计注重应用商业和工程概念解决实际问题，通过基于行业的项目接触物流/供应链行业，并辅以实地考察。新加坡国立大学提供的供应链管理教育获得了业界的广泛认可。该项目旨在为学生提供全面的供应链管理知识、技能和工具，培养具有全球化视野的领导者和管理者。



就业服务：该专业的毕业生通常在企业运营、物流、采购、供应链管理等领域就业，涉及行业包括制造业、零售业、物流服务商、咨询公司、技术公司等。招聘企业包括阿里巴巴、华为、宝洁、三星、IBM等知名企业。

招生特点：NUS的SCM项目每年有两次招生，分别在1月和8月。申请时间分别约为5周和16周。已成功提交申请的同学可在5月下旬 (8月入学)/11月中旬(1月入学)查看录取状态和结果，录取结果公布后，会发送通知。被录取的学生将通过收到录取的详细信息。此外，985同学可以带奖申，物流专业，87以上分数中奖概率高。

班级概况：22fall班级整体人数100+，中国学生占70%-80%。非全日制基本是当地学生在读，全日制基本是中国人和少数的印度和印度尼西亚学生。同学背景方面，本科很多都是985、211或海本，例如武汉大学，四川大学，上海海事大学，东南大学，苏州大学，澳门科技大学等学校，还有新加坡国立的本校学生在读。专业背景方面，大部分是物流、交通、计算机等专业。', 'https://tliap.nus.edu.sg/education/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Applied Psychology', '应用心理学文学硕士', 
                    '2年', 43491.0, '1. 申请咨询心理学方向：
具有良好的心理学专业本科学位，达到荣誉学位（偏好二等一及以上水平）
必须已完成基本的咨询技巧培训<（12-40小时）br>
必须在毕业后具备至少2年相关全职工作经验，相关工作经验包括在社区、学校、诊所或同等环境中为高危人群或弱势群体提供咨询
2. 申请教育心理学方向：
具有良好的心理学专业本科学位，达到荣誉学位（偏好二等一及以上水平）
必须在毕业后具备至少2年相关全职工作经验，相关工作经验包括在教学或教育评估方面的直接工作，或在社区、学校、临床或同等环境中对有特殊教育需要的儿童或处于危险或弱势群体进行干预',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '辅导理论和技巧 Theories and Techniques of Counselling; 心理评估 Psychological Assessment; 应用心理学研究方法 Research Methods in Applied Psychology; 应用心理学统计分析 Statistics in Applied Psychology; 心理测量 Psychological Testing; 高级辅导技巧 Advanced Counselling Skills; 整个人生跨度上的心理障碍 Psychological Disorderes Across the Life Span',
                    '社科, 心理学, 教育学院', '新加坡南洋理工大学教育学院应用心理学文学硕士课程旨在培养心理咨询领域的领导者。近年来，社会各界对在校学生心理咨询及就业辅导的重要性认识日益提高。随着各个高校精神关怀和就业辅导项目的引入，越来越多的老师积极主动地丰富自身关于心理辅导的知识和技能。一些小学开设的学习支援计划也突出强调了当下教育心理学家在学校所扮演的重要角色。同时，随着新加坡家庭服务中心如雨后春笋般地涌现，社区中心理咨询机构的队伍也不断壮大。为了满足客户不断变化的需求和服务项目的扩充，各种社会机构对专业心理辅导者和心理学家的需求也与日俱增。新加坡南洋理工大学应用心理学文学硕士课程为学生提供专业的理论知识，加深其理论见解，提升其实践技能，将那些有一定专业资质并且对心理学专业感兴趣的学生培养成为教育心理学和辅导心理学领域内的专家。', '教育学院',
                    '心理学', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-arts-(applied-psychology)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Architecture', '建筑学硕士', 
                    '2年', 40000.0, '申请者需要具备建筑学士荣誉认可学位或建筑学士认可学位必须提供国家认证委员会或原籍国建筑师委员会或新加坡建筑师委员会的认证证明，并且经过研究生院批准，需要完成Form A表格需要提交作品集',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '研究方法论 Research Methodology; 高级建筑技术 Advanced Architectural Technology; 城市设计理论与设计元素 Theory & Elements Of Urban Design; 设计课（七） DESIGN 7; 设计课（八） DESIGN 8; 论文 Dissertation; 建筑实践（一） Architectural Practice 1',
                    '社科, 建筑, 工程学院', '新加坡国立大学建筑学硕士项目是亚洲领先的建筑设计和研究课程。该项目的战略目标是让学生在瞬息万变的全球环境中为建筑专业职业做好准备，并为他们提供在新加坡内部以及通过区域和国际视角开发的经验。该硕士项目由世界一流的学者和实践者团队推动，通过五个研究集群专注于研究驱动的思维和方法：设计研究；历史、理论与批评；技术；都市主义；和景观研究。新加坡国立大学建筑学硕士项目允许学生在高级水平上扩展设计智能技术和创造性实践研究，并在建筑学科内进一步讨论。一系列研讨会、专题讨论会、客座讲座、实习机会、交流和实地研究将补充这一先进的设计课程。', '工程学院',
                    '建筑', '8月', '无',
                    '无', 'https://cde.nus.edu.sg/arch/programmes/master-of-architecture/'
                );
-- 插入programs表数据 (批次 14/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Developmental Psychology)', '教育学硕士（发展心理学）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 社会与情感发展和评估 Social and Emotional Development and Assessment; 儿童认知发展与评估 Children Cognitive Development and Assessment; 儿童及青少年辅导 Counselling Children and Adolescents; 动机、意志与实践学习 Motivation, Volition and Learning-in-Action; 个体差异与学习 Individual Differences and Learning; 态度测量与个性评估 Attitude Measurement and Personality Assessment',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（发展心理学）项目旨在为教育专业人员如中小学教师和辅导员提供对认知、社会和情感发展的深入知识和理解，课程讨论的主题包括儿童和青少年的认知、社会、情感和道德发展、有关青年的当前问题和基本咨询技巧。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(developmental-psychology)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Finance', '金融学理学硕士', 
                    '1年', 71940.0, '具有良好的本科学位，不限专业背景
精通英语和普通话
具备良好的GMAT/GRE成绩
有相关领域工作经验者优先考虑(不强制要求）
该专业为中英文授课',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', 'Excel在金融领域的应用 Excel for Finance 先修课程; Python在金融领域的应用 Python for Finance 先修课程; 财务会计基础 Foundation to Financial Accounting 先修课程; 实习 Internship 选修课程; 公司金融 Corporate Finance; 财务会计与分析 Financial Accounting & Analysis; 投资学 Investments',
                    '商科, 金融, 商学院', '新加坡南洋理工大学金融学理学硕士课程设计旨在培养年轻的双语高管，他们的目标是在中国或者是在以中国经济为目标的地区取得成功的金融生涯。该项目为学生提供在全球金融市场中脱颖而出所需的稳健的和现实的业务基础和国际知名度。这使学生能够发展他们的技能和潜力来挑战既定的范式。', '商学院',
                    '金融', '7月', '真人单面/机面（kira）',
                    '采用中/英文双语授课，项目总时长约一年半，上课时间为一年，分为四个学期（由1个pre-term学期和3个正式的trimester学期组成），每学期3-4门课。在前三个学期结束后，可以选择6月毕业（一年毕业），也可以选择继续参加Term 4的internship module，参加当年的暑期实习，可于次年1月毕业（一年半毕业）



就业服务：NBS配备完善的就业服务，职业发展中心采用定制化职业发展培训体系，为学生提供专业的职场发展指导和技能训练。此外商学院校友遍布中国和新加坡的各大金融机构和企业，为学生投身于国际金融、投资及银行等领域提供强大的支持。就业去向包括投行、投资、基金、互联网、银行、会计师事务所等。 

招生特点：TOEFL 100+/ IELTS 7.0+，GMAT/GRE从最早的选择性提交到现在变成必须项，建议700/325,；而审理从笔试+面试简化为仅进行面试，看重综合背景。Class size在100人左右，中国学生占比较高，主要来自985和两财一贸，以及部分211院校和海本。此外南洋理工大学与北京大学于2018年9月正式启动双硕士联合培养学位项目，申请者需首先获得北大的硕士资格。

班级概况：22fall班级整体人数在100人左右，基本都是中国学生。同学背景方面，以985和211本科学生居多，大多来自清华大学、北京大学、复旦大学和上海交通大学，大约有25个左右，还有5-10个海本学生。另外还有已经工作的学生，是银保监会和证监会派来学习的。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-finance'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Quantitative Finance', '量化金融理学硕士', 
                    '1.5年', 39967.0, '- 不要求具备工作经验（任何相关经验可能会有助于申请）
- 具有声誉好的院校颁发的良好本科学位（不限专业背景，有一定程度的数学严谨性）
- 适合对可以用于解决定价、对冲、风险管理、算法交易、投资组合管理和其他前沿金融应用中的实际问题的定量和计算技能充满热情的申请者
- 具有良好的GMAT/GRE/SMU入学考试成绩
- 需要提供经认证的CFA/ACCA证书复印件（如有）
- 需要提交2篇个人陈述，其中1篇需要对指定问题（2选1）进行回答',
                    NOW(), NOW(), '无', '资产定价 Asset Pricing; 数值方法（一） Numerical Methods I; 金融市场定量分析 Quantitative Analysis of Financial Markets; 衍生金融投资工具 Derivatives; 金融市场计量经济学 Econometrics of Financial Markets; 数值方法（二） Numerical Methods II; 固定收益证券 Fixed Income Securities',
                    '商科, 金工金数, 商学院', '新加坡管理大学数量金融理学硕士课程的使命是培养高素质的专业人才，这些人才将受到全球和地区银行、量化对冲基金、资产管理公司以及新加坡监管机构的高度追捧。随着全球金融业在风险管理、产品创新和自营交易方面越来越成熟，对定量金融专业人员的需求也在增加。新加坡管理大学数量金融理学硕士课程随着这一上升趋势而蓬勃发展。', '商学院',
                    '金工金数', '8月', '真人单面',
                    '无', 'https://masters.smu.edu.sg/programme/msc-in-quantitative-finance'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (Maritime Law)', '海商法法学硕士', 
                    '1年', 41300.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '租船合同 Charterparties; 海上货物运输 Carriage of Goods by Sea; 国际和比较石油和天然气法 International and Comparative Oil and Gas Law; 国际商务仲裁 International Commercial Arbitration; 海商法 Maritime Law; 多式联运法 Multimodal Transport Law; 亚洲海洋法与政策 Ocean Law & Policy in Asia',
                    '社科, 法律, 法学院', '新加坡国立大学海商法法学硕士（海商法方向）课程由新加坡国立大学法学院提供。该专业使学生能够获得与商业航运、海上保险、航运监管和海洋政策相关的法律事务的专业知识。这些知识对新加坡（鉴于其作为全球港口的地位）以及该地区都非常重要。希望专攻海商法的学生必须完成至少24门海商法学科组模块，包括必修模块海上货物运输（5个模块学分）和租船合同（5个模块学分）。来自非普通法司法管辖区的学生必须在第一学期学习新加坡普通法合同。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '无', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Audiology', '听力学理学硕士', 
                    '2年', 41700.0, '具有认可大学颁发的良好学士学位，需要联合健康、科学、生命科学或工程背景，或在特殊情况下会考虑研究生委员会批准的其他资格和经验
优先考虑具有荣誉学位、适当工作经验以及解剖学、生理学、心理学或语言病理学相关背景的申请者',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '声学 Acoustics; 解剖学和生理学 Anatomy & Physiology; 声音和言语知觉 Perception of Sound & Speech; 听觉装置及康复 Hearing Devices & Rehabilitation; 临床听力学 Clinical Audiology; 儿科听力学 Paediatric Audiology; 电生理学评估 Electrophysiology Assessment',
                    '社科, 医学, 杨潞龄医学院', '听力学是一个不断扩大的领域，涉及听力，平衡和相关疾病的研究。 新加坡国立大学听力学理学硕士项目为两年制，作为一个医疗保健科学专业，致力于帮助个人及其家人减轻或克服听力问题及平衡问题带来的影响。

完成课程后，学生将获得听力科学的强大理论基础，发展实践能力，并对以下方面具有良好的欣赏：
成人和儿童的听力障碍和听觉障碍相关系统的评估，诊断和管理。
成人平衡功能障碍的评估，诊断和管理。
成人和儿童的助听器评估，验证和确认。
针对成人和儿童的可植入设备（例如耳蜗植入物，骨锚式助听器和中耳植入物）进行编程。
服务开发和评估所需的研究技能。
与听力障碍的个人和家庭合作的基本咨询技巧。
多学科团队合作的沟通技巧。
公共卫生挑战和有效的听力保健。
新加坡和亚洲独特的教育，研究和临床重点。
坚强的卓越精神，不断学习，创新和社区服务。', '杨潞龄医学院',
                    '医学', '8月', '无',
                    '无', 'https://blog.nus.edu.sg/audiology/msc-audiology/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Marketing Science', '市场营销学理学硕士', 
                    '1年', 63220.0, '具有良好的学士学位，不限专业背景
可选择性提交GMAT/GRE
不要求具备工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '战略营销 Strategic Marketing; 品牌 Branding; 消费者心理学 Consumer Psychology; 数字营销 Digital Marketing; 人种学 Ethnography; 消费者神经科学和神经营销 Consumer Neuroscience and Neuromarketing; 市场营销分析 Marketing Analytics',
                    '商科, 市场营销, 商学院', '南洋理工大学市场营销理学硕士旨在利用最新的思维、技术和工具开发全面的营销专业知识。该硕士课程给学生提供营销和消费者洞察的基本知识以及营销技术的最新知识，例如营销中的AR/VR和AI，使学生能够在这个数字时代领导营销活动。', '商学院',
                    '市场营销', '7月', '真人单面/真人群面',
                    '该项目并不算一个新开项目，是在20fall的时候由part-time的Marketing and Consumer Insight改为了full-time的Marketing Science。



招生特点：该项目录取的同学分数大多在85分及以上，陆本海本均可，陆本主要集中在985/211的学生。并且该项目对应届生比较友好，但是也需要有至少2段实习经历。GMAT分数建议在680+，如果分数考的比较低也可以不带着GMAT/GRE申请。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-marketing-science'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Venture Creation', '企业开发理学硕士', 
                    '1年', 61040.0, '具有学士学位（偏好荣誉学位）
对创业和创新有浓厚的兴趣，包括参与创业活动；或具有科学、技术、工程与数学（STEM）背景；或具备至少1年工作经验',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '精益创业实践 Lean Start Up Practicum; 新创企业 New Venture Creation; 实习 Internship; 商业相关模块 Busines-related Modules; 技术管理相关模块 Management of Technology-related Modules; 基于技术模块 Technology-based Modules; 两周暑期创业计划 Two-week Summer Programme in Entrepreneurship',
                    '商科, 创业与创新, 继续与终生教育学院', '新加坡国立大学风险企业创业理学硕士项目旨在转变思维方式并加速将想法变为解决方案。通过提供业务发展指导、获得新加坡国立大学技术的机会以及建立网络市场准入机会，成功培养有抱负的企业家。学生可以接触热门话题，如工业4.0、数字链供应、网络安全、生物技术、医疗技术和金融技术。', '继续与终生教育学院',
                    '创业与创新', '8月', '笔试/机面（kira）/真人群面/真人单面',
                    '本项目的注重培养创业思维并付诸实践。



就业服务：创业；互联网行业；快销行业。

招生特点：本项目不接受海本免语言申请，必须满足母语和授课语言都是英语才能免除语言要求。录取背景较为多元化，海本学生较多，剩余录取中985、211学校居多，也有中外合办双非学校；商科本科居多，但也有理工科、社科本科录取。学生接受录取通知后，专业会联系学生，并提供简历和个人陈述的模板，帮助学生投递相匹配的公司，通过双向选择后，获得实习offer。

班级概况：22fall班级整体人数在100+，中国学生占比90%。同学背景方面，海本同学较多，国内同学基本都是985和211。', 'https://scale.nus.edu.sg/programmes/graduate/msc-in-venture-creation'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Drama)', '教育学硕士（戏剧）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，最好修过戏剧教育、戏剧或表演研究或应用戏剧课程，或具有相关的南洋理工大学FlexiMasters且成绩优秀 
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少2年以下一项或多项工作经验：戏剧教育、戏剧/表演制作、应用戏剧和其他相关戏剧/剧场工作',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 戏剧制作 Theatre Making; 戏剧教育、课程与评估 Drama Education, Curriculum & Assessment; 教师作为辅助演员 The Teacher as Facili-Actor; 以艺术为基础的研究 Arts-based Research; 从页面到舞台 Page to Stage; 社区戏剧 Theatre in the Community',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（戏剧）项目旨在为学生提供戏剧方面的高级学术研究和戏剧与戏剧教育专业实践的机会，课程涉及戏剧表演和过程及其在教育环境中的应用，以及戏剧学习和表演所需的多学科方法，讨论了戏剧教育学的理论和实践问题，重点是戏剧和戏剧教育的当代问题，学生将深入了解戏剧和戏剧教育的创作过程，包括表演，以及戏剧作为一门学科和学习工具的教学技巧，学生还将探索戏剧的功能和各种背景下的戏剧。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(drama)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Counselling and Guidance', '咨询与指导文学硕士', 
                    '1.5年', 34880.0, '具有认可大学颁发的学士学位或同等学历，偏好达到荣誉学位的申请者，需要相关学科如教育学、心理学、社会工作或社会科学
学校只会考虑具备适合辅导专业的个人特质及才能并有潜力为社会作出贡献的申请者，对获得MACG学位后成为专业咨询师有明确职业道路的申请者将优先考虑
在直接辅导工作、社会/精神健康服务部门有相关经验，或主修教育、心理学、社会工作或社会科学等相关领域专业者，将获优先考虑
应届毕业生无法申请秋季入学',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '咨询辅导中的伦理、法律和职业问题 Ethical, Legal and Professional Issues in Counselling; 多元文化辅导 Multicultural Counselling; 毕生发展心理学 Life-Span Development Psychology; 职业发展和辅导 Career Development and Counselling; 辅导与心理治疗理论 Theories of Counselling and Psychotherapy; 高级辅导和谈话技能 Advanced Counselling and Interviewing Skills; 团体历程和辅导 Group Process and Counselling',
                    '社科, 心理学, 教育学院', '新加坡南洋理工大学国立教育学院咨询与指导文学硕士项目是一个以课程作业为导向的专业学位，旨在为新进入咨询和指导领域的人做好准备，成为高素质和关心别人的咨询师。它还旨在提高咨询师硕士的知识和技能，并为那些可能希望以后攻读博士学位的人做好准备。', '教育学院',
                    '心理学', '8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-(counselling-and-guidance)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Landscape Architecture', '景观建筑硕士', 
                    '2年', 49050.0, '具有景观建筑学士（荣誉）学位或知名大学颁发的同等学历；或
具有学士学位或以上学历，需要以设计为基础的建筑环境学科背景，例如建筑学、城市设计、城市规划、环境设计
需要提交1份设计作品集',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '园林设计导论 Introduction to Landscape Architecture; 园林设计历史和理论 History and Theory of Landscape Architecture; 热带植物鉴别 Tropical Plant Identification; 园林设计工作室：住宿 MLA Studio: Quarter; 地理设计 Geo Design; 材料和设计 Material and Design; 园林设计工作室：地区 MLA Studio: Region',
                    '社科, 建筑, 工程学院', '新加坡国立大学景观建筑硕士课程提供两年全日制教学，尤其以亚洲和泛热带地区的城市为研究重点。我们旨在提供园林建筑学教学，积极应对亚洲城市所面临的各类挑战。同时，亚洲地区丰富的人文遗产和文化、社会经济、生态因素为区域城市发展创造了机遇，新加坡国立大学景观建筑硕士课程将牢牢把握这些机遇。作为一所研究型大学，新加坡国立大学针对园林建筑学知识领域的不断发展，采用研究主导型的教学方式。我校坐落于新加坡，城市绿化是我们城市发展的基石，凭借自身文化多样性和国际化的前景优势，新加坡国立大学景观建筑硕士课程为园林建筑人才的培养提供了丰富多彩的学习环境。', '工程学院',
                    '建筑', '8月', '无',
                    '无', 'https://cde.nus.edu.sg/arch/programmes/master-of-landscape-architecture/'
                );
-- 插入programs表数据 (批次 15/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'Double Degree Global Master of Finance (SMU-WUSTL)', '全球金融硕士双学位（新加坡管理大学-圣路易斯华盛顿大学）', 
                    '1年', 118070.0, 'SMU：
- 具有学士学位
- 该课程专为应届毕业生设计，不要求具备工作经验
WUSTL：
- 需要提交职业论文
SMU学费34,880新币，WUSTL学费61,400美元',
                    NOW(), NOW(), '雅思: 6.5; 托福: 95', '期权与期货 Options and Futures; 衍生证券 Derivative Securities; 投资理论 Investment Theory; 高级公司财务—价值评估 Advanced Corporate Finance I-Valuation; 经济分析 Economic Analysis; 财务报表分析（一） Financial Statement Analysis 1; 财务报表分析（二） Financial Statement Analysis 2',
                    '商科, 金融, 商学院', '为了满足金融行业的需求，新加坡管理大学李光前商学院与圣路易斯华盛顿大学开发出一种新的教育模式：全球金融硕士双学位（新加坡管理大学-圣路易斯华盛顿大学）双学位课程（GMF）。新加坡管理大学全球金融硕士双学位（新加坡管理大学-圣路易斯华盛顿大学）课程的学生还可以访问校友和实习联系人的互补网络，扩大职业发展前景。该课程面向国际研究生、希望转行金融行业的高管、希望提高应用金融知识的专业人士或希望攻读金融学位的应届毕业生。', '商学院',
                    '金融', '7月', '机面（kira）',
                    '无', 'https://masters.smu.edu.sg/programme/global-master-of-finance-dual-degree'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Business Analytics', '商业分析理学硕士', 
                    '1年', 65400.0, '具有良好的学士学位，不限专业背景
具备良好的GMAT/GRE成绩
有工作经验者优先考虑（不强制要求），欢迎无工作经验的申请者申请',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', 'Python和R语言编程 Programming in Python and R; 数据管理与可视化 Data Management and Visualisation; 概率论与数理统计 Probability and Statistics; 商业领域中的分析与机器学习 Analytics and Machine Learning in Business; 分析策略 Analytics Strategy; 人工智能与大数据 AI and Big Data in Business; 人工智能与金融中先进的预测技术 AI with Advanced Predictive Techniques in Finance',
                    '商科, 商业分析, 商学院', '南洋理工大学商业分析理学硕士项目针对没有技术背景的应届生和商业专家，旨在教授学生分析的技能使他们更有效地应用到商业领域。该项目的毕业生就业领域广泛，涉及管理，会计，市场营销，金融，公司传播和新闻等。南洋理工大学商业分析理学硕士不仅仅传授分析技能，更秉持实践的态度，让学生学会将技术灵活应用到商业领域。通过分析和使用数据来推动数字化转型，它们有助于重新定义客户体验并使他们盈利。', '商学院',
                    '商业分析', '7月', '真人单面',
                    '由商学院开设的20fall新项目。该项目重视实践技能，让学生能够在真实商业环境中运用课程所学知识。



就业服务：主要分成两个方面，一是求职相关的Workshop，二是校企合作的内推机会。在课程学习期间，学生也可以找实习，比如在星展银行、毕马威和通用电气数字等合作公司实习。学生毕业后主要从事商业分析相关岗位。 

招生特点：偏好海本及985院校背景，G是硬性条件，建议GAMT 700+，GRE 320+。看重编程技能，这点在面试中也会体现，面试会问到编程经历、编程语言软件等。 

班级概况：22fall班级一共有97人，其中71%是中国学生。同学背景方面，海本和985居多。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-business-analytics'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Behavioural and Implementation Sciences in Health', '医疗保健行为与实施科学理学硕士', 
                    '1年', 61803.0, '具有学士学位（偏好荣誉学位），需要健康、医疗保健、心理学、社会科学、社会工作和相关领域背景
优先考虑具有医学学士学位、生命科学（如生物化学、细胞生物学和分子生物学）、生物工程、生物技术或健康科学相关学位的毕业生
具有其他资格和相关行业经验的申请者在项目批准下可能根据具体情况被考虑录取
需要提供存款证明',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '行为和实施科学基础 Fundamentals of Behavioural and Implementation Sciences; 医疗保健领域的循证实践和政策 Evidence-informed Practice and Policies in Healthcare; 行为与实施科学中级研究方法 Intermediate Research Methods for Behavioural and Implementation Sciences; 中级行为与实施科学 Intermediate Behavioural and Implementation Sciences; 健康项目评估 Programme Evaluation in Health; 硕士项目 I Master''s Project I; 硕士项目 II Master''s Project II',
                    '社科, 医学, 杨潞龄医学院', '新加坡国立大学医疗保健行为与实施科学理学硕士项目旨在通过课程作业培养具有行为和实施科学方面深入知识和专业知识的毕业生，并通过以下方式应用于医疗保健环境：
学习最先进的行为和组织变革方法，然后学生将在新加坡乃至更远的地方的医疗保健组织中应用这些方法，
掌握方法和统计方法来评估已证实的干预措施的实施、传播以及临床和人口健康影响，以及
应用经济分析的理论原理和实践技术对于卫生政策和卫生保健决策至关重要。', '杨潞龄医学院',
                    '医学', '8月', '无',
                    '无', 'https://medicine.nus.edu.sg/bisi/master-of-science-in-behavioural-and-implementation-sciences-in-health/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Applied Gerontology', '应用老年学理学硕士', 
                    '1年', 43700.0, '具有良好的学士学位，并且热衷于与老年人一起工作或解决与老龄化相关的问题',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '跨学科视角下的亚洲老龄化 Ageing Asia: Interdisciplinary Perspectives; 亚洲老龄化政策与实践 Ageing Policy and Practice in Asian Contexts; 衰老生理与生物学 Physiology and Biology of Ageing; 老年学应用研究 Applied Research in Gerontology; 人口统计变化、老龄化与全球化 Demographic Change, Ageing and Globalization; 老年护理领导与管理 Leadership and Management in Elderly Care; 系统视角下的持续护理 Continuum of Care: A Systems Perspective',
                    '社科, 社会学与社工, 社会科学学院', '南洋理工大学的应用老年学理学硕士学位课程为快速发展的老年学领域提供全面且先进的教育，适合准备在老龄化相关领域工作或成为老龄化服务环境领域的专业人士的学生。该课程提供跨学科的亚洲重点课程，虽然其核心课程侧重于许多学科共有的老年学基础，但集中课程和选修课将帮助学生提升学习经验，补充个人专业兴趣。该课程不仅开设从社会科学的角度解决人口老龄化挑战的课程，还将开设工程学、设计和医学课程。学生将有机会与公司和学校的老龄化研究中心合作开展白银人口项目。', '社会科学学院',
                    '社会学与社工', '8月', '无',
                    '无', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-applied-gerontology'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Social Work', '社会工作硕士', 
                    '2年', 24525.0, '1. 具有新加坡国立大学社会工作荣誉学位（荣誉（优异）及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B）；需要良好的GRE成绩；或
2. 具有新加坡国立大学相关领域荣誉学位（荣誉（优异）及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B）；需要良好的GRE成绩；并且具备至少5年人力服务行业相关工作经验；或
3. 具有良好的学士学位（平均成绩至少达到B或同等水平）以及新加坡国立大学社会工作研究生文凭（平均成绩至少达到B+）；或
4. 具有良好的社会工作学士学位（平均成绩至少达到B或同等水平）；需要良好的GRE成绩；并且具备至少2年人力服务行业相关工作经验；或
5. 具有相关领域学士学位（平均成绩至少达到B或同等水平）；需要良好的GRE成绩；并且具备至少5年人力服务行业相关工作经验；或
6. 具有研究生院认可的其他资历和经验。除了学历，高水准的工作表现和领导潜力也是录取的重要考虑因素。相关工作经验包括在人力服务或相关组织中的服务。
需要提供存款证明60,000新币
仅供参考：上一届学生的最低分数线为：数学部分30%，语文部分40%，作文部分40%',
                    NOW(), NOW(), '雅思: 6.5; 托福: 85', '家庭系统理论与社工介入 Family Systems Theory and Intervention; 人本服务的管理 Management of Human Service Organizations; 社会福利政策与服务 Social Policy and Welfare Services; 项目发展与评估 Program Development and Evaluation; 面向多重压力家庭的社会工作 Working with Multi-Stressed Families; 贫困与资产形成社会政策 Poverty and Asset-Building Policy; 家暴与人际暴力 Family and Interpersonal Violence',
                    '社科, 社会学与社工, 人文社科学院', '新加坡国立大学社会工作硕士学位项目的培养目标是培养直接实践、社会政策和研究以及社会管理和发展方面的社会工作专业领袖。综合学习、跨学科接触和创新能力建设是社会工作硕士项目的主要教学特点。该学位项目旨在促进学生在每堂课中系统地整合社会工作专业价值观与实践、理论与实践、研究与实践。新加坡国立大学社会工作硕士学位项目还为学生提供跨学科学习机会，让他们可以从学院的其他部门以及其他学院和学校的公共政策、公共卫生和健康科学模块中学习他们特别感兴趣的模块。在社会工作硕士学位计划中，可以培养学生的创新能力，成为面向未来的社会工作专业人士，他们在新加坡社会服务部门具备强大而独特的领导素质和跨部门流动性。', '人文社科学院',
                    '社会学与社工', '8月', '无',
                    '无', 'https://fass.nus.edu.sg/swk/master-of-social-work-by-coursework/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Early Childhood)', '教育学硕士（幼儿教育）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀具有教师资格如新加坡国立教育学院颁发的教育研究生文凭并且具备至少1年教学经验，或具有新加坡幼儿发展署颁发的幼儿保育和教育文凭以及至少3年在幼儿园和/或其他与儿童相关的教学机构/组织的教学经验在新加坡从事学前教育的申请者需要提交由幼儿发展署发出的通知函',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 儿童发展（0-8岁） Child Development (0-8 years); 幼儿教育的问题与趋势 Issues and Trends in Early Childhood Education; 幼儿教育研究调查 Research Investigations in Early Childhood Education; 幼儿教育评估 Assessment in Early Childhood Education; 婴幼儿课程设计 Curriculum Design for Infants and Toddlers; 幼儿教育课程设计与开发 Curriculum Design and Development in Early Childhood Education',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（幼儿教育）项目旨在对幼儿教育的理论和实践进行深入研究，重点是通过联系相关的教育理论和实践，认识和理解早期儿童教育艺术中的问题，理解社会环境、早期儿童课程和教学法，以及意义建构。在当代的教与学观念中，问题通过不同的范式和观点来解决，扩展了幼儿专业人员的知识和专业知识，使他们能够为幼儿制定创新的教学方案。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(early-childhood)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree MBA (NUS-HEC)', '工商管理双学位（新加坡国立大学-巴黎高等商学院）', 
                    '2年', 72503.0, '具有良好的本科学位，具备至少3年专业经验，需要提交GMAT/EA/GRE（强烈建议GMAT百分位排名达到60%，GRE百分位排名达到65%，EA分数不低于150，2019级学生的均分为690）如果具有管理学硕士学位：管理学位排名靠前，申请者就有资格获得考试豁免，并可以加入加速MBA（12个月） 如果具有本科学位：申请者必须在认可的大学完成本科课程，学校将要求提供官方成绩单作为证明，HEC对工作经验年限没有绝对要求，但除了本科学位，学校强烈建议具备至少2年专业经验 如果没有本科学位：在下列情况下申请者可以免除本科学位的要求： - 提供证书证明已经完成中学教育，还必须具备至少5年专业经验，其中至少3年担任管理职位 - 申请者是一名代表国家参加国家级比赛的运动员 理想的候选人具备2到10年的专业工作经验（2025届毕业生的平均工作经验为6年）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '入门课程 Introductory Course; 巴赫游戏 Bach Game; 财务会计与报告 Financial Accounting & Reporting; 金融市场与投资 Financial Markets & Investments; 领导力沟通 Leadership Communication; 管理经济学 Managerial Economics; 通过营销管理客户价值 Managing Customer Value Through Marketing',
                    '商科, 工商管理, 商学院', '新加坡国立大学工商管理双学位课程由共同拥有200多年的卓越高等教育的巴黎高等商学院和新加坡国立大学提供，在为期24个月的双学位课程中，学生将加深对欧洲和亚洲商业惯例和规范的理解，并在两大洲建立自己的专业网络，在新加坡和巴黎交替学习，在欧洲和亚洲最著名的两所学校获得双学位。', '商学院',
                    '工商管理', '1/9月', '无',
                    '无', 'https://www.nus.edu.sg'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Forensic Science', '法医学理学硕士', 
                    '1年', 52320.0, '具有荣誉学士学位或相关学科4年制学士学位；或
具有相关学科学士学位以及至少2年相关工作经验。
相关学科包括：生物学、化学、计算机科学、工程学、地理学、法学、药学、物理学、概率论与数理统计、心理学和社会工作
考虑的相关工作经验包括：执法、调查、一线法医学人员如CSI、律师助理、法医学实验室人员、承销商、伪证调查员等
具有其他资格和经验的申请者将根据具体情况进行考虑
需要提交存款证明45,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '法证科学调查 Survey of Forensic Science; 法医学研究项目 Research Project in Forensic Sceince; 先进犯罪现场调查技术 Adcanced CSI Techniques; 法医国防科学 Forensic Defense Science; 数字法医调查 Digital Forensic Investigation; 法医精神病学和心理学 Forensic Psychiatry and Psychology; 重大案件法医科学 Forensic Science in Major Cases',
                    '社科, 医学, 理学院', '新加坡国立大学法医学理学硕士课程是为已取得学士学位的毕业生而设立的，他们想要继续修读研究生学位或加强法医学方面的知识。该课程旨在让学生了解法医学调查中应用科学技术的基本概念和原理。除基础知识外，本课程旨在提供法医学各分支的多学科知识，如法医学数字证据、法医学辩护科学、高级犯罪现场调查、法医学精神病学和心理学。该课程将训练学生分析和战略性地思考犯罪和法医学，并使他们具备适用于广泛职业的可转移技能。', '理学院',
                    '医学', '8月', '无',
                    '无', 'https://www.dbs.nus.edu.sg/education/graduates/masters-by-coursework/forensic-science/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Urban Planning', '城市规划硕士', 
                    '2年', 49050.0, '具有学士学位或以上学历，需要空间设计学科（建筑学、景观建筑、城市设计、城市规划）或相关研究领域（环境研究、地理学、房地产、土木工程、土地管理）背景；或
具有学士学位或以上学历，需要积极参与城市问题的其他人文与社会科学背景。
优先考虑具备相关专业经验的申请者
空间设计学科背景（建筑学、景观建筑、城市设计、城市规划）的申请者需要提交1份设计作品集
非设计学科的申请者不需要提交作品，鼓励提供与城市规划和设计技能、实践和研究相关的其他证据',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '城市分析工作坊 Urban Analysis Workshop; 城市规划定性研究方法 Qualitative Methods for Urban Planning; 规划过程 Planning Process; 城市与区域经济学 Urban and Regional Economics; 城市规划工作室 Urban Planning Studio; 城市规划史与城市规划理论 Urban Planning History and Theory; 城市设计工作室 Urban Design Studio',
                    '社科, 建筑, 工程学院', '亚洲的城市化进程正以前所未有的速度和规模进行。气候变化、信息通信技术的普及、地缘政治的不稳定性以及日益严重的社会经济不平等现象，都影响着城市的规划、建设和居住方式。面对这些挑战，城市规划专业正在通过批判性地研究现有方法并结合新方法来不断重塑自己。城市规划硕士（MUP）计划借鉴了新加坡和亚洲城市作为规划思想和方法实验室的经验，并尝试了高密度的生活、生态敏感性、数据科学和社会政策，以确保通过发展实现公平。新加坡国立大学城市规划硕士项目是一个为期两年的全日制多学科计划，是建筑学系和房地产学系的联合倡议，地理学和社会学学系以及李光耀公共政策学院也提供了额外的支持。该课程以一组核心选修课和规划工作室为基础。学生还可以从国大其他部门的广泛选修课中选择，并参加海外实地考察、实习和交流计划。', '工程学院',
                    '建筑', '8月', '真人单面',
                    '城市设计硕士是一个为期一年的全日制或两年的非全日制课程。课程以两个城市设计Studio和一套理论、方法与技术模块为基础。学生可以参加海外实地考察、实习和研究活动，以扩大视野，丰富学识。该专业它利用了新加坡的城市建造经验及其作为区域和世界中心枢纽的作用为同学们带来了一系列独特的学习内容：亚洲城市挑战的全球视角；新加坡：高密度城市化的实验室；协作学习培养大城市领导力。2015年建筑系在QS排名中位列世界前六、亚洲第一。城市规划硕士（MUP）课程2012年开设，吴伟健副教授担任课程主任。项目以培养应对未来城市变化的规划者为目标，关注亚洲城市问题，鼓励跨学科建设，开设涵盖经济、政策、历史、文化等多维度培养课程，同时有相当比例的实践应用。该项目的3个重点分别是多学科知识的整合，关注亚洲背景，不同规模的物理规划。就业服务：学生可以参加4-6天的海外实地考察和至少2个月实习。接受该项目实习生的公司和政府机构包括：Surbana,Cistri,AEDAS宜居城市，住房发展委员会中心WATG。绝大多数的新加坡公司更加接受城市规划(MUP)的毕业生；大部分城市设计(MAUD)专业的海外留学生会选择回国发展，留在新加坡本地发展的则更多的会进入本土设计公司。招生特点：班级概况：2022年入读学生总人数48=male18+female30；申请时间：12月31递交的申请，最早2月出结果，建议优先这个时间段递交申请；1月31递交的申请，最早会在3月出结果，后续申请会在5月出结果。录取学生背景：98585左右，城乡/城市规划，GIS专业。跨专业申请友好，每个MUP群体都是一个多元化的群体；最好拥有建筑、城市规划、土地管理、房地产、地理、工程和文科背景。应届生申请必须提供7月底之前提供授予学位的证明；作品集不做强制要求：建议尽量递交，也有没交，录取的学生；项目对比：城市设计UrbanDesignVS城市规划UrbanPlanning①城市设计UrbanDesign关键特点：发展比较成熟；研究建筑与建筑之间的关系；偏小尺度，探索城市空间的塑造；未来化、先进。城市设计硕士是一个为期一年的全日制或两年的非全日制课程。课程以两个城市设计Studio和一套理论、方法与技术模块为基础。学生可以参加海外实地考察、实习和研究活动，以扩大视野，丰富学识。该专业它利用了新加坡的城市建造经验及其作为区域和世界中心枢纽的作用为同学们带来了一系列独特的学习内容：亚洲城市挑战的全球视角；新加坡：高密度城市化的实验室；协作学习培养大城市领导力。②城市规划UrbanPlanning关键特点：可跨专业申请；拥有明确的系统体系（新加坡特有）；关注更多的是整个城市/片区尺度，人口较大，更着重于土地/经济/道路/交通/用地面积配比/用地与用地之间的关系，多考虑人口；项目最终将落在总图上，更加落地；强调量化。', 'https://cde.nus.edu.sg/arch/programmes/master-of-urban-planning/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Applied Finance', '应用金融学理学硕士', 
                    '1.5年', 39967.0, '- 不要求具备工作经验（欢迎应届毕业生申请）
- 具有声誉好的院校颁发的良好本科学位（不限专业背景）
- 适合希望获得CFA认证的金融或相关领域的从业人员，以及希望提高应用金融知识和技能的专业人士，以及希望获得相关资格以获得理想工作或提升其在银行和金融行业的职业发展的人
- 具有良好的GMAT（600+且定量成绩优秀被视为有竞争力）/GRE/SMU入学考试成绩
- 需要提供经认证的CFA/ACCA证书复印件（如有）
- 需要提交2篇个人陈述，其中1篇需要对指定问题（2选1）进行回答',
                    NOW(), NOW(), '无', '经济分析 Economic Analysis; 股权分析与资产组合管理 Equity Analysis and Portfolio Management; 财务报表分析（一） Financial Statement Analysis 1; 定量方法与统计 Quantitative Methods and Statistics; 公司财务 Corporate Finance; 衍生工具分析 Derivatives Analysis; 财务报表分析（二） Financial Statement Analysis 2',
                    '商科, 金融, 商学院', '新加坡管理大学应用金融学理学硕士课程旨在提高应用金融领域从业人员的知识和技能水平。该领域已被经济审查委员会和金融业确定为关键培训领域。该课程不仅涵盖满足新加坡管理大学应用金融理学硕士学位高学术标准所需的关键组成部分，而且还旨在满足特许金融分析师（CFA）考试要求，使学生也能够获得CFA资格。', '商学院',
                    '金融', '8月', '真人单面',
                    '应用金融理学硕士（MAF）是SMU于2002年推出的第一个研究生课程，分为全日制（12个月）和兼读制（18个月）两种授课模式。为期12个月的MAF全日制课程分为4个学期，每个学期涵盖4-5个科目，是非常高强度的学术课程。



招生特点：雅思6.5/托福90，需要GMAT/GRE（或可参加SMU替代考试）；需参加视频面试。

班级概况：22fall班级整体人数在40人左右，其中中国学生占比80%。', 'https://masters.smu.edu.sg/programme/msc-in-applied-finance'
                );
-- 插入programs表数据 (批次 16/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Exercise and Sport Studies', '运动与体育研究理学硕士', 
                    '1年', 47415.0, '具有良好的学士学位，偏好优秀的荣誉学位，需要运动和体育研究或相关领域背景；或
具有认可大学颁发的良好学士学位（非运动和体育研究背景），并且具有运动和体育研究文凭或研究生文凭或同等学历；或
具有相关的南洋理工大学FlexiMasters且成绩优秀，具备与课程内容和成果相称的专业经验，可能会开展面试以确定申请者是否适合该专业',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '体育与运动学定量研究设计与方法 Quantitative Research Design and Methods in Physical Education and Sports Science; 体育与运动学定性研究设计与方法 Qualitative Research Design and Methods in Physical Education and Sports Science; 新加坡体育和运动组织管理 Managing Sport and Exercise Organisations in Singapore; 体育项目管理理论、方法和问题 Project Management in Sport: Theory, Methods and Issues; 竞技文化 The Culture of Sport; 体育教学研究 Research on Teaching in PE; 体育运动当前问题和发展趋势 Current Issues and Trends in PE and Sport',
                    '社科, 体育, 教育学院', '新加坡南洋理工大学运动和体育研究理学硕士项目主要面向对体育教育、运动、卫生与健康感兴趣的人员。该项目均衡地融合了教育学、社会心理学、管理学、人类运动科学等学科，旨在提升运动和体育领域专业人才的任职资格，促进在校体育教师的职业发展，或者让他们能够胜任运动科学和管理的岗位。', '教育学院',
                    '体育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-science-(exercise-and-sport-studies)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Double Degree MA Politics and International Studies (NTU-Warwick)', '政治学与国际研究文学硕士双学位（南洋理工大学-华威大学）', 
                    '2年', 39818.0, '具有2:1荣誉学位或同等学历，需要政治学或相关学科背景',
                    NOW(), NOW(), '无', '第1学年 - 华威大学（根据选择的以下方向之一决定修读课程） Year 1 – Warwick (Participate in the taught portion of one of the following MA degrees); 国际发展 International Development; 国际安全 International Security; 国际关系 International Relations; 国际政治经济学 International Political Economy; 国际关系与欧洲 International Relations and Europe; 国际关系与东亚 International Relations and East Asia',
                    '社科, 国际关系, 国际研究学院', '政治学与国际研究文学硕士双学位（南洋理工大学-华威大学）项目这一双学位硕士课程旨在帮助学生在国际和战略研究方面具有很强的理论和经验技能，具备对专业人士在21世纪的国际环境中所应具备的实用技能的理解，深入了解影响当代公共和私人决策的多重和跨学科影响，了解政策制定所面临的跨文化理论和以政策为导向的国际挑战，发展和利用强大的全球网络的机会', '国际研究学院',
                    '国际关系', '8月', '无',
                    '无', 'https://www.rsis.edu.sg/gpo/?gpo=ntuwarwick_double_masters_programme'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Contemporary Southeast Asia', '当代东南亚文学硕士', 
                    '1年', 44050.0, '具有良好的新加坡国立大学荣誉学位（优异/二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要相关学科背景，如人文科学、社会科学、区域研究和其他跨学科研究，具备学习过东南亚或亚洲相关学科的证据；或
具有良好的学士学位（平均成绩至少达到B或同等水平），需要相关学科背景，如人文、社会科学、区域研究和其他跨学科研究，具备学习过东南亚或亚洲相关学科的证据，并成功完成入学考试；或
特殊情况下会接受其他相关资格和经验且成功完成入学考试的申请者，需经研究生院批准。
需要提供存款证明50,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '当代东南亚历史、政治与经济 History, Politics and Economics of Modern Southeast Asia; 东南亚社会与文化 Societies and Cultures of Southeast Asia; 论文 Thesis; 东南亚环境政治 Politics of Environment in Southeast Asia; 东南亚海上运输 Southeast Asia by Sea; 东南亚景观 Landscapes of Southeast Asia; 东南亚艺术 The Arts in Southeast Asia',
                    '社科, 国际关系, 人文社科学院', '新加坡国立大学当代东南亚文学硕士项目旨在培养学生不仅能够理解该地区正在发生的深刻变化，而且能够潜在地引领这些变化，毕业生将具备扎实的知识、敏锐的分析技能和经过磨练的跨文化能力，能够参与该地区持续存在的全球问题。', '人文社科学院',
                    '国际关系', '8月', '真人单面',
                    '本课程是一个独特的研究生学位课程，专为那些渴望国际化职业生涯并通过继续学习社会科学丰富他们的生活经验的人而设计。教学人员为社会科学和人文科学的专家，定期进行东南亚研究的原创性研究。作为该项目的硕士课程学生，将接触到各种学术视角，更深入，更专注地理解将东南亚定义为一个地区的相关政治，社会，经济，文化和其他问题。就业服务：毕业生的工作机会非常广阔，能够胜任很多不同类型的工作，例如大学教授，学术研究工作，行政助理，咨询顾问，语言教师，记者等等。招生特点：有面试，看重面试表现。对于非国际关系、非世界史or非国际贸易相关的学生不太友好，这个专业曾停过招生，这两年恢复招生，很多老师都是来自马来西亚、泰国等地区，录取背景海本，陆本，中外合办都有，感觉更偏向于录取专业相关的同学，譬如东南亚小语种以及国际关系等等这种，跨专业的同学譬如新闻，金融，公共政策等，同时对有工作经历的同学也非常欢迎。', 'https://fass.nus.edu.sg/sea/masters-by-coursework/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree MBA (NUS-PKU)', '工商管理双学位（新加坡国立大学-北京大学）', 
                    '2年', 46850.0, '具有学士学位  具备至少2年毕业后全职工作经验 需要提交GMAT/GRE 持有中华人民共和国护照的申请者需要参加中国管理类专业硕士联考 作为选拔过程的一部分，入围申请者必须通过两所大学的面试',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '管理经济学 Managerial Economics 核心课程; 数据分析与统计决策 Data Analysis and Statistical Decisions 核心课程; 财务会计 Financial Accounting 核心课程; 商务汉语 I Business Chinese I 核心课程; 组织行为学 Organizational Behavior 核心课程; 全球政治经济中的中国 China in Global Political Economy 核心课程; 战略管理 Strategy Management 核心课程',
                    '商科, 工商管理, 商学院', '新加坡与中国有着密切的经济和政治联系，中国是一个经济强国，也是全球制造业和出口中心，新加坡国立大学工商管理双学位课程是与中国排名最高的大学北京大学合作开设的，旨在帮助学生充分利用亚洲崛起带来的诸多好处，该项目首先在北京的北京大学光华管理学院学习一学年，然后在新加坡继续学习第二年。', '商学院',
                    '工商管理', '9月', '无',
                    '无', 'https://www.nus.edu.sg'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Wealth Management', '财富管理理学硕士', 
                    '1年', 74120.0, '- 学士学位毕业后具备至少2年任意行业工作经验（通过CFA 1级的申请者可豁免此要求）
- 具有良好的本科学位（不限专业背景）
- 适合渴望保持在全球投资前沿并对财富管理职业充满热情的申请者
- 具有良好的GMAT/GRE/SMU入学考试成绩
- 需要提交2篇个人陈述，其中1篇需要对指定问题（2选1）进行回答',
                    NOW(), NOW(), '无', '财务报表分析 Financial Statement Analysis; 金融市场宏观经济学 Macroeconomics for Financial Markets; 投资分析的数量方法 Quantitative Methods for Investment Analysis; 全球金融市场 Global Financial Markets; 公司财务 Corporate Finance; 股权分析 Analysis of Equities; 投资组合分析 Portfolio Analysis',
                    '商科, 金融, 商学院', '新加坡管理大学财富管理理学硕士课程结合了在瑞士和美国的独特海外经验，在那里学生可以向顶级从业者和学者学习。该课程是为期12个月的全日制课程，旨在满足有抱负和经验丰富的财富管理者的需求，希望加深自己的技能、知识和专业知识。模块化结构允许专业人士在工作时攻读硕士学位，而那些没有财富管理经验的人可以开始实习，以提高他们的就业能力。该课程还包括私人银行业务的相关考试和认证。', '商学院',
                    '金融', '8月', '真人单面',
                    '2004年，SMU与新加坡财富管理学院（WMI）、瑞士金融学院（SFI）以及美国耶鲁大学管理学院（SOM）推出了亚洲首个全日制财富管理硕士课程。



招生特点：申请者需要有至少两年工作经验，雅思6.5/托福90，需要GMAT；需参加视频面试；录取者国际生占比约75%，平均有5-7年工作经验。', 'https://masters.smu.edu.sg/programme/msc-in-wealth-management'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Asian Studies', '亚洲研究理学硕士', 
                    '1年', 33740.0, '具有荣誉学士学位或同等学历',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '亚洲比较政治学 Comparative Politics of Asia; 亚洲国际史 The International History of Asia; 东南亚政府和政治 Government and Politics of Southeast Asia; 印度-太平洋地区海事安全与领土争端 Maritime Security and Territorial Disputes in the Indo-Pacific; 当代印尼国家政治 State and Politics in Modern Indonesia; 马来西亚国家社会与政治 State Society and Politics in Malaysia; 亚洲非传统安全议题 Non-Traditional Security Issues in Asia',
                    '社科, 国际关系, 国际研究学院', '南洋理工大学亚洲研究理学硕士学位课程重点研究比较政治学、国际关系学和经济学。该课程旨在使学生掌握成为亚洲事务研究领域的领导人才所需的专业领域经验知识和分析视角。通过历史、比较政治学、国际关系学、经济学等领域的专业学习，加深学生对亚洲动态变化及新兴发展趋势的认识。还将培养学生掌握各种分析工具，成为亚洲政治、经济、安全等领域的新兴专业人才。', '国际研究学院',
                    '国际关系', '8月', '无',
                    '学生将迅速了解并适应亚洲地区的最新发展动态，并有丰富的机会与来自世界各地智库、非营利组织和大学的外交官、政策制定者和知名亚洲专家见面。学生还有机会通过学习印尼语、普通话、韩语或日语等语言课程获得新的语言技能。项目提供的前沿知识和技能将有助于学生在私营或公共部门的职业生涯中受益。项目是以实证为导向的区域性项目，强调一系列问题，包括亚洲的政治发展、经济发展、传统安全问题、非传统安全问题、外交政策制定。该项目根据个别学生的兴趣进行定制，学生可以选择关注特定国家或子地区，或在某个感兴趣的领域开展广泛的专业知识。', 'https://www.rsis.edu.sg/gpo/?gpo=msc_asian_studies'
                );
-- 插入programs表数据 (批次 2/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Financial Economics', '金融经济学理学硕士', 
                    '1年', 54500.0, '- 具有良好的学士学位
- 具有良好的GMAT（600+）/GRE（Verbal和Quantitative均分156+）/SMU入学考试（Verbal/Numerical/Integrated Reasoning均分55+）成绩
8月入学学费45,780新币，1月入学学费54,500新币',
                    NOW(), NOW(), '无', '微观经济学 Microeconomics; 宏观经济学 Macroeconomics; 计量经济学 Econometrics; 金融计量学 Financial Econometrics; 金融统计及计算 Computational Statistics in Finance; 公司财务 Corporate Finance; 实证金融学 Empirical Finance',
                    '商科, 经济, 经济学院', '新加坡管理大学金融经济学理学硕士课程解决了将经济学和计量经济学与金融联系起来的严格课程的需求。该计划旨在将新加坡管理大学的两大核心优势——计量经济学和金融——结合在一起，以满足行业对专业人员的巨大需求，这些专业人员具备在动态政策和监管的新时代深入分析日益复杂的金融问题的技能。该计划将传授经济学和计量经济学的基础知识以及金融市场运作的领域知识。该计划将教授学生如何将经济学和计量经济学中最先进的工具应用于金融。其主要优势在于该计划固有的多学科性质，涉及经济学、计量经济学和金融专业的教师，从而为学生创造了独特的“转型”学习体验。该计划利用新加坡管理大学关键地理位置，将提供极好的机会。为应用和研究方向的学生举办学术和行业研讨会的可能性将为技术熟练但以市场为导向的专业人士提供一个理想的跳板。', '经济学院',
                    '经济', '1/8月', '真人单面',
                    '-融经济学理学硕士课程结合了 SMU 的两个核心优势（计量经济学和金融学），满足行业对专业人士的巨大需求，这些专业人士具有在动态政策和监管的新时代深入分析日益复杂的金融问题的技能。了解金融理论和计量经济学如何开发大量新颖的建模、预测和监控方法来应对行业挑战。该计划为寻求在金融行业或研究领域谋求职业的学生提供变革性的学习体验。就业服务：金融经济学理学硕士毕业生可以在银行、保险公司、投资公司、咨询公司等金融机构就业，也可以在大型跨国企业、政府机构、研究和教育机构等领域找到相关岗位。招生特点：需要提供G成绩。', 'https://masters.smu.edu.sg/programme/master-in-financial-economics'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Information Systems', '信息系统理学硕士', 
                    '1年', 45235.0, '具有学士学位，需要以下领域背景：计算机科学、信息系统、信息技术；或
具有学士学位，包含很强的信息技术相关成分，例如工程或科学；或
具有学士学位以及相关工作经验。
达到二等二/荣誉（优等）学位及以上水平或同等学历
实习经验不计入工作经验，建议申请者具备相关领域至少1年全职工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '信息架构和设计 Information Architecture and Design; 软件工程 Software Engineering; 软件项目管理 Software Project Management; 数据库系统 Database Systems; 网络编程 Internet Programming; 人机互动—用户、任务和设计 Human Computer Interaction - Users, Tasks and Designs; 研究方法和数据分析 Research Methods and Data Analysis for Information Professionals',
                    '商科, 信息系统, 传媒与信息学院', '新加坡南洋理工大学信息系统理学硕士项目是黄金辉通信与信息学院和计算机工程学院协作创办的课程。新加坡南洋理工大学信息系统理学硕士项目注重理论与实践的结合，旨在提升学生有关信息系统设计、开发、维护与管理的知识。在课程学习中，学生有机会接触到信息系统开发最前沿的科学技术，以及掌握应对信息系统领域快速发展所需的核心技能。新加坡南洋理工大学信息系统理学硕士课程建立于广泛的学科基础之上，涵盖了大量的技术技能与软技能培训，这些技能都是信息系统专业人才应该具备的。软件开发与基础设施： 为学生提供信息系统设计、开发和维护所需的核心知识。 人机交互：为学生提供设计信息系统的知识，这些信息系统从最终用户的角度来看既有用又可用。 系统和服务管理：为学生提供管理信息系统项目、信息系统人员和资源所需的软技能。 信息管理：为学生提供存储、组织、坚持和管理信息所需的技能，以便可靠、及时和准确地使用信息。主要特点：凭借经验丰富的多学科教师和行业从业者的信息系统教育的广泛视角，通过基于理论和实践的体验式学习，高度重视用户和管理，为希望在行业中站稳脚跟的职业中期专业人士提供坚实的基础。', '传媒与信息学院',
                    '信息系统', '8月', '无',
                    '信息系统理学硕士（MSIS）课程旨在将理论与实践相结合，为学生提供设计、开发、维护和管理系统所需的前沿知识，以优化用户体验。该课程计划全面涵盖了信息系统专业人员在多个关键领域所需的技术专长和软技能，包括软件开发和基础设施、人机交互、系统和服务管理，以及信息管理。通过这些领域的深入学习，学生将能够掌握从系统设计到用户体验优化的全方位技能。招生特点：申请MSIS课程的学生需要具备计算机科学、信息系统、信息技术等领域的学士学位，或具有强大信息技术相关组件的学士学位，如工程或科学。此外，学生还需要具备二等/荣誉（优异）及以上或同等学历的学位分类。实习经验不计入工作经验要求，但建议申请人在相关领域至少有一年的全职工作经验。对于非英语授课大学授予的本科学位或由英语授课大学授予但教学语言不是英语的本科学位，学生必须满足英语语言能力要求（ELPR）。', 'https://www.ntu.edu.sg/education/graduate-programme/master-in-science-in-information-systems'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Pharmaceutical Science & Technology', '制药科学与技术理学硕士', 
                    '1年', 53792.0, '具有以下学位之一或同等学历，并达到二等二荣誉学位或同等水平： 
化学（荣誉）理学学士，或
生命科学（荣誉）理学学士，或
食品科学与技术（荣誉）应用科学学士，或
应用化学（药物）（荣誉）应用科学学士，或
药学（荣誉）理学学士，或
化学工程（荣誉）工程学士。
不强制要求提交GRE，但建议未达到规定学位/荣誉等级或持有海外大学同等学位的申请者提交
需要提交存款证明45,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '药物与生物医学分析 Pharmaceutical and Biomedical Analysis; 配方科学 Formulation Science; 产品开发方法 Methodologies in Product Development; 药剂学研究生研讨会 Graduate Seminar Module in Pharmacy; 药物科学基础专题 Fundamental Topics in Pharmaceutical Science; 制药工艺验证 Pharmaceutical Process Validation; 药片技术进展 Advances in Tablet Technology',
                    '社科, 药学, 理学院', '新加坡国立大学制药科学与技术理学硕士旨在培养精通专业知识，能够满足新加坡制药/生物制药行业需求（例如在配方、工艺和产品开发、质量保证和监管事务领域）的科学、药学和工程人员。为了使学生与未来的制药/生物制药行业相关，课程采用了基础广泛的方法，涵盖制药/生物制药发展的各个阶段。', '理学院',
                    '药学', '1/8月', '无',
                    '无', 'https://pharmacy.nus.edu.sg/study/postgraduate-programmes/msc-pharmaceutical-science-technology-programme/full-time/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Integrated Sustainable Design', '综合可持续设计理学硕士', 
                    '1年', 49050.0, '具有荣誉学士学位，需要建筑学、工程学、景观建筑学、城市规划、城市设计、项目和设施管理背景；或
具有学士学位，需要建筑环境相关专业背景。
空间设计学科背景（建筑学、景观建筑、城市设计、城市规划）的申请者需要提交1份设计作品集
非设计学科的申请者不需要提交作品，鼓励提供与城市规划和设计技能、实践和研究相关的其他证据',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '综合工作室1 Integrated Project Studio 1; 热带地区的绿色建筑 Green Buildings in the Tropics; 能源和生态学 Energy and Ecology; 设计仿真与分析 Design Simulation and Analysis; 综合工作室2 Integrated Project Studio 2; 可持续城市化的原则 Principles of Sustainable Urbanism; 可持续性的模型和蓝图 Sustainability Models and Blueprints',
                    '社科, 建筑, 工程学院', '新加坡国立大学综合可持续设计理学硕士学位课程为寻求有明确学习目的的专业人员提供了一个职业性的、跨学科性的平台。这些专业人员致力于全球气候变化和亚洲城市化背景下的可持续发展。通过这种领导性的角色，建筑师、工程师、教育工作者、规划师和决策者们将使用他们各自专业的知识、技能和深刻的洞察力，为建筑环境设计建立一个全面的整体分析系统。在寻求可持续的解决方案的过程中，新加坡国立大学综合可持续设计课程为他们提供了一个以一体化思考为基础的机会，是“规划、设计、技术和政策走向战略成果的融合”。新加坡国立大学是亚洲领先的高等学府之一。新加坡国立大学综合可持续设计理学硕士学位课程由环境设计学院的建筑设计系的资深讲师进行授课。他们将带给这个课程全新的跨学科的概念、深入的实践经验和最新尖端研究。课程内容由新加坡国立大学知名专家和专业人士提供的专业讲解。每学期将聘请嘉宾来提供新加坡的可持续发展经验，以及创新的见解和观点。环境设计学院是亚太地区可持续发展研究中心的所在地，协同大学和学院的其他研究活动，为学生提供了很多日常学习机会。', '工程学院',
                    '建筑', '8月', '真人单面',
                    '香港大学于2000年开办建筑文物保护理学硕士课程，为文物保护从业人员提供专业培训。就业服务：毕业生可在香港、內地及其他地方的政府、NGO、建筑or规划公司，以及文物顾问公司担任专业职位。招生特点：申请时需要选择小方向：1.保护规划与管理；2.保护设计（该方向必须要提交作品集）。本科建筑学/园林/历史建筑保护均有录取。', 'https://cde.nus.edu.sg/arch/programmes/master-of-science-integrated-sustainable-design/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Digital Financial Technology', '数码金融科技理学硕士', 
                    '1.5年', 47088.0, '具有计算机学士学位；或
具有相关学科（如科学、技术、工程和数学（STEM）、金融、经济、统计学或商业）学士学位。
相关学科学士学位持有者需要具备2年金融科技或信息技术行业经验
有金融科技、人工智能或数据分析工作经验者优先考虑（但不是必需的），非计算机专业的学生必须提供足够的python编程知识和/或学习高级定量科目的证据。不符合上述要求的特殊学生仍可能被考虑。除上述学历外，其他学历的申请者可根据具体情况考虑录取。
偏好GRE320+（分析写作3.5）或GMAT 700+的申请者（不强制要求）',
                    NOW(), NOW(), '雅思: 6; 托福: 90', '面向消费者的金融科技创新 Fintech Innovations for Consumers; 金融机构数字化转型 Digital Transformation at Financial Institutions; 区块链创新 Blockchain Innovations; 区块链应用编程 Programming for Blockchain Applications; 金融机器学习 Machine Learning for Finance; 金融建模 Financial Modelling; 金融概论 Introduction of Finance',
                    '商科, 金工金数, 计算机学院', '新加坡国立大学数码金融科技理学硕士由亚洲数字金融学院（AIDF）、新加坡国立大学计算学院和新加坡国立大学商学院联合提供。金融科技（Financial technology，简称FinTech），指的是旨在与传统金融服务商业模式竞争的广泛的技术与创新。由于云计算、数据分析和人工智能技术的进步，金融科技的应用在过去十年中爆发式增长。为了满足新加坡和全球对高素质金融科技人才不断增长的需求，这个新的金融科技旗舰研究生课程旨在帮助学生在计算和金融方面打下坚实的基础，并提供一系列选修模块，这些模块分为三个方向：计算技术、金融数据分析和情报，以及数字金融交易和风险管理。新加坡国立大学数码金融科技理学硕士主要旨在帮助毕业生为人工智能软件开发人员、数据科学家、金融科技安全专家、金融量化分析师和金融机构或金融科技公司的其他类似职业做好准备。
新加坡国立大学数码金融科技理学硕士课程主要面向计划在金融机构或金融科技公司工作的学生，他们可以是（AI）软件开发人员、数据科学家、金融科技安全专家或金融定量分析师。除了帮助学生在计算机和金融领域打下坚实的基础之外，课程还提供涵盖深度计算机和金融专业知识的选修模块，支持毕业生为金融科技领域的未来职业挑战做好准备。', '计算机学院',
                    '金工金数', '8月', '无',
                    'nus数码金融科技硕士于2021年8月首次招生，学制为1.5年，项目由亚洲数字金融研究所(AIDF)、新加坡国立大学计算学院和新加坡国立大学商学院联合提供。作为研究所的旗舰课程。专业围绕三个track: 计算技术、金融数据分析和智能、数字金融交易和风险管理进行课程安排。旨在帮助学生建立强大的计算和金融基础，



就业服务：课程目标是帮助毕业生为AI软件开发人员、数据科学家、FinTech安全专家、金融定量分析师以及金融机构或FinTech公司的其他类似职业做好准备。金融科技行业从业者平均薪酬一直是处于行业领先的，且每年呈较快上涨趋势。高薪+刚需，金融科技无疑是未来几年的风口行业。

招生特点：nus对于名校的偏好是众所周知的，专业方面偏好计算机或者相关专业（如数学，金融，经济，工科等），软背景方面需要有Python编程知识或在高级定量学科的学习基础，如果是相关专业同学进行申请，则需要有两年金融科技或信息技术的行业经验。所以在申请nus的时候，学校对于软背景还是非常看重的。', 'https://www.comp.nus.edu.sg/programmes/pg/mdft/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Management', '管理学理学硕士', 
                    '1年', 55590.0, '具有良好的本科学位，需要商业或商业相关学科背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费55,590新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '商业分析与企业价值评估 Business Analysis and Valuation; 家族企业的财务管理 Financial Management of Family Business; 企业兼并与收购评估 Valuation of Mergers and Acquisitions; 咨询分析工具 Analytical Tools for Consulting; 实用市场调研方法及工具 Applied Market Research; 行为经济学 Behavioural Economics; 消费文化理论 Consumer Culture Theory',
                    '商科, 管理, 商学院', '新加坡国立大学管理学理学硕士学位课程旨在让学生在多元文化环境中学习管理领域的前沿知识和技能，帮助学生提高职场竞争优势，提升职业前景。该硕士学位课程帮助学生拓展更广阔的咨询、金融、市场以及综合管理领域的职业发展空间，提供多元文化学习环境和管理关键领域的高级知识和技能。', '商学院',
                    '管理', '1月', '机面（kira）/真人单面',
                    '该项目旨在让学生在多元文化环境中学习管理领域的前沿知识和技能，帮助学生提高职场竞争优势，提升职业前景。此项目帮助学生拓展更广阔的咨询、金融、市场以及综合管理领域的职业发展空间，提供多元文化学习环境和管理关键领域的高级知识和技能。就业服务：该项目毕业生可以进入金融和投资银行业，从事投资、财务分析、风险管理等工作；也可以在咨询公司担任咨询师，为企业提供包括战略规划、组织优化、业务流程改善等在内的管理咨询服务。此外，毕业生还可以在跨国公司中担任管理职位，负责战略决策、国际业务拓展、跨文化团队管理等。对于有创业意愿的毕业生，他们可以创办自己的公司或加入初创企业，从事创新项目管理、市场分析、商业开发等工作。招生特点：根据官网的profile，录取学生90%均为海外背景，面试一般为机面+人面。人面会筛选进行二次考察，学生表现会影响最终的录取。录取案例为985+财经211，具有商业或商业相关，暂无双非学生申请成功的案例', 'https://mim.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree MBA - MPP', '工商管理硕士 - 公共政策硕士双学位', 
                    '2年', 94581.0, '具有良好的本科学位 具备至少2年工作经验，对于MPP课程，申请者必须表现出对公共服务的成熟和投入，必须熟练掌握英语书面和口语 需要良好的GMAT/GRE成绩 有兴趣申请新加坡国立大学MBA-MPP双学位课程的申请者必须同时满足新加坡国立大学MBA和MPP课程的入学要求',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '公司战略 Corporate Strategy; 财务管理 Financial Management; 财务会计 Financial Accounting; 管理经济学 Managerial Economics; 营销策略 Marketing Strategy; 管理运营与分析 Managerial Operations & Analytics; 有影响力的领导 Leading with Impact',
                    '商科, 工商管理, 商学院', '新加坡国立大学工商管理硕士 - 公共政策硕士双学位课程由商学院与李光耀公共政策学院合作提供，为有兴趣在政府和公共部门企业开展职业的未来领导者提供两个独特的课程，该课程针对的是希望加入公共部门的候选人。', '商学院',
                    '工商管理', '8月', '无',
                    '无', 'https://www.nus.edu.sg'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Museum Studies and Curatorial Practices', '博物馆研究与策展实践文学硕士', 
                    '1年', 38150.0, '具有认可大学颁发的学士学位或同等学历，至少达到二等二学位
不要求具备工作经验',
                    NOW(), NOW(), '无', '研究方法 Research Methodology; 策展实践导论 Introduction to Curatorial Practice; 东南亚艺术史 Histories of Arts from Southeast Asia; 博物馆研究导论 Introduction to Museum Studies; 策展管理 Curatorship; 文物研究 Heritage Studies; 博物馆志 Museography',
                    '社科, 文化, 艺术、设计与传媒学院', '南洋理工大学的博物馆研究与策展实践文学硕士学位课程旨在帮助毕业生做好准备，以在遗产和艺术领域的管理、行政、解读和发展方面担任领导。该课程教授学生必需的知识和技能以服务、加强和改造博物馆和画廊部门以及政府机构。基于广泛审查和国际最佳实践，该课程为三轨道结构，如果学生愿意的话，可以在修完核心通识教育后，选择博物馆研究或策展实践中的任一方向，也可以综合修读这两个方向。同时，学生也可以选择是撰写论文还是在新加坡或海外的博物馆或艺术机构实习10周。', '艺术、设计与传媒学院',
                    '文化', '8月', '真人单面',
                    '项目设置在艺术、设计和媒体学院，与艺术史学家、经验丰富的策展人以及具有本地、区域和国际专业知识的专家合作，以解决历史和当代艺术方面的理论和实践挑战。新加坡卓越的博物馆基础设施和其地理位置使学生能够直接接触艺术品和艺术家、档案和文物。作为与新加坡艺术博物馆合作的项目，项目也为相关从业者、机构和艺术家提供了广泛的交流网络。就业服务：项目与新加坡所有相关艺术机构和博物馆行业保持着紧密联系。毕业生通常可以在艺术、文化和遗产产业中担任职位。包括：博物馆、画廊和艺术组织（策展、艺术管理、营销、策划研究和出版、展览和收藏管理、展览设计、博物馆教育家、艺术行政、政策）；私营和公共部门的艺术委托，如新成立的新加坡公共艺术信托基金（NAC）（项目管理、外展和教育、保护和维护）；国际拍卖行（收购、鉴定、定价、宣传研究和出版）；艺术博览会和艺术节/双年展（策展、项目管理、外展和营销、出版、展览管理、展览设计、艺术行政、政策）；学术研究和教学职位；政府部门（政策官员、企业传播、外交支持、资助、活动和项目管理）；独立机构（管理、资助、活动和项目管理）；出版业（写作、文本和图像编辑、研究、撰写文案）；媒体广播公司和内容制作商（记者、作家、研究员、制片人）', 'https://www.ntu.edu.sg/education/graduate-programme/master-in-museums-studies-and-curatorial-practices'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (English)', '教育学硕士（英语）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，需要英语语言或文学相关背景，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 语言与文学教育 Language and Literature Education; 分析文学与语言 Analyzing Literature and Language; 英语作为国际语言 English as an International Language; 语言教师教育与专业发展 Language Teacher Education and Professional Development; 语言课程中的材料设计 Materials Design in the Language Curriculum; 口语交际教学：当前的理论与方法 Teaching Oral Communication: Current Theories and Approaches',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（英语）项目旨在为教师提供与英语教育相关的批判、美学、文化和多模态素养。学生将完成2门必修专业课程，研究英语语言和英语文学教育之间的跨学科联系，并将社会文化、语言和文学理论应用于文本的批判性阅读。此外，该课程为学生提供了从英语语言教学或英语文学教学或两者兼而有之的一系列专业选修课程中进行选择的灵活性。学生可以在教学语法和写作、多模态、世界文学和创意写作等方面追求并建立自己的兴趣。学生还将获得批判性探究和行动研究技能，并将其应用于与英语教学相关的特定问题的调查。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(english)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Managerial Economics', '管理经济学理学硕士（中文授课）', 
                    '1年', 43000.0, '具备官方认可的学士学位，成绩优秀
无需拥有工作经验，刚获得本科学士学位并拥有良好本科成绩的优秀应届毕业生可以申请报读
其他要求由南洋理工大学斟酌而定',
                    NOW(), NOW(), '无', '管理经济学：理论与应用 Managerial Economics: Theory & Applications 必修课程; 宏观经济学：理论与应用 Macroeconomics: Theory & Applications 必修课程; 策略管理与企业政策 Strategic Management and Business Policy 选修课程; 财务分析与财务管理 Financial Analysis and Financial Management 选修课程; 宏观金融、金融市场与金融监管 Macro Finance, Financial Market and Financial Regulation 选修课程; 产业组织与产业政策 Industrial Organization and Industrial Policy 选修课程; 研究与统计方法 Research and Statistical Methods 选修课程',
                    '商科, 经济, 南洋公共管理学院', '新加坡南洋理工大学管理经济学硕士学位课程学制一年，对象为刚参加工作的初级行政管理人才或有志从事经济管理的优秀应届毕业生。这是一个将经济学、金融学、管理学、人力资源、公共政策等多学科融为一体的综合课程。学员将通过该课程的研习，培养全方位的管理能力并为学生将来投身不同领域做好准备。本课程理论与实践并重，专家学者们在传授最新专业及跨学科理论的同时，会通过课堂讨论、案例分析与实践模拟，协助学员掌握课程重点。学院也会不定期安排企业界和金融界人士的专家讲座，让学生了解市场动态和最新发展状况。', '南洋公共管理学院',
                    '经济', '8/11月', '无',
                    '该项目旨在为学生提供应用经济学、金融学、管理策略和数据分析方面的扎实知识基础，同时教授实际应用的技巧。它以经济学和管理学理论为基础，注重理论与实践的结合。



就业服务：该项目的毕业生多就职于银行、金融、证券、基金、行研、互联网、科技等行业。也有部分毕业生考入中国公务员系统，回国认证情况为理学硕士，专业为管理经济学，学科为经济学。具体认证时可以选择或复核。

招生特点：申请者需要将材料电邮至mailto:mme-c@ntu.edu.sg，并且必须将文件名加上姓名和申请号码后以PDF格式分开放在附件发送，否则项目可能无法打开压缩包。在录取背景方面，该课程主要面向985、财经211或海本背景的申请者，特别是商科尤其是经济类专业的学生。湖南大学的商科等合适专业、GPA84以上的申请者目前有100%的申请成功率。该课程分别开设了7月班和11月班，其中7月班入学即为秋招，需要在6月30日确认毕业，7月中下旬发放证书和毕业典礼；11月班则是在结课时进行秋招，第三年1月毕业。

班级概况：根据官方22fall入读数据显示，该课程共计有219人入读，其中男性59人，女性160人。其中95%以上都是中国学生。同学背景方面，基本是985+财经211+海本，包括四川大学，电子科技大学，湖南大学，武汉大学，中南财经大学，中央财经大学，西南财经大学，上海财经大学，华南理工大学，华中科技大学，上海交通大学，东北大学等。', 'https://www.ntu.edu.sg/education/graduate-programme/ncpa-master-of-science-(managerial-economics)-(july-and-november-intake)---1'
                );
-- 插入programs表数据 (批次 3/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'Master of Professional Accounting', '专业会计硕士', 
                    '1年', 53410.0, '- 申请者必须在认可的高等教育机构颁发的本科学位中能够证明良好的先前学术成绩
- 申请者必须具备足够的数学/微积分背景
- 申请者可以选择参加SMU入学考试/GMAT（600+被视为有竞争力）/GRE（312+被视为有竞争力）作为申请该专业的入学考试
- 有相关工作经验的申请者将具备额外的优势',
                    NOW(), NOW(), '雅思: 6.5; 托福: 90', '财务会计 Financial Accounting; 经济学和统计学 Economics & Statistics; 会计信息系统 Accounting Information Systems; 财政学 Finance; 企业法律环境 Legal Environment of Business; 税务 Taxation; 管理会计 Management Accounting',
                    '商科, 会计, 会计学院', '新加坡管理大学专业会计硕士专业学位项目自2006年成立以来，一直致力于为专业服务和企业会计领域提供新的激动人心的职业机会。该课程获得了澳大利亚公共会计师协会（CPA Australia）、英格兰及威尔士特许会计师协会（Institute of Chartered Accountants in England and Wales）等8个区域和全球会计专业机构的认可，是新加坡最受认可的会计硕士课程。新加坡的会计行业正在经历重大转型，以实现其成为亚太地区领先的全球会计中心的目标。为了实现这一愿景，实施的主要举措之一是创建新的途径，以方便非会计学科的学位持有者进入该行业。新修订的MPA课程为考生提供了强大的商业基础、各种会计职能的技术技能和专业会计服务。', '会计学院',
                    '会计', '8月', '真人单面',
                    '新加坡管理大学是采用了美国常春藤大学式研讨会形式的教学方法，而且新加坡管理大学专业会计专业留学的学生在毕业之后可以获得由新加坡管理大学颁发的高含金量的毕业证书，是学生在毕业之后有力的敲门砖。就业服务：毕业生可以成为注册会计师或审计师，进入普华永道、安永、德勤、毕马威四大会计师事务所或其他事务所；进入金融行业，在银行、券商工作，如中国银行、中国工商银行、中国建设银行、中国招商证券、法国兴业银行等；从事咨询行业，具体公司有埃森哲、麦肯锡等；招生特点：录取的学生男女比例3:7，52%低于五年工作经验，43%有5-10年工作经验，超过10年的有5%；本科背景分布：48%商科/经济学，14%工科，9%金融学，29%其他（IT、理科等等）；学生申请要求是211、985院校毕业的学生，非211、985院校毕业的学生要求在校平均成绩在85分以上，同时英文成绩要求优秀，雅思分数在6.5分以上。与上海财经大学、西南财经大学、中山大学、厦门大学有合作关系。语言要求托福或雅思，但没有最低标准，也需要GMAT，600分以上会比较有优势。', 'https://masters.smu.edu.sg/programme/master-of-professional-accounting'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc International Political Economy', '国际政治经济学理学硕士', 
                    '1年', 33740.0, '具有荣誉学士学位或同等学历',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '国际政治经济理论和热点议题 Theories and Issues in International Political Economy; 国际政治经济学 Economics for International Political Economy; 国际政治定量研究法 Quantitative Methods in the Study of International Politics; 世界经济全球化背景下的中国 A Globalizing China in the World Economy; 国家风险和经济危机的预测、监控和管理 Monitoring Forecasting and Managing Country Risk and Economic Crisis; 能源与环境议题 Energy and Environment Issues; 区域性及全球金融危机 Regional and Global Financial Crisis',
                    '社科, 国际关系, 国际研究学院', '新加坡南洋理工大学国际政治经济学理学硕士是政治与经济之间的桥梁。旨在使学生掌握政治经济理论知识和实用的理念。具体的课程目标如下：提高学生独立分析复杂的国际政治经济议题的能力；丰富学生关于全球各国家地区实务性知识的储备；更深入地了解全球政治经济历史演变过程，从而能够沉着应对当下政治经济领域内的挑战。', '国际研究学院',
                    '国际关系', '8月', '机面（kira）',
                    'NTU M.Sc.(International Political Economy)南洋理工大学的国际政治经济专业硕士是属于国际关系学院（ISS）的，因此课程更多会与“全球化”以及国际问题相关，通过分析以及试图起草有效的政策来了解经济和政治目标之间的相互作用。



就业服务：就业方向有研究机构的分析师、金融公司、商业策略、公共关系、新闻传媒领域或政府机关（中央银行,财政部或贸易部门）等。

招生特点：院校背景方面，985、海本院校的申请优势比较大，211院校和双非院校的录取几率相对小了很多，在成绩方面，建议GPA能达到3.5+；雅思考到7+，托福考到100+的话优势比较大，这样的话一些硬件成绩就会比较突出，为你的申请简历加分，软背景方面尽量增加专业相关的实践经历，这也会成为申请的亮点！

班级概况：22fall班级整体人数在20-30人左右，中国学生超过50%，学生背景方面基本都是985和211本科，还有一些海本学生。', 'https://www.rsis.edu.sg/gpo/?gpo=msc_international_political_economy'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Managerial Economics (English)', '管理经济学理学硕士（英文授课）', 
                    '1年', 43000.0, '具有认可大学或院校颁发的良好学士学位，或具备学术委员会批准的其他资格 
托福分数要求不低于88-89',
                    NOW(), NOW(), '无', '管理经济：理论与应用 Managerial Economics: Theory&Applications; 宏观经济学：理论与应用 Macroeconomics: Theory & Applications; 金融分析与金融管理 Financial Analysis & Financial Management; 研究与统计方法 Research & Statistical Methods; 政策分析行为经济学 Behavioural Economics for Policy Analysis; 数据分析 Data Analytics; 项目管理 Project Management',
                    '商科, 经济, 南洋公共管理学院', '南洋理工大学管理经济学硕士（英文授课）旨在培养在商业、政府和社会背景下具有战略思维和管理决策敏锐度的领导者。该硕士计划将经济理论与管理实践相结合，以应对公共和私营部门的挑战。南洋理工大学管理经济学硕士计划的跨学科性质加入了应用经济理论来加强政策设计的重点。该硕士计划涵盖金融、技术、数据、研究和专业发展技能等蓬勃发展的领域，除了讲座和研讨会外，还包括课堂讨论、研讨会和小组项目的沉浸式学习体验。', '南洋公共管理学院',
                    '经济', '1/8月', '无',
                    '南洋理工大学的管理经济学项目（MME），硕士课程为期一年，是将经济、金融、管理、会计、人力资源等多种管理学融为一体的综合课程。在中文班办学的成功基础上，MME在2021年首次开设英文授课班，分1月和7月春秋两季入学。



就业服务：学校就业中心和学院均会较频繁地组织一些宣讲会以及一些公司的招聘信息，有较多同学通过该渠道去到了shopee，字节跳动，四大会计师事务所，lazada等知名公司实习。同时也可以参加国内远程实习。MME回国学位认证为经济学类，毕业就业去向也相对较为多元化，如三中一华的投行岗，债股销，中台业务, 头部券商的二级研究，国有行，股份行总行，三大政策行，互联网产品岗，数据岗，四大审计，四大咨询，公务员等。

招生特点：项目非常喜欢985/海本/211财经。该项目不喜双非，商科背景有偏好，商科背景是指比如金融，管理，经济学，会计等。但其他专业背景的也有可能申请成功。GPA方面偏好85+。

班级概况：22fall班级整体人数在80-100人左右，其中90%-95%都是中国学生。学生背景方面，本科基本是985，清华大学、南京大学、中南大学的学生比较多。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-managerial-economics-(english)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Precision Health and Medicine', '精准健康与医疗理学硕士', 
                    '1年', 69400.0, '具有医学学士、理学学士或者任意科学、技术、工程数学、医学或其他相关学科的相关学士学位（偏好荣誉学位）
具有其他资历的申请者将根据具体情况予以考虑，但须经项目招生委员会批准（例如在精准医疗相关领域具有丰富的经验和可证明的专业成就，或完成精准健康与医疗相关高级或研究生证书并且至少达到GPA 3.5）
非定量科学（即非数学、工程或计算）本科专业的申请者需要证明其在定量科学领域的能力，示例包括：
- 参与定量竞赛并获奖（如奥数竞赛等）
- 成功完成基础编程（如R或python）和/或基础统计学课程（可接受知名在线课程）
申请者在生物学或数据科学相关行业的相关工作经验将是一大优势
欢迎申请者提交GRE/GMAT（选择性提交）',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '人类基因组学在精准医疗中的应用 Human Genomics in Precision Medicine; 蛋白质组学和代谢组学在精准健康与医疗中的应用 Proteomics and Metabolomics in Precision Health and Medicine; 精准医疗应用统计学 Applied Statistics in Precision Medicine; 精准医疗高性能计算应用 High Performance Computing for Precision Medicine; 人工智能和机器学习在精准医疗中的应用 AI and Machine Learning for Precision Medicine; 精准医疗伦理法规与管理经济学 Ethics, Regulation and Managerial Economics in Precision Medicine; 精准医疗专题研讨会 Seminars in Precision Medicine',
                    '社科, 医学, 杨潞龄医学院', '精准医疗作为医学界备受期待的新兴领域，将在未来几十年内彻底改变医疗保健行业。随着技术的进步（例如大数据、机器学习和人工智能）以及对基因的深入研究，精准医疗能够充分考虑个体在遗传基因、生活方式和环境因素等方面的差异，加深人们对人体生理学的了解，从而为不同人群提供精准的治疗和预防方案。
新加坡国立大学精准健康与医疗硕士是一门跨学科的研究生课程，由学者、临床工作者、专业领域专家和行业领军人物共同主导。该课程旨在为医学和STEM（科学、技术、工程和数学）背景的学生提供相关知识和技能，推动精准医疗赋能医疗保健行业的变革。', '杨潞龄医学院',
                    '医学', '8月', '真人单面',
                    '无', 'https://medicine.nus.edu.sg/bch/msc-phm/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (High Ability Studies)', '教育学硕士（高能力研究）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩有效具有教师资格如新加坡国立教育学院颁发的教育研究生文凭以及至少1年教学经验，或具备至少1年教学经验或其他在高能力或多样化（混合能力）的学习者环境中的相应工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 理解高能力学习者及其情感与道德需求 Understanding Learners with High Ability and their Affective and Moral Needs; 高能力学习者潜能识别与干预管理 Identification of Potential and Administration of Interventions for High Ability Learners; 区分高能力学习者的课程与教学法 Differentiating Curriculum and Pedagogies for Learners with High Ability; 高能力学习者的批判性与创造性思维 Critical and Creative Thinking for High Ability Learners',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（高能力研究）项目为教育专业人士（如教师和教育研究人员）创建了一个平台，以增强其在教育和培养高能力学习者方面的知识、想法和最佳实践，侧重于课程、教学法和实践，该课程通过拓宽知识和专业知识，培养具有决心和能力的专业人士，从理论、实践和研究三个方面阐述了培养高能力学习者的趋势、问题和政策，以及差异化教学的途径。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(high-ability-studies)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Media and Communication', '媒体与传播理学硕士', 
                    '1年', 43000.0, '具有良好的学士学位，不限专业背景（荣誉优等学位及以上水平）
具备至少1年工作经验（需要提供工作证明/受雇证明）
*实习经验不计入工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '传媒、技术与社会 Communication, Technology & Society; 传媒研究和数据分析 Communication Research and Data Analysis; 传播、道德和治理 Communication Ethics and Governance; 媒体领导与管理 Media Leadership and Management; 大众传播议题及策略 Public & Promotional Communication Issues & Strategies; 先进活动设计和管理 Advanced Campaign Design and Management; 舆情疏导 Public Opinion & Persuasion',
                    '社科, 媒体与传播, 传媒与信息学院', '南洋理工大学媒体与传播理学硕士课程提供有关大众传播过程的知识，分析和理解媒体作为社会机构所需的理论和方法，并训练学生的批判性分析、战略思维和受众研究技能。通过MMC课程，传媒专业人士将具备在管理、规划和政策方面担任领导职位的能力。MMC项目还为学生提供机会，通过与主要合作大学的海外选修课，到该地区的一个国家了解媒体和传播环境。', '传媒与信息学院',
                    '媒体与传播', '8月', '无',
                    '该专业设立在黄金辉传播与信息学院（WKWSCI）旨在培养传播与信息专业人士和学者，以增强专业知识并且服务社会。学院配备一流的教师团队和先进的实验室以及全球的网络资源。旨在为学生提供有关大众传播的知识，并且学会批判性思考，战略性传播以及用户体验分析。



就业服务：回国就业可以选择大厂b站，爱奇艺，字节和腾讯等，岗位可以选择新媒体，新媒体运营、新媒体编辑、内容运营、文案策划；还有就是短视频编辑、视频剪辑这些。 可以跨行业进入广告公司，盛世长城、麦肯光明、奥美、万博宣伟、阳狮、电通安吉斯等广告策划、品牌营销、产品推广等。

招生特点：申请必备条件传媒专业一年工作经历，非传媒专业需要两年工作经历。211 985高绩点85+ 雅思7.0 非常看重工作经验。

班级概况：22fall班级整体人数在70+左右，70%是中国学生。同学背景方面，平均工作年限4-7年，平均年龄25-30。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-media-and-communication'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MBA', '工商管理硕士', 
                    '1.5年', 66127.0, '具有学士学位
具备至少2年本科毕业后的全职工作经验（申请时）
需要良好的GMAT/GRE成绩（建议GMAT 600+，全日制MBA均分为670）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '企业战略 Corporate Strategy; 财务管理 Financial Management; 财务会计 Financial Accounting; 管理经济 Managerial Economics; 市场营销管理 Marketing Management; 管理运作与分析 Managerial Operations and Analytics; 领导影响力 Leading with Impact',
                    '商科, 工商管理, 商学院', '新加坡国立大学工商管理硕士旨在通过身临其境的整体学习体验来支持学生的专业和个人成长。课程在学术严谨性与体验式方法之间取得平衡，为学生提供在瞬息万变的世界中取得成功的知识和工具包。从独特的亚洲视角将西方商业模式与领导原则相结合，学生将对整个亚洲的商业产生无与伦比的广度和深度的理解。通过海外学生交流、国际游学、案例竞赛、实习等，学习将在课堂之外继续进行。探索学生的兴趣并充分利用MBA经验。NUS MBA为发展和发现提供了一个充满活力的论坛，它将为学生在当今竞争激烈的全球市场中的领导角色做好准备。在课堂之外，海外学生交流，学生主导的学习旅行，商业案例竞赛和其他举措将扩大视野和国际网络。优势：培养影响力，MBA生存工具包，MBA咨询项目：将理论应用于实践和根据目标量身定制MBA。', '商学院',
                    '工商管理', '8月', '真人单面',
                    '通过海外学生交流、国际游学、案例竞赛、实习等课堂之外的社会实践将西方商业模式与从独特的亚洲角度出发的领导原则相结合，产生对亚洲商业无与伦比的广度和深度理解。就业服务：该项目86%的学生毕业后3个月内就业，平均薪资77,109美元，毕业后多任职于阿里巴巴、亚马逊、微软、戴尔、安永、毕马威、谷歌等科技、医疗、教育、金融、能源、建筑行业的顶尖企业。招生特点：申请人需要提交GRE/GMAT或者EA，且申请时至少需要2年学士毕业后的全职工作经验。', 'https://mba.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Marketing Analytics and Insights', '市场营销分析与洞察理学硕士', 
                    '1年', 71940.0, '具有良好的本科学位，不限专业背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费71,940新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '统计与数据分析 Statistics and Data Analytics; 市场营销原理 Principles of Marketing; 市场营销中的大数据 Big Data in Marketing; 客户洞察 Customer Insights; 数字化营销 Digital Marketing; 市场营销研究 Marketing Research; 市场分析传播与可视化 Market Analytics Communication and Visualisation',
                    '商科, 市场营销, 商学院', '颠覆性技术创新给传统企业和现有企业带来了重大挑战，也创造了机遇。新加坡国立大学市场营销分析与洞察理学硕士项目紧跟技术发展的潮流，旨在为学生提供前沿的理论知识和实践训练，帮助学生掌握数据分析、需求预测、消费者行为剖析、产品概念创新、产品组合发展、定价促销决策及分销网络建立等方面的技能，以便在未来的商业实践中有更好的表现。', '商学院',
                    '市场营销', '8月', '机面（kira）/真人单面',
                    'NUS的市场营销硕士项目是商学院在2019年秋开设的新项目。为了顺应大数据环境下的营销行业对人才的需求，该项目非常注重对学生数据分析能力的培养。



就业服务：商学院天生的优势就是资源多，从入学开始，学院就会安排许多专家讲座和workshop，而且MAI项目还有自己的MAI Alumni Club，定期举办各类MAIers专属活动，就业不成问题。

招生特点：该项目招生人数在100人左右，基于NUS传统的招生习惯，背景偏好985和海本的学生；在本科专业上的限制不是很严格，有市场营销策略和数据分析能力的非商科也有录取机会。

班级概况：22fall班级整体人数在140人左右，中国学生大约占90%，全是亚洲人。同学背景方面，基本上是海本+985+211+中外合办院校，其中海本同学较多，占比80%，中外合办大学主要有香港中文大学（深圳）、宁波诺丁汉大学等学校。陆本主要有中山大学、同济大学、浙江大学、华中师范大学、对外经济贸易大学、上海外国语大学、上海大学等学校。', 'https://mscmarketing.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Strategic Analysis and Innovation', '战略分析与创新理学硕士', 
                    '1年', 71940.0, '具有良好的本科学位，不限专业背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
不要求具备工作经验
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费71,940新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '战略决策经济分析 Economic Analysis for Strategic Decisions; 创新战略 Innovation Strategy; 结果执行战略 Executing Strategy for Result; 战略可持续性 Strategic Sustainability; 利益相关者价值管理创新 Managing Innovation for Stakeholder Value; 互联世界的战略 Strategy for an Interlinked World; 数字公司的高效战略 Strategy for High Performance in Digital Firms',
                    '商科, 管理, 商学院', '新加坡国立大学战略分析与创新理学硕士课程旨在向应届毕业生传授各种战略和创新的概念和框架，并为他们提供创新如何在不断变化的商业环境中推动增长的新视角，课程允许通过体验式学习实际应用这些概念和框架。在一个日益快节奏和数据驱动的世界，管理者和企业家必须拥有尖端的分析技能，以设计创新战略实现公司高速增长和取得业绩。新加坡国立大学战略分析与创新硕士课程旨在培养未来的领导者，为其提供战略和创新关键领域的专业知识。', '商学院',
                    '管理', '8月', '机面（kira）/真人单面',
                    '2022年新开设的战略分析与创新硕士项目注重创新、战略制定和执行等关键商业主题。该项目旨在培养学生凭借数据进行分析、照顾利益相关者需求，并与团队合作解决挑战的能力。此外，本项目为学生提供更广泛、全面的商业运营视角，关注企业业绩上升的关键驱动因素以及它们之间的相互关系。就业服务：毕业生可以在管理、咨询、创业等领域从事相关工作，如数据分析、管理咨询等。招生特点：入围的申请人需要参加面试。本项目不限制专业，适合想要跨入商科的文科、理工科学生。项目开始时会有一个jumpstartprogramme，帮助学生快速掌握管理、创新和战略发展的软性技能与商业工具，了解当前商业世界关注的核心问题，从而快速上手。项目注重实践，包含一个businessproject。整体而言，该项目非常适合应届生申请。', 'https://mscstrategy.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Financial Engineering', '金融工程理学硕士', 
                    '1年', 64000.0, '具有良好的4年制本科学位或荣誉学位，可选择性提交GMAT或GRE，有相关工作经验者优先考虑，需要存款证明58,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '衍生品和固定收益 Derivatives and Fixed Income; 风险分析和管理 Risk Analyses and Management; 金融工程项目 Financial Engineering Project; 随机微积分和定量方法 Stochastic Calculus and Quantitative Methods; 编程和高级数值方法 Programming and Advanced Numerical Methods; 金融计量 Financial Econometrics; 企业融资和风险 Corporate Financing and Risk',
                    '商科, 金工金数, 风险管理学院', '新加坡国立大学金融工程理学硕士课程是一项跨学科课程，融合了金融学、数学和计算机学科，以实践为导向，力求解决金融领域的问题。金融工程理学硕士课程由新加坡国立大学风险管理研究所的前身——金融工程中心开设于1999年，旨在让金融领域和银行业的专业人士和应届毕业生掌握金融创新科技方面的先进知识。金融工程学科领域的知识包括金融产品开发、价格建模、套期保值、投资技术、风险分析与计算方法。在众多的金融工程硕士课程中，新加坡国立大学风险管理研究所的金融工程理学硕士课程独领风骚，力求将学员塑造成实干家，让他们不仅能够掌握必要的金融工程理论知识，还能够掌握专业的实践知识，有效地解决金融领域的复杂问题。', '风险管理学院',
                    '金工金数', '8月', '无',
                    '新加坡国立大学金融工程理学硕士课程是一门跨学科课程，融合了金融学、数学和计算机学科，以实践为导向，力求解决金融领域的问题。



就业服务：学校有专门的就业中心（CFG）并设立了网站，为学生提供一整套全面的就业服务，包括面试技巧，一对一职业咨询和简历撰写等等。同时也会从各个渠道为学生获取实习和全职工作机会。毕业后的就业领域主要是商业和投资银行、经纪和证券公司、非金融公司的财务和财务规划部门、保险公司、咨询公司、投资顾问公司、会计公司、政府金融机构、对冲基金、养老基金以及金融软件和技术企业，从事金融分析、资产管理、股票交易和金融相关研究工作以及基金经理或者咨询顾问等。

招生特点：2021年，新加坡国立大学金融工程硕士项目录取新生总计72人，其中全日制录取人数比例为75%，非全日制录取人数比例为25%。 男性占比54%，女性占比46%。学员平均年龄为24岁。中国学生占80%，新加坡学生占15%，印度和其他国家学生占5%。 录取学生平均GMAT成绩：703分，录取学生平均GRE成绩：324+3.5，录取学生平均托福成绩：103分，录取学生平均雅思成绩：7分。', 'https://rmi.nus.edu.sg/mfe-program/introduction/'
                );
-- 插入programs表数据 (批次 4/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc Accounting (Data & Analytics)', '会计学理学硕士（数据与分析）', 
                    '1年', 57770.0, '#NAME?',
                    NOW(), NOW(), '雅思: 6.5; 托福: 90', '国际财务报告准则中的财务报告1 Financial Reporting in the IFRS World I; 国际财务报告准则中的财务报告2 Financial Reporting in the IFRS World II; 价值创造管理 Managing for Value Creation; 会计信息系统 Accounting Information Systems; 数据分析应用统计学 Applied Statistics for Data Analysis; 数据编程 Programming with Data; 数据管理 Data Management',
                    '商科, 会计, 会计学院', '新加坡管理大学会计学理学硕士（数据与分析）项目专为那些有兴趣将数据技术应用于其领域以解决业务问题的专业人士而设计，尤其是在金融和会计部门。大量数据的流动对数据分析专业人员产生了很高的需求，他们可以分析此类数据并获得知情决策所需的洞察力。这对会计和金融服务公司至关重要，因为他们一直在处理客户提供的大量信息。', '会计学院',
                    '会计', '8月', '真人单面',
                    '新加坡管理大学会计学理学硕士（数据与分析）项目专为那些有兴趣将数据技术应用于其领域以解决业务问题的专业人士而设计，尤其是在金融和会计部门。大量数据的流动对数据分析专业人员产生了很高的需求，他们可以分析此类数据并获得知情决策所需的洞察力。这对会计和金融服务公司至关重要，因为他们一直在处理客户提供的大量信息。该项目是亚洲首个专业课程，成为亚洲第一批修读会计学硕士的学生，掌握关键的编程技能，为重要的商业决策提供支持。掌握机器学习和数据分析技能，擅长使用数据优化流程、优化资源和预测未来收入。该项目基于SMU-X 项目体验，通过实际行业项目学习，发展跨学科的问题解决技巧，并得到教职员工和行业合作伙伴的积极指导。该项目获得行业合作伙伴的认可。受到金融和商业领域领先企业广泛认可的开创性会计学硕士专业的各个方面都将使学生受益，并由专门的数据分析咨询委员会指导。就业服务：该项目拥有实习和全球沉浸式学习项目。通过工业实习和海外学习沉浸式项目或交换项目，提高学生的技能。这是装备学生具备在现实世界和国际视角下卓越表现所需的必备条件。此外，TheDato’KhoHuiMengCareerCentre(DKHMCC)：SMU设立于2012年9月18日，以表彰VitolAsiaPtdLtd前总裁、新跃大学董事会成员许惠明先生的慷慨捐赠而得名。该中心位于新跃大学行政大楼，拥有一流的设施，为新跃大学学生提供全面的服务、项目和资源，帮助他们规划职业发展方向，获取必要技能，实现潜力和目标。中心内设有三间培训室，供雇主举办信息会议，以及五间面试室，用于就业指导和与企业合作伙伴以及潜在雇主进行会议。隶属于新跃大学学术服务与运营（ASO）部门，包括招生与财务援助办公室、注册办公室和全球教育与机会中心。这些部门共同协作，支持学生在学业道路上的重要里程碑，助力学生顺利完成学业。该项目毕业生去向为：科技行业30％，审计/会计行业26％，商业/金融服务行业18％，制造业8％，房地产行业4％，零售/批发行业4％，教育行业4％，其他行业6％', 'https://masters.smu.edu.sg/programme/master-in-accounting'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Speech & Language Pathology', '言语​​与语言病理学理学硕士', 
                    '2年', 46162.0, '具有认可大学颁发的良好学士学位（平均成绩达到B或同等水平），或特殊情况研究生院委员会批准的其他资格和经验； 
通过核心项目工作人员设置的分班测试（面试和/或笔试）； 
根据具体情况会考虑通过核心项目工作人员指定的任意预备课程的申请者； 
优先考虑具有荣誉学位、适当工作经验和相关背景（解剖学、语言学、生理学或心理学）的申请者',
                    NOW(), NOW(), '雅思: 7.5; 托福: 620', '正常功能1 Normal Functioning 1; 正常功能2 Normal Functioning 2; 专业实践1 Professional Practice 1; 功能受损-儿童1 Impaired Functioning - Children 1; 功能受损-儿童2 Impaired Functioning - Children 2; 功能受损-成人2 Impaired Functioning - Adults 2; 专业实践2 Professional Practice 2',
                    '社科, 医学, 杨潞龄医学院', '新加坡国立大学言语​​与语言病理学理学硕士项目是一个为期两年的全日制课程，由杨潞龄医学院（SoM）和艺术与社会科学学院（FASS）联合提供，隶属于医学部管理。医学研究生（DGMS）。该项目于 2007 年 1 月开始，专为寻求言语和语言病理学家专业实践培训的任何学科的毕业生而设计。新加坡国立大学言语​​与语言病理学理学硕士项目每两年招生一次，通常包括 30 名候选人，其中包括具有相关工作经验的职业生涯中期毕业生，以及一些海外候选人。学生毕业后将获得新加坡国立大学 (NUS) 理学硕士学位（言语和语言病理学）学位。', '杨潞龄医学院',
                    '医学', '1月', '无',
                    '无', 'https://medicine.nus.edu.sg/dgms/SLP/home.html'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Learning Sciences and Technologies)', '教育学硕士（学习科学与技术）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 学习科学基础 Foundations of the Learning Sciences; 学习科学研究方法 Research Methodologies for the Learning Sciences; 计算机支持的协作学习与知识构建 Computer Supported Collaborative Learning and Knowledge Building; 技术作为认知工具 Technologies as Cognitive Tools; 以技术为媒介的学习环境的设计 Design of Technology-mediated Learning Environments; 神经科学、技术与学习 Neuroscience, Technology and Learning',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（学习科学与技术）项目旨在培养对学习科学的深入理解，为学生提供研究知识和技能，以便其在自己的专业兴趣领域进行相关调查，课程通过拓宽和深化当前学习理论和研究趋势的知识，培养具有教育21世纪学习者的能力的执业教育人员，研究方法和学习技术的使用也将成为特色，学生将有机会对技术支持的教学法进行小规模研究。', '教育学院',
                    '教育', '8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(learning-sciences-and-technologies)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc International Relations', '国际关系理学硕士', 
                    '1年', 33740.0, '具有荣誉学士学位或同等学历',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '国际关系研究 The Study of International Relations; 外交政策分析 Foreign Policy Analysis; 批判安全研究 Critical Security Studies; 东北亚国际关系研究 International Relations of Northeast Asia; 南亚国际关系研究 International Relations of South Asia; 制度研究 The Study of Institutions; 日本外交政策 Japanese Foreign Policy',
                    '社科, 国际关系, 国际研究学院', '新加坡南洋理工大学国际关系理学硕士学位课程旨在使学生更深入地了解瞬息万变的国际环境。提高学生分析并处理在日益复杂的世界中的国际问题的实际能力。使学生学会整合国际关系理论与相关政策，内容涵盖传统的军事安全领域以及非传统的能源领域和食品安全领域。南洋理工大学国际关系理学硕士学位课程旨在：加深学生对全球化国际体系中国家与非国家行为体之间关系的系统认识；巩固学生进行政策分析所需的理论知识基础，使学生能够在多变的政策环境中进行创新的政策分析。', '国际研究学院',
                    '国际关系', '8月', '机面（kira）',
                    '本项目致力于培养学生的国际关系理解能力，并激发他们形成自己的理念来应对动荡的世界局势。该项目帮助学生培养分析能力，理解复杂、相互依存的世界；使学生认识到理论对实践的重要性，并将在理论的指导下实践；同时使学生了解国家和非国家行为体之间的复杂动态，鼓励学生对政策分析进行创造性的反思。



就业服务：该项目的毕业生可以选择从事公共关系或媒体行业的职业，其他选择包括公政策制定或外交事务工作，国际组织和非政府组织的职位。此外，他们还可以选择在研究和学术领域继续深入学习。

招生特点：申请本专业需要提交一篇关于国家或国际重要议题的600字essay，并展示较强的思辨分析和定性研究能力，以及对国际关系具体领域的深刻认识。建议申请者熟悉智库的科研，了解时政热点。对于陆本学生，该项目的录取过程并不看重硬背景，该项目发现国关学院的东亚人整体比南亚人少。

班级概况：22fall班级整体人数在30人左右，中国学生占30%，其他还包括部分东南亚学生、法国和美国学生，部分学生有工作经验。', 'https://www.rsis.edu.sg/gpo/?gpo=msc_international_relations'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Managerial Economics (Executive MME Programme)', '高级管理经济学理学硕士（中文授课）', 
                    '1年', 38000.0, '具有一定的全职管理工作经验，并具有未来在管理层晋升的潜力
具备中国官方认可的本科学历和学士学位
对于具有出色管理经验的申请人，可以根据个案具体情况酌情放宽上述要求，需报教务处特批
其他要求由南洋理工大学斟酎而定',
                    NOW(), NOW(), '无', '管理经济学：理论与应用 Managerial Economics: Theory and Application; 宏观经济学：理论与应用 Macroeconomics: Theory and Application; 策略管理与企业政策 Strategy Management and Business Policy; 财务分析与财务管理 Financial Analysis and Financial Management; 宏观金融、金融市场与金融监管 Macro Finance, Financial Market and Financial Regulation; 城市与区域经济学 Urban and Regional Economics; 成本收益分析与项目评估 Cost Benefit Analysis and Project Evaluation',
                    '商科, 经济, 南洋公共管理学院', '新加坡南洋理工大学高级管理经济学硕士学位课程学制一年，以解析新加坡经济环境为参照，将经济学与金融学、管理策略、会计学等多学科融为一体。学员能全方位学习和理解经济政策、经济管理与商业策略。课程还包括相关的学习考察，提升学员的宏观经济管理水平与制定宏观经济政策的综合能力，并为学员提供与新加坡政府官员和工商界管理人士建立联系的良好平台。招生对象为来自中国的政府官员以及企业管理和专业人员。
课程设计注重理论基础与实际案例相结合, 旨在提高学员的决策分析、解决问题的能力和培养创新战略思维。课程由了解中国国情、学贯中西的专家学者讲授。部分课程采用实境教学，应用实践式学习，把课室学习模式延伸至实地考察学习，让学员得到不同行业的理论知识并与案例公司管理层进行会谈与交流，体验实际运作，再回归课室加强整体学习体验和效果。
为配合现代领导人该具备的娴熟的分析能力，高超的管理技巧及卓越的领导水平，两门必修课为打造经济学的理论基础。选修课则在不同领域中提升学员的领导才能、扩展学员的国际视野。', '南洋公共管理学院',
                    '经济', '3月', '无',
                    '无', 'https://www.ntu.edu.sg/education/graduate-programme/ncpa-master-of-science-(managerial-economics)-(executive-mme-programme)(march-intake)--1'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Applied and Public History', '应用与公共历史文学硕士', 
                    '1年', 39350.0, '具有新加坡国立大学荣誉学位（优异/二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B），需要相关学科背景（如历史和地区研究，以及人文和社会科学的学科或跨学科学术课程），具备能够衡量历史学科的能力；或具有学士学位以及相关研究生文凭，GPA不低于3.00；或具有学士学位以及相关研究生证书，GPA不低于3.00具有学士学位，需要相关学科背景（如历史和地区研究，以及人文和社会科学的学科或跨学科学术课程），具备能够衡量历史学科的能力，并具备至少2年相关工作经验经研究生院批准后，可能根据具体情况考虑具有其他资格和经验的申请者需要提供存款证明50,000新币需要提交writing sample（不超过20页）',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '史学：理论与档案 Historiography: Theory and Archive; 应用与公共史：理论、方法与实践 Applied and Public History: Theory, Method and Practice; 历史实习 Internship in History; 过去的档案与知识 Archives and Knowledge of the Past; 口述历史的理论与实践 Theory and Practice of Oral History; 历史与记忆 History and Memory; 博物馆与博物馆学：批判性视角 Museums and Museology: Critical Perspectives',
                    '社科, 历史, 人文社科学院', '历史系致力于促进历史在艺术、商业、政府和社会其他领域的合理应用。新加坡国立大学应用与公共历史文学硕士试图训练候选人恰当地利用历史来预测和利用趋势，制定政策，做出决定，并追求他们的事业。', '人文社科学院',
                    '历史', '8月', '无',
                    '无', 'https://fass.nus.edu.sg/hist/maph/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree LLM - MPA', '法学硕士 - 公共管理硕士双学位', 
                    '1.5年', 57724.0, 'LLM：具有良好的学士学位，需要法律背景 MPA： 具有良好的新加坡国立大学荣誉学位（二等或以上水平）或同等学历（例如，4四年制学士学位，平均成绩至少达到B或同等水平）；或具有良好的学士学位以及受研究生委员会认可的其他资格和经验 具备至少5年相关工作经验 需要提供组织结构图',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '经济分析 Economic Analysis; 治理研究项目 Governance Study Project; 公共政策选修课程 / 法律专业课程 (1) PP Elective / Law Specialisation (1); 法律核心课程 1 Law Core 1; 法律核心课程 2 Law Core 2; 法律核心课程 3 Law Core 3; 政策分析 Policy Analysis',
                    '社科, 法律, 法学院', '新加坡国立大学法学硕士 - 公共管理硕士双学位课程由法学院和李光耀公共政策学院提供，旨在为法律、公共管理和公共政策专业的学生提供广泛接触律师和公共机构领导人所面临的问题和挑战的机会。', '法学院',
                    '法律', '8月', '无',
                    '无', 'https://www.nus.edu.sg/prog/lawspp/llmmppmpa/index.htm'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Applied Linguistics', '应用语言学文学硕士', 
                    '1年', 44145.0, '具有良好的本科学位，需要英语语言研究背景；或
具有相关领域的良好本科学位，并具有英语语言研究研究生文凭
应届毕业生无法申请秋季入学',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '应用语言学研究方法 Research Methodology in Applied Linguistics; 话语研究 Discourse Studies; 语言习得研究 Language Acquisition Studies; 语言课程开发 Language Curriculum Development; 课堂教学的社会语言学视角 Sociolinguistic Perspective on the Classroom; 课堂话语分析 Classroom Discourse Analysis; 贯穿课程的语言 Language Across the Curriculum',
                    '社科, 语言, 教育学院', '新加坡南洋理工大学应用语言学文学硕士项目提供应用语言学研究领域的广泛课程，涵盖应用语言学、语言教学和语言学习等领域，同时注重理论知识和实践应用的平衡。该项目主要面向英语语言教学从业人员，提高他们的学术资质，促进职业发展，同时也适用于对语言感兴趣的人群。该项目为学生提供批判性看待应用语言学研究现状的机会，巩固学生语言学及语言学习相关的理论基础。学生将能够在不同背景下进行语言教学课题研究，研究语言相关的议题，获得称职的语言教育者和研究者所必备的语言素养，从而促进个人职业生涯的全面发展。在该项目的学习过程中，学生将接触到大量的最新概念，新技能，学会更科学地理解和看待新加坡及全球语言相关课题，从而能够在日常工作与生活中更好地欣赏语言的魅力并发挥语言的力量。', '教育学院',
                    '语言', '1/8月', '无',
                    '该项目主要面向从事英语语言教学的专业人士，提高他们的学术资质，促进他们的职业发展，同时也适合于对语言感兴趣的人群；适合英语专业申请，中文专业不要申请；秋季入学应届生不能申请（5.31前需要提供双证）。招生特点：偏好211985申请人，但也接受双非院校，GPA需要85+，需要专业对口；22fallofferhold群人数20+，大部分都有教育实习经验；秋季入学一般四五月份出结果。', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-(applied-linguistics)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Quantitative Finance', '定量金融理学硕士', 
                    '1年', 55590.0, '具有荣誉学位（或4年制学士学位），需要数学、统计学、经济学、金融学、计算机科学、工程学、物理科学背景，或具备同等学历，包含强大的数学背景
需要提交存款证明45,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '结构化产品 Structured Products 必修课程; 风险管理 Risk Management 必修课程; 金融衍生品：建模与计算 Financial Derivatives: Modelling and Computation 必修课程; 金融时间序列：理论与计算 Financial Time Series: Theory and Computation 必修课程; 定量金融概论 Introduction to Quantitative Finance 必修课程; 机器学习基础 Foundations of Machine Learning 选修课程（推荐）; 定量金融中的数据科学 Data Science in Quantitative Finance 选修课程（推荐）',
                    '商科, 金工金数, 理学院', '新加坡国立大学定量金融理学硕士学位课程由新加坡国立大学数学系，与经济系和统计与应用概率系合作开设的项目。该项目适合具备数学专业背景、想要通过研究生阶段的学习强化自身定量金融分析能力和职业技能的学生。随着金融市场变得更加复杂，需要更高层次的数学知识来更好地理解和分析金融模型和产品并降低风险。在过去的三十年里，定量金融已经发展成为一个活跃而成熟的数学分支。新加坡国立大学定量金融理学硕士学位课程的目标是为基于高级课程的量化金融提供培训。该计划的毕业生有望获得定量金融方面的高级知识，这将使他们能够满足金融部门对具有深入定量金融知识的专业人士日益增长的需求。', '理学院',
                    '金工金数', '8月', '无',
                    '由理学院数学系开设，经济系和统计数据科学系保持合作关系，主要是分析金融模型和金融产品以规避风险。面向有扎实数学基础或定量金融背景，想要通过研究生阶段的学习强化自身定量金融分析能力和职业技能的学生。 



就业服务：选修了实习课程后可以在新加坡实习。NUS有专门发布实习信息的网站，还可以在网站上预约一对一的职业辅导。未来的职业路径很广泛，比如金融行业的买方/卖方、固收/股权/大宗商品/加密货币/外汇、衍生品市场、前台的承销/交易/投行/财富管理、中台的风控、非金融行业的数据分析/数据科学等等。

招生特点：大陆地区是主要生源地，基本上都是985、211，近半数的学生拥有数学、统计、数据科学、金融工程等量化背景。也有金融、经济，或者其他自然学科、工科背景的学生。男女比例近1：1，女生占了53%。建议托福100+；雅思7.0，实习官方没有做要求，建议是至少一段量化相关实习。GPA方面，学校背景比较好的学生，3.0+或者80+的都可以尝试下，学校背景一般或者专业跨度较大的，可能85+可以尝试。往年也有不少录取者是90+以上。总体上，这个项目还是比较看重多样性的。

班级概况：22fall班级整体人数在100-120人左右，其中中国学生占比80%-90%。专业背景方面，以金工金数、数学专业为主。', 'https://www.math.nus.edu.sg/pg/mqf/prospective-students/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Theatre and Performance Studies', '戏剧与表演研究文学硕士', 
                    '1年', 41700.0, '具有新加坡国立大学荣誉学位（二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要该学科或相关领域背景（例如戏剧、表演、剧本、文学、文化史、性别研究，或人文和社会科学中的其他跨学科学术课程）；或<br>
具有良好的学士学位（平均成绩至少达到B或同等水平），需要该学科或相关领域背景，并且成功通过入学考试；或<br>
特殊情况下经研究生院批准会接受其他资格和经验。<br>
持有非荣誉学士学位的申请者需要具备2年相关工作或实践经验（例如作为戏剧从业者）<br>
需要提交writing sample（4000-6000字）<br>
需要提供存款证明50,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '未找到课程设置',
                    '社科, 艺术, 人文社科学院', '新加坡国立大学戏剧与表演研究文学硕士课程旨在培养批判性思维、研究能力和演讲技巧，特别适合那些寻求在艺术实践、工业、研究和社区进步领域工作的人。课程由亚洲表演、戏剧分析、基于实践的研究、数字人文以及文学、电影和表演的跨学科研究等领域的全球知名领导者授课，学生将接受密切的批判性和历史背景分析的培训，并具备从艺术组织领导者到文化研究助理到艺术政策制定者等广泛角色的文化领导所需的技能。由于课程强调艺术和人文学科的数字技能，该专业学生将能够以独特的方式将数字工具应用于各种公共、教育和行业背景下的专业活动，如档案开发，交互设计和多媒体界面。', '人文社科学院',
                    '艺术', '8月', '真人单面',
                    '无', 'https://fass.nus.edu.sg/elts/ma-by-coursework-tps/'
                );
-- 插入programs表数据 (批次 5/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Chinese Culture and Language', '中国文化与语言文学硕士', 
                    '1年', 41700.0, '具有新加坡国立大学荣誉学位（优异/二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平学历）；或
具有该学科或相关领域的良好的学士学位（平均成绩至少达到B或同等水平），并成功完成入学考试；或
具有人文社科学院认可的其他资格和经验。
需要提供存款证明50,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '当代汉学研究导论 Contemporary Research in Chinese Studies; 当代汉语研究导论 Contemporary Research in Chinese Language; 唐帝国的历史与文明——政治、制度与文化 History and Civilizations of the Tang Empire; 中国佛教宣教文学 Chinese Buddhist Proselytic Literature; 新马地区的传统中国文化 Traditional Chinese Culture in Singapore and Malaysia; 明代的社会与文化 Society and Culture of the Ming Dynasty; 影响近代中国的南洋华人 Prominent Nanyang Chinese in Modern China',
                    '社科, 文化, 人文社科学院', '新加坡国立大学中文系为亚洲地区汉学研究的中心之一。它的宗旨在于促进汉学与汉语学科专业的研究与教学，为世界各地的学生和学者提供进修和研究的机会。中文系隶属于国大文学暨社会科学院，其师资人员来自世界各地的著名学府。近年来，每年有超过1千名学生修读本系开办的各级课程。新加坡国立大学中国文化与语言文学硕士项目旨在为对中国文、史、哲、语言和海外华人感兴趣的相关领域的毕业生提供高素质综合课程，以便提供进一步深造的机会。此项目也为华文教师、新闻从业员和其他相关的华文工作者提供深造和进修的机会。', '人文社科学院',
                    '文化', '8月', '无',
                    '本课程以中国文学、历史、哲学、语言为中心，同时涉及海外华人研究课题，为相关领域的毕业生或感兴趣的人士提供深造与进修的机会。作为新加坡国立大学文学暨社会科学院（FASS）中文系的硕士课程，它的设置参照了美国大学的标准，研究领域不仅涵盖中国文学和语言，还包括中国的历史、哲学、宗教、文化等方面的研究，与国内中文系有所不同。



就业服务：大多数毕业生选择回国工作，从事语文教学工作较多，也有考公务员、进入互联网企业等。在新加坡寻找实习或工作的话，对英语能力的要求较高。极个别毕业生会留在当地中文报馆、中国人开的公司或在庙宇道观做文职工作。

招生特点：申请者需要具备985、211汉语言相关专业的背景，极个别申请者可以是英语或其他文学专业或双非和海本背景。申请者的平均成绩需要达到85分以上。申请过程中不进行面试，师范类211学校的申请者在与其他211学校的申请者竞争时具有优势。申请截止后，学校会统一审理申请材料。

班级概况：22fall班级整体人数在140人左右，其中基本都是中国学生。同学背景方面，大部分是985和211学生，有清华大学、北京大学、浙江大学、郑州大学、苏州大学等学校。', 'https://fass.nus.edu.sg/cs/masters-coursework/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Knowledge Management', '知识管理理学硕士', 
                    '1年', NULL, '具有良好的学士学位，不限专业背景
优先考虑具备公共或私人机构管理或公司经验的申请者
达到二等二/荣誉（优等）学位及以上水平或同等学历
实习经验不计入工作经验，建议申请者具备至少1年全职工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '知识管理基础 Foundations of Knowledge Management; 知识管理实践 Knowledge Management Practices and Implementation; 信息与知识资产 Information and Knowledge Assets; 知识管理战略和政策 Knowledge Management Strategies and Policies; 知识管理技术 Knowledge Management Technologies; 组织理论与实践 Organisational Theory and Practice; 知识组织 Organisation of Knowledge',
                    '商科, 信息系统, 传媒与信息学院', '新加坡南洋理工大学知识管理理学硕士学位课程是一门促进识别、捕获、评估、检索和共享企业所有信息资产的集成方法的学科，新加坡南洋理工大学知识管理理学硕士学位项目专为来自公共和私营部门组织的学生设计，凭借人力和知识资源直接提高运营能力和盈利能力。', '传媒与信息学院',
                    '信息系统', '8月', '无',
                    'MSc in Knowledge Management项目旨在聚焦于企业知识和人才的管理。有效的知识管理可以集中企业智慧，优化内部架构，提高工作效率，打造学习型组织，更好地为客户提供和创造价值，提高企业在日新月异市场环境中的核心竞争力。



就业服务：km毕业后其实没有固定的就业方向，产品经理、咨询、金融、供应链、审计、国企等都有可能。决定学生km毕业后从事什么工作的，还是学生本科的专业！但km教授的系统学思维方式在任何工作中都十分受用。互联网企业、研究院、设计院、管理咨询公司等知识型的企业，以及各种行业的这种数据服务平台到知识管理专员、知识管理工程师等等；国家及地方的信息化管理机构，政府机关和事业单位信息中心，跨国公司和大型的企业信息部门，各类图书馆，高等院校和科研院所等，从事信息资源和系统的开发、运行维护服务的业务与管理工作。

招生特点：km的录取难度在ntu来说并不算大！！同学的背景比较多元，大约一半的海本（其中不乏波士顿大学、纽约大学、加州大学这类很棒的学校）陆本中985、211和双非都有（双非的同学一般是有工作经验的）。录取难度和商学院那种只要顶尖985的比起来还是简单很多的，但确实每一个同学都均分高并且实习丰富。新加坡的学校比较看重申请者的本科院校，偏好985和211。NTU的KM接纳的本科范围还是很广的，历年来从管理类专业到传媒、语言学、工科，都有拿到KM offer的。GPA建议85+，项目比较偏好有工作经验的同学。

班级概况：22fall班级整体人数在70人左右，大约有60个中国学生。同学背景方面，有十几个海本（澳门本科与美本）的中国学生，陆本学生本科以985、211和部分双非为主，985、211学生占绝大多数，双非学生主要集中在深圳大学、华南农业大学和广东外语外贸大学等学校，专业背景大致包括会计、传媒、语言、商科。有部分学生具有工作经验，大概占比30%左右。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-knowledge-mangement'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Accountancy', '会计学理学硕士', 
                    '1年', 61040.0, '具有良好的学士学位，不限专业背景
建议具备良好的GMAT/GRE成绩
有工作经验者优先考虑（不强制要求）',
                    NOW(), NOW(), '雅思: 6.5; 托福: 100', '会计信息 Accounting Information; 商业法/公司法中法律约束管理 Management of Legal Obligation in Business/Company Law; 决策与管理会计 Accounting for Decision Making and Control; 保险、鉴证和审计 Assurance, Attestation and Auditing; 税务管理 Tax Management; 企业战略 Corporate and Business Strategy; 会计分析和股票估值 Accounting analysis and equity valuation',
                    '商科, 会计, 商学院', '南洋理工大学会计学理学硕士项目是为非会计专业的毕业生提供一条加入会计行业或者在会计和财务领域寻求职业发展的途径。该硕士项目毕业生将有资格参加新加坡资格计划（SQP）专业考试，从而有机会成为新加坡特许会计师。通过该硕士项目课程的学习，学生会拥有全球化的视角，同时专注于亚洲地区的商业和会计问题。毕业生会成为国际四大会计师事务所争相追逐的专业人才，他们将有能力在会计领域创立一番事业。', '商学院',
                    '会计', '7月', '真人单面',
                    '南洋理工大学的会计学是新加坡成立最久的会计项目，有超过50年的历史，该项目以前是研究型硕士，后来改成了授课型硕士。



就业服务：NTU的MACC课程由新加坡会计委员会(SAC)认证，毕业生可以直接进入新加坡特许会计师资格专业课程，快速获得专业会计资格。此外，也享有ICAEW、CPA Australia、ACCA、CIMA等国际会计机构的豁免。NTU商学院也为学生提供了足够的就业支持。商学院的GSCDO (Graduate Studies Career Development Office) 有专业的职业顾问，提供职业规划、求职策略等指导，并将学生与行业和校友联系起来。

招生特点：该项目每年招收80多位的学生，大多来自国内985和211大学，也有一些来自海外本科和一本财经类强校的同学，不限专业背景，偏好有工作经验的学生，平均工作年限为两年。GRE/GMAT是硬性要求，录取平均GMAT 720。该项目申请过程中共有两轮面试，一轮AI面试，一轮视频真人面试。

班级概况：22fall班级整体人数在80-100人左右，其中90%-95%都是中国学生，其他还有印度学生、新加坡学生。学生背景方面，211和财经院校居多，学生以陆本为主，少数海本。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-science-in-accountancy'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'MSc CFO Leadership', 'CFO领导力理学硕士', 
                    '1.5年', 238667.0, '- 申请者必须在认可的高等教育机构颁发的本科学位中能够证明良好的先前学术成绩，不限专业背景，那些没有大学学位但有杰出职业履历的人可能会根据具体情况被考虑
- 申请者必须具备足够的数学/微积分背景
- GMAT或SMU入学考试*是该课程入学的强制性要求（学校没有设定最低GMAT分数要求，600+被视为具有竞争力）
- 有本科毕业后工作经验的申请者将具备额外的优势（需要具备至少7年全职相关工作经验）
- 入围的申请者将被MPA招生委员会邀请进行面试，针对国际学生，如果他们不在新加坡，将进行电话面试
* 申请者只有在提交在线申请表后才能参加SMU入学考试，需要联系管理办公室参加SMU入学考试',
                    NOW(), NOW(), '无', '国际财务报表准则下的财务报表分析 Financial Reporting in the IFRS World; 商业法律问题和风险 Legal issues and Risks in Business; 风险治理 Risk Governance; 税收筹划 Tax Planning; 全球经济和金融市场解析 Understanding the Global Economy and Financial Markets; 融资决策 Financing Decision; 商业评估 Business Valuation',
                    '商科, 会计, 会计学院', '新加坡管理大学会计学院的CFO领导力理学硕士课程是一个独特的研究生学位课程，旨在培养会计和财务方面的专业知识，以及领导和管理技能。该课程旨在使财务和商业领袖具备在当今充满挑战的商业环境中有效管理财务职能的广泛能力。', '会计学院',
                    '会计', '8月', '无',
                    '无', 'https://masters.smu.edu.sg/programme/master-in-cfo-leadership'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Asian and Global History', '亚洲与全球历史文学硕士', 
                    '1年', 39350.0, '具有新加坡国立大学荣誉学位（优异/二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B），需要相关学科背景（如历史和地区研究，以及人文和社会科学的学科或跨学科学术课程），具备能够衡量历史学科的能力；或具有学士学位以及相关研究生文凭，GPA不低于3.00；或具有学士学位以及相关研究生证书，GPA不低于3.00具有学士学位，需要相关学科背景（如历史和地区研究，以及人文和社会科学的学科或跨学科学术课程），具备能够衡量历史学科的能力，并具备至少2年相关工作经验经研究生院批准后，可能根据具体情况考虑具有其他资格和经验的申请者需要提供存款证明50,000新币需要提交writing sample（不超过20页）',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '史学：理论与档案 Historiography: Theory and Archive; 探讨世界历史 Approaches to World History; 探讨近代东南亚历史 Approaches to Modern Southeast Asian History; 探讨近代东亚历史 Approaches to Modern East Asian History; 文化史问题 Problems in Cultural History; 帝国主义与帝国：历史方法 Imperialism and Empires: Historical Approaches; 中国史学 Historiography on China',
                    '社科, 历史, 人文社科学院', '攻读新加坡国立大学亚洲与全球历史文学硕士课程的学生将研究亚洲和世界各地不同文化和社会的历史。他们还将深入了解新加坡的历史，了解塑造民族国家的民族认同的动态叙事。课程的广泛组合将有助于培养毕业生的跨文化同理心和对差异的宽容，使他们能够在不同的文化环境中茁壮成长。', '人文社科学院',
                    '历史', '8月', '无',
                    'MA Asian and Global History专业旨在探索亚洲历史与全球历史之间的联系和相互影响。该专业将帮助学生深入了解亚洲历史的多样性和复杂性，并提供一种全球视野，以理解亚洲历史在全球历史中的地位和角色。 该专业侧重于培养学生在亚洲和全球历史领域内的研究和分析能力。学生将学习亚洲历史的各个方面，包括政治、经济、文化和社会等，并了解亚洲与其他地区的相互联系。此外，该专业还强调全球历史的视角，帮助学生理解亚洲历史与其他地区的互动和全球历史的发展。 就业服务：MAAsianandGlobalHistory专业的毕业生将具备广泛的历史研究和分析能力，以及对亚洲和全球历史的深入理解。他们可以在各种领域中找到就业机会，包括教育、研究、出版、文化遗产管理、政府和国际组织等。此外，他们也可以继续攻读博士学位，进一步深化研究和学术发展。', 'https://fass.nus.edu.sg/hist/magh/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Japanese Visual Cultures', '日本视觉文化文学硕士', 
                    '1年', 39300.0, '具有良好的新加坡国立大学荣誉学位（优异/二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要相关学科背景，如人文科学、社会科学、区域研究和其他跨学科研究，具备学习过亚洲或文学、媒体与视觉文化相关学科的证据或已获得高级日语技能；或<br>
具有良好的学士学位（平均成绩至少达到B或同等水平），需要相关学科背景，如人文、社会科学、区域研究和其他跨学科研究，具备学习过亚洲或文学、媒体与视觉文化相关学科的证据，并成功完成入学考试；或<br>
特殊情况下会接受其他相关资格和经验且成功完成入学考试的申请者，需经研究生院批准。<br>
需持有先前学习过日语（初级或更高水平）的证明、任何JLPT证书或同等证书<br>
需要提供存款证明50,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '未找到课程设置',
                    '社科, 文化, 人文社科学院', '<p>新加坡国立大学日本视觉文化文学硕士项目采用比较、跨地区和跨文化的方法来探索日本及其他地区的视觉文化。该项目解决了当今世界信息日益可视化的问题，为学生提供了一个及时的机会，了解视觉文化如何在全球范围内传播和适应，并以视觉文化生产领域的先驱日本为中心参考点。</p><br />
<p>新加坡国立大学日本视觉文化文学硕士项目的课程在学术严谨性和实际行业洞察力之间取得了独特的平衡。学生将熟练地使用英语和日语的各种数据源。学生还将获得批判性思维和创新技能，这对于驾驭现代世界错综复杂的视觉传播以及在视觉文化行业的职业生涯至关重要。</p>', '人文社科学院',
                    '文化', '8月', '真人单面',
                    '无', 'https://fass.nus.edu.sg/jps/majvc/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Finance', '金融学理学硕士', 
                    '1年', 71940.0, '具有良好的本科学位，不限专业背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（如果可以需提供不低于600的GMAT成绩，一般要求GMAT 700+或同等水平）
不要求具备工作经验
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费71,940新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '金融学概论 Introduction to Finance; 金融建模 Financial Modelling; 金融会计 Accounting for Finance Professionals; 应用公司金融 Applied Corporate Finance; 投资学基础 Foundation of Investments; 期权与固定收益 Options and Fixed Income; 国际金融与经济 International Finance and Economics',
                    '商科, 金融, 商学院', '新加坡国立大学金融理学硕士项目是专为刚毕业的学生设计的，致力于培养其更好的应对现今金融行业的巨大变大。 新加坡国立大学金融理学硕士项目创新性的融入了自学和体验式教学体验，从而帮助学生了解金融行业最前沿的知识，同时教会学生去发现、运用最有效的手段处理全球金融市场的各种问题。 新加坡国立大学金融理学硕士项目允许学生根据自己的职业目标选择企业金融、金融投资学或金融与技术具体的专业方向进行课程选修。', '商学院',
                    '金融', '8月', '机面（kira）/真人单面',
                    'NUS 的金融硕士是18年开设的项目，class size从第一年招生的40人左右，至21fall达到190+，整体国际生比例较高（95%左右）。



就业服务：项目提供给了同学们很多实践机会和就业辅导服务（包括简历修改、模拟面试、实习信息分享等），就业方面截至目前有拿到包括高盛、华泰联合、四大行、互联网、公募、私募等各行业全职工作的机会，地点包括新加坡、大陆、香港。

招生特点：GMAT/GRE非申请硬性要求，但若带高分申请会比较加分；后续审理包括video面和人面2个环节，面试表现非常重要。

班级概况：22fall班级整体人数在120人左右，中国学生占70%。同学背景方面，以海本同学为主，美本和英本较多。国内以985、211同学为主，例如国内的有复旦大学、上海交通大学、山东大学、北京师范大学、华东师范大学等，同时学校比较看重陆本同学的海外经历。', 'https://mscfin.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Music', '音乐硕士', 
                    '2年', 72750.0, '申请者应该已完成或处于完成合格学位课程的最后一年
需要提交预筛选试镜视频或作品集，预选后入围的申请者将被邀请参加线下试镜
申请者需要具备充分的音乐理论知识，需要通过音乐能力测试',
                    NOW(), NOW(), '无', '分析&作曲 Analysis & Composition; 情境研究 Contextual Studies; 专业整合领域课程 Courses in Professional Integration Areas',
                    '社科, 艺术, 杨秀桃音乐学院', '新加坡国立大学音乐硕士项目旨在促进个人专业领域更高水平的音乐学习，发展与新加坡和国际音乐教育社区相关的特定乐器和团体教学能力，并促进在音乐行业获得成功所需的专业学习。学生在自己的专业领域有很强的能力，在音乐解读方面有更深入的知识，在高水平的合奏中有丰富的经验(通常是领导角色)，在教学和研讨会中有理论和应用理解，在各种环境中有更强的沟通和专业能力。', '杨秀桃音乐学院',
                    '艺术', '8月', '无',
                    '无', 'https://www.ystmusic.nus.edu.sg/programmes-master-of-music/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Double Degree LLM - MPP', '法学硕士 - 公共政策硕士双学位', 
                    '2年', 63536.0, 'LLM：具有良好的学士学位，需要法律背景 MPP： 具有良好的新加坡国立大学荣誉学位（二等或以上水平）或同等学历（例如，4四年制学士学位，平均成绩至少达到B或同等水平）；或具有良好的学士学位以及受研究生委员会认可的其他资格和经验 具备2-5年工作经验者优先考虑，申请者需要表现出成熟和对公共服务的投入 最好具备一些数学和经济学背景',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '公共政策经济基础 Economic Foundations for Public Policy; 公共政策定量研究方法 1 Quantitative Research Methods for Public Policy 1; 公共政策基础 Foundations of Public Policy; 李光耀学院课程 LKY School Course; 公共政策选修课程 1 PP Elective 1; 公共政策选修课程 2 PP Elective 2; 政策挑战 Policy Challenges',
                    '社科, 法律, 法学院', '新加坡国立大学法学硕士 - 公共政策硕士双学位课程由法学院和李光耀公共政策学院提供，旨在为法律、公共管理和公共政策专业的学生提供广泛接触律师和公共机构领导人所面临的问题和挑战的机会。', '法学院',
                    '法律', '8月', '无',
                    '无', 'https://www.nus.edu.sg/prog/lawspp/llmmppmpa/index.htm'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSc Strategic Studies', '策略研究理学硕士', 
                    '1年', 33740.0, '具有荣誉学士学位或同等学历',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '国防安全策略分析 The Analysis of Defence and Security Policies; 战略思想的进化 The Evolution of Strategic Thought; 国防科技管理 Management of Defence Technology; 战争研究 The Study of War; 恐怖主义情报与国土安全 Terrorism Intelligence and Homeland Security; 打击叛乱和恐怖主义进程中的问题 Problems in Combating Insurgency and Terrorism; 亚洲核政治 Nuclear Politics in Asia',
                    '社科, 国际关系, 国际研究学院', '新加坡南洋理工大学策略研究理学硕士项目旨在帮助学生更好地理解军事力量的运用，以及为了实现政治目标不同资源的协调和调度方向。该项目旨在培养受过广泛教育、政治敏感、国防和安全从业人员以及国防和对安全敏感的人，他们一般有以下特点：对印太地区紧张的国家问题、跨国和区域战略挑战问题有细致入微的理解；在日益全球化的世界中，能系统地解国家和非国家之间的安全互动；有制定国家安全政策和国防战略以及私营部门安全政策所必需的批判性思维技能。', '国际研究学院',
                    '国际关系', '8月', '无',
                    '无', 'https://www.rsis.edu.sg/gpo/?gpo=msc_strategic_studies'
                );
-- 插入programs表数据 (批次 6/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Educational Management', '教育管理文学硕士', 
                    '1年', 44145.0, '具有良好的学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具备至少2年公共或私营部门管理经验，申请者应该是学校部门的负责人，学校的副校长或校长，教育部的督学及高级官员，大学和理工学院的教师或公共或私营部门的主管和管理者
应届毕业生无法申请秋季入学',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '量化研究方法 Quantitative Research Methods; 定性研究方法 Qualitative Research Methods; 批判探究 Critical Inquiry; 教育政策关键问题 Key Issues in Education Policy; 人的发展和学习理论 Human Development and Learning Theories; 教育政策分析 Educational Policy Analysis; 教育哲学 Philosophy of Education',
                    '社科, 教育, 教育学院', '南洋理工大学教育管理文学硕士项目为在教育服务中担任管理职位的个人（例如校长、副校长、部门负责人、负责职位的教师和教育部官员）设计；以及在其他学习和培训企业（例如军队、护理和其他私立和高等教育机构）具有管理经验的人而设计，旨在使学生能够在快速变化的时代有效地为所在的组织发展知识、技能和能力。 南洋理工大学教育管理文学硕士项目追求三个广泛的目标：（i）使有抱负的教育领导者更加了解教育管理中的关键问题，从而将有效的方法应用于工作（ii）帮助他们积极有效地应对当前影响教育管理的挑战 (iii) 使学生能够获得公认和有价值的研究生荣誉。涵盖的主题包括：教育研究方法（定量和定性）；组织学习和发展；教育哲学；教育领导者的跨学科思维；教育工作者的道德和领导力；评估质量和标准；监督领导和课程设计；仆人式领导；教师专业学习的理论与实践；教师作为领导者；为专业发展和领导继任提供指导；教育技术应用管理；教育中的比较问题；学校营销；学校和组织的有效性；教育政策理论的历史和哲学基础；教育政策的关键问题；以及在幼儿和小学教育方面的领导。', '教育学院',
                    '教育', '8月', '无',
                    '项目为在教育服务中担任管理职位的个人（例如校长、副校长、部门负责人、负责职位的教师和教育部官员）设计；以及在其他学习和培训企业（例如军队、护理和其他私立和高等教育机构）具有管理经验的人而设计，旨在使学生能够在快速变化的时代有效地为所在的组织发展知识、技能和能力。就业服务：毕业生可以选择就职于中小学、高校、高职、中职、高专、中专，教育部、教育厅、教育局、人事考试院，出版社、杂志社、电视台，培训机构。招生特点：录取案例中985/211/双非都有，均分80+，有丰富工作经验的申请者将非常有优势。', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-(educational-management)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Human Capital Management and Analytics', '人力资本管理与分析理学硕士', 
                    '1年', 71940.0, '具有良好的本科学位，不限专业背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
不要求具备工作经验
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费71,940新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '人员分析 People Analytics; 人力资源管理定量方法 Quantitative Methods for HRM; 人才管理 Talent Management; 人力资源人工智能 AI for HR; 人力资源专业人士沟通 Communication for HR Professionals; 人力资源技术 HR Tech; 体验式学习 Experiential Learning',
                    '商科, 人力资源管理, 商学院', '新加坡国立大学人力资本管理与分析理学硕士课程旨在让应届毕业生具备未来的人力资本管理技能和能力。在过去的20年里，人力资源(HR)领域取得了巨大的发展，人力资源职能将需要具备新的和更熟练的人才，尤其是在数据分析方面。新加坡国立大学人力资本管理与分析理学硕士课程将结合人力资源功能能力和分析视角，为学生在工作中发展合适的变化铺平道路。', '商学院',
                    '人力资源管理', '1月', '真人单面/机面（kira）',
                    'NUS商学院近些年来频繁开设新项目，从之前的MSF到营销、会计，并且在21年年初再次宣布新开了一个人力资本管理与分析硕士，即HCMA。HCMA是一个春季入学的项目，不开放秋季申请，这和NBS的管理是一样的设置，开学时间在1-2月份。
项目与其他大部分人力资源管理项目不一样的地方在于，它除了传统的人力资源管理方法外，还融合了HRM和AI，引入了数据分析的方法来解决人力资源管理问题，比较注重培养学生战略思维、设计思维和分析技能，使学生能够将这些技能运用在人力资源管理领域，也会引导学生从更广阔的角度，考虑社会和行业趋势，做出合理的人力资源决策。', 'https://mschcma.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Malay Language)', '教育学硕士（马来语）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 语言教育研究 Research in Language Education; 批判性与创造性思维促进学习 Critical and Creative Thinking to Enhance Learning; 文学教育 Literature Education; 新加坡马来语的特点 Features of the Malay Language in Singapore; 马来语教学校本课程设计 School-based Curriculum Design for Malay Language Teaching; 马来语和伊斯兰传统教育 Education in Malay and Islamic Traditions',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（马来语）项目旨在为教育专业人员提供马来语教育的功能综合学术、实验和实地研究，该课程在社会文化背景下调查马来语言、文学和文化的研究理论和方法，将与马来语言课程开发和学校教学法的当前实践和进展一起提供，提供马来语和马来文学与文化研究的理论基础，以及调查这些领域与语言教学和学习的交集的机会，提高了教师和其他语言教育专业人员的研究技能和知识基础。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(malay-language)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Sustainable and Green Finance', '可持续与绿色金融理学硕士', 
                    '1年', 65400.0, '具有良好的本科学位，不限专业背景
不强制要求提交GMAT/GRE，但良好的GMAT/GRE成绩将有助于申请（一般要求GMAT 700+或同等水平）
不要求具备工作经验
需要提供能够覆盖学费与生活费金额的存款证明（2025学年学费65,400新币，生活费预算至少19,500新币）',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '金融与会计导论 Introduction to Finance and Accounting; 公司治理与可持续发展 Corporate Governance and Sustainability; 可持续性经济学 Economics of Sustainability; 基础公司金融 Foundational Corporate Finance; 基础投资学 Foundational Investments; 影响评估与影响投资 Impact Assessment and Impact Investing; 可持续性与绿色投资 Sustainable and Green Investment',
                    '商科, 金融, 商学院', '新加坡国立大学可持续与绿色金融理学硕士课程旨在培养能够挑战亚洲及其他地区的企业、金融机构和投资者所面临的可持续发展问题的毕业生，提高人们对金融如何通过实践方法帮助解决这些挑战的认识。', '商学院',
                    '金融', '8月', '机面（kira）/真人单面',
                    '22fall新开项目，由NUS商学院和可持续与绿色金融研究所（SGFIN）共同开设，项目时长 12 个月。



就业服务：环境、社会和治理 、可持续发展和绿色项目融资、可持续发展及绿色工具与产品开发等。

招生特点：TOEFL 100+/ IELTS 7.0+，GMAT/GRE非强制，但良好的GMAT/GRE分数会给申请加分；初审通过后的同学会收到面试邀请，面试表现将影响是否录取。22fall招生规模大概在35-40人。

班级概况：22fall班级整体人数43人，其中80%左右是中国学生。同学背景方面，大部分是海本同学，例如纽约大学、不列颠哥伦比亚大学、多伦多大学及瑞士本科等学校。国内本科的学校有中国海洋大学、西南财经大学、东南大学等学校。专业背景方面，一半都不是金融会计相关专业的背景，例如环境学等专业。', 'https://msgfin.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'Juris Doctor', '法律博士', 
                    '3年', 25434.0, '法学专业或非法律专业本科毕业生均可申请，需要满足以下条件：
- 完成本科教育，不限专业背景，至少获得Cum Laude或Second Class Upper荣誉学位；或
- 法学毕业生需毕业于执行Civil Law法律体系的国家，或授予法律本科学位的高校不在由新加坡政府认证的法学院名单内，至少获得Cum Laude或Second Class Upper荣誉学位。
欢迎在7月初之前获得正式成绩单和学士学位证书的毕业生申请
不需要提交GRE/GMAT或SMU入学考试成绩
可以选择性提交LSAT或LNAT',
                    NOW(), NOW(), '雅思: 7.5; 托福: 100', '合同法（一） Contract Law 1; 刑法 Criminal Law; 法律研究写作 Legal Research Writing; 法律体系、方法及分析 Legal System, Legal Method & Analysis; 公司法 Corporate Law; 物权法 Law of Property; 商业纠纷法 Commercial Conflict of Laws',
                    '社科, 法律, 法学院', '新加坡管理大学法律博士课程由法律学者和法律从业人员在广泛讨论后制定，并得到新加坡法律教育学院和法律部的认可。该课程中学生参与大量的课前准备阅读和思考，并积极参与课堂讨论。学校的互动/参与式学习环境有助于培养信心、分析和表达技能，而这些都是在法律和企业界取得优异成绩的关键。该课程的一个显著特点是，将邀请来自法律行业实践、政府和司法部门的律师参加课堂教学。这将使学生将实践专业知识与理论和学说相结合。', '法学院',
                    '法律', '8月', '无',
                    '无', 'https://masters.smu.edu.sg/programme/juris-doctor'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Literary Studies', '文学研究文学硕士', 
                    '1年', 41750.0, '具有新加坡国立大学荣誉学位（二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要该学科或相关领域背景；或
具有良好的学士学位（平均成绩至少达到B或同等水平），需要该学科或相关领域背景，并且成功通过入学考试；或
特殊情况下经研究生院批准会接受其他资格和经验。
需要提交writing sample（4000-6000字）
需要提供存款证明50,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '十八世纪文学专题研究 Topics in the Eighteenth Century; 二十世纪文学专题研究 Topics in the Twentieth Century; 文学与环境文学 Literature and the Environment; 现代文学批评理论 Modern Critical Theory; 现代诗歌 Modern Poetry; 文学研究工作坊 Research Workshop; 学位论文 Honours Thesis',
                    '社科, 文化, 人文社科学院', '新加坡国立大学文学研究文学硕士学位课程为学生提供模块化学分系统的全面教学课程。通过学习教学模块，学生在当代文学研究中发展高级知识和批判性技能。学生将学习10个专门的MA模块：3个基础模块，以及从一系列更专业的选修课中选择的7个模块。还包括一个独立学习模块，学生在与教师主管协商的情况下构思自己的短篇研究论文。', '人文社科学院',
                    '文化', '8月', '真人群面',
                    '该项目师资团队在英美文学、南亚、东南亚及其他新兴英语语系文学、电影与视觉文化、文学批评与文化理论领域都具备大量的专业知识。因此学生通过学习英美国文学以及南亚和东南亚等地区的文学，来培养对语言的严谨敏感性、具有特殊透视力的解读能力以及辩证和写作的技巧。就业服务：毕业后，学生可以从事戏剧、电影、电视和写作等创意实践领域、公务员机构的各个部门、研究生研究和大学教学、银行、金融和咨询行业、言语病理学和言语治疗、翻译和口译出版、市场营销、公共关系、活动管理、管理和企业管理、创业、各级学校的教学和教育管理、艺术、娱乐和媒体产业、广告、新闻业。招生特点：该项目隶属于英语系，主要面向英语类背景的学生，申请时需要提交4000-6000字的writingsample。22/23年招生人数为34人，申请难度较高并且出结果时间较晚，最好提前做好接offer的规划。', 'https://fass.nus.edu.sg/elts/ma-by-coursework-en/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Linguistics', '语言学文学硕士', 
                    '1年', 40330.0, '具有良好的学士学位
不需要具备先前的语言学课程工作或培训经验',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '语言学概论 Introduction to Linguistics; 心理语言学研究方法 Research Methods in Psycholinguistics; 语言障碍 Language Disorders; 神经语言学 Neurolinguistics; 语言发展 Language Development; 多语言与认知 Multilingualism and Cognition; 传播科学 Communication Sciences',
                    '社科, 语言, 人文学院', '语言学是对语言的科学研究，其中有许多学科交叉。例如，心理学和语言学领域在人们如何习得语言的问题上结合在一起；神经科学和语言学一起研究语言功能及其神经关联；社会学为不同群体和地方的语言使用差异提供了语言学分析。南洋理工大学语言学文学硕士课程在更深层次上提供了语言和交流这些元素的全面教育，旨在让学生进一步发展他们对各种语言子专业的兴趣和理解，并鼓励他们在语言学及相关学科方面建立全面的理论基础。', '人文学院',
                    '语言', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-arts-in-linguistics'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Music Leadership', '音乐领导力硕士', 
                    '1年', 51176.0, '申请者应该已完成或处于完成合格学位课程的最后一年
没有学位但在新加坡或海外有具备同等专业实践并希望提高他们的专业和领导能力的的申请者欢迎申请
根据具体情况可能会有试镜和面试要求',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '音乐环境中的领导力 Leadership in Musical Contexts; 音乐研究实践 Research Practices in Music; 音乐领导力研究生毕业项目 Graduate Capstone Project in Music Leadership; 管弦乐指挥领导能力 Leadership in Orchestral Conducting; 音乐专业实践 Professional Practices in Music; 教育学研究生实习 Graduate Practicum in Pedagogy; 合作作品集 Collaborative Portfolio',
                    '社科, 艺术, 杨秀桃音乐学院', '新加坡国立大学音乐领导力硕士项目旨在支持希望在新加坡和世界快速发展的音乐环境中提升技能并成为变革领导者的音乐家，课程强调创业与创新，使毕业生能够跟上科技快速发展、音乐专业数字化以及社会对跨学科能力和协作的需求所带来的变化。灵活性也融入到课程中，以帮助发展每个学生独特的艺术轨迹。因此，毕业生将变得更加多才多艺，这将使他们能够更快、更有效地适应当前和未来的职业道路。', '杨秀桃音乐学院',
                    '艺术', '1/8月', '无',
                    '无', 'https://www.ystmusic.nus.edu.sg/musicleaders/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MSocSc China and Global Governance', '中国与全球治理社会科学硕士', 
                    '1年', 43000.0, '具有认可大学或院校颁发的良好学士学位，或具备学术委员会可能批准的其他资格',
                    NOW(), NOW(), '无', '从历史和社会视角看待近代中国的构成 The Making of Modern China: Historical and Social Perspectives; 中国经济转型 China’s Economy in Transformation; 领导者，政党，国家：当代中国政治 Leaders, Party and State: Contemporary Chinese Politics; 转型经济体之中国 Transition Economies: The Chinese Case; 中国在全球经济中的作用 China''s Role in Global Economy; 中国经济政策 Economic Policy in China; 中国和东南亚 China and Southeast Asia',
                    '社科, 国际关系, 南洋公共管理学院', '南洋理工大学中国与全球治理社会科学硕士项目学制一年，专为处于职业生涯中期的专业人士设置，以期为学生提供一个对当今中国深入而整体的理解。南洋理工大学中国与全球治理社会科学硕士项目就中国正在前进中的社会、经济和政治发展，及其对本国和世界的影响，做深入的洞悉研究。南洋理工大学中国与全球治理社会科学硕士学位项目聚焦对中国改革转型的原因和影响的解读，及该转型对全球治理产生的影响。在区域和世界范围内，中国生机勃发的政治和经济力量都发挥着重大影响。作为世界第二大经济体和全球政治的主要参与者，中国对全球当下和未来的发展进程所发挥的作用正越来越重要。因此对学生而言，从全球视角来理解中国就十分必要。', '南洋公共管理学院',
                    '国际关系', '1/8月', '无',
                    '这个硕士项目专注于“中国与东南亚”的研究，是东南亚地区唯一一个深入研究中国发展与国际影响力的全英语授课型硕士项目。它旨在从全球视角全面了解中国，每年有两次开学季，分别在1月和7月。这个项目的学生来自世界各地，其中中国学生占32%，新加坡学生占57%，其余的11%来自世界其他地区。部分研究生有机会参加为期一学期的交流项目，前往早稻田大学学习，或参加东亚大学亚洲区域一体化研究所（EAUI）项目的短期暑期学校。



就业服务：通常情况下，“社会学”等领域可以获得留服认证。具体认证情况需参考学生的选课情况和所学内容的匹配度。

招生特点：对于背景一般的同学，建议申请春季入学。秋季申请较为看重本科院校背景，双非的同学需谨慎申请。该项目的招生规模相对较小，每年大约招收30名中国学生。虽然申请难度不是特别高，但由于秋季轮次开放申请较晚，因此出结果时间也相对较晚。许多学生在4-5月收到香港三大offer并交好高额留位费后，可能会放弃NTU的offer。此外，秋季入学的录取学生主要来自985院校，平均成绩为85+（也有一些成绩为80+的学生，这可能与NTU与西安交大公管学院和人文学院有合作有关）。春季入学的录取学生中，211院校背景的学生有机会被录取，平均成绩为85+。

班级概况：22fall班级整体人数在40人左右，其中90%-95%都是中国学生，只有4位外国同学。同学背景方面，基本都是985学生，有来自清华大学、上海交通大学等学校的学生，本科商科专业较多。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-social-sciences-(china-and-global-governance)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Juris Doctor', '法学博士', 
                    '3年', 29900.0, '申请3年制：具有非法律学科的大学学位，至少获得优等或二等一荣誉学位或同等学历
申请2年制：大陆法系国家或非宪报刊登的普通法大学的法律专业毕业生，至少获得优等或二等一荣誉学位或同等学历',
                    NOW(), NOW(), '雅思: 7.5; 托福: 100', '刑法 Criminal Law; 法学理论概论 Introduction to Legal Theory; 合同法 Law of Contract; 侵权行为法 Law of Torts; 法律分析、研究与传播 Legal Analysis, Research & Communication; 特定背景中的新加坡法律 Singapore Law in Context; 公司法 Company Law',
                    '社科, 法律, 法学院', '新加坡国立大学法学博士学位是一种法律研究生学位，可以让学生获得在新加坡从事法律执业的资格。在新加坡国立大学，学生可以从以下两项法学博士课程中选择一项：（i）为持有其他司法管辖区基本法学位的申请人而设的为期两年的单一研究生学位课程；或（ii）为持有非法律学位的申请人而设的三年制单一研究生学位课程。3年制的法学博士课程将取代LLB（Graduate LLB）课程，在特殊情况下，它可以在2.5年内完成。', '法学院',
                    '法律', '8月', '笔试/真人单面',
                    '法学博士 （JD） 学位是一个研究生法律学位，在新加坡国立大学，JD计划包括为持有其他司法管辖区基本法学位的候选人提供为期两年的单一研究生学位课程，和为持有非法律学位的候选人提供为期3年的单一研究生学位课程。在特殊情况下，3年制的JD项目可以在2.5年内完成。就业服务：该课程将使就读者获得在新加坡执业资格的可能性，以及培养学生成为一名律师必不可少的职业技能。招生特点：对于3年制JD课程：任何非法律学科的大学学位，至少以优异成绩或二等荣誉学位或同等学历。对于两年制法学博士课程，来自大陆法系国家或非宪报公布的普通法大学的法律毕业生，至少以优异成绩或二等高级荣誉学位或同等学历。在入学当年2月初（8月入学）之前完成第一学位的人也可以申请。语言要求托福iBT100，雅思总分7.5。', 'https://law1a.nus.edu.sg/admissions/jd.html'
                );
-- 插入programs表数据 (批次 7/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Mathematics)', '教育学硕士（数学）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有取相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭以及至少1年教学经验，或至少3年教学经验或其他相关教育工作经验
具有数学教育的实际经验以及至少2门本科水平数学课程的学习背景',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 数学教育研究的理论视角与问题 Theoretical Perspectives and Issues in Mathematics Education Research; 在数学教育中使用技术 Using Technology in Mathematics Education; 数学评估 Assessment in Mathematics; 数学课程研究 Curriculum Studies in Mathematics; 代数与代数教学 Algebra and the Teaching of Algebra; 几何与几何教学 Geometry and the Teaching of Geometry',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（数学）项目旨在提供发展数学知识作为一门学科及其教学法的课程，培养数学教育的反思性实践者，为教师的职业发展做好准备，使其成为教育部的硕士教师或高级专家，并为数学教育研究提供引导。', '教育学院',
                    '教育', '1/8月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(mathematics)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Humanities Education', '人文教育文学硕士', 
                    '1年', 44145.0, '具有文学学士学位（荣誉）或同等学历，需要相关学科背景；或
具有文学学士学位或同等学历，需要相关学科背景，并且具备至少2年专业工作经验。
应届毕业生无法申请秋季入学',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '人文教育批判思考与写作 Critical Thinking and Writing in the Humanities; 人文教育问题研究 Issues and Research in Humanities Education; 地理学与地理教育 Geography  and Geography Education; 历史学与历史教育 History  and History Education; 社会研究教育 Social Studies Education; 论文 Dissertation; 多元文化研究 Multicultural Studies',
                    '社科, 教育, 教育学院', '新加坡南洋理工大学国立教育学院人文教育文学硕士项目是为有兴趣通过跨学科人文教育探索提升专业知识的人文教育工作者和教育领导者设计的。该项目提供了多样的课程，这些课程内容侧重于人文学科，以及人文教育的课程和教学法。南洋理工大学国立教育学院人文教育文学硕士项目的一个主要特点是对全球化、可持续性、公民身份和遗产等主题的广泛关注。这为学生提供了理解、分析和评估当今重要社会问题的知识和技能，并提供了对人文研究和教育的洞察力。人文教育文学硕士适合希望加强学术资格以获得领导职位或职业发展的教育专业人士。', '教育学院',
                    '教育', '1/8月', '真人单面',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-in-humanities-education'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Technology in Enterprise Business Analytics', '企业商业分析科技硕士', 
                    '1年', 54566.0, '具有学士学位（偏好数学、统计学、计量经济学、管理科学、运筹学、科学或工程背景），平均成绩不低于B；
熟练掌握英语（书面和口语）；
海外申请者需要提交GRE（建议GRE总分不低于320，写作不低于3.5，具有与预期研究领域相关的重要工作经验的申请者即使未达到GRE建议分数要求也可能被考虑录取，但学校项目、实习和补充课程不算作工作经验）；
偏好具有2年相关工作经验的申请者（信息技术、工程和科学专业人士是合适的候选者；具有数学、统计学、计量经济学、管理科学、运筹学或类似专业的高度相关学士学位，且学习成绩一直良好的候选者可能获得工作经验豁免）；
学费为54,565.40-59,405新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '数据分析学与最佳实践 Data Analytics Process and Best Practices; 数据叙事 Data Story Telling; 数据管理与保护 Data Governance & Protection; 商业分析项目管理 Managing Business Analytics Projects; 活动分析学 Campaign Analytics; 统计训练营 Statistics Boot Camp; 预测分析——趋势与不寻常现象解读 Predictive Analytics–insights of Trends and Irregularities',
                    '商科, 商业分析, 系统科学研究所', '新加坡国立大学企业商业分析方向科技硕士项目用于满足行业对数据科学家的需求，他们可以通过数据洞察力帮助组织实现更好的业务成果。它最适合寻求专注于以下领域的专业人士：有条理的数据探索和可视化、诊断分析、使用统计和机器学习技术的预测建模、文本分析、推荐系统和大数据工程等。新加坡国立大学企业商业分析方向科技硕士项目让学生为企业业务分析中的专家、专家和领导角色做好准备，通过战略性地使用数据、分析、模型和一线工具来创造商业价值。通过促进更有效地利用和管理数据分析，可以帮助企业专注于重大决策，从而获得更好的预测能力，从而转化为更高的利润。帮助企业建立更好、更有效的模型将带来更好的结果，例如更具吸引力的定价、更高水平的客户服务、更好的市场细分、高效的库存管理和利润最大化。', '系统科学研究所',
                    '商业分析', '8月', '笔试/机面（kira）/真人单面',
                    '该项目设置在新加坡国立大学系统科学研究所，为满足行业对数据科学家的需求而设计。它最适合致力于以下领域的专业人士：系统化的数据探索和可视化、诊断分析、使用统计和机器学习技术的预测建模、文本分析、推荐系统和大数据工程等。



就业服务：学生有为期三个月的实习项目，如果实习期间内表现很好，是很有可能在实习期结束后直接拿到工作offer的。该项目学生实习过的公司有埃森哲、IBM、华侨银行等。毕业生入职的公司主要有埃森哲、星展银行、华侨银行、IBM等。NUS-ISS职业服务办公室帮助学生根据他们的技能和经验匹配工作，并且每两年举办一次招聘会。

招生特点：2020/21学年录取了207人。该项目设有笔面试，笔试通过之后才会收到面试，笔试主要考察数学知识和专业知识，面试会问general问题以及专业/技术领域问题。偏好有工作经验的申请者，录取难度比NUS BA简单。 

班级概况：22fall班级整体人数在70人左右，其中90%左右是中国学生。同学背景方面，有陆本也有海本，陆本基本都是985和211的学生，例如中山大学、北京航空航天大学、南开大学、南京农业大学等学校。专业背景方面，计算机专业比较多，还有工商管理、数学、软件工程、数据分析等专业，商科专业较少。', 'https://www.iss.nus.edu.sg/graduate-programmes/programme/detail/master-of-technology-in-enterprise-business-analytics'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA Arts and Cultural Entrepreneurship', '文化艺术创新创业管理文学硕士', 
                    '1年', 44908.0, '具有新加坡国立大学荣誉学位（优异/二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平）；或
具有相关领域（包括社会科学、自然科学、商业和经济、人文、法律或计算机方面的基础培训）的学士学位（平均成绩至少达到B或同等水平），并且具备至少2年相关工作经验；或
具有其他学士学位资格和经验且经研究生院认可。
需要提供存款证明60,000新币',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '文化政策 Cultural Policy 核心课程; 艺术与文化创业方法 Approaches to Arts & Cultural Entrepreneurship 核心课程; 东南亚文化资源管理 Cultural Resource Management in SE Asia 选修课程; 遗产：人民与制度 Heritage: Peoples and Institutions 选修课程; 互动媒体营销实践 Interactive Media Marketing Practices 选修课程; 文化产业与法律 Culture Industries and the Law 选修课程; 艺术商业 Arts Business 选修课程',
                    '商科, 创业与创新, 人文社科学院', '新加坡国立大学文化艺术创新创业管理文学硕士计划专注于创意和创意创业，旨在满足创意专业人士的需求，并满足新加坡和亚洲快速发展的文化创意产业部门的强烈需求。该硕士计划将涵盖文化政策、遗产与资源管理，艺术与文化创业，数字营销，文化外交，文化分析与信息学，博物馆、展览与策展等内容，并灵活探索前沿课题。新加坡国立大学文化艺术创新创业管理文学硕士计划还研究了创造力作为文化、经济和社会进步力量的用途。学生将向行业从业者和专业教育者学习创业创造力，以及它如何塑造新企业并引领创业成长。', '人文社科学院',
                    '创业与创新', '1/8月', '无',
                    '本项目围绕创意创业、文化政策设计与实施、艺术与文化项目的文化评估等关键词展开，深入探索创意经济、文化产业和艺术机构中的生态系统。项目致力于培养学生在艺术与文化资源管理、地区和国际文化遗产应用、文化外交和软实力等领域的能力。同时，课程还将涉及文化复杂性和智能、艺术与文化的数字营销、数据分析、法律与治理、经济与商业、策展实践、活动管理等多个方面，为学生提供全面的知识和技能。', 'https://fass.nus.edu.sg/cnm/ace-master/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'LLM', '法学硕士', 
                    '1年', 38150.0, '司法研究方向：
- 具有良好的法律第一学位（LLB或JD或同等学历）
- 具备法律或司法职位大量相关经验
其他方向：
- 具有良好的法律第一学位（LLB或JD或同等学历）
- 非法律专业毕业生如果具备法律相关职位大量相关专业经验，其申请也可能被考虑',
                    NOW(), NOW(), '雅思: 6.5; 托福: 90', '兼并与收购法 Law of Mergers and Acquisitions; 国际商法：亚洲视角 International Business Law: An Asian Perspective; 新加坡及香港信托和财富管理 Trusts and Wealth Management in Singapore and Hong Kong; 新加坡、香港及大中华地区的金融监管 Financial Regulation in Singapore, Hong Kong and Greater China; 亚洲外资法 Foreign Investment Law in Asia; 法律之外：亚洲跨境问题的监管机制 Beyond the Law: Regulatory Mechanisms in Cross-border Issues in the Asian Context; 中国合同法 Chinese Contract Law',
                    '社科, 法律, 法学院', '新加坡管理大学法学硕士课程经过精心设计，旨在扩展学生在经典和新颖法律领域的法律知识，同时为学生提供必要的技能，为跨境交易提供即时建议，或提供高质量的裁决和司法行政结果。学校的教授从不同的工作经验中获得了前沿知识，他们将向学生介绍他们的跨学科知识。小班制允许举办高度互动的研讨会，同时也提供一个富有挑战性的大学学习环境。法学院与法律界的积极合作，以及强大的校友网络和职业服务团队，极大地为学生未来的职业生涯带来了益处。', '法学院',
                    '法律', '8月', '无',
                    '无', 'https://masters.smu.edu.sg/programme/master-of-laws'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Communication', '传播学硕士', 
                    '1年', 39295.0, '具有学士学位（成绩最好达到荣誉：优异/二等或以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要相关学科背景
除上述学历外在研究生院认可的情况下可能根据具体情况考虑具有其他学历的申请者
持有非荣誉学士学位的本科学历者，需要具备2年相关行业经验
需要提供存款证明50,000新币',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '战略与全球传播 Strategic and Global Communication; 数字传播与分析 Digital Communications and Analytics; 沟通与领导力 Communications and Leadership; 实习 Internship; 导师指导 Mentorship; 计算机媒介环境 Computer-Mediated Environments; 互动媒体艺术 Interactive Media Arts',
                    '社科, 媒体与传播, 人文社科学院', '新加坡国立大学传播学社会科学硕士由新加坡国立大学艺术与社会科学学院传播与新媒体系提供。作为东南亚地区唯一一个聚焦新媒体领域提供媒体研究、互动媒体设计、文化研究和传播管理课程的大学院系，本系采用综合性多学科方法适应当今融合的媒体环境，提供尖端的专业知识，让学生在传播中牢牢把握数据的本质，成为数字领域的领导者。通过综合指导计划向媒体行业的领军人物学习，站在巨人的肩膀上。利用亚洲第一个传播学社会科学研究生学位课程的优势，通过聚焦新媒体和传播领导力、数字营销和数据分析，专注于数字传播和领导力。通过研究和应对当前和新兴趋势的课程，例如新加坡政府的SkillsFuture媒体技能框架所确定的趋势，获得对行业成功至关重要的工作技能。', '人文社科学院',
                    '媒体与传播', '1/8月', '真人群面',
                    'Master of Social Sciences in Communication是亚洲第一个将数字传媒和领导能力相结合的跨学科传播学课程。以新媒体和传媒领导力、数字营销和市场分析为重点，这个专业设在NUS的 continuing and lifelong education 学院下，类似于哥伦比亚大学和纽约大学的SPS学院，就业导向性很强，校友资源丰富。注重领导力层面，学习传媒方向理论知识和管理能力，也结合了大数据分析这种广泛应用的技能，比较适合有一定专业背景或者2年以上工作经验补足，未来想从事媒体行业管理层的学生。



就业服务：专业名称中包换communication所以很适合想要回国考公考编的学生，就业领域涉及广泛，包括广告营销，企业咨询和公共事务，公共关系等。熟练数据分析等技能，可以选择数据分析，数字营销，整合营销传播，用户体验分析等岗位。传统的新闻业、非营利组织和国际组织等也会有学生选择。

招生特点：非常看重院校背景，倾向于海本，中外合办和top985学校，陆本GPA86+，海本二等，跨申需要至少两年的工作经历，应届生至少三段以上大厂实习。针对自己的track来设计文书的内容，强调自己的核心竞争力，匹配注重diversity的NUS。', 'https://scale.nus.edu.sg/programmes/graduate/msocsci-(communication)/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Translation and Interpretation', '笔译与口译文学硕士', 
                    '1年', 38913.0, '具有认可机构颁发的学士学位，并具备中英文语言能力证明
或具备学校接受的其他资格及相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 90', '翻译理论 Translation Theories; 专业翻译I （文学） Specialised Translation I (Literature); 口译导论 Introduction to Interpretation; 毕业论文 Dissertation; 专业翻译II (法律、金融、经济) Specialised Translation II (Law, Finance, and Economics); 专业翻译III (国际组织与政府机构翻译) Specialised Translation III (Translation for International Organisations and Government Institutions); 中英口译 Chinese-to-English Interpretation',
                    '社科, 语言, 人文学院', '南洋理工大学笔译与口译文学硕士学位项目旨在为学生提供高标准的中英翻译专业培训，使他们具备相关领域的前沿理论知识，并帮助他们对知识和理论有透彻的理解。在不同的社会和文化背景下进行实践。南洋理工大学笔译与口译文学硕士学位计划的目标是，让毕业生将做好充分准备，使他们在公共和私营部门提供高度专业的服务以及在提高新加坡和亚太地区翻译相关专业的整体能力方面发挥领导作用。MTI课程以世界上最好的翻译课程为基准，其结构以强大的学术重点为基础，充分利用了新加坡在双语教学和研究方面公认的专业知识。它寻求建立并进一步加强南洋理工大学现有的翻译、双语和双文化研究能力和教学专长。同时，努力将计算语言学、机器翻译、语料库语言学等领域的最新前沿技术融入其中。 在教学法上，MTI计划以跨学科课程为特色，提供以翻译为重点、与行业相关且具有学术刺激的专业培训，这些培训以卓越的教学和研究为基础。其专业课程将笔译和口译技能的培训与大学知名的专业领域知识相结合。这些包括翻译研究、语言学、文学、公共政策、大众传播、商业、医学和计算机工程。该课程还将包括在北京外国语大学（BFSU）进行的为期6周的沉浸式课程，该大学是口译和笔译教学以及外语研究的先进机构。', '人文学院',
                    '语言', '1/8月', '笔试/真人单面',
                    '无', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-arts-in-translation-and-interpretation'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Public Administration (English)', '公共管理硕士（英文授课）', 
                    '1年', 43000.0, '具有认可大学或院校颁发的良好学士学位具备至少2年全职工作经验',
                    NOW(), NOW(), '无', '应用公共部门经济学 Applied Public Sector Economics; 公共政策:理论与实践 Public Policy: Theory and Practice; 公共管理与社会 Public Administration and Society; 公共战略管理 Public Strategic Management; 公共部门领导力 Leadership in Public Sector; 宏观经济环境与政策 Macroeconomic Environment and Policy; 公共政策与管理研讨会 Seminar in Public Policy and Management',
                    '社科, 公共政策与事务, 南洋公共管理学院', '南洋理工大学公共管理硕士（英文授课）项目旨在审查亚洲公共管理的最佳实践，以提高决策、治理、政策设计和实施方面的技能。南洋公共管理研究生院将理论与实践相结合，提供沉浸式学习体验。担任教职员工的包括前政治家和高级政府官员，学生将掌握制定和实施战略政策的知识以应对本国的挑战，从而提高他们作为公共行政人员的效率。', '南洋公共管理学院',
                    '公共政策与事务', '1/8月', '无',
                    '新加坡南洋理工大学公共管理研究生课程培养的是应用型高级政府管理人才。因此十分重视在传授最新公共管理理论的同时，紧密结合中国政府管理的改革与实践。教员绝大多数是资深教师并拥有欧美名牌大学的博士学位，学贯中西，精通华语，不仅对中国及东亚的政治经济发展深有研究，也十分熟悉中国公共管理的运作方式。 就业服务：新加坡大学公共管理专业毕业后可在各类工商企业、高新园区、政府部门和事业单位从事管理工作，也可在有关科研机构和院校从事教学和科研工作。新加坡大学公共管理专业就业岗位有总经理助理、销售经理、行政主管、副总经理、客服经理、总经理、办公室主任、文员、项目经理、总经理秘书、董事长助理、总裁助理总经理助理等。招生特点：录取对象为中国政府官员、高校、以及其他相关行业的中高级管理人员或企业主管。须拥有至少2年的全职管理工作经验，并具有未来在管理层晋升的潜力。', 'https://www.ntu.edu.sg/education/graduate-programme/master-of-public-administration-(english)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master of Public Health', '公共卫生硕士', 
                    '1年', 95200.0, '针对有医学背景的申请者：
- 具有医学学士学生或同等学历
- 具备1年常规临床经验，不包括新加坡培训医生的实习期
- 具备1年公共卫生/卫生管理/职业与环境卫生工作经验或已进入临床专科培训；或参加过国立卫生研究院预防医学住院医师培训课程
针对非医学背景的申请者：
- 具有良好的荣誉学位或同等学历
- 具备2年公共卫生/健康促进/卫生管理/职业与环境卫生/临床研究工作经验
需要提供存款证明（能够涵盖学费和生活费）',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '流行病学原理 Principles of Epidemiology; 定量流行病学方法 Quantitative Epidemiologic Methods; 卫生政策和制度 Health Policy and Systems; 环境及职业健康 Environmental and Occupational Health; 健康和疾病状态下的生活方式和行为 Lifestyle and Behaviour in Health and Disease; 专业实习 Practicum; 传染病的控制 Control of Communicable Diseases',
                    '社科, 公共卫生, 公共卫生学院', '新加坡国立大学公共卫生硕士学位课程为学生提供严谨的跨学科研究方法，使之能够从容应对亚洲当前和未来可能会出现的公共健康问题，提出科学合理的创新性解决方案。基于新加坡国立大学先进的教学体系以及与新加坡国立大学医院、李光耀公共政策学院、商学院、文学院、社会科学与工程学院的密切合作关系，新加坡国立大学公共卫生硕士学位课程能够始终确保向学生提供先进的科研设施以及综合的课程教学模式。新加坡国立大学公共卫生硕士学位课程的学生将有机会接触公共健康领域内的传统议题及新兴研究焦点，通过专业的学习和培训，提高自身在区域性或国际环境下的领导力和行政管理能力。', '公共卫生学院',
                    '公共卫生', '8月', '笔试',
                    '无', 'https://sph.nus.edu.sg/education/mph/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (Asian Legal Studies)', '亚洲法律研究法学硕士', 
                    '1年', 41300.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '亚洲的法律系统 Legal Systems of Asia; 中国企业和证券法 Chinese Corporate and Securities Law; 中国法律传统与法律中文 Chinese Legal Tradition & Legal Chinese; 中国、印度和国际法律 China, India and International Law; 印度商业法 Indian Business Law; 亚洲及国际销售比较法 International & Comparative Law of Sale in Asia; 国际法和亚洲 International Law and Asia',
                    '社科, 法律, 法学院', '新加坡国立大学亚洲法律研究法学硕士项目（亚洲法律研究方向）是一项于2007-2008学年推出的法学专业方向课程。2003年，新加坡国立大学法学院成立了亚洲法律研究学会，依托该研究学会的发展势头，这项一年制的授课型亚洲法律研究法学硕士项目大大丰富了新加坡国立大学法学院研究生项目的多样性。 在这个创新性项目中，学生能够深入地学习南亚、东南亚、东亚等区域的法律、法律系统、法律传统等知识，同时有机会在亚洲这个大背景下选择具体的法律领域课程，例如商法、宪法、国际法等。通过亚洲法律研究法学硕士项目的学习，学生不仅能够在社会文化背景下解读相关法律，更能够分析和理解亚洲法律与区域商业、贸易和政策的关系。除了新加坡国立大学法学院一流的教授，还经常会邀请一些访问学者给学生授课。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '无', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
-- 插入programs表数据 (批次 8/16)
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'MA Instructional Design and Technology', '教学设计与技术文学硕士', 
                    '1年', 44145.0, '具有良好的学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
有企业培训、教育软件开发或学校教师工作经验者优先考虑',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教学设计模型和实践 Instructional Design Models and Practices; 评价模型及方法 Evaluation Model and Methods; 学习和教学基础 Foundations of Learning and Instruction; 设计、执行和汇报调研 Designing, Conducting, and Reporting Investigations; 教学设计数据收集和分析方法 Methods for Data Collection and Analysis for Instructional Design Projects; 教学设计研究项目 Capstone Project for Instructional Design; 培养策略及方法 Training Methods and Strategies',
                    '社科, 教育, 教育学院', '南洋理工大学教学设计与技术文学硕士项目旨在为工作内容涉及到教学设计过程的专业人士提供教学设计与技术的专业教育和培训，同时为致力于将信息技术运用到学校和企业环境中的人士提供更广泛的专业知识基础和实践技能。该项目适合在中小学、大学、高职院校及在线学习平台等行业中从事教育和培训工作的人士。课程设置涉及教育教学领域的信息技术应用、开发和管理，例如在线学习，以解决学校或企业环境中的教学困扰。', '教育学院',
                    '教育', '1月', '真人单面',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-arts-(instructional-design-and-technology)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Business Analytics', '商业分析理学硕士', 
                    '1年', 70850.0, '具有良好的学士学位，偏好商业、计算、经济学、工程学、数学、科学或统计学背景，并获得良好的荣誉学位等级；或具备至少2年相关工作经验
（强烈建议）GRE/GMAT定量成绩优秀
需要扎实的数学基础
需要提供能够覆盖学费与生活费金额的存款证明（FAQ：107,350新币）',
                    NOW(), NOW(), '无', '统计学 Statistics; 定数性运筹学 Deterministic Operations Research; 管理经济学分析 Analytics in Managerial Economics; 决策技术 Decision Making Technologies; 数据管理和仓储 Data Management and Warehousing; 大数据分析技术 Big-Data Analytics Technology; 社会和数字媒体分析 Social and Digital Media Analytics',
                    '商科, 商业分析, 商学院', '新加坡国立大学商业分析理学硕士课程旨在培养具有业务分析技能的专业人士，以满足希望通过数据分析改善运营情况的公司日益增长的需求，旨在通过平衡知识的学术严谨和实际应用促进体验式学习。参加新加坡国立大学商业分析科学硕士课程的学生将具备机器学习等技能，在金融、零售、信息技术、供应链和医疗保健等不同行业的数据分析领域脱颖而出。位于新加坡的商业分析理学硕士学位课程与各行各业的商业数据分析领域的行业合作伙伴有着密切的联系。攻读或毕业于新加坡国立大学商业分析理学硕士课程的学生可以与该社区的领导者互动并向他们学习，以提高他们在商业分析领域的职业前景和能力。完成该课程后，毕业生将能够使用相关的数据驱动技术和工具来理解和解决复杂的业务分析问题，这是一项本地和国际不同行业中备受追捧的技能。', '商学院',
                    '商业分析', '8月', '真人单面',
                    '新加坡国立大学商业分析项目排名亚洲第一，由成立于2013年的新加坡国立大学商业分析中心开设。完成项目学习后，学生能够使用相关数据科学技术和工具来解决金融、零售、信息技术、供应链、医疗保健等各行业的复杂业务分析问题。



就业服务：项目与100+行业合作伙伴紧密合作，例如金融、保险、信息技术、医疗卫生、电商、供应链、物流、制造、政府等领域合作伙伴，运用大数据、分析、AI技术开展行业转型。新加坡国立大学商业分析中心则给学生提供了一个绝佳的平台，学生可以与该项目行业合作伙伴互动、与专业人士分析建立联系、与潜在雇主会面。

招生特点：该项目full time学生比例约占四分之三，60%有工作经验。在院校背景方面偏好海本和Top 985的学生，专业偏好有计算机、数学等背景的。该专业设有面试，面试会涉及到数据课程、编程语言等，可见对其能力的看重。', 'https://msba.nus.edu.sg/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Education (Music)', '教育学硕士（音乐）', 
                    '1年', 41900.0, '具有认可大学颁发的良好学士学位，或具有相关的南洋理工大学FlexiMasters且成绩优秀
具有教师资格如新加坡国立教育学院颁发的教育研究生文凭，或具备至少1年教育相关工作经验',
                    NOW(), NOW(), '雅思: 6.5; 托福: 92', '教育调查 Educational Inquiry; 音乐教育中的问题 Issues in Music Education; 音乐教育中的哲学 Philosophy in Music Education; 音乐教育中的流行文化与信息传播技术 Popular Culture and ICT in Music Education; 音乐行为研究 Studies in Musical Behaviours',
                    '社科, 教育, 教育学院', '教育学硕士课程主要面向在新加坡学校和教育部工作的教育工作者，学校也欢迎具有教育背景并希望提升教育知识和技能的大学毕业生申请。南洋理工大学教育学硕士（音乐）项目为学校音乐课程和教学法的发展以及音乐教育研究提供了理论和实践基础，也提供了对音乐教育和研究的当代问题的理解，以及音乐教育的基础，学生将发展对科技在音乐和音乐教育中的应用的理解和技能，从学校教学的实用音乐技能列表中选择，包括独奏和合奏表演、作曲、编曲、唱歌、合唱指挥、乐队指挥、竖笛演奏和键盘技巧，以提高其在课程中教授这些技能的专业知识。', '教育学院',
                    '教育', '1月', '无',
                    '无', 'https://www.ntu.edu.sg/nie/programmes/graduate-education/graduate-programmes/detail/master-of-education-(music)'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'e492f9fb-dff5-4eb8-bbb4-716bbb438f30', 'Master of IT in Business', '商业信息技术硕士', 
                    '1年', 54500.0, '- 鼓励任意学位的申请者申请
- 偏好具备2年商业或技术角色工作经验的申请者
- 具有良好的GMAT/GRE/SMU入学考试（总分56+）成绩',
                    NOW(), NOW(), '雅思: 6.5; 托福: 90', '商业分析框架与商务环境 Analytics Framework & Business Context; 数据分析实验室 Data Analytics Lab; 客户分析与应用 Customer Analytics & Applications; 运营分析与应用 Operations Analytics & Applications; 云计算和大数据分析 Cloud and Big Data Analytics; 视觉分析与应用 Visual Analytics & Applications; 文本分析与应用 Text Analytics & Applications',
                    '商科, 信息系统, 信息系统学院', '现在正处在一个颠覆性的时代，在这个时代，技术在某些领域创造了公平的竞争环境，在另一些领域创造了不公平的优势。这就对企业领导者提出了越来越高的要求，要求他们掌握相关的专业知识。新加坡管理大学商业信息技术硕士课程借鉴了数据分析、技术平台和商业战略领域的思想领导力，并深入研究了四个专业方向：金融技术与分析、分析、人工智能和数字转型。每一个专业方向都会教授学生所需的独特资源。', '信息系统学院',
                    '信息系统', '1/8月', '真人单面',
                    '本专业旨在培养学生具备商业分析领域的思想领导力，通过借鉴数据分析、技术平台和商业战略等领域的知识，深入探究金融技术与分析、分析、人工智能和数字转型四个专业方向。每个专业方向都为学生提供了一系列独特的资源，以帮助他们掌握所需的技能和知识。



就业服务：本专业的就业方向主要包括互联网（大数据、人工智能）、金融、咨询、市场营销（市场分析）等四个领域。这些行业是目前薪资较高且代表未来发展方向的行业。毕业生可以从事商业方法分析师、管理分析师、组织分析师、商业管理顾问、运营管理高级顾问、ISO顾问、系统管理分析师等相关职位的工作。

招生特点：截至目前，2024年的申请情况尚未公布。但从过去两年（2023年及之前）的学生情况来看，该项目的招生偏向于选择具有计算机能力的学生，包括掌握JAVA、SPSS、SAS、STATA、MATLAB｜Python等软件和编程工具的能力。此外，拥有数据分析、商业分析、营销分析等数据导向的实习经历也会对申请者产生积极的影响。

班级概况：22fall班级整体人数在50人左右，其中绝大多数是本地人，还有一些印度人和东南亚同学。同学背景方面，有北京工业大学和上海外国语大学的同学，还有很多海本学生，例如维克森林大学、多伦多大学、美国的文理学院或者新加坡本地的学校，很多同学有过工作经验。', 'https://masters.smu.edu.sg/programme/master-of-it-in-business'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'Master in International Affairs', '国际事务硕士', 
                    '2年', 49576.0, '申请者应该热衷于了解亚洲和世界各地正在发生的变革，并且积极主动、外向且乐于接受新想法
 申请者应持有良好的学士学位（荣誉 - 二等及以上）或同等学历
优先考虑具备至少2年工作经验的申请者，英语书面和口语熟练程度至关重要
需要提交1篇writing sample，最好是国际事务相关主题（不超过2000字）
可选择性提供GRE/GMAT',
                    NOW(), NOW(), '雅思: 7; 托福: 100', '国际关系:理论与实践 International Relations: Theory and Practice; 国际安全：概念，议题与政治 International Security - Concepts, Issues and Policies; 国际政治经济 International Political Economy; 国际事务研究方法 Research Methods in International Affairs; 国际经济发展 International Economic Development; 变化中的全球治理 Global Governance in a Changing World',
                    '社科, 公共政策与事务, 李光耀公共政策学院', '为期两年的全日制国际事务硕士项目为学生提供了理论框架和国际关系多学科领域的知识，以及沉浸式体验，旨在提高亚洲的治理水平，提升亚洲在国际事务中的影响力。', '李光耀公共政策学院',
                    '公共政策与事务', '8月', '无',
                    '无', 'https://lkyspp.nus.edu.sg/graduate-programmes/master-in-international-affairs-mia'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MSc Infectious Disease Emergencies', '传染病突发事件理学硕士', 
                    '1年', 54500.0, '具有学士学位，需要医学学士或健康科学相关学科背景，具备其他资格和相关行业经验的申请者可能会基于具体情况被考虑 本科医学学位的申请者需要具备：a) 1年一般临床经验，不包括新加坡受训医生的实习医生期，b) 1年公共卫生/卫生管理/职业与环境卫生工作经验或已进入临床专科培训 本科非医学学位的申请者需要具备2年公共卫生/健康促进/卫生管理/职业与环境卫生/临床研究/其他相关领域工作经验 需要提供存款证明，能够覆盖学费、杂费和生活费',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '领导与协调 Leadership and Coordination 核心课程; 监测与流行病学 Surveillance and Epidemiology 核心课程; 危机中的沟通和参与 Communications and Engagement in a Crisis 核心课程; 临床管理、感染预防与控制（IPC）以及设施基础建设 Clinical Management, Infection Prevention and Control (IPC), and Facility Infrastructure 选修课程; 疫情控制的干预措施 Interventions for Outbreak Control 选修课程; 大流行病研究 Research in a Pandemic 选修课程; 心理健康和对弱势群体的支持 Mental Health and Support for the Vulnerable 选修课程',
                    '社科, 公共卫生, 杨潞龄医学院', '新加坡国立大学传染病突发事件理学硕士课程旨在培养应对未来传染病紧急情况爆发的反应人员，在2019冠状病毒病大流行之后，全球需要改进系统，以建立应对未来传染病紧急情况的复原力，该课程是为国家、国家以下或机构各级的职业生涯早期至中期专业人员以及疫情应对各方面的专家设计的，提供全面的技能和知识，以在这一不断发展的领域发挥领导作用。', '杨潞龄医学院',
                    '公共卫生', '8月', '无',
                    '无', 'https://medicine.nus.edu.sg/cider/education/msc-infectious-disease-emergencies/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'MA English Language and Linguistics', '英语语言与语言学文学硕士', 
                    '1年', 41750.0, '具有新加坡国立大学荣誉学位（二等及以上）或同等学历（例如，4年制学士学位且平均成绩至少达到B或同等水平），需要该学科或相关领域背景；或
具有良好的学士学位（平均成绩至少达到B或同等水平），需要该学科或相关领域背景，并且成功通过入学考试；或
特殊情况下经研究生院批准会接受其他资格和经验。
需要提交writing sample（4000-6000字）
需要提供存款证明50,000新币',
                    NOW(), NOW(), '雅思: 6; 托福: 85', '高级心理语言学 Advanced Psycholinguistics; 话语分析 Approaches to Discourse; 语言变异与变化 Language Variation and Change; 知识文本建构 Textual Construction of Knowledge; 独立研究 Independent Study; 语言接触 Contact Languages; 社会语言学论证 Sociolinguistic Argumentation',
                    '社科, 语言, 人文社科学院', '新加坡国立大学英语语言和语言学文学硕士的主要研究方向更确切的说是多语背景下的英语语言研究。民族、语言和具体情境总是相互作用着，全球化趋势使得对这种相互作用的专门研究显得非常有必要。在新加坡，语言与社会、文化因素之间以复杂而又有趣的方式彼此相互作用着，学生和研究人员可以近距离观察这一互动产生的原因、效果和作用。学系的教授团队都是英语语言研究领域的专家，他们会给学生带来各种不同的研究视角来理解社会生活中的语言现象。我们的课程设置能明显反映出教授团队多样的研究方向和研究方法。新加坡国立大学英语语言和语言学文学硕士的毕业生将在语言研究领域获得专业知识的提升。', '人文社科学院',
                    '语言', '8月', '无',
                    '新加坡国立大学英语语言和语言学文学硕士的主要研究方向更确切的说是多语背景下的英语语言研究。一直以来，民族、语言和具体情境总是相互作用着，全球化趋势使得对这种相互作用的专门研究显得非常有必要。新加坡是语言研究的理想场所。在这里，语言与社会、文化因素之间以复杂而又有趣的方式彼此相互作用着，学生和研究人员可以近距离观察这一互动产生的原因、效果和作用。学系的教授团队都是英语语言研究领域的专家，他们会给学生带来各种不同的研究视角来理解社会生活中的语言现象。我们的课程设置就能明显反映出我们教授团队多样的研究方向和研究方法。新加坡国立大学英语语言和语言学文学硕士的毕业生们都将在语言研究领域获得专业知识的提升。就业服务：毕业生多从事于以英语为专业的领域。翻译类职业包括职业口笔译员，他们在国家部门事业单位或企业中从事文件、合同、文学等翻译工作，其中专攻特定领域如医药、法律、机械等更有发展空间。口译则分为随行口译、交替口译和同声传译，要求具备高度的专业能力和记忆力。教育培训类则涉及公私立学校、升学教育、出国留学和职场英语培训机构等。编辑记者类职位则可在出版社、报社、电视台、网站等找到。以英语为工具的岗位包括外贸类，工作多样化，但收入波动性较大；国际旅行社岗位则稳定且收入高，但需长期出差和户外工作；外企或与外商有合作的公司岗位如HR、行政、会计、涉外律师、采购等，需具备相关技能；各大商业银行则提供国有银行柜员、借贷等职位，外资银行则主要从事柜员、客服等工作。招生特点：申请人需要提交4000-6000字的writingsample。', 'https://fass.nus.edu.sg/elts/ma-by-coursework-el/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'b3a6c4d0-e034-4a6f-b522-e0b235ec9cf0', 'MSc Technology and Design (AI and Technology in Education)', '科技与设计（教育中的人工智能与科技）理学硕士', 
                    '1年', 54500.0, '至少拥有相关专业的学士学位 有兴趣的候选人若拥有非相关专业的本科学位，可能会根据具体情况进行考虑 具有流利的普通话书写和口语能力 相关工作经验将被考虑录取 项目面向以下人群开放： 东盟国家和中国大陆的教育工作者、课程设计师、教育管理者、教育科技专业人士、教育技术专家和企业培训师，拥有大学学位，对中学、高中、大学或继续教育阶段的教学有着强烈的热情；寻求发展创建和实施技术驱动的教学工具的专业知识的个人  没有相关学位的申请人可以提交一份作品集，突出他们的技能、能力和经验，以增强他们的申请',
                    NOW(), NOW(), '无', '领导教育和组织发展 Leadership in Education and Organisational Development; 教育研究方法与分析方法 Research Methods and Analytical Approaches in Education; 教育技术与战略管理 Educational Technology and Strategic Management; 设计与以人为本的教育 Design and Human-Centric Education; 技术辅助式教育 Technology-Enabled Education; 教育中的人工智能 Artificial Intelligence in Education; STEM教育中基于项目的学习教学设计 Instructional Design for Project-based Learning in STEM Education',
                    '社科, 教育, 硕士项目', '新加坡科技设计大学科技与设计（教育中的人工智能与科技）理学硕士是一门双语课程，为希望通过设计、技术和人工智能重新定义学习的个人提供变革之旅。这项独特的12个月课程将创新教学法与跨文化见解相结合，利用其在中国和新加坡的强大合作关系提供真正的全球体验。
这个令人兴奋的课程不仅面向教育工作者，还面向课程设计师、教育管理者、教育技术专业人士、教育技术专家和企业培训师。它将为学生提供专业知识，让他们能够利用人工智能和技术来创建以人为本的教育解决方案。学生将获得生成式人工智能、增强现实和快速原型设计等尖端工具的实践能力，同时掌握在不同环境中增强STEM教育的策略。
双语教学模式以普通话和英语授课，弥补了文化和语言上的差距，让学生在国际和跨文化环境中脱颖而出。通过在中国和新加坡的沉浸式体验，学生将培养创新、领导和推动教育领域有意义变革的技能，确保他们准备好在人工智能驱动的世界中塑造学习的未来。', '硕士项目',
                    '教育', '9月', '无',
                    '无', 'https://www.sutd.edu.sg/programme-listing/mtd-ai-and-technology-in-education/'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    'f977f2d3-fce0-4d57-9de8-07bdf5ecf7f3', 'LLM (Corporate & Financial Services Law)', '公司与金融服务法法学硕士', 
                    '1年', 37100.0, '具有良好的法学学士学位',
                    NOW(), NOW(), '无', '公司法的元素 Elements of Company Law; 可供选择的投资工具 Alternative Investment Vehicles; 企业破产法 Corporate Insolvency Law; 投资争议仲裁 Arbitration of Investment Disputes; 信用担保 Credit & Security; 犯罪与企业 Crime and Companies; 银行法 Banking Law',
                    '社科, 法律, 法学院', '新加坡国立大学法学硕士课程（公司与金融服务法法学硕士）包括银行法（国内外）、公司法与公司金融、金融服务与证券、税收等课程模块。该课程涵盖多个模块，能够帮助学生巩固其理论基础和专业实践技能。同时，新加坡作为亚洲的商业中心，是进行企业和金融服务法方向学习的最佳场所。', '法学院',
                    '法律', '8月', '机面（kira）',
                    '新加坡国立大学公司金融法硕士专业包括银行（国内和国际）选修，公司法和公司金融，金融服务和证券以及税收。新加坡国立大学公司金融法硕士专业使学生能够在所涉及的科目中获得理论基础和实践专业知识。新加坡作为亚洲的商业中心，是追求这些科目的理想场所。就业服务：毕业生职业发展如律师、法律顾问、商务律师、司法鉴定从业人员等。招生特点：该项目是NUS法学院最难申请的项目。偏爱985背景的学生，此外是五院四系的学生，均分至少在85以上，大部分学生的均分在87左右。双非如果是非五院四系的学生，希望不大，除非是像深圳大学这样的强双非。并且LLM是比较看重工作经历的，优先录取工作党，应届生偏少。', 'https://law1a.nus.edu.sg/admissions/coursework_deg.html'
                );
INSERT INTO public.programs (
                    school_id, en_name, cn_name, duration, tuition_fee, 
                    apply_requirements, created_at, updated_at, 
                    language_requirements, curriculum, tags, 
                    objectives, faculty, category, entry_month, interview, analysis, url
                ) VALUES (
                    '96207f7c-3877-49c8-a565-09dbe3f21d7d', 'Master of Public Administration (Executive MPA Programme)', '高级公共管理硕士（中文授课）', 
                    '1年', 38000.0, '具有一定的全职管理工作经验，并具有未来在管理层晋升的潜力
具备中国官方认可的学士学位
对于具有出色管理经验的申请人，可以根据个案具体情况放宽上述要求，需报教务处特批
其他要求由南洋理工大学斟酎而定',
                    NOW(), NOW(), '无', '公共部门应用经济学 Applied Public Sector Economics; 公共政策：理论与实践 Public Policy: Theory and Practice; 毕业论文 Capstone Paper; 公共部门的领导学 Leadership in Public Sector; 人力资源管理 Human Resource Management; 政策分析的研究与统计方法 Research and Statistical Methods in Policy Analysis; 公共政策：应用实践学习 Public Policy: Learning by Doing',
                    '社科, 公共政策与事务, 南洋公共管理学院', '自2005年开办的南洋理工大学高级公共管理硕士项目，旨在介绍具有东西方特色的当代公共管理理论，分享国际，特别是新加坡的公共管理经验与教训，提升学员的领导力。专家、学者和政策制定与实施者在传授最新公共管理理论的同时，使用课堂讨论、案例分析与实践模拟等理论结合实际的多种研修方式。课程期间，学员有机会走访并接触新加坡政府部门和企业机构，与政府官员和决策者分享公共管理改革经验，加强互动和联系。招生对象主要是来自中国的政府官员、高校及其它行业的行政管理人员或企业主管。
南洋理工大学高级公共管理硕士学位课程设计注重理论基础与实际案例相结合, 旨在提高学员的决策分析、解决问题的能力和培养创新战略思维。课程由了解中国国情、学贯中西的专家学者讲授。课程注重新加坡实地考察学习，将课室学习模式延伸至课堂以外。每名学员都需参与院办所安排的参访与讲座。其中包括走访并考察新加坡的政府部门和企业机构，与政府官员和企业管理人士交流公共和企业管理经验，加强互动和联系。南洋理工大学不同院系也时常会举办讲座和研讨会，学员可以积极参与，丰富知识面。', '南洋公共管理学院',
                    '公共政策与事务', '3月', '无',
                    '南洋理工大学高级公共管理硕士是一门综合性强的专业，涵盖了多个领域。该专业的课程设置非常丰富，学员可根据自身兴趣和职业需求选择不同的方向。就业服务：毕业生大部分会回到自己原来的工作岗位或在同行业里寻求更好的职业发展，也有部分毕业生会进入媒体、公关、政府关系、高等教育、出版、非盈利组织等行业。招生特点：申请者需要有非常丰富的管理经验，录取对象为中国政府官员、高校、以及其他相关行业的中高级管理人员或企业主管。', 'https://www.ntu.edu.sg/education/graduate-programme/ncpa-master-of-public-administration-in-chinese-(executive-mpa-programme)--1'
                );
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
