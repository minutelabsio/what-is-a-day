import Vue from 'vue'
import Router from 'vue-router'
import PlayerUI from '@/pages/player-ui'
import Demo from '@/components/demo'

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
          , component: Demo
          , meta: {
            title: 'The Equation of Time'
            , audio: [
              'https://labs.minutelabs.io/Equation-of-Time/library/media/equation-of-time.mp3'
              , 'https://labs.minutelabs.io/Equation-of-Time/library/media/equation-of-time.ogg'
            ]
          }
        }
        , {
          path: 'demo2'
          , name: 'demo2'
          , component: Demo
          , meta: {
            title: 'Stellar Time vs. Solar Time'
            , audio: [
              'https://labs.minutelabs.io/Equation-of-Time/library/media/stellar-v-solar.mp3'
              , 'https://labs.minutelabs.io/Equation-of-Time/library/media/stellar-v-solar.ogg'
            ]
          }
        }
      ]
    }
  ]
})
