<template>
  <div class="container">
    <div class="zx_release">
      <van-cell-group>
        <!-- <van-field :value="time+'个月'" required readonly label="发布时限" /> -->
        <van-field :value="title" required clearable label="标题" placeholder="请输入标题" bind:click-icon="onClickIcon" @change="onChange1" />
        <van-field :value="contact" required clearable label="联系人" placeholder="请输入联系人" bind:click-icon="onClickIcon" @change="onChange2" />
        <van-field :value="phone" required clearable label="联系电话" placeholder="请输入联系电话" bind:click-icon="onClickIcon" @change="onChange3" />
        <van-cell :value="areaText" required @click="chooseArea" is-link>
          <view slot="title">
            <span class="van-cell-text">联系地址</span>
          </view>
        </van-cell>
        <van-field :value="address" v-if="!showArea" custom-class="ajust_textarea_1" clearable label=" " type="textarea" placeholder="请输入详细地址" bind:click-icon="onClickIcon" autosize maxlength="2000" :border="true" />
        <div @click="chooseImage('pic1')" class="zx_img_container_pa">
          <van-field label="图片1" readonly use-icon-slot @change="onChange1" :border="true" required is-link/>
          <view class="zx_img_container">
            <img :src="pic1">
          </view>
        </div>
        <div @click="chooseImage('pic2')" class="zx_img_container_pa">
          <van-field label="图片2" readonly use-icon-slot @change="onChange2" :border="true" is-link/>
          <view class="zx_img_container">
            <img :src="pic2">
          </view>
        </div>
      </van-cell-group>
    </div>
    <!-- <wxParse :content="article" /> -->
    <form @submit="evaSubmit">
      <van-cell-group>
        <van-field required label="详细信息" :border="false" />
      </van-cell-group>
      <textarea :value="textarea" v-if="!showArea" class="zx_textarea" placeholder-class="zx_textarea_placeholder" name="evaContent" placeholder="最多2000字" id="" cols="30" rows="10" maxlength="2000" @blur="confirmTextarea" />
      <!--省市区-->
      <div class="zj_container">
        <!-- <van-button size="normal" :disabled="subdisabled" round block type="primary" custom-class="zx_bgColor" @click="submit">提交</van-button> -->
        <button formType="submit" :disabled="subdisabled" class="weui-btn zx_bgColor big_btn" type="primary" size="mini" @click="goTo('/pages/buy/main')">提交</button>
      </div>
    </form>
    <van-popup :show="showArea" position="buttom" @close="onClose" custom-class="ajust_popup">
      <van-area v-if="showArea" :value="areaCode" :area-list="areaList" @confirm="confirmArea" />
    </van-popup>
  </div>
</template>

<script>
import areaList from '@/utils/area.js'
import wxParse from 'mpvue-wxparse'
// Use Vuex
export default {
  components: {
    wxParse
  },
  data: {
    title: '',
    contact: '',
    phone: '',
    showArea: false,
    areaList: areaList,
    areaText: '',
    areaCode: '445200',
    article: '<div style="color:red">我是HTML代码</div>',
    textarea: '',
    pic1: null,
    pic2: null
  },
  onLoad(options){
    this.time = options.time
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
    chooseImage(zd) {
      var self = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          self[zd] = tempFilePaths
        }
      })
    },
    evaSubmit: function (e) {
      console.log(e)
      this.textarea = e.mp.detail.value.evaContent
      this.article = e.mp.detail.value.evaContent
    },
    confirmTextarea(e) {
      console.log(e)
      // this.textareaTemp = e.mp.detail.value
    },
    chooseArea() {
      this.showArea = true
    },
    confirmArea(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      var area = value.values
      if (area) {
        var areaText = ''
        area.forEach((item) => {
          areaText += item.name
        })
        this.areaText = areaText
        this.areaCode = value.values ? value.values[2].code : '445200'
      }
      this.showArea = false
    },
    onClose() {
      this.showArea = false
    },
    onChange1(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.title = value
    },
    onChange2(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.contact = value
    },
    onChange3(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.phone = value
    }
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
