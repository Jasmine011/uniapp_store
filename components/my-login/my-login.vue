<template>
  <view class="loginContainer">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="loginBtn" @click="getUserInfo">一键登录</button>
    <text class="text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {
        userInfo: []
      };
    },
    computed: {
      ...mapState('user', ['redirectInfo']),
    },
    methods: {
      ...mapMutations('user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      getUserInfo() {
        // console.log("触发")
        uni.getUserProfile({
          desc: "获取你的昵称、头像、地区及性别",
          success: (res) => {
            this.updateUserInfo(res.userInfo)
            // 当获取到了微信用户的基本信息之后，还需要进一步调用登录相关的接口，从而换取登录成功之后的 Token 字符串
            // 获取登录成功后的 Token 字符串
            this.getToken(res)
          },
          fail() {
            uni.$showMsg('取消了授权')
          }
        })
      },
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // 换取 token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        /* if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
         uni.$showMsg('登录成功') 
         this.updateToken(loginResult.message.token)
         //这里接口错误，于是自己写一个虚拟token
         */
        uni.$showMsg('登录成功')
        this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo")
        // 则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              //this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .loginContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 230rpx;

    .loginBtn {
      margin-top: 20rpx;
      background-color: #c00000;
      height: 80rpx;
      width: 80%;
      border-radius: 40rpx;
      line-height: 80rpx;
      text-align: center;
    }

    .text {
      margin-top: 18rpx;
      font-size: 12px;
      color: gray;
    }
  }
</style>
