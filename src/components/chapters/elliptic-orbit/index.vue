<template lang="pug">
.chapter
  .controls
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

      label Days per Year
      vue-slider.slider(
        v-model="solarDaysPerYear"
        , tooltip-dir="left"
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

      label Eccentricity
      vue-slider.slider(
        v-model="eccentricity"
        , tooltip-dir="left"
        , :max="0.5"
        , :interval="0.01"
        , :formatter="tooltipPrecisionFormatter(2)"
        , :speed="0"
      )

      label Axial Tilt
      vue-slider.slider(
        v-model="tiltAngle"
        , tooltip-dir="left"
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

    , :tiltAngle="tiltAngle * deg"
    , :eccentricity="eccentricity"
    , :days="day"
    , :daysPerYear="daysPerYear"
    , @dragstart="dragStart"
    , @drag="drag"
    , @dragend="dragEnd"
    , @camera:change="meddleCamera"
  )
</template>

<script>
import Copilot from 'copilot'
import * as THREE from 'three'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import vueSlider from 'vue-slider-component'
import { PERHELION } from '@/lib/stellar-mechanics'

const Pi2 = Math.PI * 2
const deg = Math.PI / 180

function euclideanModulo( n, m ) {
	return ( ( n % m ) + m ) % m
}

Copilot.registerType({
  type: 'Vector3'
  , default: new THREE.Vector3()
  , interpolator: (from, to, t) => {
    let v = new THREE.Vector3()
    v.copy( from )
    return v.lerp( to, t )
  }
})

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
    , tooltipPrecisionFormatter
    , controlsOpen: true
    , graphOpen: true

    , paused: false
    , yearAngleDrag: false

    , playRate: 0.1

    , showGrid: false
    , showEarthOrbits: true
    , showSunOrbits: false
    , cameraTarget: 'sun'
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
      , 'solarDaysPerYear'
    ], { relaxDelay: 1000, relaxDuration: 1000, easing: meddleEasing })
  }
  , created(){
    const solarDaysPerYear = 10

    // copilot
    let frames = this.frames = Copilot({
      orbitalPosition: 0 // {0, 1}
      , solarDaysPerYear: solarDaysPerYear
      , tiltAngle: 23.4
      , eccentricity: 0.3

      , cameraPosition: {
        type: 'Vector3'
        , default: new THREE.Vector3(0, 30, 30)
      }
      , cameraRotation: {
        type: 'Vector3'
        , default: new THREE.Vector3(0, 0, 0)
      }
      , cameraZoom: 30
    }, {
      defaultTransitionDuration: '3s'
    })

    frames.add({
      orbitalPosition: 1
    }, {
      time: '10s'
      , duration: '10s'
    })

    // last frame
    frames.add({
      ...this.frames._defaultState
    }, {
      time: '02:23'
      , duration: '1s'
    })

    this.setState({ ...this.frames._defaultState })

    let smoother = Copilot.Animation.Smoothener( frames, { duration: 0 } )

    const onFrameUpdate = () => {
      var state = frames.state

      smoother.setState( state )
    }

    const onFrame = () => {

      this.beforeFrame()
      let state = frames.state //smoother.update()

      this.onFrame( state )
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

    // end copilot

    // let stop = false
    // const draw = () => {
    //   if ( stop ) { return }
    //   requestAnimationFrame( draw )
    //
    //   this.draw()
    // }
    //
    // this.$on('hook:beforeDestroy', () => {
    //   stop = true
    // })
    //
    // if ( !this.playerLoading ){
    //   draw()
    // } else {
    //   let unwatch = this.$watch('playerLoading', () => {
    //     unwatch()
    //     draw()
    //   })
    // }
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
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { relaxDelay: 0, relaxDuration: 200, freeze: this.dragging, easing: Copilot.Easing.Quadratic.InOut } }

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
    , onFrame( state ){
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
      // let keys = Object.keys( state )
      // for ( let key of keys ){
      //   if ( key in this ){
      //     this[key] = state[key]
      //   }
      // }
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
      this.frames.meddle({
        cameraPosition: params.position.clone()
        // , cameraRotation: params.rotation.clone()
        , cameraZoom: params.zoom
      }, { easing: meddleEasing })
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

  .extra-fields + .eot-graph
    margin-top: 2rem

  .slider
    margin-bottom: 0.5rem

  .checkbox:hover
    color: $text
</style>
