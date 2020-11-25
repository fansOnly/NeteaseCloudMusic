<template>
    <!-- 新碟上架 -->
    <view class="cn-title-bar" style="margin-top: 30rpx">
      <view class="cn-title">新碟上架</view>
      <view class="cn-action" @tap="handleRoute('/pages/album/new/index')">更多</view>
    </view>
    <view class="section">
      <AlbumList :data-list="albumList" />
    </view>
    <!-- 新歌速递 -->
    <view class="cn-title-bar">
      <view class="cn-title">新歌速递</view>
      <view class="cn-action" @tap="handleRoute('/pages/search/index/index')">更多</view>
    </view>
    <SongList :data-list="songList" >
      <template #option></template>
    </SongList>
    <!-- 精品歌单 -->
    <view class="cn-title-bar" style="margin-top: 30rpx">
      <view class="cn-title">精品歌单</view>
      <view class="cn-action" @tap="handleRoute('/pages/playlist/index/index')">更多</view>
    </view>
    <PlCardList :data-list="plList" />
    <!-- 最新mv -->
    <view class="cn-title-bar">
      <view class="cn-title">最新mv</view>
      <view class="cn-action" @tap="handleRoute('/pages/mv/index/index')">更多</view>
    </view>
    <MvCardList :data-list="mvList" />
    <!-- 热门歌手 -->
    <view class="cn-title-bar">
      <view class="cn-title">热门歌手</view>
      <view class="cn-action" @tap="handleRoute('/pages/artist/index/index')">更多</view>
    </view>
    <view class="section">
      <ArCardList :data-list="artistList" />
    </view>
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import AlbumList from '@/components/album/AlbumList.vue'
import SongList from '@/components/song/SongList.vue'
import ArCardList from '@/components/artist/ArCardList.vue'
import PlCardList from '@/components/playlist/PlCardList.vue'
import MvCardList from '@/components/mv/MvCardList.vue'

import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { getTopSongList, albumNewList, mvFirst, topArtists, topPlaylist } from '@/services/discover'
import './index.scss'

export default {
  setup () {
    const albumList = ref([])
    const apiGetAlbumNewList = async () => {
      const { code, albums } = await albumNewList()
      if (code == 200) {
        albumList.value = albums.slice(0, 6)
      }
    }
    apiGetAlbumNewList()

    const songList = ref([])
    const apiGetTopSongList = async () => {
      const { code, data } = await getTopSongList(7)
      if (code == 200) {
        songList.value = data.map(v => {
          v.ar = v.artists
          v.al = v.album
          return v
        }).slice(0, 3)
      }
    }
    apiGetTopSongList()

    const mvList = ref([])
    const apiGetMvList = async () => {
      const { code, data } = await mvFirst({limit: 4})
      if (code == 200) {
        mvList.value = data
      }
    }
    apiGetMvList()

    const plList = ref([])
    const apiGetTopPlList = async () => {
      const { code, playlists } = await topPlaylist({limit: 6})
      if (code === 200) {
        plList.value = playlists
      }
    }
    apiGetTopPlList()

    const artistList = ref([])
    const apiGetTopArtists = async () => {
      const { code, artists } = await topArtists({limit: 6})
      if (code == 200) {
        artistList.value = artists
      }
    }
    apiGetTopArtists()

    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }

    return {
      albumList,
      songList,
      mvList,
      plList,
      artistList,
      handleRoute,
    }
  },
  components: {
    Player,
    AlbumList,
    SongList,
    ArCardList,
    PlCardList,
    MvCardList
  }
}
</script>
