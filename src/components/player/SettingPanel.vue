<template>
<ActionPanel :visible="visible" button-text="取消" @confirm="handleCancel" @cancel="handleCancel" >
  <template #action-panel-header>
    <view class="song-setting-header border-bottom">
      <view class="volume icon-size">
        <view v-if="volume === 0" class="at-icon at-icon-volume-off"></view>
        <view v-else-if="volume < 50" class="at-icon at-icon-volume-minus"></view>
        <view v-else class="at-icon at-icon-volume-plus"></view>
      </view>
      <view class="volume-bar custom-slider">
        <AtSlider :value="volume" activeColor='#ee433a' backgroundColor='#e5e5e5' blockColor='#ee433a' :blockSize="12" showValue @change="handleVolumeChange" />
      </view>
    </view>
  </template>
  <template #action-panel-body>
    <view class="song-setting-body">
      <view class="play-control border-bottom">
        <view class="play-control-title secondary-title">播放控制</view>
        <view class="play-control-list">
          <view class="play-control-item">
            <view class="icon-size"><view class="at-icon at-icon-sketch"></view></view>
            <view class="text">驾驶模式</view>
          </view>
          <view class="play-control-item">
            <view class="icon-size"><view class="at-icon at-icon-clock"></view></view>
            <view class="text">定时关闭</view>
          </view>
          <view class="play-control-item">
            <view class="icon-size"><view class="at-icon at-icon-equalizer"></view></view>
            <view class="text">均衡器</view>
          </view>
        </view>
      </view>
      <view class="song-options">
        <view class="song-options-title secondary-title">单曲操作：{{songx?.name}}</view>
        <view class="song-options-item active" @tap="handleEmit('add-playlist')">
          <view class="at-icon at-icon-file-new icon-size"></view>
          <view class="text">加到歌单</view>
        </view>
        <view class="song-options-item active" @tap="handleRoute(`/pages/artist/detail/index?id=${songx.ar[0].id}`)">
          <view class="at-icon at-icon-user icon-size"></view>
          <view class="text">艺人：{{songx.ar[0].name}}</view>
        </view>
        <view class="song-options-item active" @tap="handleRoute(`/pages/album/detail/index?id=${songx.al.id}`)">
          <view class="at-icon at-icon-file-audio icon-size"></view>
          <view class="text">专辑：{{songx.al.name}}</view>
        </view>
        <view class="song-options-item active" @tap="handleEmit('song-similist')">
          <view class="at-icon at-icon-playlist icon-size"></view>
          <view class="text">播放列表</view>
        </view>
        <view class="song-options-item active">
          <view class="at-icon at-icon-align-center icon-size"></view>
          <view class="text">歌词</view>
        </view>
        <view class="song-options-item active" @tap="handleRoute(`/pages/song/detail/index?id=${songx.id}`)">
          <view class="at-icon at-icon-money icon-size"></view>
          <view class="text">歌曲信息</view>
        </view>
        <view class="song-options-item active" @tap="handleEmit('song-like')">
          <view :class="['at-icon', songx.t === 0 ? 'at-icon-heart' : 'at-icon-heart-2' ,'icon-size']"></view>
          <view class="text">{{songx.t === 0 ? '收藏' : '取消收藏'}} {{songx.likeCount > 999 ? '999+' : songx.likeCount}}</view>
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
        <view class="song-options-item active">
          <view class="at-icon at-icon-alert-circle icon-size"></view>
          <view class="text">举报</view>
        </view>
      </view>
    </view>
  </template>
</ActionPanel>
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'

import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  emits: ['cancel', 'emitup'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  setup(props, {emit}) {
    const store = useStore()
    const playerx = computed(() => store.state.player.player)
    const songx = computed(() => store.state.player.song)
    const volume = ref(playerx.value.volume * 100)
    const handleVolumeChange = (val: number) => {
      volume.value = val
      store.dispatch('player/UPDATE_PLAYER', { volume: val / 100 })
    }

    const handleEmit = (val: string) => {
      emit('emitup', val, [songx.value.id])
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      songx,
      volume,
      handleVolumeChange,
      handleEmit,
      handleCancel,
    }
  },
  components: {
    ActionPanel,
  }
}
</script>
<style lang="scss">
.song-setting-header {
  display: flex;
  align-items: center;
  padding: 10PX 0;
}
.volume {
  width: 60px;
  margin-left: 30px;
  height: 30PX;
  line-height: 30PX;
  & .at-icon-volume-minus {
    margin-left: 2px;
  }
  & .at-icon-volume-plus {
    margin-left: 5px;
    font-size: 48px;
  }
}
.volume-bar {
  flex: 1;
}
.play-control {
  padding: 30px;
}
.play-control-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
}
.play-control-item {
  width: 33%;
  text-align: center;
  & .text {
    margin-top: 10px;
    font-size: 24px;
  }
}
.song-options {
  padding: 30px 0;
}
.song-options-title {
  padding: 30px;
}
</style>
