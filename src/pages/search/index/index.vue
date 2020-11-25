<template>
    <AtSearchBar :value="keyword.realkeyword" :placeholder="keyword.showKeyword" show-action-button @change="handleInput" @actionClick="handleSearch" />
    <view class="search-record">
      <view class="title-wrap">
        <view class="title">搜索历史</view>
        <view v-if="searchRecordList.length" class="at-icon at-icon-trash" @tap="handleClearSearchRecord"></view>
      </view>
      <view class="search-record-list">
        <template v-for="item in searchRecordList" :key="item">
          <view class="search-record-item" @tap="handleQuickSearch(item)">{{item}}</view>
        </template>
      </view>
    </view>
    <view class="search-hot">
      <view class="title-wrap">
        <view class="title">热搜榜</view>
      </view>
      <view class="search-hot-list">
        <template v-for="(item, index) in searchHotList" :key="'search-hot-'+index">
        <view class="search-hot-item">
          <view :class="['sort', index < 3 ? 'red' : null]">{{index+1}}</view>
          <view class="cont" @tap="handleQuickSearch(item.searchWord)">
            <view class="top">
              <view :class="['name', index < 3 ? 'bold' : null]">{{item.searchWord}}</view>
              <view class="score">搜索指数：{{item.score}}</view>
              <image v-if="item.iconUrl" :src="item.iconUrl" :class="`icon${item.iconType}`" />
            </view>
            <view class="bottom">{{item.content}}</view>
          </view>
        </view>
        </template>
      </view>
    </view>
    <Player />
</template>

<script lang="ts">
import Player from '@/components/player/Player.vue'

import Taro from '@tarojs/taro'
import { reactive, ref } from 'vue'
import { searchDefault, searchHot } from '@/services/search'
import { SearchKeyword } from '@/utils/interface'
import { formatNumber } from '@/utils/util'
import './index.scss'

export default {
  setup () {
    const keyword = reactive<SearchKeyword>({
      showKeyword: '歌曲名称、专辑名称、歌手名称',
      realkeyword: '',
    })
    const realkeywordx = ref<string>('')
    const searchHotList = ref<string []>([])
    const searchRecordList = ref<string []>([])
    const recordList = Taro.getStorageSync('search-record')
    if (recordList) {
      searchRecordList.value = recordList
    }
    const handleInput = val => {
      keyword.realkeyword = val
    }
    const handleSearch = () => {
      let val = keyword.realkeyword
      if (!keyword.realkeyword && realkeywordx) {
        val = realkeywordx.value
      }
      handleQuickSearch(val)
    }
    const handleClearSearchRecord = () => {
      Taro.showModal({
        title: '提示',
        content: '确定要清空搜索记录吗？',
        success: function (res) {
          if (res.confirm) {
            searchRecordList.value = []
            Taro.removeStorageSync('search-record')
          }
        }
      })
    }
    const handleQuickSearch = (val: string) => {
      Taro.navigateTo({
        url: `/pages/search/result/index?keywords=${val}`
      })
    }
    const apiGetSearchhot = async () => {
      const { code, data } = await searchHot()
      if (code === 200) {
        searchHotList.value = data.map(v => {
          v.score = formatNumber(v.score)
          return v
        })
      }
    }
    apiGetSearchhot()
    const apiGetSearchDefault = async () => {
      const { code, data: { showKeyword, realkeyword } } = await searchDefault()
      if (code === 200) {
        keyword.showKeyword = showKeyword
        realkeywordx.value = realkeyword
      }
    }
    apiGetSearchDefault()
    return {
      keyword,
      searchHotList,
      searchRecordList,
      handleInput,
      handleSearch,
      handleClearSearchRecord,
      handleQuickSearch
    }
  },
  components: {
    Player
  }
}
</script>
