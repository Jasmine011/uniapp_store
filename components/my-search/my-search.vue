<template>
  <view class="search-container" :style="{'background-color':bg_color}" @click="toSearch">
    <view class="search-box" :style="{'border-radius':bor_radius+'px'}">
      <uni-icons type="search" size="16"></uni-icons>
      <text class="text">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    //用外部数据，拓展组件功能
    props:{
      bg_color:{
        type:String,
        default:'#c00000'
      },
      bor_radius:{
        type:Number,
        default:16
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      toSearch(){
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-container{
    //background-color: #c00000;
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .search-box{
      width: 100%;
      background-color: #fff;
      height: 36px;
      //border-radius: 16px;
      line-height: 36px;
      text-align: center;
      .text{
        margin-left: 5px;
      }
    }
  }
</style>