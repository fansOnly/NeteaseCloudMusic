<template>
<SongListTitle :songs="recommendSongList">
  <view class="at-icon at-icon-filter icon-size"></view>
</SongListTitle>
<SongList :data-list="recommendSongList" />
</template>

<script lang="ts">
import SongListTitle from '@/components/song/SongListTitle.vue'
import SongList from '@/components/song/SongList.vue'

import { ref } from 'vue'
import { recommendSongs } from '@/services/music'

export default {
  setup() {
    const recommendSongList = ref([])
    const apiGetRecommendSongs = async () => {
      const { code, data: {dailySongs} } = await recommendSongs()
      if(code === 200) {
        recommendSongList.value = dailySongs
      }
    }
    apiGetRecommendSongs()

    return {
      recommendSongList,
    }
  },
  components: {
    SongListTitle,
    SongList
  }
}
</script>
