import {
  mapGetters
} from 'vuex'
// 这个模块是为了给购物车tabbar添加数字角标
export default {
  computed: {
    ...mapGetters('cart', ['total'])
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  watch:{
    total(){
      this.setBadge()
    }
  },
  methods: {
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text: this.total+''
      })
    },
  }
}
