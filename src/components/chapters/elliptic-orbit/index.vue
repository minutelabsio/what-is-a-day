<template lang="pug">
.chapter
  .controls.scrollbars
    .level.is-mobile
      .level-left
        b-field(grouped)
          b-field
            .control
              b-checkbox-button.checkbox-btn-dark(v-model="paused", :disabled="!player.paused")
                b-icon.icon-only(:icon="paused ? 'play' : 'pause'")
          b-field
            .control
              .button.btn-dark(@click="graphOpen = !graphOpen", :class="{ 'is-primary': graphOpen }")
                b-icon.icon-only(icon="chart-bell-curve")
            .control
              .button.btn-dark(@click="controlsOpen = !controlsOpen", :class="{ 'is-primary': controlsOpen }")
                b-icon.icon-only(icon="tune")

    .extra-fields(v-if="controlsOpen")
      label Animation Speed
      vue-slider.slider(
        v-model="playRate"
        , tooltip-dir="left"
        , :tooltip="false"
        , :max="1"
        , :min="0.01"
        , :interval="0.01"
        , :disabled="!player.paused"
      )

      label Days per Year: {{ solarDaysPerYear }}
      vue-slider.slider(
        v-model="solarDaysPerYear"
        , tooltip-dir="left"
        , :tooltip="false"
        , :max="365"
        , :min="0"
        , :interval="1"
        , :formatter="tooltipPrecisionFormatter(0)"
        , :speed="0"
      )

      b-field(grouped)
        b-select(v-model="cameraTarget")
          option(value="earth") Focus Earth
          option(value="sun") Focus Sun
          option(value="meanSun") Focus Mean Sun
        b-switch(v-model="cameraFollow")
          | Follow Orbit

      label Eccentricity: {{ eccentricity }}
      vue-slider.slider(
        v-model="eccentricity"
        , tooltip-dir="left"
        , :tooltip="false"
        , :max="0.5"
        , :interval="0.01"
        , :formatter="tooltipPrecisionFormatter(2)"
        , :speed="0"
      )

      label Axial Tilt: {{ tiltAngle }}&deg;
      vue-slider.slider(
        v-model="tiltAngle"
        , tooltip-dir="left"
        , :tooltip="false"
        , :max="90"
        , :interval="1"
        , :formatter="tooltipPrecisionFormatter(0)"
        , :speed="0"
      )

      br/

      b-field(grouped)
        b-checkbox(v-model="showGrid")
          span Grid
        b-checkbox(v-model="showEarthOrbits")
          span Earth Orbits
        b-checkbox(v-model="showSunOrbits")
          span Solar Orbits

      b-field(grouped)
        b-checkbox(v-model="showSun")
          span Sun
        b-checkbox(v-model="showMeanSun")
          span Mean Sun
        b-checkbox(v-model="showEOTWedge")
          span EOT Wedge

    .eot-graph(v-if="graphOpen")
      EOTGraph(:eccentricity="eccentricity", :tilt="tiltAngle * deg", :mean-anomaly="meanAnomaly")

  DaySim(
    ref="sim"
    , :viewWidth="viewWidth"
    , :viewHeight="viewHeight"
    , :playerLoading="playerLoading"
    , :showGrid="showGrid"
    , :cameraTarget="cameraTarget"
    , :cameraFollow="cameraFollow"
    , :showEarthOrbits="showEarthOrbits"
    , :showSunOrbits="showSunOrbits"
    , :showEOTWedge="showEOTWedge"
    , :showSun="showSun"
    , :showMeanSun="showMeanSun"
    , :showSiderialDayArc="showSiderialDayArc"
    , :showMeanDayArc="showMeanDayArc"
    , :showSolarDayArc="showSolarDayArc"

    , :tiltAngle="tiltAngle * deg"
    , :eccentricity="eccentricity"
    , :days="day"
    , :daysPerYear="daysPerYear"
    , @dragstart="dragStart"
    , @drag="drag"
    , @dragend="dragEnd"
    , @camera:start="cameraDragging = true"
    , @camera:end="cameraDragging = false; meddleCamera()"
    , @camera:change="meddleCamera"
  )
    .blank(slot="earth-labels")
</template>

<script>
import Copilot from 'copilot'
import * as THREE from 'three'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import vueSlider from 'vue-slider-component'
import { PERHELION, euclideanModulo } from '@/lib/stellar-mechanics'

