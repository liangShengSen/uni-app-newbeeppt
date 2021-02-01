import Vue from 'vue'
import App from './App'
import api from './common/api'
import utils from './common/js/utils.js'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$utils = utils

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
