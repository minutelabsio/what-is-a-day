<template lang="pug">
.player-controls(:class="{ paused: paused }")
  AudioScrubber(:progress="progress", @scrub="onScrub", @scrubstart="scrubbing = true", @scrubend="scrubbing = false")
  .info
    .toc
      b-dropdown(position="is-top-left")
        .button.is-white.is-fullwidth(slot="trigger")
          span {{ nowPlaying.title }}
          b-icon(icon="chevron-up", size="is-small")
        b-dropdown-item(v-for="(item, index) in playlist", :key="item.title", @click="playlistIndex = index")
          | {{ itemType }} {{ index + 1 }}: {{ item.title }}
    .time {{ time | duration }}

  .controls
    .btn.clickable
      b-icon(icon="skip-previous", size="is-large")
    .btn.clickable(@click="togglePlay")
      .playpause
    .btn.clickable
      b-icon(icon="skip-next", size="is-large")
    //- .right
    //-   .playlist-nav
    //-     .button.is-white.btn-back
    //-       b-icon(icon="menu-left")
    //-
</template>

<script>
import { Howl, Howler } from 'howler'
import _throttle from 'lodash/throttle'
import AudioScrubber from '@/components/audio-scrubber'

export default {
  name: 'PlayerControls'
  , props: {
    playlist: Array
    , itemType: {
      type: String
      , default: 'Chapter'
    }
  }
  , components: {
    AudioScrubber
  }
  , data: () => ({
    time: 0
    , totalTime: 0
    , paused: true
    , playlistIndex: 0
    , scrubbing: false
  })
  , mounted(){
    Howler.volume( 1 )
    let stop = false
    const updateTime = () => {
      if ( stop ){ return }
      window.requestAnimationFrame( updateTime )

      if (!this.howl || this.scrubbing){ return }
      let time = this.howl.seek() * 1000
      this.time = time || 0
    }

    this.$once('hook:beforeDestroy', () => {
      stop = true
    })

    updateTime()
  }
  , watch: {
    howl: {
      handler( newHowl, oldHowl ){
        if ( oldHowl ){
          // remove all events
          oldHowl.off()
        }

        if ( newHowl.state() === 'loaded' ){
          this.setTotalTime()
        } else {
          newHowl.on('load', this.setTotalTime.bind(this))
          newHowl.on('play', () => { this.paused = false })
          newHowl.on('pause', () => { this.paused = true })
          newHowl.on('end', () => { this.paused = true })
        }
      }
      , immediate: true
    }
    , howls( newHowls, oldHowls ){
      if (oldHowls){
        oldHowls.forEach( h => h.unload() )
      }
    }
  }
  , created(){

  }
  , destroyed(){
    if ( this.howls ){
      this.howls.forEach( h => h.unload() )
    }
  }
  , computed: {
    progress(){
      return this.time / this.totalTime * 100
    }
    , nowPlaying(){
      if (!this.playlist){ return { title: '' } }
      return this.playlist[ this.playlistIndex ]
    }
    , howls(){
      if (!this.playlist){ return [] }
      return this.playlist.map( entry => {
        return new Howl({
          src: entry.files
        })
      })
    }
    , howl(){
      return this.howls[ this.playlistIndex ].seek(0)
    }
  }
  , methods: {
    togglePlay(){
      if ( !this.howl ){ return }
      if ( !this.paused ){
        this.howl.pause()
      } else {
        this.howl.play()
      }
    }
    , setTotalTime(){
      this.totalTime = this.howl.duration() * 1000
    }
    , onScrub( progress ){
      this.time = progress * this.totalTime / 100
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@import '@/styles/_variables.scss'
.player-controls
  position: relative
  max-width: 100vw
  color: $grey
.info
  margin-top: 2px
  display: flex
  flex-direction: row
  justify-content: center
  flex-grow: 1
  flex-wrap: nowrap
  .toc
    margin-top: 8px
    max-width: 100%
    align-self: center
  .time
    position: absolute
    top: 9px
    right: 3px
    text-align: right
    font-family: $family-monospace
    font-size: 14px
.controls
  display: flex
  flex-direction: row
  justify-content: center
  .btn
    margin: 0 12px 12px
    border-radius: 50%
    transition: 0.1s color ease
    &:active,
    &:hover
      color: $blue
    // border: 1px solid $grey-light
.right
  display: flex
  flex-direction: column
  flex: 1
  padding: 2px 8px 2px 0

.playlist-nav
  display: flex
  flex-direction: row
  align-self: flex-end

  .dropdown
    flex: 1

.playpause
  $size: 26px
  display: block
  margin: 11px 13px
  width: 0
  height: $size
  border-style: double
  border-width: 0px 0 0px round($size * 0.85)
  border-color: transparent transparent transparent $grey
  // transform: translate( 0, 0 )
  transition: 0.1s all ease

  &:active,
  &:hover
    border-left-color: $blue

  .paused &
    border-style: solid
    border-width: ($size/2) 0 ($size/2) round($size * 0.85)
    // transform: translate( 3px, 0 )
</style>
