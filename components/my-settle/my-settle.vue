<template>
  <view class="settleContainer">
    <!-- 全选 -->
    <view class="radio" @click="allStatus">
      <radio color="#C00000" :checked="isFullCheck"></radio>
      <text>全选</text>
    </view>
    <!-- 合计 -->
    <view class="sum">
      合计:<text class="text">￥{{checkedGoodsPrice}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn">结算（{{checkedGoodsCount}}）</view>
  </view>
</template>

<script>
  import {mapMutations,mapGetters} from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
      };
    },
    methods:{
      ...mapMutations('cart',['changeStatus']),
      allStatus(){
        this.changeStatus(!this.isFullCheck)
      }
    },
    computed:{
      ...mapGetters('cart',['total','checkedGoodsPrice','checkedGoodsCount']),
      isFullCheck() {
            return this.toatl?false:this.total === this.checkedGoodsCount
          },
    }
  }
</script>

<style lang="scss">
.settleContainer{
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 110rpx;
  background-color: #fff;
  .radio{
    margin-left: 10px;
  }
  .sum{
    font-size: 18px;
    .text{
      color: #c00000;
    }
  }
  .btn{
    width-max: 100px;
    height: 100%;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>