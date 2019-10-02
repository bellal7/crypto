import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import Toasted from 'vue-toasted'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(VueMomentJS, moment)
Vue.use(Toasted)
Vue.component('loading', Loading)

new Vue({
  render: h => h(App),
}).$mount('#app')
