import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentMenu: null,
  },
  mutations: {
    selectMenu(state, val){
      val.name == 'home'? state.currentMenu = null : state.currentMenu = val
    }
  },
  actions: {
  },
  modules: {
  }
})
