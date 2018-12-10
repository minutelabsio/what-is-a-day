<template lang="pug">
.player-controls(:class="{ paused: paused }")
  .left
    .playpause.clickable(@click="togglePlay")
  .right
    .playlist-nav
      .button.is-white.btn-back
        b-icon(icon="menu-left")
      b-dropdown(position="is-top-left")
        .button.is-white.is-fullwidth(slot="trigger")
          b-icon(icon="table-of-contents", size="is-small")
          span test
          b-icon(icon="chevron-up", size="is-small")
        b-dropdown-item
          | Chapter 1: The larch
      .button.is-white.btn-back
        b-icon(icon="menu-right")
    .scrubber
      progress.progress.is-small(value="60", max="100")
</template>

<script>

export default {
  name: 'PlayerControls'
  , props: {}
  , components: {}
  , data: () => ({
    paused: true
  })
  , methods: {
    togglePlay(){
      this.paused = !this.paused
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@import '@/styles/_variables.scss'
.player-controls
  border-top: 1px solid $grey-light
  display: flex
  flex-direction: row
  color: $grey
.left
  padding: 30px
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
  width: 0
  height: $size
  transition: 0.1s border-width ease
  border-style: double
  border-width: 0px 0 0px ($size * 0.8)
  border-color: transparent transparent transparent $grey

  .paused &
    border-style: solid
    border-width: ($size/2) 0 ($size/2) ($size * 0.8)
</style>
