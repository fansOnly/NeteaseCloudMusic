<template>
    <template v-if="list.length">
        <template v-for="(item, index) in list" :key="'search-playlist-'+index">
            <view class="search-playlist-item">
                <view class="img-wrap" @tap="handleRoute(item.id)">
                    <image class="img" :src="item.picUrl || item.img1v1Url" />
                </view>
                <view class="cont">
                    <view class="tit1 line-clamp-2">{{item.name}}</view>
                    <view class="flex mt10">
                        <view class="tit2">专辑数量：{{item.albumSize}}</view>
                    </view>
                </view>
            </view>
        </template>
    </template>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
export default {
    name: 'artists',
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    setup() {
        const handleRoute = (id) => {
            Taro.navigateTo({
                url: `/pages/artist/index?id=${id}`,
            })
        }
        return {
            handleRoute,
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
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 0;
        border-bottom: 2px solid #f2f2f2;
    }
    & .img-wrap,
    & .img {
        width: 160px;
        height: 160px;
    }
    & .cont {
        flex: 1;
        padding: 10px 20px;
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
        font-size: 24px;
    }
    & .btn {
        height: 40px;
        line-height: 38px;
    }
}
</style>
