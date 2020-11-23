<template>
<view class="artist-header" :style="{'background-image': 'url('+artistDetail.picUrl+')'}">
  <view class="artist-header-wrap">
      <view class="artist-name">{{artistDetail.name}}</view>
    <view class="artist-statistics">
      <view class="artist-statistics-item">歌曲<view class="span">{{artistDetail.musicSize}}</view></view>
      <view class="artist-statistics-item">专辑<view class="span">{{artistDetail.albumSize}}</view></view>
      <view class="artist-statistics-item">MV<view class="span">{{artistDetail.mvSize}}</view></view>
    </view>
    <view class="artist-brief">{{artistDetail.briefDesc}}</view>
    <view class="artist-follow" @tap="handleArtistSub">{{ artistDetail.followed ? '取消关注' : '关注'}}</view>
  </view>
</view>
<view class="artist-top-songs">
  <view class="artist-top-songs-bar">
    <view class="title">热门歌曲</view>
    <view class="more" @tap="handleRoute(`/pages/artist/songs/index?id=${artistid}`)">更多<view class="at-icon at-icon-chevron-right"></view></view>
  </view>
  <view v-if="hotSongList.length" class="artist-top-songs-list">
    <template v-for="(item, index) in hotSongList" :key="'artist-song-'+index">
      <view class="user-list-item border-bottom active">
        <image class="user-list-img" :src="item.al.picUrl" />
        <view class="user-list-info">
          <view class="user-list-name">{{item.name}}</view>
          <view class="user-list-artist secondary-title">{{artistVal(item.ar)}}</view>
        </view>
        <view v-if="item.mv" class="user-list-tags">
          <view class="at-icon at-icon-video icon-size"></view>
        </view>
        <view class="user-list-more">
          <view class="at-icon at-icon-link icon-size"></view>
        </view>
      </view>
    </template>
  </view>
</view>
<view class="artist-top-songs">
  <view class="artist-top-songs-bar">
    <view class="title">专辑</view>
    <view class="more" @tap="handleRoute(`/pages/artist/songs/index?id=${artistid}`)">更多<view class="at-icon at-icon-chevron-right"></view></view>
  </view>
  <view v-if="artistAlbumList.length" class="pic-card-list artist-area">
    <template v-for="(item, index) in artistAlbumList" :key="'artist-album-'+index">
      <view class="pic-card-item">
        <view class="pic-card-image"><image class="pic-card-img" :src="item.picUrl" /></view>
        <view class="pic-card-desc">
          <view class="pic-card-title line-clamp-1">{{item.name}}</view>
          <view class="pic-card-txt secondary-title">{{formatDate(item.publishTime, 'YYYY-MM-DD')}}</view>
        </view>
      </view>
    </template>
  </view>
</view>
<view class="artist-top-songs">
  <view class="artist-top-songs-bar">
    <view class="title">MV</view>
    <view class="more" @tap="handleRoute(`/pages/mv/detail/index?id=${artistid}`)">更多<view class="at-icon at-icon-chevron-right"></view></view>
  </view>
  <view v-if="artistMvList.length" class="pic-card-list artist-area">
    <template v-for="(item, index) in artistMvList" :key="'artist-mv-'+index">
      <view class="pic-card-item" @tap="handleRoute(`/pages/mv/detail/index?id=${artistid}`)">
        <view class="pic-card-image">
          <image class="pic-card-img" :src="item.imgurl" />
          <view class="pic-card-tag">{{timestampToDate(item.duration / 1000)}}</view>
        </view>
        <view class="pic-card-desc">
          <view class="pic-card-title line-clamp-1">{{item.name}}</view>
          <view class="pic-card-txt secondary-title">播放：{{item.playCount}}</view>
        </view>
      </view>
    </template>
  </view>
</view>
<view class="artist-top-songs">
  <view class="artist-top-songs-bar">
    <view class="title">相似艺人</view>
    <view class="more" @tap="handleRoute(`/pages/artist/songs/index?id=${artistid}`)">更多<view class="at-icon at-icon-chevron-right"></view></view>
  </view>
  <view v-if="artistSimiList.length" class="pic-card-list artist-area">
    <template v-for="(item, index) in artistSimiList" :key="'artist-simi-'+index">
      <view class="pic-card-item">
        <view class="pic-card-image">
          <image class="pic-card-img" style="border-radius:100%;" :src="item.picUrl" />
        </view>
        <view class="pic-card-desc align-center">
          <view class="pic-card-title line-clamp-1">{{item.name}}</view>
        </view>
      </view>
    </template>
  </view>
</view>
</template>

<script lang="ts">
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { reactive, readonly, ref } from 'vue'
import { artists, artistAlbum, artistMv, artistSimi, artistSub } from '@/services/artist'
import { formatDate, timestampToDate } from '@/utils/util'
import './index.scss'

export default {
  setup () {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#444444'
    })
    const params: any = getCurrentInstance().router?.params
    const artistid = readonly(params.id)
    const artistDetail = reactive({
      name: '',
      picUrl: '',
      musicSize: 0,
      albumSize: 0,
      mvSize: 0,
      al: {},
      ar: [],
      mv: '',
      briefDesc: '',
      followed: false,
    })
    const hotSongList = ref([])
    const artistVal = (arr: Array<any>) => {
      return arr.length === 1 ? arr[0].name : arr.reduce((acc, cur) => acc + '/' + cur.name)
    }
    const apiGetArtist = async () => {
      const { code, artist: { picUrl, name, musicSize, albumSize, mvSize, al = {}, ar= [], mv, briefDesc, followed }, hotSongs } = await artists(artistid)
      if (code === 200) {
        artistDetail.name = name
        artistDetail.picUrl = picUrl
        artistDetail.musicSize = musicSize
        artistDetail.albumSize = albumSize
        artistDetail.mvSize = mvSize
        artistDetail.al = al
        artistDetail.ar = ar
        artistDetail.mv = mv
        artistDetail.briefDesc = briefDesc
        artistDetail.followed = followed
        hotSongList.value = hotSongs.slice(0,5)
      }
    }
    apiGetArtist()
    const artistAlbumList = ref([])
    const apiGetArtistAlbum = async () => {
      const { code, hotAlbums } = await artistAlbum({id: artistid, limit: 6})
      if (code === 200) {
        artistAlbumList.value = hotAlbums
      }
    }
    apiGetArtistAlbum()
    const artistMvList = ref([])
    const apiGetArtistMv = async () => {
      const { code, mvs } = await artistMv(artistid)
      if (code === 200) {
        artistMvList.value = mvs.slice(0, 6)
      }
    }
    apiGetArtistMv()
    const artistSimiList = ref([])
    const apiGetArtistSimi = async () => {
      const { code, artists } = await artistSimi(artistid)
      if (code === 200) {
        artistSimiList.value = artists.slice(0, 6)
      }
    }
    apiGetArtistSimi()
    const handleArtistSub = async () => {
        // TODO 未知接口返回
        const data = await artistSub(artistid, artistDetail.followed ? 0 : 1)
        if (data?.code === 200) {
          Taro.showToast({
            title: '关注成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
      const handleRoute = (url: string) => {
        Taro.navigateTo({url})
      }
    return {
      artistid,
      artistDetail,
      artistVal,
      hotSongList,
      artistAlbumList,
      artistMvList,
      artistSimiList,
      formatDate,
      timestampToDate,
      handleArtistSub,
      handleRoute
    }
  }
}
</script>
