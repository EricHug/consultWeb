<template>
  <div class="container bkgrey" style="padding-bottom:50px">
    <template v-if="detail">
      <div class="zx_post">
        <h1 class="zx_post_title">{{detail.title}}</h1>
        <p class="zx_post_sub">{{time}}</p>
        <div class="zx_post_detail">
          <div>{{detail.information}}
          </div>
          <div class="image_box">
            <image v-if="detail.image1" class="image" :src="detail.image1" alt="" mode="widthFix" @click="previewImage(detail.image1)"></image>
            <image v-if="detail.image2" class="image" :src="detail.image2" alt="" mode="widthFix" @click="previewImage(detail.image2)"></image>
          </div>
        </div>
        <div class="zx_post_contact">
          <ul>
            <li>
              <label>联系人：</label>
              <span>{{detail.linkman}}</span>
            </li>
            <li>
              <label>联系电话：</label>
              <span @click="call" class="calllink">{{detail.linkphone}}</span>
            </li>
            <li>
              <label>联系地址：</label>
              <span>{{zongcheng}}{{detail.address}}</span>
            </li>
          </ul>
          <p class="contact_tip"></p>
        </div>
      </div>
      <div class="zx_tip">
        <div class="jubao">
          <div class="jubao-font">
            <p class="one-line">如遇无效、虚假、诈骗信息，请立即举报</p>
            <p class="two-line">换位思考，做个文明人。</p>
          </div>
          <div class="jubao-logo">
            <a tongji_tag="m_detail_job_full_jubao_m" @click="toReport">
              <i class="ico"></i>
              <p>举报</p>
            </a>
          </div>
        </div>
      </div>
      <div class="zx_warn" v-if="warn">
        <label class="zx_warn_tit">有事通提醒您:</label>
        <wxParse :content="warn" />
      </div>
      <van-notice-bar mode="closeable" speed="20" text="为防欺诈，先打电话核实双方的资料，以免发生误会" />
      <van-notice-bar mode="closeable" speed="20" text="打电话时请说在有事通商务信息咨询网看到的" />
      <!--弹窗-->
      <van-dialog use-slot :show="show" show-cancel-button @close="onClose" @confirm="onConfirm" title="举报">
        <van-field :value="detail?detail.title:''" label="举报对象" disabled />
        <van-field :value="reportReason" label="投诉理由" :border="false" placeholder="请输入投诉理由" @change="onChange1" />
      </van-dialog>
      <van-toast id="van-toast" />
      <van-tabbar :active="active">
        <van-tabbar-item @click="jumpTo('/pages/index/main')">
          <span style="color:#666">首页</span>
          <image slot="icon" :src="icon0.normal" class="icon" mode="aspectFit" />
          <image slot="icon-active" :src="icon0.active" class="icon" mode="aspectFit" />
        </van-tabbar-item>
        <van-tabbar-item @click="nav">
          <span style="color:#666">导航</span>
          <image slot="icon" :src="icon1.normal" class="icon" mode="aspectFit" />
          <image slot="icon-active" :src="icon1.active" class="icon" mode="aspectFit" />
        </van-tabbar-item>
        <van-tabbar-item @click="call">
          <span style="color:#666">一键拨号</span>
          <image slot="icon" :src="icon2.normal" class="icon" mode="aspectFit" />
          <image slot="icon-active" :src="icon2.active" class="icon" mode="aspectFit" />
        </van-tabbar-item>
      </van-tabbar>
    </template>
    <template v-else>
      <div class="loading-box">
        <van-loading custom-class="loading" />
      </div>
    </template>
  </div>
</template>

<script>
import {
  get,
  post,
  formatTime,
  transCodeToName
} from '@/utils/index'
import {
  mapState
} from 'vuex'
import wxParse from 'mpvue-wxparse'
import Toast from '@/../static/vant/toast/toast'
import homePic from '@/../static/assets/images/home1.png'
import navigatorPic from '@/../static/assets/images/navigate.png'
import callPic from '@/../static/assets/images/call.png'
import configuration from '@/utils/configuration.json'


