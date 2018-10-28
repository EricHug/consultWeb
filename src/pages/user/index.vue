<template>
  <div class="container">
    <div class="zx_release">
      <van-cell-group>
        <div @click="chooseImage">
          <van-field :value="title" label="头像" readonly use-icon-slot @change="onChange1" :border="true" is-link/>
          <view class="zx_img_container">
            <img :src="avatarUrl">
          </view>
        </div>
        <van-field label="密码" readonly value="***" input-align="right" @click="showPasswordConfirm=true" is-link/>
      </van-cell-group>
      <div class="zx_button_box mgt20">
        <van-button size="normal" round block type="primary" custom-class="zx_bgColor" @click="save">保存</van-button>
      </div>
    </div>
    <van-popup :show="showArea" position="buttom" @close="onClose" custom-class="ajust_popup">
      <van-area v-if="showArea" :value="areaCode" :area-list="areaList" @confirm="confirmArea" />
    </van-popup>
    <!-- 密码确认框 -->
    <van-dialog use-slot :show="showPasswordConfirm" title="修改密码" show-cancel-button close-on-click-overlay @close="onCancel" @cancel="onCancel" @confirm="onConfirm">
      <van-cell-group>
        <van-field :value="password" type="password" label="新密码" placeholder="请输入新密码" :error-message="passwordError" @change="onChange1" />
        <van-field :value="passwordConfirm" type="password" label="密码确认" :border="false" placeholder="请输入新密码确认" :error-message="passwordConfirmError" @change="onChange2" />
      </van-cell-group>
    </van-dialog>
    <van-toast id="van-toast" />
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
import areaList from '@/utils/area.js'
import { setTimeout } from 'timers';
// Use Vuex
export default {
  components: {
  },
  data: {
    avatarUrl: null,
    showPasswordConfirm: false,
    hiddenPassword: '***',
    password: '',
    passwordConfirm: '',
    passwordError: '',
    passwordConfirmError: ''
  },
  methods: {
    chooseImage() {
      var self = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          self.avatarUrl = tempFilePaths
        }
      })
    },
    onConfirm() {
      //
      console.log('confirm password')
      if (this.password == '') {
        // this.passwordError = '密码不能为空'
        Toast.fail('密码不能为空')
        return
      }
      if (this.passwordConfirm == '') {
        // this.passwordConfirmError = '密码不能为空'
        Toast.fail('密码不能为空')
        return
      }
      if (!isValidPassword(this.password) || !isValidPassword(this.passwordConfirm)) {
        Toast.fail('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线')
        return
      }
      if (this.password != this.passwordConfirm) {
        // this.passwordConfirmError = '密码不一致'
        Toast.fail('密码不一致')
        return
      }
       Toast.success('保存成功')
    },
    onCancel() {
      //
      console.log('cancel image')
      this.showPasswordConfirm = false
    },
    save() {
      Toast.success('保存成功');
    },
    onChange1(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.password = value
      //
      this.passwordError = ''
    },
    onChange2(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.passwordConfirm = value
      //
      this.passwordConfirmError = ''
    },
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
