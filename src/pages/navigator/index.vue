<template>
  <div class="container">
    <!--绑定点击事件-->
    <div class="input_area">
      <input type="text" v-model="value" placeholder="请输入搜索地址" class="ax_input">
      <span class="ax_search" @click="search">搜索</span>
    </div>
    <!--地图容器-->
    <map id="myMap" :markers="markers" :include-points="points" style="width:100%;height:calc(100vh - 88rpx);" show-location="true" :longitude="longitude"
      :latitude="latitude" scale='16'>
      <cover-view class="controls">
        <cover-view class="play">
          <cover-image class="img" src="/static/assets/images/location.png" @click="backToOrigin" />
        </cover-view>
      </cover-view>
    </map>
  </div>
</template>

<script>
  import card from '@/components/card'
  import homePic from '@/../static/assets/images/home1.png'
  import configuration from '@/utils/configuration.json'


  // 引入SDK核心类
  import QQMapWX from '@/../static/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js'
  // 实例化API核心类
  var qqmapsdk = new QQMapWX({
    key: configuration['key'] // 必填
  })
  export default {
    data() {
      return {
        latitude: '',
        longitude: '',
        value: '',
        code: null, // 默认
        text: '',
        markers: [
          //   {
          //   iconPath: homePic,
          //   id: 0,
          //   latitude: 23.099994,
          //   longitude: 113.324520,
          //   width: 50,
          //   height: 50
          // }
        ],
        includePoints: [
        //   {
        //   latitude: 23.099994,
        //   longitude: 113.324520,
        // }
        ]
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
      search() {
        let self = this
        // 调用接口
        qqmapsdk.search({
          keyword: self.value, //搜索关键词
          location: `${self.latitude},${self.longitude}`, //设置周边搜索中心点
          success: function (res) { //搜索成功后的回调
            var mks = [],
              icp = []
            for (var i = 0; i < res.data.length; i++) {
              mks.push({ // 获取返回结果，放到mks数组中
                title: res.data[i].title,
                id: res.data[i].id,
                latitude: res.data[i].location.lat,
                longitude: res.data[i].location.lng,
                iconPath: "/resources/my_marker.png", //图标路径
                width: 20,
                height: 20
              })
              icp.push({
                latitude: res.data[i].location.lat,
                longitude: res.data[i].location.lng
              })
            }
            self.markers = mks //设置markers属性，将搜索结果显示在地图中
            self.includePoints = icp
            // 定位到第一个搜索匹配位置
            self.latitude = mks[0].latitude
            self.longitude = mks[0].longitude
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        })
      },
      backToOrigin(e) {
        console.log("回到用户当前定位点");
        let {
          controlId
        } = e;
        let mpCtx = wx.createMapContext("myMap");
        mpCtx.moveToLocation();
      },
      getLocation() {
        let self = this
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            console.log(res)
            const latitude = res.latitude
            const longitude = res.longitude
            const speed = res.speed
            const accuracy = res.accuracy
            self.latitude = res.latitude
            self.longitude = res.longitude
          }
        })
      }
    },
    onShow() {
      this.value = this.$root.$mp.query.keyword // 取参
      this.getLocation()
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
