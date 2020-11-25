<template>
  <template v-for="item in dataList" :key="item.id">
      <view class="artist-item active" @tap="handleRoute(`/pages/artist/detail/index?id=${item.id}`)">
        <view class="artist-cover"><image class="artist-img" :src="item.picUrl" /></view>
        <view class="artist-info">
          <view class="artist-name">{{item.name}}</view>
          <view class="artist-count">专辑：{{item.albumSize}} 歌曲：{{item.musicSize}}</view>
        </view>
      </view>
    </template>
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
.artist-item {
  display: flex;
  align-items: center;
  padding: 30px;
}
.artist-cover {
  position: relative;
}
.artist-img {
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 100%;
}
.artist-info {
  flex: 1;
  padding: 0 30px;
}
.artist-name {
  font-weight: 500;
}
.artist-count {
  margin-top: 10px;
  color: #999;
  font-size: 24px;
}
</style>
