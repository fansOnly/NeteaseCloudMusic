<template>
<ActionPanel :visible="visible" :hHeight="70" @confirm="handleCancel" @cancel="handleCancel" >
  <template #action-panel-header>
    <view class="song-quality-header">
      <view class="left">
        <view class="t1">选择播放品质</view>
      <view class="t2">选择后应用到全部</view>
      </view>
      <view class="right">
        <view class="t3">自动选择 <view class="at-icon at-icon-help" @tap="handleHelp"></view></view>
        <AtSwitch class="switch" :checked="auto" :border="false" color="#ee433a" @change="handleChange" />
      </view>
    </view>
  </template>
  <template #action-panel-body>
    <view class="song-quality-body">
      <template v-for="(item, index) in qualityList" :key="'song-qa'+index">
        <view :class="['song-quality-item', 'active', !auto && item.value === quality ? 'on' : null]" @tap="handleClick(index)">
          <view class="song-quality-desc">
            <view class="song-quality-title">{{item.label}}
              <view v-if="item.tip" class="song-quality-vip">{{item.tip}}</view>
            </view>
            <view class="song-quality-info">{{item.type}} / {{item.br}} / {{item.size}}</view>
          </view>
          <view v-if="!auto && item.value === quality" class="song-quality-check"><AtCheckbox class="custom-checkbox" :selectedList="[quality]" :options="[{value: item.value}]" /></view>
        </view>
      </template>
    </view>
  </template>
</ActionPanel>
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'
import Taro from '@tarojs/taro'
import { computed, ref, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'

export default {
  emits: ['update', 'cancel'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    qualityList: {
      type: Array,
      default: () => []
    },
    qualityValue: {
      type: String,
      default: ''
    },
  },
  setup(props, {emit}) {
    const store = useStore()
    const playerx = computed(() => store.state.player.player)
    const { qualityList }: any = toRefs(props)
    const auto = ref(playerx.value.autoqa)
    const quality = ref(props.qualityValue)
    watchEffect(() => {
      if (qualityList.value.length) {
        if (auto.value) {
          const qa = qualityList.value.filter(v => !v.tip).slice(-1)[0].value
          if (!quality.value) {
            quality.value = qa
            emit('update', qa)
          }
        } else {
          emit('update', 'nq')
        }
      }
    })
    const handleChange = (val: boolean) => {
      auto.value = val
      if (val) {
        const qa: any = qualityList.value.filter(v => !v.tip).slice(-1)[0]
        quality.value = qa.value
        Taro.showToast({
          title: `当前播放的是${qa.name}`,
          icon: 'none',
          duration: 1500
        })
      }
      store.dispatch('player/UPDATE_PLAYER', {autoqa: val})
      handleUpdate()
    }
    const handleHelp = () => {
      Taro.showToast({
        title: '根据网络环境自动选择',
        icon: 'none',
        duration: 1500
      })
    }
    const handleClick = (index: number) => {
      const { value, name, tip = '' } = qualityList.value[index]
      if (tip) {
        Taro.showToast({
          title: `抱歉，当前播放品质是${tip}`,
          icon: 'none',
          duration: 1500
        })
        // TODO 跳转到vip充值页面
        return
      }
      quality.value = value
      auto.value = false
      Taro.showToast({
        title: `当前播放的是${name}`,
        icon: 'none',
        duration: 1500
      })
      handleUpdate()
    }
    const handleUpdate = () => {
      if(quality.value) {
        emit('update', quality.value)
      } else {
        handleCancel()
      }
    }
    const handleCancel = () => {
      emit('cancel')
    }

    return {
      auto,
      quality,
      handleChange,
      handleHelp,
      handleClick,
      handleCancel,
    }
  },
  components: {
    ActionPanel,
  }
}
</script>
<style lang="scss">
.song-quality-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15PX 30px;
  & .t1 {
    font-size: 40px;
    font-weight: 500;
  }
  & .t2 {
    color: #999;
    font-size: 26px;
  }
  & .right {
    display: flex;
    align-items: center;
    transform: translateX(15px);
  }
  & .t3 {
    font-size: 26px;
  }
  & .at-icon-help {
    color: #999;
    font-size: 32px;
  }
  & .switch {
    margin: 0;
    padding: 0;
    transform: scale(.6);
  }
}
.song-quality-body {
  position: relative;
  padding: 10px 30px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 0;
    -webkit-transform: scaleY(0.5);
      -ms-transform: scaleY(0.5);
          transform: scaleY(0.5);
  border-top: 1PX solid #d6e4ef;
  }
}
.song-quality-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0;
  &.on, &.on .song-quality-info {
    color: #ee433a;
  }
}
.song-quality-desc {
  flex: 1;
}
.song-quality-title {
  display: flex;
  align-items: center;
  font-size: 36px;
}
.song-quality-vip {
  margin-left: 10px;
  padding: 0 10px;
  background: #ee433a;
  border-radius: 4px;
  color: #fff;
  font-size: 22px;
}
.song-quality-info {
  color: #999;
}
</style>
