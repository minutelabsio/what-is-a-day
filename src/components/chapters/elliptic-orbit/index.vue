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
    , :eccentricity.sync="eccentricity"

    , :showGrid.sync="showGrid"
    , :showEarthOrbits.sync="showEarthOrbits"
    , :showSunOrbits.sync="showSunOrbits"

    , :showSun.sync="showSun"
    , :showMeanSun.sync="showMeanSun"
    , :showEOTWedge.sync="showEOTWedge"
  )
    .eot-graph(v-if="graphOpen")
      EOTGraph(:eccentricity="eccentricity", :tilt="tiltAngle * deg", :mean-anomaly="meanAnomaly")
    template(slot="modal")
      .column.is-two-fifths.mini-graph
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
    .mean-label(slot="mean-label", :class="{ down: (eot > 0), up: (eot <= 0) }")
      transition(name="fade")
        .clock(v-if="showMeanClock")
          .time {{meanClock}}
    .solar-label(slot="solar-label", :class="{ up: (eot > 0), down: (eot <= 0) }")
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
          , default: solarDaysToOrbitalPos(5) // {0, 1}
          , interpolatorOpts: { modulo: 1 }
        }
        , solarDaysPerYear: solarDaysPerYear
        , tiltAngle: 0
        , eccentricity: 0
        , cameraTarget: {
          type: String
          , default: 'meanSun'
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
        , orbitalPosition: solarDaysToOrbitalPos(5)
        , showDegrees: false
        , showMeanSun: false
        , showMeanClock: false
        , showMeanDayArc: false
      }, {
        time: 1
        , duration: 1
      })

      frames.add({
        orbitalPosition: PERHELION / Pi2
      }, {
        time: '00:20'
        , startTime: 1
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 0, 20)
      }, {
        time: '00:07'
        , startTime: '00:05'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 20, 0.1)
      }, {
        time: '00:10'
        , startTime: '00:08'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      this.setQueue('00:44', () => {
        this.showEarthOptionsModal = true
      })

      frames.add({
        showMeanSun: true
        , showMeanDayArc: true
      }, {
        time: '00:52'
      })

      this.setQueue('00:44', () => {
        this.showEarthOptionsModal = true
      })

      frames.add({
        eccentricity: 0.4
      }, {
        time: '00:53'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      this.setQueue('00:54', () => {
        this.showEarthOptionsModal = false
      })

      frames.add({
        eccentricity: 0
      }, {
        time: '01:13'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        eccentricity: 0.4
      }, {
        time: '01:15'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 1 + solarDaysToOrbitalPos( 2 )
      }, {
        time: '01:36'
        , startTime: '01:16'
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 20, 0.1)
        , cameraZoom: 80
        , cameraTarget: 'earth'
      }, {
        time: '01:29'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        showMeanClock: true
      }, {
        time: '01:37'
      })

      frames.add({
        cameraZoom: 20
        , cameraTarget: 'meanSun'
      }, {
        time: '01:42'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        showSun: false
      }, {
        time: '01:40'
        , duration: 1
      })

      frames.add({
        orbitalPosition: 2.25
      }, {
        time: '01:49'
        , duration: '8s'
      })

      frames.add({
        showSun: true
        , cameraTarget: 'sun'
        , showMeanSun: false
        , showMonthLabels: false
      }, {
        time: '01:49'
        , duration: 1
      })

      frames.add({
        orbitalPosition: 4 + solarDaysToOrbitalPos(7, 0.4)
      }, {
        time: '02:12'
        , duration: '22s'
      })

      frames.add({
        showMeanSun: true
        , cameraTarget: 'meanSun'
        , showMonthLabels: true
      }, {
        time: '02:12'
        , duration: 1
      })

      frames.add({
        showEOTWedge: true
      }, {
        time: '02:19'
        , duration: 1
      })

      frames.add({
        orbitalPosition: 4 + solarDaysToOrbitalPos(7)
      }, {
        time: '02:32'
        , startTime: '02:28'
      })

      frames.add({
        orbitalPosition: 5 + solarDaysToOrbitalPos(1)
      }, {
        time: '02:41'
        , startTime: '02:39'
      })

      this.setQueue('02:52', () => {
        this.graphOpen = true
      })

      // last frame
      frames.add({
        handsOff: true
      }, {
        time: '03:28'
        , startTime: '03:00'
      })

      this.setQueue('03:00', () => {
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
