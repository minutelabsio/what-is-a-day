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
      , redirect: { name: 'stellar-v-solar' }
      , children: [
        {
          path: 'stellar-v-solar'
          , name: 'stellar-v-solar'
          , component: () => import('@/components/chapters/sidereal-v-solar')
          , meta: {
            title: 'Sidereal vs. Solar Days'
            , audio: [
              require('@/assets/v1/Siderial vs Solar days.mp3')
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
              require('@/assets/v1/Eccentricity.mp3')
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
              require('@/assets/v1/Axial Tilt.mp3')
            ]
          }
        }
      ]
    }
  ]
})
