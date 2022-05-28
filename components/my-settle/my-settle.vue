<template>
  <view class="settleContainer">
    <!-- 全选 -->
    <view class="radio" @click="allStatus">
      <radio color="#C00000" :checked="isFullCheck"></radio>
      <text>全选</text>
    </view>
    <!-- 合计 -->
    <view class="sum">
      合计:<text class="text">￥{{checkedGoodsPrice}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn" @click="toSettle">结算（{{checkedGoodsCount}}）</view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器
        timer: null

      };
    },
    methods: {
      ...mapMutations('cart', ['changeStatus']),
      ...mapMutations('user', ['updateRedirectInfo']),
      //用于倒计时跳转
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      //倒计时跳转
      delayNavigate() {
        // 每次打开都把倒计时重置为3
        this.seconds = 3
        this.showTips(this.seconds)
        // 创建定时器，每隔 1 秒执行一次
        this.timer = setInterval(() => {
          // 先让秒数自减 1
          if (this.seconds == 1) {
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            return clearInterval(this.timer)
          }
          this.seconds--
          // 再根据最新的秒数，进行消息提示
          this.showTips(this.seconds)
        }, 1000)
      },
      // 点击全选
      allStatus() {
        this.changeStatus(!this.isFullCheck)
      },
      //点击结算
      toSettle() {
        if (!this.checkedGoodsCount) return uni.$showMsg('请先选择要结算的商品吧')
        if (!this.addressStr) return uni.$showMsg('请先填写收货信息吧')
        // 最后判断用户是否登录了
        if (!this.token) return this.delayNavigate()
        // 实现微信支付功能
        this.payOrder()
      },
      // 微信支付
      async payOrder() {
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.addressStr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number
        // 2. 订单预支付
           // 2.1 发起请求获取订单的支付信息
           const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
           // 2.2 预付订单生成失败
           if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
           // 2.3 得到订单支付相关的必要参数
           const payInfo = res2.message.pay
        
           // 3. 发起微信支付
           // 3.1 调用 uni.requestPayment() 发起微信支付
           const [err, succ] = await uni.requestPayment(payInfo)
           // 3.2 未完成支付
           if (err) return uni.$showMsg('订单未支付！')
           // 3.3 完成了支付，进一步查询支付的结果
           const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
           // 3.4 检测到订单未支付
           if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
           // 3.5 检测到订单支付完成
           uni.showToast({
             title: '支付完成！',
             icon: 'success'
           })
        }
        
    },
    computed: {
      ...mapGetters('cart', ['total', 'checkedGoodsPrice', 'checkedGoodsCount']),
      ...mapGetters('user', ['addressStr']),
      ...mapState('user', ['token']),
      ...mapState('cart', ['cart']),
      // 是否全选
      isFullCheck() {
        return this.toatl ? false : this.total === this.checkedGoodsCount
      },
    }
  }
</script>

<style lang="scss">
  .settleContainer {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 110rpx;
    background-color: #fff;

    .radio {
      margin-left: 10px;
    }

    .sum {
      font-size: 18px;

      .text {
        color: #c00000;
      }
    }

    .btn {
      width-max: 100px;
      height: 100%;
      background-color: #c00000;
      color: white;
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
