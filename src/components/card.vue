<template>
  <div class="card">
    <div class="qy_txt">
      <h1><img :src="photo?photo:defaultAvatar" alt="头像"><span class="elips">{{title}}</span></h1>
      <p class="elips">{{zongcheng}}</p>
      <div class="qy_dt">
        <span v-if="categoryName" class="qt_tag">{{categoryName}}</span>{{time}}
        </div>
    </div>
    <div class="qy_img">
      <img :src="image1" alt="">
    </div>
  </div>
</template>

<script>
import {
  formatTime, transCodeToName
} from '@/utils/index'
import {
  mapState
} from 'vuex'
import defaultAvatar from '../../static/assets/images/avatar_hi.png'

export default {
  props: ['title', 'releaseTime', 'province', 'city','district', 'town', 'image1', 'address', 'categoryId','photo'],
  data() {
    return {
      defaultAvatar,
      time: null
    }
  },
  mounted() {
    let self = this
    this.time = formatTime(this.releaseTime).slice(0, 10)
  },
  computed: {
    ...mapState(['categoryList']),
    zongcheng(){
      let self = this
      return transCodeToName(self.province,self.city,self.district,self.town,'-')
    },
    categoryName(){
      let self = this
      return this.categoryList?this.categoryList.find(item => item.categoryId == self.categoryId)['categoryName'].slice(0, 4):''
    }
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
    >.elips{
      width:520px;
    }
  }

  h1 {
    display: flex;
    align-items: center;
    flex-direction: row;
    color: #13227a;
    .elips{
      width:440px;
    }
    img{
      width:60px;
      height:60px;
      border-radius: 50%;
      margin-right: 20px;
    }
  }
  .elips{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  p {
    color: #a3a3a3;
    font-size: 28px;
    padding: 20px 0;
  }

  .qy_dt {
    font-size: 28px;
  }
  .qt_tag {
    border: 1px solid #13227a;
    color: #13227a;
    font-size: 28px;
    padding: 3px;
    margin-right: 20px;
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
