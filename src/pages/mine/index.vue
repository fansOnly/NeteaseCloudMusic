<template>
  <view class="user-header">
    <view class="user-hd-profile">
      <view class="user-hd-info">
        <view class="user-hd-name">{{user.nickname}}</view>
        <view class="user-hd-vip">LV.{{user.vipType}}</view>
      </view>
      <image class="user-hd-avatar" :src="user.avatarUrl" />
    </view>
    <view class="user-hd-statistics">
      <view class="user-hd-ss-item" @tap="handleRoute('/pages/mine/playhistory/index')">
        <view class="user-hd-ss-item__num">{{user.listenSongs}}</view>
        <view class="user-hd-ss-item__txt">累计播放</view>
      </view>
      <view class="user-hd-ss-item" @tap="handleRoute('/pages/mine/follows/index')">
        <view class="user-hd-ss-item__num">{{user.follows}}</view>
        <view class="user-hd-ss-item__txt">关注</view>
      </view>
      <view class="user-hd-ss-item" @tap="handleRoute('/pages/mine/followeds/index')">
        <view class="user-hd-ss-item__num">{{user.followeds}}</view>
        <view class="user-hd-ss-item__txt">粉丝</view>
      </view>
      <view class="user-hd-ss-item">
        <view class="user-hd-ss-item__num">??</view>
        <view class="user-hd-ss-item__txt">连续签到</view>
      </view>
    </view>
  </view>
  <view class="user-body">
    <AtList :hasBorder="false">
      <AtListItem
        title='会员中心'
        extraText="尊享权益"
        arrow='right'
        :hasBorder="false"
        :iconInfo="{ size: 25, color: '#ee433a', value: 'analytics', }"
      />
      <AtListItem
        title='每日签到'
        arrow='right'
        :hasBorder="false"
        :iconInfo="{ size: 25, color: '#ee433a', value: 'calendar', }"
        @click="handleSignIn"
      />
      <AtListItem
        title='定时关闭'
        arrow='right'
        :hasBorder="false"
        :iconInfo="{ size: 25, color: '#ee433a', value: 'clock', }"
        @click="handleRoute('/pages/mine/timedoff/index')"
      />
      <AtListItem
        title='私信'
        :extraText="user.eventCount+''"
        arrow='right'
        :hasBorder="false"
        :iconInfo="{ size: 25, color: '#ee433a', value: 'bell', }"
        @click="handleRoute('/pages/mine/message/index')"
      />
      <AtListItem
        title='免流量听音乐'
        arrow='right'
        :hasBorder="false"
        :iconInfo="{ size: 25, color: '#ee433a', value: 'lightning-bolt', }"
      />
      <AtListItem
        title='夜间模式'
        isSwitch
        :switchIsCheck="nightMode"
        switchColor="#ee433a"
        :hasBorder="false"
        :iconInfo="{ size: 25, color: '#ee433a', value: 'streaming', }"
        @switchChange="handleSwitchChange"
      />
      <AtListItem
        title='设置'
        arrow='right'
        :hasBorder="false"
        :iconInfo="{ size: 25, color: '#ee433a', value: 'settings', }"
      />
    </AtList>
  </view>
  <view class="user-logout" @tap="handleLogout">退出</view>
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'

import Taro from '@tarojs/taro'
import { reactive, ref } from 'vue'
import { userDetail, daySignin } from '@/services/user'
import { logout } from '@/services/common'
import './index.scss'

export default {
  setup () {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#444444'
    })

    const isLogin = !!Taro.getStorageSync('token')
    if (!isLogin) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
      return
    }
    const user = reactive({
      avatarUrl: '',
      nickname: '',
      vipType: 0,
      userType: 0,
      followeds: 0, // 粉丝
      follows: 0, // 关注
      eventCount: 0,
      listenSongs: 0
    })
    const nightMode = ref(false)
    const handleSwitchChange = (val: boolean) => {
      nightMode.value = !val
    }
    const handleSignIn = async () => {
      const data = await daySignin()
      if (data?.code === 200) {
        Taro.showToast({
          title: '签到成功',
          icon: 'none',
          duration: 1500
        })
      }
    }
    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }
    const handleLogout = async () => {
      const data = await logout()
      if (data?.code === 200) {
        Taro.removeStorageSync('profile')
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('cookie')
        Taro.removeStorageSync('loginType')
        Taro.showToast({
          title: '退出登录',
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          Taro.switchTab({
            url: '/page/index/index'
          })
        }, 1000);
      }
    }
    const uid = Taro.getStorageSync('profile').userId
    const apiGetUserDetail = async () => {
      const { code, profile: { avatarUrl, nickname, vipType, userType, followeds, follows, eventCount }, profile, listenSongs } = await userDetail(uid)
      if (code == 200) {
        user.avatarUrl = avatarUrl
        user.nickname = nickname
        user.vipType = vipType
        user.userType = userType
        user.followeds = followeds
        user.follows = follows
        user.eventCount = eventCount
        user.listenSongs = listenSongs
        Taro.setStorageSync('profile', profile)
      }
    }
    apiGetUserDetail()
    return {
      user,
      nightMode,
      handleSwitchChange,
      handleRoute,
      handleSignIn,
      handleLogout
    }
  },
  components: {
    Player
  }
}
</script>
