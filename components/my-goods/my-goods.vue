<template>
  <view class="goods-item" >
    <!-- 左侧图片 -->
    <view class="goods-item-left">
      <radio checked color="#C00000" v-if="showRadio" :checked="goods.goods_state" @click="clickRadio"></radio>
      <image :src="goods.goods_small_logo||defaultImg" mode="" class="goods-pic" @click="toGoodsDetail(goods.goods_id)"></image>
    </view>
    <!-- 右侧信息 -->
    <view class="goods-item-right" >
      <view class="title" @click="toGoodsDetail(goods.goods_id)">{{goods.goods_name}}</view>
      <view class="price" style="color:red">
        <text>￥{{goods.goods_price||0|toFixed}}</text>
        <uni-number-box :min="1" v-if="showNumBox" v-model="goods.goods_count" @change="addOrSubtract"></uni-number-box>
      </view>
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
      },
      showRadio:{
        type:Boolean,
        default:false
      },
      showNumBox:{
        type:Boolean,
        default:false
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
      },
      //点击选择框
      clickRadio(e){
        this.$emit('radio-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        })
      },
      //加减
      addOrSubtract(e){
        this.$emit('num-change',{
          goods_id:this.goods.goods_id,
          goods_count:e-0
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
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border-bottom:1px solid #f0f0f0;
  .goods-item-left{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-left:5px ;
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
      display: flex;
      justify-content: space-between;
      font-size: 18px;
    }
  }
}
</style>