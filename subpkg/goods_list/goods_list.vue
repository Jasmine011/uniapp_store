<template>
  <view>
    <view class="goods-list">
      <my-goods v-for="goods in goodsList" :key="goods.goods_id" :goods="goods"></my-goods>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //请求参数对象
        queryObj:{
          //搜索关键词
            query:'',
            //商品分类id
            cid:'',
            //页码
            pagenum:1,
            //每页显示多少数据
            pagesize:10
        },
        //商品列表
        goodsList:[],
        //总数据条数
        total:0,
        //有些商品没有图片，定义一个默认图片
        defaultImg:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
        //节流阀，为避免频繁来回触底以至于多次发送请求
        flag:true
      };
    },
    methods:{
      //请求商品列表数据
      async getGoodsList(callback){
        //关闭节流阀
        this.flag=false
        const result = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        if(result.statusCode==200){
          //成功
          // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
          this.goodsList = [...this.goodsList,...result.data.message.goods]
          this.total = result.data.message.total
          callback&&callback()
          //开启节流阀
          this.flag =true
        }else{
          //失败
          return uni.$showMsg()
        }
      }
    },
    onLoad(options){
      this.queryObj.cid= options.cid||''
      this.queryObj.query = options.query||''
      this.getGoodsList()
    },
    //生命周期，滚动触底
    onReachBottom(){
      //isOver，数据全部加载完就不发请求了
      const isOver = this.queryObj.pagenum*this.queryObj.pagesize>=this.total
      if(!this.flag||isOver){
        return;
      }
      //页码加一，且重新发请求
      this.queryObj.pagenum+=1
      this.getGoodsList()
    },
    //生命周期，下拉刷新
    onPullDownRefresh(){
      //重置数据
      this.queryObj.pagenum=1
      this.total=0
      this.goodsList=[]
      //重新发请求
      this.getGoodsList(()=>uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>
