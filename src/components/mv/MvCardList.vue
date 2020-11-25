<template>
<view class="mv-card-list">
  <template v-for="item in dataList" :key="item.id">
      <view class="mv-card-item" @tap="handleRoute(`/pages/mv/detail/index?id=${item.id}`)">
        <view class="mv-card-cover">
          <view class="mv-card-play-mask">
            <view class="at-icon at-icon-play"></view>
          </view>
          <image class="mv-card-img" :src="item.cover" />
        </view>
        <view class="mv-card-name line-clamp-1">{{item.name}}</view>
        <view class="mv-card-info">
          <view class="mv-card-txt">{{item.artistName}}</view>
          <view class="mv-card-txt">播放：{{item.playCount}}</view>
        </view>
      </view>
    </template>
</view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'

export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }

    return {
      handleRoute
    }
  }
}
</script>
<style lang="scss">
.mv-card-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px;
}
.mv-card-item {
  width: 48%;
  margin-bottom: 20px;
}
.mv-card-cover {
  position: relative;
}
.mv-card-play-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
  & .at-icon-play {
    width: 80px;
    height: 80px;
    background: rgba(0, 0, 0, .4);
    border-radius: 100%;
    color: #fff;
    font-size: 50px;
    text-align: center;
    text-indent: 10px;
    line-height: 80px;
  }
}
.mv-card-img {
  display: block;
  width: 100%;
  height: 200px;
  border-radius: 4px;
}
.mv-card-name {
  margin-top: 10px;
  font-weight: 500;
}
.mv-card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}
.mv-card-txt {
  color: #999;
  font-size: 22px;
}
</style>
