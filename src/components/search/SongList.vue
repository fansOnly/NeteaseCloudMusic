<template>
    <template v-if="list.length">
    <template v-for="(item, index) in list" :key="'search-song-'+index">
        <view class="search-song-item active" @tap="handlePlayerDetail(item.id)">
          <view class="play">
            <view v-if="songx.id === item.id && !playerx.paused" class="at-icon at-icon-pause" @tap.stop="handlePause"></view>
            <view v-else class="at-icon at-icon-play" @tap.stop="handlePlay(item.id)"></view>
          </view>
          <view class="cont">
            <view class="top">
              <view class="name">{{item.name}}</view>
              <view class="artist">({{item.artists[0].name}})</view>
            </view>
            <view class="bottom">专辑：{{item.album.name}}</view>
          </view>
        </view>
    </template>
    </template>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'songs',
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    setup() {
      const store = useStore()
      const playerx = computed(() => store.state.player.player)
      const songx = computed(() => store.state.player.song)

      const handlePlay = (songid: string) => {
        store.dispatch('player/PLAY', songid)
      }
      const handlePause = () => {
        store.dispatch('player/PAUSE')
      }
      const handlePlayerDetail = (songid: string) => {
        store.dispatch('player/TOGGLE_VISIBLE', songid)
      }
      return {
        songx,
        playerx,
        handlePlay,
        handlePause,
        handlePlayerDetail
      }
    },
}
</script>

<style lang="scss">
.search-song-item {
  display: flex;
  align-items: center;
  position: relative;
  padding: 20px 0;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0;
    border-bottom: 2px solid #f2f2f2;
  }
  & .play {
    width: 50px;
    color: #666;
    font-size: 40px;
  }
  & .cont {
    flex: 1;
    font-size: 26px;
  }
  & .top {
    display: flex;
    align-items: center;
  }
  & .name {
    margin-right: 12px;
    color: #000;
    font-size: 30px;
  }
  & .artist {
    margin-right: 10px;
    color: #999;
    white-space: nowrap;
  }
  & .bottom {
    display: flex;
    align-items: center;
    margin-top: 5px;
    color: #aaa;
  }
}
</style>
