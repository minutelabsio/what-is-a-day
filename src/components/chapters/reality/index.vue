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

  transition(name="slide-left", appear)
    JasperTV.tv(
        v-if="copilotState.showTv"
      , :screen-on="copilotState.tvOn"
      , :pose="copilotState.tvPose"
      , :img="copilotState.tvImg"
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
import JasperTV from '@/components/jasper-tv'
import chapterMixin from '@/components/chapters/chapter.mixin'
import { PERHELION, VERNAL, calcEOT } from '@/lib/stellar-mechanics'

const Pi2 = Math.PI * 2

export default {
  name: 'reality'
  , mixins: [ chapterMixin ]
  , components: {
    DaySim
    , EOTGraph
    , SimControls
    , JasperTV
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
          , default: new THREE.Vector3(0, 20, 20)
        }
        , cameraRotation: {
          type: 'Vector3'
          , default: new THREE.Vector3(0, 0, 0)
        }
        , cameraZoom: 20
        , showTv: false
        , tvOn: false
        , tvPose: {
          type: String
          , default: 'greeting'
          , interpolator: Copilot.Interpolators.Step
          , interpolatorOpts: { threshold: 0 }
        }
        , tvImg: {
          type: String
          , default: ''
          , interpolator: Copilot.Interpolators.Step
          , interpolatorOpts: { threshold: 0 }
        }
      }, {
        defaultTransitionDuration: '3s'
      })

      frames.add({
        showSolarClock: false
        , showMeanClock: false
      }, {
        time: 1
        , duration: 1
      })

      frames.add({
        orbitalPosition: 2 + 356 / 365
      }, {
        time: '00:40'
        , startTime: 1
      })

      frames.add({
        eccentricity: 0.0167
        , showEOTWedge: true
      }, {
        time: '00:18'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        tiltAngle: 23.439
      }, {
        time: '00:21'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      this.setQueue('00:26', () => {
        this.graphOpen = true
      })

      frames.add({
        showTv: true
      }, {
        time: '00:27'
        , duration: 1
      })

      frames.add({
        tvOn: true
        , tvImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Equation_of_time.svg/2560px-Equation_of_time.svg.png'
      }, {
        time: '27.5s'
        , duration: 1
      })

      frames.add({
        tvOn: false
      }, {
        time: '00:33'
        , duration: 1
      })

      frames.add({
        showTv: false
        , tvImg: ''
      }, {
        time: '00:34'
        , duration: 1
      })

      frames.add({
        orbitalPosition: 3 + 356 / 365
      }, {
        time: '01:08'
        , startTime: '00:42'
      })

      frames.add({
        cameraPosition: new THREE.Vector3(20, 30, 0.1)
        , cameraFollow: true
        , cameraZoom: 30
      }, {
        time: '00:43'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 3 + 259 / 365
      }, {
        time: '01:15'
        , duration: '4s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        cameraFollow: false
      }, {
        time: '01:21'
        , duration: 1
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0.1, 30, 20)
        , cameraZoom: 20
      }, {
        time: '01:22'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 5
      }, {
        time: '02:00'
        , startTime: '01:20'
      })

      this.setQueue('02:00', () => {
        this.graphOpen = false
      })

      frames.add({
        cameraFollow: true
      }, {
        time: '02:03'
        , duration: 1
      })

      frames.add({
        cameraPosition: new THREE.Vector3(20, 0.1, 0.1)
        , cameraZoom: 40
        , showEarthOrbits: false
        , showEOTWedge: false
        , daysPerYear: 0
      }, {
        time: '02:07'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 8
      }, {
        time: '02:39'
        , startTime: '02:12'
      })

      frames.add({
        showTv: true
      }, {
        time: '02:23'
        , duration: 1
      })

      frames.add({
        tvOn: true
        , tvImg: 'https://www.tierraadentro.cultura.gob.mx/wp-content/uploads/2015/06/tumblr_lwtlvdrLo91r8lm4no1_500.jpg'
      }, {
        time: '02:24'
        , duration: 1
      })

      frames.add({
        tvOn: false
      }, {
        time: '02:34'
        , duration: 1
      })

      frames.add({
        showTv: false
        , tvImg: ''
      }, {
        time: '02:35'
        , duration: 1
      })

      frames.add({
        eccentricity: 0.0934
        , tiltAngle: 25.19
      },{
        time: '02:42'
        , duration: '1s'
      })

      frames.add({
        orbitalPosition: 10
      }, {
        time: '03:00'
        , startTime: '02:42'
      })

      // mars tv
      frames.add({
        showTv: true
      }, {
        time: '02:47'
        , duration: 1
      })

      frames.add({
        tvOn: true
        , tvImg: 'data:image/jpeg;base64,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'
      }, {
        time: '02:48'
        , duration: 1
      })

      frames.add({
        tvOn: false
      }, {
        time: '02:55'
        , duration: 1
      })

      frames.add({
        showTv: false
        , tvImg: ''
      }, {
        time: '02:56'
        , duration: 1
      })

      frames.add({
        cameraPosition: new THREE.Vector3(0, 30, 20)
        , cameraFollow: false
        , cameraZoom: 30
        , showEarthOrbits: true
        , showEOTWedge: true
        , daysPerYear: solarDaysPerYear
        , showSolarClock: true
        , showMeanClock: true
      }, {
        time: '03:02'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      // last frame
      frames.add({
        handsOff: true
      }, {
        time: '03:45'
        , startTime: '03:02'
      })

      this.setQueue('03:02', () => {
        this.paused = false
      })
    }
  }
}
</script>

<style scoped lang="sass">
.tv
  position: absolute
  right: 4px
  bottom: 4px
  width: 300px
  height: 9/16 * 300px
  z-index: 1

@media screen and (max-width: 480px)
  .tv
    width: 140px
    height: 9/16 * 140px
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

.slide-left-enter,
.slide-left-leave-to
  transform: translate(300px, 0)
.slide-left-enter-active,
.slide-left-leave-active
  transition: all 0.5s ease
.slide-left-enter-to,
.slide-left-leave
  transform: translate(0, 0)

.fade-enter-active,
.fade-leave-active
  transition: opacity 0.3s ease
.fade-enter,
.fade-leave-to
  opacity: 0
</style>
