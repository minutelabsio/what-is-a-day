<template lang="pug">
.player
  b-loading(:is-full-page="false", :active="loading")
  slot
</template>

<script>
// import PubSub from '@/lib/pubsub'
import { Howl, Howler } from 'howler'
import _throttle from 'lodash/throttle'

export default {
  name: 'Player'
  , props: {
    playlist: {
      type: Array
      , required: true
    }
    , itemType: {
      type: String
      , default: 'Chapter'
    }
  }
  , provide(){
    return {
      player: this
    }
  }
  , components: {
  }
  , data: () => ({
    time: 0
    , totalTime: -1
    , paused: true
    , playlistIndex: 0
    , scrubbing: false
  })
  , created(){
    Howler.volume( 1 )

    let stop = false
    const updateTime = () => {
      if ( stop ){ return }
      window.requestAnimationFrame( updateTime )
      let now = Date.now()
      this.$emit('frame', now)

      if (!this.howl || this.scrubbing){ return }
      let time = this.howl.seek() * 1000
      this.time = time || 0
    }

    this.$once('hook:beforeDestroy', () => {
      stop = true
    })

    updateTime()
  }
  , destroyed(){
    if ( this.howls ){
      this.howls.forEach( h => h.unload() )
    }
  }
  , watch: {
    howl: {
      handler( newHowl, oldHowl ){
        this.totalTime = -1

        if ( oldHowl ){
          oldHowl.pause()
          // remove all events
          oldHowl.off()
        }

        newHowl.on('load', this.setTotalTime.bind(this))
        newHowl.on('loaderror', this.announceError.bind(this))
        newHowl.on('play', () => { this.paused = false })
        newHowl.on('pause', () => { this.paused = true })
        newHowl.on('end', () => { this.paused = true })
        newHowl.load().seek(0)
      }
      , immediate: true
    }
    , howls( newHowls, oldHowls ){
      if (oldHowls){
        oldHowls.forEach( h => h.unload() )
      }
    }
  }
  , computed: {
    howls(){
      if ( !this.playlist ){ return [] }
      return this.playlist.map( entry => {
        return new Howl({
          src: entry.files
          , preload: false
        })
      })
    }
    , howl(){
      if ( !this.howls.length ){ return null }
      return this.howls[ this.playlistIndex ]
    }
    , nowPlaying(){
      if ( !this.playlist ){ return { title: '' } }
      return this.playlist[ this.playlistIndex ]
    }
    , loading(){
      return this.totalTime === -1
    }
  }
  , methods: {
    announceError( err ){
      console.log( err ) // eslint-disable-line no-console
    }
    , setTotalTime(){
      this.totalTime = this.howl.duration() * 1000
    }
    , togglePlay(){
      if ( !this.howl ){ return }
      if ( !this.paused ){
        this.pause()
      } else {
        this.play()
      }
    }
    , pause(){
      this.howl.pause()
    }
    , play(){
      this.howl.play()
    }
    , previous(){
      if ( this.playlistIndex <= 0 ){ return }
      this.playlistIndex--
    }
    , next(){
      if ( this.playlistIndex >= (this.playlist.length - 1) ){ return }
      this.playlistIndex++
    }
    , setTrack( index ){
      this.playlistIndex = Math.max(Math.min(index, this.playlist.length - 1), 0)
    }
    , seek( time ){
      this.time = time
      this.seekAudio()
    }
    , seekAudio: _throttle(function(){
      let vol = this.howl.volume()
      this.howl.volume( 0 )
      this.howl.seek( this.time / 1000 )
      this.howl.fade( 0, vol, 100 )
    }, 200)
  }
}
</script>

<style scoped lang="sass">
@import '@/styles/_variables.scss'
.loading-overlay
  z-index: 100
</style>
