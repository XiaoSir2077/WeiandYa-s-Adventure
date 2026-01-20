
import { Question, Card, LevelConfig } from './types';

export const PASS_SCORE = 3; 
export const MAX_PLAYER_HEALTH = 5; 
export const MAX_ENERGY = 10; 
export const MAX_ARMOR = 5; // Max Armor Cap
export const HERO_SKILL_COOLDOWN = 20; // 20 Seconds CD

// Battle Constants
export const BASIC_ATTACK_DAMAGE = 2; 
export const STUN_DURATION = 1500; 
export const LEVEL_TIME_LIMIT = 180; 
export const MONSTER_RAGE_PER_MISTAKE = 50; 

// --- ASSETS REGISTRY ---
export const ASSETS = {
  BG_MAIN: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/%E4%B8%BB%E7%95%8C%E9%9D%A2.png",
  BG_VICTORY: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/%E8%83%9C%E5%88%A9%E9%A1%B5%E9%9D%A2.png",
  BG_GAME_OVER: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/%E5%A4%B1%E8%B4%A5%E9%A1%B5%E9%9D%A2.png",
  
  ROLE_XIAOWEI: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/%E5%B0%8F%E5%A8%81.png",
  ROLE_XIAOYA: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/wagames%E5%B0%8F%E8%8A%BD.png",
  
  BOSS_DRAGON: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/wagames%E9%AD%94%E9%BE%99Boss.png",
  
  BGM_MENU: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/wagames%E7%AB%A5%E8%AF%9D%E6%A3%AE%E6%9E%97%E7%9A%84%E6%97%A9%E6%99%A8%EF%BC%88%E6%97%A0%E6%95%8C%E5%96%9C%E6%AC%A2%EF%BC%89.mp3",
  BGM_BATTLE: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/wagames%E5%8B%87%E6%B0%94%E5%A4%A7%E5%86%92%E9%99%A9%C2%B7%E6%88%98%E6%96%97BGM.mp3"
};

// --- Level Configurations ---
export const LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    name: "迷雾森林",
    bossName: "果冻史莱姆",
    bossIcon: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/wagames%E5%8F%B2%E8%8E%B1%E5%A7%86.png", 
    bossHealth: 40, 
    bgGradient: "from-green-300 to-emerald-600",
    bgImage: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/%E8%BF%B7%E9%9B%BE%E6%A3%AE%E6%9E%97.png",
    themeColor: "text-emerald-700",
    element: 'nature',
    monsterAttackInterval: 0 
  },
  {
    levelNumber: 2,
    name: "熔岩火山",
    bossName: "火焰石头人",
    bossIcon: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/wagames%E7%9F%B3%E5%B7%A8%E4%BA%BA.png", 
    bossHealth: 80, 
    bgGradient: "from-orange-300 to-red-700",
    bgImage: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/%E7%82%8E%E7%83%AD%E7%81%AB%E5%B1%B1.png",
    themeColor: "text-orange-800",
    element: 'fire',
    monsterAttackInterval: 0
  },
  {
    levelNumber: 3,
    name: "魔王城堡",
    bossName: "暗夜魔龙",
    bossIcon: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/wagames%E9%AD%94%E9%BE%99Boss.png", 
    bossHealth: 150,
    bgGradient: "from-indigo-400 to-purple-900",
    bgImage: "https://raw.githubusercontent.com/XiaoSir2077/my-base/main/images/%E9%AD%94%E7%8E%8B%E5%9F%8E.png",
    themeColor: "text-purple-900",
    element: 'dark',
    monsterAttackInterval: 0
  }
];

export const TOTAL_QUESTIONS = 60; 

