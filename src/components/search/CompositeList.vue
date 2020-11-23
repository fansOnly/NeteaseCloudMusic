<template>
<view class="search-list">
  <!-- 单曲 -->
  <view v-if="song.songs" class="search-list-item" @tap="handleTypeChange(1)">
    <image class="img" :src="song.songs[0].al.picUrl" />
    <view class="info">
      <view class="title">{{song.songs[0].name}}</view>
      <view class="desc">{{song.moreText}}</view>
    </view>
  </view>
  <!-- 专辑 -->
  <view v-if="playList.playLists" class="search-list-item" @tap="handleTypeChange(10)">
    <image class="img" :src="playList.playLists[0].coverImgUrl" />
    <view class="info">
      <view class="title">{{playList.playLists[0].name}}</view>
      <view class="desc">{{playList.moreText}}</view>
    </view>
  </view>
  <!-- 歌手 -->
  <view v-if="artist.artists" class="search-list-item" @tap="handleTypeChange(100)">
    <image class="img" :src="artist.artists[0].img1v1Url" />
    <view class="info">
      <view class="title">{{artist.artists[0].name}}</view>
      <view class="desc">{{artist.moreText}}</view>
    </view>
  </view>
  <!-- 歌单 -->
  <view v-if="album.albums" class="search-list-item" @tap="handleTypeChange(1000)">
    <image class="img" :src="album.albums[0].picUrl" />
    <view class="info">
      <view class="title">{{album.albums[0].name}}</view>
      <view class="desc">{{album.moreText}}</view>
    </view>
  </view>
  <!-- 视频 -->
  <view v-if="video.videos" class="search-list-item" @tap="handleTypeChange(1014)">
    <image class="img" :src="video.videos[0].coverUrl" />
    <view class="info">
      <view class="title">{{video.videos[0].title}}</view>
      <view class="desc">{{video.moreText}}</view>
    </view>
  </view>
  <!-- 电台 -->
  <view v-if="djRadio.djRadios" class="search-list-item" @tap="handleTypeChange(1009)">
    <image class="img" :src="djRadio.djRadios[0].picUrl" />
    <view class="info">
      <view class="title">{{djRadio.djRadios[0].name}}</view>
      <view class="desc">{{djRadio.moreText}}</view>
    </view>
  </view>
</view>
</template>

<script lang="ts">
export default {
  name: 'composites',
  props: {
    song: {
      type: Object,
      default: () => {}
    },
    playList: {
      type: Object,
      default: () => {}
    },
    artist: {
      type: Object,
      default: () => {}
    },
    album: {
      type: Object,
      default: () => {}
    },
    video: {
      type: Object,
      default: () => {}
    },
    djRadio: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const handleTypeChange = val => {
      emit('update', val)
    }
    return {
      handleTypeChange
    }
  }
}
</script>

<style lang="scss">
.search-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  & .img {
    width: 160px;
    height: 160px;
  }
  & .info {
    padding: 20px;
  }
  & .title {
    font-size: 30px;
  }
  & .desc {
    margin-top: 10px;
    color: #999;
    font-size: 24px;
  }
}
</style>
