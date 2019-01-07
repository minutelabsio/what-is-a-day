<template lang="pug">
.chapter
  .controls
    b-field(grouped)
      b-select(v-model="cameraTarget")
        option(value="earth") Focus on Earth
        option(value="sun") Focus on Sun
        option(value="meanSun") Focus on Mean Sun
      b-switch(v-model="cameraFollow")
        | Follow Orbit

    label Eccentricity
    vue-slider(
      v-model="eccentricity"
      , tooltip-dir="left"
      , :max="0.5"
      , :interval="0.01"
    )

    label Axial Tilt
    vue-slider(
      v-model="tiltAngle"
      , tooltip-dir="left"
      , :max="90"
      , :interval="1"
    )

  DaySim(
    :viewWidth="viewWidth"
    , :viewHeight="viewHeight"
    , :playerLoading="playerLoading"
    , :showGrid="showGrid"
    , :cameraTarget="cameraTarget"
    , :cameraFollow="cameraFollow"

    , :tiltAngle="tiltAngle * deg"
    , :eccentricity="eccentricity"
    , :days="day"
    , :daysPerYear="daysPerYear"
    , @dragstart="dragStart"
    , @drag="drag"
    , @dragend="dragEnd"
  )
</template>

<script>
import Copilot from 'copilot'
import DaySim from '@/components/entities/day-sim'
import vueSlider from 'vue-slider-component'

const deg = Math.PI / 180

export default {
  name: 'elliptic-orbit'
  , props: {
    viewWidth: Number
    , viewHeight: Number
    , playerLoading: Boolean
  }
  , components: {
    DaySim
    , vueSlider
  }
  , data: () => ({
    deg
    , paused: false
    , yearAngleDrag: false

    , daysPerYear: 10
    , day: 0
    , rate: 1 / 100

    , showGrid: false
    , cameraTarget: 'meanSun'
    , cameraFollow: false

    , tiltAngle: 23.4
    , eccentricity: 0.3
  })
  , created(){

    let stop = false
    const draw = () => {
      if ( stop ) { return }
      requestAnimationFrame( draw )

      this.draw()
    }

    this.$on('hook:beforeDestroy', () => {
      stop = true
    })

    if ( !this.playerLoading ){
      draw()
    } else {
      let unwatch = this.$watch('playerLoading', () => {
        unwatch()
        draw()
      })
    }
  }
  , mounted(){

  }
  , watch: {

  }
  , computed: {
    radsPerYear(){
      return (2 * Math.PI / this.daysPerYear)
    }
    , yearAngle(){
      return this.day * this.radsPerYear
    }
  }
  , methods: {
    draw(){
      let day = this.day
      if ( !this.paused ){
        day = day + this.rate
      } else if ( this.yearAngleDrag ){
        let targetDay = (this.yearAngle + this.yearAngleDrag) / this.radsPerYear
        let halfYear = this.daysPerYear / 2
        let dayDelta = (targetDay - day)
        if ( Math.abs(dayDelta) > halfYear ){
          if ( dayDelta > 0 ){
            dayDelta -= this.daysPerYear
          } else {
            dayDelta += this.daysPerYear
          }
        }
        day = day + dayDelta * 0.05
      }

      this.day = day
    }
    , dragStart(){
      this.paused = true
    }
    , drag( amount ){
      this.yearAngleDrag = amount
    }
    , dragEnd(){
      this.yearAngleDrag = false
      this.paused = false
    }
  }
}
</script>

<style scoped lang="sass">
.chapter
  background: $background
  cursor: crosshair

.controls
  position: absolute
  z-index: 1
  top: 0
  right: 0
  padding: 1rem
  background: transparentize($background, 0.4)
  border-radius: 0 0 0 3px
  border: 1px solid $background
  border-top-width: 0
  border-right-width: 0
</style>
