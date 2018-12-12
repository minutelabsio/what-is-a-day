<template lang="pug">
Player.player(:playlist="playlist", :play-index="playIndex")
  .main
    router-view
  .panel-bottom
    PlayerControls()
</template>

<script>
// import Promise from 'bluebird'
// import PubSub from '@/lib/pubsub'
import Player from '@/components/player'
import PlayerControls from '@/components/player-controls'

export default {
  name: 'PlayerUI'
  , props: {

  }
  , components: {
    Player
    , PlayerControls
  }
  , data: () => ({
  })
  , created(){

  }
  , computed: {
    playlist(){
      let playerRoute = this.$router.options.routes.find( r => r.name === 'player' )
      return playerRoute.children.map( r => ({
        routeName: r.name
        , title: r.meta.title
        , files: r.meta.audio
      }))
    }
    , playIndex(){
      let title = this.$route.meta.title
      return this.playlist.findIndex( p => p.title === title )
    }
  }
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
  height: 100vh

.main
  flex: 1
</style>
