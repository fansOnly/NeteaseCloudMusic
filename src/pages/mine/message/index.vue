<template>
  <view v-if="userPrivateList.length" class="user-private">
    <template v-for="(item, index) in userPrivateList" :key="'user-private-'+index">
      <view class="song-list-item">
        <image class="song-list-img" src="" />
        <view class="song-list-info">
          <view class="song-list-name line-clamp-2"></view>
          <view class="song-list-artist"></view>
        </view>
        <view class="song-list-more">
          <view class="at-icon at-icon-link"></view>
        </view>
      </view>
    </template>
  </view>
  <Empty v-else />
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import Empty from '@/components/common/Empty.vue'

import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { userPrivate } from '@/services/user'
import './index.scss'

export default {
  setup () {
    const userPrivateList = ref([])
    const apiGetUserPrivate = async () => {
      // 默认查询一周的记录
      const data = await userPrivate()
      if (data?.code === 200) {
        userPrivateList.value = data.msgs
      }
    }
    apiGetUserPrivate()
    return {
      userPrivateList,
    }
  },
  components: {
    Player,
    Empty
  }
}
</script>
