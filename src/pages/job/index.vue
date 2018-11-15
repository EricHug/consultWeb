<template>
  <div class="container">
    <div class="zx_header">
      <!-- <van-search style="width:100%" :value="value" placeholder="请输入搜索关键词" use-action-slot @search="onSearch">
        <view slot="action" @tap="onSearch">搜索</view>
      </van-search> -->
    </div>
    <div class="zx_content">
      <div class="job_content" v-for="(item,index) in job" :key="item">
        <h1>
          <span>{{index}}</span>
        </h1>
        <div class="jc_item clearfix" @click="jobTouch($event)">
          <span :data-keyword="citem"  v-for="(citem,cindex) in item" :key="citem">{{citem}}</span>
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
import job from '@/utils/job'

export default {
  data() {
    return {
      txt: '',
      value: '',
      job
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
    // console.log(this.navList.length)
    // let txt = this.navList[options.id]['txt']
    // wx.setNavigationBarTitle({
    //   title: ''
    // })
    this.value = options.keyword
  },
  methods: {
    onChange(event) {
      console.log(event)
      this.value = event.mp.detail
      // wx.showToast({
      //   icon: 'none',
      //   title: `切换至第${event.mp.detail}项`
      // });
    },
    goTo: function (url) {
      console.log(url)
      wx.navigateTo({
        url: url
      })
    },
    jobTouch(event){
      console.log(event.mp.target)
      if(event.mp){
        let keyword = event.mp.target.dataset.keyword
        this.goTo('/pages/module/main?id=0&keyword='+keyword)
      }
    },
    onSearch(event){
      console.log(event)
      if(event.mp){
        let keyword = event.mp.detail
        this.goTo('/pages/module/main?id=0&keyword='+keyword)
      }
    }
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