// Questions remain the same...
export const QUESTIONS: Question[] = [
  // --- 语文古诗 (1-20) ---
  { id: 1, category: "古诗", text: "《山行》：停车坐爱枫林晚，______。", options: ["霜叶红于二月花", "欲穷千里目", "两个黄鹂鸣翠柳", "一行白鹭上青天"], correctAnswer: "霜叶红于二月花", knowledgePoint: "山行" },
  { id: 2, category: "古诗", text: "《静夜思》：床前明月光，______。", options: ["举头望明月", "月落乌啼霜满天", "低头思故乡", "疑是地上霜"], correctAnswer: "疑是地上霜", knowledgePoint: "静夜思" },
  { id: 3, category: "古诗", text: "《春晓》：夜来风雨声，______。", options: ["花落知多少", "春风又绿江南岸", "月落乌啼霜满天", "两个黄鹂鸣翠柳"], correctAnswer: "花落知多少", knowledgePoint: "春晓" },
  { id: 4, category: "古诗", text: "《望庐山瀑布》：飞流直下三千尺，______。", options: ["轻舟已过万重山", "月落乌啼霜满天", "疑是银河落九天", "两岸猿声啼不住"], correctAnswer: "疑是银河落九天", knowledgePoint: "望庐山瀑布" },
  { id: 5, category: "古诗", text: "《村居》：儿童散学归来早，______。", options: ["忙趁东风放纸鸢", "一行白鹭上青天", "春风又绿江南岸", "野旷天低树"], correctAnswer: "忙趁东风放纸鸢", knowledgePoint: "村居" },
  { id: 6, category: "古诗", text: "《赠汪伦》：桃花潭水深千尺，______。", options: ["举头望明月", "不及汪伦送我情", "春风又绿江南岸", "月落乌啼霜满天"], correctAnswer: "不及汪伦送我情", knowledgePoint: "赠汪伦" },
  { id: 7, category: "古诗", text: "《江雪》：孤舟蓑笠翁，______。", options: ["月落乌啼霜满天", "独钓寒江雪", "两个黄鹂鸣翠柳", "春风又绿江南岸"], correctAnswer: "独钓寒江雪", knowledgePoint: "江雪" },
  { id: 8, category: "古诗", text: "《望天门山》：两岸青山相对出，______。", options: ["欲穷千里目", "月落乌啼霜满天", "孤帆一片日边来", "春风又绿江南岸"], correctAnswer: "孤帆一片日边来", knowledgePoint: "望天门山" },
  { id: 9, category: "古诗", text: "《游园不值》：春色满园关不住，______。", options: ["一枝红杏出墙来", "两个黄鹂鸣翠柳", "明月何时照我还", "一行白鹭上青天"], correctAnswer: "一枝红杏出墙来", knowledgePoint: "游园不值" },
  { id: 10, category: "古诗", text: "《题西林壁》：不识庐山真面目，______。", options: ["只缘身在此山中", "一水护田将绿绕", "两山排闼送青来", "两岸青山相对出"], correctAnswer: "只缘身在此山中", knowledgePoint: "题西林壁" },
  { id: 11, category: "古诗", text: "《泊船瓜洲》：春风又绿江南岸，______。", options: ["明月何时照我还", "月落乌啼霜满天", "野旷天低树", "欲穷千里目"], correctAnswer: "明月何时照我还", knowledgePoint: "泊船瓜洲" },
  { id: 12, category: "古诗", text: "《小儿垂钓》：路人借问遥招手，______。", options: ["春眠不觉晓", "花落知多少", "举头望明月", "怕得鱼惊不应人"], correctAnswer: "怕得鱼惊不应人", knowledgePoint: "小儿垂钓" },
  { id: 13, category: "古诗", text: "《望洞庭》：遥望洞庭山水翠，______。", options: ["春风又绿江南岸", "白银盘里一青螺", "月落乌啼霜满天", "两个黄鹂鸣翠柳"], correctAnswer: "白银盘里一青螺", knowledgePoint: "望洞庭" },
  { id: 14, category: "古诗", text: "《早发白帝城》：两岸猿声啼不住，______。", options: ["轻舟已过万重山", "月落乌啼霜满天", "春风又绿江南岸", "欲穷千里目"], correctAnswer: "轻舟已过万重山", knowledgePoint: "早发白帝城" },
  { id: 15, category: "古诗", text: "《竹里馆》：深林人不知，______。", options: ["举头望明月", "明月来相照", "低头思故乡", "春风又绿江南岸"], correctAnswer: "明月来相照", knowledgePoint: "竹里馆" },
  { id: 16, category: "古诗", text: "《出塞》：但使龙城飞将在，______。", options: ["不教胡马度阴山", "月落乌啼霜满天", "春风又绿江南岸", "欲穷千里目"], correctAnswer: "不教胡马度阴山", knowledgePoint: "出塞" },
  { id: 17, category: "古诗", text: "《望月怀远》：情人怨遥夜，______。", options: ["举头望明月", "竟夕起相思", "低头思故乡", "春风又绿江南岸"], correctAnswer: "竟夕起相思", knowledgePoint: "望月怀远" },
  { id: 18, category: "古诗", text: "《宿新市徐公店》：儿童急走追黄蝶，______。", options: ["飞入菜花无处寻", "一行白鹭上青天", "春风又绿江南岸", "明月何时照我还"], correctAnswer: "飞入菜花无处寻", knowledgePoint: "宿新市徐公店" },
  { id: 19, category: "古诗", text: "《绝句》：窗含西岭千秋雪，______。", options: ["门泊东吴万里船", "月落乌啼霜满天", "春风又绿江南岸", "欲穷千里目"], correctAnswer: "门泊东吴万里船", knowledgePoint: "绝句" },
  { id: 20, category: "古诗", text: "《所见》：意欲捕鸣蝉，______。", options: ["举头望明月", "低头思故乡", "忽然闭口立", "春风又绿江南岸"], correctAnswer: "忽然闭口立", knowledgePoint: "所见" },

  // --- 数学 (21-40) ---
  { id: 21, category: "数学", text: "48 ÷ 8 = ？", options: ["5", "7", "6", "8"], correctAnswer: "6", knowledgePoint: "表内除法" },
  { id: 22, category: "数学", text: "一个长方形长 10cm，宽 6cm，周长是多少？", options: ["32cm", "20cm", "16cm", "60cm"], correctAnswer: "32cm", knowledgePoint: "图形周长" },
  { id: 23, category: "数学", text: "3.8 + 2.5 = ？", options: ["5.3", "6.3", "4.3", "6.2"], correctAnswer: "6.3", knowledgePoint: "小数加法" },
  { id: 24, category: "数学", text: "120 ÷ (3 × 4) = ？", options: ["10", "5", "15", "20"], correctAnswer: "10", knowledgePoint: "混合运算" },
  { id: 25, category: "数学", text: "1 小时 = ？分钟", options: ["30", "60", "90", "120"], correctAnswer: "60", knowledgePoint: "时间换算" },
  { id: 26, category: "数学", text: "25 × 4 = ？", options: ["50", "100", "75", "200"], correctAnswer: "100", knowledgePoint: "乘法口算" },
  { id: 27, category: "数学", text: "一个正方形边长是 5cm，面积是多少？", options: ["20cm²", "25cm²", "15cm²", "10cm²"], correctAnswer: "25cm²", knowledgePoint: "面积计算" },
  { id: 28, category: "数学", text: "15 × 3 + 5 = ？", options: ["50", "55", "45", "52"], correctAnswer: "50", knowledgePoint: "混合运算" },
  { id: 29, category: "数学", text: "1000 克 = ？千克", options: ["1", "10", "100", "0.1"], correctAnswer: "1", knowledgePoint: "重量单位" },
  { id: 30, category: "数学", text: "45 - 18 = ？", options: ["27", "37", "28", "32"], correctAnswer: "27", knowledgePoint: "两位数减法" },
  { id: 31, category: "数学", text: "一辆车每小时行驶 50 千米，2 小时行驶多少千米？", options: ["100", "150", "50", "200"], correctAnswer: "100", knowledgePoint: "行程问题" },
  { id: 32, category: "数学", text: "3/4 + 1/4 = ？", options: ["1/2", "1", "3/4", "1/4"], correctAnswer: "1", knowledgePoint: "分数加法" },
  { id: 33, category: "数学", text: "一个三角形底是 8cm，高是 5cm，面积是多少？", options: ["20cm²", "40cm²", "13cm²", "30cm²"], correctAnswer: "20cm²", knowledgePoint: "三角形面积" },
  { id: 34, category: "数学", text: "2 小时 30 分钟 = ？分钟", options: ["120", "150", "90", "180"], correctAnswer: "150", knowledgePoint: "时间计算" },
  { id: 35, category: "数学", text: "24 × 5 = ？", options: ["100", "120", "110", "90"], correctAnswer: "120", knowledgePoint: "两位数乘法" },
  { id: 36, category: "数学", text: "1 米 50 厘米 = ？厘米", options: ["150", "105", "50", "200"], correctAnswer: "150", knowledgePoint: "长度单位" },
  { id: 37, category: "数学", text: "36 ÷ (6 - 3) = ？", options: ["12", "6", "18", "9"], correctAnswer: "12", knowledgePoint: "带括号运算" },
  { id: 38, category: "数学", text: "一个长方体长 4cm，宽 3cm，高 2cm，体积是多少？", options: ["24cm³", "12cm³", "36cm³", "18cm³"], correctAnswer: "24cm³", knowledgePoint: "体积计算" },
  { id: 39, category: "数学", text: "7 × 8 - 20 = ？", options: ["36", "32", "44", "28"], correctAnswer: "36", knowledgePoint: "混合运算" },
  { id: 40, category: "数学", text: "200 ÷ 5 = ？", options: ["40", "50", "30", "60"], correctAnswer: "40", knowledgePoint: "除法口算" },

  // --- 英语 (41-60) ---
  { id: 41, category: "英语", text: "What color is the banana?", options: ["Red", "Blue", "Yellow", "Green"], correctAnswer: "Yellow", knowledgePoint: "颜色" },
  { id: 42, category: "英语", text: "—Nice to meet you! —______", options: ["Nice to meet you, too!", "Goodbye!", "Thank you!", "I'm fine."], correctAnswer: "Nice to meet you, too!", knowledgePoint: "日常问候" },
  { id: 43, category: "英语", text: "There ______ a book on the desk.", options: ["am", "is", "are", "be"], correctAnswer: "is", knowledgePoint: "There be句型" },
  { id: 44, category: "英语", text: "My father is a ______. He works in a hospital.", options: ["teacher", "farmer", "driver", "doctor"], correctAnswer: "doctor", knowledgePoint: "职业词汇" },
  { id: 45, category: "英语", text: "How many ______ do you have?", options: ["pen", "pencil", "books", "ruler"], correctAnswer: "books", knowledgePoint: "复数形式" },
  { id: 46, category: "英语", text: "—______ is your bag? —It's on the chair.", options: ["What", "Where", "Who", "How"], correctAnswer: "Where", knowledgePoint: "特殊疑问句" },
  { id: 47, category: "英语", text: "I ______ a new schoolbag. It's pink.", options: ["have", "has", "am", "is"], correctAnswer: "have", knowledgePoint: "Have用法" },
  { id: 48, category: "英语", text: "She ______ to school by bike every day.", options: ["go", "going", "goes", "went"], correctAnswer: "goes", knowledgePoint: "第三人称单数" },
  { id: 49, category: "英语", text: "—Would you like some milk? —______", options: ["Yes, I do.", "No, I don't.", "Yes, please.", "No, thank you."], correctAnswer: "No, thank you.", knowledgePoint: "情景交际" },
  { id: 50, category: "英语", text: "This is ______ apple. It's ______ red apple.", options: ["a; a", "an; an", "an; a", "a; an"], correctAnswer: "an; a", knowledgePoint: "冠词用法" },
  { id: 51, category: "英语", text: "My favorite subject is ______. I like to read stories.", options: ["math", "Chinese", "PE", "music"], correctAnswer: "Chinese", knowledgePoint: "科目词汇" },
  { id: 52, category: "英语", text: "—What time is it? (3:00) —It's ______ o'clock.", options: ["ten", "five", "seven", "three"], correctAnswer: "three", knowledgePoint: "时间表达" },
  { id: 53, category: "英语", text: "We often play football ______ the playground.", options: ["in", "on", "at", "under"], correctAnswer: "on", knowledgePoint: "介词搭配" },
  { id: 54, category: "英语", text: "The cat is ______ than the dog.", options: ["small", "smaller", "big", "bigger"], correctAnswer: "bigger", knowledgePoint: "比较级" },
  { id: 55, category: "英语", text: "I ______ TV last night.", options: ["watch", "watches", "watched", "watching"], correctAnswer: "watched", knowledgePoint: "一般过去时" },
  { id: 56, category: "英语", text: "—______ pen is this? —It's Tom's.", options: ["Whose", "What", "Which", "Who"], correctAnswer: "Whose", knowledgePoint: "疑问代词" },
  { id: 57, category: "英语", text: "There are ______ months in a year.", options: ["ten", "eleven", "twelve", "thirteen"], correctAnswer: "twelve", knowledgePoint: "数字与时间" },
  { id: 58, category: "英语", text: "She can ______ English songs very well.", options: ["sing", "sings", "singing", "sang"], correctAnswer: "sing", knowledgePoint: "情态动词" },
  { id: 59, category: "英语", text: "The Spring Festival is a traditional ______ festival.", options: ["American", "Chinese", "English", "Australian"], correctAnswer: "Chinese", knowledgePoint: "文化常识" },
  { id: 60, category: "英语", text: "I will ______ my grandparents next weekend.", options: ["visit", "visits", "visited", "visiting"], correctAnswer: "visit", knowledgePoint: "一般将来时" },
];

