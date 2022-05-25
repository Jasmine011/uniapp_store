<template>
  <view class="goods-item" @click="toGoodsDetail(goods.goods_id)">
    <!-- 左侧图片 -->
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo||defaultImg" mode="" class="goods-pic"></image>
    </view>
    <!-- 右侧信息 -->
    <view class="goods-item-right">
      <view class="title">{{goods.goods_name}}</view>
      <view class="price" style="color:red">￥{{goods.goods_price|toFixed}}</view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props:{
      goods:{
        type:Object,
        default:[]
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      toGoodsDetail(id){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+id
        })
      }
    },
    filters:{
      toFixed(num){
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
.goods-item{
  display: flex;
  padding: 10px;
  border-bottom:1px solid #f0f0f0;
  .goods-item-left{
    .goods-pic{
      width: 100px;
      height: 100px;
      vertical-align: center;
    }
  }
  .goods-item-right{
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title{
      font-size: 14px;
    }
    .price{
      font-size: 18px;
    }
  }
}
</style>