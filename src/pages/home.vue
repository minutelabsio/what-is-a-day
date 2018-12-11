<template lang="pug">
Player.app(:playlist="playlist")
  .main
  .panel-bottom
    PlayerControls()
</template>

<script>
// import Promise from 'bluebird'
// import PubSub from '@/lib/pubsub'
import Player from '@/components/player'
import PlayerControls from '@/components/player-controls'

export default {
  name: 'home'
  , props: {

  }
  , components: {
    Player
    , PlayerControls
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
.app
  display: flex
  flex-direction: column
  justify-content: flex-end
  height: 100vh
</style>
