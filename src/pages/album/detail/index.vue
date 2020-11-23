<template>
<view class="artist-header" :style="{'background-image': 'url('+albumDetail.picUrl+')'}">
  <view class="artist-header-wrap">
      <view class="artist-name">{{albumDetail.name}}</view>
    <view class="artist-statistics">
      <view class="artist-statistics-item">收藏<view class="span">{{albumDetail.info.likedCount}}</view></view>
      <view class="artist-statistics-item">分享<view class="span">{{albumDetail.info.shareCount}}</view></view>
      <view class="artist-statistics-item">评论<view class="span">{{albumDetail.info.commentCount}}</view></view>
    </view>
    <view class="artist-brief">{{albumDetail.description}}</view>
    <view class="artist-follow" @tap="handelAlbumSub">{{ albumDetail.info.liked ? '取消收藏' : '收藏'}}</view>
    <view class="artist-tags">
      <template v-for="(item, index) in albumDetail.tags" :key="'album-tag-' + index">
        <view class="artist-tags-item">{{item}}</view>
      </template>
    </view>
  </view>
</view>
<view class="artist-top-songs">
  <view class="artist-top-songs-bar">
    <view class="play">
      <view class="play-area" @tap="handleMultiPlay">
        <view class="at-icon at-icon-play"></view> 播放全部
      </view>
      <view class="secondary-title">{{albumDetail.size}}首</view>
      </view>
    <view class="more"><view class="at-icon at-icon-filter icon-size"></view></view>
  </view>
  <view v-if="albumSongList.length" class="artist-top-songs-list">
    <template v-for="(item, index) in albumSongList" :key="'artist-song-'+index">
      <view class="user-list-item border-bottom active">
        <image class="user-list-img" :src="item.al.picUrl" />
        <view class="user-list-info">
          <view class="user-list-name">{{item.name}}</view>
          <view class="user-list-artist secondary-title">{{item.ar[0].name}}</view>
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
<Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { reactive, readonly, ref } from 'vue'
import { album, albumSub } from '@/services/album'
import { formatDate } from '@/utils/util'
import './index.scss'
import { useStore } from 'vuex'

export default {
  setup () {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#444444'
    })
    const store = useStore()
    const params: any = getCurrentInstance().router?.params
    const albumid = readonly(params.id)
    const albumDetail = reactive({
      name: '',
      artist: {},
      company: '',
      publishTime: '',
      picUrl: '',
      description: '',
      type: '',
      size: 0,
      tags: [],
      info: {
        liked: false
      }
    })
    const albumSongList = ref([])
    const apiGetArtist = async () => {
      const { code, album: { picUrl, name, company, publishTime, description, type, size, info = {}, tags= [] }, songs } = await album(albumid)
      if (code === 200) {
        albumDetail.name = name
        albumDetail.picUrl = picUrl
        albumDetail.company = company
        albumDetail.publishTime = publishTime
        albumDetail.description = description
        albumDetail.type = type
        albumDetail.size = size
        albumDetail.info = info
        albumDetail.tags = tags
        albumSongList.value = songs
      }
    }
    apiGetArtist()
    const handleMultiPlay = () => {
      store.dispatch('player/MULTI_PLAY', albumSongList.value)
    }
    const handelAlbumSub = async () => {
        const data = await albumSub(albumid, albumDetail.info.liked ? 0 : 1)
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
      albumid,
      albumDetail,
      albumSongList,
      formatDate,
      handelAlbumSub,
      handleRoute,
      handleMultiPlay
    }
  },
  components: {
    Player
  }
}
</script>
