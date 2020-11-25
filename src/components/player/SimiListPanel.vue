<template>
<ActionPanel :visible="visible" :with-footer="false" :f-height="batch ? 60 : 0" :full-height="batch" @cancel="handleCancel" >
  <template #action-panel-header>
    <view v-if="batch" class="simi-song-header">
      <view class="simi-song-count">全选</view>
      <view class="simi-song-count">批量管理</view>
      <view class="simi-song-done" @tap="handleBatchDone">完成</view>
    </view>
    <view v-else class="simi-song-header">
      <view class="simi-song-count">共{{tracksx.length}}首</view>
      <view class="simi-song-batch"><view class="at-icon at-icon-list" @tap="handleBatchMode"></view></view>
    </view>
  </template>
  <template #action-panel-body>
    <view class="simi-song-body">
      <template v-for="(item, index) in tracksx" :key="'simi-song-'+index">
        <view :class="['simi-song-item', 'active', (playerx.id === item.id) && !batch ? 'on' : null]" @tap="handleClick(item.id)">
          <view v-show="batch" class="simi-song-check"><AtCheckbox class="custom-checkbox" :selectedList="checkList" :options="[{value: item.id}]" /></view>
          <image class="simi-song-cover" :src="item.al.picUrl" />
          <view class="simi-song-info">
            <view class="simi-song-name">{{item.name}}</view>
            <view class="simi-song-artist">{{item.ar[0].name}}</view>
          </view>
          <view class="simi-song-option">
            <view v-if="!batch && playerx.id !== item.id" class="at-icon at-icon-trash" @tap.stop="handleDelete(index)"></view>
            <view v-else class="at-icon at-icon-menu"></view>
          </view>
        </view>
      </template>
    </view>
  </template>
  <template v-if="batch" #action-panel-footer>
    <view :class="['simi-song-footer', checkList.length ? null : 'disabled']">
      <view class="simi-song-menu active" @tap="handleBatchDelete">
        <view class="at-icon at-icon-trash"></view>
        <view class="simi-song-menu-text">删除</view>
      </view>
      <view class="simi-song-menu active" @tap="handleAddPlaylist('add-playlist')">
        <view class="at-icon at-icon-folder"></view>
        <view class="simi-song-menu-text">加到歌单</view>
      </view>
    </view>
  </template>
</ActionPanel>
  <CustomModal :visible="visibleName === 'delete-modal'" content="从列表移除该歌曲" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'
import CustomModal from '@/components/func/CustomModal.vue'

import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  emits: ['update', 'emitup', 'cancel'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  setup(props, {emit}) {
    const store = useStore()
    const playerx = computed(() => store.state.player.player)
    const tracksx = computed(() => store.state.player.tracks)
    // 批量操作相关
    const batch = ref(false)
    const checkList = ref<any>([])
    const handleClick = (id: string) => {
      if (batch.value) { // 批量操作模式，点击选择
        if (checkList.value.includes(id)) {
          const index = checkList.value.indexOf(id)
          checkList.value.splice(index, 1)
        } else {
          checkList.value.push(id)
        }
      } else { // 非操作模式，点击播放
        if (playerx.value.id === id) return
        store.dispatch('player/PLAY', id)
      }
    }
    const handleBatchDelete = () => {
      const arr = tracksx.value.filter((v: any) => !checkList.value.includes(v.id))
      store.dispatch('player/UPDATE_TRACKS', arr)
      checkList.value = []
    }
    const handleAddPlaylist = (val: string) => {
      if (!checkList.value.length) return
      batch.value = false
      emit('emitup', val, checkList.value)
      setTimeout(() => {
        checkList.value = []
      }, 0);
    }
    const handleBatchMode = () => {
      batch.value = true
    }
    const handleBatchDone = () => {
      batch.value = false
      checkList.value = []
    }
    // 删除操作相关
    const visibleName = ref()
    const delIndex = ref()
    const handleDelete = (index: number) => {
      delIndex.value = index
      visibleName.value = 'delete-modal'
    }
    const handleConfirmDelete = () => {
      const arr = tracksx.value.slice()
      arr.splice(delIndex.value, 1)
      store.dispatch('player/UPDATE_TRACKS', arr)
      handleCancelDelete()
    }
    const handleCancelDelete = () => {
      visibleName.value = ''
    }
    const handleCancel = () => {
      batch.value = false
      checkList.value = []
      emit('cancel')
    }

    return {
      playerx,
      tracksx,
      batch,
      checkList,
      visibleName,
      handleClick,
      handleDelete,
      handleConfirmDelete,
      handleCancelDelete,
      handleBatchDelete,
      handleAddPlaylist,
      handleBatchMode,
      handleBatchDone,
      handleCancel,
    }
  },
  components: {
    ActionPanel,
    CustomModal
  }
}
</script>
<style lang="scss">
.simi-song-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 30px 30px 15px;
  line-height: 60px;
}
.simi-song-batch {
  font-size: 40px;
}
.simi-song-body {
  position: relative;
  padding: 10px 0;
}
.simi-song-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  &.on, &.on .simi-song-artist {
    color: #ee433a;
  }
}
.simi-song-cover {
  width: 85px;
  height: 85px;
  border-radius: 5px;
}
.simi-song-info {
  flex: 1;
  padding: 0 30px;
}
.simi-song-artist {
  margin-top: 10px;
  color: #999;
  font-size: 24px;
}
.simi-song-option {
  font-size: 40px;
}
.custom-checkbox {
  & .at-checkbox__option {
    margin-right: 30px;
  }
}
.simi-song-footer {
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  &.disabled {
    color: #ccc;
  }
}
.simi-song-menu {
  width: 50%;
  height: 50PX;
  padding-top: 10PX;
  text-align: center;
  & .at-icon {
    font-size: 50px;
  }
}
.simi-song-menu-text {
  margin-top: 8px;
  font-size: 20px;
}
.disabled .active:hover {
  background: transparent;
}
</style>
