// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import Filters from './plugins/filters'
import Buefy from 'buefy'

// require styles
import './styles/main.scss'

Vue.use(Buefy, {
  defaultContainerElement: '#app .below-nav'
  // , defaultIconPack: 'fas'
})

Vue.use(Filters)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app'
  , router
  , data: () => ({
  })
  , components: { App }
  , template: '<App/>'
})
