<template>
  <view :class="['action-panel-wrap', visible ? 'show' : null]" :style="{'z-index': zIndex, 'height': fullHeight ? visible ? '100%' : '0' : '65%'}">
    <view class="action-panel-header" :style="{height: `${hHeight}PX`}">
      <slot name="action-panel-header"></slot>
    </view>
    <view class="action-panel-body" :style="{height: `calc(100% - ${hHeight}PX - ${fHeight}PX)`}">
      <slot name="action-panel-body"></slot>
    </view>
    <view class="action-panel-footer" :style="{height: `${fHeight}PX`}">
      <view v-if="withFooter" class="default-panel-footer border-top">
        <view class="action-panel-button" :style="{lineHeight: `calc(${fHeight-20}PX)`}" @tap="handleConfirm">{{buttonText}}</view>
      </view>
      <slot name="action-panel-footer"></slot>
    </view>
  </view>
  <view v-show="withMask && visible" class="action-panel-mask" :style="{'z-index': zIndex - 1}" @tap="handleCancel"></view>
</template>

<script lang="ts">
export default {
  name: 'action-panel',
  emits: ['confirm', 'cancel'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fullHeight: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 900
    },
    buttonText: {
      type: String,
      default: '确定'
    },
    withFooter: {
      type: Boolean,
      default: true
    },
    withMask: {
      type: Boolean,
      default: true
    },
    hHeight: {
      type: Number,
      default: 50
    },
    fHeight: {
      type: Number,
      default: 60
    },
  },
  setup(props, { emit }) {
    const handleConfirm = () => emit('confirm')
    const handleCancel = () => emit('cancel')

    return {
      handleConfirm,
      handleCancel,
    }
  }
}
</script>

<style lang="scss">
.action-panel-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
}
.action-panel-wrap {
  position: fixed;
  right: 0;
  bottom: -100%;
  left: 0;
  height: 0;
  background: #fff;
  border-radius: 8px;
  transition: all ease .5s;
  overflow-y: scroll;
  &.show {
    bottom: 0;
  }
}
.action-panel-body {
  overflow-y: scroll;
}
.default-panel-footer {
  padding: 10PX 30px;
}
.action-panel-button {
  width: 100%;
  background: #eee;
  font-size: 30px;
  text-align: center;
  &:active {
    background: #ddd;
  }
}
</style>
