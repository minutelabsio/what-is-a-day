import Vue from 'vue'
import App from '@/app'
import router from '@/router'
import Filters from '@/plugins/filters'
import Gestures from '@/plugins/gestures'
import Buefy from 'buefy'
import VueCircleSlider from 'vue-circle-slider'
import Copilot from 'copilot'
import * as THREE from 'three'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// require styles
import './styles/main.scss'

Copilot.registerType({
  type: 'Vector3'
  , default: new THREE.Vector3()
  , interpolator: (from, to, t) => {
    let v = new THREE.Vector3()
    v.copy( from )
    return v.lerp( to, t )
  }
})

// import ElementComponents from '@/plugins/element-components'

Vue.use(Buefy, {
  defaultContainerElement: '#app .below-nav'
  // , defaultIconPack: 'fas'
})

Vue.use(VueCircleSlider)
// Vue.use(ElementComponents)
Vue.use(Filters)
Vue.use(Gestures)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
  , router
}).$mount('#app')
