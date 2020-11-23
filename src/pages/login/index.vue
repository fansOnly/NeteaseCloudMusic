<template>
    <view class="wrapper">
        <view class="logo">
            <image :src="logo" style="width:173px;height:34px;" />
        </view>
        <view class="form-wrap">
            <view class="login-type-tab">
              <template v-for="(item, index) in LOGIN_WAYS" :key="'login-way-'+index">
                <view :class="['login-type-tab-item', loginWay === item.value ? 'on' : null]" @tap="handleLoginWayChange(item.value)">{{item.name}}</view>
              </template>
            </view>
            <view v-show="loginWay === 'phone'" class="form-item">
                <view class="form-item-label">
                    <view class="at-icon at-icon-iphone"></view>
                </view>
                <view class="form-item-input">
                    <AtInput name='phone' type='phone' placeholder='请输入登录账号' :value="formRef.phone" @change="handleInput('phone', $event)" />
                </view>
            </view>
            <view v-show="loginWay === 'email'" class="form-item">
                <view class="form-item-label">
                    <view class="at-icon at-icon-mail"></view>
                </view>
                <view class="form-item-input">
                    <AtInput name='email' type='email' placeholder='请输入登录邮箱' :value="formRef.email" @change="handleInput('email', $event)" />
                </view>
            </view>
            <view class="form-item">
                <view class="form-item-label">
                    <view class="at-icon at-icon-lock"></view>
                </view>
                <view class="form-item-input">
                    <AtInput name='password' type='password' placeholder='请输入登录密码' :value="formRef.password" @change="handleInput('password', $event)" />
                </view>
            </view>
            <AtButton class="login-button" type="primary" @click="handleLogin">登录</AtButton>
            <view class="form-options">
              <view class="form-options-item" @tap="handleRoute('/pages/login/register/index?type=register')">注册账号</view>
              <view class="form-options-item" @tap="handleRoute('/pages/login/register/index?type=changepass')">忘记密码</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { computed, reactive, ref, toRaw } from 'vue'
import { loginEmail, loginPhone } from '@/services/common'
import { validateEmail, validateMobile } from '@/utils/validate'
import { LOGIN_WAYS } from '@/config/constants'
import logoImg from '@/assets/image/logo.png'
import './index.scss'

export default {
    setup() {
        const params: any = getCurrentInstance().router?.params
        const logo = computed(() => logoImg)
        const formRef = reactive({
            phone: '',
            email: '',
            password: '',
        })
        const loginWay = ref('phone')
        const handleLoginWayChange = (val: string) => {
          loginWay.value = val
        }
        const handleInput = (prop, val) => {
            formRef[prop] = val
        }
        const handleRoute = (url: string) => {
          Taro.navigateTo({url: `${url}&redirect=${params.redirect}`})
        }
        const handleLogin = () => {
            const { phone ,email, password } = toRaw(formRef)
            if (loginWay.value === 'phone') {
              if (!phone) {
                return Taro.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                })
              } else if (!validateMobile(phone)) {
                return Taro.showToast({
                      title: '请输入正确的手机号码',
                      icon: 'none',
                  })
              } else if (!password) {
                  return Taro.showToast({
                      title: '请输入密码',
                      icon: 'none',
                  })
              }
            } else {
              if (!email) {
                return Taro.showToast({
                    title: '请输入登录邮箱',
                    icon: 'none',
                })
              } else if (!validateEmail(email)) {
                return Taro.showToast({
                      title: '请输入正确的邮箱',
                      icon: 'none',
                  })
              } else if (!password) {
                  return Taro.showToast({
                      title: '请输入密码',
                      icon: 'none',
                  })
              }
            }
            apiLogin()
        }
        const apiLogin = async () => {
          const { phone, email, password } = toRaw(formRef)
          const data:any = loginWay.value === 'phone' ? await loginPhone(phone, password) : await loginEmail(email, password)
            const {code, cookie, token, account, profile = {}, loginType} = data
            if (code == 200) {
                Taro.setStorageSync('token', token)
                Taro.setStorageSync('cookie', cookie)
                Taro.setStorageSync('loginType', loginType)
              if (loginType == 0) { // 邮箱登录，需绑定手机号
                if (account.status === -10) {
                  Taro.showToast({
                    title: '尚未绑定手机号，请先绑定手机号',
                    icon: 'none',
                    duration: 1500
                  })
                  Taro.redirectTo({
                    url: `/pages/login/register/index?type=bindphone&password=${password}&redirect=${params.redirect}`
                  })
                  return
                }
              } else { // 手机号登录
                Taro.setStorageSync('profile', profile)

                Taro.showToast({
                  title: '登录成功',
                  duration: 1000
                })
                if (params?.redirect) {
                  if (['/pages/index/index', '/pages/music/index', '/pages/mine/index'].includes(params.redirect)) {
                    Taro.switchTab({url: params.redirect})
                  } else {
                    Taro.navigateBack({
                      delta: 1
                    })
                  }
                } else {
                  Taro.switchTab({
                    url: '/pages/mine/index'
                  })
                }
              }
            }
        }

        return {
          LOGIN_WAYS,
            logo,
            formRef,
            loginWay,
            handleLoginWayChange,
            handleLogin,
            handleInput,
            handleRoute
        }
    },
}
</script>
