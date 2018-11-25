<template>
  <div class="container">
    <div class="zx_header">
      <div class="zx_city" @click="goTo('/pages/selectZone/main')">揭阳&nbsp;&nbsp;&nbsp;
        <span style="color:#ddd;">|</span>
      </div>
      <div class="zx_search">
        <van-search custom-class="zx_search_box" :value="keyword" placeholder="请输入搜索关键词" use-action-slot bind:search="onSearch">
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
        <div @click="goTo('/pages/post/main')">
        <template v-for="item in postList">
          <card :title="item.title" :activeTime="item.activeTime" :province="item.province" :city="item.city" :district="item.district" :town="item.town" :address="item.address" :image1="item.image1" :categoryId="item.categoryId"></card>
        </template>
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
        district: '',
        town: '',
        postList: [],
        navList: configuration.navList
      }
    },
    components: {
      card
    },
    computed: {
      ...mapState(['code', 'text','categoryList'])
    },
    onShow() {
      this.getPostList()
      this.getCategory()
    },
    mounted() {
      console.log('code', this.code)
      console.log('text', this.text)
    },
    methods: {
      async getCategory() {
      let self = this
      const data = await post('/api/category/query')
      if(data.code == 0){
        // self.categoryList = data.data
        self.$store.commit('initCategary', data.data)
        console.log(this.categoryList)
      }else{
        Toast.fail(data.data.msg)
      }
    },
      async getPostList() {
        let self = this
        const data = await post('/recruitment/message/selectMessageByKeyword.do', {
          keyword: self.keyword,
          district: self.district,
          town: self.town
        })
        if (data.status == 0) {
          self.postList = data.data.list
        } else {
          Toast.fail(data.msg)
        }
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
