<template>
  <view class="userContainer">
    <!-- 头像昵称 -->
    <view class="topBox">
      <image :src="userInfo.avatarUrl" mode="" class="picture"></image>
      <text class="nickname">{{userInfo.nickName}}</text>
    </view>
    <!-- 用户面板信息 -->
    <view class="panel-list">
      <!-- 第一层，用户数据 -->
      <view class="userData">
        <view class="userData-item">
          <text>5</text>
          <text class="usertext">收藏店铺</text>
        </view>
        <view class="userData-item">
          <text>5</text>
          <text class="usertext">收藏商品</text>
        </view>
        <view class="userData-item">
          <text>14</text>
          <text class="usertext">关注商品</text>
        </view>
        <view class="userData-item">
          <text>55</text>
          <text class="usertext">足迹</text>
        </view>
      </view>
      <!-- 第二层，我的订单 -->
      <view class="order">
        <text class="orderTitle">我的订单</text>
        <view class="orderBoxList">
          <view class="orderBoxItem">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text class="text">待付款</text>
          </view>
          <view class="orderBoxItem">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text class="text">待收货</text>
          </view>
          <view class="orderBoxItem">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text class="text">退款/退货</text>
          </view>
          <view class="orderBoxItem">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text class="text">全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三层，其他（收货地址、联系客服） -->
      <view class="rests">
        <view class="restsItem">
          <text>收货地址</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
        <view class="restsItem">
          <text>联系客服</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
        <view class="restsItem" @click="logout">
          <text>退出登陆</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  export default {
    name:"my-userinfo",
    data() {
      return {
        
      };
    },
    computed:{
       ...mapState('user', ['userInfo']),
    },
    methods:{
      ...mapMutations('user',['updateAddress','updateUserInfo','updateToken']),
      logout(){
        uni.showModal({
        	title: '退出登陆',
        	content: '是否确认退出登陆？',
        	success: function (res) {
        		if (res.confirm) {
        			//console.log('用户点击确定');
              this.updateUserInfo({})
              this.updateToken('')
              this.updateAddress({})
        		} else if (res.cancel) {
        			//console.log('用户点击取消');
              return ;
        		}
        	}.bind(this)
        });
      }
    }
  }
</script>

<style lang="scss">
.userContainer{
  height: 100%;
  background-color: #f4f4f4;
  .topBox{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400rpx;
    background-color: #c00000;
    .picture{
      margin-bottom: 16rpx;
      height: 180rpx;
      width: 180rpx;
      border-radius: 50%;
    }
    .nickname{
      color: white;
      font-size: 42rpx;
    }
  }
  .panel-list{
      position: relative;
      top: -10px;
      padding: 0 10px;
      .userData{
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        border-radius: 3px;
        .userData-item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20rpx 0;
          .usertext{
            font-size: 14px;
            margin-top: 10rpx;
          }
        }
      }
      .order{
        background-color: #fff;
        margin-top: 20rpx;
        padding: 20rpx;
        .orderTitle{
          font-size: 36rpx;
        }
        .orderBoxList{
          display: flex;
          justify-content: space-around;
          margin-top: 30rpx;
          .orderBoxItem{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .icon{
              width: 35px;
              height: 35px;
            }
            .text{
              margin-top: 6rpx;
              font-size: 24rpx;
            }
          }
        }
      }
      .rests{
        background-color: #fff;
        margin-top: 20rpx;
        padding: 0 26rpx;
        .restsItem{
          display: flex;
          justify-content: space-between;
          height: 90rpx;
          line-height: 90rpx;
        }
      }
  }
}
</style>