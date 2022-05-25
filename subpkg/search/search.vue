<template>
  <view class="search-main">
    <!-- 搜索区域start -->
    <view class="my-search-box">
      <uni-search-bar :radius="100" cancelButton="none" @input="input" ></uni-search-bar>
    </view>
    <!-- 搜索区域end -->
    <!-- 搜索联想内容start -->
    <div class="searchList" v-if="associateList.length">
      <div class="searchList-item" v-for="item in associateList" :key="item.goods_id" @click="toDetail(item.goods_id)">
        <uni-icons type="search"></uni-icons>
        <div class="searchList-item-text">{{item.goods_name}}</div>
        <uni-icons type="arrowright"></uni-icons>
      </div>
    </div>
    <!-- 搜索联想内容end -->
    <!-- 搜索历史start -->
    <div class="history-box" v-else>
      <div class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="20" @click="delHistoryList"></uni-icons>
      </div>
      <div class="history-conatiner">
        <view class="history-item" v-for="(item,index) in historyList" :key="index" @longtap="longtapHistory(index)" @click="toGoodsList(item)">{{item}}</view>
      </div>
    </div>
    <!-- 搜索历史end -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //用于防抖
        timer:null,
        //搜索关键词
        kwyword:'',
        //根据搜索关键词获得的联想内容
        associateList:[],
        //搜索历史关键词
        historyList:['xiao','小米','手机']
      };
    },
    methods:{
      //输入
      input(e){
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.keyword = e
          this.toAssociate(this.keyword)
        },500)
      },
      //根据输入的词给的联想内容
      async toAssociate(kw){
        //如果搜索关键词为空，搜索联想内容也应该为空
        if(kw===''){
          return this.associateList=[]
        }
        const result = await uni.$http.get('/api/public/v1/goods/qsearch?query='+kw)
        if(result.statusCode==200){
          this.associateList = result.data.message
          //把搜索过的字段存储到历史记录列表
          this.saveSearchHistory(kw)
        }else{
          return uni.$showMsg()
        }
      },
      //点击联想内容，去往相应商品详情页
      toDetail(goods_id){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+goods_id
        })
      },
      //存储历史搜索
      saveSearchHistory(kw){
        //如果搜索关键词和历史记录里的关键词有重复，把那个重复的字段删除，并把搜索字段添加在历史列表第一位
        this.historyList.indexOf(kw)!=-1?this.historyList.splice(this.historyList.indexOf(kw),1):''
        this.historyList.unshift(kw)
        //并把历史记录列表存储到本地
        uni.setStorageSync('HISTORY',JSON.stringify(this.historyList))
      },
      //点击删除历史记录
      delHistoryList(){
        uni.showModal({
        	title: '提示',
        	content: '确认删除全部历史记录?',
        	success: function (res) {
        		if (res.confirm) {
        			// 用户点击确定
              this.historyList=[]
              uni.setStorageSync('HISTORY','[]')
        		} else if (res.cancel) {
        			// 用户点击取消
              return ;
        		}
        	}.bind(this)
        })
      },
      //长按历史记录删除
      longtapHistory(index){
        uni.showModal({
        	title: '提示',
        	content: '确认删除该历史记录?',
        	success: function (res) {
        		if (res.confirm) {
        			// 用户点击确定，删除点击项
              this.historyList.splice(index,1)
              //并把历史记录列表存储到本地
              if(!this.historyList.length){
                return uni.setStorageSync('HISTORY','[]')
              }
              uni.setStorageSync('HISTORY',JSON.stringify(this.historyList))
        		} else if (res.cancel) {
        			// 用户点击取消
              return ;
        		}
        	}.bind(this)
        })
      },
      //点击历史记录项去商品列表
      toGoodsList(kw){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query='+kw
        })
      }
    },
    onLoad(){
      //获取本地存储的搜索历史记录列表
      this.historyList = JSON.parse(uni.getStorageSync('HISTORY')||'[]')
    }
  }
</script>

<style lang="scss">
  .my-search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
  .searchList-item{
    background-color: #fff;
    padding: 13px 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e9e9e9;
    .searchList-item-text{
      //强制一行显示
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 5px;
    }
  }
  .history-box{
    background-color: #fff;
    .history-title{
      display: flex;
      justify-content: space-between;
      padding: 10px;
      font-size: 14px;
      border-bottom: 1px solid #e9e9e9;
    }
    .history-conatiner{
      display: flex;
      .history-item{
        padding: 5px;
        background-color: #f9f9f9;
        margin:5px;
      }
    }
  }
</style>
