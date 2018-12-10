<template lang="pug">
.scrubber(v-drag="onScrub")
  .inner
    .progress-bar(:style="{ width: `${progress}%`}")
</template>

<script>

export default {
  name: 'AudioScrubber'
  , props: {
    progress: Number
  }
  , components: {}
  , data: () => ({
  })
  , methods: {
    onScrub( e ){
      let x = e.layerX
      let progress = Math.round( x / this.$el.offsetWidth * 100 )
      progress = Math.min(Math.max(0, progress), 100)
      this.$emit('scrub', progress)
    }
  }
}
</script>

<style scoped lang="sass">
@import '@/styles/_variables.scss'
.scrubber
  position: relative
  z-index: 1
  padding-top: 6px
  margin: -8px 0
  width: 100%
  height: 16px
  -webkit-touch-callout: none
  -webkit-user-select: none
  -khtml-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none
  -webkit-tap-highlight-color:  rgba(255, 255, 255, 0)
  cursor: pointer

  .inner
    height: 4px
    background: $grey-light

  .progress-bar
    position: relative
    height: 100%
    background: $blue
    border-radius: 0 6px 6px 0
    transition: width 0.1s ease

    &:after
      content: ''
      background: $blue
      width: 10px
      height: 10px
      border-radius: 10px
      position: absolute
      top: -3px
      right: -4px
</style>
