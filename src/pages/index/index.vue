<template>
  <div class="container">
    <div class="zx_header">
      <div class="zx_city">揭阳&nbsp;&nbsp;<span style="color:#ddd;">|</span></div>
      <div class="zx_search">
        <van-search :value="value" placeholder="请输入搜索关键词" use-action-slot bind:search="onSearch">
        <view slot="action" bind:tap="onSearch">搜索</view>
      </van-search>
      </div>
    </div>
    <div class="zx_content">
      <div class="zx_content_item">
        <p>9:00</p>
        <card>
          
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data() {
    return {
      active: 0
    }
  },
  components: {
    card
  },
  methods: {
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `切换至第${event.mp.detail}项`
      });
    }
  },
  created() { }
}
</script>

<style lang="scss">
@import './style.scss'
</style>
