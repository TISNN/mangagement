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
