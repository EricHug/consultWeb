<template>
  <div class="card">
    <div class="qy_txt">
      <h1>{{title}}</h1>
      <p>{{province}}-{{city}}-{{district}}-{{town}}</p>
      <div class="qy_dt">
        <span v-if="categoryName" class="qt_tag">{{categoryName}}</span>{{time}}</div>
    </div>
    <div class="qy_img">
      <img :src="image1" alt="">
    </div>
  </div>
</template>

<script>
  import {
    formatTime
  } from '@/utils/index'
  import {
    mapState
  } from 'vuex'
  export default {
    props: ['title', 'activeTime', 'province', 'city', 'town', 'image1', 'address','categoryId'],
    data() {
      return {
        time: null,
        categoryName: ''
      }
    },
    mounted() {
      let self = this
      this.time = formatTime(this.activeTime).slice(0, 10)
      this.categoryName = this.categoryList.find(item=>item.id==self.categoryId)['categoryName'].slice(0,4)
    },
    computed: {
      ...mapState(['categoryList'])
    },
    methods: {}
  }

</script>

<style lang="scss" scoped>
  .card {
    padding: 24px !important;
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .qy_txt {
      flex-grow: 1;
    }

    h1 {
      color: #13227a;
    }

    p {
      color: #a3a3a3;
      font-size: 28px;
      padding: 20px 0;
    }

    .qy_dt{
      font-size: 28px;
    }
    .qt_tag{
      border:1px solid #13227a;
      color: #13227a;
      font-size: 28px;
      padding:3px;
      margin-right:20px;
    }

    .qy_img {
      color: #151515;

      img {
        width: 120px;
        height: 120px;
        overflow: hidden;
        border: 1px solid #000;
        margin-right: 16px;
      }

      span {
        font-size: 30px;
      }
    }
  }

</style>
