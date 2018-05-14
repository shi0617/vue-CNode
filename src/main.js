// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store/'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

// 请求的插件
import https from './server'
Vue.use(https);


Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
