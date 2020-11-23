import { get } from '@/utils/http'

// 热门歌单分类
export const getHotList = () => get('/playlist/hot', {})

// 订阅/取消订阅歌单
// t : 类型,1:收藏,2:取消收藏 id : 歌单 id
export const subscribePlaylist = (id: string, t: number) => get("/playlist/subscribe", { id, t });

// 获取歌单详情
export const getPlaylistDetail = (id: string) => get('/playlist/detail', {id})




/**
 * 用户相关
 */
/**
 * 对歌单添加或删除歌曲
 * @param op add del
 * @param pid  歌单 id
 * @param tracks  歌曲 id,可多个,用逗号隔开
 */
export const tracksPlaylist = (op: 'add' | 'del', pid: string, tracks: string) => get('/playlist/tracks', {op, pid, tracks})

// 创建歌单
export const createPlaylist = (name: string) => get('/playlist/create', {name})
