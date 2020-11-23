/**
 * 通用接口类型
 */
// 接口获取列表时的通用参数类型
export interface BaseListParam {
  limit?: number;
  offset?: number;
}

/**
 * 搜索相关类型
 */
// 搜索关键词
export interface SearchKeyword {
  showKeyword?: string;
  realkeyword: string;
}

/**
 * 歌曲相关类型
 */
// 播放的歌曲类型
export interface Player {
  id: string; // 歌曲id
  src: string; // 播放路径
  // name: string; // 歌曲名称
  // cover: string; // 歌曲封面
  // artist: Artist; // 艺术家
  // album: Album; // 专辑
  paused: boolean; // 播放状态
  loop: boolean; // 单曲循环
  autoplay: boolean; // 自动播放
  volume: number; // 音量
  startTime: number; // 开始播放位置
  currentTime: number; // 当前播放位置
  // duration: number; // 时长 时间戳
  tracks: Array<Song>; // 歌曲集合
  // trackIds: string[]; // 歌曲id集合
  autoqa: boolean; // 是否自动音质
  mode: string; // 播放模式
}

// 歌曲类型
export interface Song {
  id: string;
  name: string;
  ar: Array<Artist>; // 艺术家
  al: Album; // 专辑
  dt: number; // 播放时长 时间戳
  t: number; // 是否喜欢
  s?: MusicQuality; // MAQ音质
  h?: MusicQuality; // SQ音质
  m?: MusicQuality; // 高音质
  l?: MusicQuality; // 标准音质
  copyright?: number; // 版权信息
  publishTime?: number; // 发布时间
  djId?: number; // djId ?
  mv?: number; // mv ?
  cp?: number; // ?
}

// 专辑类型
export interface Album {
  id: string;
  name: string;
  company?: string; // 演艺公司
  type?: string; // 类型
  songs?: Array<Song>;
  onSale?: boolean; // 是否折扣
  size?: number; // 包含歌曲数目
  picUrl?: string; // 封面照片
  subType?: string; // 自类型
  copyrightId?: number; // 版权号
  artist?: Artist; // 艺术家
  publishTime?: number; // 发布时间
  description?: string; // 描述
  status?: number; // 状态
  alias?: string []; // 别称？
  tags?: string | string []; // 标签 ？ array
  info?: Object; // 其他信息
}

// 艺术家类型
export interface Artist {
  id: string;
  name: string;
  tns?: Array<Object>; // ?
  alias?: Array<any>; // ?
}

// 歌单类型
export interface Playlist {
  id: string;
  name: string;
  description?: string; // 描述
  creator: User; // 创建者
  subscribers?: Array<User>; // 订阅者集合
  subscribed: boolean; // 是否订阅
  tracks: Array<Song>; // 歌曲集合
  trackIds: Array<Object>; // 歌曲id集合
  coverImgUrl: string; // 封面图片
  trackCount: number; // 歌曲数
  subscribedCount: number; // 订阅数
  cloudTrackCount?: number; // 云音乐数
  shareCount: number; // 分享数
  commentCount?: number; // 评论数
  privacy?: number; // 是否私人歌单
  playCount: number; // 累计播放次数
  tags?: string | string []; // 标签
  highQuality?: boolean; // 是否高音质
  createTime?: number; // 创建日期 时间戳
  updateTime?: number; // 更新日期 时间戳
  status?: number; // 状态
}

// 歌曲音质类型
export interface MusicQuality {
  fid?: number | string; // ？
  br: number; // 码率 需转换使用
  size: number; // 大小 需转换使用
  vd?: number; // ?
}

// 歌单创建者类型
export interface User {
  userId: string;
  nickname: string; // 昵称
  signature?: string; // 签名
  description?: string; // 描述
  userType: number; // 会员类型
  avatarUrl: string; // 头像
  backgroundUrl?: string; // 主页背景图
  vipType: number; // 会员等级
  gender?: number; // 性别
  birthday?: number; // 出生日期
  province?: string | number; // 省编号
  city?: string | number; // 城市编号
  followed?: boolean; // 是否关注
  mutual?: boolean; // 是否好友
}

// 艺术家详情类型
export interface ArtistDetail {
  introduction: Array<Object>; // 详细介绍
  briefDesc: string; // 简要介绍
  topicData: Array<Object>; // 热门话题
  count: number; // 成员数量？
}
