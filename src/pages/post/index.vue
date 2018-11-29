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

      }
    },
    components: {},
    computed: {
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
      }
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
        let wholeaddress = (self.zongcheng?self.zongcheng:'') + self.detail.address
        wx.showLoading({
          mask: true
        })
        const data = await self.getAddressGps(wholeaddress)
        console.log(wholeaddress,data)
        // 获取当前地址的
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success(res) {
            let latitude = res.latitude
            let longitude = res.longitude
            self.latitude = latitude
            self.longitude = longitude
            if (data) {
              let first = data['data'][0]
              latitude = first['location']['lat']
              longitude = first['location']['lng']
            }
            wx.hideLoading()
            wx.openLocation({
              latitude,
              longitude,
              name:wholeaddress,
              scale: 18
            })
          }
        })
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
        self.time = formatTime(self.detail.createTime).slice(0, 10)
      }
    }
  }

</script>

<style lang="scss">
  @import "./style.scss";

</style>
