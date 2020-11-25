<template>
<ActionPanel :visible="visible" :with-footer="false" :f-height="0" full-height>
  <template #action-panel-header>
    <view class="add-playlist-header border-bottom">
      <view class="back" @tap="handleBack"><view class="at-icon at-icon-arrow-left"></view></view>
      <view class="title">添加到歌单</view>
    </view>
  </template>
  <template #action-panel-body>
    <view class="add-playlist-body">
      <view class="add-playlist" @tap="visibleName = 'create-pl'"><view class="at-icon at-icon-add"></view>新建歌单</view>
    <PlList :data-list="playList" :handle-type="1" @clickfn="handleAddToPlaylist" />
    </view>
  </template>
</ActionPanel>
<CreatePl :visible="visibleName === 'create-pl'" @confirm="handleCreatePlConfirm" @cancel="visibleName = ''"></CreatePl>
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'
import CreatePl from '@/components/playlist/CreatePl.vue'
import PlList from '@/components/playlist/PlList.vue'

import Taro from '@tarojs/taro'
import { ref, toRefs, watchEffect } from 'vue'
import { userPlaylist } from '@/services/user'
import { tracksPlaylist } from '@/services/playlist'

export default {
  emits: ['back'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    songCheckList: {
      type: Array,
      default: () => []
    }
  },
  setup(props, {emit}) {
    const { visible, songCheckList } = toRefs(props)
    const userId = Taro.getStorageSync('profile').userId
    const visibleName = ref()
    const playList = ref([])

    const handleAddToPlaylist = async (pid: string) => {
      const data = await tracksPlaylist('add', pid, songCheckList.value.join(','))
      if (data?.code === 200) {
        Taro.showToast({
          title: `成功添加${songCheckList.value.length}首歌曲到歌单`,
          icon: 'success'
        })
      }
    }

    const handleBack = () => {
      emit('back')
    }

    const apiGetUserPlaylist = async () => {
      const data = await userPlaylist(userId)
      if (data?.code === 200) {
        playList.value = data.playlist
      }
    }
    const stop = watchEffect(() => {
      if (visible.value) {
        apiGetUserPlaylist()
        stop()
      }
    })

    const handleCreatePlConfirm = () => {
      apiGetUserPlaylist()
    }
    return {
      playList,
      visibleName,
      handleAddToPlaylist,
      handleBack,
      handleCreatePlConfirm
    }
  },
  components: {
    ActionPanel,
    CreatePl,
    PlList
  }
}
</script>
<style lang="scss">
.add-playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  & .back {
    font-size: 40px;
  }
  & .title {
    flex: 1;
    text-align: center;
  }
}
.add-playlist {
  padding: 30px;
  color: #ee433a;
  font-size: 30px;
  text-align: center;
  & .at-icon-add {
    margin-right: 5px;
    font-size: 26px;
  }
}
.playlist-wrap .at-list__item--thumb .item-thumb {
  width: 80px;
  height: 80px;
}
</style>
