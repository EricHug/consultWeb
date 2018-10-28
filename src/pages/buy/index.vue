<template>
  <div class="container">
    <div class="zx_buy">
      <van-cell-group>
        <div>
          <van-field label="发布时限" readonly use-icon-slot :border="true"/>
          <view class="zx_img_container">
            <van-stepper :value="value" integer min="1" max="12" step="1" @change="onChange1" />
          </view>
        </div>
      </van-cell-group>
      <div class="zx_total">总共：{{value*unit}}元</div>
      <div class="zx_button_box">
        <van-button size="normal" round block type="primary" custom-class="" @click="pay">微信支付</van-button>
      </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
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
    value:1,
    unit: 20
  },
  mounted(){
    this.value = 1
  },
  methods: {
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
    pay() {
      let self = this
      Toast.success('支付成功')
      setTimeout(function(){
        self.jumpTo('/pages/index/main')
      },1000)
    },
    onChange1(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.value = value
    }
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
