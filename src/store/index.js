import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //
    code: '445200', // 编码
    text: '揭阳',
    categoryList: null
  },
  mutations: {
    alterZone(state,{code,text}) {
      state.code = code
      state.text = text
    },
    initCategary(state,obj){
      state.categoryList = obj
    }
  },
  actions: {
    //
  }
})

export default store;
