<template>
  <view class="user-timedoff">
    <view class="user-timedoff-tips border-bottom">{{countdown.val > 0 ? countdown.text : '计时结束'}}后，将自动暂停正在播放的歌曲</view>
    <view class="user-timedoff-list">
      <template v-for="(item, index) in timedoffList" :key="'timedoff-'+index">
        <view class="user-timedoff-item active" @tap="handleCheck(item.value, item.type)">
          <view class="user-timedoff-item-name">{{item.name}}</view>
          <view v-show="timedoff.val === item.value" class="user-timedoff-item-check"><AtCheckbox class="custom-checkbox" :selectedList="[timedoff.val]" :options="[{value: item.value}]" /></view>
        </view>
      </template>
    </view>
  </view>
  <!-- 貌似picker组件不兼容3.0 -->
  <!-- <Picker v-show="visibleName === 'timedoff-picker'" mode="selector" :value="customVal.value" @change="handleChange" @cancel="handleCancel" /> -->
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'

import { computed, reactive, ref } from 'vue'
import './index.scss'
import { useStore } from 'vuex'
import { timestampToDate, createRangeRandNumber } from '@/utils/util'

export default {
  setup () {
    const store = useStore()
    let timer: any
    const timedoffList = ref([
      { name: '不开启', value: 0, type: 0 },
      { name: '15分钟' , value: 15 * 60, type: 1 },
      { name: '30分钟' , value: 30 * 60, type: 1 },
      { name: '45分钟' , value: 45 * 60, type: 1 },
      { name: '60分钟' , value: 60 * 60, type: 1 },
      { name: '自定义' , value: -1, type: 2 },
    ])
    const timedoff = reactive({
      type: 0,
      val: 0
    })
    const countdown = reactive({
      val: 0,
      text: computed(() => timestampToDate(countdown.val, true))
    })
    const handleCheck = (val: number, type: number) => {
      countdown.val = timedoff.val = val
      timedoff.type = type
      if (type === 0) {
        if (timer) { // 不开启
          clearInterval(timer)
          timer = null
        }
      } else if (type === 1) { // 开启
        if (timer) {
          clearInterval(timer)
        }
        timer = setInterval(() => {
          countdown.val--
          if (countdown.val === 0) {
            store.dispatch('player/PAUSE')
          }
        }, 1000)
      } else { // 自定义，此次模拟随机设置时间
        timedoffList.value[timedoffList.value.length -1].value = countdown.val = timedoff.val = createRangeRandNumber(60, 599)
        if (timer) {
          clearInterval(timer)
        }
        timer = setInterval(() => {
          countdown.val--
          if (countdown.val === 0) {
            store.dispatch('player/PAUSE')
          }
        }, 1000)
      }
    }
    return {
      timedoffList,
      timedoff,
      countdown,
      handleCheck,
    }
  },
  components: {
    Player
  }
}
</script>
