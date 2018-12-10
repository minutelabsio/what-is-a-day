<template lang="pug">
.app
  .main
  .panel-bottom
    PlayerControls
</template>

<script>
// import Promise from 'bluebird'
// import PubSub from '@/lib/pubsub'
import PlayerControls from '@/components/player-controls'

export default {
  name: 'home'
  , props: {

  }
  , components: {
    PlayerControls
  }
  , data: () => ({

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
