import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import route from './modules/route'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    route
  },
  plugins: [new VuexPersistence().plugin],
  getters
})

export default store
