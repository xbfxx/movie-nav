// 免费正版影视资源平台数据
// 说明：本数据仅收录「官方免费 / 免费专区 / 公版」资源，全部为合法来源，本网站不存储/不内嵌任何片源。
// 本版新增：searchTpl —— 平台「按片名搜索」的直达链接模板，{q} 会被替换为编码后的关键词，
//          点击后直接打开该平台针对这部片的搜索结果页（一步到位，无需去主页再搜）。
// 字段：
//   id / name / emoji / desc / cats / res / note  见上一版
//   searchTpl  搜索直达 URL 模板（{q}=编码后的关键词）；为 null 表示仅 App 内可搜

const PLATFORMS = [
  {
    id: 'bili',
    name: '哔哩哔哩（B站）',
    emoji: '📺',
    desc: '纪录片、番剧、部分电影免费，UP主二创与官方号资源极丰富',
    cats: ['doc', 'anime', 'movie', 'tv'],
    res: '4k',
    note: '免费区多为1080P，部分纪录片/番剧可达2K/4K',
    searchTpl: 'https://search.bilibili.com/all?keyword={q}'
  },
  {
    id: 'cctv',
    name: '央视频 / 央视网',
    emoji: '🎬',
    desc: '央视出品的电视剧、纪录片、电影，正版免费',
    cats: ['tv', 'doc', 'movie'],
    res: '1080p',
    note: '央视频 App 与网站均免费，无广告干扰少',
    searchTpl: 'https://www.yangshipin.cn/search?keyword={q}'
  },
  {
    id: '1905',
    name: '1905电影网',
    emoji: '🎞️',
    desc: '国家电影局旗下官方电影网，正版电影免费专区',
    cats: ['movie'],
    res: '1080p',
    note: '官方正版，含经典老片与部分新片免费',
    searchTpl: 'https://www.1905.com/search/?q={q}'
  },
  {
    id: 'xigua',
    name: '西瓜视频',
    emoji: '🍉',
    desc: '免费电影、纪录片、影视解说，字节旗下',
    cats: ['movie', 'doc'],
    res: '1080p',
    note: '免费片库较大，含公版与授权免费内容',
    searchTpl: 'https://www.ixigua.com/search?keyword={q}'
  },
  {
    id: 'migu',
    name: '咪咕视频',
    emoji: '🟢',
    desc: '中国移动旗下，免费电影/电视剧/动漫，部分4K',
    cats: ['movie', 'tv', 'anime', 'doc'],
    res: '4k',
    note: '免费区含大量内容，部分4K需咪咕会员',
    searchTpl: 'https://www.miguvideo.com/search?keyword={q}'
  },
  {
    id: 'mgtv',
    name: '芒果TV',
    emoji: '🥭',
    desc: '湖南广电旗下，免费电视剧、综艺、电影',
    cats: ['tv', 'movie', 'anime'],
    res: '1080p',
    note: '免费专区带广告，内容正规',
    searchTpl: 'https://so.mgtv.com/so?k={q}'
  },
  {
    id: 'iqiyi',
    name: '爱奇艺·免费专区',
    emoji: '🟡',
    desc: '免费电影、剧集、动漫（带广告）',
    cats: ['movie', 'tv', 'anime', 'doc'],
    res: '1080p',
    note: '网站与App均有「免费」筛选标签',
    searchTpl: 'https://so.iqiyi.com/so/q_{q}'
  },
  {
    id: 'youku',
    name: '优酷·免费',
    emoji: '🔵',
    desc: '免费剧集、电影、动漫、纪录片',
    cats: ['tv', 'movie', 'anime', 'doc'],
    res: '1080p',
    note: '免费内容带广告，正版授权',
    searchTpl: 'https://so.youku.com/search_video/q_{q}'
  },
  {
    id: 'qqvideo',
    name: '腾讯视频·免费',
    emoji: '🟣',
    desc: '免费电影、动漫、纪录片（带广告）',
    cats: ['movie', 'anime', 'doc', 'tv'],
    res: '1080p',
    note: '含免费专区与限时免费内容',
    searchTpl: 'https://v.qq.com/x/search/?q={q}'
  },
  {
    id: 'xuexi',
    name: '学习强国',
    emoji: '📚',
    desc: '官方平台，纪录片、影视、慕课资源丰富且免费',
    cats: ['doc', 'tv', 'movie'],
    res: '1080p',
    note: 'App 内「电视台/影视」板块，完全免费',
    searchTpl: null
  },
  {
    id: 'archive',
    name: 'Internet Archive 公版影像',
    emoji: '🗝️',
    desc: '全球公版（已进入公共领域）电影、老片、纪录片',
    cats: ['public', 'movie', 'doc'],
    res: '2k',
    note: '公有领域资源，可合法自由观看与下载',
    searchTpl: 'https://archive.org/search?query={q}'
  },
  {
    id: 'wiki',
    name: '维基共享·公版电影',
    emoji: '🌐',
    desc: 'Wikimedia Commons 收录的公版电影与历史影像',
    cats: ['public', 'movie', 'doc'],
    res: '1080p',
    note: '公有领域，免费自由使用',
    searchTpl: 'https://commons.wikimedia.org/w/index.php?search={q}'
  }
];

const CATS = {
  movie:  { label: '电影',   icon: '🎬' },
  tv:     { label: '电视剧', icon: '📺' },
  doc:    { label: '纪录片', icon: '🌍' },
  anime:  { label: '动漫',   icon: '🍥' },
  public: { label: '公版经典', icon: '🗝️' }
};

const RES_LABEL = { '1080p': '1080P', '2k': '2K', '4k': '4K' };

// 搜索示例（点击即搜，演示用）
const EXAMPLES = ['逃学威龙', '流浪地球', 'BBC纪录片', '千与千寻', '三国演义'];
