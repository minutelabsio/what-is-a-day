<template lang="pug">
.day-sim(:style="{ 'cursor': cursorStyle }")
  v3-renderer(
    ref="renderer"
    , :width="viewWidth"
    , :height="viewHeight"
  )
    Gestures(
      :names="interactiveObjects"
      , @dragstart="dragStart"
      , @drag="drag"
      , @dragend="dragEnd"
      , @hover="mouseHover"
    )
    v3-scene
      v3-light(type="ambient", :intensity="showSun ? 0.4 : 0.7")

      v3-group(ref="cameraGroupOuter")
        v3-group(ref="cameraGroup")
          SkyBackground(:aspect="viewWidth/viewHeight")
          v3-camera(
            ref="camera"
            , type="orthographic"
            , :left="-viewWidth/2"
            , :right="viewWidth/2"
            , :top="viewHeight/2"
            , :bottom="-viewHeight/2"
            , :zoom="30"
            , :near="0.01"
            , :far="1000"
            , :position="orthCameraPos"
            , :look-at="origin"
          )

      v3-group(ref="gridOuter")
        v3-group(ref="gridInner", :visible="showGrid", :position="[0, -0.05, 0]")
          v3-polar-grid(
            :radius="30"
            , :color1="0x001e44"
            , :color2="0x102b61"
          )
          v3-circle(
            :rotation="[Math.PI/2, 0, 0]"
            , :radius="30"
            , :transparent="true"
            , :opacity="0.7"
            , :color="0x000022"
          )

      v3-group(:rotation="yearRotation")
        v3-group(:position="earthPosition", :rotation="[0, Math.PI, 0]")
          Earth3D(name="earth", ref="earth", :rotation="earthRotation", :showPM="showPM")
          v3-group(:rotation="invYearRotation")
            v3-group(:rotation="labelUnrotation")
              v3-dom(:position="earthLabelsPosition")
                slot(name="earth-label")
                  .has-text-right
                    .scene-label Mean Solar Day: {{ meanSolarDay }}
                    .scene-label True Solar Day: {{ trueSolarDay }}
                    .scene-label Sidereal Day: {{ siderealDay }}
          //- v3-light(type="spot", :intensity="0.4", :position="lightPos")

          //- Day arcs
          v3-dom(:position="[2, 0, 0]")
            slot(name="mean-label")
          v3-line(:visible="showMeanDayArc", :from="[1.2, 0, 0]", :to="[1.8, 0, 0]", :color="red")
          v3-ring(
            :visible="showMeanDayArc",
            , :innerRadius="1.2"
            , :outerRadius="1.4"
            , :segments="40"
            , :thetaEnd="meanSolarDayArcAngle"
            , :color="red"
            , :opacity="0.8"
            , :rotation="[-90 * deg, 0, 0]"
            , :position="[0, 0.001, 0]"
          )
          v3-group(:visible="showSolarDayArc", :rotation="[0, -eot, 0]")
            v3-dom(:position="[2, 0, 0]")
              slot(name="solar-label")
            v3-line(:from="[1.2, 0, 0]", :to="[1.8, 0, 0]", :color="yellow")
            v3-ring(
              :innerRadius="1.4"
              , :outerRadius="1.6"
              , :segments="40"
              , :thetaEnd="solarDayArcAngle"
              , :color="yellow"
              , :opacity="0.8"
              , :rotation="[-90 * deg, 0, 0]"
              , :position="[0, 0.001, 0]"
            )
          v3-group(:visible="showSiderialDayArc", :rotation="[0, -meanAnomaly, 0]")
            v3-dom(:position="[2, 0, 0]", anchorDir="[-1, 0, 0]")
              slot(name="stellar-label")
            v3-line(:position="[0, 0, 0.002]", :from="[1, 0, 0]", :to="[1.8, 0, 0]", :color="blue")
            v3-ring(
              :innerRadius="0.98"
              , :outerRadius="1.2"
              , :segments="40"
              , :thetaEnd="dayArcAngle"
              , :opacity="0.8"
              , :color="blue"
              , :rotation="[-90 * deg, 0, 0]"
            )

          v3-group(:position="[0, -0.001, 0]", :rotation="invYearRotation")
            template(v-if="timeDiffWedgeProps && showEOTWedge")
              Wedge(v-bind="timeDiffWedgeProps", :opacity="0.5", :rotation="[Math.PI/2, 0, 0]")
              v3-line(:to="[ timeDiffWedgeProps.x1, 0, timeDiffWedgeProps.y1 ]", :color="red")
              v3-line(:to="[ timeDiffWedgeProps.x2, 0, timeDiffWedgeProps.y2 ]", :color="yellow")
            //- mean sun path on earth (ecliptic)
            v3-dom(v-if="showSunOrbits && showMonthLabels", v-for="(month, index) in months", :key="index", :position="[(sunDistance + 2) * Math.cos(Pi2 * index / 12), 0, -(sunDistance + 2) * Math.sin(Pi2 * index / 12)]")
              .month-marker(:class="{ active: currentMonth === month }") {{ month }}
            Orbit(
              :visible="showMeanSun"
              , :radius="1.01"
              , :segments="100"
              , :rotation="[Math.PI/2, 0, 0]"
              , :color="red"
            )
            //- mean sun orbit
            Orbit(
              :visible="showSunOrbits && showMeanSun"
              , :radius="sunDistance"
              , :segments="50"
              , :rotation="[Math.PI/2, 0, 0]"
              , :dash-size="0.25"
              , :gap-size="0"
              , :color="red"
            )
            Orbit(
              :visible="showSunOrbits && showMeanSun"
              , :radius="sunDistance"
              , :segments="50"
              , :rotation="[Math.PI/2, 0, 0]"
              , :dash-size="0.25"
              , :gap-size="0.15"
              , :color="0x333333"
            )

            v3-group(:rotation="[0, vernalEquinoxAngle, 0]")
              v3-group(:rotation="[tiltAngle, -vernalEquinoxAngle, 0]")
                //- solar path (celestial equator)
                //- Orbit(
                //-   :visible="showSun"
                //-   , :radius="1.01"
                //-   , :segments="100"
                //-   , :rotation="[Math.PI/2, 0, 0]"
                //-   , :color="yellow"
                //- )
                Orbit(
                  :visible="showSunOrbits && showSun"
                  , :radius="[majorAxis, semiMajorAxis]"
                  , :segments="50"
                  , :rotation="[Math.PI/2, Math.PI, 0]"
                  , :dash-size="0.25"
                  , :gap-size="0"
                  , :color="yellow"
                )
                Orbit(
                  :visible="showSunOrbits && showSun"
                  , :radius="[majorAxis, semiMajorAxis]"
                  , :segments="50"
                  , :rotation="[Math.PI/2, Math.PI, 0]"
                  , :dash-size="0.25"
                  , :gap-size="0.15"
                  , :color="0x333333"
                )

      //- mean sun (origin)
      v3-group(:visible="showMeanSun")
        Sun3D(ref="meanSun", :isMean="true")
        v3-line(:visible="showEOTWedge", :from="sunPosProjection", :to="sunPosition", :color="yellow")
        v3-dom(v-if="showEarthOrbits && showMonthLabels", v-for="(month, index) in months", :key="index", :position="[(sunDistance + 2) * Math.cos(Pi2 * index / 12), 0, -(sunDistance + 2) * Math.sin(Pi2 * index / 12)]")
          .month-marker(:class="{ active: currentMonth === month }") {{ month }}
        Orbit(
          :visible="showEarthOrbits && showMeanSun"
          , :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, Math.PI, 0]"
          , :dash-size="0.25"
          , :gap-size="0"
          , :color="red"
        )
        Orbit(
          :visible="showEarthOrbits && showMeanSun"
          , :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, Math.PI, 0]"
          , :dash-size="0.25"
          , :gap-size="0.15"
          , :color="0x333333"
        )

      //- true sun
      v3-group(:position="sunPosition")
        fadeTransition
          Sun3D(v-if="showSun", ref="sun", name="sun", :rotation="[0, sunSpin, 0]")
        v3-light(v-if="showSun", type="point", :intensity="0.7")

        v3-group(:rotation="[0, vernalEquinoxAngle, 0]")
          v3-group(:rotation="[-tiltAngle, -vernalEquinoxAngle, 0]")
            v3-line(
              :visible="showEarthOrbits && showSun"
              , :from="origin"
              , :to="[(1-eccentricity) * majorAxis, 0, 0]"
              , :color="0xeeeeee"
              , :opacity="0.3"
            )
            Orbit(
              :visible="showEarthOrbits && showSun"
              , :radius="[majorAxis, semiMajorAxis]"
              , :segments="50"
              , :rotation="[Math.PI/2, Math.PI, 0]"
              , :dash-size="0.25"
              , :gap-size="0"
              , :color="yellow"
            )
            Orbit(
              :visible="showEarthOrbits && showSun"
              , :radius="[majorAxis, semiMajorAxis]"
              , :segments="50"
              , :rotation="[Math.PI/2, Math.PI, 0]"
              , :dash-size="0.25"
              , :gap-size="0.15"
              , :color="0x333333"
            )
