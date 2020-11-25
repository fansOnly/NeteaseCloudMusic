<template>
    <template v-if="list.length">
      <template v-for="(item, index) in list" :key="'search-playlist-'+index">
        <view class="search-playlist-item">
          <view class="img-wrap" @tap="handleRoute(item.id)"><image class="img" :src="item.coverImgUrl" /></view>
          <view class="cont">
            <view class="tit1 line-clamp-2">{{item.name}}</view>
            <view class="flex mt10">
              <view class="tit3 mr40">播放次数：{{item.playCount}}</view>
              <view class="tit3">订阅量：{{item.bookCount}}</view>
            </view>
            <view class="flex mt10">
              <view class="tit2">创建人：{{item.creator.nickname}}</view>
              <AtButton v-if="!item.subscribed" class="btn" type="secondary" size='small' @click="handleBook(item.id, 1)"><view class="at-icon at-icon-add"></view>订阅</AtButton>
              <AtButton v-else class="btn" type="secondary" size='small' @click="handleBook(item.id, 2)">取消订阅</AtButton>
            </view>
          </view>
        </view>
    </template>
    </template>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
import { subscribePlaylist } from '@/services/playlist'
export default {
    name: 'playlists',
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    setup() {
      const handleRoute = id => {
        Taro.navigateTo({
          url: `/pages/playlist/detail/index?id=${id}`
        })
      }

      const handleBook = (id, t) => {
        apiSubscribePlaylist(id, t)
      }

      const apiSubscribePlaylist = async (id, t) => {
        const { code } = await subscribePlaylist(id, t)
        if (code === 200) {
          Taro.showToast({
            icon: 'success',
            title: `${t == 2 ? '取消' : ''}订阅成功`
          })
        }
      }

      return {
        handleRoute,
        handleBook
      }
    },
}
</script>

<style lang="scss">
.search-playlist-item {
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px 0;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0;
    border-bottom: 2px solid #f2f2f2;
  }
  & .img-wrap, & .img {
    width: 160px;
    height: 160px;
  }
  & .cont {
    flex: 1;
    padding: 20px;
    font-size: 26px;
  }
  & .flex {
    display: flex;
    align-items: center;
  }
  & .mt10 {
    margin-top: 10px;
  }
  & .mr40 {
    margin-right: 40px;
  }
  & .tit1 {
    color: #000;
    font-size: 30px;
  }
  & .tit2 {
    color: #666;
  }
  & .tit3 {
    color: #999;
  }
  & .btn {
    height: 40px;
    line-height: 38px
  }
}
</style>
