<template>
  <div class="container">
    <van-cell-group>
      <van-field :value="phone" maxlength="11" clearable label="手机号" placeholder="请输入手机号" :error-message="phoneError" @change="onChange1" required />
      <van-field :value="phoneCode" maxlength="6" clearable label="短信验证码" placeholder="请输入短信验证码" :border="false" :error-message="phoneCodeError" @change="onChange2" required use-button-slot>
        <van-button slot="button" size="small" type="warning" :disabled="isCodePhoneDisable" @click="getRegCodePhone">
          <i v-if="!isCodePhoneDisable">获取验证码</i>
          <i class="codeDisable" v-else>{{phoneCodeTip}}</i>
        </van-button>
      </van-field>
      <van-field :value="password" maxlength="20" type="password" clearable label="密码" placeholder="请输入密码" :error-message="passwordError" @change="onChange3" required />
      <van-field :value="passwordConfirm" maxlength="20" type="password" clearable label="确认密码" placeholder="请输入密码" :error-message="passwordConfirmError" @change="onChange4" required />
    </van-cell-group>
    <div class="login_button">
      <van-button size="normal" round block type="warning" custom-class="mgt20" @click="resetPsw">重置密码</van-button>
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
import { setTimeout } from 'timers';
export default {
  data: {
    phone: '',
    phoneError: '',
    phoneCode: '',
    phoneCodeError: '',
    password: '',
    passwordError: '',
    passwordConfirm: '',
    passwordConfirmError: '',
    isCodePhoneDisable: false,
    phoneCodeTip: '',
  },
  mounted() {
    this.resetZd()
  },
  methods: {
    resetZd() {
      this.phone = ''
      this.phoneError = ''
      this.phoneCode = ''
      this.phoneCodeError = ''
      this.password = ''
      this.passwordError = ''
      this.passwordConfirm = ''
      this.passwordConfirmError = ''
      this.isCodePhoneDisable = false
      this.phoneCodeTip = ''
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
      this.phoneCode = value
      //
      this.phoneCodeError = ''
    },
    onChange3(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.password = value
      //
      this.passwordError = ''
    },
    onChange4(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.passwordConfirm = value
      //
      this.passwordConfirmError = ''
    },
    async resetPsw() {
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
        this.passwordError = '密码长度在6~18之间，只能包含字母、数字和下划线'
        return
      }
      if (this.passwordConfirm !== this.password) {
        this.passwordConfirmError = '密码不一致'
        return
      }
      if (this.phoneCode == '') {
        this.phoneCodeError = '验证码不能为空'
        return
      }
      const data = await post('/recruitment/user/forgetPassword.do', {
        phone: this.phone,
        password: this.password,
        randomNumUser: this.phoneCode
      })
      console.log(data)
      if (data.status == 0) {
        Toast.loading({
          mask: true,
          message: '重置成功,跳转登录...'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      } else {
        Toast.fail(data.msg)
      }
    },
    getRegCodePhone: function () {
      //点击按钮获取短信验证码
      var self = this
      if (self.isCodePhoneDisable) {
        return
      }
      self.getRegCodePhoneAjax();
    },
    async getRegCodePhoneAjax() {
      var self = this
      //验证手机号
      if (!self.phone) {
        self.phoneError = '手机号不能为空';
        return
      }
      if (!isPhoneNumber(self.phone)) {
        self.phoneError = '手机格式错误'
        return
      }
      self.isCodePhoneDisable = true;
      self.phoneCodeTip = "发送中…";
      const data = await post('/recruitment/user/sendMsmForgetPassword.do', {
        phone: this.phone
      })
      console.log(data);
      if (data.status == 0) {
        var t = 60;
        self.phoneCodeTip = `${t}s后重发`;
        var int = setInterval(function () {
          t = t - 1;
          if (t > 0) {
            self.phoneCodeTip = `${t}s后重发`;
          } else {
            self.phoneCodeTip = "重新获取";
            clearInterval(int);
            self.isCodePhoneDisable = false;
          }
        }, 1000);
      } else {
        self.phoneCodeTip = "重新获取";
        self.isCodePhoneDisable = false;
        Toast.fail(data.msg);
      }
    },
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
