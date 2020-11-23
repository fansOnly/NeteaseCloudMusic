import { get } from "@/utils/http";

// 获取用户详情
export const getUserDetail = (uid: string) => get('/user/detail', {uid})

// 获取用户歌单
export const getUserPlaylist = (
  uid: string,
  limit: number = 30,
  offset: number = 0
) => get("/user/playlist", { uid, limit, offset});


// 获取用户播放历史记录
// type=1 时只返回 weekData, type=0 时返回 allData
export const userRecord = (uid: string, type: number) => get('/user/record', {uid, type})

// 用户关注列表
export const userFollows = (uid: string) => get('/user/follows', {uid})

// 用户粉丝列表
export const userFolloweds = (uid: string) => get('/user/followeds', {uid})

// 获取用户私信列表
export const userPrivate = () => get('/msg/private', {})
