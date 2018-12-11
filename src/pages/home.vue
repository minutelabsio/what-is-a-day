<template lang="pug">
Player(:playlist="playlist")
  .main
    Demo
  .panel-bottom
    PlayerControls()
</template>

<script>
// import Promise from 'bluebird'
// import PubSub from '@/lib/pubsub'
import Player from '@/components/player'
import PlayerControls from '@/components/player-controls'
import Demo from '@/components/demo'

export default {
  name: 'home'
  , props: {

  }
  , components: {
    Player
    , PlayerControls
    , Demo
  }
  , data: () => ({
    playlist: [
      {
        title: 'The Equation of Time'
        , files: [
          'https://labs.minutelabs.io/Equation-of-Time/library/media/equation-of-time.mp3'
          , 'https://labs.minutelabs.io/Equation-of-Time/library/media/equation-of-time.ogg'
        ]
      }
      , {
        title: 'Stellar Time vs. Solar Time'
        , files: [
          'https://labs.minutelabs.io/Equation-of-Time/library/media/stellar-v-solar.mp3'
          , 'https://labs.minutelabs.io/Equation-of-Time/library/media/stellar-v-solar.ogg'
        ]
      }
    ]
  })
  , methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@import '@/styles/_variables.scss'
.player
  display: flex
  flex-direction: column
  justify-content: flex-end
  height: 100%
.main
  flex: 1
</style>