</template>

<script>
import Copilot from 'copilot'
import _find from 'lodash/find'
import * as THREE from 'three'
import { calcEOT, trueAnomaly, meanAnomalyFromTrue, VERNAL, PERHELION, euclideanModulo } from '@/lib/stellar-mechanics'
import TransitionSetter from '@/lib/transition-setter'
import v3Renderer from '@/components/three-vue/v3-renderer'
import v3Scene from '@/components/three-vue/v3-scene'
import v3Camera from '@/components/three-vue/v3-camera'
import v3Light from '@/components/three-vue/v3-light'
import v3Group from '@/components/three-vue/v3-group'
import v3Dom from '@/components/three-vue/v3-dom'
import v3PolarGrid from '@/components/three-vue/v3-polar-grid'
import v3Circle from '@/components/three-vue/v3-circle'
import fadeTransition from '@/components/three-vue/fade.transition'

import Gestures from '@/components/entities/gestures'
import Earth3D from '@/components/entities/earth-3d'
import Sun3D from '@/components/entities/sun-3d'
import SkyBackground from '@/components/entities/sky-background'
import Orbit from '@/components/entities/orbit'
import Wedge from '@/components/entities/wedge'
import v3Ring from '@/components/entities/v3-ring'
import v3Line from '@/components/entities/line'
const OrbitControls = require('three-orbit-controls')(THREE)
const months = [
  'Jan'
  , 'Feb'
  , 'Mar'
  , 'Apr'
  , 'May'
  , 'Jun'
  , 'Jul'
  , 'Aug'
  , 'Sep'
  , 'Oct'
  , 'Nov'
  , 'Dec'
]

