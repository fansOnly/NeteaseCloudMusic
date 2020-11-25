<template>
  <template v-for="item in dataList" :key="item.id">
      <view class="pl-list-item active" @tap="handleItemClick(item.id)">
        <view class="pl-list-image">
          <image class="pl-list-img" :src="item.picUrl" />
        </view>
        <view class="pl-list-info">
          <view class="pl-list-name line-clamp-2">{{item.name}}</view>
          <view class="pl-list-desc">{{item.trackCount}}首，by {{item.creator.nickname}}</view>
        </view>
        <view class="pl-list-more"><view class="at-icon at-icon-chevron-right"></view></view>
      </view>
    </template>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'

export default {
  emits: ['clickfn'],
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
  setup(props, {emit}) {
    const handleItemClick = (id: string) => {
      if (props.handleType === 0) {
        handleRoute(`/pages/playlist/detail/index?id=${id}`)
      } else {
        emit('clickfn', id)
      }
    }
    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }
    return {
      handleItemClick
    }
  },
}
</script>
<style lang="scss">
.pl-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
}
.pl-list-image {
  position: relative;
}
.pl-list-img {
  width: 120px;
  height: 120px;
  background: #eee;
  border-radius: 4px;
}
.pl-list-info {
  flex: 1;
  padding: 20px;
}
.pl-list-name {
  font-size: 30px;
}
.pl-list-desc {
  margin-top: 12px;
  color: #999;
  font-size: 24px;
}
.pl-list-more {
  color: #999;
}
</style>
