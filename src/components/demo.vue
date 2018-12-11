<template lang="pug">
.demo(v-drag="onDrag")
  .scene
    .cube(:style="{ transform: transform }")
      .cube__face.cube__face--front
      .cube__face.cube__face--back
      .cube__face.cube__face--right
      .cube__face.cube__face--left
      .cube__face.cube__face--top
      .cube__face.cube__face--bottom
</template>

<script>
require('@/lib/frames')
const Frames = window.Frames

export default {
  name: 'Demo'
  , inject: [ 'player' ]
  , props: {

  }
  , components: {
  }
  , data: () => ({
    x: 0
    , y: 0
    , x0: 0
    , y0: 0
  })
  , created(){
    let frames = this.frames = Frames({
      x: {
        type: 0
        // , interpolator: Frames.Interpolators.Angle
      }
      , y: {
        type: 0
        // , interpolator: Frames.Interpolators.Angle
      }
    }, {
      defaultTransitionDuration: '3s'
    })

    frames.add({
      x: 360 * 3
    }, {
      id: 'spin'
      , time: '15s'
      , duration: '15s'
      , easing: Frames.Easing.Quadratic.In
    })

    frames.add({
      y: 180
    }, {
      id: 'up'
      , time: '20s'
      , duration: '10s'
      , easing: Frames.Easing.Quadratic.InOut
    })

    frames.add({
      x: 0
    }, {
      id: 'origin'
      , time: '30s'
      , duration: '10s'
      , easing: Frames.Easing.Quadratic.Out
    })

    frames.add({
      x: 1000
      , y: -4000
    }, {
      time: '02:23'
      , duration: '01:50'
      , easing: Frames.Easing.Linear.None
    })

    let smoother = Frames.Animation.Smoothener( frames, { duration: 100 } )

    const onFrameUpdate = () => {
      var state = frames.state

      smoother.setState( state )
    }

    const onFrame = () => {
      let state = smoother.update()

      this.x = state.x
      this.y = state.y
    }

    const unwatch = this.player.$watch('time', ( time ) => {
      frames.seek( time )
    })

    frames.on('update', onFrameUpdate)
    this.player.$on('frame', onFrame)

    this.$on('hook:beforeDestroy', () => {
      unwatch()
      frames.off()
      this.player.$off('frame', onFrame)
    })
  }
  , computed: {
    transform(){
      return 'translateZ(-100px) rotateY('+this.x+'deg) rotateX('+(-this.y)+'deg)'
    }
  }
  , methods: {
    onDrag( e ){
      let opts = {
        easing: Frames.Easing.Elastic.Out
        , relaxDuration: 1000
        , relaxDelay: 10
        , freeze: true
      }

      if ( e.last ){
        opts.freeze = false
      }

      if ( e.first ){
        this.x0 = this.x
        this.y0 = this.y
      }

      let x = this.x0 + e.offsetX
      let y = this.y0 + e.offsetY

      this.frames.meddle({ x, y }, opts)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@import '@/styles/_variables.scss'
.scene
  width: 200px
  height: 200px
  border: 1px solid #CCC
  margin: 80px auto
  perspective: 400px

.cube
  width: 200px
  height: 200px
  position: relative
  transform-style: preserve-3d
  transform: translateZ(-100px)
  /* transition: transform 0.1s */

.cube__face
  position: absolute
  width: 200px
  height: 200px
  border: 2px solid black
  line-height: 200px
  font-size: 40px
  font-weight: bold
  color: white
  text-align: center

.cube__face--front
  background: hsla(  0, 100%, 50%, 0.7)
.cube__face--right
  background: hsla( 60, 100%, 50%, 0.7)
.cube__face--back
  background: hsla(120, 100%, 50%, 0.7)
.cube__face--left
  background: hsla(180, 100%, 50%, 0.7)
.cube__face--top
  background: hsla(240, 100%, 50%, 0.7)
.cube__face--bottom
  background: hsla(300, 100%, 50%, 0.7)

.cube__face--front
  transform: rotateY(  0deg) translateZ(100px)
.cube__face--right
  transform: rotateY( 90deg) translateZ(100px)
.cube__face--back
  transform: rotateY(180deg) translateZ(100px)
.cube__face--left
  transform: rotateY(-90deg) translateZ(100px)
.cube__face--top
  transform: rotateX( 90deg) translateZ(100px)
.cube__face--bottom
  transform: rotateX(-90deg) translateZ(100px)

</style>
