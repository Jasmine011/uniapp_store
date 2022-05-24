<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧滚动区域start -->
      <scroll-view class="scroll-view-left" scroll-y :style="{height:wh}">
        <view :class="{'scroll-view-left-item':true,'active':index==active?true:false}" v-for="(cate,index) in cateList" :key="cate.cat_id" @click="clickCate(index)">{{cate.cat_name}}</view>
      </scroll-view>
      <!-- 左侧滚动区域end -->
      <!-- 右侧滚动区域start -->
      <scroll-view class="scroll-view-right" scroll-y :style="{height:wh}" :scroll-top="scrollTop">
        <view class="scroll-view-right-item" v-for="(c2,index) in cateLeve2" :key="index">
          <view class="c2_title">/ {{c2.cat_name}} /</view>
          <view class="c2_content">
            <view v-for="(c3,i3) in c2.children" :key="i3" class="c3_box" @click="toGoodsList(c3)">
              <image :src="c3.cat_icon.replace('dev','web')"></image>
              <text>{{c3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- 右侧滚动区域end -->
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //屏幕可用高度
        wh: '551px',
        //分类列表
        cateList:[],
        //cate选中的索引
        active:0,
        //二级分类
        cateLeve2:[],
        //滚动条距离顶部（每次切换分类滚动条要回到起始位置）
        scrollTop:0
      };
    },
    onLoad() {
      //获取屏幕可用高度（总高度减去上下tabbar）
      this.wh = uni.getSystemInfoSync().windowHeight + 'px'
      //发起请求获取分类列表
      this.getCateList()
    },
    methods:{
      //获取分类列表
      async getCateList(){
        const result = await uni.$http.get('/api/public/v1/categories')
        if(result.statusCode){
          this.cateList = result.data.message
          //我们优先获取第一个分类的二级分类信息。因为我们把第一个当做默认选中。
          this.cateLeve2 = result.data.message[0].children
        }else{
          uni.$showMsg()
        }
      },
      //点击分类
      clickCate(index){
        this.active = index
        //每带你一次，把点击的分类的二级分类展示
        this.cateLeve2 = this.cateList[index].children
        //重置滚动条
        //每次给scrollTop赋值如果都是0的话，不会生效，所以我们给它0到1之间切换，好在1px是一个很小的值
        this.scrollTop = this.scrollTop?1:0
      },
      //点击三级分类去商品list
      toGoodsList(c3){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid='+c3.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;
    .scroll-view-left {
      width: 120px;
      .scroll-view-left-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
        &.active{
          position: relative;
          background-color: #fff;
          &::before{
            content:'';
            display:block;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 30px;
            background-color: #c00000;
          }
        }
      }
    }
    .scroll-view-right{
      background-color: #fff;
      .scroll-view-right-item{
        .c2_title{
          text-align: center;
          line-height: 60px;
          font-weight: 700;
        }
        .c2_content{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .c3_box{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 10rpx;
            width: 33.33%;
            image{
              width: 60px;
              height: 60px;
            }
            text{
              text-align: center;
              line-height: 24px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>
