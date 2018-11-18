<template>
  <div class="container">
    <div class="zx_center_header" @click="goTo('/pages/user/main')">
      <div class="zx_txt">
        <div v-if="user">
          <div class="zx_phone">{{user?user.phone:'--'}}</div>
          <navigator url="" open-type="redirect" class="zx_user_edit" hover-class="other-navigator-hover">查看并编辑个人信息</navigator>
        </div>
        <div v-else>未登录</div>
      </div>
      <div class="zx_user_pic">
        <img :src="user.photo" alt="" v-if="user &&user.photo">
        <img src="https://raw.githubusercontent.com/BelinChung/api-mock/master/assets/avatar_hi.png" v-else/>
      </div>
    </div>
    <div class="zx_center_nav">
      <van-cell-group>
        <van-cell custom-class="zx_cell_box" icon="description" title="信息发布" @click="checkBuyState" value="未发布" is-link/>
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
import {
  get,
  post
} from "../../utils"

export default {
  data: {
    user: null
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
      var JSESSIONID = wx.getStorageSync('JSESSIONID')
      if (!JSESSIONID) {
        this.jumpTo('/pages/login/main')
      } else {
        // 获取用户信息
        this.getUserData()
      }
      wx.hideLoading()
    },
    async getUserData() {
      const data = await get('/recruitment/user/selectUserInfoByUserId.do')
      if (data.status == 0) {
        this.user = data.data
        wx.setStorageSync('user', data.data)
      } else {
        Toast.fail(data.msg)
      }
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
    async logout() {
      const data = await post('/recruitment/user/logout.do')
      console.log(data)
      if (data.status == 0) {
        wx.removeStorageSync('user')
        wx.removeStorageSync('JSESSIONID')
        this.jumpTo('/pages/login/main')
      }
    },
    checkBuyState() {
      // this.goTo('/pages/buy/main')
      this.goTo('/pages/release/main')
    }
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
