<template>
  <SongListTitle title="播放全部" :songs="hotSongList">
  <view class="at-icon at-icon-filter icon-size"></view>
</SongListTitle>
  <SongList :data-list="hotSongList" />

<Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import SongList from '@/components/song/SongList.vue'
import SongListTitle from '@/components/song/SongListTitle.vue'

import Taro, { getCurrentInstance } from '@tarojs/taro'
import { readonly, ref } from 'vue'
import { artists } from '@/services/artist'

export default {
  setup () {
    const params: any = getCurrentInstance().router?.params
    const artistid = readonly(params.id)

    const hotSongList = ref([])

    const apiGetArtist = async () => {
      const { code, hotSongs } = await artists(artistid)
      if (code === 200) {
        hotSongList.value = hotSongs
      }
    }
    apiGetArtist()

      const handleRoute = (url: string) => {
        Taro.navigateTo({url})
      }
    return {
      artistid,
      hotSongList,
      handleRoute
    }
  },
  components: {
    Player,
    SongList,
    SongListTitle
  }
}
</script>
