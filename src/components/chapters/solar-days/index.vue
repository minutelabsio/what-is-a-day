<template lang="pug">
.chapter
  SimControls(
    :handsOff="handsOff"

    , :paused.sync="paused"
    , :playRate.sync="playRate"
    , :graphOpen.sync="graphOpen"
    , :cameraTarget.sync="cameraTarget"
    , :cameraFollow.sync="cameraFollow"
    , :solarDaysPerYear.sync="solarDaysPerYear"

    , :useStellarDays="true"
  )

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
    .stellar-label(slot="stellar-label", :class="{ up: (orbitalPosition % 1) < 0.5, down: (orbitalPosition % 1) >= 0.5 }")
      transition(name="fade")
        .clock(v-if="showStellarClock")
          .time {{siderealClock}}
    .solar-label(slot="solar-label", :class="{ down: (orbitalPosition % 1) < 0.5, up: (orbitalPosition % 1) >= 0.5 }")
      transition(name="fade")
        .clock(v-if="showSolarClock")
          .time {{meanClock}}
</template>

<script>
import Copilot from 'copilot'
import * as THREE from 'three'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import SimControls from '@/components/sim-controls'
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
  name: 'solar-days'
  , inject: [ 'player' ]
  , props: {
    viewWidth: Number
    , viewHeight: Number
    , playerLoading: Boolean
  }
  , components: {
    DaySim
    , EOTGraph
    , SimControls
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
      , showSolarDayArc: true
      , showPM: true
      , showGrid: false

      , showStellarClock: true
      , showSolarClock: true
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
      , orbitalPosition: solarDaysToOrbitalPos(5)
      , showDegrees: false
    }, {
      time: 1
      , duration: 1
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(8)
    }, {
      time: '00:20'
      , startTime: 1
    })

    frames.add({
      cameraZoom: 80
      , cameraPosition: new THREE.Vector3(0, 20, 0.1)
    }, {
      time: '00:22'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      showDegrees: true
    }, {
      time: '00:23'
    })

    frames.add({
      orbitalPosition: 1 / (solarDaysPerYear + 1)
    }, {
      time: '00:30'
      , startTime: '00:27'
    })

    frames.add({
      orbitalPosition: 2 / (solarDaysPerYear + 1)
      , cameraZoom: 60
    }, {
      time: '00:40'
      , startTime: '00:36'
    })

    frames.add({
      orbitalPosition: solarDaysToOrbitalPos(2)
    }, {
      time: '00:46'
      , startTime: '00:44'
    })

    frames.add({
      cameraZoom: 20
      , cameraPosition: new THREE.Vector3(0, 20, 0.1)
      , showEarthOrbits: true
      , showSolarClock: false
      , showMeanSun: true
      , showMeanDayArc: true
    }, {
      time: '01:15'
      , easing: Copilot.Easing.Quadratic.InOut
    })

    frames.add({
      cameraPosition: new THREE.Vector3(0, 20, 10)
      , cameraZoom: 40
    }, {
      time: '00:52'
      , startTime: '00:50'
    })

    // last frame
    frames.add({
      handsOff: true
    }, {
      time: '01:10'
      , startTime: '00:52'
    })

    this.setQueue('00:52', () => {
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

    const stopOrbitOnPlay = () => { this.paused = true }
    this.player.$on('play', stopOrbitOnPlay)
    this.$on('hook:beforeDestroy', () => {
      this.player.$off('play', stopOrbitOnPlay)
    })
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
  text-shadow: 0 0 3px rgba(0, 0, 0, 1)
  font-family: $family-monospace

  transition: bottom 0.3s ease
  &.up
    position: relative
    bottom: 0.75em
  &.down
    position: relative
    bottom: -0.75em
.earth-label
  position: relative
  bottom: 1em
.stellar-label
  color: $blue
.solar-label
  color: $yellow
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
