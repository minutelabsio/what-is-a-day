<template lang="pug">
.chapter
  .controls
    .level.is-mobile
      .level-left
        b-field(grouped)
          b-field
            .control
              b-checkbox-button.checkbox-btn-dark.icon-only(v-model="paused")
                b-icon(:icon="paused ? 'play' : 'pause'")
          b-field
            b-radio-button.checkbox-btn-dark(v-model="panelState", native-value="graph") Graph
            b-radio-button.checkbox-btn-dark(v-model="panelState", native-value="controls") Controls
            b-radio-button.checkbox-btn-dark(v-model="panelState", native-value="hide") Hidden

    .extra-fields(v-if="panelState === 'controls'")
      label Animation Speed
      vue-slider.slider(
        v-model="playRate"
        , tooltip-dir="left"
        , :tooltip="false"
        , :max="1"
        , :min="0.01"
        , :interval="0.01"
      )

      label Days per Year
      vue-slider.slider(
        v-model="solarDaysPerYear"
        , tooltip-dir="left"
        , :max="365"
        , :min="0"
        , :interval="1"
      )

      b-field(grouped)
        b-select(v-model="cameraTarget")
          option(value="earth") Focus Earth
          option(value="sun") Focus Sun
          option(value="meanSun") Focus Mean Sun
        b-switch(v-model="cameraFollow")
          | Follow Orbit

      label Eccentricity
      vue-slider.slider(
        v-model="eccentricity"
        , tooltip-dir="left"
        , :max="0.5"
        , :interval="0.01"
      )

      label Axial Tilt
      vue-slider.slider(
        v-model="tiltAngle"
        , tooltip-dir="left"
        , :max="90"
        , :interval="1"
      )

      br/

      b-field(grouped)
        b-checkbox(v-model="showGrid")
          span Grid
        b-checkbox(v-model="showEarthOrbits")
          span Earth Orbits
        b-checkbox(v-model="showSunOrbits")
          span Solar Orbits

    .eot-graph(v-if="panelState === 'graph'")
      EOTGraph(:eccentricity="eccentricity", :tilt="tiltAngle * deg", :mean-anomaly="yearAngle")

  DaySim(
    :viewWidth="viewWidth"
    , :viewHeight="viewHeight"
    , :playerLoading="playerLoading"
    , :showGrid="showGrid"
    , :cameraTarget="cameraTarget"
    , :cameraFollow="cameraFollow"
    , :showEarthOrbits="showEarthOrbits"
    , :showSunOrbits="showSunOrbits"

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
// import Copilot from 'copilot'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import vueSlider from 'vue-slider-component'

const Pi2 = Math.PI * 2
const deg = Math.PI / 180

function euclideanModulo( n, m ) {
	return ( ( n % m ) + m ) % m
}

export default {
  name: 'elliptic-orbit'
  , props: {
    viewWidth: Number
    , viewHeight: Number
    , playerLoading: Boolean
  }
  , components: {
    DaySim
    , EOTGraph
    , vueSlider
  }
  , data: () => ({
    deg
    , panelState: 'hide'

    , paused: false
    , yearAngleDrag: false

    , solarDaysPerYear: 10
    , day: 0
    , playRate: 0.1

    , showGrid: false
    , showEarthOrbits: true
    , showSunOrbits: false
    , cameraTarget: 'sun'
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
    daysPerYear( newVal, oldVal ){
      this.day = (this.day * Pi2 / oldVal) / this.radsPerYear
    }
  }
  , computed: {
    daysPerYear(){
      return this.solarDaysPerYear + 1
    }
    , radsPerYear(){
      return (Pi2 / this.daysPerYear)
    }
    , yearAngle(){
      return this.day * this.radsPerYear
    }
  }
  , methods: {
    draw(){
      let day = this.day
      if ( !this.paused ){
        day = day + this.playRate * this.daysPerYear / 100
      } else if ( this.yearAngleDrag ){
        let targetDay = (this.yearAngleDrag) / this.radsPerYear
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

      this.day = euclideanModulo(day, this.daysPerYear)
    }
    , dragStart(){
      this.prevPauseState = this.paused
      this.paused = true
    }
    , drag( amount ){
      this.yearAngleDrag = this.yearAngle + amount
    }
    , dragEnd(){
      this.yearAngleDrag = false
      this.paused = this.prevPauseState
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
  z-index: 2
  min-width: 320px
  max-width: 100%
  top: 0
  right: 0
  padding: 1rem
  background: transparentize($background, 0.4)
  border-radius: 0 0 0 3px
  border: 1px solid $background
  border-top-width: 0
  border-right-width: 0

  .level
    margin-bottom: 0

  .extra-fields
    padding-top: 1rem

  .slider
    margin-bottom: 0.5rem

  .checkbox:hover
    color: $text
</style>
