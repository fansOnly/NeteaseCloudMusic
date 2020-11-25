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
  <view class="cn-title-bar artist-top-songs">
      <view class="cn-title">热门歌曲</view>
      <view class="cn-action" @tap="handleRoute(`/pages/artist/songs/index?id=${artistid}`)">更多</view>
    </view>
  <SongList :data-list="hotSongList" />

    <!-- 专辑 -->
    <view class="cn-title-bar artist-top-songs">
      <view class="cn-title">专辑</view>
      <view class="cn-action" @tap="handleRoute(`/pages/artist/songs/index?id=${artistid}`)">更多</view>
    </view>
    <view class="section">
      <AlbumList :data-list="artistAlbumList" />
    </view>
    <!-- mv -->
    <view class="cn-title-bar">
      <view class="cn-title">MV</view>
      <view class="cn-action" @tap="handleRoute(`/pages/artist/songs/index?id=${artistid}`)">更多</view>
    </view>
    <MvCardList :data-list="artistMvList" />
    <!-- 相似艺人 -->
    <view class="cn-title-bar">
      <view class="cn-title">相似艺人</view>
      <view class="cn-action" @tap="handleRoute('/pages/artist/songs/index')">更多</view>
    </view>
    <view class="section">
      <ArCardList :data-list="artistSimiList" />
    </view>
<Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import SongList from '@/components/song/SongList.vue'
import AlbumList from '@/components/album/AlbumList.vue'
import ArCardList from '@/components/artist/ArCardList.vue'
import MvCardList from '@/components/mv/MvCardList.vue'

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
        artistMvList.value = mvs.map(v => {
          v.cover = v.imgurl
          return v
        }).slice(0, 4)
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
  },
  components: {
    Player,
    SongList,
    AlbumList,
    ArCardList,
    MvCardList,
  }
}
</script>
