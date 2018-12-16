<template>
  <div class="container">
    <div class="zx_buy">
      <van-cell-group>
        <div>
          <van-field label="发布时限" readonly use-icon-slot :border="true" />
          <view class="zx_img_container">
            <van-stepper :value="value" integer min="1" max="12" step="1" @change="onChange1" />
          </view>
        </div>
      </van-cell-group>
      <div class="zx_total">总共：{{value*unit}}元</div>
      <div class="zx_button_box">
        <van-button size="normal" :disabled="!unit" round block type="primary" custom-class="" @click="pay">微信支付</van-button>
      </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import Toast from '@/../static/vant/toast/toast'
  import Dialog from '@/../static/vant/dialog/dialog'
  import {
    get,
    post,
    formatTime,
    transCodeToName
  } from "../../utils"
  import areaList from '@/utils/area.js'
  import {
    setTimeout
  } from 'timers'
  // Use Vuex
  export default {
    components: {},
    data: {
      value: 1,
      unit: null,
      msgId: null
    },
    mounted() {
      this.unit = this.$root.$mp.query.unit
      this.msgId = this.$root.$mp.query.msgId
      console.log('unit',unit)
      console.log('msgId',msgId)
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
      pay() {
        let self = this
        if (!self.msgId) {
          Toast.fail('获取msgId有误')
          return
        }
        if (!self.value) {
          Toast.fail('请选择购买时限')
          return
        }
        Toast.loading({
          mask: true,
          message: "支付中，请勿关闭..."
        })
        self.payoff()
        // Toast.success('支付成功')
        // setTimeout(function () {
        //   self.jumpTo('/pages/index/main')
        // }, 1000)
      },
      onChange1(event) {
        // event.mp.detail 为当前输入的值
        var value = event.mp.detail
        console.log(value)
        this.value = value
      },

      //1.code 用户登录凭证（有效期五分钟）,开发者需要在开发者服务器后台调
      //用code2Session，使用 code 换取 openid 和 session_key 等信息
      payoff: function (e) {
        console.log('payoff');
        var self = this;
        wx.login({
          success: function (res) {
            self.getOpenId(res.code);
          }
        });
      },

      //2.获取openid
      async getOpenId(code) {
        console.log('code:' + code);
        var self = this;
        const serverData = await post("/recruitment/getOpenId.do", {
          code
        });
        if (serverData.status == 0) {
          console.log('openid:' + serverData.data.openid);
          var openId = serverData.data.openid;
          self.xiadan(openId);
        } else {
          Toast.fail('getOpenId--出错:' + serverData.msg);
        }
      },
      //3.下单
      async xiadan(openId) {
        console.log('sessionid:' + wx.getStorageSync('JSESSIONID'));
        console.log('下单--openId:' + openId);
        var self = this;
        var msgId = self.msgId
        const serverData = await post("/recruitment/xiadan.do", {
          'openid':openId,
          msgId,
          'buyMonthNum': self.value
        });
        //当return_code 是 SUCCESS 时 表示交易 正常进行中，可以获取prepay_id
        if (serverData.status == 0) {
          if (serverData.data.return_code == 'SUCCESS') {
            console.log("统一下单服务端返回prepay_id:" + serverData.data.prepay_id);
            var prepay_id = serverData.data.prepay_id;
            self.sign(prepay_id);
          } else {
            //当return_code 是 FAIL 时 表示交易 异常，可以显示异常信息 如：签名异常
            console.log("信息校验有误(tencent):" + serverData.data.return_msg);
          }
        } else {
          console.log("信息校验有误(server):" + serverData.msg);
        }

      },
      //4.再签名
      async sign(prepay_id) {
        console.log('再签名prepay_id:' + prepay_id);
        var self = this;
        const serverData = await post("/recruitment/sign.do", {
          'repay_id': prepay_id
        });
        if (serverData.status == 0) {
          self.requestPayment(serverData.data);
        } else {
          console.log('再签名失败')
        }
      },
      //5.申请支付
      requestPayment: function (obj) {
        var self = this
        console.log('5.申请支付接收参数obj');
        //请求腾讯微信服务器
        wx.requestPayment({
          'timeStamp': obj.timeStamp,
          'nonceStr': obj.nonceStr,
          'package': obj.package,
          'signType': obj.signType,
          'paySign': obj.paySign,
          'success': function (res) {
            console.log('恭喜支付成功');
            wx.showToast({
              title: '支付成功',
              icon: 'succes',
              duration: 1400,
              mask: true
            })
            setTimeout(function () {
              self.jumpTo('/pages/index/main')
            }, 1400)
          },
          'fail': function () {
            console.log('支付失败:');
            wx.showToast({
              title: '支付失败,请重试',
              icon: 'loading',
              duration: 700,
              mask: true
            })
          }
        })
      }
    }
  }

</script>

<style lang="scss">
  @import "./style.scss";

</style>
