<template>
  <view>
    <!-- 搜索 -->
    <div class="home-search-box">
      <my-search></my-search>
    </div>
    <!-- 轮播图 start-->
    <swiper :indicator-dots="true" :circular="true" indicator-color="white" indicator-active-color="red"
      :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="item in swiperList" :key="item.goods_id" :scroll-top="scrollTop">
        <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 轮播图 end-->
    <!-- 分类导航start -->
    <view class="navList">
      <view class="navItem" v-for="(nav,index) in navList" :key="index" @click="toNav(nav)">
        <view class="navTitle">
          <image :src="nav.image_src"></image>
        </view>
      </view>
    </view>
    <!-- 分类导航end -->
    <!-- 楼层展示start -->
    <view class="floorList">
      <!-- 标题图片 -->
      <view class="floorItem" v-for="(floor,index) in floorList" :key="index">
          <image :src="floor.floor_title.image_src" class="floorTitle"></image>
        <view class="floorContent">
          <!-- 左侧大图 -->
          <view class="floorContentLeft">
            <image :src="floor.product_list[0].image_src" :style="{width:floor.product_list[0].image_width +'rpx'}" mode="widthFix" @click="toGoodsList(floor.product_list[0])"></image>
          </view>
          <!-- 右侧四张小图 -->
          <view class="floorContentRight">
            <navigator v-for="(item2,index2) in floor.product_list" :key="index2" :url='item2.url'>
              <image :src="item2.image_src" mode="widthFix" v-if="index2!=0" :style="{width:item2.image_width +'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
    <!-- 楼层展示end -->
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins:[badgeMix],
    data() {
      return {
        swiperList: [], //轮播图列表
        navList: [], //分类导航
        floorList:[], //楼层列表
      };
    },
    //小程序的加载生命周期
    onLoad() {
      //发起获取轮播图请求
      this.getSwiperList()
      //发起获取分类导航列表请求
      this.getNavList()
      //发起请求获取楼层列表
      this.getFloorList()
    },
    methods: {
      //获取轮播图
      async getSwiperList() {
        const result = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (result.statusCode == 200) {
          //获取数据成功
          this.swiperList = result.data.message
        } else {
          //获取数据失败
          return uni.$showMsg()
        }
      },
      //获取分类导航列表
      async getNavList() {
        const result = await uni.$http.get('/api/public/v1/home/catitems')
        if (result.statusCode == 200) {
          this.navList = result.data.message
        } else {
          return uni.$showMsg()
        }
      },
      //点击nav导航，去往响应的页面
      toNav(nav) {
        switch (nav.name) {
          case '分类':
            uni.switchTab({
              url: '/pages/cate/cate'
            })
            break;
          case '秒杀拍':
            console.log('秒杀拍')
            break;
          case '超市购':
            console.log('超市购')
            break;
          case '母婴品':
            console.log('母婴品')
            break;
        }
      },
      //获取楼层展示列表数据
      async getFloorList(){
        const result = await uni.$http.get('/api/public/v1/home/floordata')
        if(result.statusCode==200){
          //this.floorList = result.data.message，这里不能直接存储，后台给我们的地址不是我们想要的
          this.floorList = result.data.message.filter(item=>{
            item.product_list.forEach(prod=>{
              prod.url = '/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
            })
            return item
          })
        }
      },
      //点击楼层大图去goodsList
      toGoodsList(query){
        const path = '/subpkg/goods_list/goods_list?'+query.navigator_url.split('?')[1]
        uni.navigateTo({
          url:path
        })
      }
    }
  }
</script>

<style lang="scss">
  .home-search-box{
    position: sticky;
    top: 0;
    z-index: 666;
  }
  swiper {
    height: 330rpx;
    swiper-item,
    navigator,
    image {
      height: 100%;
      width: 100%;
    }
  }

  .navList {
    display: flex;
    justify-content: space-around;
    padding-top: 20rpx;
    height:140rpx ;
    .navItem {
      image {
        width: 128rpx;
        height: 140rpx;
      }
    }
  }
.floorList{
  padding: 30rpx 0 0 10rpx;
  .floorTitle{
    height: 60rpx;
    width: 100%;
  }
  .floorContent{
    display: flex;
    justify-content: space-between;
  .floorContentRight{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  }
}

</style>
