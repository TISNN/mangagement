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