const Pi2 = Math.PI * 2
const deg = Math.PI / 180
const angleModulo = (a) => euclideanModulo(a, Pi2)

// mean sun distance
const sunDistance = 10
// const tmpSph = new THREE.Spherical()
const tmpV1 = new THREE.Vector3()
const tmpV2 = new THREE.Vector3()

const vOrigin = new THREE.Vector3()
const axis = {
  x: new THREE.Vector3(1, 0, 0)
  , y: new THREE.Vector3(0, 1, 0)
  , z: new THREE.Vector3(0, 0, 1)
}

function shortestAngle( ang ){
  return ((ang % Pi2) + Math.PI) % Pi2 - Math.PI
}

const EquatorialPlane = new THREE.Plane( axis.y )

export default {
  name: 'DaySim'
  , props: {
    viewWidth: Number
    , viewHeight: Number
    , playerLoading: Boolean

    , showGrid: Boolean
    , showEarthOrbits: Boolean
    , showSunOrbits: Boolean
    , showEOTWedge: Boolean
    , showSun: Boolean
    , showMeanSun: Boolean
    , showSiderialDayArc: Boolean
    , showMeanDayArc: Boolean
    , showSolarDayArc: Boolean
    , showPM: Boolean
    , showMonthLabels: {
      type: Boolean
      , default: true
    }

    , enableDragging: {
      type: Boolean
      , default: true
    }

    , daysPerYear: {
      type: Number
      , default: 365
    }
    , cameraFollow: {
      type: Boolean
      , default: false
    }
    , cameraTarget: {
      type: String
      , default: 'meanSun'
    }
    , days: {
      type: Number
      , default: 0
    }
    , tiltAngle: {
      type: Number
      , default: 23.4 * deg
    }
    , eccentricity: {
      type: Number
      , default: 0.02
    }

    , earthLabelsPosition: {
      type: Object
      , default: () => new THREE.Vector3(0, 1, 0)
    }

    , customCamera: {
      type: Boolean
      , default: true
    }
  }
  , components: {
    v3Renderer
    , v3Scene
    , v3Camera
    , v3Light
    , v3Group
    , v3Dom
    , v3PolarGrid
    , v3Circle
    , fadeTransition

    , Gestures
    , SkyBackground
    , Earth3D
    , Sun3D
    , Orbit
    , Wedge
    , v3Ring
    , v3Line
  }
  , data: () => ({
    // helper constants
    Pi2
    , deg
    , months
    , origin: [0, 0, 0]

    , yellow: 0xdddd00
    , red: 0xe93f33
    , blue: 0x2888e4

    , dragTarget: false
    , canGrab: false

    // for sunlight...
    , lightPos: [-0.01, 0, 0]

    , cameraPivot: 0
    , orthCameraPos: [ 0, 50, 50 ]

    , vernalEquinoxPoint: [ sunDistance, 0, 0 ]
    // relative to perhelion
    , vernalEquinoxAngle: VERNAL - PERHELION

    , sunDistance
    , earthPosition: [sunDistance, 0, 0]
    , earthRotation: [0, 0, 0]

    , sunPos: [0, 0, 0]
    , meanSunPos: [0, 0, 0]

    , yearRotation: [ 0, 0, 0 ]
    , invYearRotation: [ 0, 0, 0 ]

    , solarPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0))
    , referenceFramePosition: new THREE.Vector3()
    , referenceFrameAngle: 0
    , referenceFrameTilt: 0
    , timeDiffWedgeProps: null

    , labelUnrotation: new THREE.Euler()
  })
  , created(){
    // used to go from solar plane to ecliptic
    this.solarPlaneQuarternion = new THREE.Quaternion()
    this.$watch('tiltAngle', (function(){
      // scoped
      const euler = new THREE.Euler()
      const q = new THREE.Quaternion()

      return function(){
        euler.set(-this.tiltAngle, -this.vernalEquinoxAngle, 0)
        q.setFromEuler(euler)
        this.solarPlaneQuarternion
          .setFromAxisAngle(axis.y, this.vernalEquinoxAngle)
          .multiply( q )
      }
    })(), { immediate: true })

    this.$watch(() => {
      return this.viewWidth + ~this.viewHeight
    }, () => {
      this.onResize()
    })
    this.$watch(() => {
      return this.tiltAngle + this.day + this.eccentricity
    }, () => {
      this.solarPlane.constant = 0
      this.solarPlane.normal.set(0, 1, 0)
        .applyQuaternion( this.solarPlaneQuarternion )
      this.getSunPosition( tmpV2 )
      this.solarPlane.translate( tmpV2 )
    }, { immediate: true })

    this.$watch(() => {
      return this.tiltAngle + this.day + this.eccentricity
    }, () => {
      this.yearRotation.splice(1, 1, this.meanAnomaly)
      this.invYearRotation.splice(1, 1, -this.meanAnomaly)
      this.earthRotation.splice(1, 1, this.dayAngle - this.meanAnomaly)
      this.setTimeDiffWedgeProps()
    }, { immediate: true })
  }
  , mounted(){
    let stop = false
    const clock = new THREE.Clock()
    const draw = () => {
      if ( stop ) { return }
      requestAnimationFrame( draw )

      this.draw( clock.getDelta() * 1000 )
    }

    this.$on('hook:beforeDestroy', () => {
      stop = true
    })

    // just to announce the controls interactions
    let renderer = this.$refs.renderer.renderer
    let camera = this.customCamera ?
      new THREE.OrthographicCamera().copy(this.$refs.camera.v3object, true) :
      this.$refs.camera.v3object

    this.$refs.cameraGroup.v3object.add(camera)
    // var helper = new THREE.PlaneHelper( this.solarPlane, 50, 0xffff00 )
    // this.$refs.renderer.scene.add( helper )

    // controls
    let controls = this.controls = new OrbitControls( camera, renderer.domElement )

    controls.rotateSpeed = 0.2
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8

    controls.enableZoom = true
    controls.enablePan = false

    // controls.staticMoving = true
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.minZoom = 10
    controls.maxZoom = 500
    let epsilon = 0.001
    controls.minPolarAngle = epsilon
    controls.maxPolarAngle = Math.PI - epsilon

    let timer = null
    this.cameraInteraction = false
    controls.addEventListener('start', () => {
      clearTimeout( timer )
      this.cameraInteraction = true
      this.$emit('camera:start', {
        position: camera.position
        , rotation: camera.rotation
        , zoom: camera.zoom
      })
    })
    controls.addEventListener('change', () => {
      this.updateLabelRotations()
      if ( !this.cameraInteraction ){ return }
      this.$emit('camera:change', {
        position: camera.position
        , rotation: camera.rotation
        , zoom: camera.zoom
      })
    })
    controls.addEventListener('end', () => {
      this.$emit('camera:end', {
        position: camera.position
        , rotation: camera.rotation
        , zoom: camera.zoom
      })
      timer = setTimeout(() => {
        this.cameraInteraction = false
      }, 500)
    })
    // end controls

    this.cameraOrbitSetter = TransitionSetter({
      current: this.meanAnomaly
      , getCurrent: () => {
        return this.cameraFollow ? shortestAngle(this.meanAnomaly) : 0
      }
      , onUpdate: ( from, to, alpha ) => {
        this.cameraPivot = Copilot.Interpolators.Linear( from, to, alpha )
      }
    })

    this.referenceFramePositionSetter = TransitionSetter({
      hasSetter: true
      , current: this.referenceFramePosition.clone()
      , getCurrent: ( current ) => {
        if ( this.cameraTarget === 'earth' ){
          return current.set( sunDistance, 0, 0 ).applyAxisAngle( axis.y, this.meanAnomaly )
        }
        if ( this.cameraTarget === 'sun' ){
          return current.fromArray( this.sunPosition )
        }

        return current.set( 0, 0, 0 )
      }
      , onUpdate: ( from, to, alpha ) => {
        this.referenceFramePosition.lerpVectors( from, to, alpha )
      }
    })

    this.referenceFrameAngleSetter = TransitionSetter({
      current: this.referenceFrameAngle
      , getCurrent: () => {
        return this.cameraTarget === 'earth' ? this.meanAnomaly : 0
      }
      , onUpdate: ( from, to, alpha ) => {
        this.referenceFrameAngle = Copilot.Interpolators.Linear( from, to, alpha )
      }
    })

    this.referenceFrameTiltSetter = TransitionSetter({
      current: this.referenceFrameTilt
      , getCurrent: () => {
        return this.cameraTarget === 'sun' ? this.tiltAngle : 0
      }
      , onUpdate: ( from, to, alpha ) => {
        this.referenceFrameTilt = Copilot.Interpolators.Linear( from, to, alpha )
      }
    })

    this.meanAnomalyDrag = false

    this.$on('hook:beforeDestroy', () => {
      stop = true
      controls.dispose()
    })

    if ( !this.playerLoading ){
      draw()
    } else {
      let unwatch = this.$watch('playerLoading', () => {
        unwatch()
        draw()
      })
    }
  }
  , watch: {
    cameraFollow(){
      let prev = this.cameraPivot
      this.cameraOrbitSetter.start( prev )
    }
  }
  , computed: {
    day(){
      return THREE.Math.euclideanModulo(this.days, this.daysPerYear)
    }
    , sunSpin(){
      // amount sun rotates
      // usually once per 24 days ~ 15 times per year
      return this.meanAnomaly * 15
    }
    , semiMajorAxis(){
      let e = this.eccentricity
      let gamma = Math.sqrt(1 - e * e)
      let d = this.sunDistance
      return 2 * d * gamma / (1 + gamma)
    }
    , majorAxis(){
      let e = this.eccentricity
      return this.semiMajorAxis / Math.sqrt(1 - e * e)
    }
    , earthDistance(){
      let e = this.eccentricity
      let a = this.majorAxis
      let theta = this.trueAnomaly
      let r = a * (1 - e * e) / (1 + e * Math.cos(theta))

      return r
    }
    , eot(){
      return this.getEOT()
    }
    , trueAnomaly(){
      return trueAnomaly( this.meanAnomaly, this.eccentricity )
    }
    , sunPosition(){
      // only indirectly depends on tilt angle through quarternion
      this.tiltAngle
      return this.getSunPosition( tmpV1 ).toArray()
    }
    , sunPosProjection(){
      this.tiltAngle
      return this.getSunPosition( tmpV2 ).projectOnPlane( axis.y ).toArray()
    }
    , radsPerYear(){
      return (2 * Math.PI / this.daysPerYear)
    }
    , meanAnomaly(){
      return angleModulo(this.day * this.radsPerYear - PERHELION)
    }
    , currentMonth(){
      let idx = euclideanModulo(this.meanAnomaly * 12 / Pi2, 12)
      return months[ idx | 0 ]
    }
    , dayAngle(){
      return (this.day % 1) * Pi2
    }
    , dayArcAngle(){
      return (this.day % 1) * Pi2
    }
    , meanSolarDayArcAngle(){
      return (this.dayArcAngle - this.meanAnomaly + Pi2) % Pi2
    }
    , solarDayArcAngle(){
      return (this.dayArcAngle + this.eot - this.meanAnomaly + Pi2) % Pi2
    }
    , siderealDay(){
      return this.day | 0
    }
    , meanSolarDay(){
      return (this.day * (1 - 1/this.daysPerYear)) | 0
    }
    , trueSolarDay(){
      return (this.day * (1 - 1/this.daysPerYear) + this.eot / Pi2) | 0
    }
    , cursorStyle(){
      return this.dragTarget ?
        'grabbing' :
        this.canGrab ? 'grab' : ''
    }
    , interactiveObjects(){
      return this.enableDragging ? ['earth'] : []
    }
  }
  , methods: {
    draw( delta ){
      this.transitionCameraTarget( delta )
      this.cameraOrbitSetter.update( delta )

      this.setReferenceFrame()
      this.controls.update()
      this.$refs.renderer.draw()
    }
    , setReferenceFrame(){
      const outer = this.$refs.cameraGroupOuter
      const inner = this.$refs.cameraGroup
      const gridOuter = this.$refs.gridOuter
      const gridInner = this.$refs.gridInner

      outer.v3object.position.copy(this.referenceFramePosition)

      outer.v3object.rotation.set( 0, this.referenceFrameAngle , 0 )
      inner.v3object.rotation.set(0, -this.referenceFrameAngle + this.cameraPivot, 0)

      gridOuter.v3object.position.copy(this.referenceFramePosition)

      if ( this.cameraTarget === 'sun' ){
        gridInner.v3object.rotation.set( -this.tiltAngle, -this.cameraPivot, 0 )
      } else {
        gridInner.v3object.rotation.set( 0, 0, 0 )
      }
    }
    , transitionCameraTarget( delta ){
      if ( !this.oldTarget ){
        this.oldTarget = this.cameraTarget
      }
      if ( this.cameraTarget !== this.oldTarget ){
        if ( this.oldTarget === 'earth' ){
          this.referenceFramePositionSetter.start( new THREE.Vector3( sunDistance, 0, 0 ).applyAxisAngle( axis.y, this.meanAnomaly ) )
        } else if ( this.oldTarget === 'sun' ){
          this.referenceFramePositionSetter.start( new THREE.Vector3().fromArray(this.sunPosition) )
        } else {
          this.referenceFramePositionSetter.start( vOrigin )
        }

        if ( this.oldTarget === 'sun' ){
          this.referenceFrameTiltSetter.start( this.tiltAngle )
        } else if ( this.cameraTarget === 'sun' ){
          this.referenceFrameTiltSetter.start( 0 )
        }

        this.referenceFrameAngleSetter.start( this.referenceFrameAngle )

        this.oldTarget = this.cameraTarget
      }

      this.referenceFrameTiltSetter.update( delta )
      this.referenceFrameAngleSetter.update( delta )
      this.referenceFramePositionSetter.update( delta )
    }
    , getEOT(){
      let M = this.meanAnomaly
      let e = this.eccentricity
      let y = this.tiltAngle
      let p = PERHELION - VERNAL
      return calcEOT( M, e, y, p )
    }
    , setTimeDiffWedgeProps(){
      this.getEarthPosition( tmpV1 )
      let x1 = tmpV1.x
      let y1 = tmpV1.z

      let eot = this.getEOT()

      tmpV1.applyAxisAngle( axis.y, -eot )
        .projectOnPlane( axis.y )
        .setLength(this.earthDistance)

      let x2 = tmpV1.x
      let y2 = tmpV1.z

      let sign = x1 * y2 - y1 * x2
      let color = sign < 0 ? this.red : this.yellow

      this.timeDiffWedgeProps = {
        x1, y1, x2, y2
        , color
      }
    }
    , getEarthPosition( result ){
      return result.copy( axis.x )
        .applyAxisAngle( axis.y, this.meanAnomaly )
        .setLength( sunDistance )
    }
    , getSunPosition: (function(){
        const v = new THREE.Vector3()
        return function( result ){
          let sunPos = result.copy( axis.x )
          this.getEarthPosition( v )

          return sunPos.applyAxisAngle( axis.y, this.trueAnomaly )
            .applyQuaternion( this.solarPlaneQuarternion )
            .setLength( this.earthDistance )
            .sub( v )
            .negate()
        }
      })()
    , onResize(){
    }
    , inIntersects( name, intersects ){
      let obj = this.$refs[name]

      if ( !obj ){ return false }
      obj = obj.v3object

      return !!_find( intersects, int => (int.object === obj) )
    }
    , dragStart({ intersects }){
      if ( this.inIntersects('earth', intersects) ){
        this.dragTarget = 'earth'
        this.controls.enabled = false
      }

      this.$emit('dragstart', intersects)
    }
    , drag({ ray }){
      if ( !this.dragTarget ){ return }

      let angle
      if ( this.cameraTarget === 'sun' ){
        ray.intersectPlane(this.solarPlane, tmpV1)
        this.getSunPosition(tmpV2)
        angle = axis.x.angleTo( tmpV1.sub(tmpV2).applyQuaternion( this.solarPlaneQuarternion.inverse() ) )
        this.solarPlaneQuarternion.inverse()
        if ( tmpV1.z > 0 ){
          angle = Pi2 - angle
        }
        angle = meanAnomalyFromTrue( angle, this.eccentricity )
      } else {
        ray.intersectPlane(EquatorialPlane, tmpV1)
        angle = axis.x.angleTo( tmpV1 )
        if ( tmpV1.z > 0 ){
          angle = Pi2 - angle
        }
      }

      this.$emit('drag', angle - this.meanAnomaly)
    }
    , dragEnd(){
      this.dragTarget = false
      this.controls.enabled = true
      this.$emit('dragend')
    }
    , mouseHover({ intersects }){
      this.canGrab = intersects.length
    }
    , updateLabelRotations(){
      let cam = this.$refs.camera.v3object
      this.labelUnrotation.set(-cam.rotation.x, cam.rotation.y, -cam.rotation.z)
    }
    , setCameraProperties({ position, rotation, zoom }){
      let cam = this.$refs.camera.v3object
      // console.log(position, rotation, zoom)
      if ( position ){
        cam.position.copy(position)
      }
      if ( rotation ){
        cam.rotation.setFromVector3(rotation)
      } else {
        this.setReferenceFrame()
        cam.lookAt(this.referenceFramePosition)
      }
      if ( zoom !== cam.zoom ){
        cam.zoom = zoom
        cam.updateProjectionMatrix()
      }

      // this.cameraInteraction = false
      this.controls.object.copy( cam )
      this.controls.update()
      // this.cameraInteraction = true
    }
  }
}
</script>

<style scoped lang="sass">
.day-sim
  background: black
  cursor: crosshair
.month-marker
  font-family: $family-monospace
  transition: color .15s ease
  color: rgba(200, 200, 255, 0.25)
  &.active
    color: rgba(255, 255, 255, 0.6)
.scene-label
  font-family: $family-monospace
  text-shadow: 0 0 3px rgba(0, 0, 0, 1)
</style>
