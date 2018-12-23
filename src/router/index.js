import Vue from 'vue'
import Router from 'vue-router'
import PlayerUI from '@/pages/player-ui'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'
      , name: 'player'
      , component: PlayerUI
      , redirect: { name: 'demo' }
      , children: [
        {
          path: 'demo'
          , name: 'demo'
          , component: () => import('@/components/chapters/axial-tilt')
          , meta: {
            title: 'The Equation of Time'
            , audio: [
              require('@/assets/equation-of-time.mp3')
            ]
          }
        }
        , {
          path: 'demo2'
          , name: 'demo2'
          , component: () => import('@/components/demo')
          , meta: {
            title: 'Stellar Time vs. Solar Time'
            , audio: [
              require('@/assets/equation-of-time.mp3')
            ]
          }
        }
      ]
    }
  ]
})
