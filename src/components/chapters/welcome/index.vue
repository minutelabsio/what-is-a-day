<template lang="pug">
.chapter
  transition(name="fade", enter)
    .welcome-overlay(v-if="!playerLoading && showWelcome")
      .about
        router-link.button.btn-dark.is-small.is-rounded(:to="{ name: 'about' }")
          b-icon(icon="information", size="is-small")
          span About this project
      .content.has-text-centered
        h1.title.is-size-1-tablet.is-size-4 What is a Day?
        h2.subtitle.is-size-4-tablet.is-size-6 an interactive adventure
        p Begin
        p
          button.button.btn-dark.is-gigantic(@click="player.play()")
            b-icon(icon="play", size="is-large")
        p or
        router-link(:to="{ name: 'playground' }") skip to the playground

  transition(name="slide-left", appear)
    JasperTV.tv(v-if="copilotState.showTv", :screen-on="copilotState.tvOn", :pose="copilotState.tvPose")
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
    , :showMonthLabels="false"
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
    span(slot="earth-label")
</template>

<script>
import _forIn from 'lodash/forIn'
import Copilot from 'copilot'
import * as THREE from 'three'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import SimControls from '@/components/sim-controls'
import JasperTV from '@/components/jasper-tv'
import chapterMixin from '@/components/chapters/chapter.mixin'

export default {
  name: 'welcome'
  , mixins: [ chapterMixin ]
  , components: {
    DaySim
    , EOTGraph
    , SimControls
    , JasperTV
  }
  , data: () => ({
    paused: false
    , showWelcome: true
    , pauseOnPlay: false
  })
  , methods: {
    initCopilot(){
      const solarDaysPerYear = 8

      // copilot
      let frames = this.frames = Copilot({
        handsOff: {
          type: Boolean
          , default: true
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
        , showEarthOrbits: false
        , showSunOrbits: false
        , showEOTWedge: false
        , showSun: true
        , showMeanSun: false
        , showSiderialDayArc: false
        , showMeanDayArc: false
        , showSolarDayArc: false
        , showPM: false
        , showGrid: false

        , showStellarClock: true
        , showSolarClock: false
        , showDegrees: true

        , cameraPosition: {
          type: 'Vector3'
          , default: new THREE.Vector3(0, 20, 30)
        }
        , cameraRotation: {
          type: 'Vector3'
          , default: new THREE.Vector3(0, 0, 0)
        }
        , cameraZoom: 30

        , showTv: false
        , tvOn: false
        , tvPose: {
          type: String
          , default: 'greeting'
          , interpolator: Copilot.Interpolators.Step
          , interpolatorOpts: { threshold: 0 }
        }
      }, {
        defaultTransitionDuration: '3s'
      })

      // const lab = this
      function stickFigureStuff( keyframes ){
        _forIn(keyframes, (f, time) => frames.add({ tvPose: f, $meta: { time, duration: 1 } }))
      }

      frames.add({
        showTv: true
        , tvPose: 'greeting'
      }, {
        time: '1s'
        , duration: 1
      })

      frames.add({
        tvOn: true
      }, {
        time: '2s'
        , duration: 1
      })

      stickFigureStuff({
        '5s': 'open-arms'
        , '8s': 'talk2'
        , '11.5s': 'shrug'
        , '13s': 'talk2'
        , '14.5s': 'thinking'
        , '17.5s': 'talk2'
        , '22s': 'idea'
        , '23s': 'head-scratch'
        , '26s': 'talk2'
        , '31s': 'open-arms'
        , '33s': 'thinking'
        , '37s': 'exasperated'
        , '40s': 'facepalm'
        , '43s': 'talk2'
        , '46.5s': 'idea'
        , '48s': 'thinking'
        , '51s': 'shrug'
        , '54s': 'talk2'
        , '55s': 'point-nw'
        , '58s': 'talk2'
        , '01:05': 'magic'
        , '01:08': 'talk2'
        , '01:11': 'open-arms'
        , '01:14': 'talk2'
        , '01:23': 'idea'
        , '01:26': 'talk2'
        , '01:44': 'open-arms'
        , '01:53': 'thumbs-up'
        , '01:56': 'talk2'
        , '01:57': 'open-arms'
      })

      frames.add({
        handsOff: false
        , showMeanSun: true
        , showEarthOrbits: true
        , showEOTWedge: true
        , eccentricity: 0.02
        , tiltAngle: 23.4
        , showMeanDayArc: true
        , showSolarDayArc: true
        , showSiderialDayArc: true
      }, {
        time: '55s'
        , duration: '1s'
      })

      frames.add({
        orbitalPosition: 4
      }, {
        time: '01:58'
        , startTime: '54s'
      })

      frames.add({
        handsOff: true
        , tvOn: false
      }, {
        time: '01:58'
        , duration: 1
      })

      this.setQueue('01:11', () => {
        this.$snackbar.open({
          message: 'Tip: Scroll or pinch to zoom'
          , position: 'is-top'
        })
      })

      const disableWelcome = () => {
        this.showWelcome = false
        this.player.$off('play', disableWelcome)
        this.player.$off('seek', disableWelcome)
      }

      this.player.$once('play', disableWelcome)
      this.player.$once('seek', disableWelcome)
      this.$on('hook:beforeDestroy', disableWelcome)
    }
  }
}
</script>

<style scoped lang="sass">
.welcome-overlay
  position: absolute
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: rgba(0, 0, 0, 0.5)
  z-index: 1

  display: flex
  align-items: center
  justify-content: center

  @media screen and (min-width: 768px)
    .subtitle
      margin-bottom: 5em

    .content
      margin-bottom: 10em

  .content
    &,
    .title,
    .subtitle
      text-shadow: 0.05em 0.05em transparentize($blue, 0.2)

  .about
    position: absolute
    bottom: 1em
    right: 1em

  .is-gigantic
    font-size: 2.5em
.tv
  position: absolute
  right: 4px
  bottom: 4px
  width: 300px
  height: 9/16 * 300px
  z-index: 1

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
