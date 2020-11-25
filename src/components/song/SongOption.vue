<template>
  <ActionPanel :visible="visible" button-text="取消" :hHeight="80" @confirm="handleCancel" @cancel="handleCancel" >
    <template #action-panel-header>
      <view class="song-list-left song-option-header border-bottom">
        <image class="song-list-img" :src="song?.al?.picUrl" />
        <view class="song-list-info">
          <view class="song-list-name">{{song.name}}</view>
          <view v-if="song.ar" class="song-list-artist secondary-title">{{song?.ar[0]?.name}}</view>
        </view>
      </view>
    </template>
    <template #action-panel-body>
      <view class="song-setting-body">
        <view class="song-options">
          <view class="song-options-item active" @tap="handleEmit('add-playlist')">
            <view class="at-icon at-icon-file-new icon-size"></view>
            <view class="text">加到歌单</view>
          </view>
          <view v-if="song.ar" class="song-options-item active" @tap="handleRoute(`/pages/artist/detail/index?id=${song?.ar[0]?.id}`)">
            <view class="at-icon at-icon-user icon-size"></view>
            <view class="text">艺人：{{song?.ar[0]?.name}}</view>
          </view>
          <view class="song-options-item active" @tap="handleRoute(`/pages/album/detail/index?id=${song?.al?.id}`)">
            <view class="at-icon at-icon-file-audio icon-size"></view>
            <view class="text">专辑：{{song?.al?.name}}</view>
          </view>
          <view class="song-options-item active">
            <view class="at-icon at-icon-align-center icon-size"></view>
            <view class="text">歌词</view>
          </view>
          <view class="song-options-item active" @tap="handleRoute(`/pages/song/detail/index?id=${song.id}`)">
            <view class="at-icon at-icon-money icon-size"></view>
            <view class="text">歌曲信息</view>
          </view>
          <view class="song-options-item active" @tap="handleEmit('song-like')">
            <view :class="['at-icon icon-size', song.liked ? 'at-icon-heart-2' : 'at-icon-heart']"></view>
            <view class="text">{{song.liked ? '取消收藏' : '收藏'}} {{song.likeCount > 999 ? '999+' : song.likeCount}}</view>
          </view>
          <view class="song-options-item active" @tap="handleEmit('song-share')">
            <view class="at-icon at-icon-share-2 icon-size"></view>
            <view class="text">分享</view>
          </view>
          <view class="song-options-item active" @tap="handleEmit('song-download')">
            <view class="at-icon at-icon-download icon-size"></view>
            <view class="text">下载歌曲</view>
          </view>
          <view class="song-options-item active">
            <view class="at-icon at-icon-external-link icon-size"></view>
            <view class="text">点歌</view>
            <view class="tag">NEW</view>
          </view>
        </view>
      </view>
    </template>
  </ActionPanel>
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'

import Taro from '@tarojs/taro'

export default {
  emits: ['cancel', 'emitup'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    song: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, {emit}) {
    const handleEmit = (val: string) => {
      emit('emitup', val, props.song.id)
    }

    const handleCancel = () => {
      emit('cancel')
    }

    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }

    return {
      handleEmit,
      handleCancel,
      handleRoute
    }
  },
  components: {
    ActionPanel
  }
}
</script>
<style lang="scss">
.song-option-header {
  padding: 30px;
}
.song-options-item {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  & .text {
    margin-left: 20px;
    font-size: 32px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  & .tag {
    margin-left: 10px;
    padding: 4px 10px;
    background: #ee433a;
    border-radius: 2em;
    color: #FFF;
    font-size: 18px;
  }
  & .at-icon-heart-2 {
    color: #ee433a;
  }
}
</style>
