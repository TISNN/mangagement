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
