<template>
    <template v-for="item in dataList" :key="item.id">
      <view class="mv-item" @tap="handleMvPlay(item.id)">
        <view class="mv-cover">
          <video v-if="mv.mvid === item.id && mv.url" id="mv" class="mv-video" :src="mv.url" :autoplay="true" object-fit="cover"></video>
          <image class="mv-cover-img" :src="item.cover" />
          <view class="at-icon at-icon-play"></view>
          <view class="mv-duration">{{timestampToDate(item.duration / 1000)}}</view>
        </view>
        <view class="mv-name">{{item.name}}</view>
        <view class="mv-info">
          <view class="mv-artist">{{item.artistName}} 播放：{{item.playCount}}</view>
          <view class="mv-option icon-size">
            <view :class="['at-icon', item.liked ? 'at-icon-heart-2' : 'at-icon-heart']" @tap="handleMvSub(item.id)"></view>
            <view class="at-icon at-icon-message"></view>
            <view class="at-icon at-icon-share"></view>
          </view>
        </view>
      </view>
    </template>
</template>

<script lang="ts">
import { reactive } from 'vue'
import { mvUrl, mvSub } from '@/services/mv'
import { timestampToDate } from '@/utils/util'

export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const mv = reactive({
      mvid: '',
      url: ''
    })
    const handleMvPlay = async(mvid: string) => {
      const { code, data } = await mvUrl(mvid)
      if (code === 200) {
        mv.mvid = mvid
        mv.url = data.url
      }
    }
    const handleMvSub = async (mvid: string) => {
      const data = await mvSub(mvid, 1)
      if (data?.code === 200) {
        Taro.showToast({
          title: '收藏成功',
          icon: 'none',
          duration: 1500
        })
      }
    }
    return {
      timestampToDate,
      mv,
      handleMvPlay,
      handleMvSub
    }
  }
}
</script>
<style lang="scss">
.mv-item {
  margin-bottom: 30px;
}
.mv-cover {
  position: relative;
  width: 100%;
  height: 400px;
  & .at-icon-play {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 80px;
    margin: auto;
    background: rgba(0, 0, 0, .4);
    border-radius: 100%;
    color: #fff;
    font-size: 50px;
    text-align: center;
    text-indent: 10px;
    line-height: 80px;
  }
}
.mv-video {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 400px;
  z-index: 2;
}
.mv-cover-img {
  width: 100%;
  height: 400px;
}
.mv-duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: inline-block;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}
.mv-name {
  margin-top: 20px;
  font-size: 30px;
  font-weight: 500;
}
.mv-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
.mv-artist {
  color: #999;
  font-size: 26px;
}
.mv-option {
  display: flex;
  align-items: center;
  & .at-icon {
    margin-left: 30px;
    color: #999;
  }
  & .at-icon-heart-2 {
    color: #ee433a;
  }
}
</style>
