<template>
<!-- 播放器 -->
<view :class="['player', songx.id ? 'show' : null]" @tap="handlePlayerDetail">
  <view class="cover cover-rotate" :style="{'animation-play-state': playerx.paused ? 'paused' : 'running'}"><image class="cover-image" :src="songx.al.picUrl" /></view>
  <view class="song">
    <view class="name">{{songx.name}}</view>
    <view class="info">
      <view class="artist">{{songx.ar[0].name}}</view> -
      <view class="album">{{songx.al.name}}</view>
    </view>
  </view>
  <view class="control">
    <view v-if="playerx.paused" class="at-icon at-icon-play" @tap.stop="handlePlay"></view>
    <view v-else class="at-icon at-icon-pause" @tap.stop="handlePause"></view>
  </view>
  <view class="like"><view class="at-icon at-icon-heart" @tap.stop="handleLike"></view></view>
  <view class="option"><view class="at-icon at-icon-playlist" @tap.stop="handleShowPlayList"></view></view>
</view>
<!-- 播放列表 -->
<AtFloatLayout :isOpened="visibleName === 'song-similist'" title="播放列表" @close="visibleName = ''">
</AtFloatLayout>
<!-- 播放器详情 -->
<PlayerDetail />
</template>

<script lang="ts">
import PlayerDetail from '@/components/player/PlayerDetail.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { likeSong } from '@/services/song'

export default {
  props: {},
  setup() {
    const store = useStore()
    const songx = computed(() => store.state.player.song)
    const playerx = computed(() => store.state.player.player)
    const visibleName = ref()

    const handlePlay = () => {
      store.dispatch('player/PLAY', songx.value.id)
    }
    const handlePause = () => {
      store.dispatch('player/PAUSE')
    }
     const handlePlayerDetail = () => {
        store.dispatch('player/TOGGLE_VISIBLE')
      }

    const handleLike = async () => {
      const data = await likeSong(songx.value.id)
      console.log('data: ', data);
      if (data?.code === 200) {}
    }

    const handleShowPlayList = () => {
      visibleName.value = 'song-similist'
    }

      return {
        songx,
        playerx,
        visibleName,
        handlePlay,
        handleLike,
        handlePause,
        handlePlayerDetail,
        handleShowPlayList
      }
  },
  components: {
    PlayerDetail
  }
}
</script>
<style lang="scss">
.player {
  position: fixed;
  right: 10px;
  bottom: -100%;
  left: 10px;
  padding: 10px;
  background: #999;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ease 1s;
  z-index: 808;
  &.show {
    bottom: 10px;
  }
  & .cover, & .cover-image {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background: #fff;
  }
  & .song {
    flex: 1;
    padding: 0 15px;
  }
  & .name {
    color: #fff;
    font-size: 28px;
  }
  & .info {
    display: flex;
    align-items: center;
    margin-top: 10px;
    color: #666;
    font-size: 22px;
  }
  & .control,& .like, & .option {
    margin-left: 10px;
    color: #fff;
    font-size: 50px;
  }
}
@keyframes rotate {
  form {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.cover-rotate {
  animation: rotate linear 10s .5s infinite;
}
</style>
