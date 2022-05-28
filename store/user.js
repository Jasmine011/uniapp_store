export default{
  // 为当前模块开启命名空间
  namespaced: true,
  state: () => ({
    address:JSON.parse(uni.getStorageSync('ADDRESS')||'{}')
  }),
  mutations:{
    updateAddress(state,address){
      state.address = address
      //本地存储
      this.commit('user/saveAddress')
    },
    saveAddress(state){
      uni.setStorageSync('ADDRESS',JSON.stringify(state.address))
    }
  },
  getters:{
    //拼接计算出地址信息
    addressStr:state=>{
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
  }
  
}