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
import chapterMixin from '@/components/chapters/chapter.mixin'
import { PERHELION } from '@/lib/stellar-mechanics'

const Pi2 = Math.PI * 2

export default {
  name: 'solar-days'
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
