<template>
  <view v-if="userFollowedsList.length" class="user-followeds">
    <template v-for="(item, index) in userFollowedsList" :key="'user-followeds-'+index">
      <view class="user-list-item border-bottom">
        <image class="user-list-img" :src="item.avatarUrl" />
        <view class="user-list-info">
          <view class="user-list-name">{{item.nickname}}</view>
          <view class="user-list-statistics">
            <view class="item">动态<view class="span">{{item.eventCount}}</view></view>
            <view class="item">关注<view class="span">{{item.follows}}</view></view>
            <view class="item">粉丝<view class="span">{{item.followeds}}</view></view>
          </view>
        </view>
        <view class="user-list-more">
          <view class="at-icon at-icon-link icon-size"></view>
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
import { userFolloweds } from '@/services/user'
import './index.scss'

export default {
  setup () {
    const userFollowedsList = ref([])
    const uid = Taro.getStorageSync('profile').userId
    const apiGetUserFolloweds = async () => {
      const data = await userFolloweds(uid)
      if (data?.code === 200) {
        userFollowedsList.value = data.followeds
      }
    }
    apiGetUserFolloweds()
    return {
      userFollowedsList,
    }
  },
  components: {
    Empty
  }
}
</script>