const Pi2 = Math.PI * 2
const deg = Math.PI / 180

function shortestDistance( a0, a1, modulo ){
  let moduloBy2 = 0.5 * modulo
  let da = (a1 - a0) % modulo

  return (da - moduloBy2) % modulo + moduloBy2
}

function meddleProps( props = [], meddleOptions = {} ){
  return props.reduce(( result, key ) => {
    result[key] = {
      get: function(){
        return this.copilotState[key]
      }
      , set: function( val ){
        if ( val === this.copilotState[key] ){ return }
        let opts = meddleOptions
        if ( val.$meddleOptions ){
          opts = val.$meddleOptions
          val = val.$value
        }
        this.frames.meddle({ [key]: val }, opts)
      }
    }
    return result
  }, {})
}

function tooltipPrecisionFormatter( p ){
  return function( v ){
    return v && v.toFixed(p)
  }
}

const meddleEasing = Copilot.Easing.Elastic.Out

export default {
  name: 'elliptic-orbit'
  , inject: [ 'player' ]
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
    , cameraDragging: false
    , tooltipPrecisionFormatter
    , controlsOpen: false
    , graphOpen: false

    , paused: true
    , yearAngleDrag: false

    , playRate: 0.1

    , showGrid: false
    , cameraFollow: false

    , copilotState: {}
  })
  , computed: {
    daysPerYear(){
      return this.solarDaysPerYear + 1
    }
    , radsPerYear(){
      return (Pi2 / this.daysPerYear)
    }
    , meanAnomaly(){
      return this.day * this.radsPerYear - PERHELION
    }
    , day(){
      return this.orbitalPosition * this.daysPerYear
    }
    // copilot managed
    , ...meddleProps([
      'orbitalPosition'
      , 'eccentricity'
      , 'tiltAngle'
      , 'cameraTarget'
      , 'solarDaysPerYear'
      , 'showEarthOrbits'
      , 'showSunOrbits'
      , 'showEOTWedge'
      , 'showSun'
      , 'showMeanSun'
      , 'showSiderialDayArc'
      , 'showMeanDayArc'
      , 'showSolarDayArc'
    ], { relaxDelay: 1000, relaxDuration: 1000, easing: meddleEasing })
  }
  , created(){
    const solarDaysPerYear = 10

    // copilot
    let frames = this.frames = Copilot({
      orbitalPosition: {
        type: Number
        , default: 0.5 // {0, 1}
        , interpolatorOpts: { modulo: 1 }
      }
      , solarDaysPerYear: solarDaysPerYear
      , tiltAngle: 0
      , eccentricity: 0
      , cameraTarget: {
        type: String
        , default: 'earth'
        , interpolator: Copilot.Interpolators.Step
        , interpolatorOpts: { threshold: 0 }
      }
      , showEarthOrbits: false
      , showSunOrbits: false
      , showEOTWedge: false
      , showSun: false
      , showMeanSun: false
      , showSiderialDayArc: false
      , showMeanDayArc: false
      , showSolarDayArc: false

      , cameraPosition: {
        type: 'Vector3'
        , default: new THREE.Vector3(-5, 20, 30)
      }
      , cameraRotation: {
        type: 'Vector3'
        , default: new THREE.Vector3(0, 0, 0)
      }
      , cameraZoom: 80
    }, {
      defaultTransitionDuration: '3s'
    })

    frames.add({
      solarDaysPerYear: 9
      , orbitalPosition: 0.4
    }, {
      time: 0
      , duration: 1
    })

    frames.add({
      showSiderialDayArc: true
    }, {
      time: '6.5s'
      , duration: 100
    })

    frames.add({
      orbitalPosition: 0.6
    }, {
      time: '12s'
      , duration: '12s'
    })

    frames.add({
      cameraZoom: 30
      , showSun: true
    }, {
      time: '14s'
      , duration: '1s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: 1.4423
    }, {
      time: '32s'
      , duration: '20s'
    })

    frames.add({
      showSolarDayArc: true
      , cameraPosition: new THREE.Vector3(0, 30, 1)
    }, {
      time: '25s'
      , duration: '1s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showSiderialDayArc: false
    }, {
      time: '31s'
      , duration: 100
    })

    frames.add({
      orbitalPosition: 1.554
    }, {
      time: '37s'
      , duration: '3s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showSiderialDayArc: true
      , showSolarDayArc: false
    }, {
      time: '39s'
      , duration: 100
    })

    frames.add({
      orbitalPosition: 1.6
    }, {
      time: '42s'
      , duration: '3s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: 1.699
    }, {
      time: '47s'
      , duration: '3s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showSiderialDayArc: true
      , showSolarDayArc: true
    }, {
      time: '49s'
      , duration: 100
    })

    // last frame
    frames.add({
      orbitalPosition: 3
    }, {
      time: '01:25'
      , duration: '36s'
    })

    this.setState({ ...this.frames._defaultState })

    let smoother = Copilot.Animation.Smoothener( frames, { duration: 80 } )

    const onFrameUpdate = () => {
      var state = frames.state

      smoother.setState( state )
    }

    let lastTime = 0
    const onFrame = ( now ) => {

      this.beforeFrame()
      let state = frames.state //smoother.update()

      let dt = lastTime ? 1000/60 : lastTime - now
      lastTime = now
      this.onFrame( state, dt )
    }

    const unwatch = this.player.$watch('time', ( time ) => {
      frames.seek( time )
    })

    frames.on('update', onFrameUpdate)

    this.$on('hook:mounted', () => {
      this.player.$on('frame', onFrame)
    })

    this.$on('hook:beforeDestroy', () => {
      unwatch()
      frames.off()
      this.player.$off('frame', onFrame)
    })

    // end copilot
  }
  , mounted(){

  }
  , methods: {
    beforeFrame(){
      let orbitalPosition = this.orbitalPosition
      if ( this.player.paused && !this.paused ){

        orbitalPosition = orbitalPosition + this.playRate / 100
        orbitalPosition = euclideanModulo(orbitalPosition, 1)
        // ensure that the shortest path is taken to get to target
        let playerPosition = this.frames.getStateAt( this.frames.time ).orbitalPosition
        orbitalPosition = playerPosition + shortestDistance( playerPosition, orbitalPosition, 1 )
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { relaxDelay: 0, relaxDuration: 1, freeze: this.dragging, easing: Copilot.Easing.Quadratic.InOut } }

      } else if ( this.paused && this.yearAngleDrag ){

        let targetPosition = (this.yearAngleDrag) / Pi2
        let halfYear = 0.5
        let delta = (targetPosition - orbitalPosition)
        if ( Math.abs(delta) > halfYear ){
          if ( delta > 0 ){
            delta -= 1
          } else {
            delta += 1
          }
        }
        orbitalPosition = orbitalPosition + delta * 0.05
        orbitalPosition = euclideanModulo(orbitalPosition, this.daysPerYear)
        let playerPosition = this.frames.getStateAt( this.frames.time ).orbitalPosition
        orbitalPosition = playerPosition + shortestDistance( playerPosition, orbitalPosition, 1 )
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { relaxDelay: 1000, relaxDuration: 1000, easing: meddleEasing } }
      }
    }
    , onFrame( state, dt ){
      this.setState( state )
    }
    , setState( state ){
      // camera
      if ( this.$refs.sim ){
        this.$refs.sim.setCameraProperties({
          position: state.cameraPosition
          // , rotation: state.cameraRotation
          , zoom: state.cameraZoom
        })
      }

      // component data
      this.copilotState = state
    }
    , dragStart(){
      this.dragging = true
      this.prevPauseState = this.paused
      this.paused = true
    }
    , drag( amount ){
      this.yearAngleDrag = this.meanAnomaly + amount
    }
    , dragEnd(){
      this.dragging = false
      this.yearAngleDrag = false
      this.paused = this.prevPauseState
    }
    , meddleCamera(params){
      let state = {}
      if ( params ){
        state.cameraPosition = params.position.clone()
        // state.cameraRotation = params.rotation.clone()
        state.cameraZoom = params.zoom
      }

      this.frames.meddle('camera', state, { relaxDelay: 1000, relaxDuration: 1000, freeze: this.cameraDragging, easing: Copilot.Easing.Cubic.InOut })
    }
  }
}
</script>

<style scoped lang="sass">
.chapter
  background: $background
  cursor: crosshair
  overflow: hidden

.controls
  position: absolute
  z-index: 2
  max-width: 480px
  max-height: 100%
  overflow: visible auto
  width: 100%
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

  .extra-fields + .eot-graph
    margin-top: 2rem

  .slider
    margin-bottom: 0.5rem

  .checkbox:hover
    color: $text
</style>
