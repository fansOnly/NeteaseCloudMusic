<template>
  <template v-for="item in dataList" :key="item.id">
    <view class="song-list-item border-bottom active">
      <view class="song-list-left" @tap="handelPlay(item.id)">
        <image class="song-list-img" :src="item.al.picUrl" />
        <view class="song-list-info">
          <view class="song-list-name">{{item.name}}</view>
          <view class="song-list-artist secondary-title">{{item.ar[0].name}}</view>
        </view>
      </view>
      <slot name="option">
        <view class="song-list-options">
          <view v-if="item.mv" class="at-icon at-icon-video icon-size" @tap="handleRoute(`/pages/mv/detail/index?id=${item.mv}`)"></view>
          <view class="at-icon at-icon-link icon-size" @tap="handleOpen('song-option', item)"></view>
        </view>
      </slot>
    </view>
  </template>
  <SongOption :visible="visibleName === 'song-option'" :song="song.current" @emitup="handleEmitUp" @cancel="handleCancel" />
</template>

<script lang="ts">
import SongOption from '@/components/song/SongOption.vue'

import Taro from '@tarojs/taro'
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { likeSong } from '@/services/song'

export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const store = useStore()
    const visibleName = computed(() => store.state.visibles.name)
    const song = reactive({
      current: {
        id: '',
        liked: false,
        likeCount: 0
      }
    })
    const handleOpen = (name: string, item: Object) => {
      store.dispatch('visibles/UPDATE', name)
      song.current = {
        ...song.current,
        ...item
      }
    }
    const handelPlay = (songid: string) => {
      store.dispatch('player/PLAY', songid)
    }
    const handleRoute = (url: string) => {
      Taro.navigateTo({url})
    }
    const handleEmitUp = (name: string) => {
        if (name === 'song-like') {
          handelLike()
          handleCancel()
        } else if (name === 'song-download') {
          console.log('download song...')
          handleCancel()
        } else {
          store.dispatch('visibles/UPDATE', name)
        }
      }
      const handelLike = async () => {
        const data = await likeSong(song.current.id, !song.current.liked)
        if (data?.code === 200) {
          Taro.showToast({
            title: `${song.current.liked ? '取消收藏' : '收藏成功'}`,
            icon: 'none',
            duration: 1500
          })
        }
      }
      const handleCancel = () => {
        store.dispatch('visibles/UPDATE', '')
        song.current = {
          id: '',
          liked: false,
          likeCount: 0
        }
      }
    return {
      visibleName,
      song,
      handelPlay,
      handleRoute,
      handleOpen,
      handleEmitUp,
      handleCancel
    }
  },
  components: {
    SongOption
  }
}
</script>

<style lang="scss">
.song-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.song-list-left {
  flex: 1;
  display: flex;
  align-items: center;
}
.song-list-img {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}
.song-list-info {
  flex: 1;
  padding-left: 30px;
}
.song-list-name {
  font-size: 30px;
}
.song-list-artist {
  margin-top: 12px;
}
.song-list-statistics {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #999;
  font-size: 24px;
  & .item {
    margin-right: 10px;
  }
  & .span {
    display: inline-block;
    margin-left: 5px;
    color: #ee433a;
  }
}
.song-list-options {
  display: flex;
  align-items: center;
  color: #999;
  & .at-icon {
    margin-left: 20px;
  }
}
</style>
