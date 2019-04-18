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
      , redirect: { name: 'stellar' }
      , children: [
        {
          path: 'stellar'
          , name: 'stellar'
          , component: () => import('@/components/chapters/sidereal-v-solar')
          , meta: {
            title: 'Stellar Days'
            , audio: [
              require('@/assets/v2/ML11-stellar-days.mp3')
            ]
          }
        }
        , {
          path: 'solar'
          , name: 'solar'
          , component: () => import('@/components/chapters/elliptic-orbit')
          , meta: {
            title: 'Solar Days'
            , audio: [
              require('@/assets/v2/ML11-solar-days.mp3')
            ]
          }
        }
      ]
    }
  ]
})
