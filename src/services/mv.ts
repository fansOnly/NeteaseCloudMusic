import { get } from "@/utils/http";
import { BaseListParam } from "@/utils/interface";
interface mvListParam extends BaseListParam {
  type?: number;
  area?: string;
  order?: string;
}

// 全部mv
export const mvAll = (params: mvListParam, limit: number = 10) => get('/mv/all', {limit, ...params})

// mv详情
export const mvDetail = (mvid: string) => get('/mv/detail', {mvid})

// mv点赞等数据
export const mvDetailInfo = (mvid: string) => get('/mv/detail/info', {mvid})

// mv url
// r: 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
export const mvUrl = (id: string, r: number = 1080) => get('/mv/url', {id, r})

// 收藏/取消 mv
export const mvSub = (mvid: string, t: number = 1) => get('/mv/sub', {mvid, t})
