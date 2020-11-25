<template>
<view class="song-list-title-bar border-bottom">
    <view class="play">
      <view class="play-area" @tap="handleMultiPlay">
        <view class="at-icon at-icon-play"></view> {{title}}
      </view>
      <view class="secondary-title">{{songs.length}}首</view>
      </view>
    <view class="more secondary-color">
      <slot></slot>
    </view>
  </view>
  <Player />
</template>

<script>
import Player from '@/components/player/Player.vue'
import { useStore } from 'vuex'
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '随机播放'
    }
  },
  setup(props) {
    const store = useStore()
    const handleMultiPlay = () => {
      store.dispatch('player/MULTI_PLAY', props.songs)
    }
    return {
      handleMultiPlay
    }
  },
  components: {
    Player
  }
}
</script>
<style lang="scss">
.song-list-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 30px;
  line-height: 80px;
  & .play {
    display: flex;
    align-items: center;
  }
  & .play-area {
    display: flex;
    align-items: center;
    margin-right: 10px;
    color: #ee433a;
    font-weight: 500;
  }
  & .more {
    color: #444;
  }
}
</style>
