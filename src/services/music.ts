import { get } from "@/utils/http";

// 获取每日推荐歌曲
export const recommendSongs = () => get('/recommend/songs', {})

// 获取每日推荐歌单
export const recommendResource = () => get('/recommend/resource', {})
