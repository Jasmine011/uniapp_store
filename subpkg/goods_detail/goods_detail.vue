<template>
  <view class="goods_container">
    <!-- 轮播图区域start -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(pic,i) in goods_info.pics" :key="pic.pics_id">
        <image :src="pic.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 轮播图区域end -->
    <!-- 商品信息区域start -->
    <view class="goods_info_box">
      <!-- 价格 -->
      <view class="goods_price" v-if="goods_info.goods_price">￥{{goods_info.goods_price}}</view>
      <!-- 主体区域 -->
      <view class="goods_body">
        <view class="goods_body_text">{{goods_info.goods_name}}</view>
        <view class="goods_body_favi">
          <uni-icons type="star" size="25"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="freight">快递：免运费</view>
    </view>
    <!-- 商品信息区域end -->
    <!-- 商品详情信息start -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 商品详情信息end -->
    <!-- 商品导航区域（加入购物车...）start -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
    </view>
    <!-- 商品导航区域（加入购物车...）end -->
  </view>
</template>

<script>
  import {mapMutations,mapGetters} from 'vuex'
  export default {
    data() {
      return {
        //商品详情信息
        goods_info:[],
        //商品导航区域配置
        options: [{
        			icon: 'headphones',
        			text: '客服'
        		}, {
        			icon: 'shop',
        			text: '店铺',
        			info: 2,
        			infoBackgroundColor:'#007aff',
        			infoColor:"red"
        		}, {
        			icon: 'cart',
        			text: '购物车',
        			info: 0
        		}],
        	    buttonGroup: [{
        	      text: '加入购物车',
        	      backgroundColor: '#ff0000',
        	      color: '#fff'
        	    },
        	    {
        	      text: '立即购买',
        	      backgroundColor: '#ffa200',
        	      color: '#fff'
        	    }
        	    ],
      };
    },
    onLoad(options){
      this.getGoodsInfo(options.goods_id)
      //刚开局就展示购物车数量
      this.options[2].info=this.total
    },
    computed:{
      //计算商品总数
       ...mapGetters('cart',['total'])
    },
    methods:{
      //点击添加购物车按钮相关
      ...mapMutations('cart',['addToCart']),
      //获取商品详情
      async getGoodsInfo(id){
        const result = await uni.$http.get('/api/public/v1/goods/detail?goods_id='+id)
        if(result.statusCode==200){
          //获取到的信息goods_introduce有一段富文本，里面的图片底部有间隙，我们加工一下数据,把图片改为block
          //解决 .webp 格式图片在 ios 设备上无法正常显示的问题，将 webp 的后缀名替换为 jpg 的后缀名
          result.data.message.goods_introduce = result.data.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
          this.goods_info = result.data.message
        }else{
          return uni.$showMsg()
        }
      },
      //点击图片，预览大图
      preview(i){
        uni.previewImage({
          //预览的图片的索引
          current:i,
          //所有图片的url地址组成的数组
          urls:this.goods_info.pics.map(item=>item.pics_big)
        })
      },
      //点击底部商品导航，左侧按钮
      onClick(e){
        if(e.content.text==='购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        }
      },
      //击底部商品导航，右侧按钮
      buttonClick(e){
        if(e.content.text==='加入购物车'){
          //要传递的数据格式
          const goods = {
                   goods_id: this.goods_info.goods_id,       // 商品的Id
                   goods_name: this.goods_info.goods_name,   // 商品的名称
                   goods_price: this.goods_info.goods_price, // 商品的价格
                   goods_count: 1,                           // 商品的数量
                   goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
                   goods_state: true                         // 商品的勾选状态
                }
                //通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          this.addToCart(goods)
          this.options[2].info=this.total
        }
      }
    },
  }
</script>

<style lang="scss">
  .goods_container{
    padding-bottom: 50px;
    swiper{
      height: 750rpx;
      image{
        width: 100%;
        height: 100%;
      }
    }
    .goods_info_box{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .goods_price{
        padding:10px;
        color: #c00000;
        font-size: 44rpx;
      }
      .goods_body{
        display: flex;
        padding:0 10px;
        .goods_body_text{
          border-right: 1px solid #efefef;
        }
        .goods_body_favi{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 240rpx;
          text{
            font-size: 12px;
          }
        }
      }
      .freight{
        padding: 10px;
        font-size: 12px;
        color:gray;
      }
    }
    .goods_nav {
      // 为商品导航组件添加固定定位
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }

</style>
