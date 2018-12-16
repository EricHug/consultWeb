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
    <div class="zx_zone" v-if="district && district != '445200'">
      <span @click="goTo('/pages/selectZone/main')">当前区域：{{text}}</span>
    </div>
    <div class="zx_content">
      <!-- <div class="zx_content_item">
        <p>9:00</p>
        <div @click="goTo('/pages/post/main')">
          <card></card>
        </div>
      </div> -->
      <!--招聘信息-->
      <van-tabs :active="active" @change="onChange" v-if="index == 0">
        <van-tab title="个人招聘">
          <div class="zx_content_item" v-if="postList1.length>0">
            <div v-for="(item,index) in postList1" :key="item.msgId" @click="goDetail(item)">
              <card :title="item.title" :releaseTime="item.releaseTime" :province="item.province" :city="item.city" :district="item.district" :town="item.town" :address="item.address" :image1="item.image1" :categoryId="item.categoryId" :key="item.msgId"></card>
            </div>
          </div>
          <div class="tip" v-else>
            <img src="../../../static/assets/images/empty.png" alt="" />
            <p>暂无数据</p>
          </div>
        </van-tab>
        <van-tab title="企业招聘">
          <div class="zx_content_item" v-if="postList2.length>0">
            <div v-for="(item,index) in postList2" :key="item.msgId" @click="goDetail(item)">
              <card :title="item.title" :releaseTime="item.releaseTime" :province="item.province" :city="item.city" :district="item.district" :town="item.town" :address="item.address" :image1="item.image1" :categoryId="item.categoryId" :key="item.msgId"></card>
            </div>
          </div>
          <div class="tip" v-else>
            <img src="../../../static/assets/images/empty.png" alt="" />
            <p>暂无数据</p>
          </div>
        </van-tab>
      </van-tabs>
      <!--顺车顺货-->
      <van-tabs :active="active" @change="onChange" v-if="index == 1">
        <van-tab title="车找货">
          <div class="zx_content_item" v-if="postList3.length>0">
            <div v-for="(item,index) in postList3" :key="item.msgId" @click="goDetail(item)">
              <card :title="item.title" :releaseTime="item.releaseTime" :province="item.province" :city="item.city" :district="item.district" :town="item.town" :address="item.address" :image1="item.image1" :categoryId="item.categoryId" :key="item.msgId"></card>
            </div>
          </div>
          <div class="tip" v-else>
            <img src="../../../static/assets/images/empty.png" alt="" />
            <p>暂无数据</p>
          </div>
        </van-tab>
        <van-tab title="货找车">
          <div class="zx_content_item" v-if="postList4.length>0">
            <div v-for="(item,index) in postList4" :key="item.msgId" @click="goDetail(item)">
              <card :title="item.title" :releaseTime="item.releaseTime" :province="item.province" :city="item.city" :district="item.district" :town="item.town" :address="item.address" :image1="item.image1" :categoryId="item.categoryId" :key="item.msgId"></card>
            </div>
          </div>
          <div class="tip" v-else>
            <img src="../../../static/assets/images/empty.png" alt="" />
            <p>暂无数据</p>
          </div>
        </van-tab>
      </van-tabs>
      <template v-if="index != 0 && index !=1">
        <div class="zx_content_item" v-if="postList0.length>0">
          <div v-for="(item,index) in postList0" :key="item.msgId" @click="goDetail(item)">
            <card :title="item.title" :releaseTime="item.releaseTime" :province="item.province" :city="item.city" :district="item.district" :town="item.town" :address="item.address" :image1="item.image1" :categoryId="item.categoryId" :key="item.msgId"></card>
          </div>
        </div>
        <div class="tip" v-else>
          <img src="../../../static/assets/images/empty.png" alt="" />
          <p>暂无数据</p>
        </div>
      </template>
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
      txt: '',
      keyword: '',
      navList: configuration.navList,
      index: null,
      active: 0, // tab index
      postList0: [],
      postList1: [],
      postList2: [],
      postList3: [],
      postList4: [],
       // 
      pageNum: 1,
      totalPageNum: null // 总页数
    }
  },
  components: {
    card
  },
  computed: {
    ...mapState(['district', 'town', 'text', 'categoryList']),
    categoryId() {
      let self = this
      let id = null
      let index = self.index
      if (self.index == 0) {
        if (self.active == 0) {
          id = 1
        } else {
          id = 2
        }
      } else if (self.index == 1) {
        if (self.active == 0) {
          id = 3
        } else {
          id = 4
        }
      } else {
        id = parseInt(index) + 3
      }
      return id
    }
  },
  onShow() {
    this.correspondPost()
  },
  onPullDownRefresh() {
    this.correspondPost()
  },
  onReachBottom() {
    console.log('触底')
    if (this.pageNum < this.totalPageNum) {
      this.pageNum += 1
      this.correspondPost()
    }
  },
  mounted() {
    console.log(this.navList.length)
    let id = this.$root.$mp.query.id
    let keyword = this.$root.$mp.query.keyword
    console.log('keyword', keyword)
    let active = this.$root.$mp.query.active
    let txt = this.navList[id]['txt']
    wx.setNavigationBarTitle({
      title: txt
    })
    // this.index = id
    this.keyword = keyword ? keyword : ''
    this.active = active ? active : 0
    this.correspondPost()
  },
  onLoad(options) {
    // 用v-if判断的参数得写在onLoad
    this.index = options.id
  },
  onUnload() {
    // 生命周期函数--监听页面卸载
    console.log("module onUnload");
  },
  methods: {
    onSearch() {
      this.correspondPost()
    },
    async getPostList(target) {
      let self = this
      const data = await post('/recruitment/message/selectMessageByKeyword.do', {
        categoryId: self.categoryId,
        keyword: self.keyword,
        district: self.district,
        town: self.town,
        pageSize: self.pageNum * 10
      })
      console.log('target', 'postList' + target)
      if (data.status == 0) {
        self['postList' + target] = data.data.list
        self.totalPageNum = data.data.pages
      } else {
        Toast.fail(data.msg)
      }
      // 停止下拉动作
      wx.stopPullDownRefresh()
    },
    onChange0(event) {
      var value = event.mp.detail
      console.log(value)
      this.keyword = value
    },
    onChange(event) {
      // wx.showToast({
      //   title: `切换到标签 ${event.mp.detail.index + 1}`,
      //   icon: 'none'
      // });
      let self = this
      self.active = event.mp.detail.index
      self.correspondPost()
    },
    correspondPost() {
      let self = this
      let index = self.index
      let active = self.active
      if (index == 0) {
        if (active == 0) {
          // 个人
          self.getPostList(1)
        } else {
          // 企业
          self.getPostList(2)
        }
      } else if (index == 1) {
        if (active == 0) {
          // 车找货
          self.getPostList(3)
        } else {
          // 货找车
          self.getPostList(4)
        }
      } else {
        self.getPostList(0)
      }
    },
    goTo: function (url) {
      console.log(url)
      wx.navigateTo({
        url: url
      })
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
