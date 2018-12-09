<template>
  <div class="container">
    <div class="zx_release">
      <form @submit="evaSubmit">
        <van-cell-group>
          <!-- <van-field :value="time+'个月'" required readonly label="发布时限" /> -->
          <van-field required :value="title" clearable label="标题" placeholder="请输入标题" bind:click-icon="onClickIcon"
            @change="onChange1" />
          <van-field required :value="linkman" clearable label="联系人" placeholder="请输入联系人" bind:click-icon="onClickIcon"
            @change="onChange2" />
          <van-field required :value="linkphone" clearable label="联系电话" placeholder="请输入联系电话" bind:click-icon="onClickIcon"
            @change="onChange3" />
          <van-cell :value="areaText" required @click="chooseArea" is-link>
            <view slot="title">
              <span class="van-cell-text">联系地址</span>
            </view>
          </van-cell>
          <!--选择镇-->
          <van-cell v-if="areaText" custom-class="selectCounty" :value="areaText1" @click="chooseArea1" is-link>
            <view slot="title">
              <span class="van-cell-text"></span>
            </view>
            <picker @change="confirmArea1" range-key="name" :value="index" :range="pickerAreaList1">
              <view class="picker">
                当前选择：{{pickerAreaList1[index]['name']}}
              </view>
            </picker>
          </van-cell>
          <van-field :value="address" v-if="!showArea" custom-class="ajust_textarea_1" clearable label=" " type="textarea"
            placeholder="请输入详细地址" bind:click-icon="onClickIcon" autosize maxlength="2000" :border="true" name="address"
            @change="onChange4" />
          <div @click="chooseImage('messageImage1')" class="zx_img_container_pa">
            <van-field label="图片1" readonly use-icon-slot :border="true" required is-link />
            <view class="zx_img_container">
              <img :src="messageImage1">
            </view>
          </div>
          <div @click="chooseImage('messageImage2')" class="zx_img_container_pa">
            <van-field label="图片2" readonly use-icon-slot :border="true" is-link />
            <view class="zx_img_container">
              <img :src="messageImage2">
            </view>
          </div>
        </van-cell-group>
        <van-cell-group>
          <van-field required label="详细信息" :border="false" disabled />
        </van-cell-group>
        <textarea :value="information" v-if="!showArea" class="zx_textarea" placeholder-class="zx_textarea_placeholder"
          name="information" placeholder="最多2000字" id="" cols="30" rows="10" maxlength="2000" @blur="confirmTextarea" />
        <!--选择类别-->
        <van-cell-group v-if="!release||release.state==0||!isPay">
          <van-cell title="发布类别" required custom-class="selectCategory" @click="chooseCategory" is-link>
            <view slot="title">
              <span class="van-cell-text"></span>
            </view>
            <picker @change="confirmCategory" range-key="categoryName" :value="indexCategory" :range="categoryList">
              <view class="picker">
                {{categoryList[indexCategory]['categoryName']}}
              </view>
            </picker>
          </van-cell>
          <van-cell title="费用" v-if="categoryAmount!=null" custom-class="" :value="categoryAmount">
          </van-cell>
        </van-cell-group>
        <van-cell-group v-else>
          <van-cell title="发布类别" required custom-class="" :value="categoryList[indexCategory]['categoryName']" value-class="disabled">
          </van-cell>
        </van-cell-group>
        <!--省市区-->
        <div class="zj_container mt20">
          <!-- <van-button size="normal" :disabled="subdisabled" round block type="primary" custom-class="zx_bgColor" @click="submit">提交</van-button> -->
          <button formType="submit" :disabled="subdisabled" class="weui-btn zx_bgColor big_btn" type="primary" size="mini">提交</button>
        </div>
      </form>
      <van-popup :show="showArea" position="buttom" @close="onClose" custom-class="ajust_popup">
        <van-area v-if="showArea" :value="areaCode" :area-list="areaList" @confirm="confirmArea" />
      </van-popup>
    </div>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import areaList from '@/utils/area.js'
