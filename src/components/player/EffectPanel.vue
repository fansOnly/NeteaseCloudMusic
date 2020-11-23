<template>
<ActionPanel :visible="visible" button-text="取消" :hHeight="0" @confirm="handleCancel" @cancel="handleCancel" >
  <template #action-panel-body>
    <view class="song-effect-body">
      <template v-for="(item, index) in effectList" :key="'song-effect'+index">
        <view :class="['song-effect-item', 'active', item.value === effect ? 'on' : null]" @tap="handleClick(index)">
          <view class="song-effect-icon"><view :class="['at-icon', item.icon]"></view></view>
          <view class="song-effect-name">{{item.name}}</view>
          <view v-if="item.value === effect" class="song-effect-check"><AtCheckbox class="custom-checkbox" :selectedList="[effect]" :options="[{value: item.value}]" /></view>
        </view>
      </template>
    </view>
  </template>
</ActionPanel>
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'
import { ref, toRefs } from 'vue'
import { PLAY_EFFECTS } from '@/config/constants'

export default {
  emits: ['update', 'cancel'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    effectValue: {
      type: String,
      default: ''
    },
  },
  setup(props, {emit}) {
    const { effectValue } = toRefs(props)
    const effect = ref(effectValue.value)
    const effectList = ref(PLAY_EFFECTS)
    const handleClick = (index: number) => {
      const eff = effectList.value[index]
      effect.value = eff.value
      emit('update', eff.value)
    }
    const handleCancel = () => {
      emit('cancel')
    }

    return {
      effect,
      effectList,
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
.song-effect-body {
  position: relative;
  padding: 10px 0;
}
.song-effect-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  &.on {
    color: #ee433a;
  }
}
.song-effect-icon {
  margin-right: 40px;
  font-size: 40px;
}
.song-effect-name {
  flex: 1;
  font-size: 30px;
}
</style>
