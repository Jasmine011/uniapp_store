<template>
  <view class="cartContainer">
    <!-- 地址 -->
    <my-address></my-address>
    <!-- 头部标题 -->
    <view class="cartTitle">
      <uni-icons type="shop" size="20"></uni-icons>
      <text class="text">购物车</text>
    </view>
    <view class="goodsList" v-if="cart.length!==0">
      <uni-swipe-action>
        <view class="goodsItem" v-for="(goods,i) in cart" :key="i">
          <uni-swipe-action-item :right-options="options" @click="clickDel(goods)">
            <!-- showRadio 是否显示选择框 -->
            <my-goods :goods="goods" :showRadio="true" :showNumBox="true" @radio-change="handlerRadio" @num-change="handlerNum"></my-goods>
          </uni-swipe-action-item>
        </view>
      </uni-swipe-action>
    </view>
    <!-- 空白购物车区域 -->
      <view class="empty-cart" v-else>
        <image src="/static/k.png" class="empty-img"></image>
        <text class="tip-text">空空如也~</text>
      </view>
    <!-- 底部结算区域 -->
    <my-settle></my-settle>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
          }
        }]
      };
    },
    computed: {
      ...mapState('cart', ['cart']),
    },
    methods: {
      ...mapMutations('cart', ['changeGoodsState', 'chnageGoodsCount','delGoods']),
      // my-goods组件的自定义事件，改变商品选中状态
      handlerRadio(e) {
        //根据返回的商品id和商品状态去修改商品是否选中
        this.changeGoodsState(e)
      },
      // my-goods组件的自定义事件，改变商品数量
      handlerNum(e) {
        this.chnageGoodsCount(e)
      },
      //点击删除按钮
      clickDel(e){
        this.delGoods(e.goods_id)
      },
    }
  }
</script>

<style lang="scss">
  .cartContainer{
    padding-bottom: 110rpx;
    .cartTitle {
      display: flex;
      align-items: center;
      padding-left: 7px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #efefef;
    
      .text {
        margin-left: 10px;
      }
    }
    
    .goodsList {
      .goodsItem {
        display: flex;
      }
    }
    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 120px;
    
      .empty-img {
        width: 109px;
        height: 69px;
      }
    
      .tip-text {
        font-size: 12px;
        color: gray;
        margin-top: 15px;
      }
    }
  }
</style>
