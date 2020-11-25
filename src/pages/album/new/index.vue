<template>
  <view class="inner-padding">
    <Classify :active="classify.area" :data-list="alAreaList" @update="handleUpdate('area', $event)" />
  </view>
  <view class="inner-padding">
    <AlbumList :data-list="albumList" />
  </view>
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import Classify from '@/components/common/Classify.vue'
import AlbumList from '@/components/album/AlbumList.vue'

import { reactive, readonly, ref, watchEffect } from 'vue'
import { albumNew } from '@/services/album'
import { ALBUM_NEW_CLASSIFY } from '@/config/constants'
import './index.scss'

export default {
  setup() {
    const alAreaList = readonly(ALBUM_NEW_CLASSIFY)
    const classify = reactive({
      area: 'ALL'
    })
    const handleUpdate = (prop: string, val: string) => {
      classify[prop] = val
    }

    const albumList = ref([])
    const apiGetAlbumList = async (area) => {
      const { code, albums } = await albumNew({area})
      if (code === 200) {
        albumList.value = albums
      }
    }
    watchEffect(() => {
      apiGetAlbumList(classify.area)
    })

    return {
      albumList,
      alAreaList,
      classify,
      handleUpdate
    }
  },
  components: {
    Player,
    Classify,
    AlbumList
  }
}
</script>
