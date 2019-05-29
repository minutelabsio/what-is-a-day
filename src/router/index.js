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
          , component: () => import('@/components/chapters/stellar-days')
          , meta: {
            title: 'Stellar Days'
            , audio: [
              require('@/assets/v3/01-stellar-days.mp3')
            ]
          }
        }
        , {
          path: 'solar'
          , name: 'solar'
          , component: () => import('@/components/chapters/solar-days')
          , meta: {
            title: 'Solar Days'
            , audio: [
              require('@/assets/v3/02-solar-days.mp3')
            ]
          }
        }
        , {
          path: 'elliptic-orbit'
          , name: 'elliptic-orbit'
          , component: () => import('@/components/chapters/elliptic-orbit')
          , meta: {
            title: 'Earth\'s Elliptic Orbit'
            , audio: [
              require('@/assets/v3/03-elliptical-orbit.mp3')
            ]
          }
        }
        , {
          path: 'axial-tilt'
          , name: 'axial-tilt'
          , component: () => import('@/components/chapters/axial-tilt')
          , meta: {
            title: 'Earth\'s Axial Tilt'
            , audio: [
              require('@/assets/v3/04-axial-tilt.mp3')
            ]
          }
        }
        , {
          path: 'longest-day'
          , name: 'longest-day'
          , component: () => import('@/components/chapters/longest-day')
          , meta: {
            title: 'The Longest Day of the Year'
            , audio: [
              'https://raw.githubusercontent.com/anars/blank-audio/master/1-second-of-silence.mp3'
            ]
          }
        }
      ]
    }
  ]
})
