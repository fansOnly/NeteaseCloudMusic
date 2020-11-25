<template>
  <!-- 歌单基本信息 -->
  <view v-if="dataLoaded" class="pl-info">
    <view class="pl-cover">
      <image class="pl-cover-img" :src="plData.coverImgUrl" />
      <view class="pl-total"><view class="at-icon at-icon-sound"></view> {{plData.trackCount}}</view>
    </view>
    <view class="pl-cont">
      <view class="pl-section">
        <view class="pl-name">{{plData.name}}</view>
      </view>
      <view class="pl-section">
        <image class="pl-creator-avatar" :src="plData.creator.avatarUrl" />
        <view class="pl-creator-name">{{plData.creator.nickname}}</view>
      </view>
      <view class="pl-section">
          <view class="pl-book-count">{{plData.subscribedCount}}人已订阅</view>
        <view class="pl-book-opt" @tap="handleSubscribe">
          <AtButton v-if="plData.subscribed" class="pl-book-btn" type="secondary" size="small">取消订阅</AtButton>
          <AtButton v-else class="pl-book-btn" type="secondary" size="small"><view class="at-icon at-icon-add"></view>订阅</AtButton>
        </view>
      </view>
    </view>
  </view>
  <view class="pl-desc">
    <view class="pl-section">标签：
      <template v-for="item in plData.tags" :key="item">
          <view class="pl-tags-item">{{item}}</view>
        </template>
    </view>
    <view class="pl-section" style="align-items: flex-start;"><view style="white-space:nowrap;">简介：</view><view class="pl-intro">{{plData.description}}</view></view>
  </view>
  <!-- 歌单歌曲列表 -->
  <view class="pl-playlist">
    <SongListTitle title="全部播放" :songs="plData.tracks" />
    <SongList :data-list="plData.tracks" />
  </view>
  <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'
import SongListTitle from '@/components/song/SongListTitle.vue'
import SongList from '@/components/song/SongList.vue'

import { getCurrentInstance } from '@tarojs/taro'
import { getPlaylistDetail, subscribePlaylist } from '@/services/playlist'
import './index.scss'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
      const { params: { id } }: any = getCurrentInstance().router
      const dataLoaded = ref(false)
      const plData = reactive({
        tracks: [],
        trackIds: [],
        creator: {},
        subscribed: false,
        description: '',
        playCount: 0,
        subscribedCount: 0,
        coverImgUrl: '',
        trackCount: 0,
        tags: [],
        name: '',
      })

      const handlePlay = id => {
        store.dispatch('player/PLAY', id)
      }

      const handleSubscribe = async () => {
        const data = await subscribePlaylist(id, plData.subscribed ? 2 : 1)
        if (data?.code === 200) {
          plData.subscribed = !plData.subscribed
        }
      }

      const apiGetPlaylistDetail = async () => {
        const { code, playlist } = await getPlaylistDetail(id)
        if (code === 200) {
          dataLoaded.value = true
          plData.tracks = playlist.tracks
          plData.trackIds = playlist.trackIds
          plData.creator = playlist.creator
          plData.subscribed = playlist.subscribed
          plData.description = playlist.description
          plData.playCount = playlist.playCount
          plData.subscribedCount = playlist.subscribedCount
          plData.coverImgUrl = playlist.coverImgUrl
          plData.trackCount = playlist.trackCount
          plData.tags = playlist.tags
          plData.name = playlist.name
        }
      }
      apiGetPlaylistDetail()
    return {
      dataLoaded,
      plData,
      handlePlay,
      handleSubscribe
    }
  },
  components: {
    Player,
    SongListTitle,
    SongList
  }
}
</script>
