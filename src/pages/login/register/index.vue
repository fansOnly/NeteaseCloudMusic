<template>
    <view class="wrapper">
        <view class="logo">
            <image :src="logo" style="width:173px;height:34px;" />
        </view>
        <view class="form-wrap">
            <view class="form-item">
                <view class="form-item-label">
                    <view class="at-icon at-icon-iphone"></view>
                </view>
                <view class="form-item-input">
                    <AtInput name='phone' type='phone' placeholder='请输入手机号' :value="formRef.phone" @change="handleInput('phone', $event)" />
                </view>
            </view>
            <view v-if="optionType !== 'bindphone'" class="form-item">
                <view class="form-item-label">
                    <view class="at-icon at-icon-lock"></view>
                </view>
                <view class="form-item-input">
                    <AtInput name='password' type='password' placeholder='请输入登录密码' :value="formRef.password" @change="handleInput('password', $event)" />
                </view>
            </view>
            <view class="form-item">
                <view class="form-item-label">
                    <view class="at-icon at-icon-money"></view>
                </view>
                <view class="form-item-input">
                    <AtInput name='captcha' type='text' placeholder='请输入验证码' :value="formRef.captcha" @change="handleInput('captcha', $event)" >
                      <view v-if="!captcha.sending" @tap="handleCatpchaSent">发送验证码</view>
                      <view v-else class="countdown">{{captcha.current}}s后重发</view>
                    </AtInput>
                </view>
            </view>
            <view v-if="optionType !== 'changepass'" class="form-item">
                <view class="form-item-label">
                    <view class="at-icon at-icon-user"></view>
                </view>
                <view class="form-item-input">
                    <AtInput name='nickname' type='text' placeholder='请输入昵称' :value="formRef.nickname" @change="handleInput('nickname', $event)" />
                </view>
            </view>
            <AtButton class="login-button" type="primary" @click="handleLogin">{{optionType === 'register' ? '注册' : '确定'}}</AtButton>
        </view>
    </view>
</template>

<script lang="ts">
    import Taro, { getCurrentInstance } from '@tarojs/taro'
    import { computed, reactive, ref, toRaw } from 'vue'
    import { existencePhone, captchaSent, register } from '@/services/common'
    import { validateMobile } from '@/utils/validate'
    import logoImg from '@/assets/image/logo.png'
    import './index.scss'

    export default {
        setup() {
          const actions = Object.freeze({
            'register': '注册账号',
            'changepass': '修改密码',
            'bindphone': '绑定手机',
          })
          const params: any = getCurrentInstance().router?.params ?? {}
          const optionType = ref(params.type)
          Taro.setNavigationBarTitle({
            title: actions[optionType.value]
          })

            const logo = computed(() => logoImg)
            const formRef = reactive({
                phone: '',
                password: params.password ?? '',
                captcha: '',
                nickname: ''
            })
            const captcha = reactive({
              value: '',
              sending: false,
              wait: 60,
              current: 60,
              count: 0
            })

            const handleInput = (prop, val) => {
                formRef[prop] = val
            }
            const handleCatpchaSent = async () => {
            const { code } = await captchaSent(formRef.phone)
              if (code === 200) {
                captcha.sending = true
                captchaCountdown()
                Taro.showToast({
                  title: '验证码发送成功',
                  icon: 'success',
                  duration: 1500
                })
              }
            }
            const captchaCountdown = () => {
              let timer: any = setInterval(() => {
                  if (captcha.current > 0) {
                    captcha.current --
                  } else {
                    clearInterval(timer)
                    timer = null
                    captcha.sending = false
                    captcha.current = captcha.wait
                  }
                }, 1000)
            }
            const handleLogin = () => {
                const { phone, password, captcha, nickname } = toRaw(formRef)
                if (!phone) {
                  return Taro.showToast({
                      title: '请输入手机号',
                      icon: 'none',
                  })
                } else if (!validateMobile(phone)) {
                  return Taro.showToast({
                        title: '请输入正确的手机号',
                        icon: 'none',
                    })
                } else if (!password) {
                    return Taro.showToast({
                        title: '请输入密码',
                        icon: 'none',
                    })
                }  else if (!captcha) {
                    return Taro.showToast({
                        title: '请输入验证码',
                        icon: 'none',
                    })
                }else if (optionType.value === 'register') {
                  if (!nickname) {
                    return Taro.showToast({
                        title: '请输入昵称',
                        icon: 'none',
                    })
                  }
                }
                apiRegisterOrChangepass(phone, password, captcha, nickname)
            }
            const existencePhoneCheck = reactive({
              phone: '',
              checked: false,
            })
            const apiRegisterOrChangepass = async (phone, password, captcha, nickname) => {
            if (existencePhoneCheck.phone !== phone) {
              const { code, exist } = await existencePhone(phone)
              if (code === 200 && exist !== -1) {
                return Taro.showToast({
                  title: '该手机号码已经注册过了',
                  icon: 'none',
                  duration: 1500
                })
              }
              existencePhoneCheck.phone = phone
              existencePhoneCheck.checked = true
            } else {
              if (!existencePhoneCheck.checked) {
                return Taro.showToast({
                  title: '该手机号码已经注册过了',
                  icon: 'none',
                  duration: 1500
                })
              }
            }
            const { token, profile, loginType, code: code3 } = await register(phone, password, captcha, nickname)
            if (code3 === 200) {
              Taro.setStorageSync('token', token)
              Taro.setStorageSync('profile', profile)
              Taro.setStorageSync('loginType', loginType)

              if (params?.redirect) {
                  if (['/pages/index/index', '/pages/music/index', '/pages/mine/index'].includes(params.reidrect)) {
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

            return {
                logo,
                optionType,
                captcha,
                existencePhoneCheck,
                formRef,
                handleLogin,
                handleInput,
                handleCatpchaSent,
            }
        },
    }
</script>
