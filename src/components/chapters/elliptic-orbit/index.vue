<template lang="pug">
.chapter
  SimControls(
    :handsOff="handsOff"
    , :highlight="highlightControl"

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

  DaySim(
    ref="sim"
    , :viewWidth="viewWidth"
    , :viewHeight="viewHeight"
    , :highlight="highlight"
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
    .mean-label(slot="mean-label", :class="copilotState.disableLabelCorrection ? {} : { down: solarLabelAbove, up: !solarLabelAbove }")
      transition(name="fade")
        .clock(v-if="showMeanClock")
          .time {{meanClock}}
    .solar-label(slot="solar-label", :class="copilotState.disableLabelCorrection ? {} : { up: solarLabelAbove, down: !solarLabelAbove }")
      transition(name="fade")
        .clock(v-if="showSolarClock", :class="{ pulse: copilotState.highlightSolarClock }")
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
        , highlight: {
          type: String
          , default: ''
          , interpolator: Copilot.Interpolators.Step
          , interpolatorOpts: { threshold: 0 }
        }
        , highlightControl: {
          type: String
          , default: ''
          , interpolator: Copilot.Interpolators.Step
          , interpolatorOpts: { threshold: 0 }
        }
        , highlightSolarClock: Boolean
        , disableLabelCorrection: Boolean
        , orbitalPosition: {
          type: Number
          , default: solarDaysToOrbitalPos(5) // {0, 1}
        }
        , solarDaysPerYear: solarDaysPerYear
        , tiltAngle: 0
        , eccentricity: 0
        , cameraTarget: {
          type: String
          , default: 'sun'
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

      function controlsHighlights( list, prop = 'highlightControl' ){
        list.forEach(hl => {
          frames.add({
            [prop]: hl.name
          }, {
            time: hl.start
            , duration: 1
          })

          frames.add({
            [prop]: ''
          }, {
            time: hl.end
            , duration: 1
          })
        })
      }

      frames.add({
        solarDaysPerYear
        , orbitalPosition: solarDaysToOrbitalPos(5)
        , showDegrees: false
        , showMeanSun: false
        , showMeanClock: false
        , showMeanDayArc: false
        , disableLabelCorrection: true
      }, {
        time: 1
        , duration: 1
      })

      frames.add({
        orbitalPosition: 1 + PERHELION / Pi2
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

      frames.add({
        eccentricity: 0.4
      }, {
        time: '23s'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        eccentricity: 0
      }, {
        time: '24s'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        tiltAngle: 30
      }, {
        time: '25s'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        tiltAngle: 0
      }, {
        time: '26s'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        eccentricity: 0.5
      }, {
        time: '00:38'
        , duration: '2s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      controlsHighlights([
        {
          name: 'settings'
          , start: '39s'
          , end: '44s'
        }
      ])

      frames.add({
        orbitalPosition: 12.15
      }, {
        time: '02:40'
        , startTime: '00:43'
      })

      frames.add({
        highlightSolarClock: true
        , cameraTarget: 'earth'
      }, {
        time: '01:21'
        , duration: 1
      })

      frames.add({
        highlightSolarClock: false
        , showSun: false
        , showEarthOrbits: false
      }, {
        time: '01:25'
        , duration: 1
      })

      frames.add({
        cameraZoom: 40
      }, {
        time: '01:30'
        , duration: '6s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        showMeanClock: true
        , showMeanDayArc: true
        , showSolarClock: false
        , showSolarDayArc: false
      }, {
        time: '02:11'
        , duration: 1
      })

      controlsHighlights([
        {
          name: 'mean-day-arc'
          , start: '02:11'
          , end: '02:15'
        }
      ], 'highlight')

      frames.add({
        cameraZoom: 30
      }, {
        time: '02:29'
        , duration: '6s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        showSun: true
        , showEarthOrbits: true
      }, {
        time: '02:26'
        , duration: 1
      })

      frames.add({
        showMeanSun: true
        , showSun: false
      }, {
        time: '02:44'
        , duration: 1
      })

      frames.add({
        orbitalPosition: 13 + solarDaysToOrbitalPos(0)
      }, {
        time: '03:02'
        , startTime: '02:52'
      })

      frames.add({
        showSun: true
        , showSolarDayArc: true
        , showSolarClock: true
        , disableLabelCorrection: false
      }, {
        time: '03:02'
        , duration: 1
      })

      frames.add({
        eccentricity: 0
      }, {
        time: '03:10'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        eccentricity: 0.5
      }, {
        time: '03:13'
        , duration: '1s'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      frames.add({
        orbitalPosition: 13 + solarDaysToOrbitalPos(7, 0.5)
      }, {
        time: '03:26'
        , startTime: '03:13'
      })

      frames.add({
        showEOTWedge: true
      }, {
        time: '03:27'
        , duration: 1
      })

      frames.add({
        orbitalPosition: 13 + solarDaysToOrbitalPos(7)
      }, {
        time: '03:39'
        , startTime: '03:37'
      })

      frames.add({
        orbitalPosition: 14 + solarDaysToOrbitalPos(2)
        , cameraZoom: 20
      }, {
        time: '03:52'
        , startTime: '03:49'
        , easing: Copilot.Easing.Quadratic.InOut
      })

      this.setQueue('04:03', () => {
        this.graphOpen = true
      })

      // last frame
      frames.add({
        handsOff: true
      }, {
        time: '04:38'
        , startTime: '04:00'
      })

      this.setQueue('04:00', () => {
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
