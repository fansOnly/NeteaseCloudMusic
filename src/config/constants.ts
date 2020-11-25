// 登录方式
export const LOGIN_WAYS = [
  { name: '手机号登录', value: 'phone' },
  { name: '邮箱登录', value: 'email' },
]

// 搜索结果分类
export const SEARCH_TYPES = [
  { id: 1018, name: "综合", comp: "composites" },
  { id: 1, name: "单曲", comp: "songs" },
  { id: 1000, name: "歌单", comp: "playlists" },
  { id: 1014, name: "视频", comp: "videos" },
  { id: 100, name: "歌手", comp: "artists" },
  { id: 10, name: "专辑", comp: "albums" },
  { id: 1004, name: "MV", comp: "mvs" },
  { id: 1009, name: "电台", comp: "djRadios" },
  { id: 1006, name: "歌词", comp: "lrcs" },
  { id: 1002, name: "用户", comp: "users" },
];

// 全部音质
export const PLAY_QUALITIES = [
  { name: '标准品质', label: '标准品质', mode: '标准', value: 'nq', type: 'mp3', br: '', size: '', tip: '' },
  { name: '高品质', label: 'HQ高品质', mode: 'HQ', value: 'hq', type: 'mp3', br: '', size: '', tip: '' },
  { name: '无损品质', label: 'SQ无损品质', mode: 'SQ', value: 'sq', type: 'wav', br: '', size: '', tip: 'VIP专享' },
  { name: 'MAQ品质', label: 'MAQ品质', mode: 'MAQ', value: 'maq', type: 'flac', br: '', size: '', tip: 'SVIP专享' }
]

// 歌曲播放模式
export const PLAY_MODES = [
  {
    icon: 'at-icon-repeat-play', value: 'repeat', msg: '单曲循环'
  }, {
    icon: 'at-icon-shuffle-play', value: 'shuffle', msg: '随机播放'
  }, {
    icon: 'at-icon-playlist', value: 'queue', msg: '列表循环'
  }
]

// 全部音效
export const PLAY_EFFECTS = [
  { name: '无', value: '00', icon: 'at-icon-blocked' },
  { name: '演唱会', value: '01', icon: 'at-icon-equalizer' },
  { name: '卧室', value: '02', icon: 'at-icon-equalizer' },
  { name: '石屋', value: '03', icon: 'at-icon-equalizer' },
  { name: '剧院', value: '04', icon: 'at-icon-equalizer' },
  { name: '洞穴', value: '05', icon: 'at-icon-equalizer' },
  { name: '空巷', value: '06', icon: 'at-icon-equalizer' },
  { name: '城市', value: '07', icon: 'at-icon-equalizer' },
  { name: '停车场', value: '08', icon: 'at-icon-equalizer' },
  { name: '客厅', value: '09', icon: 'at-icon-equalizer' },
  { name: '礼堂', value: '10', icon: 'at-icon-equalizer' },
  { name: '大殿', value: '11', icon: 'at-icon-equalizer' },
]

// 全部新碟分类
export const ALBUM_NEW_CLASSIFY = [
  { name: '全部', value: 'ALL' },
  { name: '华语', value: 'ZH' },
  { name: '欧美', value: 'EA' },
  { name: '韩国', value: 'KR' },
  { name: '日本', value: 'JP' },
]

// 全部歌手类型分类
export const ARTIST_TYPES = [
  { name: '全部', value: -1 },
  { name: '男歌手', value: 1 },
  { name: '女歌手', value: 2 },
  { name: '乐队', value: 3 },
]

// 全部歌手地区分类
export const ARTIST_AREAS = [
  { name: '全部', value: -1 },
  { name: '华语', value: 7 },
  { name: '欧美', value: 96 },
  { name: '日本', value: 8 },
  { name: '韩国', value: 16 },
  { name: '其他', value: 0 },
]

// 全部mv地区
export const MV_AREAS = [
  { name: '全部', value: '全部' },
  { name: '内地', value: '内地' },
  { name: '港台', value: '港台' },
  { name: '欧美', value: '欧美' },
  { name: '日本', value: '日本' },
  { name: '韩国', value: '韩国' },
]

// 全部mv类型
export const MV_TYPES = [
  { name: '全部', value: '全部' },
  { name: '官方版', value: '官方版' },
  { name: '原生', value: '原生' },
  { name: '现场版', value: '现场版' },
  { name: '网易出品', value: '网易出品' },
]

// 全部mv排序
export const MV_ORDERS = [
  { name: '上升最快', value: '上升最快' },
  { name: '最热', value: '最热' },
  { name: '最新', value: '最新' },
]
