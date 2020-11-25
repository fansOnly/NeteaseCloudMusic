<template>
<scroll-view class="classify" scrollX="true" style="width: 100%">
    <template v-for="(item, index) in dataList" :key="'classify-'+index">
      <view :class="['classify-item', active == item.value ? 'on' : null]" @tap="handleClassifyClick(item.value)">{{item.name}}</view>
    </template>
  </scroll-view>
</template>

<script lang="ts">
export default {
  emits: ['update'],
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    active: {
      type: String,
      default: ''
    }
  },
  setup(props, {emit}) {
    const handleClassifyClick = (val: string) => {
      emit('update', val)
    }

    return {
      handleClassifyClick,
    }
  }
}
</script>
<style lang="scss">
.classify {
  white-space: nowrap;
}
.classify-item {
  display: inline-block;
  margin-right: 30px;
  padding: 10px 30px;
  background: #ddd;
  border-radius: 2em;
  text-align: center;
  vertical-align: top;
  &.on {
    background: #ee433a;
    color: #fff;
  }
}
</style>
