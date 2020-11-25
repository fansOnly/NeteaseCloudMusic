<template>
  <view v-if="userRecordList.length" class="user-record">
    <SongList :data-list="userRecordList" />
  </view>
  <Empty v-else />
  <Player />
</template>

<script lang="ts">
import SongList from '@/components/song/SongList.vue'
import Empty from '@/components/common/Empty.vue'
import Player from '@/components/player/Player.vue'

import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { userRecord } from '@/services/user'
import './index.scss'

export default {
  setup () {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
    const userRecordList = ref([])
    const uid = Taro.getStorageSync('profile').userId
    const apiGetUserRecord = async () => {
      // 默认查询一周的记录
      const data = await userRecord(uid, 1)
      if (data?.code === 200) {
        userRecordList.value = data.weekData.map(v => v.song)
      }
    }
    apiGetUserRecord()
    return {
      userRecordList,
    }
  },
  components: {
    Empty,
    SongList,
    Player
  }
}
</script>
