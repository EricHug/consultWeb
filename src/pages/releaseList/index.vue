<template>
  <div class="container">
    <div class="panel_item">
      <div class="panel_header">
        <div class="panel_left">
          <h2 class="panel_title">{{release?release.title:''}}</h2>
          <p class="panel_desc">{{leftDays}}</p>
        </div>
        <div class="panel_right">
          <p class="panel_state">{{stateName}}</p>
          <van-button size="small" custom-class="zx_bgColor" @click="edit" v-if="isEdit">编辑</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  get,
  post
} from "../../utils"
import card from '@/components/card'
import jieyang from '@/utils/jieyang'

export default {
  data() {
    return {
      release: null,
      stateName: null,
      leftDays: null,
      isEdit:null
    }
  },
  components: {
    card
  },
  methods: {
    async getState() {
      let self = this
      const data = await post('/api/state/query')
      if (data.code == 0) {
        self.isEdit = data.data.isEdit
      } else {
        Toast.fail(data.data.msg)
      }
    },
    async getUserRelease() {
      let self = this
      const data = await get('/recruitment/message/selectMessageByUserId.do')
      if (data.status == 0) {
        self.release = data.data
        let state = data.data['state']
        if (state == 0) {
          self.stateName = '未发布'
        } else if (state == 1) {
          self.stateName = '待审核'
        } else if (state == 2) {
          self.stateName = '已发布'
        } else {
          self.stateName = ''
        }
        let activeTime = self.release['activeTime']
        if (activeTime) {
          self.leftDays = '剩余' + self.relativeDays(activeTime, (new Date()).getTime()) + '天'
        }
      } else {
        Toast.fail(data.msg)
      }
    },
    relativeDays(t1, t2) {
      var nTime = Math.abs(t2 - t1)
      var day = Math.floor(nTime / 86400000)
      return day
    },
    cancel() {
      wx.navigateBack({
        delta: 1
      })
    },
    edit(){
      this.goTo('/pages/release/main')
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
  },
  onShow() {
    this.getUserRelease()
    this.getState()
  },
  mounted() {
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
