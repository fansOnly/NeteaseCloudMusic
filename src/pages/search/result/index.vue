<template>
    <AtSearchBar :value="keyword.realkeyword" :placeholder="keyword.showKeyword" show-action-button @change="handleInput" @actionClick="handleSearch" />
      <view class="search-type-wrap">
        <scroll-view class="search-type-list" scrollX="true" style="width: 100%">
            <template v-for="(item, index) in SEARCH_TYPES" :key="'search-type-'+index">
            <view :class="['search-type-item', searchType == item.id ? 'on' : null]" @tap="handelTypeChange(item.id)">{{item.name}}</view>
          </template>
          </scroll-view>
      </view>
    <view class="search-list">
        <CompositeList v-if="searchType == 1018" @update="handelTypeChange" v-bind="compositeData" />
        <SongList v-else-if="searchType == 1" :list="songList" />
        <PlayList v-else-if="searchType == 1000" :list="playList" />
        <VideoList v-else-if="searchType == 1014" :list="videoList" />
        <ArtistList v-else-if="searchType == 100" :list="artistList" />
    </view>
    <Player />
</template>

<script lang="ts">
import CompositeList from '@/components/search/CompositeList.vue'
import SongList from '@/components/search/SongList.vue'
import PlayList from '@/components/search/PlayList.vue'
import VideoList from '@/components/search/VideoList.vue'
import ArtistList from '@/components/search/ArtistList.vue'
import Player from '@/components/player/Player.vue'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { onMounted, reactive, ref } from 'vue'
import { searchDefault, searchSongs } from '@/services/search'
import { SearchKeyword } from '@/utils/interface'
import { SEARCH_TYPES } from '@/config/constants'
import './index.scss'

export default {
  setup () {
    const keyword = reactive<SearchKeyword>({
      showKeyword: '歌曲名称、专辑名称、歌手名称',
      realkeyword: '',
    })
    const realkeywordx = ref<string>('')
    const searchRecordList = ref<string []>([])
    const recordList = Taro.getStorageSync('search-record')
    if (recordList) {
      searchRecordList.value = recordList
    }
    const searchType= ref(1018)
    // 综合搜索结果
    const compositeData = reactive({
      song: {},
      playList: {},
      artist: {},
      album: {},
      video: {},
      djRadio: {}
    })
    // 其他搜索结果
    const songList = ref([])
    const playList = ref([])
    const artistList = ref([])
    const albumList = ref([])
    const videoList = ref([])
    const djRadioList = ref([])

    const handleInput = val => {
      keyword.realkeyword = val
    }
    const handleSearch = () => {
      let val = keyword.realkeyword || realkeywordx.value
      if (!val) return
      if(!searchRecordList.value.includes(val)) {
        searchRecordList.value.push(val)
      }
      Taro.setStorageSync('search-record', searchRecordList.value)
      apiGetSearchList(val)
    }
    const handelTypeChange = val => {
      searchType.value = Number(val)
      handleSearch()
    }
    const apiGetSearchList = async (val: string) => {
      const data = await searchSongs({keywords: val, type: searchType.value})
      if (searchType.value == 1018) {
        const { code, result: { song, playList, artist, album, video, djRadio } } = data
        if (code === 200) {
          compositeData.song = song
          compositeData.playList = playList
          compositeData.artist = artist
          compositeData.album = album
          compositeData.video = video
          compositeData.djRadio = djRadio
        }
      } else {
        if (data.code === 200) {
          if (searchType.value == 1) {
            const { result: { songs } } = data
            songList.value = songs
          } else if (searchType.value == 10) {
            const { result: { albums } } = data
            albumList.value = albums
          } else if (searchType.value == 100) {
            const { result: { artists } } = data
            artistList.value = artists
          } else if (searchType.value == 1000) {
            const { result: { playlists } } = data
            playList.value = playlists
          } else if (searchType.value == 1014) {
            const { result: { videos } } = data
            videoList.value = videos
          } else if (searchType.value == 1009) {
            const { result: { djRadios } } = data
            djRadioList.value = djRadios
        }
        }
      }
    }
    const apiGetSearchDefault = async () => {
      const { code, data: { showKeyword, realkeyword } } = await searchDefault()
      if (code === 200) {
        keyword.showKeyword = showKeyword
        realkeywordx.value = realkeyword
      }
    }
    apiGetSearchDefault()

    onMounted(() => {
      const { params: { keywords } }: any = getCurrentInstance().router
      if (!keywords) return
      keyword.realkeyword = keywords
      handleSearch()
    })
    return {
      SEARCH_TYPES,
      keyword,
      searchType,
      compositeData,
      songList,
      playList,
      videoList,
      artistList,
      handleInput,
      handleSearch,
      handelTypeChange
    }
  },
  components: {
    CompositeList,
    SongList,
    PlayList,
    VideoList,
    ArtistList,
    Player,
  }
}
</script>
