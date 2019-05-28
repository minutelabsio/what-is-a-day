<template lang="pug">
.chapter
  SimControls(
    :handsOff="handsOff"

    , :paused.sync="paused"
    , :playRate.sync="playRate"
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
import SimControls from '@/components/sim-controls'
import chapterMixin from '@/components/chapters/chapter.mixin'

export default {
  name: 'stellar-days'
  , mixins: [ chapterMixin ]
  , components: {
    DaySim
    , EOTGraph
    , SimControls
  }
  , data: () => ({
  })
  , methods: {
    initCopilot(){
      const solarDaysPerYear = 8

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
    }
  }
}
</script>

<style scoped lang="sass">
.chapter
  background: $background
  cursor: crosshair
  overflow: hidden

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
