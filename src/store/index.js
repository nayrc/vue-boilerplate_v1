import Vue from "vue"
import Vuex from "vuex"

import { getField, updateField } from "vuex-map-fields"

// import { http } from "../config/http"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    production: process.env.VUE_APP_MODE == "production",
    isDev: process.env.VUE_APP_IS_DEV == "1",
    apiUrl: process.env.VUE_APP_API_URL,
    baseUrl: process.env.VUE_APP_BASE_URL,
    loading: {
      screen: false,
    },
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
  },
  actions: {},
  modules: {},
})
