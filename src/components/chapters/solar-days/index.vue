<template lang="pug">
.chapter
  .controls.scrollbars
    .level.is-mobile
      .level-left
        b-field(grouped)
          b-field
            .control
              b-checkbox-button.checkbox-btn-dark(v-model="paused", :disabled="!handsOff")
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
    , :showPM="showPM"

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
    .earth-labels(slot="earth-labels")
      transition(name="fade")
        .clock(v-if="showStellarClock")
          label Stellar Time
          .time {{siderealClock}}
      transition(name="fade")
        .clock(v-if="showSolarClock")
          label Solar Time
          .time {{solarClock}}
</template>

<script>
import Copilot from 'copilot'
import * as THREE from 'three'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import vueSlider from 'vue-slider-component'
import { PERHELION, VERNAL, euclideanModulo } from '@/lib/stellar-mechanics'

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

// input minutes
function clockFromMinutes( n ){
  let hours   = Math.floor(n / 60)
  let minutes = Math.floor(n - (hours * 60))
  let ampm = hours >= 12 ? 'pm' : 'am'
  if ( ampm === 'pm' ){ hours -= 12 }

  hours = (hours + 11) % 12 + 1

  if ( hours < 10 ) { hours = '0' + hours }
  if ( minutes < 10 ) { minutes = '0' + minutes }

  return `${hours}:${minutes}${ampm}`
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
    , siderealClock(){
      const minutesPerDay = 24 * 60
      let dayFrac = (this.day + 0.5) % 1
      let minutes = minutesPerDay * dayFrac
      return clockFromMinutes( minutes )
    }
    , solarClock(){
      const minutesPerDay = 24 * 60
      // perhelion should not matter for realistic days per year
      // but need this to correct for weird days per year
      let dayFrac = (this.day * (1 - 1/this.daysPerYear) + PERHELION/Pi2 + 0.5) % 1
      let minutes = minutesPerDay * dayFrac
      return clockFromMinutes( minutes )
    }
    , handsOff(){
      return this.player.paused || this.copilotState.handsOff
    }
    // copilot managed
    , ...meddleProps([
      'orbitalPosition'
      , 'eccentricity'
      , 'tiltAngle'
      , 'cameraTarget'
      , 'cameraFollow'
      , 'solarDaysPerYear'
      , 'showEarthOrbits'
      , 'showSunOrbits'
      , 'showEOTWedge'
      , 'showSun'
      , 'showMeanSun'
      , 'showSiderialDayArc'
      , 'showMeanDayArc'
      , 'showSolarDayArc'
      , 'showPM'

      , 'showStellarClock'
      , 'showSolarClock'
    ], { relaxDelay: 1000, relaxDuration: 1000, easing: meddleEasing })
  }
  , watch: {
    handsOff(){
      this.frames.freeze( false, true )
    }
  }
  , created(){
    this.queues = []

    const solarDaysPerYear = 8

    function solarDaysToOrbitalPos( days ){
      const dpy = solarDaysPerYear + 1
      return (days - PERHELION/Pi2) / (dpy - 1)
    }

    // copilot
    let frames = this.frames = Copilot({
      handsOff: {
        type: Boolean
        , default: false
        , interpolatorOpts: { threshold: 0 }
      }
      , orbitalPosition: {
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
      , showSun: true
      , showMeanSun: false
      , showSiderialDayArc: true
      , showMeanDayArc: false
      , showSolarDayArc: false
      , showPM: true

      , showStellarClock: false
      , showSolarClock: false

      , cameraFollow: {
        type: Boolean
        , default: false
        , interpolatorOpts: { threshold: 0 }
      }
      , cameraPosition: {
        type: 'Vector3'
        , default: new THREE.Vector3(0, 20, 30)
      }
      , cameraRotation: {
        type: 'Vector3'
        , default: new THREE.Vector3(0, 0, 0)
      }
      , cameraZoom: 40
    }, {
      defaultTransitionDuration: '3s'
    })

    frames.add({
      solarDaysPerYear
      , orbitalPosition: -0.5
    }, {
      time: 0
      , duration: 1
    })

    frames.add({
      showSolarDayArc: true
    }, {
      time: '00:10'
      , duration: 1
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(0)
    }, {
      time: '00:20'
      , startTime: '00:00'
    })

    frames.add({
      cameraZoom: 80
      , cameraPosition: new THREE.Vector3(0, 20, 0)
    }, {
      time: '00:22'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showSolarClock: true
    }, {
      time: '00:23'
    })

    frames.add({
      orbitalPosition: 0.11111
    }, {
      time: '00:30'
      , startTime: '00:27'
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(1)
    }, {
      time: '00:46'
      , startTime: '00:44'
    })

    this.setQueue('00:52', () => {
      this.paused = false
    })

    frames.add({
      cameraZoom: 20
      , cameraPosition: new THREE.Vector3(0, 20, 0)
      , showEarthOrbits: true
      , showSolarClock: false
      , showMeanSun: true
      , showMeanDayArc: true
    }, {
      time: '01:15'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(solarDaysPerYear)
    }, {
      time: '01:40'
      , startTime: '01:12'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(0, 20, 30)
    }, {
      time: '01:43'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      eccentricity: 0.3
    }, {
      time: '01:45'
      , duration: '1s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      eccentricity: 0
    }, {
      time: '02:02'
      , duration: '2s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      eccentricity: 0.3
    }, {
      time: '02:04'
      , duration: '2s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(2.75 * solarDaysPerYear)
    }, {
      time: '02:55'
      , startTime: '01:45'
    })

    frames.add({
      showEOTWedge: true
    }, {
      time: '03:02'
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(3.25 * solarDaysPerYear)
    }, {
      time: '03:24'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(4 * solarDaysPerYear)
    }, {
      time: '04:00'
      , startTime: '03:29'
    })

    this.setQueue('03:34', () => {
      this.graphOpen = true
      this.controlsOpen = false
    })

    frames.add({
      eccentricity: 0
    }, {
      time: '04:01'
      , duration: '2s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    this.setQueue('04:00', () => {
      this.paused = true
      this.graphOpen = false
      this.controlsOpen = false
    })

    frames.add({
      tiltAngle: 40
    }, {
      time: '04:04'
      , duration: '2s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(5 * solarDaysPerYear)
    }, {
      time: '04:40'
      , startTime: '04:02'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(25, 30, 0)
      , cameraZoom: 80
      , cameraFollow: true
    }, {
      time: '04:41'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(5 * solarDaysPerYear + 1.1)
    }, {
      time: '04:55'
      , startTime: '04:45'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(0.1, 30, 0)
      , cameraZoom: 20
      , cameraFollow: false
    }, {
      time: '05:00'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showEarthOrbits: false
      , showSunOrbits: true
    }, {
      time: '05:09'
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(7 * solarDaysPerYear)
    }, {
      time: '06:05'
      , startTime: '05:09'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(30, 30, 0)
      , cameraFollow: true
    }, {
      time: '05:40'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(7 * solarDaysPerYear) + VERNAL / Pi2
    }, {
      time: '06:30'
      , startTime: '06:25'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(7 * solarDaysPerYear + 2.89)
    }, {
      time: '06:40'
      , startTime: '06:33'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(10, 30, 0)
      , cameraZoom: 40
    }, {
      time: '06:43'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(7 * solarDaysPerYear + 3)
    }, {
      time: '06:48'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(30, 30, 0)
      , cameraZoom: 20
    }, {
      time: '06:54'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(7.45 * solarDaysPerYear)
    }, {
      time: '06:56'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(7.55 * solarDaysPerYear)
    }, {
      time: '07:04'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(7.98 * solarDaysPerYear)
    }, {
      time: '07:30'
      , startTime: '07:12'
    })

    // last frame
    frames.add({
      handsOff: true
      , cameraFollow: false
    }, {
      time: '07:50'
      , startTime: '07:37'
    })

    this.setQueue('07:37', () => {
      this.paused = false
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
      this.execQueues( time )
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
      if ( this.handsOff && !this.paused ){

        orbitalPosition = orbitalPosition + this.playRate / 100
        orbitalPosition = euclideanModulo(orbitalPosition, 1)
        // ensure that the shortest path is taken to get to target
        let playerPosition = this.frames.getStateAt( this.frames.time ).orbitalPosition
        orbitalPosition = playerPosition + shortestDistance( playerPosition, orbitalPosition, 1 )
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { relaxDelay: 0, relaxDuration: 1, easing: Copilot.Easing.Quadratic.InOut } }

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
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { freeze: this.handsOff, relaxDelay: 1000, relaxDuration: 1000, easing: meddleEasing } }
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

      this.frames.meddle('camera', state, { relaxDelay: 1000, relaxDuration: 1000, freeze: this.handsOff || this.cameraDragging, easing: Copilot.Easing.Cubic.InOut })
    }
    , setQueue(ts, fn){
      let time = Copilot.Parsers.timeParser( ts )

      this.queues.push({
        time
        , fn
      })
    }
    , execQueues( time ){
      let lastTime = this.lastQueueTime || 0

      this.lastQueueTime = time

      if ( lastTime >= time ){
        return
      }

      this.queues.forEach( q => {
        if ( time < q.time || q.time <= lastTime ){ return }

        q.fn()
      })
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

.clock
  font-family: $family-monospace
  text-align: center

.fade-enter-active,
.fade-leave-active
  transition: opacity 0.3s ease
.fade-enter,
.fade-leave-to
  opacity: 0
</style>
