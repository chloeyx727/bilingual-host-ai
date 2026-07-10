"""批量扩充知识库条目"""
import json, os

BASE = os.path.join(os.path.dirname(__file__), 'backend', 'app', 'knowledge', 'seed_data')

# ========== natural_heritage 补充 ==========
nat_new = [
  {
    "id": "nat_016", "title_zh": "成都观鸟——城市生物多样性的窗口", "title_en": "Chengdu Birdwatching: A Window into Urban Biodiversity",
    "module": "natural_heritage", "type": "entity",
    "content": {
      "summary_zh": "成都市区及周边记录有超过500种鸟类，是中国内陆城市中观鸟条件最优越的城市之一。青龙湖湿地公园、白鹭湾湿地和龙泉山城市森林公园是三大核心观鸟区。每年冬季，数千只候鸟在城市公园中越冬。成都观鸟会的公民科学项目已持续超过15年，是公众参与城市生态保护的典范。",
      "summary_en": "Over 500 bird species have been recorded in and around Chengdu, making it one of the best inland cities in China for birdwatching. Qinglong Lake Wetland Park, Bailu Bay Wetland, and Longquanshan Urban Forest Park are the three core birding areas. Each winter, thousands of migratory birds overwinter in the city's parks. The Chengdu Bird Watching Society's citizen science program has run for over 15 years.",
      "key_facts": [
        {"zh": "成都记录鸟类超过500种", "en": "Over 500 bird species recorded in Chengdu"},
        {"zh": "青龙湖湿地公园是距市中心最近的大型观鸟点", "en": "Qinglong Lake is the closest major birding spot to central Chengdu"}
      ],
      "terms": [
        {"zh": "公民科学", "en": "Citizen Science", "context": "非专业公众参与科学数据收集和研究的过程"}
      ],
      "misunderstandings": [{"myth": "城市里只有麻雀和鸽子", "fact": "成都市区记录有包括国家一级保护鸟类在内的500多种鸟类"}],
      "narrative_angles": ["人与自然和谐共生的成都样本", "候鸟无国界：城市湿地的全球生态网络角色"]
    },
    "embedding_text": "成都观鸟 Chengdu Birdwatching 500种鸟类 青龙湖 白鹭湾 候鸟 公民科学 citizen science 城市生态 湿地 生物多样性"
  },
  {
    "id": "nat_017", "title_zh": "龙泉山城市森林公园", "title_en": "Longquanshan Urban Forest Park",
    "module": "natural_heritage", "type": "entity",
    "content": {
      "summary_zh": "龙泉山城市森林公园位于成都东部，总面积约1275平方公里，是全球最大的城市森林公园。它是成都的城市绿心，也是成渝地区双城经济圈的生态屏障。公园植被覆盖率超过80%，夏季能见度好时可以看到200公里外的贡嘎雪山。",
      "summary_en": "Longquanshan Urban Forest Park, east of Chengdu, covers about 1,275 sq km, the world's largest urban forest park. It serves as Chengdu's urban green heart and the ecological barrier for the Chengdu-Chongqing economic circle. Vegetation coverage exceeds 80%. On clear summer mornings, Mount Gongga, 200 km away, is visible.",
      "key_facts": [
        {"zh": "总面积约1275平方公里，全球最大的城市森林公园", "en": "World's largest urban forest park at approximately 1,275 sq km"},
        {"zh": "植被覆盖率超过80%", "en": "Vegetation coverage exceeds 80%"}
      ],
      "terms": [
        {"zh": "城市绿心", "en": "Urban Green Heart", "context": "位于城市近郊的大型生态绿地，发挥城市生态调节功能"}
      ],
      "misunderstandings": [{"myth": "城市森林公园就是普通的郊野公园", "fact": "龙泉山是世界最大城市森林公园，生态功能远超普通城市公园"}],
      "narrative_angles": ["世界最大城市森林公园的生态雄心", "在成都看雪山：一座城市的生态奇迹"]
    },
    "embedding_text": "龙泉山 Longquanshan 城市森林公园 Urban Forest Park 1275平方公里 全球最大 城市绿心 成渝 贡嘎雪山 生态屏障"
  },
  {
    "id": "nat_018", "title_zh": "大凉山——清洁能源与生物多样性高地", "title_en": "Great Liangshan: A Highland of Clean Energy and Biodiversity",
    "module": "natural_heritage", "type": "entity",
    "content": {
      "summary_zh": "大凉山位于四川省西南部凉山彝族自治州，是中国西南面积最大、海拔最高的山地之一，也是彝族同胞世代生活的家园。凉山是全球生物多样性热点地区，同时风能和太阳能资源极为丰富，是中国清洁能源转型的关键区域。",
      "summary_en": "The Great Liangshan Mountains in southwestern Sichuan form one of the largest and highest mountain regions in Southwest China, home to the Yi people for generations. A global biodiversity hotspot, Liangshan is also extraordinarily rich in wind and solar resources, making it a key region for China's clean energy transition.",
      "key_facts": [
        {"zh": "凉山是中国最大的彝族聚居区", "en": "China's largest Yi-populated region"},
        {"zh": "拥有丰富风能和太阳能资源，是中国清洁能源基地", "en": "Abundant wind and solar resources; a key clean energy base"}
      ],
      "terms": [
        {"zh": "清洁能源", "en": "Clean Energy", "context": "风能、太阳能等不产生碳排放的能源形式"}
      ],
      "misunderstandings": [{"myth": "凉山只有贫困", "fact": "凉山拥有丰富的自然资源和深厚民族文化，脱贫后正在快速发展"}],
      "narrative_angles": ["大凉山的风：清洁能源如何改变一座山", "彝族文化与自然共生的千年智慧"]
    },
    "embedding_text": "大凉山 Liangshan 凉山彝族自治州 彝族 Yi 生物多样性 清洁能源 风电 光伏 生态保护"
  },
  {
    "id": "nat_019", "title_zh": "瓦屋山——中国最美桌山", "title_en": "Mount Wawu: China's Most Beautiful Table Mountain",
    "module": "natural_heritage", "type": "entity",
    "content": {
      "summary_zh": "瓦屋山位于眉山市洪雅县，海拔2830米，山顶平台约11平方公里，是世界最大桌山之一。兰溪瀑布落差1040米，是世界级高落差瀑布。瓦屋山与峨眉山隔青衣江相望，合称蜀中二绝。",
      "summary_en": "Mount Wawu, in Hongya County, Meishan, rises to 2,830 m with a plateau summit of about 11 sq km, one of the world's largest table mountains. Lanxi Waterfall drops 1,040 m. Along with Mount Emei, it forms the Twin Wonders of Shu.",
      "key_facts": [
        {"zh": "山顶平台约11平方公里，世界最大桌山之一", "en": "Plateau summit about 11 sq km, one of the world's largest table mountains"},
        {"zh": "兰溪瀑布落差1040米", "en": "Lanxi Waterfall drops 1,040 m"}
      ],
      "terms": [
        {"zh": "桌山", "en": "Table Mountain", "context": "山顶平坦如桌面的大型山体"}
      ],
      "misunderstandings": [{"myth": "瓦屋山只是小景点", "fact": "兰溪瀑布是世界级高落差瀑布，桌山地貌全球罕见"}],
      "narrative_angles": ["世界桌山家族的东方代表", "1040米的水之舞：兰溪瀑布"]
    },
    "embedding_text": "瓦屋山 Mount Wawu 桌山 table mountain 2830米 兰溪瀑布 1040米 峨眉山 蜀中二绝 洪雅 眉山"
  },
  {
    "id": "nat_020", "title_zh": "兴文石海——喀斯特地貌博物馆", "title_en": "Xingwen Stone Sea: A Museum of Karst Landforms",
    "module": "natural_heritage", "type": "entity",
    "content": {
      "summary_zh": "兴文石海位于宜宾市兴文县，是世界地质公园，以石海、溶洞、天坑三绝著称。天泉洞长度超10公里，大天坑直径650米深208米。这里也是苗族同胞的聚居地。",
      "summary_en": "Xingwen Stone Sea, in Xingwen County, Yibin, is a UNESCO Global Geopark famed for three wonders: the Stone Sea, karst caves, and giant sinkholes. Tianquan Cave exceeds 10 km. The Great Tiankeng is 650 m in diameter and 208 m deep. It is also home to the Miao ethnic community.",
      "key_facts": [
        {"zh": "世界地质公园", "en": "UNESCO Global Geopark"},
        {"zh": "天泉洞长度超过10公里", "en": "Tianquan Cave over 10 km long"}
      ],
      "terms": [
        {"zh": "天坑", "en": "Tiankeng / Giant Sinkhole", "context": "由地下河溶蚀和洞顶坍塌形成的巨大垂直洞穴"}
      ],
      "misunderstandings": [{"myth": "喀斯特地貌只有桂林才有", "fact": "兴文是中国南方喀斯特的重要组成部分"}],
      "narrative_angles": ["地下10公里的秘密：天泉洞探秘", "自然奇观中的苗族文化温度"]
    },
    "embedding_text": "兴文石海 Xingwen Stone Sea 喀斯特 karst 世界地质公园 天泉洞 天坑 tiankeng 宜宾 苗族"
  }
]

