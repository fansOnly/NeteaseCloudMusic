<template>
  <CustomModal :visible="visible" title="新建歌单" @confirm="handleConfirm" @cancel="handleCancel">
      <template #custom-modal-body>
        <input name='name' type='text' placeholder='歌单标题' v-model="plName" />
      </template>
    </CustomModal>
</template>

<script lang="ts">
import CustomModal from '@/components/func/CustomModal.vue'
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { createPlaylist } from '@/services/playlist'

export default {
  emits: ['confirm', 'cancel'],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {emit}) {
    const plName = ref()
    const handleConfirm = async () => {
      if (!plName.value) {
        return Taro.showToast({
          title: '请输入歌单名称',
          icon: 'none',
          duration: 1500
        })
      }
      const data = await createPlaylist(plName.value)
      if (data?.code === 200) {
        emit('confirm')
      }
    }
    const handleCancel = () => {
      emit('cancel')
    }

    return {
      plName,
      handleConfirm,
      handleCancel
    }
  },
  components: {
    CustomModal
  }
}
</script>
