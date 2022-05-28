export default {
  // 为当前模块开启命名空间
  namespaced: true,
  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('CART')||'[]'),
  }),
  // 模块的 mutations 方法
  mutations: {
    //添加到购物车
    addToCart(state, goods) {
      //先判断新增的goods是否已经存在于仓库中，如果不存在result应该为undefined
      const result = state.cart.find(item => {
        return item.goods_id === goods.goods_id
      })
      //如果没有就新增一个，如果已经有了就原来基础上加1
      if (!result) {
        state.cart.unshift(goods)
      } else {
        result.goods_count++
      }
      //并且把最新的cart存储到本地
      //一般项目我们会使用Module来分割多个模块，那我们就要使用this.commit(’ 模块名/函数 ')的方法来调用
      this.commit('cart/saveToStorage')
    },
    //存储到本地
    saveToStorage(state){
      uni.setStorageSync('CART',JSON.stringify(state.cart))
    },
    //修改商品选中状态
    changeGoodsState(state,goodsStatus){
      state.cart = state.cart.map(item=>{
        if(item.goods_id==goodsStatus.goods_id){
          item.goods_state = goodsStatus.goods_state
        }
        return item
      })
      this.commit('cart/saveToStorage')
    },
    //修改商品的数量
    chnageGoodsCount(state,goodsCount){
      state.cart = state.cart.map(goods=>{
        if(goods.goods_id==goodsCount.goods_id){
          goods.goods_count = goodsCount.goods_count
        }
        return goods
      })
      this.commit('cart/saveToStorage')
    },
    //删除某个商品
    delGoods(state,goods_id){
      state.cart = state.cart.filter(goods=>{
        return goods.goods_id!=goods_id
      })
      this.commit('cart/saveToStorage')
    },
    // 全选/全不选
    changeStatus(state,status){
      state.cart = state.cart.map(item=>{
        item.goods_state=status
        return item
      })
      this.commit('cart/saveToStorage')
    },
  },
  // 模块的 getters 属性
  getters: {
    //计算商品总数
    total: state => {
      let num = 0
      state.cart.forEach(item=>{
        num+=item.goods_count
      })
      return num
    },
    //计算购物车已勾选商品总价格
    checkedGoodsPrice:state=>{
      return state.cart.filter(goods=>goods.goods_state).reduce((pre,item)=>{
        return pre = item.goods_count*item.goods_price+pre
      },0)
    },
    checkedGoodsCount:state=>{
      return state.cart.filter(goods=>goods.goods_state).reduce((pre,item)=>{
        return pre=pre+item.goods_count
      },0)
    }
  },
}
