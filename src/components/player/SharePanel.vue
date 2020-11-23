<template>
<ActionPanel :visible="visible" :with-footer="false" :hHeight="0" :fHeight="50" @confirm="handleCancel" @cancel="handleCancel" >
  <template #action-panel-body>
    <view class="song-share-body">
      <view class="song-share-title">分享给好友</view>
      <scroll-view class="song-share-row" scrollX="true" style="width: 100%">
          <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">动态</view>
        </view>
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">好友</view>
        </view>
        <view class="song-share-item" @tap="handleCopyLink('https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg')">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">复制链接</view>
        </view>
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">其它方式</view>
        </view>
      </scroll-view>
      <scroll-view class="song-share-row" scrollX="true" style="width: 100%">
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">微信朋友圈</view>
        </view>
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">微信好友</view>
        </view>
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">微博</view>
        </view>
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">钉钉</view>
        </view>
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">QQ</view>
        </view>
        <view class="song-share-item">
          <image class="song-share-img" src="https://p1.music.126.net/0wyR7TOUab9XldiqLfhXXQ==/109951165450956782.jpg" />
          <view class="song-share-txt">QQ好友</view>
        </view>
      </scroll-view>
    </view>
  </template>
  <template #action-panel-footer>
    <view class="song-share-footer" @tap="handleCancel">取消</view>
  </template>
</ActionPanel>
</template>

<script lang="ts">
import ActionPanel from '@/components/func/ActionPanel.vue'
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  emits: ['cancel'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  setup(props, {emit}) {
    const store = useStore()
    const songid = computed(() => store.state.player.player.id)
    const handleCopyLink = async (text: string) => {
      await Taro.setClipboardData({data: text})
      const data = await Taro.getClipboardData()
      console.log('handleCopyLink: ', data.data);
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      songid,
      handleCopyLink,
      handleCancel,
    }
  },
  components: {
    ActionPanel,
  }
}
</script>
<style lang="scss">
.song-share-body {
  padding: 30px;
}
.song-share-title {
  margin-top: 30px;
  font-size: 50px;
  font-weight: 500;
}
.song-share-row {
  padding: 30px 0;
  white-space: nowrap;
}
.song-share-item {
  display: inline-block;
  margin-right: 30px;
  text-align: center;
  vertical-align: top;
}
.song-share-img {
  width: 120px;
  height: 120px;
  border-radius: 100%;
}
.song-share-txt {
  margin-top: 10px;
  font-size: 24px;
}
.song-share-footer {
  width: 100%;
  height: 50PX;
  background: #eee;
  font-size: 32px;
  text-align: center;
  line-height: 50PX;
}
</style>
