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

new Vue({
  render: h => h(App)
  , router
}).$mount('#app')
