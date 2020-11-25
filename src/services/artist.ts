import { get } from '@/utils/http'
import { BaseListParam } from "@/utils/interface";
interface arListParam extends BaseListParam {
  type?: number;
  area?: string;
  initial?: string;
}
interface arAlParam extends BaseListParam {
  id: string;
}
// 歌手分类列表
export const artistList = (params: arListParam, type: number = -1, area: number = -1, limit: number = 30, offset: number = 0) => get('/artist/list', { limit, offset, type, area, ...params })

// 歌手详情 - useless
export const artistDesc = (id: string) => get('/artist/desc', {id})

// 歌手单曲 - 包含歌手详情
export const artists = (id: string) => get('/artists', {id})

// 歌手专辑
export const artistAlbum = (params: arAlParam, limit: number = 30, offset: number = 0) => get('/artist/album', { limit, offset, ...params })

// 歌手mv
export const artistMv = (id: string) => get('/artist/mv', {id})

// 歌手热门单曲50首
export const artistTopSong = (id: string) => get('/artist/top/song', {id})

// 相似歌手
export const artistSimi = (id: string) => get('/simi/artist', {id})

/**
 * 用户相关
 */
// 收藏/取消收藏歌手
// t 1-收藏 2-取消
export const artistSub = (id: string, t: number) => get('/artist/sub', {id, t})
