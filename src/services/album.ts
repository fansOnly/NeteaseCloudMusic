import { get } from "@/utils/http";

// 全部新碟
export const albumNew = (params?: Object, area: string = 'ALL', limit: number = 30, offset: number = 0) => get('/album/new', {area, limit, offset, ...params})

// 获取专辑内容
export const album = (id: string) => get('/album', {id})

// 专辑动态信息
export const albumDynamic = (id: string) => get('/album/detail/dynamic', {id})


// 收藏/取消专辑
export const albumSub = (id: string, t: number) => get('/album/sub', {id, t})
