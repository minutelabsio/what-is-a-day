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
      , redirect: { name: 'elliptic-orbit' }
      , children: [
        {
          path: 'stellar-v-solar'
          , name: 'stellar-v-solar'
          , component: () => import('@/components/chapters/stellar-v-solar')
          , meta: {
            title: 'Stellar Time vs. Solar Time'
            , audio: [
              require('@/assets/equation-of-time.mp3')
            ]
          }
        }
        , {
          path: 'elliptic-orbit'
          , name: 'elliptic-orbit'
          , component: () => import('@/components/chapters/elliptic-orbit')
          , meta: {
            title: 'The Earth\'s Elliptic Orbit'
            , audio: [
              require('@/assets/stellar-v-solar.mp3')
            ]
          }
        }
        , {
          path: 'axial-tilt'
          , name: 'axial-tilt'
          , component: () => import('@/components/chapters/axial-tilt')
          , meta: {
            title: 'Axial Tilt'
            , audio: [
              require('@/assets/equation-of-time.mp3')
            ]
          }
        }
      ]
    }
  ]
})
