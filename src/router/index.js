import Vue from 'vue'
import Router from 'vue-router'
import PlayerUI from '@/pages/player-ui'
import About from '@/pages/about'
import Playground from '@/components/playground'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'
      , name: 'player'
      , component: PlayerUI
      , redirect: { name: 'welcome' }
      , children: [
        {
          path: 'welcome'
          , name: 'welcome'
          , component: () => import('@/components/chapters/welcome')
          , meta: {
            title: 'Welcome'
            , audio: [
              'https://raw.githubusercontent.com/anars/blank-audio/master/1-second-of-silence.mp3'
            ]
          }
        }
        , {
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
          path: 'reality'
          , name: 'reality'
          , component: () => import('@/components/chapters/reality')
          , meta: {
            title: 'A Realistic Picture'
            , audio: [
              'https://raw.githubusercontent.com/anars/blank-audio/master/1-second-of-silence.mp3'
            ]
          }
        }
      ]
    }
    , {
      path: '/playground'
      , name: 'playground'
      , component: Playground
    }
    , {
      path: '/about'
      , name: 'about'
      , component: About
    }
    , {
      path: '*'
      , redirect: 'welcome'
    }
  ]
})
