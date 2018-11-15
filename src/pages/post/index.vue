<template>
  <div class="container bkgrey">
    <div class="zx_post">
      <h1 class="zx_post_title">销售代表/导购/店员</h1>
      <p class="zx_post_sub">2018/10/20</p>
      <div class="zx_post_detail">
        <div>一汽-大众首款高端中型SUV——TAYRON探岳已于10月22日正式上市，新车共提供了三种动力选择，售价区间为18.88-31.98万，车型选择丰富到多达10款，现在就让我们一起来看看这款热门SUV中的哪款更值得推荐吧。 　在SUV领域略显迟钝的一汽-大众，在今年突然连续发力，继7月底推出T-ROC探歌后，又于10月22日正式上市了首款高端中型SUV——TAYRON探岳，新车共提供了三种动力选择，售价区间为18.88-31.98万。起售价相对兄弟车型——上汽大众途观L低了不少，车型选择也丰富到多达10款，现在就让我们一起来看看这款热门SUV中的哪款更值得推荐吧。
        </div>
        <div>
          <img src="http://n.sinaimg.cn/auto/transform/534/w320h214/20181025/D4UA-hmxrkzw4775521.jpg" alt="">
          <img src="http://image.bitautoimg.com/bitauto/2018/06/29/cb68f9d9-8a65-45fb-954f-07bebffe3588.jpg" alt="">
        </div>
      </div>
      <div class="zx_post_contact">
        <ul>
          <li>
            <label>联系人：</label>
            <span>李先生</span>
          </li>
          <li>
            <label>联系电话：</label>
            <span @click="call" class="calllink">{{phone}}</span>
          </li>
          <li>
            <label>联系地址：</label>
            <span>广东省揭阳市普宁洪阳镇街道德安里22号XXX</span>
          </li>
        </ul>
        <p class="contact_tip"></p>
      </div>
    </div>
    <div class="zx_tip">
      <div class="jubao">
        <div class="jubao-font">
          <p class="one-line">如遇无效、虚假、诈骗信息，请立即举报</p>
          <p class="two-line">求职过程请勿缴纳费用，谨防诈骗！若信息不实请举报。</p>
        </div>
        <div class="jubao-logo">
          <a tongji_tag="m_detail_job_full_jubao_m" @click="toReport">
            <i class="ico"></i>
            <p>举报</p>
          </a>
        </div>
      </div>
    </div>
    <van-notice-bar mode="closeable" speed="20" text="为防欺诈，先打电话核实双方的资料，以免发生误会" />
    <van-notice-bar mode="closeable" speed="20" text="打电话时请说在百事通商务信息咨询网看到的" />
    <!--弹窗-->
    <van-dialog use-slot :show="show" show-cancel-button @close="onClose" @confirm="onConfirm" title="举报">
      <van-field :value="reportTitle" label="举报对象" disabled/>
      <van-field :value="reportReason" label="投诉理由" :border="false" placeholder="请输入投诉理由" @change="onChange1" />
    </van-dialog>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Toast from '@/../static/vant/toast/toast'

export default {
  data() {
    return {
      reportTitle: '汽车导购',
      reportReason: '',
      show: false,
      phone: '18475127778'
    }
  },
  components: {
  },
  methods: {
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `切换至第${event.mp.detail}项`
      });
    },
    onClose() {
      this.show = false
    },
    onConfirm() {
      if (this.reportReason == '') {
        Toast.fail('请输入投诉理由')
        return
      }
      this.show = false
      Toast.success('举报成功')
    },
    onChange1(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.reportReason = value
    },
    toReport() {
      this.show = true
      this.reportReason = ''
    },
    call() {
      var that = this
      //显示“呼叫”、“添加联系人”弹窗
      wx.showActionSheet({
        itemList: ['呼叫', '添加联系人'],
        success: function (res) {
          console.log("点击电话：", res)
          if (res.tapIndex == 0) {//直接呼叫
            wx.makePhoneCall({
              phoneNumber: that.phone,
              success: function (res_makephone) {
                console.log("呼叫电话返回：", res_makephone)
              }
            })
          } else if (res.tapIndex == 1) {//添加联系人
            wx.addPhoneContact({
              firstName: '',
              mobilePhoneNumber: that.phone,
              success: function (res_addphone) {
                console.log("电话添加联系人返回：", res_addphone)
              }
            })
          }
        }
      })
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
