<template lang="pug">
.player-controls(:class="{ paused: player.paused }")
  AudioScrubber(:progress="progress", @scrub="onScrub", @scrubstart="player.scrubbing = true", @scrubend="player.scrubbing = false")
  .info
    .toc
      b-dropdown(position="is-top-left")
        .button.btn-toc.is-fullwidth(slot="trigger")
          span {{ player.nowPlaying.title }}
          b-icon(icon="chevron-up", size="is-small")
        b-dropdown-item(v-for="(item, index) in player.playlist", :key="item.title", @click="player.setTrack(index)")
          | {{ player.itemType }} {{ index + 1 }}: {{ item.title }}
    .time-total {{ player.totalTime | duration }}
    .time-elapsed {{ player.time | duration }}

  .controls
    .btn.clickable(@click="player.previous", :class="{ disabled: player.playIndex <= 0 }")
      b-icon(icon="skip-previous", size="is-large")
    .btn.clickable(@click="player.togglePlay")
      .playpause
    .btn.clickable(@click="player.next", :class="{ disabled: player.playIndex >= (player.playlist.length - 1) }")
      b-icon(icon="skip-next", size="is-large")
</template>

<script>
import AudioScrubber from '@/components/audio-scrubber'

export default {
  name: 'PlayerControls'
  , inject: [ 'player' ]
  , props: {

  }
  , components: {
    AudioScrubber
  }
  , data: () => ({
  })
  , computed: {
    progress(){
      return this.player.time / this.player.totalTime * 100
    }
  }
  , methods: {
    onScrub( progress ){
      let time = progress * this.player.totalTime / 100
      this.player.seek( time )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
.player-controls
  position: relative
  max-width: 100vw
  color: $text
.info
  margin-top: 2px
  display: flex
  flex-direction: row
  justify-content: center
  flex-grow: 1
  flex-wrap: nowrap
  .toc
    margin-top: 16px
    margin-bottom: -6px
    max-width: 100%
    align-self: center

    .btn-toc
      background: $background
      border-color: $background
      color: $text
  .time-total,
  .time-elapsed
    position: absolute
    top: 9px
    right: 3px
    text-align: right
    font-family: $family-monospace
    font-size: 14px
  .time-elapsed
    right: auto
    left: 3px
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

    &.disabled
      color: inherit
      opacity: 0.5
      cursor: auto
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
