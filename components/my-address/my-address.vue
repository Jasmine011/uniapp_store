<template>
  <view class="addressBox">
    <!-- 选择地址的按钮 -->
    <view class="addressBtn" v-if="JSON.stringify(address)==='{}'">
      <button type="primary" @click="addAddress" class="btn">请选择收货地址+</button>
    </view>
    <!-- 收货地址信息 -->
    <view class="addressInfo" v-else @click="addAddress">
      <view class="row1">
        <view class="infoName">收货人：<text>{{address.userName}}</text></view>
        <view >电话：<text class="infoPhone">{{address.telNumber}}</text ><uni-icons type="right" size="20"></uni-icons></view>
      </view>
      <view class="row2">
        <view class="infoAddress">收货地址：<text>{{addressStr}}</text></view>
      </view>
    </view>
    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import {mapState,mapMutations,mapGetters} from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
      };
    },
    methods:{
      ...mapMutations('user',['updateAddress']),
      //点击添加地址
      // uni.chooseAddress是异步请求
      async addAddress(){
         // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
           // 返回值是一个数组：第1项为错误对象；第2项为成功之后的收货地址对象
           const [err, succ] = await uni.chooseAddress().catch(err => err)
           // 2. 用户成功的选择了收货地址
           if (succ && succ.errMsg === 'chooseAddress:ok') {
             // 更新 vuex 中的收货地址
             this.updateAddress(succ)
           }
      },
      },
      computed: {
        ...mapState('user',['address']),
        ...mapGetters('user',['addressStr'])
    }
  }
</script>

<style lang="scss">
  .addressBox{
    position: relative;
    padding: 30rpx 14rpx;
  }
.addressBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  .btn{
    height: 60rpx;
    line-height: 60rpx;
    width: 50%;
  }
}
//info
.addressInfo{
  padding: 0 7px;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  .row1{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    .infoPhone {
            margin-right: 10px;
          }
  }
}
// 底部边框线的样式
.address-border {
  position: absolute;
  bottom: 0;
  display: block;
  width: 100%;
  height: 5px;
}
</style>