export default {
  data() {
    return {
      reportTitle: '汽车导购',
      reportReason: '',
      show: false,
      phone: '18475127778',
      icon0: {
        normal: homePic,
        active: homePic
      },
      icon1: {
        normal: navigatorPic,
        active: navigatorPic
      },
      icon2: {
        normal: callPic,
        active: callPic
      },
      active: 0,
      detail: null,
      time: null,
      // 警告事项
      warn: null
    }
  },
  components: {
    wxParse
  },
  computed: {
    ...mapState(['code', 'text', 'categoryList']),
    zongcheng() {
      let self = this
      if (self.detail) {
        let {
          province,
          city,
          district,
          town
        } = self.detail
        return transCodeToName(province, city, district, town, '')
      } else {
        return null
      }
    },
    imgList() {
      let self = this
      let arr = []
      if (self.detail) {
        if (self.detail.image1) {
          arr.push(self.detail.image1)
        }
        if (self.detail.image2) {
          arr.push(self.detail.image2)
        }
      }
      return arr
    },
    categoryName() {
      let self = this
      let detail = self.detail
      let categoryList = self.categoryList
      if (detail && categoryList) {
        let categoryName = categoryList.find(item => item.categoryId == detail.categoryId)['categoryName']
        self.showWarn(categoryName)
        return categoryName
      } else {
        return ''
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    showWarn(categoryName) {
      let self = this
      console.log(categoryName)
      self.warn = ''
      if (categoryName.indexOf('房') > -1) {
        self.warn = `<span class="txt">1）有事通网不承担任何交易损失，请谨慎判断相关信息的真实性&nbsp;
<br>2）警惕不方便看房，先交定金
<br>3）在实地看房签约前不要支付任何费用</span>`
      }
      if (categoryName.indexOf('车辆买卖') > -1) {
        self.warn = `<span class="txt">1）有事通网不承担任何交易损失，请谨慎判断相关信息的真实性&nbsp;
<br>2）为了您的资金安全，请选择见面交易，切勿提前汇款或者交保证金。
<br>3）到店看车不需交任何费用！交易时注意核验行驶本、身份证以及车辆是否有抵押或贷款未还清等问题。
<br>4）买卖套牌车、走私车、盗抢车是违法行为！</span>`
      }
      if (categoryName.indexOf('二手') > -1) {
        self.warn = `<span class="txt">1）有事通网不承担任何交易损失，请谨慎判断相关信息的真实性&nbsp;
<br>2）为了您的资金安全，请选择见面交易，不要提前汇款；
<br>3）明显低于市场均价、或要求提前汇款的都有欺诈嫌疑，切勿轻信；
<br>4）不要轻信并点击任何可疑电脑链接，以防被骗。</span>`
      }
      if (categoryName.indexOf('生活服务') > -1) {
        self.warn = `<span class="txt">1）有事通网不承担任何交易损失，请谨慎判断相关信息的真实性&nbsp;
<br>2）接受服务前请仔细核验对方经营资质，勿信夸张宣传和承诺&nbsp;
<br>3）任何要求预付定金或付款至个人账号的行为，均可能存在诈骗风险，请提高警惕。</span>`
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
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `切换至第${event.mp.detail}项`
      });
    },
    onClose() {
      this.show = false
    },
    async onConfirm() {
      let self = this
      if (this.reportReason == '') {
        Toast.fail('请输入投诉理由')
        return
      }
      const data = await post('/recruitment/message/report.do', {
        msgId: self.detail.msgId,
        reportReason: self.reportReason
      })
      if (data.status == 0) {
        this.show = false
        Toast.success('举报成功')
      } else {
        Toast.fail(data.msg)
      }
    },
    onChange1(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.reportReason = value
    },
    // 预览图片
    previewImage(current) {
      let self = this
      wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: self.imgList // 需要预览的图片http链接列表  
      })
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
          if (res.tapIndex == 0) { //直接呼叫
            wx.makePhoneCall({
              phoneNumber: that.phone,
              success: function (res_makephone) {
                console.log("呼叫电话返回：", res_makephone)
              }
            })
          } else if (res.tapIndex == 1) { //添加联系人
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
    },
    // 导航
    async nav() {
      let self = this
      let wholeaddress = (self.zongcheng ? self.zongcheng : '') + self.detail.address
      wx.showLoading({
        mask: true
      })
      const data = await self.getAddressGps(wholeaddress)
      console.log(wholeaddress, data)
      if (data.status == 0) {
        let first = data['data'][0]
        let latitude = first['location']['lat']
        let longitude = first['location']['lng']
        self.latitude = latitude
        self.longitude = longitude
        wx.hideLoading()
        console.log('打开地图的经纬度', latitude, longitude)
        wx.openLocation({
          latitude,
          longitude,
          name: wholeaddress,
          scale: 18
        })
      } else {
        Toast.fail('获取GPS失败，地址可能有误')
      }
    },
    // 获取指定地址的gps
    getAddressGps(address) {
      let self = this
      // 调用接口
      return new Promise((resolve, reject) => {
        wx.request({
          url: 'https://apis.map.qq.com/ws/place/v1/search',
          data: {
            keyword: address,
            boundary: 'region(揭阳, 0)',
            key: configuration['key']
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            resolve(res.data)
          },
          fail: function (error) {
            reject(false)
          },
        })
      })
    },
  },
  onShow() {
    let self = this
    self.detail = wx.getStorageSync('detail')
    if (self.detail) {
      self.time = formatTime(self.detail.createTime)
      self.phone = self.detail.linkphone
    }
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
