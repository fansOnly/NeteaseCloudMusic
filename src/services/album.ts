import { get } from "@/utils/http";


// 获取专辑内容
export const album = (id: string) => get('/album', {id})

// 专辑动态信息
export const albumDynamic = (id: string) => get('/album/detail/dynamic', {id})


// 收藏/取消专辑
export const albumSub = (id: string, t: number) => get('/album/sub', {id, t})
