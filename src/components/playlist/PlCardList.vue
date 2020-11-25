<template>
  <view class="pl-card-list">
    <template v-for="item in dataList" :key="item.id">
      <view class="pl-card-item" @tap="handleRoute(`/pages/playlist/detail/index?id=${item.id}`)">
        <view class="pl-card-cover">
          <image class="pl-card-img" :src="item.coverImgUrl" />
          <view class="pl-card-count"><view class="at-icon at-icon-play"></view>{{formatNumber(item.playCount)}}</view>
        </view>
        <view class="pl-card-info">
          <view class="pl-card-name line-clamp-2">{{item.name}}</view>
          <view class="pl-card-creator line-clamp-2">{{item.creator.nickname}}</view>
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
import { formatNumber } from '@/utils/util'

export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    handleType: { // 0-跳转 1-点击
      type: Number,
      default: 0
    }
  },
  setup() {
    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }
    return {
      formatNumber,
      handleRoute
    }
  },
}
</script>
<style lang="scss">
.pl-card-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px;
}
.pl-card-item {
  width: 30%;
  margin-bottom: 30px;
}
.pl-card-cover {
  position: relative;
}
.pl-card-img {
  width: 100%;
  height: 200px;
  border-radius: 4px;
}
.pl-card-count {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.6);
  border-bottom-left-radius: 15px;
  border-top-right-radius: 4px;
  color: #fff;
  font-size: 22px;
  & .at-icon-play {
    vertical-align: top;
  }
}
.pl-card-info {
  margin-top: 15px;
}
.pl-card-creator {
  margin-top: 10px;
  color: #999;
  font-size: 22px;
}
</style>
