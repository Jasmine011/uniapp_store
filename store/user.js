export default {
  // 为当前模块开启命名空间
  namespaced: true,
  state: () => ({
    address: JSON.parse(uni.getStorageSync('ADDRESS') || '{}'),
    userInfo: JSON.parse(uni.getStorageSync('USERINFO') || '{}'),
    token: uni.getStorageSync('TOKEN') || '',
    // 重定向的 object 对象 { openType, from },openType 表示以哪种方式导航回之前的页面；from 表示之前页面的 url 地址
    redirectInfo: null
  }),
  mutations: {
    //更新收货信息到仓库
    updateAddress(state, address) {
      state.address = address
      //本地存储收货信息
      this.commit('user/saveAddress')
    },
    //本地存储收货信息
    saveAddress(state) {
      uni.setStorageSync('ADDRESS', JSON.stringify(state.address))
    },
    //保存用户信息到仓库
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      this.commit('user/saveUserInfo')
    },
    //本地存储用户登录信息
    saveUserInfo(state) {
      uni.setStorageSync('USERINFO', JSON.stringify(state.userInfo))
    },
    // 保存token到仓库
    updateToken(state, token) {
      state.token = token
      this.commit('user/saveToken')
    },
    // 本地存储token
    saveToken(state) {
      uni.setStorageSync('TOKEN', JSON.stringify(state.token))
    },
    // 更新重定向的信息对象
      updateRedirectInfo(state, info) {
        state.redirectInfo = info
      },
  },
  getters: {
    //拼接计算出地址信息
    addressStr: state => {
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
  }

}
