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
    , :tiltAngle.sync="tiltAngle"

    , :showGrid.sync="showGrid"
    , :showEarthOrbits.sync="showEarthOrbits"
    , :showSunOrbits.sync="showSunOrbits"

    , :showSun.sync="showSun"
    , :showMeanSun.sync="showMeanSun"
    , :showEOTWedge.sync="showEOTWedge"
  )
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
    , :showMonthLabels="showMeanSun"
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
    .mean-label(slot="mean-label", :class="{ down: solarLabelAbove, up: !solarLabelAbove }")
      transition(name="fade")
        .clock(v-if="showMeanClock")
          .time {{meanClock}}
    .solar-label(slot="solar-label", :class="{ up: solarLabelAbove, down: !solarLabelAbove }")
      transition(name="fade")
        .clock(v-if="showSolarClock")
          .time {{solarClock}}
</template>

<script>
import Copilot from 'copilot'
import * as THREE from 'three'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import SimControls from '@/components/sim-controls'
import chapterMixin from '@/components/chapters/chapter.mixin'
import { PERHELION, VERNAL, calcEOT } from '@/lib/stellar-mechanics'

const Pi2 = Math.PI * 2
const deg = Math.PI / 180

export default {
  name: 'elliptic-orbit'
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

      function solarDaysToOrbitalPos( days, e = 0, y = 0 ){
        const dpy = solarDaysPerYear + 1
        let eot = 0
        if ( e || y ){
          eot = calcEOT( days/solarDaysPerYear * Pi2 - PERHELION, e, y, PERHELION - VERNAL )
        }
        return (days - PERHELION/Pi2 - eot/Pi2) / (dpy - 1)
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
        , showMeanSun: true
        , showMonthLabels: true
        , showSiderialDayArc: false
        , showMeanDayArc: true
        , showSolarDayArc: true
        , showPM: true
        , showGrid: false

        , showStellarClock: true
        , showSolarClock: true
        , showMeanClock: true
        , showDegrees: false

        , cameraPosition: {
          type: 'Vector3'
          , default: new THREE.Vector3(0, 20, 0.1)
        }
        , cameraRotation: {
          type: 'Vector3'
          , default: new THREE.Vector3(0, 0, 0)
        }
        , cameraZoom: 20
      }, {
        defaultTransitionDuration: '3s'
      })

      frames.add({
        solarDaysPerYear
        , orbitalPosition: 0
        , showSolarClock: false
        , showMeanClock: false
      }, {
        time: 1
        , duration: 1
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 0, 20)
        // , cameraFollow: true
      }, {
        time: '00:05'
        , duration: '4s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        tiltAngle: 40
      }, {
        time: '00:07'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraTarget: 'meanSun'
      }, {
        time: '00:20'
      })

      frames.add({
        orbitalPosition: 1
      }, {
        time: '00:34'
        , startTime: '00:24'
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 10, 40)
      }, {
        time: '00:38'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 1.45
      }, {
        time: '52s'
        , startTime: '00:50'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 1.22
        , showGrid: true
      }, {
        time: '01:00'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 1.72
      }, {
        time: '01:09'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        showEOTWedge: true
        , cameraPosition: new THREE.Vector3(0, 20, 40)
        , cameraZoom: 40
        , showGrid: false
      }, {
        time: '01:13'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 2 + solarDaysToOrbitalPos( 6 )
      }, {
        time: '01:30'
        , startTime: '01:10'
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 40, 0.1)
        , cameraZoom: 40
      }, {
        time: '01:36'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraTarget: 'earth'
      }, {
        time: '01:38'
      })

      frames.add({
        orbitalPosition: 2 + solarDaysToOrbitalPos( 7 )
      }, {
        time: '01:46'
        , startTime: '01:42'
      })

      frames.add({
        showEarthOrbits: false
        , showSunOrbits: true
      }, {
        time: '01:52'
      })

      frames.add({
        orbitalPosition: 4
      }, {
        time: '02:25'
        , startTime: '01:57'
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 20, 40)
      }, {
        time: '02:00'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 40, 0.1)
      }, {
        time: '02:31'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 4 + 0.1
      }, {
        time: '02:35'
        , startTime: '02:30'
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 0, 40)
      }, {
        time: '02:38'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 4 + 0.3
      }, {
        time: '02:44'
        , startTime: '02:35'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 40, 0.1)
      }, {
        time: '02:44'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0.2, 40, 0.1)
      }, {
        time: '02:49'
        , duration: '3s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 4 + solarDaysToOrbitalPos(3, 0, 40 * deg)
      }, {
        time: '02:54'
        , startTime: '02:49'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraPosition: new THREE.Vector3(40, 0.1, 0.1)
      }, {
        time: '03:03'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 4 + solarDaysToOrbitalPos(5, 0, 40 * deg)
      }, {
        time: '03:10'
        , startTime: '03:04'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0.2, 40, 0.1)
      }, {
        time: '03:10'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        showSolarClock: true
        , showMeanClock: true
      }, {
        time: '03:20'
      })

      // last frame
      frames.add({
        handsOff: true
      }, {
        time: '03:31'
        , startTime: '03:20'
      })

      this.setQueue('03:20', () => {
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
.solar-label,
.mean-label
  text-shadow: 0 0 3px rgba(0, 0, 0, 1)
  font-family: $family-monospace

  transition: bottom 0.3s ease
  &.up
    position: relative
    bottom: 0.85em
  &.down
    position: relative
    bottom: -0.85em
.earth-label
  position: relative
  bottom: 1em
.stellar-label
  color: $blue
.solar-label
  color: $yellow
.mean-label
  color: $red
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
