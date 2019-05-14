<template lang="pug">
.chapter
  b-modal(:active.sync="showEarthOptionsModal", scroll="keep")
    .modal-options
      .columns
        .column
          label Days per Year: {{ solarDaysPerYear }}
          vue-slider.slider(
            v-model="solarDaysPerYear"
            , tooltip-dir="left"
            , tooltip="none"
            , :max="365"
            , :min="0"
            , :interval="1"
            , :formatter="tooltipPrecisionFormatter(0)"
            , :speed="0"
          )

        //-   label Eccentricity: {{ eccentricity }}
        //-   vue-slider.slider(
        //-     v-model="eccentricity"
        //-     , tooltip-dir="left"
        //-     , tooltip="none"
        //-     , :max="0.5"
        //-     , :interval="0.01"
        //-     , :formatter="tooltipPrecisionFormatter(2)"
        //-     , :speed="0"
        //-   )
        //-
        //-   label Axial Tilt: {{ tiltAngle }}&deg;
        //-   vue-slider.slider(
        //-     v-model="tiltAngle"
        //-     , tooltip-dir="left"
        //-     , tooltip="none"
        //-     , :max="90"
        //-     , :interval="1"
        //-     , :formatter="tooltipPrecisionFormatter(0)"
        //-     , :speed="0"
        //-   )
        //-
        //-   br/
        //-
        //-   b-field(grouped)
        //-     b-checkbox(v-model="showGrid")
        //-       span Grid
        //-     b-checkbox(v-model="showEarthOrbits")
        //-       span Earth Orbits
        //-     b-checkbox(v-model="showSunOrbits")
        //-       span Solar Orbits
        //-
        //-   b-field(grouped)
        //-     b-checkbox(v-model="showSun")
        //-       span Sun
        //-     b-checkbox(v-model="showMeanSun")
        //-       span Mean Sun
        //-     b-checkbox(v-model="showEOTWedge")
        //-       span EOT Wedge
        //-
        //- .column.is-two-fifths.mini-graph
        //-   EOTGraph(:eccentricity="eccentricity", :tilt="tiltAngle * deg", :mean-anomaly="meanAnomaly")

  .controls.scrollbars
    .columns
      .column
        b-field(grouped)
          b-field
            .control
              b-checkbox-button.checkbox-btn-dark(v-model="paused", :disabled="!handsOff")
                b-icon.icon-only(:icon="paused ? 'orbit' : 'cancel'")

            .control
              b-dropdown(:mobile-modal="false", :hoverable="true")
                .button.btn-dark(slot="trigger")
                  b-icon(icon="clock-fast")

                b-dropdown-item(custom)
                  label Orbit Speed
                  vue-slider.slider(
                    v-model="playRate"
                    , tooltip-dir="left"
                    , tooltip="none"
                    , :max="1"
                    , :min="0.01"
                    , :interval="0.01"
                  )

          b-field
            //- .control
            //-   .button.btn-dark(@click="graphOpen = !graphOpen", :class="{ 'is-primary': graphOpen }")
            //-     b-icon.icon-only(icon="chart-bell-curve")

            .control
              .button.btn-dark(@click="showEarthOptionsModal = !showEarthOptionsModal")
                b-icon.icon-only(icon="settings")

      .column
        b-field(grouped)
          b-select(v-model="cameraTarget", icon="camera-control")
            option(value="earth") Focus Earth
            option(value="sun") Focus Sun
            option(value="meanSun") Focus Mean Sun
          b-switch(v-model="cameraFollow")
            | Follow Orbit

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

    , :enableDragging="enableDragging"
    , @dragstart="dragStart"
    , @drag="drag"
    , @dragend="dragEnd"
    , @camera:start="cameraDragging = true"
    , @camera:end="cameraDragging = false; meddleCamera()"
    , @camera:change="meddleCamera"
  )
    .earth-label(slot="earth-label")
      .tools
        .icon-btn(@click="showEarthOptionsModal = true")
          b-icon(icon="settings")
      transition(name="fade")
        label.angle-label(v-if="showDegrees") {{dayAngle.toFixed(0)}}
          span.degrees &deg;
    .stellar-label(slot="stellar-label")
      transition(name="fade")
        .clock(v-if="showStellarClock")
          .time {{siderealClock}}
    .solar-label(slot="solar-label")
      transition(name="fade")
        .clock(v-if="showSolarClock")
          label Solar Time
          .time {{meanClock}}
</template>

