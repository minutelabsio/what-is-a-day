<template lang="pug">
.player-controls(:class="{ paused: paused }")
  AudioScrubber(:progress="progress", @scrub="onScrub")
  .info
    .toc
      b-dropdown(position="is-top-left")
        .button.is-white.is-fullwidth(slot="trigger")
          span Chapter 1: The larch
          b-icon(icon="chevron-up", size="is-small")
        b-dropdown-item
          | Chapter 1: The larch
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
import AudioScrubber from '@/components/audio-scrubber'

export default {
  name: 'PlayerControls'
  , props: {}
  , components: {
    AudioScrubber
  }
  , data: () => ({
    time: 0
    , totalTime: 60 * 1000
    , paused: true
  })
  , computed: {
    progress(){
      return Math.round(this.time / this.totalTime * 100)
    }
  }
  , methods: {
    togglePlay(){
      this.paused = !this.paused
    }
    , onScrub( progress ){
      this.time = progress * this.totalTime / 100
    }
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
