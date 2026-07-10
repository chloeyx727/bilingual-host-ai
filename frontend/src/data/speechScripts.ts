export interface SpeechScript {
  id: string
  title: string
  category: string
  categoryEn: string
  textCn: string
  textEn: string
}

export const SPEECH_SCRIPTS: SpeechScript[] = [
  // ========== 川剧 ==========
  {
    id: "sichuan_opera_01",
    title: "川剧变脸的艺术魅力",
    category: "川剧",
    categoryEn: "Sichuan Opera",
    textCn: "川剧变脸是四川最具标志性的表演艺术。演员在瞬间变换面部脸谱，最快可达0.2秒一张，以表现角色情绪的急剧转变。变脸不是魔术，它是川剧表演体系的有机组成部分，服务于剧情和人物情感的表达。每一张脸谱的颜色都有特定的含义——红色代表忠勇，黑色代表刚正，白色代表奸诈。",
    textEn: "Sichuan Opera face-changing is the most iconic performing art of Sichuan. Performers swap facial masks in an instant — as fast as 0.2 seconds per change — to express dramatic emotional shifts in a character. Face-changing is not magic; it is an integral part of the Sichuan Opera performance system, serving the narrative and emotional expression of the drama. Each mask color carries a specific meaning — red for loyalty and courage, black for uprightness, and white for treachery.",
  },
  {
    id: "sichuan_opera_02",
    title: "川剧的历史与传统",
    category: "川剧",
    categoryEn: "Sichuan Opera",
    textCn: "川剧起源于明末清初，距今已有三百多年的历史。它融合了昆曲、高腔、胡琴、弹戏和灯调五种声腔艺术，形成了独特的'五腔共和'表演体系。2006年，川剧被列入中国第一批国家级非物质文化遗产名录。今天，成都和重庆的专业川剧院团仍在努力传承和创新这门古老的艺术。",
    textEn: "Sichuan Opera originated in the late Ming and early Qing dynasties, boasting a history of over three hundred years. It integrates five vocal styles — Kunqu, Gaoqiang, Huqin, Tanxi, and Dengdiao — forming a unique 'Five-Style Harmony' performance system. In 2006, Sichuan Opera was inscribed on China's first batch of National Intangible Cultural Heritage. Today, professional Sichuan Opera troupes in Chengdu and Chongqing continue to preserve and innovate this ancient art form.",
  },

  // ========== 非遗 ==========
  {
    id: "ich_01",
    title: "蜀绣——指尖上的千年技艺",
    category: "非遗",
    categoryEn: "Intangible Heritage",
    textCn: "蜀绣是中国四大名绣之一，与苏绣、湘绣、粤绣齐名，历史可追溯到西汉时期。它以软缎和彩丝为主要材料，拥有超过一百二十二种针法，尤以'晕针'技法著称——通过针脚长短和色彩渐变表现微妙的色调过渡。蜀绣既是实用的生活工艺，也是精美的艺术创作。",
    textEn: "Shu Embroidery is one of China's Four Great Embroideries, alongside Su, Xiang, and Yue embroidery, with origins traceable to the Western Han Dynasty. Using soft satin and colored silk as primary materials, it features over one hundred and twenty-two stitch types, and is especially famed for the 'halo stitch' technique — achieving subtle tonal transitions through stitch length and color blending. Shu Embroidery is both a practical craft and a refined art form.",
  },
  {
    id: "ich_02",
    title: "成都漆艺——三千年的大漆之道",
    category: "非遗",
    categoryEn: "Intangible Heritage",
    textCn: "成都漆艺是中国历史最悠久的漆器工艺之一，金沙遗址出土的漆器残片证明它已有三千多年的历史。汉代成都的'蜀郡工官'是当时最重要的官营漆器制造机构。'雕花填彩'和'金银平脱'是成都漆艺的核心技法——在漆面上雕刻纹样后填入金粉，或将金银箔片镶嵌于漆面。一件精品漆器需要数十道工序，耗时数月甚至一年。",
    textEn: "Chengdu Lacquer Art is one of China's oldest lacquer craft traditions. Lacquer fragments unearthed at the Jinsha Site prove its history spans over three thousand years. During the Han Dynasty, the 'Shu Commandery Imperial Workshop' in Chengdu was the most important official lacquer production institution. 'Engraved pattern infill' and 'gold-silver inlay' are the core techniques — carving patterns into the lacquer surface and filling with gold powder, or embedding gold and silver foil. A fine piece requires dozens of processes and months to even a year to complete.",
  },
  {
    id: "ich_03",
    title: "自贡灯会——光与影的千年传奇",
    category: "非遗",
    categoryEn: "Intangible Heritage",
    textCn: "自贡灯会起源于唐宋时期的元宵赏灯习俗，已有八百多年历史。它以'形、色、声、光、动'五大特色著称——采用丝扎、裱糊、彩绘等传统工艺制作巨型灯组，融入现代光电技术，创造出'人在灯中走、灯在人中游'的沉浸式体验。自贡灯会已出口至全球八十多个国家和地区，每年在海外举办超过二百场展览，是中国文化'走出去'的成功典范。",
    textEn: "The Zigong Lantern Festival originated from Tang and Song Dynasty Lantern Festival customs, with a history of over eight hundred years. It is renowned for five characteristics — form, color, sound, light, and motion — using traditional techniques such as silk-framing, paper-mounting, and hand-painting to create colossal lantern installations, enhanced by modern lighting technology, producing an immersive experience. The festival has been exported to over eighty countries and regions worldwide, with more than two hundred overseas exhibitions annually — a successful model of Chinese culture going global.",
  },
  {
    id: "ich_04",
    title: "绵竹年画的色彩世界",
    category: "非遗",
    categoryEn: "Intangible Heritage",
    textCn: "绵竹年画是中国四大年画之一，产于四川德阳绵竹市，起源于宋代。与其他年画不同，绵竹年画先用木版印出墨线轮廓，再由画师手工填色。'一黑二白三金黄，五颜六色穿衣裳'的工序口诀传承至今。'填水脚'技法以大笔触快速上色，表现出巴蜀艺术特有的率性与豪放。",
    textEn: "Mianzhu New Year Prints are one of China's Four Great New Year Print traditions, produced in Mianzhu, Deyang, Sichuan, originating in the Song Dynasty. Unlike other New Year prints, Mianzhu prints are first block-printed with ink outlines, then hand-colored by artisans following a traditional formula. The 'tianshuijiao' technique, using broad, rapid brush strokes for coloring, expresses the distinctive spontaneity and boldness of Ba-Shu art.",
  },
  {
    id: "ich_05",
    title: "道明竹编——从日常到艺术",
    category: "非遗",
    categoryEn: "Intangible Heritage",
    textCn: "道明竹编产于成都崇州市道明镇，拥有两千多年的历史，是国家级非物质文化遗产。以本地慈竹为原料，经过刮青、剖片、启篾、染色、编织等二十多道工序，将竹篾编织成从生活用具到艺术装置的作品。2018年，建筑师刘家琨设计的'竹里'装置将道明竹编推入威尼斯建筑双年展，让世界看到了中国传统工艺的当代可能。",
    textEn: "Daoming Bamboo Weaving, produced in Daoming Town, Chongzhou, Chengdu, has a history of over two thousand years and is a National Intangible Cultural Heritage. Using local cizhu bamboo, craftspeople execute more than twenty processes — from scraping and splitting to stripping, dyeing, and weaving — to create everything from daily utensils to art installations. In 2018, architect Liu Jiakun's 'Bamboo Inside' installation brought Daoming bamboo weaving to the Venice Architecture Biennale, showing the world the contemporary potential of traditional Chinese craftsmanship.",
  },

  // ========== 蜀地风光 ==========
  {
    id: "scenery_01",
    title: "九寨沟——人间仙境的四季之美",
    category: "蜀地风光",
    categoryEn: "Sichuan Scenery",
    textCn: "九寨沟位于四川省阿坝藏族羌族自治州，1992年被列入世界自然遗产名录。沟内分布着一百一十四个高山湖泊，湖水因矿物质和藻类呈现蓝绿交错的奇幻色彩，加上叠瀑、彩林、雪峰和藏族风情，构成了'童话世界'般的自然画卷。2017年遭遇七级地震后，九寨沟展现出惊人的自然恢复能力，印证了大自然的神奇与韧性。",
    textEn: "Jiuzhaigou Valley, located in Aba Tibetan and Qiang Autonomous Prefecture, Sichuan, was inscribed as a UNESCO World Natural Heritage site in 1992. The valley contains one hundred and fourteen alpine lakes, whose mineral-and-algae-tinted waters shimmer in surreal blues and greens. Combined with cascading waterfalls, colorful forests, snow-capped peaks, and Tibetan culture, it paints a natural picture like a fairy tale world. After a magnitude seven earthquake in 2017, Jiuzhaigou demonstrated remarkable natural resilience, affirming nature's wonder and strength.",
  },
  {
    id: "scenery_02",
    title: "峨眉天下秀——佛教名山与自然奇观",
    category: "蜀地风光",
    categoryEn: "Sichuan Scenery",
    textCn: "峨眉山是中国四大佛教名山之一，是普贤菩萨的道场。海拔三千零九十九米的峨眉山，从山脚到山顶跨越四个气候带，拥有超过五千种植物，被誉为'植物王国'。金顶的云海、日出、佛光和圣灯是峨眉四大自然奇观。山间的峨眉猴群是游客最喜爱的'山民'，它们世代与僧侣和游人和谐共处。",
    textEn: "Mount Emei is one of China's Four Sacred Buddhist Mountains and the bodhimaṇḍa of Samantabhadra Bodhisattva. Rising to three thousand and ninety-nine meters, it spans four climate zones from base to summit, harboring over five thousand plant species and earning the title 'Kingdom of Plants.' The sea of clouds, sunrise, Buddha's light, and sacred lamps at the Golden Summit are the Four Natural Wonders of Emei. The Mount Emei macaques, beloved 'mountain residents,' have lived in harmony with monks and visitors for generations.",
  },
  {
    id: "scenery_03",
    title: "都江堰——千年水利的世界奇迹",
    category: "蜀地风光",
    categoryEn: "Sichuan Scenery",
    textCn: "都江堰位于成都平原西部的岷江上，由秦国蜀郡太守李冰父子于公元前256年主持修建。它是全世界年代最久、唯一留存、至今仍在使用的无坝引水水利工程。鱼嘴分水、飞沙堰溢洪、宝瓶口引水——三大部分巧妙配合，将岷江水患化为灌溉之利，使成都平原成为'天府之国'。两千年后的今天，都江堰仍然灌溉着近千万亩农田。",
    textEn: "Dujiangyan, built on the Min River in western Chengdu Plain under the direction of Li Bing and his son in 256 BCE, is the world's oldest surviving dam-free irrigation system still in use today. The Fish Mouth levee divides the water, the Flying Sand Weir spills the flood, and the Bottle-Neck Channel guides the flow — these three components work in ingenious harmony, transforming the Min River from a source of floods into a source of irrigation, making the Chengdu Plain the 'Land of Abundance.' Over two millennia later, Dujiangyan still irrigates nearly ten million mu of farmland.",
  },
  {
    id: "scenery_04",
    title: "青城天下幽——道教的发源地",
    category: "蜀地风光",
    categoryEn: "Sichuan Scenery",
    textCn: "青城山位于都江堰市西南，是中国道教的发源地之一。东汉末年，天师张道陵在此创立五斗米道，使青城山成为道教'第五洞天'。'青城天下幽'——与峨眉的'秀'、剑门的'险'、夔门的'雄'并称蜀中四绝。全山植被覆盖率超过百分之九十五，四季常青。山中的建福宫、天师洞、上清宫等道教宫观至今仍是活态的道教文化传承地。",
    textEn: "Mount Qingcheng, southwest of Dujiangyan, is one of the birthplaces of Chinese Taoism. During the late Eastern Han Dynasty, Celestial Master Zhang Daoling founded the Way of Five Pecks of Rice here, making Qingcheng the 'Fifth Grotto-Heaven' of Taoism. Known as 'the most serene mountain under heaven,' it is one of the 'Four Ultimate Landscapes of Shu.' With vegetation coverage exceeding ninety-five percent, it remains evergreen year-round. Taoist temples such as Jianfu Palace, Celestial Master Cave, and Shangqing Palace remain active centers of living Taoist tradition.",
  },

  // ========== 巴蜀民俗 ==========
  {
    id: "folk_01",
    title: "成都茶馆——一碗盖碗茶里的慢生活",
    category: "巴蜀民俗",
    categoryEn: "Ba-Shu Folk Customs",
    textCn: "成都的茶馆文化是中国最独特的市井文化之一。成都有超过一万家茶馆，居全国之冠。一碗盖碗茶、一把竹椅，成都人可以坐一下午——这不是懒散，而是一种'安逸'的生活哲学。茶馆是成都的'公共客厅'：谈生意、摆龙门阵、听评书、看川剧变脸，都在这里发生。人民公园的鹤鸣茶馆已有百年历史，至今仍是老成都生活的缩影。",
    textEn: "Chengdu's teahouse culture is one of China's most distinctive urban folk cultures. With over ten thousand teahouses — the most of any Chinese city — Chengdu offers a unique lifestyle. A bowl of covered-bowl tea and a bamboo chair can occupy a Chengdu local for an entire afternoon. This is not laziness; it is a life philosophy called 'anyi' — ease and comfort. Teahouses are Chengdu's 'public living rooms': business deals, storytelling, folk art performances, and face-changing shows all happen here. The century-old Heming Teahouse in People's Park remains a microcosm of old Chengdu life.",
  },
  {
    id: "folk_02",
    title: "彝族火把节——东方狂欢节",
    category: "巴蜀民俗",
    categoryEn: "Ba-Shu Folk Customs",
    textCn: "彝族火把节是彝族最隆重的传统节日，于每年农历六月二十四日举行，为期三天。四川凉山彝族自治州是火把节最盛大的举办地。节日期间，数万人手持火把在山间巡游，形成壮观的'火龙'，因此被称为'东方狂欢节'。火把节还包括彝族选美、斗牛、赛马、摔跤和朵洛荷传统歌舞等活动。它源于彝族古老的太阳崇拜和火崇拜，承载着驱邪避灾、祈求丰收的美好愿望。",
    textEn: "The Yi Torch Festival is the grandest traditional festival of the Yi ethnic group, held on the twenty-fourth day of the sixth lunar month, lasting three days. Liangshan Yi Autonomous Prefecture in Sichuan hosts the most spectacular celebrations. During the festival, tens of thousands of people parade through the mountains holding torches, forming a magnificent 'fire dragon' — hence its nickname, the 'Oriental Carnival.' The festival also features Yi beauty pageants, bullfighting, horse racing, wrestling, and the traditional Duoluohe song-and-dance. Rooted in the ancient Yi worship of the sun and fire, it carries wishes for warding off evil and praying for a bountiful harvest.",
  },
  {
    id: "folk_03",
    title: "成都美食——不止于麻辣",
    category: "巴蜀民俗",
    categoryEn: "Ba-Shu Folk Customs",
    textCn: "川菜是中国四大菜系之一，以'一菜一格、百菜百味'闻名于世。许多人对川菜的第一印象是'麻辣'，但真正的川菜拥有二十四种基础味型——鱼香、怪味、荔枝、椒麻、红油、家常……完全不止于辣。2011年，成都被联合国教科文组织授予'美食之都'称号，成为亚洲首个获此殊荣的城市。从街边小吃到国宴名菜，川菜的魅力在于它的多样与包容。",
    textEn: "Sichuan Cuisine is one of China's Four Great Culinary Traditions, renowned for its philosophy of 'one dish, one style; a hundred dishes, a hundred flavors.' Many people's first impression of Sichuan food is 'spicy,' but true Sichuan cuisine boasts twenty-four basic flavor profiles — fish-fragrant, strange-flavor, lychee, pepper-numbing, red oil, homestyle — far beyond just spiciness. In 2011, Chengdu was designated a UNESCO City of Gastronomy, becoming the first Asian city to receive this honor. From street snacks to state banquet dishes, the charm of Sichuan cuisine lies in its diversity and inclusiveness.",
  },
  {
    id: "folk_04",
    title: "成都的竹文化——从竹林到生活",
    category: "巴蜀民俗",
    categoryEn: "Ba-Shu Folk Customs",
    textCn: "四川是中国竹子资源最丰富的省份之一，竹文化深植于巴蜀生活的方方面面。从蜀南竹海的万顷竹林到成都街头的竹椅茶馆，从道明竹编的精美工艺品到餐桌上的竹笋佳肴——竹子是四川人的'绿色基因'。竹在中国文化中象征坚韧、虚心和高洁，这些品质也被认为塑造了四川人外柔内刚的性格。宜宾被称为'中国竹都'，竹产业已成为当地乡村振兴的重要引擎。",
    textEn: "Sichuan is one of China's most bamboo-rich provinces, and bamboo culture is deeply woven into every aspect of Ba-Shu life. From the vast bamboo forests of Shunan Bamboo Sea to the bamboo chairs in Chengdu's teahouses, from the exquisite Daoming bamboo weavings to bamboo shoots on the dining table — bamboo is the 'green DNA' of Sichuan people. In Chinese culture, bamboo symbolizes resilience, humility, and integrity, qualities believed to have shaped the Sichuan character — gentle on the outside, strong on the inside. Yibin, known as 'China's Bamboo Capital,' has made the bamboo industry a vital engine for rural revitalization.",
  },
]
