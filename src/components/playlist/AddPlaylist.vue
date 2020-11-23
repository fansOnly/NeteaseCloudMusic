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
      <view class="add-playlist" @tap="handleCreatePlaylist"><view class="at-icon at-icon-add"></view>新建歌单</view>
      <view v-if="playList.length" class="playlist-wrap">
        <AtList>
          <template v-for="(item, index) in playList" :key="'playlist-item-'+index">
            <AtListItem
              :title='item.name'
              :note='item.description'
              arrow='right'
              :thumb='item.coverImgUrl'
              @click="handleAddToPlaylist(item.id)"
            />
          </template>
        </AtList>
      </view>
    </view>
  </template>
</ActionPanel>
<AtModal :is-opened="modalVisible" @close="handleClose">
  <AtModalHeader>新建歌单</AtModalHeader>
  <AtModalContent>
    <input
        name='name'
        type='text'
        placeholder='歌单标题'
        :value="plName"
      />
  </AtModalContent>
  <AtModalAction> <button @tap="handleClose">取消</button> <button @tap="handleCreateConfirm">确定</button> </AtModalAction>
</AtModal>
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'
import Taro from '@tarojs/taro'
import { ref, toRefs, watchEffect } from 'vue'
import { getUserPlaylist } from '@/services/user'
import { tracksPlaylist, createPlaylist } from '@/services/playlist'

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
    const uid = Taro.getStorageSync('account').id
    const playList = ref([])
    const modalVisible = ref(false)
    const plName = ref()
    const handleCreatePlaylist = () => {
      modalVisible.value = true
    }
    const handleCreateConfirm = async () => {
      if (!plName.value) {
        return Taro.showToast({
          title: '请输入歌单名称',
          icon: 'none',
          duration: 1500
        })
      }
      const data = await createPlaylist(plName.value)
      if (data?.code === 200) {
        apiGetUserPlaylist()
      }
    }

    const handleAddToPlaylist = async (pid: string) => {
      const data = await tracksPlaylist('add', pid, songCheckList.value.join(','))
      if (data?.code === 200) {
        Taro.showToast({
          title: `成功添加${songCheckList.value.length}首歌曲到歌单`,
          icon: 'success'
        })
      }
    }

    const handleClose = () => {
      plName.value = ''
      modalVisible.value = false
    }

    const handleBack = () => {
      emit('back')
    }

    const apiGetUserPlaylist = async () => {
      const data = await getUserPlaylist(uid)
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
    return {
      playList,
      modalVisible,
      plName,
      handleCreatePlaylist,
      handleCreateConfirm,
      handleAddToPlaylist,
      handleClose,
      handleBack,
    }
  },
  components: {
    ActionPanel,
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
