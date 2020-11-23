<template>
  <view class="index-wrap">
    <view class="section-wrap">
      <view class="ball-list">
        <template v-for="item in ballList" :key="item.id">
          <view class="item" @tap="handleBallClick(item.id)">
            <!-- <view class="cover"><image :src="item.iconUrl" /></view> -->
            <view class="cover"><image src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" /></view>
            <view class="name line-clamp-2">{{item.name}}</view>
          </view>
        </template>
      </view>
    </view>
      <!-- 新碟上架 -->
      <view class="section-wrap">
        <view class="title-bar">
          <view class="htitle">新碟上架</view>
          <view class="hmore" @tap="handleAlbumMoreClick">更多</view>
        </view>
      <view class="song-list">
        <template v-for="item in albumList" :key="item.id">
          <view class="item" @tap="handleRoute(`/pages/album/detail/index?id=${item.id}`)">
            <view class="cover">
              <image :src="item.picUrl" />
              </view>
            <view class="name line-clamp-2">{{item.name}}</view>
          </view>
        </template>
      </view>
      </view>
      <!-- 新歌速递 -->
      <view class="section-wrap">
        <view class="title-bar">
          <view class="htitle">新歌速递</view>
          <view class="hmore" @tap="handleAlbumMoreClick">更多</view>
        </view>
      <view class="song-list">
        <template v-for="item in songList" :key="item.id">
          <view class="item">
            <view class="cover">
              <view class="play-mask" @tap="handlePlay(item.id)"><view class="at-icon at-icon-play"></view></view>
              <image :src="item.album.picUrl" />
            </view>
            <view class="name line-clamp-2">{{item.name}}</view>
          </view>
        </template>
      </view>
      </view>
      <!-- 热门歌手 -->
      <view class="section-wrap">
        <view class="title-bar">
          <view class="htitle">热门歌手</view>
          <view class="hmore" @tap="handleAlbumMoreClick">更多</view>
        </view>
      <view class="artists-list">
        <template v-for="item in artistList" :key="item.id">
          <view class="item" @tap="handleRoute(`/pages/artist/detail/index?id=${item.id}`)">
            <view class="cover"><image :src="item.picUrl" /></view>
            <view class="name line-clamp-2">{{item.name}}</view>
          </view>
        </template>
      </view>
      </view>
  </view>
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { getDiscoverBall, getTopSongList, albumNewList, topArtists } from '@/services/discover'
import './index.scss'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
    const ballList = ref([])
    const albumList = ref([])
    const songList = ref([])
    const artistList = ref([])
    const handleBallClick = () => {
      console.log('handleBallClick')
    }
    const handleAlbumPlay = () => {}
    const handleAlbumMoreClick = () => {}

    const apiGetDiscoverBall = async () => {
      const { code, data } = await getDiscoverBall()
      if (code == 200) {
        ballList.value = data
      }
    }
    const apiGetAlbumNewList = async () => {
      const { code, albums } = await albumNewList()
      if (code == 200) {
        albumList.value = albums.slice(0, 8)
      }
    }
    const apiGetTopSongList = async () => {
      const { code, data } = await getTopSongList(7)
      if (code == 200) {
        songList.value = data.slice(0, 8)
      }
    }
    const apiGetTopArtists = async () => {
      const { code, artists } = await topArtists({limit: 8})
      if (code == 200) {
        artistList.value = artists
      }
    }
    apiGetDiscoverBall()
    apiGetAlbumNewList()
    apiGetTopSongList()
    apiGetTopArtists()
    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }
    const handlePlay = (id: string) => {
      store.dispatch('player/PLAY', id)
    }
    return {
      ballList,
      albumList,
      songList,
      artistList,
      handleBallClick,
      handleAlbumPlay,
      handleAlbumMoreClick,
      handlePlay,
      handleRoute,
    }
  },
  components: {
    Player
  }
}
</script>
