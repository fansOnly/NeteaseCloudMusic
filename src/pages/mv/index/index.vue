<template>
  <view class="inner-padding">
      <Classify :active="classify.area" :data-list="mvAreaList" @update="handleUpdate('area', $event)" />
      <view class="top-margin">
        <Classify :active="classify.type" :data-list="mvTypeList" @update="handleUpdate('type', $event)" />
      </view>
      <view class="top-margin">
        <Classify :active="classify.order" :data-list="mvOrderList" @update="handleUpdate('order', $event)" />
      </view>
    </view>
    <view class="inner-padding">
      <MvList :data-list="mvList" />
  </view>
</template>

<script lang="ts">
import Classify from '@/components/common/Classify.vue'
import MvList from '@/components/mv/MvList.vue'

import { reactive, readonly, ref, watchEffect } from 'vue'
import { mvAll } from '@/services/mv'
import { MV_AREAS, MV_TYPES, MV_ORDERS } from '@/config/constants'

export default {
  setup() {
    const mvAreaList = readonly(MV_AREAS)
    const mvTypeList = readonly(MV_TYPES)
    const mvOrderList = readonly(MV_ORDERS)
    const classify = reactive({
      area: '全部',
      type: '全部',
      order: '上升最快'
    })
    const handleUpdate = (prop: string, val: string) => {
      classify[prop] = val
    }

    const mvList = ref([])
    const apiGetMvAll = async (area, type, order) => {
      const { code, data } = await mvAll({area, type, order})
      if (code === 200) {
        mvList.value = data
      }
    }

    watchEffect(() => {
      apiGetMvAll(classify.area, classify.type, classify.order)
    })

    return {
      mvAreaList,
      mvTypeList,
      mvOrderList,
      classify,
      mvList,
      handleUpdate
    }
  },
  components: {
    Classify,
    MvList
  }
}
</script>
