import { get } from "@/utils/http";
import { BaseListParam } from "@/utils/interface";

// 默认搜索关键词
export const searchDefault = () => get('/search/default', {})

// 热搜列表-详细
export const searchHot = () => get('/search/hot/detail', {})

// 公共搜索
interface SearchParam extends BaseListParam {
  keywords: string;
  type?: number;
}
// cloudsearch - 更全
// type 默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export const searchSongs = (
  params: SearchParam,
  limit: number = 30,
  offset: number = 0,
  type: number = 1018,
) => get("/search", { limit, offset, type, ...params });

// 搜索建议
export const searchSuggest = (keywords: string, type?: number) =>
  get("search/suggest", { keywords, type });