# ========== history 补充 ==========
hist_new = [
  {
    "id": "hist_012", "title_zh": "四川保路运动——辛亥革命的导火索", "title_en": "Sichuan Railway Protection Movement: The Trigger of the 1911 Revolution",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "1911年四川保路运动是辛亥革命的直接导火索。清政府将川汉铁路筑路权收归国有并抵押给外国银行，激起四川民众大规模抗议。9月7日，四川总督赵尔丰下令开枪镇压请愿群众，制造了成都血案。武昌起义的爆发与保路运动导致的湖北新军入川镇压有直接关联。人民公园内的辛亥秋保路死事纪念碑至今矗立，是这段历史的见证。",
      "summary_en": "The 1911 Sichuan Railway Protection Movement was the direct trigger of the Xinhai Revolution. When the Qing government nationalized the Sichuan-Hankou Railway rights and mortgaged them to foreign banks, massive protests erupted across Sichuan. On September 7, Governor-General Zhao Erfeng ordered troops to fire on petitioners, creating the Chengdu Massacre. The Wuchang Uprising was directly linked to the Railway Protection Movement. The Monument to the Martyrs of the Railway Protection Movement still stands in People's Park.",
      "key_facts": [
        {"zh": "1911年9月7日成都血案", "en": "Chengdu Massacre on September 7, 1911"},
        {"zh": "辛亥秋保路死事纪念碑位于成都人民公园", "en": "Monument stands in Chengdu People's Park"}
      ],
      "terms": [
        {"zh": "保路运动", "en": "Railway Protection Movement", "context": "1911年四川民众反对清政府将铁路收归国有的爱国运动"}
      ],
      "misunderstandings": [{"myth": "辛亥革命只是武昌起义", "fact": "四川保路运动是武昌起义的直接导火索"}],
      "narrative_angles": ["一座纪念碑背后的中国现代化转折", "铁路、民意与革命：保路运动的全球史视角"]
    },
    "embedding_text": "保路运动 Railway Protection Movement 辛亥革命 1911年 成都血案 人民公园 纪念碑 川汉铁路 赵尔丰 武昌起义"
  },
  {
    "id": "hist_013", "title_zh": "成都交子——世界上最早的纸币", "title_en": "Chengdu Jiaozi: The World's Earliest Paper Money",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "交子诞生于北宋时期的成都（约1023年），是世界上最早的官方纸币。当时四川使用铁钱，重量大不便于携带，成都16家富商联合发行交子作为替代。后由官府接管，设立益州交子务，成为世界上第一个官方纸币发行机构。交子的防伪技术包括复杂的图案、红黑双色套印和'交子铺'的铺保制度。它比欧洲最早的纸币（瑞典1661年）早了600多年。",
      "summary_en": "Jiaozi, born in Chengdu during the Northern Song Dynasty (circa 1023), is the world's earliest official paper currency. At the time, Sichuan used heavy iron coins; 16 wealthy Chengdu merchants jointly issued jiaozi as a lightweight alternative. The government later took over, establishing the Yizhou Jiaozi Bureau — the world's first official paper money issuing institution. Jiaozi's anti-counterfeiting features included complex patterns, red-and-black two-color printing, and a merchant guarantee system. It predates Europe's earliest paper money (Sweden, 1661) by over 600 years.",
      "key_facts": [
        {"zh": "约1023年诞生于成都，世界最早的官方纸币", "en": "Born in Chengdu circa 1023, world's earliest official paper money"},
        {"zh": "比欧洲最早纸币早600多年", "en": "Predates Europe's earliest paper money by over 600 years"}
      ],
      "terms": [
        {"zh": "交子", "en": "Jiaozi / Exchange Medium", "context": "北宋时期在四川出现的纸质信用货币"}
      ],
      "misunderstandings": [{"myth": "纸币是西方发明的", "fact": "中国成都的交子是世界上最早的官方纸币，比西方早600多年"}],
      "narrative_angles": ["一张纸改变世界：交子的金融革命", "为什么是成都？纸币诞生的经济地理学", "从交子到数字人民币：中国货币的千年演进"]
    },
    "embedding_text": "交子 Jiaozi 纸币 paper money 北宋 成都 1023年 益州交子务 世界上最早的纸币 金融史 铁钱 防伪"
  },
  {
    "id": "hist_014", "title_zh": "四川袍哥文化", "title_en": "Sichuan Paoge (Brotherhood) Culture",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "袍哥是清代至民国时期四川最庞大的民间秘密结社组织，鼎盛时期四川成年男性中超过半数加入袍哥。袍哥源于明末清初的反清复明组织，后演变为兼具互助、仲裁、社交功能的民间社会网络。袍哥有严格的帮规和暗语体系，'义'字是其核心价值。茶馆是袍哥'码头'的主要活动场所，这也是四川茶馆文化兴盛的社会基础之一。1949年后袍哥组织逐渐消亡，但其讲义气、重人情的社会心理至今影响着四川人的性格。",
      "summary_en": "Paoge was the largest secret society in Sichuan from the Qing Dynasty through the Republic of China era. At its peak, over half of adult males in Sichuan were members. Originating from anti-Qing resistance in the late Ming, Paoge evolved into a civil network combining mutual aid, arbitration, and social functions. With strict codes of conduct and a secret argot system, yi (righteousness/brotherhood) was its core value. Teahouses served as Paoge docks (matou), which partly explains the flourishing of Sichuan teahouse culture. The organizations gradually dissolved after 1949, but their values of brotherhood and human connection still influence Sichuan's social character.",
      "key_facts": [
        {"zh": "鼎盛时期四川成年男性超半数加入袍哥", "en": "At its peak, over half of Sichuan adult males were Paoge members"},
        {"zh": "茶馆是袍哥码头的主要活动场所", "en": "Teahouses were the primary venues for Paoge docks"}
      ],
      "terms": [
        {"zh": "袍哥", "en": "Paoge / Brotherhood Society", "context": "四川民间秘密结社组织，清代至民国最具影响力的社会网络之一"}
      ],
      "misunderstandings": [{"myth": "袍哥就是黑社会", "fact": "袍哥虽有暴力面，但其核心功能是民间互助和基层社会管理，与当代黑社会概念不同"}],
      "narrative_angles": ["袍哥与茶馆：四川公共空间的独特基因", "义字当头：袍哥精神与四川人的社会性格"]
    },
    "embedding_text": "袍哥 Paoge 秘密结社 四川 清代 民国 茶馆 码头 义气 社会网络 帮规 暗语"
  },
  {
    "id": "hist_015", "title_zh": "成渝铁路——新中国第一条自主修建的铁路", "title_en": "Chengdu-Chongqing Railway: The First Railway Independently Built by New China",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "成渝铁路连接成都与重庆，全长505公里，1952年7月1日全线通车，是新中国成立后自主修建的第一条铁路。清末以来成渝铁路多次筹建未果——保路运动的导火索正是这条铁路。从1903年提出到1952年通车，成渝铁路的百年筑路史就是四川现代化进程的缩影。今天的成渝高铁将两地通行时间缩短至1小时，成渝中线高铁建成后将压缩至约50分钟。",
      "summary_en": "The Chengdu-Chongqing Railway, connecting the two cities over 505 km, opened on July 1, 1952, as the first railway independently built by the People's Republic of China. Its construction had been attempted since the late Qing Dynasty — the Railway Protection Movement, which triggered the 1911 Revolution, was fought over this very line. From its first proposal in 1903 to its opening in 1952, the century-long history of this railway mirrors Sichuan's modernization journey. Today, the Chengdu-Chongqing High-Speed Railway has reduced travel time to just one hour.",
      "key_facts": [
        {"zh": "1952年7月1日全线通车，全长505公里", "en": "Opened July 1, 1952; 505 km long"},
        {"zh": "从1903年提出到1952年通车，历时近半个世纪", "en": "From proposal in 1903 to completion in 1952, nearly half a century"}
      ],
      "terms": [
        {"zh": "成渝经济圈", "en": "Chengdu-Chongqing Economic Circle", "context": "以成都和重庆为核心的西部地区最大城市群"}
      ],
      "misunderstandings": [{"myth": "成渝铁路只是普通铁路线", "fact": "它是新中国自主修建的第一条铁路，也是保路运动的历史终点"}],
      "narrative_angles": ["一条铁路的百年梦想：从保路运动到高铁时代", "成渝双城记：铁轨上的城市关系史"]
    },
    "embedding_text": "成渝铁路 Chengdu-Chongqing Railway 1952年 505公里 新中国 保路运动 成渝高铁 成渝经济圈 现代化"
  },
  {
    "id": "hist_016", "title_zh": "蜀汉与诸葛亮治蜀", "title_en": "Shu Han and Zhuge Liang's Governance of Shu",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "蜀汉（221-263年）是三国时期由刘备在成都建立的政权，诸葛亮为丞相，以成都为国都。诸葛亮治蜀期间，推行法治、重视农业、发展蜀锦产业（'决敌之资，唯仰锦耳'）、开发南中（今云南贵州）、改良连弩和木牛流马等军用技术。成都平原的水利设施在蜀汉时期得到系统维护，都江堰设有专职堰官。诸葛亮'鞠躬尽瘁、死而后已'的精神成为中华文化中最具感染力的人格典范之一。",
      "summary_en": "Shu Han (221-263 CE) was a Three Kingdoms state founded by Liu Bei in Chengdu, with Zhuge Liang as Chancellor. During his governance, Zhuge Liang promoted rule of law, agriculture, the Shu brocade industry, development of Nanzhong (modern Yunnan-Guizhou), and military innovations such as the repeating crossbow and wooden ox and flowing horse. The Dujiangyan irrigation system was systematically maintained with a dedicated officer. Zhuge Liang's spirit of sparing no effort until death remains one of the most influential models of character in Chinese culture.",
      "key_facts": [
        {"zh": "蜀汉以成都为国都，存续42年（221-263年）", "en": "Shu Han lasted 42 years (221-263 CE) with Chengdu as capital"},
        {"zh": "都江堰在蜀汉时期设有专职堰官维护", "en": "Dujiangyan had a dedicated officer during the Shu Han period"}
      ],
      "terms": [
        {"zh": "鞠躬尽瘁，死而后已", "en": "Spare no effort until death", "context": "诸葛亮《后出师表》中的名句，成为中国知识分子最高人格追求的象征"}
      ],
      "misunderstandings": [{"myth": "诸葛亮是神化的传说人物", "fact": "诸葛亮是真实历史人物，《三国志》有明确记载，其治国方略和科技贡献均有史料佐证"}],
      "narrative_angles": ["诸葛亮的成都十年：一位治国者的遗产", "蜀锦与蜀汉经济：古代文化产业的雏形"]
    },
    "embedding_text": "蜀汉 Shu Han 诸葛亮 Zhuge Liang 刘备 成都 三国 鞠躬尽瘁 蜀锦 都江堰 法治 南中"
  },
  {
    "id": "hist_017", "title_zh": "四川的客家移民文化——洛带古镇", "title_en": "Sichuan Hakka Migrant Culture: Luodai Ancient Town",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "洛带古镇位于成都龙泉驿区，是中国西部最大的客家聚居区。清初湖广填四川的移民大潮中，大量客家人从广东、福建、江西迁入四川。洛带的客家人至今保留着客家方言、围楼建筑和祭祖习俗。博客楼（客家土楼）是洛带的标志性建筑。'湖广填四川'是中国历史上规模最大的人口迁移之一，深刻改变了四川的人口结构、语言面貌和饮食文化。",
      "summary_en": "Luodai Ancient Town, in Chengdu's Longquanyi District, is the largest Hakka settlement in western China. During the early Qing Huguang Fills Sichuan migration wave, large numbers of Hakka people moved from Guangdong, Fujian, and Jiangxi into Sichuan. Luodai's Hakka community still preserves the Hakka dialect, tulou architecture, and ancestral worship customs. The Hakka Tulou (Blog Building) is Luodai's landmark. Huguang Fills Sichuan was one of the largest population migrations in Chinese history, profoundly reshaping Sichuan's demographics, language landscape, and culinary culture.",
      "key_facts": [
        {"zh": "洛带是中国西部最大的客家聚居区", "en": "Luodai is the largest Hakka settlement in western China"},
        {"zh": "湖广填四川从清初持续约100年", "en": "Huguang Fills Sichuan migration lasted about 100 years from the early Qing"}
      ],
      "terms": [
        {"zh": "湖广填四川", "en": "Huguang Fills Sichuan", "context": "清代初期大规模移民四川的历史事件"}
      ],
      "misunderstandings": [{"myth": "四川人都是本地土著后代", "fact": "今天的四川人大部分是湖广填四川移民的后代"}],
      "narrative_angles": ["湖广填四川：一场改变四川面貌的人口大迁移", "客家人与四川文化融合的300年"]
    },
    "embedding_text": "洛带古镇 Luodai 客家 Hakka 湖广填四川 移民 龙泉驿 土楼 博客楼 清初 人口迁移 方言"
  },
  {
    "id": "hist_018", "title_zh": "华西协合大学——中国西部现代医学的摇篮", "title_en": "West China Union University: The Cradle of Modern Medicine in Western China",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "华西协合大学（今四川大学华西医学中心前身）于1910年由美、英、加三国五个基督教会联合创办于成都，是中国西部第一所现代化大学。其建筑群融合了中国传统建筑元素与西方功能布局，是中西建筑文化交融的经典。华西的医学教育在中国现代医学史上具有标志性地位——抗战时期，华西与内迁的齐鲁大学、金陵大学等联合办学，成为大后方最重要的医学教育中心。",
      "summary_en": "West China Union University (predecessor of today's West China Medical Center of Sichuan University) was founded in 1910 in Chengdu by five Christian missions from the US, UK, and Canada. It was the first modern university in western China. Its architectural complex, blending traditional Chinese elements with Western functional layouts, is a classic of Sino-Western architectural fusion. West China's medical education holds an iconic position in modern Chinese medical history. During the War of Resistance, it became the most important medical education center in Free China.",
      "key_facts": [
        {"zh": "1910年创办于成都，中国西部第一所现代化大学", "en": "Founded 1910 in Chengdu, first modern university in western China"},
        {"zh": "华西建筑群入选全国重点文物保护单位", "en": "West China architectural complex listed as a Major National Protected Cultural Site"}
      ],
      "terms": [
        {"zh": "协合", "en": "Union / Xiehe", "context": "多个教会联合创办之意"}
      ],
      "misunderstandings": [{"myth": "华西只是教会学校", "fact": "华西是综合性大学，其医学教育在中国现代医学史上具有开创性地位"}],
      "narrative_angles": ["一座大学的建筑如何讲述中西文化对话", "抗战时期华西坝：中国教育的诺亚方舟"]
    },
    "embedding_text": "华西协合大学 West China Union University 1910年 成都 医学教育 建筑 中西融合 抗战 四川大学"
  },
  {
    "id": "hist_019", "title_zh": "川盐济楚——古代四川的盐业帝国", "title_en": "Sichuan Salt for Chu: The Ancient Sichuan Salt Industry Empire",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "四川自古是中国最重要的井盐产区，自贡因盐而兴，被称为千年盐都。清代中叶'川盐济楚'——太平天国阻断淮盐西运后，川盐大规模进入两湖市场，自贡盐业进入黄金时代。燊海井是世界上第一口超过千米的深井（1001.42米，1835年凿成），是当时全球最深的人工钻井。自贡盐业繁荣催生了独特的盐帮菜、盐商会馆和盐工文化。",
      "summary_en": "Sichuan has been China's most important well salt production region since ancient times. Zigong, known as the Thousand-Year Salt Capital, prospered because of salt. In the mid-Qing Dynasty, when the Taiping Rebellion cut off sea salt supply to central China, Sichuan salt poured into the Hubei-Hunan market in the Salt-for-Chu trade, launching Zigong's golden age. Shenhai Well, completed in 1835 at 1,001.42 meters, was the world's first well exceeding 1 km in depth. The salt prosperity gave birth to unique salt merchant cuisine, guild halls, and salt worker culture.",
      "key_facts": [
        {"zh": "自贡被称为千年盐都", "en": "Zigong known as the Thousand-Year Salt Capital"},
        {"zh": "燊海井深1001.42米，1835年凿成，世界第一口超千米深井", "en": "Shenhai Well: 1,001.42 m, completed 1835, world's first well over 1 km"}
      ],
      "terms": [
        {"zh": "井盐", "en": "Well Salt", "context": "通过钻井开采地下卤水熬制而成的食盐"}
      ],
      "misunderstandings": [{"myth": "自贡只有恐龙和灯会", "fact": "自贡因盐而兴，燊海井是人类钻井技术的里程碑"}],
      "narrative_angles": ["千米之下：燊海井与人类钻井技术的巅峰", "盐塑造的城市：自贡的盐业帝国与文化遗产"]
    },
    "embedding_text": "川盐济楚 自贡 Zigong 盐都 井盐 well salt 燊海井 1001米 1835年 盐帮菜 盐商会馆 太平天国"
  },
  {
    "id": "hist_020", "title_zh": "南方丝绸之路的四川起点", "title_en": "Sichuan as the Starting Point of the Southern Silk Road",
    "module": "history", "type": "entity",
    "content": {
      "summary_zh": "南方丝绸之路（也称蜀身毒道）是一条比北方丝绸之路更古老的国际商道，起点在成都，经云南进入缅甸、印度，最终到达中亚。早在西汉张骞出使西域之前，蜀地的丝绸、蜀布和邛竹杖就已经通过这条道路到达了大夏（今阿富汗）。三星堆出土的大量海贝和象牙，很可能是通过南方丝绸之路从印度洋地区贸易而来。南方丝绸之路与茶马古道、蜀道共同构成了四川的三大线性文化遗产网络。",
      "summary_en": "The Southern Silk Road (Shu-Shendu Road) is an international trade route older than the Northern Silk Road. Starting from Chengdu, passing through Yunnan into Myanmar and India, it ultimately reached Central Asia. Before Zhang Qian's mission to the Western Regions in the Western Han Dynasty, Shu silk, cloth, and Qiong bamboo staffs had already reached Bactria (modern Afghanistan) via this route. The large quantities of seashells and ivory unearthed at Sanxingdui were likely traded from the Indian Ocean region through the Southern Silk Road. Together with the Tea Horse Road and the Shu Roads, it forms Sichuan's triad of linear cultural heritage networks.",
      "key_facts": [
        {"zh": "起点在成都，比北方丝绸之路更古老", "en": "Starting from Chengdu, older than the Northern Silk Road"},
        {"zh": "三星堆海贝和象牙可能来自南方丝路贸易", "en": "Sanxingdui seashells and ivory likely traded via the Southern Silk Road"}
      ],
      "terms": [
        {"zh": "蜀身毒道", "en": "Shu-Shendu Road", "context": "身毒是古代中国对印度的称谓"}
      ],
      "misunderstandings": [{"myth": "丝绸之路只有北方一条", "fact": "南方丝绸之路和海上丝绸之路同样重要，南方丝路历史更为悠久"}],
      "narrative_angles": ["比丝绸之路更古老：南方丝路的千年传奇", "从三星堆海贝看古蜀的全球化"]
    },
    "embedding_text": "南方丝绸之路 Southern Silk Road 蜀身毒道 成都起点 比北方丝路更古老 缅甸 印度 三星堆海贝 象牙 线性文化遗产"
  }
]

