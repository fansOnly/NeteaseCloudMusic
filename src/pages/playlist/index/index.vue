<template>
  <view class="inner-padding">
      <view class="all-cats">
        <view class="some-cats">
          <Classify :active="classify.cat" :data-list="plCatList" @update="handleUpdate('cat', $event)" />
        </view>
        <view class="show-all-cats" @tap="handleOpen('pl-all-cats')">全部</view>
      </view>
      <view class="top-margin">
        <Classify :active="classify.order" :data-list="plOrderList" @update="handleUpdate('order', $event)" />
      </view>
  </view>
  <PlCardList :data-list="plList" />
  <ActionPanel :visible="visibleName === 'pl-all-cats'" :with-footer="false" :with-mask="false" :hHeight="40" :fHeight="0" full-height :z-index="899">
  <template #action-panel-header>
    <view class="player-detail-header">
      <view class="at-icon at-icon-chevron-down icon-size" @tap="handlePackup"></view>
      <view class="indicator">选择分类</view>
      <view class="at-icon at-icon-chevron-down icon-size" style="visibility: hidden;"></view>
    </view>
  </template>
    <template #action-panel-body>
      <view class="pl-cats-body">
        <template v-for="(item, index) in plCategories" :key="'pl-allcats-'+index">
          <view class="pl-allcats-title">{{item.name}}</view>
          <view class="pl-subcats-list">
            <template v-for="(citem, cindex) in item.children" :key="'pl-subcats-'+cindex">
            <!-- <view class="pl-subcats-item">{{citem.name}}</view> -->
            <view :class="['pl-subcats-item', classify.cat == citem.value ? 'on' : null]" @tap="handleClassifyClick(citem.value)">{{citem.name}}</view>
          </template>
          </view>
        </template>
      </view>
    </template>
  </ActionPanel>
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import ActionPanel from '@/components/func/ActionPanel.vue'
import Classify from '@/components/common/Classify.vue'
import PlCardList from '@/components/playlist/PlCardList.vue'

import { reactive, readonly, ref, watchEffect } from 'vue'
import { plCatlist, topPl } from '@/services/playlist'
import { getRandsFromArray } from '@/utils/util'
import './index.scss'

export default {
  setup () {
    const classify = reactive({
      cat: '全部',
      order: 'hot',
    })
    const plOrderList = readonly([
      { name: '最热', value: 'hot' },
      { name: '最新', value: 'new' }
    ])
    const plCatList = ref([])
    const plCategories = ref<any>([])
    const apiGetPlCatlist = async () => {
      const { code, sub, categories } = await plCatlist()
      if (code === 200) {
        const subList = sub.map(v => {
          v.value = v.name
          return v
        })
        plCatList.value = getRandsFromArray(subList, 5)
        const plCatsTree = objectToArray(categories)
        plCatsTree.map((v: any) => {
          v.children = subList.filter(k => k.category == v.value)
        })
        plCategories.value = plCatsTree
      }
    }
    apiGetPlCatlist()
    const objectToArray = <U>(obj: any): U[] => {
      let arr: any = []
      for (let key in Object.keys(obj)) {
          arr.push({ "name": obj[key],"value": key })
      }
      return arr
    }
    const handleUpdate = (prop: string, val: string) => {
      classify[prop] = val
    }

    const plList = ref([])
    const apiGettopPl = async (cat: string, order: string) => {
      const { code, playlists } = await topPl({cat, order})
      if (code === 200) {
        plList.value = playlists
      }
    }
    watchEffect(() => {
      apiGettopPl(classify.cat, classify.order)
    })

    const visibleName = ref()
    const handleOpen = (val: string) => {
      visibleName.value = val
    }
    const handlePackup = () => {
      visibleName.value = ''
    }
    const handleClassifyClick = (val: string) => {
      classify.cat = val
      handlePackup()
    }

    return {
      classify,
      plOrderList,
      plCatList,
      plCategories,
      plList,
      visibleName,
      handleUpdate,
      handleOpen,
      handlePackup,
      handleClassifyClick
    }
  },
  components: {
    Player,
    ActionPanel,
    Classify,
    PlCardList
  }
}
</script>