<script>
import Copilot from 'copilot'
import * as THREE from 'three'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import vueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
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
  name: 'stellar-days'
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
    , showEarthOptionsModal: false

    , cameraDragging: false
    , tooltipPrecisionFormatter
    , controlsOpen: false
    , graphOpen: false

    , paused: true
    , yearAngleDrag: false

    , playRate: 0.1

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
    , dayAngle(){
      return (this.day * 360) % 360
    }
    , siderealClock(){
      const minutesPerDay = 24 * 60
      let dayFrac = (this.day + 0.5) % 1
      let minutes = minutesPerDay * dayFrac
      return clockFromMinutes( minutes )
    }
    , meanClock(){
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
    , enableDragging(){
      return this.showSun || this.showEarthOrbits
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
      , 'showGrid'

      , 'showStellarClock'
      , 'showSolarClock'
      , 'showDegrees'
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
        , default: 0 // {0, 1}
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
      , cameraFollow: false
      , showEarthOrbits: true
      , showSunOrbits: false
      , showEOTWedge: false
      , showSun: true
      , showMeanSun: false
      , showSiderialDayArc: true
      , showMeanDayArc: false
      , showSolarDayArc: false
      , showPM: true
      , showGrid: false

      , showStellarClock: true
      , showSolarClock: false
      , showDegrees: true

      , cameraPosition: {
        type: 'Vector3'
        , default: new THREE.Vector3(-5, 20, 30)
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
      , orbitalPosition: 0
      , showPM: false
      , showSiderialDayArc: false
      , showSun: false
      , showEarthOrbits: false
      , showDegrees: false
      , showStellarClock: false
      , cameraZoom: 80
    }, {
      time: 1
      , duration: 1
    })

    frames.add({
      orbitalPosition: 0.135
    }, {
      time: '8s'
      , duration: '100%'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(-5, 50, 30)
    }, {
      time: '8s'
      , duration: '1s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showPM: true
    }, {
      time: '8s'
      , duration: '1s'
    })

    frames.add({
      cameraPosition: new THREE.Vector3(-5, -50, 30)
    }, {
      time: '13s'
      , duration: '5s'
      , easing: Copilot.Easing.Sinusoidal.InOut
    })

    frames.add({
      orbitalPosition: 2 / (solarDaysPerYear + 1)
      , cameraPosition: new THREE.Vector3(0, 20, 0)
    }, {
      time: '14s'
      , duration: '1s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showSiderialDayArc: true
      , showDegrees: true
    }, {
      time: '15s'
      , duration: '1s'
    })

    frames.add({
      orbitalPosition: 3 / (solarDaysPerYear + 1)
    }, {
      time: '19s'
      , startTime: '15s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showStellarClock: true
    }, {
      time: '20s'
    })

    frames.add({
      orbitalPosition: 8 / (solarDaysPerYear + 1)
    }, {
      time: '38s'
      , startTime: '19s'
    })

    frames.add({
      cameraZoom: 20
      , showSun: true
      , showEarthOrbits: true
    }, {
      time: '56s'
      , duration: '1s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      orbitalPosition: 1
    }, {
      time: '01:00'
      , startTime: '56s'
    })

    frames.add({
      orbitalPosition: 1.5
    }, {
      startTime: '01:11'
      , time: '01:16'
    })

    frames.add({
      cameraZoom: 40
    }, {
      time: '01:16'
      , duration: '1s'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      cameraPosition: new THREE.Vector3(-5, 20, 30)
    }, {
      time: '01:29'
      , duration: '1s'
      , easing: Copilot.Easing.Sinusoidal.InOut
    })

    // last frame
    frames.add({
      handsOff: true
    }, {
      time: '03:06'
      , startTime: '01:29'
    })

    this.setQueue('01:29', () => {
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
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { freeze: this.handsOff, relaxDelay: 0, relaxDuration: 1, easing: Copilot.Easing.Quadratic.InOut } }

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

.modal-options
  padding: 1em

  .mini-graph
    max-width: 400px

.tools
  position: absolute
  z-index: 1
  left: 3em
  bottom: -1em
  pointer-events: all

  .icon-btn
    cursor: pointer
    transition: color 0.15s ease
    color: $red
    &:hover,
    &:active
      color: lighten($red, 10)

.controls
  position: absolute
  z-index: 15
  max-height: 100%
  width: 100%
  top: 0
  right: 0
  padding: 0.75rem
  background: transparentize($background, 0.4)
  border-radius: 0 0 0 3px
  border: 1px solid $background
  border-top-width: 0
  border-right-width: 0

  .eot-graph
    position: absolute
    right: 0
    margin-top: 0.75em
    max-width: 480px
    background: transparentize($background, 0.2)

  .field
    margin: 0

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

.earth-label,
.stellar-label,
.solar-label
  text-shadow: 0 0 5px rgba(0, 0, 0, 1)
  font-family: $family-monospace
.earth-label
  position: relative
  bottom: 1em
.stellar-label
  color: $blue
.clock
  position: absolute
  margin-top: -1rem
  right: 0
  font-family: $family-monospace
  text-align: center
.angle-label
  display: inline-block
  width: 2.5em
  text-align: center
.degrees
  letter-spacing: -1em

.fade-enter-active,
.fade-leave-active
  transition: opacity 0.3s ease
.fade-enter,
.fade-leave-to
  opacity: 0
</style>
