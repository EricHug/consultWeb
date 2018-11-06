<template>
  <div class="container">
    <van-tree-select :items="items" :main-active-index="mainActiveIndex" :active-id="activeId" @clickNav="onClickNav" @clickItem="onClickItem" custom-class="setHeight" />
    <div class="sz_buttons">
      <!-- <span>区域选择：</span> -->
      <van-button type="primary" size="normal" custom-class="zx_bgColor" @click="confirmZone">确定</van-button>
      <van-button type="primary" size="normal" plain custom-class="zx_bgColor plain" @click="cancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import jieyang from '@/utils/jieyang'

export default {
  data() {
    return {
      active: 0,
      mainActiveIndex: 0,
      activeId: 0,
      items: [],
      code: null, // 默认
      text: ''
    }
  },
  components: {
    card
  },
  methods: {
    cancel() {
      wx.navigateBack({
        delta: 1
      })
    },
    confirmZone() {
      let code = this.code
      let text = this.text
      this.$store.commit('alterZone', { code, text })
      wx.navigateBack({
        delta: 1
      })
      // wx.switchTab({
      //   url: '/pages/index/main'
      // })
    },
    handleData({
      district,
      town
    }) {
      let items = []
      for (let i in district) {
        if (district.hasOwnProperty(i)) {
          let single = town[i]
          let children = []
          for (let j in single) {
            if (single.hasOwnProperty(j)) {
              children.push({
                text: single[j],
                id: parseInt(j)
              })
            }
          }
          items.push({
            text: district[i],
            children
          })
        }
      }
      return items
    },
    onClickItem(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.activeId = value.id
      //
      this.code = this.activeId
      this.text = value.text
    },
    onClickNav(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.mainActiveIndex = value.index || 0
      //
      var keys = Object.keys(jieyang.district)
      this.code = keys[this.mainActiveIndex]
      this.text = jieyang.district[this.code]
      this.activeId = null
    }
  },
  created() {
    this.items = this.handleData(jieyang)
    console.log(this.items)
  },
  mounted() {
    this.code = this.$store.state.code
    this.text = this.$store.state.text
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
