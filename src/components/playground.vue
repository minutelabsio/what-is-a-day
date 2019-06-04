<template lang="pug">
.playground
  SimControls(
    :handsOff="true"

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

    , :showPresets="true"
  )
    .eot-graph(v-if="graphOpen")
      EOTGraph(:eccentricity="eccentricity", :tilt="tiltAngle * deg", :mean-anomaly="meanAnomaly")

    template(slot="nav")
      router-link.button.btn-dark(:to="{ name: 'welcome' }")
        span Back to Lesson

  DaySim(
    ref="sim"
    , :viewWidth="viewWidth"
    , :viewHeight="viewHeight"
    , :playerLoading="false"
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
    , :customCamera="false"
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
import * as THREE from 'three'
import _debounce from 'lodash/debounce'
import DaySim from '@/components/entities/day-sim'
import EOTGraph from '@/components/entities/eot-graph'
import SimControls from '@/components/sim-controls'
import { PERHELION, VERNAL, euclideanModulo, calcEOT } from '@/lib/stellar-mechanics'

const Pi2 = Math.PI * 2
const deg = Math.PI / 180

function shortestDistance( a0, a1, modulo ){
  let moduloBy2 = 0.5 * modulo
  let da = (a1 - a0) % modulo

  return (da - moduloBy2) % modulo + moduloBy2
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

export default {
  name: 'playground'
  , components: {
    DaySim
    , EOTGraph
    , SimControls
  }
  , data: () => ({
    deg
    , viewWidth: 0
    , viewHeight: 0

    , cameraZoomCorrection: 1
    , showEarthOptionsModal: false

    , cameraDragging: false
    , controlsOpen: false
    , graphOpen: false

    , paused: true
    , yearAngleDrag: false

    , playRate: 0.1
    , 'orbitalPosition': 1
    , 'eccentricity': 0.0167
    , 'tiltAngle': 23.439
    , 'cameraTarget': 'meanSun'
    , 'cameraFollow': false
    , 'solarDaysPerYear': 9
    , 'showEarthOrbits': true
    , 'showSunOrbits': false
    , 'showEOTWedge': true
    , 'showSun': true
    , 'showMeanSun': true
    , 'showMonthLabels': true
    , 'showSiderialDayArc': false
    , 'showMeanDayArc': true
    , 'showSolarDayArc': true
    , 'showPM': true
    , 'showGrid': false

    , 'showStellarClock': false
    , 'showSolarClock': true
    , 'showMeanClock': true
    , 'showDegrees': false
    , cameraPosition: {
      type: 'Vector3'
      , default: new THREE.Vector3(0, 20, 0.1)
    }
    , cameraRotation: {
      type: 'Vector3'
      , default: new THREE.Vector3(0, 0, 0)
    }
    , cameraZoom: 20
  })
  , computed: {
    daysPerYear(){
      return this.solarDaysPerYear + 1
    }
    , eot(){
      return this.getEOT()
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
    , solarClock(){
      const minutesPerDay = 24 * 60
      let dayFrac = (this.day * (1 - 1/this.daysPerYear) + PERHELION/Pi2 + 0.5 + this.getEOT() / Pi2) % 1
      let minutes = minutesPerDay * dayFrac
      return clockFromMinutes( minutes )
    }
    , enableDragging(){
      return this.showSun || this.showEarthOrbits
    }
    , solarLabelAbove(){
      let camAdjust = this.cameraTheta / Pi2
      let earthIsRight = euclideanModulo(this.orbitalPosition + camAdjust, 1) < 0.5
      let topDown = this.cameraTopDown
      return (this.eot > 0) ^ earthIsRight ^ topDown
    }
    , cameraTheta(){
      let x = this.cameraPosition.x
      let z = this.cameraPosition.z

      return euclideanModulo(Math.atan2( z, x ), Pi2)
    }
    , cameraTopDown(){
      let y = this.cameraPosition.y

      return y >= 0
    }
  }
  , created(){
    const onResize = _debounce(() => this.getViewDimensions(), 100)
    window.addEventListener( 'resize', onResize, { passive: true } )

    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener( 'resize', onResize )
    })
  }
  , mounted(){
    this.getViewDimensions()

    let stop = false
    const draw = () => {
      if ( stop ) { return }
      requestAnimationFrame( draw )

      this.onFrame()
    }

    this.$on('hook:beforeDestroy', () => {
      stop = true
    })

    draw()
  }
  , methods: {
    onFrame(){
      let orbitalPosition = this.orbitalPosition
      if ( !this.paused ){

        orbitalPosition = orbitalPosition + this.playRate / 100
        orbitalPosition = euclideanModulo(orbitalPosition, 1)
        // ensure that the shortest path is taken to get to target
        let playerPosition = this.orbitalPosition
        orbitalPosition = playerPosition + shortestDistance( playerPosition, orbitalPosition, 1 )
        this.orbitalPosition = orbitalPosition

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
        let playerPosition = this.orbitalPosition
        orbitalPosition = playerPosition + shortestDistance( playerPosition, orbitalPosition, 1 )
        this.orbitalPosition = orbitalPosition
      }
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
    , getEOT(){
      let M = this.meanAnomaly % Pi2
      let e = this.eccentricity
      let y = this.tiltAngle
      let p = PERHELION - VERNAL
      return calcEOT( M, e, y, p )
    }
    , getViewDimensions(){
      this.viewWidth = this.$el.offsetWidth
      this.viewHeight = this.$el.offsetHeight
    }
  }
}
</script>

<style scoped lang="sass">
.playground
  position: absolute
  top: 0
  left: 0
  bottom: 0
  right: 0
  display: flex
  flex-direction: column
  justify-content: flex-end
  background: $background
  cursor: crosshair
  overflow: hidden

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
</style>
