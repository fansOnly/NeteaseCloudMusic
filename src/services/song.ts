import { get } from '@/utils/http'

// 获取歌曲url
export const getSongUrl = (id: string) => get("/song/url", {id});

// 歌曲是否可用
export const checkMusic = (id: string) => get('/check/music', {id})

// 获取歌曲详情
export const getSongDetail = (ids: string) => get('/song/detail', {ids})

// 喜欢音乐
export const likeSong = (id: string, like: boolean = true) => get('/like', {id, like})

// 获取相似歌曲
export const simiSong = (id: string) => get('/simi/song', {id})
