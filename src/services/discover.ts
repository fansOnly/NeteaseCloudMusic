import { get } from "@/utils/http";
import { BaseListParam } from "@/utils/interface";

// 首页-发现 - useless
export const getDiscoverIndex = () => get("/homepage/block/page", {});

// 首页-发现-圆形图标入口列表 - useless
export const getDiscoverBall = () => get("/homepage/dragon/ball", {});

// 新歌速递
export const getTopSongList = (type: number = 0) => get("/top/song", {type});

// 最新专辑
export const albumNewList = () => get("/album/newest", {});

// 最新mv
export const mvFirst = (params: BaseListParam, limit: number = 30, offset: number = 0) => get('/mv/first', { limit, offset, ...params })

// 热门歌手
export const topArtists = (params: BaseListParam, limit: number = 30, offset: number = 0) => get("/top/artists", { limit, offset, ...params });

// 热门歌单
interface topPlParam {
  cat?: string;
  limit?: number;
  before?: number;
}
export const topPlaylist = (params: topPlParam, limit: number = 10) => get('/top/playlist/highquality', {limit, ...params})
