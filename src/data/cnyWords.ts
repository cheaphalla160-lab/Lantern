import { CNYWord } from '../types';

export const CNY_WORDS: CNYWord[] = [
  {
    id: 'dumplings',
    word: 'Dumplings',
    phonetic: '/ˈdʌmplɪŋz/',
    chinese: '饺子',
    pinyin: 'jiǎo zi',
    culturalSymbol: 'Wealth & Prosperity (招财进宝)',
    culturalDescription: 'Shaped like ancient golden ingots (元宝), eating dumplings brings wealth and good fortune in the new year.',
    exampleSentence: 'We make and eat delicious dumplings together on New Year\'s Eve.',
    sentenceChinese: '我们在除夕夜一起包饺子、吃饺子。',
    image: '/src/assets/images/cny_dumpling_item_1793199316490.jpg',
    color: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      accent: 'text-amber-700',
      light: '#FEF3C7',
    },
    aliases: ['dumplings', 'dumpling', 'jiaozi', 'chinese dumpling', 'dumpling soup']
  },
  {
    id: 'fish',
    word: 'Fish',
    phonetic: '/fɪʃ/',
    chinese: '鱼 (年年有余)',
    pinyin: 'yú',
    culturalSymbol: 'Surplus & Abundance (年年有余)',
    culturalDescription: 'In Chinese, "fish" (yú) sounds like "surplus" (余). Having fish means having more than enough wealth and joy every year.',
    exampleSentence: 'Eating fish at the reunion dinner means surplus every year!',
    sentenceChinese: '团圆饭吃鱼，寓意年年有余、富足安康！',
    color: {
      bg: 'bg-sky-100',
      border: 'border-sky-300',
      accent: 'text-sky-700',
      light: '#E0F2FE',
    },
    aliases: ['fish', 'fishes', 'yu']
  },
  {
    id: 'tangyuan',
    word: 'Tangyuan / sweet rice balls',
    phonetic: '/ˌtɑːŋˈjuːæn/ - /swiːt raɪs bɔːlz/',
    chinese: '汤圆 / 元宵',
    pinyin: 'tāng yuán',
    culturalSymbol: 'Family Reunion (团团圆圆)',
    culturalDescription: 'Round sweet rice balls symbolize complete family togetherness, harmony, and a sweet, blissful life.',
    exampleSentence: 'Tangyuan are sweet, chewy, and mean our family stays together in happiness.',
    sentenceChinese: '汤圆甜糯可口，象征一家人和美团圆。',
    image: '/src/assets/images/cny_tangyuan_item_1793199316430.jpg',
    color: {
      bg: 'bg-rose-100',
      border: 'border-rose-300',
      accent: 'text-rose-700',
      light: '#FFE4E6',
    },
    aliases: ['tangyuan', 'tang yuan', 'sweet rice balls', 'sweet rice ball', 'rice balls', 'rice ball']
  },
  {
    id: 'longevity_noodles',
    word: 'Longevity noodles',
    phonetic: '/lɒnˈdʒevəti ˈnuːdlz/',
    chinese: '长寿面',
    pinyin: 'cháng shòu miàn',
    culturalSymbol: 'Long & Healthy Life (长命百岁)',
    culturalDescription: 'Long, continuous strands of noodles symbolize wishes for good health, peace, and longevity.',
    exampleSentence: 'Don\'t cut the longevity noodles! Eat the long strands for a long and healthy life.',
    sentenceChinese: '长寿面不要咬断，长长的面条寓意健康长寿！',
    color: {
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      accent: 'text-orange-700',
      light: '#FFEDD5',
    },
    aliases: ['longevity noodles', 'longevity noodle', 'long noodles', 'noodles', 'noodle']
  },
  {
    id: 'lucky_money',
    word: 'Lucky money',
    phonetic: '/ˈlʌki ˈmʌni/',
    chinese: '压岁钱 (红包)',
    pinyin: 'yà suì qián',
    culturalSymbol: 'Protection & Good Luck (平安吉祥)',
    culturalDescription: 'Grandparents and parents give children lucky money in red envelopes (Hongbao) to ward off bad luck and grant peaceful growth.',
    exampleSentence: 'Grandma gave me red envelopes with lucky money inside for good wishes!',
    sentenceChinese: '奶奶送给我装有压岁钱的红包，祝福新的一年健康平安！',
    color: {
      bg: 'bg-red-100',
      border: 'border-red-300',
      accent: 'text-red-700',
      light: '#FEE2E2',
    },
    aliases: ['lucky money', 'red envelope', 'red packet', 'hongbao', 'money', 'lucky']
  },
  {
    id: 'red_lanterns',
    word: 'Red lanterns',
    phonetic: '/red ˈlæntərnz/',
    chinese: '红灯笼',
    pinyin: 'hóng dēng lóng',
    culturalSymbol: 'Joy & Bright Future (红红火火)',
    culturalDescription: 'Bright red lanterns are hung outside homes and schools to illuminate hope, chase shadows away, and create a jubilant festival mood.',
    exampleSentence: 'We hang beautiful red lanterns on the tree to celebrate the Spring Festival.',
    sentenceChinese: '我们在树上挂上漂亮的红灯笼，庆祝喜庆的新春佳节。',
    color: {
      bg: 'bg-red-100',
      border: 'border-red-300',
      accent: 'text-red-600',
      light: '#FEE2E2',
    },
    aliases: ['red lanterns', 'red lantern', 'lanterns', 'lantern', 'denglong']
  },
  {
    id: 'fireworks',
    word: 'Fireworks',
    phonetic: '/ˈfaɪəwɜːks/',
    chinese: '烟花',
    pinyin: 'yān huā',
    culturalSymbol: 'Welcoming the Spring (辞旧迎新)',
    culturalDescription: 'Bursting fireworks and firecrackers illuminate the midnight sky to scare away the monster Nian and ring in the vibrant new year.',
    exampleSentence: 'Sparkling fireworks burst in the midnight sky with golden sparks and loud cheers.',
    sentenceChinese: '午夜天空中绽放璀璨的烟花，金光闪闪，欢呼阵阵。',
    image: '/src/assets/images/cny_fireworks_item_1793199316656.jpg',
    color: {
      bg: 'bg-purple-100',
      border: 'border-purple-300',
      accent: 'text-purple-700',
      light: '#F3E8FF',
    },
    aliases: ['fireworks', 'firework', 'fire cracker', 'firecrackers', 'yanhua']
  }
];

export const CNY_CHANT = [
  { lineEn: 'Dumplings, dumplings, eat for wealth! 🥟', lineZh: '饺子饺子招财宝，金元宝来财源高！' },
  { lineEn: 'Fish, fish, brings good health! 🐟', lineZh: '鱼儿鱼儿年年有，年年有余乐悠悠！' },
  { lineEn: 'Tangyuan, sweet and round to eat! 🥣', lineZh: '汤圆甜糯圆又圆，团团圆圆福满园！' },
  { lineEn: 'Longevity noodles, a tasty treat! 🍜', lineZh: '长寿面长丝丝连，健康长寿祝百年！' },
  { lineEn: 'Lucky money in red so bright! 🧧', lineZh: '压岁红包红彤彤，平安吉祥长相伴！' },
  { lineEn: 'Red lanterns shining through the night! 🏮', lineZh: '大红灯笼高高挂，红红火火迎新春！' },
  { lineEn: 'Fireworks boom across the sky! 🎆', lineZh: '噼啪烟花冲上天，欢天喜地过大年！' }
];
