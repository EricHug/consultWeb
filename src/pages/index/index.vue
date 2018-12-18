<template>
  <div class="container">
    <div class="zx_header">
      <div class="zx_city" @click="goTo('/pages/selectZone/main')">揭阳&nbsp;&nbsp;&nbsp;
        <span style="color:#ddd;">|</span>
      </div>
      <div class="zx_search">
        <van-search custom-class="zx_search_box" :value="keyword" placeholder="请输入搜索关键词" use-action-slot @change="onChange0" @search="onSearch">
          <view slot="action" @tap="onSearch">搜索</view>
        </van-search>
      </div>
    </div>
    <div class="zx_zone" v-if="district">
      <span @click="goTo('/pages/selectZone/main')">当前区域：{{text}}</span>
    </div>
    <div class="zx_notice" v-if="isNotice">
      <van-notice-bar custom-class="zx_n_notice" speed="20" left-icon="/static/assets/images/notice.png" :text="notice" />
    </div>
    <div class="zx_member">
      <van-notice-bar custom-class="zx_m_notice" :text="'总普通会员：'+visit" />
      <div class="kf_button" @click="call">
        <van-button size="mini" type="warning" custom-class="bgColor1">客服电话</van-button>
      </div>
    </div>
    <div class="zx_nav">
      <ul>
        <li v-for="(item,index) in navList" :key="item.txt" @click="navTo(index)">
          <img :src="item.pic" alt="">
          <p>{{item.txt}}</p>
        </li>
      </ul>
    </div>
    <div class="zx_content">
      <div class="zx_content_item">
        <div v-for="(item,index) in postList" :key="item.msgId" @click="goDetail(item)">
          <card :title="item.title" :photo="item.photo" :releaseTime="item.releaseTime" :province="item.province" :city="item.city" :district="item.district" :town="item.town" :address="item.address" :image1="item.image1" :categoryId="item.categoryId" :key="item.msgId"></card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import {
  mapState
} from 'vuex'
import {
  get,
  post
} from "../../utils"
import configuration from '@/utils/configuration.json'


export default {
  data() {
    return {
      keyword: '',
      postList: [],
      visit: '',
      notice: '',
      isNotice: null,
      navList: configuration.navList,
      phone:'0663-8899925',
      //
      pageNum: 1,
      totalPageNum: null
    }
  },
  components: {
    card
  },
  computed: {
    ...mapState(['district', 'town', 'text', 'categoryList'])
  },
  onShow() {
    this.getPostList()
    this.getCategory()
    this.getState()
  },
  onPullDownRefresh() {
    this.getPostList()
    this.getCategory()
    this.getState()
  },
  onReachBottom() {
    console.log('触底')
    if (this.pageNum < this.totalPageNum) {
      this.pageNum += 1
      this.getPostList()
    }
  },
  mounted() {
    // 判断是否首次访问
    let self = this
    if (!wx.getStorageSync('isFirstVisit')) {
      self.addVisit()
      wx.setStorageSync('isFirstVisit', 1)
    }
  },
  methods: {
    call() {
      var that = this
      //显示“呼叫”、“添加联系人”弹窗
      wx.showActionSheet({
        itemList: ['呼叫'],
        // itemList: ['呼叫', '添加联系人'],
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
    async getState() {
      let self = this
      const data = await post('/api/state/query')
      if (data.code == 0) {
        self.visit = data.data.visit
        self.notice = data.data.notice
        self.isNotice = data.data.isNotice
      } else {
        Toast.fail(data.data.msg)
      }
    },
    async addVisit() {
      let self = this
      const data = await post('/api/state/updateVisit')
      if (data.code == 0) {
        console.info('add visit')
      } else {
        Toast.fail(data.data.msg)
      }
    },
    async getCategory() {
      let self = this
      const data = await post('/api/category/query')
      if (data.code == 0) {
        // self.categoryList = data.data
        self.$store.commit('initCategary', data.data)
        console.log(this.categoryList)
      } else {
        Toast.fail(data.data.msg)
      }
    },
    async getPostList() {
      let self = this
      const data = await post('/recruitment/message/selectMessageByKeyword.do', {
        keyword: self.keyword,
        district: self.district,
        town: self.town,
        pageSize: self.pageNum * 10
      })
      if (data.status == 0) {
        self.postList = data.data.list
        self.totalPageNum = data.data.pages
      } else {
        Toast.fail(data.msg)
      }
      // 停止下拉动作
      wx.stopPullDownRefresh()
    },
    onSearch() {
      this.getPostList()
    },
    onChange0(event) {
      var value = event.mp.detail
      console.log(value)
      this.keyword = value
    },
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `切换至第${event.mp.detail}项`
      });
    },
    goTo: function (url) {
      console.log(url)
      wx.navigateTo({
        url: url
      })
    },
    navTo: function (index) {
      let self = this
      if (index == 0) {
        self.goTo('/pages/job/main')
      } else if (index == 1) {
        self.goTo('/pages/trunk/main')
      } else {
        self.goTo('/pages/module/main?id=' + index)
      }
    },
    goDetail(obj) {
      let self = this
      wx.setStorageSync('detail', obj)
      self.goTo('/pages/post/main')
    }
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
