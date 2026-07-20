const SPEECH_SCRIPTS = [
  {
    id: 'sichuan_opera_01',
    title: '川剧变脸的艺术魅力',
    category: '川剧',
    categoryEn: 'Sichuan Opera',
    textCn: '川剧变脸是四川最具标志性的表演艺术。演员在瞬间变换脸谱，用色彩和节奏表现人物情绪的急剧转折。它不是简单的技巧展示，而是服务于剧情、人物和舞台表达的传统艺术。',
    textEn: 'Sichuan Opera face-changing is one of Sichuan’s most iconic performing arts. Performers change masks in an instant to express dramatic emotional shifts. It is not merely a trick, but a refined stage language serving the story and the character.'
  },
  {
    id: 'sichuan_opera_02',
    title: '川剧的历史与传统',
    category: '川剧',
    categoryEn: 'Sichuan Opera',
    textCn: '川剧形成于明末清初，融合昆腔、高腔、胡琴、弹戏和灯调等声腔艺术。它以唱念做打、幽默机智和浓郁地方风格著称，是巴蜀文化的重要代表。',
    textEn: 'Sichuan Opera took shape in the late Ming and early Qing dynasties. It integrates several vocal traditions and is known for expressive singing, witty dialogue, vivid acting, and a strong regional character.'
  },
  {
    id: 'ich_01',
    title: '蜀绣——指尖上的千年技艺',
    category: '非遗',
    categoryEn: 'Intangible Heritage',
    textCn: '蜀绣是中国四大名绣之一，历史可追溯至汉代。它以软缎和彩丝为主要材料，针法细密、色彩温润，既是生活工艺，也是精美的艺术创造。',
    textEn: 'Shu Embroidery is one of China’s four famous embroidery traditions. With soft satin, colored silk, and delicate stitches, it combines practical craftsmanship with refined artistic beauty.'
  },
  {
    id: 'ich_02',
    title: '成都漆艺——三千年的大漆之道',
    category: '非遗',
    categoryEn: 'Intangible Heritage',
    textCn: '成都漆艺历史悠久，金沙遗址出土的漆器残片证明其传统已延续三千多年。雕花填彩、金银平脱等技法展现了成都手工艺的精致与耐心。',
    textEn: 'Chengdu lacquer art has a history of more than three thousand years. Techniques such as carved pattern inlay and gold-silver decoration reveal the patience and refinement of Chengdu craftsmanship.'
  },
  {
    id: 'ich_03',
    title: '自贡灯会——光与影的千年传奇',
    category: '非遗',
    categoryEn: 'Intangible Heritage',
    textCn: '自贡灯会源于传统元宵灯俗，以形、色、声、光、动见长。巨型灯组结合传统扎制和现代光电技术，让观众在光影之中感受中国节庆文化。',
    textEn: 'The Zigong Lantern Festival grows from traditional Lantern Festival customs. It combines form, color, sound, light, and movement, turning festive culture into an immersive visual experience.'
  },
  {
    id: 'ich_04',
    title: '绵竹年画的色彩世界',
    category: '非遗',
    categoryEn: 'Intangible Heritage',
    textCn: '绵竹年画是中国重要的年画传统之一，先以木版印出墨线，再由画师手工填色。它色彩明快、线条有力，寄托着人们辞旧迎新的美好愿望。',
    textEn: 'Mianzhu New Year Prints are first block-printed with ink outlines and then hand-colored. Their bright colors and bold lines carry people’s hopes for renewal and good fortune.'
  },
  {
    id: 'ich_05',
    title: '道明竹编——从日常到艺术',
    category: '非遗',
    categoryEn: 'Intangible Heritage',
    textCn: '道明竹编产于成都崇州，以本地慈竹为原料，经过剖片、启篾、染色和编织等多道工序，把日常器具转化为富有当代气息的手工艺术。',
    textEn: 'Daoming bamboo weaving from Chengdu transforms local bamboo into daily objects and contemporary artworks through splitting, dyeing, and weaving, showing the modern vitality of traditional craft.'
  },
  {
    id: 'scenery_01',
    title: '九寨沟——人间仙境的四季之美',
    category: '蜀地风光',
    categoryEn: 'Sichuan Scenery',
    textCn: '九寨沟以高山湖泊、彩林、瀑布和雪峰闻名。湖水因矿物质和藻类呈现蓝绿交织的色彩，四季景观各不相同，像一幅流动的自然画卷。',
    textEn: 'Jiuzhaigou is famous for alpine lakes, colorful forests, waterfalls, and snow peaks. Its blue and green waters create a natural picture that changes beautifully through the seasons.'
  },
  {
    id: 'scenery_02',
    title: '峨眉天下秀——佛教名山与自然奇观',
    category: '蜀地风光',
    categoryEn: 'Sichuan Scenery',
    textCn: '峨眉山是中国佛教名山，也是自然生态宝库。金顶云海、日出和佛光令人神往，山林、寺院和古道共同构成了独特的人文景观。',
    textEn: 'Mount Emei is a sacred Buddhist mountain and a rich ecological treasure. Its sea of clouds, sunrise, and cultural paths create a landscape where nature and spirituality meet.'
  },
  {
    id: 'scenery_03',
    title: '都江堰——千年水利的世界奇迹',
    category: '蜀地风光',
    categoryEn: 'Sichuan Scenery',
    textCn: '都江堰由李冰父子主持修建，是至今仍在使用的无坝引水工程。鱼嘴、飞沙堰和宝瓶口相互配合，让成都平原成为天府之国。',
    textEn: 'Dujiangyan is an ancient dam-free irrigation system that still works today. Its three key parts guide and divide the Min River, helping make the Chengdu Plain the Land of Abundance.'
  },
  {
    id: 'scenery_04',
    title: '青城天下幽——道教的发源地',
    category: '蜀地风光',
    categoryEn: 'Sichuan Scenery',
    textCn: '青城山以幽静著称，是中国道教的重要发源地之一。山中林木常青，宫观掩映，展现出巴蜀山水中清雅、含蓄的一面。',
    textEn: 'Mount Qingcheng is known for its quiet beauty and Taoist heritage. Evergreen forests and ancient temples reveal the elegant and restrained side of the Ba-Shu landscape.'
  },
  {
    id: 'folk_01',
    title: '成都茶馆——一碗盖碗茶里的慢生活',
    category: '巴蜀民俗',
    categoryEn: 'Ba-Shu Folk Customs',
    textCn: '成都茶馆是城市生活的公共客厅。一碗盖碗茶、一把竹椅，承载着摆龙门阵、听评书、看表演和休闲社交的日常传统。',
    textEn: 'Chengdu teahouses are public living rooms of the city. A bowl of covered-bowl tea and a bamboo chair carry everyday traditions of conversation, storytelling, performance, and leisure.'
  },
  {
    id: 'folk_02',
    title: '彝族火把节——东方狂欢节',
    category: '巴蜀民俗',
    categoryEn: 'Ba-Shu Folk Customs',
    textCn: '彝族火把节是凉山地区重要的传统节日。人们点燃火把、载歌载舞，表达驱邪避灾、祈求丰收和团结欢庆的美好愿望。',
    textEn: 'The Yi Torch Festival is a major traditional celebration in Liangshan. People light torches, sing, and dance to express wishes for protection, harvest, unity, and joy.'
  },
  {
    id: 'folk_03',
    title: '成都美食——不止于麻辣',
    category: '巴蜀民俗',
    categoryEn: 'Ba-Shu Folk Customs',
    textCn: '川菜以一菜一格、百菜百味著称。麻辣只是其中一面，鱼香、怪味、家常、红油等丰富味型展现了成都美食的包容与创造力。',
    textEn: 'Sichuan cuisine is known for one dish, one style, and a hundred dishes, a hundred flavors. Beyond spiciness, its many flavor profiles show Chengdu’s creativity and openness.'
  },
  {
    id: 'folk_04',
    title: '成都的竹文化——从竹林到生活',
    category: '巴蜀民俗',
    categoryEn: 'Ba-Shu Folk Customs',
    textCn: '四川竹资源丰富，竹文化渗透在茶馆、饮食、建筑和手工艺中。竹子象征坚韧、虚心和清雅，也塑造了巴蜀生活的绿色气质。',
    textEn: 'Bamboo culture appears in Sichuan teahouses, food, architecture, and crafts. Bamboo symbolizes resilience, humility, and elegance, shaping the green spirit of Ba-Shu life.'
  }
]

function getScriptById(id) {
  return SPEECH_SCRIPTS.find((item) => item.id === id)
}

function getGroupedScripts() {
  const groups = []
  SPEECH_SCRIPTS.forEach((script) => {
    let group = groups.find((item) => item.category === script.category)
    if (!group) {
      group = {
        category: script.category,
        categoryEn: script.categoryEn,
        scripts: []
      }
      groups.push(group)
    }
    group.scripts.push(script)
  })
  return groups
}

module.exports = {
  SPEECH_SCRIPTS,
  getScriptById,
  getGroupedScripts
}
