<template>
<SongListTitle :songs="userRecordList">
  <view class="at-icon at-icon-filter icon-size"></view>
</SongListTitle>
<SongList :data-list="userRecordList" />
</template>

<script lang="ts">
import SongListTitle from '@/components/song/SongListTitle.vue'
import SongList from '@/components/song/SongList.vue'

import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { userRecord } from '@/services/user'

export default {
  setup() {
    const userRecordList = ref([])
    const userId = Taro.getStorageSync('profile').userId
    const apiGetUserRecord = async () => {
      const { code, weekData } = await userRecord(userId)
      if (code === 200) {
        userRecordList.value = weekData.map(v => v.song)
      }
    }
    apiGetUserRecord()

    return {
      userRecordList,
    }
  },
  components: {
    SongListTitle,
    SongList
  }
}
</script>
