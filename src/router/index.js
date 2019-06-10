import Vue from 'vue'
import Router from 'vue-router'
import PlayerUI from '@/pages/player-ui'
import About from '@/pages/about'
import Playground from '@/components/playground'

const CDN = 'https://cdn.minutelabs.io/what-is-a-day/audio'

function getTracks(name){
  return [
    `${CDN}/${name}.mp3`
    , `${CDN}/${name}.ogg`
  ]
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'
      , name: 'player'
      , component: PlayerUI
      , redirect: { name: 'welcome' }
      , meta: {
        // music: {
        //   maxVolume: 0.7
        //   , audio: [
        //     `${CDN}/Candlepower.mp3`
        //     , `${CDN}/Candlepower.ogg`
        //   ]
        // }
      }
      , children: [
        {
          path: 'welcome'
          , name: 'welcome'
          , component: () => import('@/components/chapters/welcome')
          , meta: {
            title: 'Welcome'
            , audio: getTracks('welcome')
          }
        }
        , {
          path: 'stellar'
          , name: 'stellar'
          , component: () => import('@/components/chapters/stellar-days')
          , meta: {
            title: 'Stellar Days'
            , audio: getTracks('stellar-days')
          }
        }
        , {
          path: 'solar'
          , name: 'solar'
          , component: () => import('@/components/chapters/solar-days')
          , meta: {
            title: 'Solar Days'
            , audio: getTracks('solar-days')
          }
        }
        , {
          path: 'elliptic-orbit'
          , name: 'elliptic-orbit'
          , component: () => import('@/components/chapters/elliptic-orbit')
          , meta: {
            title: 'Earth\'s Elliptic Orbit'
            , audio: getTracks('eccentric-orbit')
          }
        }
        , {
          path: 'axial-tilt'
          , name: 'axial-tilt'
          , component: () => import('@/components/chapters/axial-tilt')
          , meta: {
            title: 'Earth\'s Axial Tilt'
            , audio: getTracks('axial-tilt')
          }
        }
        , {
          path: 'reality'
          , name: 'reality'
          , component: () => import('@/components/chapters/reality')
          , meta: {
            title: 'A Realistic Picture'
            , audio: getTracks('reality')
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
