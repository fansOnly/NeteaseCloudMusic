<template>
  <view class="inner-padding">
    <Classify :active="classify.type+''" :data-list="arTypeList" @update="handleUpdate('type', $event)" />
    <view class="top-margin">
      <Classify :active="classify.area+''" :data-list="arAreaList" @update="handleUpdate('area', $event)" />
    </view>
  </view>
  <ArList :data-list="arList" />
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import Classify from '@/components/common/Classify.vue'
import ArList from '@/components/artist/ArList.vue'

import { reactive, readonly, ref, watchEffect } from 'vue'
import { artistList } from '@/services/artist'
import { ARTIST_TYPES, ARTIST_AREAS } from '@/config/constants'
import './index.scss'

export default {
  setup() {
    const arTypeList = readonly(ARTIST_TYPES)
    const arAreaList = readonly(ARTIST_AREAS)
    const classify = reactive({
      type: -1,
      area: -1
    })
    const handleUpdate = (prop: string, val: string) => {
      classify[prop] = val
    }

    const arList = ref([])
    const listParam = reactive({
      page: 1,
      limit: 10,
      offset: 0,
      more: false
    })
    const apiGetArtistList = async (offset, type, area) => {
      const { code, artists, more } = await artistList({limit: listParam.limit, offset, type, area})
      if (code === 200) {
        arList.value = artists
        listParam.more = more
      }
    }
    watchEffect(() => {
      apiGetArtistList(listParam.offset, classify.type, classify.area)
    })
      // TODO 触底加载？？
      // const { more, limit, page } = listParam
      // if (more) {
      //   listParam.page++
      //   listParam.offset = (page - 1) * limit
      // }

    return {
      arList,
      arTypeList,
      arAreaList,
      classify,
      handleUpdate
    }
  },
  components: {
    Classify,
    ArList,
    Player
  }
}
</script>
