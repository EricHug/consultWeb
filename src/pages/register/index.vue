<template>
  <div class="container">
    <van-cell-group>
      <van-field :value="phone" maxlength="11" label="手机号" placeholder="请输入手机号" :error-message="phoneError" @change="onChange1"
        required />
      <van-field :value="password" maxlength="20" type="password" label="密码" placeholder="请输入密码" :error-message="passwordError"
        :border="false" @change="onChange2" required />
    </van-cell-group>
    <div class="xy_box">
      <van-checkbox :value="checked" custom-class="tiaokuan" @change="onChange">注册代表同意</van-checkbox><a href="/pages/protocol/main" class="bst_xy">有事通商务信息咨询用户服务协议</a>
    </div>
    <div class="login_button">
      <van-button size="normal" round block type="primary" @click="register">注册</van-button>
      <van-button size="normal" round block type="primary" custom-class="zx_bgColor mgt20" @click="jumpTo('/pages/login/main?phone='+phone)">已有账号，直接登录</van-button>
      <van-button size="normal" plain round block type="primary" custom-class="mgt20" @click="jumpTo('/pages/index/main')">返回首页</van-button>
    </div>
    <!-- <van-row>
      <van-col span="12">
        <span @click="jumpTo('/pages/login/main')">已有账号，直接登录</span>
      </van-col>
      <van-col span="12"></van-col>
    </van-row> -->
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
  import {
    isPhoneNumber,
    isValidPassword
  } from '@/utils/index'
  import fake from '@/utils/fake'
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
      checked: false
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
        this.checked = false
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
      onChange(event) {
        // event.mp.detail 为当前输入的值
        var value = event.mp.detail
        console.log(value)
        this.checked = value
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
      async register() {
        let self = this
        if (this.phone == '') {
          this.phoneError = '手机号不能为空'
          return
        }
        if (!isPhoneNumber(this.phone)) {
          this.phoneError = '手机格式错误'
          return
        }
        console.log(1)
        if (this.password == '') {
          this.passwordError = '密码不能为空'
          return
        }
        if (!isValidPassword(this.password)) {
          this.passwordError = '密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
          return
        }
        if (!this.checked) {
          Toast.fail('请勾选注册协议')
          return
        }
        const data = await post('/recruitment/user/register.do', {
          phone: this.phone,
          password: this.password
        })
        console.log(data)
        if (data.status == 0) {
          Toast.loading({
            mask: true,
            message: '注册成功,登录中...'
          })
          // 置空
          wx.removeStorageSync('JSESSIONID')
          // setTimeout(()=>{
          //   self.jumpTo('/pages/login/main')
          // },1000)
          const data0 = await post('/recruitment/user/login.do', {
            phone: this.phone,
            password: this.password
          })
          console.log(data0)
          if (data0.status == 0) {
            setTimeout(() => {
              Toast.clear()
              wx.setStorageSync('user', data0.data)
              self.jumpTo('/pages/center/main')
            }, 800)
          } else {
            Toast.fail(data0.msg)
          }
        } else {
          Toast.fail(data.msg)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "./style.scss";
</style>
