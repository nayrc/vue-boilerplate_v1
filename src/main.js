import Vue from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import router from "./router"
import store from "./store"
import "./thirdParty/index"

import CookiesConfig from "./config/cookies"

Vue.config.productionTip = false

import "@/libs/alias"
import "@/libs/vee-validate"
import "@/libs/vue-select"

Vue.$cookies.config(
  CookiesConfig.expiredTime,
  CookiesConfig.path,
  CookiesConfig.domain,
  CookiesConfig.secure
)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
