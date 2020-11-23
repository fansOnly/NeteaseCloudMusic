<template>
<view class="mv-play">
  <video v-if="mvDetailData.info.url" id="mv" class="mv-video" :src="mvDetailData.info.url" object-fit="cover"></video>
</view>
<view class="mv-desc">
  <view class="mv-name">{{mvDetailData.name}}</view>
<view class="mv-play-count secondary-title">观看次数：{{mvDetailData.playCount}}</view>
<view class="mv-options">
  <view class="mv-options-item">
    <view :class="['at-icon icon-size', mvDetailData.liked ? 'at-icon-heart-2' : 'at-icon-heart']" @tap="handleMvSub"></view>
    <view>{{mvDetailData.likedCount}}</view>
  </view>
  <view class="mv-options-item">
    <view class="at-icon at-icon-share icon-size"></view>
    <view>{{mvDetailData.shareCount}}</view>
  </view>
</view>
<view class="mv-artist">
  <image class="mv-artist-avatar" :src="mvDetailData.artist.img1v1Url" />
  <view class="mv-artist-name">{{mvDetailData.artist.name}}</view>
</view>
</view>
</template>

<script lang="ts">
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { mvDetail, mvDetailInfo, mvUrl, mvSub } from '@/services/mv'
import './index.scss'
import { reactive, readonly } from 'vue'

export default {
  setup () {
    const params: any = getCurrentInstance().router?.params
    const mvid = readonly(params.id)
    const mvDetailData = reactive({
      name: '',
      playCount: 0,
      shareCount: 0,
      commentCount: 0,
      likedCount: 0,
      liked: false,
      duration: 0,
      publishTime: '',
      desc: '',
      artist: {
        name: '',
        img1v1Url: ''
      },
      info: {}
    })
    const handleMvSub = async () => {
      const data = await mvSub(mvid, mvDetailData.liked ? 0 : 1)
      if (data?.code === 200) {
        Taro.showToast({
          title: `${mvDetailData.liked ? '取消收藏' : '收藏成功'}`,
          icon: 'none',
          duration: 1500
        })
        mvDetailData.liked = !mvDetailData.liked
      }
    }
    const apiGetMvDetail = async () => {
      const { code, data: { name, playCount, commentCount, duration, publishTime, desc, artists } } = await mvDetail(mvid)
      if (code === 200) {
        mvDetailData.name = name
        mvDetailData.playCount = playCount
        mvDetailData.commentCount = commentCount
        mvDetailData.duration = duration
        mvDetailData.publishTime = publishTime
        mvDetailData.desc = desc
        mvDetailData.artist = artists[0]
      }
    }
    apiGetMvDetail()
    const apiGetMvDetailInfo = async () => {
      const { code, likedCount, shareCount, commentCount, liked } = await mvDetailInfo(mvid)
      if (code === 200) {
        mvDetailData.likedCount = likedCount
        mvDetailData.shareCount = shareCount
        mvDetailData.commentCount = commentCount
        mvDetailData.liked = liked
      }
    }
    apiGetMvDetailInfo()
    const apiGetMvUrl = async () => {
      const { code, data } = await mvUrl(mvid)
      if (code === 200) {
        mvDetailData.info = data
      }
    }
    apiGetMvUrl()
    return {
      mvid,
      mvDetailData,
      handleMvSub
    }
  },
}
</script>
