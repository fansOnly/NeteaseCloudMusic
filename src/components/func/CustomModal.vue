<template>
  <view v-show="visible" class="custom-modal-wrap" :style="{'z-index': zIndex, 'width': width}">
    <view v-if="title" class="custom-modal-header border-bottom">{{title}}</view>
    <view class="custom-modal-body">
      <slot name="custom-modal-body"><view style="text-align:center;">{{content}}</view></slot>
    </view>
    <view class="custom-modal-footer border-top">
      <slot name="custom-modal-footer">
        <view v-if="withCancel" class="custom-modal-button cancel" @tap="handleCancel">{{cancelText}}</view>
        <view v-if="withConfirm" class="custom-modal-button confirm" @tap="handleConfirm">{{confirmText}}</view>
      </slot>
    </view>
  </view>
  <view v-show="visible" class="custom-modal-mask" :style="{'z-index': zIndex - 1}" @tap="handleCancel"></view>
</template>

<script lang="ts">
export default {
  name: 'custom-modal',
  emits: ['confirm', 'cancel'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '70%'
    },
    zIndex: {
      type: Number,
      default: 955
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    withCancel: {
      type: Boolean,
      default: true
    },
    withConfirm: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
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
.custom-modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
}
.custom-modal-wrap {
  position: fixed;
  top: 50%;
  right: 0;
  left: 0;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  transform: translate3d(0, -50%, 0);
  transition: all ease .5s;
  overflow: hidden;
}
.custom-modal-header {
  height: 80px;
  font-size: 32px;
  line-height: 80px;
  text-align: center;
}
.custom-modal-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 140px;
  padding: 30px;
}
.custom-modal-footer {
  display: flex;
  height: 70px;
  line-height: 70px;
}
.custom-modal-button {
  flex: 1;
  text-align: center;
  &.cancel {
    background: #f7f7f7;
  }
  &.confirm {
    background: #ee433a;
    color: #fff;
  }
}
</style>
