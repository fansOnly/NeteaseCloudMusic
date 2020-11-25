<template>
<view class="artist-card-list">
  <template v-for="item in dataList" :key="item.id">
      <view class="artist-card-item" @tap="handleRoute(`/pages/artist/detail/index?id=${item.id}`)">
        <view class="artist-card-cover"><image class="artist-card-img" :src="item.picUrl" /></view>
        <view class="artist-card-name line-clamp-1">{{item.name}}</view>
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
.artist-card-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.artist-card-item {
  width: 30%;
  margin-bottom: 20px;
  text-align: center;
}
.artist-card-cover {
  position: relative;
}
.artist-card-img {
  width: 100%;
  height: 180px;
  border-radius: 4px;
}
.artist-card-name {
  margin-top: 10px;
  font-weight: 500;
}
</style>