export const CARDS: Card[] = [
  // --- XIAOWEI (WARRIOR) CARDS ---
  {
    id: 'sword',
    name: '勇者之剑',
    description: '基础物理攻击',
    value: 6, 
    cost: 2, 
    effectType: 'damage',
    rarity: 'common',
    icon: '⚔️',
    color: 'from-blue-400 to-blue-600',
    animationClass: 'animate-shake',
    element: 'physical',
    allowedRoles: ['xiaowei']
  },
  {
    id: 'shield',
    name: '圣光护盾',
    description: '获得3点护甲',
    value: 3, 
    cost: 3,
    effectType: 'defense', 
    rarity: 'rare',
    icon: '🛡️',
    color: 'from-yellow-200 to-amber-400',
    animationClass: 'animate-pulse',
    element: 'light',
    allowedRoles: ['xiaowei', 'xiaoya']
  },
  {
    id: 'fireball',
    name: '爆裂火球',
    description: '燃烧吧！',
    value: 10, 
    cost: 3, 
    effectType: 'damage',
    rarity: 'rare',
    icon: '🔥',
    color: 'from-orange-400 to-red-600',
    animationClass: 'animate-pop',
    element: 'fire',
    allowedRoles: ['xiaowei']
  },
  {
    id: 'hammer',
    name: '泰坦重锤',
    description: '物理重击',
    value: 12, 
    cost: 4,
    effectType: 'damage',
    rarity: 'rare',
    icon: '🔨',
    color: 'from-amber-200 to-orange-500',
    animationClass: 'animate-bounce',
    element: 'physical',
    allowedRoles: ['xiaowei']
  },
  {
    id: 'dragon',
    name: '终极龙息',
    description: '龙族之火',
    value: 20, 
    cost: 6, 
    effectType: 'damage',
    rarity: 'legendary',
    icon: '🐲',
    color: 'from-fuchsia-500 to-rose-600',
    animationClass: 'animate-pulse',
    element: 'fire',
    allowedRoles: ['xiaowei']
  },
  
  // --- XIAOYA (MAGE) CARDS ---
  {
    id: 'water',
    name: '冰霜冲击',
    description: '冻结敌人',
    value: 6,
    cost: 2,
    effectType: 'damage',
    rarity: 'common',
    icon: '❄️',
    color: 'from-cyan-300 to-blue-400',
    animationClass: 'animate-pulse',
    element: 'water',
    allowedRoles: ['xiaoya']
  },
  {
    id: 'wind',
    name: '狂风龙卷',
    description: '自然之风',
    value: 6,
    cost: 2,
    effectType: 'damage',
    rarity: 'common',
    icon: '🌪️',
    color: 'from-teal-200 to-cyan-500',
    animationClass: 'animate-spin',
    element: 'nature',
    allowedRoles: ['xiaoya']
  },
  {
    id: 'potion_l',
    name: '大回复术',
    description: '恢复2颗爱心！',
    value: 2,
    cost: 5, 
    effectType: 'heal',
    rarity: 'rare',
    icon: '💖',
    color: 'from-pink-400 to-rose-600',
    animationClass: 'animate-pulse',
    element: 'heal',
    allowedRoles: ['xiaoya']
  },
  {
    id: 'thunder',
    name: '雷霆万钧',
    description: '强力电击',
    value: 15, 
    cost: 5, 
    effectType: 'damage',
    rarity: 'legendary',
    icon: '⚡',
    color: 'from-yellow-300 to-purple-600',
    animationClass: 'animate-ping',
    element: 'light',
    allowedRoles: ['xiaoya']
  },
  {
    id: 'tsunami',
    name: '海啸冲击',
    description: '巨大的水浪',
    value: 16,
    cost: 5,
    effectType: 'damage',
    rarity: 'legendary',
    icon: '🌊',
    color: 'from-blue-500 to-cyan-600',
    animationClass: 'animate-shake',
    element: 'water',
    allowedRoles: ['xiaoya']
  },
  {
    id: 'blackhole',
    name: '暗黑物质',
    description: '神秘的宇宙力量',
    value: 12,
    cost: 4,
    effectType: 'damage',
    rarity: 'rare',
    icon: '⚫',
    color: 'from-gray-700 to-black',
    animationClass: 'animate-pulse',
    element: 'dark',
    allowedRoles: ['xiaoya']
  },

  // --- SHARED / COMMON ---
  {
    id: 'potion_s',
    name: '小红药水',
    description: '恢复1颗爱心',
    value: 1,
    cost: 3, 
    effectType: 'heal',
    rarity: 'common',
    icon: '❤️',
    color: 'from-pink-300 to-rose-400',
    animationClass: 'animate-bounce',
    element: 'heal',
    allowedRoles: ['xiaowei', 'xiaoya']
  },
  {
    id: 'boulder',
    name: '巨石滚滚',
    description: '从天而降的岩石',
    value: 8,
    cost: 3,
    effectType: 'damage',
    rarity: 'common',
    icon: '🪨',
    color: 'from-stone-400 to-stone-600',
    animationClass: 'animate-bounce',
    element: 'nature',
    allowedRoles: ['xiaowei']
  },
  {
    id: 'star',
    name: '流星群',
    description: '来自星空的力量',
    value: 8,
    cost: 3,
    effectType: 'damage',
    rarity: 'rare',
    icon: '🌠',
    color: 'from-indigo-400 to-pink-500',
    animationClass: 'animate-bounce',
    element: 'light',
    allowedRoles: ['xiaoya']
  }
];
