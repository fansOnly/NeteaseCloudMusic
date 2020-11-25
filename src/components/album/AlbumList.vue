<template>
<view class="album-card-list">
  <template v-for="item in dataList" :key="item.id">
      <view class="album-card-item" @tap="handleRoute(`/pages/album/detail/index?id=${item.id}`)">
        <view class="album-card-cover"><image class="album-card-img" :src="item.picUrl" /></view>
        <view class="album-card-name line-clamp-1">{{item.name}}</view>
        <view class="album-card-txt">{{item.artist.name}}</view>
        <view class="album-card-txt">{{formatDate(item.publishTime, 'YYYY-MM-DD')}}</view>
      </view>
    </template>
</view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
import { formatDate } from '@/utils/util'

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
      formatDate,
      handleRoute
    }
  }
}
</script>
<style lang="scss">
.album-card-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.album-card-item {
  width: 30%;
  margin-bottom: 20px;
  text-align: center;
}
.album-card-cover {
  position: relative;
}
.album-card-img {
  width: 100%;
  height: 180px;
  border-radius: 4px;
}
.album-card-name {
  margin-top: 10px;
  font-weight: 500;
}
.album-card-txt {
  margin-top: 5px;
  color: #999;
  font-size: 22px;
}
</style>
