<template>
  <div class="container">
    <van-cell-group>
      <van-field :value="phone" maxlength="11" label="手机号" placeholder="请输入手机号" :error-message="phoneError" @change="onChange1" />
      <van-field :value="password" maxlength="20" type="password" label="密码" placeholder="请输入密码" :error-message="passwordError"
        :border="false" @change="onChange2" />
    </van-cell-group>
    <div class="zx_login_act">
      <van-button size="normal" round block type="primary" custom-class="zx_bgColor" @click="login">登录</van-button>
      <van-button size="normal" round block type="primary" custom-class="mgt20" @click="jumpTo('/pages/register/main?phone='+phone)">我要注册</van-button>
      <van-button size="normal" plain round block type="primary" custom-class="mgt20" @click="jumpTo('/pages/index/main')">返回首页</van-button>
      <p class="zx_row">
        <span @click="goTo('/pages/resetPsw/main')">找回密码</span>
      </p>
      <!-- <van-row custom-class="mgt10">
        <van-col span="12">
          <span @click="jumpTo('/pages/register/main')" class="zx_font">我要注册</span>
        </van-col>
        <van-col span="12"></van-col>
      </van-row> -->
    </div>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
  import {
    isPhoneNumber,
    isValidPassword
  } from '@/utils/index'
  import Toast from '@/../static/vant/toast/toast'
  import Dialog from '@/../static/vant/dialog/dialog'
  import {
    get,
    post
  } from "../../utils"
  export default {
    data: {
      phone: '',
      phoneError: '',
      password: '',
      passwordError: '',
    },
    mounted() {
      let phone = this.$root.$mp.query.phone
      this.phone = phone ? phone : ''
      this.resetZd()
    },
    methods: {
      resetZd() {
        // this.phone = ''
        this.phoneError = ''
        this.password = ''
        this.passwordError = ''
      },
      goTo(url) {
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
      onClickIcon() {
        console.log(1111)
        Dialog.alert({
          // title: '标题',
          message: '密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
        }).then(() => {
          // on close
        })
      },
      async login() {
        let self = this
        if (this.phone == '') {
          this.phoneError = '手机号不能为空'
          return
        }
        if (!isPhoneNumber(this.phone)) {
          this.phoneError = '手机格式错误'
          return
        }
        if (this.password == '') {
          this.passwordError = '密码不能为空'
          return
        }
        if (!isValidPassword(this.password)) {
          this.passwordError = '密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
          return
        }
        Toast.loading({
          mask: true,
          message: '登录中...'
        })
        // 置空
        wx.removeStorageSync('JSESSIONID')
        const data = await post('/recruitment/user/login.do', {
          phone: this.phone,
          password: this.password
        })
        console.log(data)
        if (data.status == 0) {
          setTimeout(() => {
            Toast.clear()
            wx.setStorageSync('user', data.data)
            self.jumpTo('/pages/center/main')
          }, 800)
        } else {
          Toast.fail(data.msg)
        }
      },
      onChange1(event) {
        // event.mp.detail 为当前输入的值
        var value = event.mp.detail
        console.log(value)
        this.phone = value
        //
        this.phoneError = ''
      },
      onChange2(event) {
        // event.mp.detail 为当前输入的值
        var value = event.mp.detail
        console.log(value)
        this.password = value
        //
        this.passwordError = ''
      },
    }
  }

</script>

<style lang="scss">
  @import "./style.scss";

</style>