import wxParse from 'mpvue-wxparse'
import jieyang from '@/utils/jieyang.js'
import Toast from '@/../static/vant/toast/toast'
import Dialog from '@/../static/vant/dialog/dialog'
import {
  get,
  post,
  formatTime, transCodeToName
} from "../../utils"
import { setTimeout } from 'timers';
// Use Vuex
export default {
  components: {
    wxParse
  },
  data: {
    title: '',
    linkman: '',
    linkphone: '',
    showArea: false,
    areaList: areaList,
    areaText: '',
    areaCode: '445200', // 区
    article: '<div style="color:red">我是HTML代码</div>',
    messageImage1: null,
    messageImage2: null,
    address: '',
    information: '',
    // 省
    province: '440000',//（广东）
    // 市
    city: '445200',//（揭阳）
    // 镇
    showArea1: false,
    areaList1: null,
    areaText1: '',
    areaCode1: '445281003',
    index: 0,
    // 类别
    indexCategory: 0,
    // categoryId: null,
    // categoryAmount: null,
    categoryList: [],
    // 是否免费
    isPay: null,
    // 用户发布的信息
    release: {},
    state: null,
    stateName: null
  },
  watch: {
    areaCode(val) {
      this.areaList1 = jieyang.town[val]
    }
  },
  computed: {
    pickerAreaList1() {
      let areaList1 = this.areaList1
      let result = []
      for (let i in areaList1) {
        if (areaList1.hasOwnProperty(i)) {
          result.push({
            id: i,
            name: areaList1[i]
          })
        }
      }
      return result
    },
    categoryId(){
      let self = this
      let indexCategory = self.indexCategory
      console.log('indexCategory',indexCategory)
      return self.categoryList.length?self.categoryList[indexCategory]['categoryId']:null
    },
    categoryAmount(){
      let self = this
      if(self.isPay == 1){
        let indexCategory = self.indexCategory
        return self.categoryList.length?self.categoryList[indexCategory]['categoryFee'] + '元':null
      }else if (self.isPay == 0){
        return '免费'
      }else{
        return self.isPay
      }
    }
  },
  onLoad(options) {
    this.time = options.time
    this.getCategory()
  },
  mounted() {
    let self = this
    self.getUserRelease()
  },
  methods: {
    initData() {
      let self = this
      // 编辑初始赋值
      let { title, linkman, linkphone, information, address, district, town, image1, image2, categoryId } = self.release
      self.title = title
      self.linkman = linkman
      self.linkphone = linkphone
      self.information = information
      self.address = address
      self.district = district
      self.town = town
      self.messageImage1 = image1
      self.messageImage2 = image2
      self.indexCategory = self.categoryList.findIndex(item=>item.categoryId == categoryId)
      //
      self.areaCode = district
      self.areaCode1 = town
      self.areaText = transCodeToName(self.province,self.city,self.district,null,'')  // 省市区文案
      self.index = Object.keys(jieyang['town'][district]).findIndex(item => item == town)
    },
    async getState() {
      let self = this
      const data = await post('/api/state/query')
      if (data.code == 0) {
        self.isPay = data.data.isPay
      } else {
        Toast.fail(data.data.msg)
      }
    },
    async getUserRelease() {
      let self = this
      const data = await get('/recruitment/message/selectMessageByUserId.do')
      if (data.status == 0) {
        self.release = data.data
        //
        self.initData()
        let state = data.data['state']
        self.state = state
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
    async getCategory() {
      let self = this
      const data = await post('/api/category/query')
      if (data.code == 0) {
        self.categoryList = data.data
      } else {
        Toast.fail(data.data.msg)
      }
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
    chooseImage(zd) {
      var self = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          self[zd] = tempFilePaths[0]
        }
      })
    },
    validateParams(obj) {
      let self = this
      let result = true
      for (let i in obj) {
        if (obj.hasOwnProperty(i) && !obj[i]) {
          Toast.fail('必填项不能为空')
          console.log('应该才一次')
          result = false
          break
        }
      }
      return result
    },
    // 上传图片
    async uploadPhoto(name,filePath,msgId){
      let self = this
      if(!msgId){
        Toast.fail('图片上传缺少msgId')
        return
      }
      console.log(name, filePath, '上传ing...')
      return new Promise((resolve,reject)=>{
        wx.uploadFile({
            url: 'https://www.aiheart.top/recruitment/file/uploadPhoto.do',
            filePath,
            name,
            header: {
              "content-type": "multipart/form-data",
              'accept': 'application/json',
              'cookie': 'JSESSIONID=' + wx.getStorageSync('JSESSIONID')
            },
            formData: {
              // 其他参数
              msgId
            },
            success: function (res) {
              let data = JSON.parse(res.data)
              console.log(data);
              if (data.status == 0) {
                resolve(data)
                // Toast.success('上传成功')
              } else if (data.status == 2) {
                // 未登录
                wx.redirectTo({
                  url: '/pages/login/main'
                })
              } else {
                Toast.fail(data.msg)
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
      })
    },
    // 提交
    async evaSubmit(event) {
      console.log(event.mp.detail)
      let self = this
      self.information = event.mp.detail.value.information
      self.address = event.mp.detail.value.address
      const params = {
        title: this.title,
        linkman: this.linkman,
        linkphone: this.linkphone,
        province: this.province,
        city: this.city,
        district: this.areaCode,
        town: this.areaCode1,
        address: this.address,
        information: this.information,
        categoryId: this.categoryId
      }
      console.log('发布参数', params)
      if (!self.validateParams(params)) { return }
      let messageImage1 = self.messageImage1
      let messageImage2 = self.messageImage2
      // this.goTo('/pages/buy/main')
      if (!messageImage1 && !messageImage2) {
        Toast.fail('至少上传一张图片')
        return
      }
      // 保存信息
      Toast.loading({
        mask: true,
        message: '正在提交...'
      })
      let url = ''
      if (self.release&&self.release.state == 2) {
        url = '/recruitment/message/updateMessageByPrimaryKeySelective.do'
        params['msgId'] = self.release['msgId']
      } else {
        url = '/recruitment/message/insertMessage.do'
      }
      // Toast.loading({
      //   mask: true,
      //   // message: '保存中...'
      // })
      const data = await post(url, params)
      console.log(data)
      if (data.status == 0) {
        let msgId = params['msgId'] ? params['msgId'] : data.data
        // 发布信息保存后
        let temParams = {
          messageImage1,
          messageImage2
        }
        // 编辑状态
        let release = self.release
        let existPics = []
        console.log('release',release)
        console.log('state',self.state)
        if(self.state == 1 || self.state == 2){
          existPics.push(release['image1'])
          existPics.push(release['image2'])
        }
        console.log(existPics)
        console.log(temParams)
        for (let i in temParams) {
          if (temParams.hasOwnProperty(i) && temParams[i] && !existPics.includes(temParams[i])) {
            console.log(11111)
            // 先上传图片
            let data1 = await self.uploadPhoto(i,temParams[i],msgId)
            if(data1.status != 0){
              Toast.fail(data1.msg)
            }
            console.log(33333333333333,data1)
          }
        }
        
        Toast.loading({
          mask: true,
          message: '更新成功,跳转中...'
        })
        setTimeout(() => {
          self.jumpTo('/pages/center/main')
        }, 500)

        } else {
          Toast.fail(data.msg)
        }
    },
    confirmTextarea(event) {
      console.log(event)
      this.information = event.mp.detail.value
    },
    chooseArea() {
      this.showArea = true
    },
    chooseArea1() {
      this.showArea1 = true
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
        // 镇
        let codeObj = jieyang.town[this.areaCode]
        let firstKey = Object.keys(codeObj)[0]
        this.areaCode1 = firstKey
        this.index = 0
      }
      this.showArea = false
    },
    confirmArea1(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.index = value.value
      this.areaCode1 = this.pickerAreaList1[this.index]['id']
    },
    confirmCategory(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      // this.index = value.value
      this.indexCategory = value.value
    },
    onClose() {
      this.showArea = false
    },
    onClose1() {
      this.showArea1 = false
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
      this.linkman = value
    },
    onChange3(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.linkphone = value
    },
    onChange4(event) {
      // event.mp.detail 为当前输入的值
      var value = event.mp.detail
      console.log(value)
      this.address = value
    },
  }
}

</script>

<style lang="scss">
@import "./style.scss";
</style>
