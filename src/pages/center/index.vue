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
        <img :src="user.photo" alt="" v-if="user&&user.photo">
        <img src="https://raw.githubusercontent.com/BelinChung/api-mock/master/assets/avatar_hi.png" v-else />
      </div>
    </div>
    <div class="zx_center_nav">
      <van-cell-group>
        <van-cell custom-class="zx_cell_box" icon="description" title="信息发布" @click="checkBuyState" :value="stateName"
          is-link />
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
      user: null,
      stateName: null,
      url: null
    },
    computed: {
      count() {
        return store.state.count
      }
    },
    onShow() {
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
        let self = this
        const data = await get('/recruitment/user/selectUserInfoByUserId.do')
        if (data.status == 0) {
          this.user = data.data
          if (this.user.photo) {
            this.user.photo = this.user.photo.replace(/\\/g, '/')
          }
          wx.setStorageSync('user', this.user)
          const data1 = await get('/recruitment/message/selectMessageByUserId.do')
          if (data1.status == 0) {
            console.log(1111111)
            self.stateName = '未发布'
            self.url = '/pages/release/main'
            this.user['activetime'] = data1.data['activetime']
            this.user['state'] = data1.data['state']
            wx.setStorageSync('user', this.user)
            let state = this.user['state']
            //
            console.log(22222)
            if (state == 1) {
              self.stateName = '待审核'
              self.url = '/pages/releaseList/main'
            } else if (state == 2) {
              self.stateName = '已发布'
              self.url = '/pages/releaseList/main'
            }
          } else {
            Toast.fail(data1.msg)
          }
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
        wx.showLoading({
          mask: true,
          title: '退出中',
        })
        const data = await get('/recruitment/user/logout.do')
        console.log(data)
        if (data.status == 0) {
          wx.removeStorageSync('user')
          wx.removeStorageSync('JSESSIONID')
          wx.removeStorageSync('detail')
          this.jumpTo('/pages/login/main')
          this.user = null
          wx.hideLoading()
        } else {
          Toast.fail(data.msg)
          wx.hideLoading()
        }
      },
      checkBuyState() {
        let self = this
        // this.goTo('/pages/buy/main')
        this.goTo(self.url)
      }
    }
  }

</script>

<style lang="scss">
  @import "./style.scss";

</style>
