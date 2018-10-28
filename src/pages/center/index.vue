<template>
  <div class="container">
    <div class="zx_center_header" @click="goTo('/pages/user/main')">
      <div class="zx_txt">
        <div v-if="phone">
          <div class="zx_phone">13530000000</div>
          <navigator url="" open-type="redirect" class="zx_user_edit" hover-class="other-navigator-hover">查看并编辑个人信息</navigator>
        </div>
        <div v-else>未登录</div>
      </div>
      <div class="zx_user_pic">
        <img src="https://raw.githubusercontent.com/BelinChung/api-mock/master/assets/avatar_hi.png">
      </div>
    </div>
    <div class="zx_center_nav">
      <van-cell-group>
        <van-cell custom-class="zx_cell_box" icon="description" title="信息发布" @click="checkBuyState" is-link/>
      </van-cell-group>
    </div>
    <div class="zx_center_footer">
      <p>
        <span @click="logout">退出登录</span>
      </p>
    </div>
  </div>
</template>

<script>
// Use Vuex
import store from './store'

export default {
  data: {
    phone: ''
  },
  computed: {
    count() {
      return store.state.count
    }
  },
  mounted() {
    wx.showLoading({
      // title: '加载中',
      mask: true
    })
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      var phone = wx.getStorageSync('phone')
      if (!phone) {
        this.jumpTo('/pages/login/main')
      } else {
        this.phone = phone
      }
      wx.hideLoading()
    },
    goTo: function (url) {
      console.log(url)
      wx.navigateTo({
        url: url
      })
    },
    jumpTo(url) {
      console.log(url)
      if (url == '/pages/index/main' || url == '/pages/center/main') {
        wx.switchTab({
          url: url
        })
      } else {
        wx.redirectTo({
          url: url
        })
      }
    },
    logout() {
      wx.clearStorageSync()
      this.jumpTo('/pages/login/main')
    },
    checkBuyState(){
      // this.goTo('/pages/buy/main')
      this.goTo('/pages/release/main')
    }
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
