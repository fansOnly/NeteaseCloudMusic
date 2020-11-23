<template>
  <view v-if="userPrivateList.length" class="user-private">
    <template v-for="(item, index) in userPrivateList" :key="'user-private-'+index">
      <view class="user-list-item">
        <image class="user-list-img" src="" />
        <view class="user-list-info">
          <view class="user-list-name line-clamp-2"></view>
          <view class="user-list-artist"></view>
        </view>
        <view class="user-list-more">
          <view class="at-icon at-icon-link"></view>
        </view>
      </view>
    </template>
  </view>
  <Empty v-else />
</template>

<script lang="ts">
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
    Empty
  }
}
</script>
