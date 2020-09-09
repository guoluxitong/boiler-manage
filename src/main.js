// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import './icons'
import menuContext from '@/components/menuContext'
import subMenu from '@/components/menuContext/subMenu'
import menuContextItem from '@/components/menuContext/menuContextItem'
import VDistpicker from 'v-distpicker'
import store from './store'
import router from './router'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css' // 引入样式
import 'videojs-flash'
import VueContextMenu from 'vue-contextmenu'

Vue.use(VueContextMenu)
Vue.use(menuContext)
Vue.use(subMenu)
Vue.use(menuContextItem)
Vue.use(VideoPlayer)
Vue.component('menu-context',menuContext)
Vue.component('v-distpicker',VDistpicker)
Vue.component('sub-menu',subMenu)
Vue.component('menu-context-item',menuContextItem)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts



/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
