import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //
    district: '', 
    town: '',
    text: '',
    categoryList: null
  },
  mutations: {
    alterZone(state,{ district,town, text}) {
      state.district = district
      state.town = town
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
