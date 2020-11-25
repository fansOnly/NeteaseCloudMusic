<template>
<!-- 创建的歌单 -->
    <view class="cn-title-bar">
      <view class="cn-title">创建的歌单 {{userPl.length}}</view>
      <view class="cn-action"><view class="at-icon at-icon-add icon-size" @tap="visibleName = 'create-pl'"></view></view>
    </view>
    <PlList :data-list="userPl" />
    <!-- 热门歌单 -->
    <view class="cn-title-bar">
      <view class="cn-title">热门歌单</view>
      <view class="cn-action"><view class="at-icon at-icon-reload icon-size" @tap="handleRefreshPl"></view></view>
    </view>
    <PlList :data-list="recommendPlayList" />
    <CreatePl :visible="visibleName === 'create-pl'" @confirm="handleCreatePlConfirm" @cancel="visibleName = ''"></CreatePl>
</template>

<script lang="ts">
import CreatePl from '@/components/playlist/CreatePl.vue'
import PlList from '@/components/playlist/PlList.vue'

import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { recommendResource } from '@/services/music'
import { userPlaylist } from '@/services/user'

export default {
  setup() {
    const visibleName = ref()
    const userPl = ref([])
    const userId = Taro.getStorageSync('profile').userId
    const apiGetUserPlaylist = async () => {
      const data = await userPlaylist(userId)
      if (data?.code === 200) {
        userPl.value = data.playlist
      }
    }
    apiGetUserPlaylist()
    const recommendPlayList = ref([])
    const apiGetRecommendResource = async () => {
      const { code, recommend } = await recommendResource()
      if (code === 200) {
        recommendPlayList.value = recommend
      }
    }
    apiGetRecommendResource()
    const handleRefreshPl = () => {
      apiGetRecommendResource()
    }

    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }

    const handleCreatePlConfirm = () => {
      apiGetUserPlaylist()
    }

    return {
      visibleName,
      recommendPlayList,
      userPl,
      handleRoute,
      handleCreatePlConfirm,
      handleRefreshPl
    }
  },
  components: {
    CreatePl,
    PlList
  }
}
</script>
