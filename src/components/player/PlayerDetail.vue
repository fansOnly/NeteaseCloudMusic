<template>
<ActionPanel :visible="visiblex" :with-footer="false" :with-mask="false" :hHeight="40" :fHeight="0" full-height :z-index="899">
  <template #action-panel-header>
    <view class="player-detail-header">
      <view class="at-icon at-icon-chevron-down icon-size" @tap="handlePackup"></view>
      <view class="indicator"></view>
      <view class="at-icon at-icon-share icon-size" @tap="visibleName = 'song-share'"></view>
    </view>
  </template>
  <template #action-panel-body>
    <view class="song-detail-wrap">
      <!-- 封面 -->
      <view id="cover_p" class="cover">
        <image class="cover-img" :src="songx.al.picUrl" />
        <view class="play-progress">
          <view class="play-progress-bar" :style="{width: playerProgress}"></view>
          <view id="play_time" class="play-time" :style="{'left': playerProgress}">{{playerCurrentTime}} / {{playerDuration}}</view>
        </view>
      </view>
      <!-- 基本信息 -->
      <view class="info">
        <view class="name">{{songx.name}}</view>
        <view class="flex-row">
          <view class="artist-name">{{songx.ar[0].name}}</view>
          <view class="artist-follow" @tap="handleArtistSub">关注</view>
        </view>
        <view class="flex-row">
          <view class="effect-setting song-quality" @tap="handlePanelOpen('song-quality')">{{soundData.quality.mode}} <view class="at-icon at-icon-chevron-down"></view></view>
          <view class="effect-setting song-effect" @tap="handlePanelOpen('song-effect')">音效 {{soundData.effect.mode}}</view>
          <!-- <view class="effect-setting song-ai">AI模式 on</view> -->
        </view>
      </view>
      <!-- 播放控制 -->
      <view class="play-area">
        <view class="play-mode">
          <view :class="['at-icon', playMode.values[playMode.index].icon]" @tap="handelPlayModeChange"></view>
        </view>
        <view class="at-icon at-icon-prev" @tap="handlePlayPrev"></view>
        <view v-if="playerx.paused" class="at-icon at-icon-play" @tap="handlePlay"></view>
        <view v-else class="at-icon at-icon-pause" @tap="handlePause"></view>
        <view class="at-icon at-icon-next" @tap="handlePlayNext"></view>
        <view class="song-like" @tap="handelLike">
          <view :class="['at-icon', songx.liked ? 'at-icon-heart-2' : 'at-icon-heart']"></view>
          <view class="count-data">{{songx.likeCount > 999 ? '999+' : songx.likeCount}}</view>
        </view>
      </view>
      <!-- 其他设置 -->
      <view class="other-setting">
        <view class="song-download">
          <view class="at-icon at-icon-download"></view>
        </view>
        <view class="song-comment">
          <view class="at-icon at-icon-message"></view>
          <view class="count-data">{{songx.commentCount}}</view>
        </view>
        <view class="play-list">
          <view class="at-icon at-icon-filter" @tap="handlePanelOpen('song-similist')"></view>
        </view>
        <view class="setting-more">
            <view class="at-icon at-icon-settings" @tap="handlePanelOpen('song-setting')"></view>
            <view class="dots"></view>
        </view>
      </view>
    </view>
  </template>
</ActionPanel>

<QualityPanel :visible="visibleName === 'song-quality'" :quality-value="soundData.quality.value" :quality-list="qualityList"  @update="handleUpdateQuality" @cancel="handlePanelClose" />
<EffectPanel :visible="visibleName === 'song-effect'" :effect-value="soundData.effect.value" @update="handleUpdateEffect" @cancel="handlePanelClose" />
<SimiListPanel :visible="visibleName === 'song-similist'" @emitup="handleEmitUp" @cancel="handlePanelClose" />
<SettingPanel :visible="visibleName === 'song-setting'" @emitup="handleEmitUp" @cancel="handlePanelClose" />
<SharePanel :visible="visibleName === 'song-share'" @cancel="handlePanelClose" />
<AddPlaylist :visible="visibleName === 'add-playlist'" :song-check-list="songCheckList" @back="handleAddPlaylistDone" />
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'
import QualityPanel from '@/components/player/QualityPanel.vue'
import EffectPanel from '@/components/player/EffectPanel.vue'
import SimiListPanel from '@/components/player/SimiListPanel.vue'
import SettingPanel from '@/components/player/SettingPanel.vue'
import SharePanel from '@/components/player/SharePanel.vue'
import AddPlaylist from '@/components/playlist/AddPlaylist.vue'