# ========== intangible_heritage 补充 ==========
ich_new = [
  {
    "id": "ich_011", "title_zh": "川江号子——长江上的劳动史诗", "title_en": "Chuanjiang Haozi: The Labor Epic of the Yangtze River",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "川江号子是长江上游（川江段）船工在拉纤、摇橹、推桡等劳动中传唱的民间歌谣，2006年列入第一批国家级非物质文化遗产。号子既是协调劳动节奏的工具，也是船工表达情感、讲述故事的艺术形式。川江号子曲牌丰富，有上水号子、下水号子、平水号子等几十种。随着三峡工程和机动船普及，川江号子失去了原生劳动场景，但通过非遗保护和舞台演绎获得了新的生命力。",
      "summary_en": "Chuanjiang Haozi are folk work songs sung by boatmen on the upper Yangtze River during towing, rowing, and steering labor. Inscribed in the first batch of National ICH in 2006, these chants served both as labor-coordination tools and artistic expressions. With dozens of tune patterns for different work scenarios, Chuanjiang Haozi lost its original labor context after the Three Gorges Dam and motorization, but has gained new life through ICH protection and stage performances.",
      "key_facts": [
        {"zh": "2006年列入第一批国家级非遗", "en": "Inscribed in first batch of National ICH, 2006"},
        {"zh": "有上水、下水、平水等几十种曲牌", "en": "Dozens of tune patterns for different work scenarios"}
      ],
      "terms": [
        {"zh": "号子", "en": "Haozi / Work Chant", "context": "在集体劳动中为统一节奏和鼓舞士气而唱的民歌"}
      ],
      "misunderstandings": [{"myth": "川江号子已经失传了", "fact": "川江号子作为非遗项目得到保护，在舞台演出和文化活动中仍有传承"}],
      "narrative_angles": ["长江上的劳动交响曲：川江号子的音乐人类学", "当江水不再需要号子：非遗活态保护的困境与出路"]
    },
    "embedding_text": "川江号子 Chuanjiang Haozi 船工 长江 非遗 2006年 劳动号子 三峡 拉纤 work song 民间音乐"
  },
  {
    "id": "ich_012", "title_zh": "泸州老窖酒传统酿制技艺", "title_en": "Luzhou Laojiao Traditional Liquor-Making Techniques",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "泸州老窖酒传统酿制技艺拥有超过690年的历史，是中国浓香型白酒的典型代表，2006年列入首批国家级非遗。其核心是'续糟配料、混蒸混烧'工艺和'1573国宝窖池群'——连续使用超过450年的老窖池。白酒酿制中的'泥窖发酵'是中国独有的生物工程技术：窖泥中的微生物群落在数百年连续酿造中形成了独特的生态系统。",
      "summary_en": "Luzhou Laojiao's traditional liquor-making techniques, with over 690 years of history, represent the quintessential strong-aroma baijiu. Inscribed in the first batch of National ICH in 2006, its core techniques include continuous fermented-grain blending and the 1573 National Treasure Pit Group —窖池 continuously used for over 450 years. The mud-pit fermentation used in baijiu making is a uniquely Chinese bioengineering technology: the microbial community in the pit mud has formed a distinctive ecosystem over centuries of continuous brewing.",
      "key_facts": [
        {"zh": "超过690年历史，2006年列入首批国家级非遗", "en": "Over 690 years of history; first batch National ICH, 2006"},
        {"zh": "1573国宝窖池群连续使用超过450年", "en": "1573 National Treasure Pit Group continuously used for over 450 years"}
      ],
      "terms": [
        {"zh": "浓香型白酒", "en": "Strong-Aroma Baijiu", "context": "中国白酒四大香型之一，以泸州老窖和五粮液为代表"}
      ],
      "misunderstandings": [{"myth": "白酒只是酒精饮料", "fact": "白酒酿制是中国独有的生物工程技术，老窖池中的微生物群落是活态文化遗产"}],
      "narrative_angles": ["450年的微生物帝国：老窖池的科学密码", "从泸州到世界：中国白酒的国际化表达"]
    },
    "embedding_text": "泸州老窖 Luzhou Laojiao 白酒 baijiu 浓香型 1573 窖池 微生物 非遗 2006年 酿酒 690年"
  },
  {
    "id": "ich_013", "title_zh": "四川扬琴——坐地传情的曲艺瑰宝", "title_en": "Sichuan Yangqin: A Gem of Chinese Narrative Singing",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "四川扬琴是国家级非物质文化遗产（2008年），又称四川琴书，以扬琴为主要伴奏乐器，集说、唱、奏于一体。表演时多人围坐，分角色演唱故事，有生、旦、净、末、丑五个行当。四川扬琴的音乐吸收了川剧高腔和四川清音的元素，形成了独特的唱腔体系。传统曲目包括《三国》《水浒》《红楼梦》等长篇故事。",
      "summary_en": "Sichuan Yangqin, a National ICH (2008), also called Sichuan Qin Shu, features the yangqin (hammered dulcimer) as the main accompanying instrument, integrating narration, singing, and instrumental performance. Performers sit in a circle, each taking a role — the five role types of Chinese opera. Sichuan Yangqin music incorporates elements of Sichuan Opera high-pitched singing and Sichuan Qingyin, forming a unique vocal system. Traditional repertoire includes Romance of the Three Kingdoms, Water Margin, and Dream of the Red Chamber.",
      "key_facts": [
        {"zh": "2008年列入国家级非遗", "en": "National ICH inscribed 2008"},
        {"zh": "分角色演唱，有五个行当", "en": "Five role types in ensemble performance"}
      ],
      "terms": [
        {"zh": "扬琴", "en": "Yangqin / Hammered Dulcimer", "context": "击弦乐器，用琴竹敲击琴弦发声"}
      ],
      "misunderstandings": [{"myth": "扬琴是西方乐器", "fact": "扬琴虽源自中东，但在中国已有400多年历史，四川扬琴已完全本土化"}],
      "narrative_angles": ["坐地传情：四川扬琴的室内剧场魅力", "三国故事如何通过扬琴代代相传"]
    },
    "embedding_text": "四川扬琴 Sichuan Yangqin 琴书 非遗 2008年 扬琴 说唱 分角色 三国 川剧 曲艺"
  },
  {
    "id": "ich_014", "title_zh": "蒙顶山茶传统制作技艺", "title_en": "Mengding Mountain Tea Traditional Production Techniques",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "蒙顶山位于四川雅安，是中国人工种茶最早的地方——西汉甘露年间（公元前53年）吴理真在蒙顶山植茶，被尊为'茶祖'。蒙顶山茶自唐代起就是贡茶，'蒙山顶上茶'是蜀中三绝之一。蒙顶甘露和蒙顶黄芽是最具代表性的品种。蒙顶山也是茶马古道川藏线的起点——雅安藏茶从这里出发，翻越二郎山、折多山，到达康定和拉萨。",
      "summary_en": "Mengding Mountain in Ya'an, Sichuan, is the earliest site of artificial tea cultivation in China. In 53 BCE during the Western Han, Wu Lizhen planted tea on Mengding and was revered as the Tea Ancestor. Mengding Mountain tea has been imperial tribute since the Tang Dynasty. Its most representative varieties are Mengding Ganlu (Sweet Dew) and Mengding Huangya (Yellow Bud). Mengding is also the starting point of the Sichuan-Tibet route of the Tea Horse Road — Ya'an Tibetan tea departed from here, crossing Erlang Mountain and Zheduo Mountain to reach Kangding and Lhasa.",
      "key_facts": [
        {"zh": "公元前53年吴理真在蒙顶山植茶，中国人工种茶最早记录", "en": "53 BCE: Wu Lizhen planted tea on Mengding, China's earliest record of artificial tea cultivation"},
        {"zh": "唐代起就是贡茶", "en": "Imperial tribute tea since the Tang Dynasty"}
      ],
      "terms": [
        {"zh": "茶祖", "en": "Tea Ancestor", "context": "对最早人工种植茶树的吴理真的尊称"}
      ],
      "misunderstandings": [{"myth": "最好的茶叶都在云南和福建", "fact": "蒙顶山是中国茶文化的发源地之一，蒙顶甘露和黄芽在唐代已是顶级贡茶"}],
      "narrative_angles": ["茶祖吴理真：中国茶文化起源的另一种叙事", "从蒙顶山到拉萨：一片茶叶的2000公里朝圣"]
    },
    "embedding_text": "蒙顶山 Mengding Mountain 茶 tea 吴理真 公元前53年 茶祖 贡茶 雅安 茶马古道 蒙顶甘露 蒙顶黄芽 藏茶"
  },
  {
    "id": "ich_015", "title_zh": "宜宾燃面——舌尖上的巴蜀记忆", "title_en": "Yibin Ranmian: The Taste of Ba-Shu Memory",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "宜宾燃面是四川宜宾最具代表性的传统小吃，以'油重无水、点火即燃'得名。燃面的精髓在于'三熟'——面熟、油熟、料熟，以及碎花生、芽菜、葱花、芝麻等十余种配料。宜宾燃面的起源与码头工人有关——高热量、快制作、价廉物美，适合长江码头体力劳动者的需求。宜宾燃面制作技艺已被列入市级非遗。",
      "summary_en": "Yibin Ranmian (Burning Noodles) is Yibin's most iconic traditional snack, named for being so oil-rich and water-free that it can supposedly be lit on fire. Its essence lies in the triple readiness — noodles, oil, and seasonings — plus over ten garnishes including crushed peanuts, preserved mustard greens, scallions, and sesame. Its origins are tied to dock workers: high-calorie, quick to prepare, and affordable, perfectly suiting the needs of Yangtze River dock laborers. The technique has been listed as municipal-level ICH.",
      "key_facts": [
        {"zh": "以油重无水、点火即燃得名", "en": "Named for being oil-rich enough to theoretically ignite"},
        {"zh": "起源于长江码头工人的饮食需求", "en": "Originated from the dietary needs of Yangtze River dock workers"}
      ],
      "terms": [
        {"zh": "燃面", "en": "Ranmian / Burning Noodles", "context": "四川宜宾特产面食，因油重得名"}
      ],
      "misunderstandings": [{"myth": "燃面真的能点燃", "fact": "燃面并非真的能当燃料燃烧，其名称夸张地形容其油分充足、干香爽口的特点"}],
      "narrative_angles": ["一碗面里的长江码头史", "从码头小吃到城市名片：燃面的文化升级之路"]
    },
    "embedding_text": "宜宾燃面 Yibin Ranmian 四川小吃 码头工人 芽菜 花生 长江 非遗 传统美食 面食"
  },
  {
    "id": "ich_016", "title_zh": "四川清音——婉转悠扬的蜀地雅韵", "title_en": "Sichuan Qingyin: The Melodious Elegance of Shu",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "四川清音是国家级非物质文化遗产（2008年），是四川最具代表性的曲艺形式之一。表演者左手持板、右手敲竹鼓，以四川方言演唱，曲调婉转优美。传统曲目分为小调和大调两类，小调轻快活泼，大调叙事性强。四川清音在清代由长江下游的时调传入四川后本土化形成，吸收了川剧和四川民歌的元素。代表曲目《小放风筝》《布谷鸟儿咕咕叫》广为流传。",
      "summary_en": "Sichuan Qingyin, a National ICH (2008), is one of Sichuan's most representative narrative singing forms. The performer holds clappers in the left hand and strikes a bamboo drum with the right, singing in Sichuan dialect with graceful melodies. The repertoire divides into light, lively minor tunes and narrative major tunes. Sichuan Qingyin formed when Lower Yangtze popular tunes entered Sichuan in the Qing Dynasty and were localized, absorbing elements of Sichuan Opera and folk songs.",
      "key_facts": [
        {"zh": "2008年列入国家级非遗", "en": "National ICH inscribed 2008"},
        {"zh": "表演者左手持板、右手敲竹鼓", "en": "Performer holds clappers in left hand, strikes bamboo drum with right"}
      ],
      "terms": [
        {"zh": "清音", "en": "Qingyin / Pure Tunes", "context": "四川曲艺种类，以清雅婉转著称"}
      ],
      "misunderstandings": [{"myth": "清音和扬琴是一回事", "fact": "四川清音和四川扬琴是不同的曲艺形式——清音为单人表演，扬琴为多人分角色演唱"}],
      "narrative_angles": ["从长江下游到成都茶馆：清音的本土化之旅", "竹鼓声声：一位清音艺人的日常"]
    },
    "embedding_text": "四川清音 Sichuan Qingyin 曲艺 非遗 2008年 竹鼓 四川方言 小调 大调 川剧 时调"
  },
  {
    "id": "ich_017", "title_zh": "成都糖画——以糖为墨的街头艺术", "title_en": "Chengdu Sugar Painting: Street Art in Molten Sugar",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "成都糖画是国家级非物质文化遗产（2008年），以铜勺为笔、糖稀为墨，在大理石板上浇铸出栩栩如生的图案。糖画题材涵盖花鸟鱼虫、飞禽走兽和神话人物。成都糖画源于明代，盛行于清代庙会和街头。糖画艺人需要在糖稀凝固前的极短时间内完成创作，既有绘画的设计感又有即兴创作的随机性。锦里的糖画摊是最受外国游客欢迎的文化体验点之一。",
      "summary_en": "Chengdu Sugar Painting, a National ICH (2008), uses a copper ladle as brush and molten sugar as ink to cast vivid patterns on a marble slab. Subjects range from flora and fauna to mythological figures. Originating in the Ming Dynasty, it flourished at Qing Dynasty temple fairs and street corners. Artists must complete their work within the brief window before the sugar hardens, combining painterly design with improvisational spontaneity. Sugar painting stalls at Jinli are among the most popular cultural experiences for foreign visitors.",
      "key_facts": [
        {"zh": "2008年列入国家级非遗", "en": "National ICH inscribed 2008"},
        {"zh": "以铜勺为笔、糖稀为墨，在大理石板上浇铸", "en": "Casts patterns on marble slabs using a copper ladle and molten sugar"}
      ],
      "terms": [
        {"zh": "糖画", "en": "Sugar Painting", "context": "以融化的蔗糖为原料制作的平面或立体造型艺术"}
      ],
      "misunderstandings": [{"myth": "糖画只是儿童零食", "fact": "糖画是集绘画、雕塑和民间工艺于一体的综合性艺术"}],
      "narrative_angles": ["15秒的艺术：糖稀凝固前的创作极限", "糖画的国际传播：最受外国游客欢迎的中国街头艺术"]
    },
    "embedding_text": "成都糖画 Chengdu Sugar Painting 非遗 2008年 糖稀 铜勺 大理石 街头艺术 锦里 明代 清代 庙会"
  },
  {
    "id": "ich_018", "title_zh": "夹江竹纸制作技艺", "title_en": "Jiajiang Bamboo Paper Making Technique",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "夹江竹纸产于乐山市夹江县，是国家级非物质文化遗产（2006年）。夹江竹纸以嫩竹为原料，经过72道工序、历时约3个月制成，纸质洁白细腻、韧性强。在明清时期，夹江竹纸是书写和绘画的上等用纸，张大千曾专门定制夹江纸用于创作。夹江与安徽宣城并称中国两大手工造纸中心，有'蜀笺'之称。",
      "summary_en": "Jiajiang Bamboo Paper, produced in Jiajiang County, Leshan, is a National ICH (2006). Made from tender bamboo through 72 processes over about 3 months, the paper is white, fine, and strong. During the Ming-Qing period, Jiajiang paper was a premium material for writing and painting. Master painter Zhang Daqian specially ordered Jiajiang paper for his works. Jiajiang and Xuancheng (Anhui) are the two great centers of handmade paper in China.",
      "key_facts": [
        {"zh": "2006年列入国家级非遗", "en": "National ICH inscribed 2006"},
        {"zh": "72道工序，历时约3个月制成", "en": "72 processes over about 3 months"}
      ],
      "terms": [
        {"zh": "竹纸", "en": "Bamboo Paper", "context": "以竹子纤维为主要原料制成的手工纸"}
      ],
      "misunderstandings": [{"myth": "中国只有宣纸", "fact": "夹江竹纸与宣纸并称中国两大手工纸，各有特色——竹纸韧性更强"}],
      "narrative_angles": ["72道工序的纸艺传奇", "张大千与夹江纸的不解之缘"]
    },
    "embedding_text": "夹江竹纸 Jiajiang Bamboo Paper 非遗 2006年 72道工序 张大千 蜀笺 手工纸 乐山 造纸"
  },
  {
    "id": "ich_019", "title_zh": "羌笛——'羌笛何须怨杨柳'的非遗传承", "title_en": "Qiang Flute: The ICH Legacy of a Tang Dynasty Poem",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "羌笛是羌族最古老的双管吹奏乐器，2006年列入国家级非遗。羌笛用高山箭竹制成，长约20厘米，双管并排各有六孔，演奏时采用循环换气法以实现不间断的持续音。唐代王之涣《凉州词》'羌笛何须怨杨柳，春风不度玉门关'使羌笛成为中国文学史上最著名的少数民族乐器意象。汶川地震后羌笛传承遭受重创，如今通过非遗进校园等方式正在逐步恢复。",
      "summary_en": "The Qiang Flute, the most ancient double-pipe wind instrument of the Qiang people, was inscribed as National ICH in 2006. Made from high-mountain arrow bamboo, about 20 cm long, it features two parallel pipes each with six holes, played using circular breathing to produce uninterrupted sustained tones. Tang Dynasty poet Wang Zhihuan's famous line — 'Why should the Qiang flute blame the willows? Spring breezes never cross the Jade Gate Pass' — made it the most renowned ethnic minority instrument in Chinese literary history. After the Wenchuan Earthquake, Qiang flute transmission suffered greatly but is now gradually recovering through ICH-in-school programs.",
      "key_facts": [
        {"zh": "2006年列入国家级非遗", "en": "National ICH inscribed 2006"},
        {"zh": "双管并排各六孔，采用循环换气法演奏", "en": "Two parallel pipes each with six holes; played with circular breathing"}
      ],
      "terms": [
        {"zh": "循环换气", "en": "Circular Breathing", "context": "用鼻子吸气同时用口腔存气继续吹奏的技巧"}
      ],
      "misunderstandings": [{"myth": "羌笛只是诗中的意象", "fact": "羌笛是真实存在的活态乐器，至今仍在羌族社区中演奏和传承"}],
      "narrative_angles": ["一首唐诗与一支羌笛的千年对话", "循环换气：羌笛演奏者的生理极限挑战"]
    },
    "embedding_text": "羌笛 Qiang Flute 非遗 2006年 羌族 双管 循环换气 王之涣 凉州词 汶川地震 吹奏乐器"
  },
  {
    "id": "ich_020", "title_zh": "达州灯影牛肉——刀工下的非遗美食", "title_en": "Dazhou Dengying Beef: ICH Cuisine Under the Knife",
    "module": "intangible_heritage", "type": "entity",
    "content": {
      "summary_zh": "达州灯影牛肉产于四川达州，是省级非物质文化遗产。其名称源于牛肉片薄如纸、可透光如皮影（灯影）的极致刀工——片片薄到可以透过灯光看到对面的物影。灯影牛肉选用牛后腿腱子肉，经腌制、晾干、烘烤后手工撕成细丝。相传清代光绪年间，达州一位刘姓厨师偶然创作了这道菜。灯影牛肉是巴蜀饮食文化'食不厌精'理念的极致体现。",
      "summary_en": "Dazhou Dengying Beef (Shadow-Play Beef), from Dazhou, Sichuan, is a provincial-level ICH. Its name derives from the extreme knife skill required — slices so thin they are translucent like shadow-play figures, through which light can pass. Made from beef shank, it undergoes marination, air-drying, roasting, and hand-shredding into delicate strands. Legend has it that a chef named Liu in Dazhou accidentally created this dish during the Guangxu period of the Qing Dynasty. Dengying Beef is the ultimate expression of the Ba-Shu culinary philosophy of 'striving for refinement in food.'",
      "key_facts": [
        {"zh": "省级非遗，牛肉片薄如纸、可透光", "en": "Provincial-level ICH; beef slices are paper-thin and translucent"},
        {"zh": "源于清光绪年间达州", "en": "Originated in Dazhou during the Qing Guangxu period"}
      ],
      "terms": [
        {"zh": "灯影", "en": "Dengying / Shadow-Play", "context": "皮影戏的别称，形容牛肉片薄到可以透光"}
      ],
      "misunderstandings": [{"myth": "灯影牛肉只是普通牛肉干", "fact": "灯影牛肉的核心在刀工——薄如纸、可透光，是中国饮食文化中极致工艺的代表"}],
      "narrative_angles": ["薄如蝉翼的刀工技艺", "从偶然创作到非遗：灯影牛肉的百年传奇"]
    },
    "embedding_text": "达州灯影牛肉 Dazhou Dengying Beef 非遗 刀工 薄如纸 牛肉干 达州 光绪 食不厌精 巴蜀饮食"
  }
]

# ========== 执行扩充 ==========
for filename, new_entries in [
    ('natural_heritage.json', nat_new),
    ('history.json', hist_new),
    ('intangible_heritage.json', ich_new),
]:
    path = os.path.join(BASE, filename)
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.extend(new_entries)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{filename}: {len(data)} entries (+{len(new_entries)})')
