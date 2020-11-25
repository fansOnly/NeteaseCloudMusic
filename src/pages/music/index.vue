<template>
<view class="music-header">
  <view class="music-header-title">
    <template v-for="(item, index) in tabItems" :key="'music-tab-'+index">
    <view :class="['music-header-item', activeName === item.value ? 'on' : null]" @tap="handleTabChange(item.value)">{{item.name}}</view>
  </template>
  </view>
  <view class="music-header-option"><view class="at-icon at-icon-settings icon-size secondary-color"></view></view>
</view>
<view class="music-body">
  <view class="music-list">
    <keep-alive>
      <component :is="activeName"></component>
    </keep-alive>
  </view>
</view>
<Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import Lastest from '@/components/music/Lastest.vue'
import Song from '@/components/music/Song.vue'
import Playlist from '@/components/music/Playlist.vue'
import Other from '@/components/music/Other.vue'

import { readonly, ref } from 'vue'
import './index.scss'

export default {
  setup () {
    const tabItems = readonly([
      { name: '最近', value: 'lastest' },
      { name: '歌曲', value: 'song' },
      { name: '歌单', value: 'playlist' },
      { name: '其他', value: 'other' },
    ])
    const activeName = ref('lastest')

    const handleTabChange = (val: string) => {
      activeName.value = val
    }
    return {
      tabItems,
      activeName,
      handleTabChange
    }
  },
  components: {
    Player,
    Lastest,
    Song,
    Playlist,
    Other
  }
}
</script>
