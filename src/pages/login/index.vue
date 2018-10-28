<template>
  <div class="container">
    <van-cell-group>
      <van-field :value="phone" label="手机号" placeholder="请输入手机号" :error-message="phoneError" @change="onChange1" />
      <van-field :value="password" type="password" label="密码" placeholder="请输入密码" :error-message="passwordError" :border="false" @change="onChange2" />
    </van-cell-group>
    <div class="zx_login_act">
      <van-button size="normal" round block type="primary" custom-class="zx_bgColor" @click="login">登录</van-button>
      <van-button size="normal" round block type="primary" custom-class="mgt20" @click="jumpTo('/pages/register/main')">我要注册</van-button>
      <van-button size="normal" plain round block type="primary" custom-class="mgt20" @click="jumpTo('/pages/index/main')">返回首页</van-button>
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
import fake from '@/utils/fake'
import Toast from '@/../static/vant/toast/toast'
import Dialog from '@/../static/vant/dialog/dialog';
export default {
  data: {
    phone: '',
    phoneError: '',
    password: '',
    passwordError: '',
  },
  mounted(){
    this.resetZd()
  },
  methods: {
    resetZd(){
      this.phone = ''
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
      });
    },
    login() {
      let self = this
      if(this.phone == ''){
        this.phoneError = '手机号不能为空'
        return
      }
      if (!isPhoneNumber(this.phone)) {
        this.phoneError = '手机格式错误'
        return
      }
      console.log(1)
      if(this.password == ''){
        this.passwordError = '密码不能为空'
        return
      }
      if (!isValidPassword(this.password)) {
        this.passwordError = '密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
        return
      }
      let {
        phone,
        password
      } = fake
      if (this.phone == phone && this.password == password) {
        let second = 1;
        const timer = setInterval(() => {
          second--;
          if (second) {
            Toast.loading({
              mask: false,
              message: '登录中...'
            });
          } else {
            clearInterval(timer);
            Toast.clear();
            wx.setStorageSync('phone', phone)
            wx.switchTab({
              url: '/pages/center/main'
            })
          }
        }, 1000);
      }else{
        Toast.fail('密码错误');
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
