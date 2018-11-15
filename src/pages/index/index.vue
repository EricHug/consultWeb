<template>
  <div class="container">
    <div class="zx_header">
      <div class="zx_city" @click="goTo('/pages/selectZone/main')">揭阳&nbsp;&nbsp;&nbsp;
        <span style="color:#ddd;">|</span>
      </div>
      <div class="zx_search">
        <van-search custom-class="zx_search_box" :value="value" placeholder="请输入搜索关键词" use-action-slot bind:search="onSearch">
          <view slot="action" @click="test">搜索</view>
        </van-search>
      </div>
    </div>
    <div class="zx_zone" v-if="code && code != '445200'">
      <span @click="goTo('/pages/selectZone/main')">当前区域：{{text}}</span>
    </div>
    <div class="zx_member">
      <van-notice-bar custom-class="zx_notice" text="总普通会员：999999" />
    </div>
    <div class="zx_nav">
      <ul>
        <li v-for="(item,index) in navList" :key="item.txt" @click="goTo(index?'/pages/module/main?id='+index:'/pages/job/main')">
          <img :src="item.pic" alt="">
          <p>{{item.txt}}</p>
        </li>
      </ul>
    </div>
    <div class="zx_content">
      <div class="zx_content_item">
        <p>9:00</p>
        <div @click="goTo('/pages/post/main')">
          <card></card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import { mapState } from 'vuex'
import {
  get,
  post
} from "../../utils"

export default {
  data() {
    return {
      navList: [
        {
          txt: '招聘求职',
          pic: '/static/assets/images/nav_0.png',
          url: ''
        },
        {
          txt: '拼车信息',
          pic: '/static/assets/images/nav_1.png',
          url: ''
        },
        {
          txt: '二手交易',
          pic: '/static/assets/images/nav_2.png',
          url: ''
        },
        {
          txt: '车辆买卖',
          pic: '/static/assets/images/nav_3.png',
          url: ''
        },
        {
          txt: '生活服务',
          pic: '/static/assets/images/nav_4.png',
          url: ''
        },
        {
          txt: '房屋租售',
          pic: '/static/assets/images/nav_5.png',
          url: ''
        },
        {
          txt: '宠物服务',
          pic: '/static/assets/images/nav_6.png',
          url: ''
        },
        {
          txt: '绿色信息',
          pic: '/static/assets/images/nav_7.png',
          url: ''
        }
      ]
    }
  },
  components: {
    card
  },
  computed: {
    ...mapState(['code', 'text'])
  },
  mounted() {
    console.log('code', this.code)
    console.log('text', this.text)
  },
  methods: {
    async test() {
      const data = await post('/recruitment/user/updateUserInfo.do', {
      })
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
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