import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'
import { computed, reactive, readonly, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { likeSong } from '@/services/song'
import { artistSub } from '@/services/artist'
import { isEmptyObject, formatMusicSize, formatMusicBr, timestampToDate } from '@/utils/util'
import { PLAY_QUALITIES, PLAY_MODES } from '@/config/constants'

export default {
  setup () {
    const store = useStore()
    const visiblex = computed(() => store.state.player.visible)
    const songx = computed(() => store.state.player.song)
    const playerx = computed(() => store.state.player.player)
    const playerCurrentTime = computed(() => timestampToDate(playerx.value.currentTime))
    const playerDuration = computed(() => timestampToDate(songx.value.dt))

    // 播放条实际移动距离
    const totalWidth = ref(0)
    const barRealWidth = ref(0)
    const playerProgress = computed(() => playerx.value.currentTime * (barRealWidth.value * 100 / totalWidth.value) / songx.value.dt +'%')
    const instance: any = getCurrentInstance()
    eventCenter.once(instance.router.onReady, () => {
      const query = Taro.createSelectorQuery()
        query.select('#cover_p').boundingClientRect()
        query.select('#play_time').boundingClientRect().exec(res => {
          // console.log('boundingClientRect::', {res})
          totalWidth.value = res[0].width
          barRealWidth.value = res[0].width - res[1].width
        })
      })
      // 全部音质列表
      const qualityList = ref<any>([])
      watch(() => songx.value.id, (val: string) => {
          if (val) {
            const { s, h, m , l } = songx.value
            let res: any = []
            if (!isEmptyObject(l)) {
              PLAY_QUALITIES[0].br = formatMusicBr(l.br)
              PLAY_QUALITIES[0].size = formatMusicSize(l.size)
              res.push(PLAY_QUALITIES[0])
            }
            if (!isEmptyObject(m)) {
              PLAY_QUALITIES[1].br = formatMusicBr(m.br)
              PLAY_QUALITIES[1].size = formatMusicSize(m.size)
              res.push(PLAY_QUALITIES[1])
            }
            if (!isEmptyObject(h)) {
              PLAY_QUALITIES[2].br = formatMusicBr(h.br)
              PLAY_QUALITIES[2].size = formatMusicSize(h.size)
              res.push(PLAY_QUALITIES[2])
            }
            if (!isEmptyObject(s)) {
              PLAY_QUALITIES[3].br = formatMusicBr(s.br)
              PLAY_QUALITIES[3].size = formatMusicSize(s.size)
              res.push(PLAY_QUALITIES[3])
            }
            qualityList.value = res
          }
        }, {
          immediate: true
        })
      const handlePlay = () => {
        store.dispatch('player/PLAY')
      }
      const handlePause = () => {
        store.dispatch('player/PAUSE')
      }
      const handlePlayPrev = () => {
        store.dispatch('player/PLAY_PREV')
      }
      const handlePlayNext = () => {
        store.dispatch('player/PLAY_NEXT')
      }

      const visibleName = computed(() => store.state.visibles.name)
      // 音质、音效、智能模式等设置
      const soundData = reactive({
        quality: {
          mode: '',
          value: ''
        },
        effect: {
          mode: 'off',
          value: '00'
        },
        ai: 'off',
      })
      // 播放模式
      const playMode = reactive({
        values: readonly(PLAY_MODES),
        index: PLAY_MODES.findIndex(v => v.value === playerx.value.mode)
      })
      // 歌曲操作列表
      const songCheckList = ref<any>([])
      const handelPlayModeChange = () => {
        if (++playMode.index >= playMode.values.length) {
          playMode.index = 0
        }
        const { value, msg } = playMode.values[playMode.index]
        store.dispatch('player/UPDATE_PLAYER', { mode: value, loop: value === 'repeat' })
        Taro.showToast({
          title: msg,
          icon: 'none',
          duration: 1000
        })
      }
      const handelLike = async () => {
        const data = await likeSong(playerx.value.id, !songx.value.liked)
        if (data?.code === 200) {
          store.dispatch('player/UPDATE_SONG', {
            liked: !songx.value.liked,
            likeCount: !songx.value.liked ? songx.value.likeCount + 1 : songx.value.likeCount - 1
          })
          Taro.showToast({
            title: `${songx.value.liked ? '收藏成功' : '取消收藏'}`,
            icon: 'none',
            duration: 1500
          })
        }
      }
      const handleArtistSub = async () => {
        const data = await artistSub(songx.value.ar[0].id, 1)
        if (data?.code === 200) {
          // store.dispatch('player/UPDATE_SONG', {t: })
          Taro.showToast({
            title: '关注成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
      const handleUpdateQuality = (val: string) => {
        const { mode, value } = qualityList.value.find(v => v.value === val)
        soundData.quality.mode = mode
        soundData.quality.value = value
      }
      const handleUpdateEffect = (val: string) => {
        soundData.effect.mode = val !== '00' ? 'on' : 'off'
        soundData.effect.value = val
        handlePanelClose()
      }
      const handlePanelOpen = (name: string) => {
        store.dispatch('visibles/UPDATE', name)
      }
      const handlePanelClose = () => {
        store.dispatch('visibles/UPDATE', '')
      }
      const handleAddPlaylistDone = () => {
        handlePanelClose()
        songCheckList.value = []
      }
      const handleEmitUp = async (name: string, val?: string[]) => {
        if (name === 'song-like') {
          handelLike()
        } else if (name === 'song-download') {
          console.log('download song...')
          // TODO download
        } else {
          songCheckList.value = val;
          store.dispatch('visibles/UPDATE', name)
        }
      }
      const handlePackup = () => {
        store.dispatch('player/TOGGLE_VISIBLE')
      }
    return {
      visiblex,
      playerx,
      songx,
      playerCurrentTime,
      playerDuration,
      playerProgress,
      qualityList,
      soundData,
      visibleName,
      playMode,
      songCheckList,
      handleArtistSub,
      handelLike,
      handlePlay,
      handlePause,
      handlePlayPrev,
      handlePlayNext,
      handelPlayModeChange,
      handleUpdateQuality,
      handleUpdateEffect,
      handlePanelOpen,
      handlePanelClose,
      handleEmitUp,
      handleAddPlaylistDone,
      handlePackup
    }
  },
  components: {
    ActionPanel,
    QualityPanel,
    EffectPanel,
    SimiListPanel,
    SettingPanel,
    SharePanel,
    AddPlaylist,
  }
}
</script>
<style lang="scss">
.player-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10PX 30px;
}
.song-detail-wrap {
  padding: 10px 30px 0;
  overflow: hidden;
  & .cover {
    position: relative;
    border: 2px solid #f2f2f2;
  }
  & .cover-img {
    display: block;
    width: 100%;
    height: 500px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  & .play-progress {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }
  & .play-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2PX;
    background: #ee433a;
  }
  & .play-time {
    position: absolute;
    left: 0;
    bottom: -9PX;
    width: 70PX;
    height: 18PX;
    background: rgba(0, 0, 0, .6);
    border-radius: 2em;
    color: #eee;
    font-size: 10PX;
    line-height: 18PX;
    text-align: center;
    white-space: nowrap;
    transition: all ease .5s;
  }
  & .info {
    padding: 50px;
    text-align: center;
  }
  & .name {
    color: #000;
    font-size: 30px;
    font-weight: 500;
  }
  & .flex-row {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  & .artist-name {
    color: #777;
  }
  & .artist-follow {
    display: inline-block;
    margin-left: 10px;
    padding: 2px 14px;
    background: #eee;
    border-radius: 2em;
    font-size: 20px;
  }
  & .effect-setting {
    margin: 0 10px;
    padding: 2px 10px;
    border: 2px solid #999;
    border-radius: 4px;
    color: #999;
    font-size: 20px;
  }
  & .play-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
  }
  & .play-mode {
    color: #999;
    font-size: 50px;
  }
  & .at-icon-play, & .at-icon-pause {
    color: #333;
    font-size: 100px;
  }
  & .at-icon-prev, & .at-icon-next {
    color: #333;
    font-size: 70px;
    font-weight: 100;
  }
  & .song-like {
    position: relative;
    margin-right: 20px;
    color: #999;
    font-size: 50px;
  }
  & .count-data {
    position: absolute;
    top: 5px;
    right: -30px;
    padding: 0 4px;
    font-size: 20px;
    background: #fff;
  }
  & .at-icon-heart-2 {
    color: #ee433a;
  }
  & .other-setting {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 40px;
    color: #999;
    font-size: 50px;
  }
  & .song-comment, & .setting-more {
    position: relative;
  }
  & .dots {
    position: absolute;
    top: 10px;
    right: 0;
    width: 13px;
    height: 13px;
    background: red;
    border-radius: 100%;
  }
}

</style>
