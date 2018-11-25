<template>
  <div class="container">
    <div class="zx_header">
      <div class="zx_city" @click="goTo('/pages/selectZone/main')">揭阳&nbsp;&nbsp;&nbsp;
        <span style="color:#ddd;">|</span>
      </div>
      <div class="zx_search">
        <van-search custom-class="zx_search_box" :value="value" placeholder="请输入搜索关键词" use-action-slot bind:search="onSearch">
          <view slot="action" bind:tap="onSearch">搜索</view>
        </van-search>
      </div>
    </div>
    <div class="zx_zone" v-if="code && code != '445200'">
      <span @click="goTo('/pages/selectZone/main')">当前区域：{{text}}</span>
    </div>
    <div class="zx_content">
      <!-- <div class="zx_content_item">
        <p>9:00</p>
        <div @click="goTo('/pages/post/main')">
          <card></card>
        </div>
      </div> -->
      <div class="tip">
        <img src="../../../static/assets/images/empty.png" alt="" />
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import { mapState } from 'vuex'
import configuration from '@/utils/configuration.json'


export default {
  data() {
    return {
      txt: '',
      value: '',
      navList: configuration.navList
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
  onLoad(options) {
    console.log(this.navList.length)
    let txt = this.navList[options.id]['txt']
    wx.setNavigationBarTitle({
      title: txt
    })
    this.value = options.keyword
  },
  methods: {
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
