<template lang="pug">
.day-sim(:style="{ 'cursor': cursorStyle }")
  v3-renderer(
    ref="renderer"
    , :width="viewWidth"
    , :height="viewHeight"
  )
    Gestures(
      :names="['earth', 'sun']"
      , @dragstart="dragStart"
      , @drag="drag"
      , @dragend="dragEnd"
      , @hover="mouseHover"
    )
    v3-scene
      v3-light(type="ambient", :intensity="0.4")

      v3-group(:position="referenceFramePosition", :rotation="[0, referenceFrameAngle , 0]")
        v3-group(:rotation="[0, -referenceFrameAngle + cameraPivot, 0]")
          SkyBackground(:aspect="viewWidth/viewHeight")
          v3-camera(
            ref="camera"
            , type="orthographic"
            , :left="-viewWidth/2"
            , :right="viewWidth/2"
            , :top="viewHeight/2"
            , :bottom="-viewHeight/2"
            , :zoom="30"
            , :near="1"
            , :far="1000"
            , :position="orthCameraPos"
            , :look-at="origin"
          )

      v3-group(:position="referenceFramePosition")
        v3-group(:visible="showGrid", :position="[0, -0.05, 0]", :rotation="cameraTarget === 'sun' ? [ -tiltAngle, -cameraPivot, 0] : origin")
          v3-polar-grid(
            :radius="50"
            , :color1="0x001e44"
            , :color2="0x102b61"
          )
          v3-circle(
            :rotation="[Math.PI/2, 0, 0]"
            , :radius="50"
            , :transparent="true"
            , :opacity="0.7"
            , :color="0x000022"
          )

      v3-group(:rotation="yearRotation")
        v3-group(:position="earthPosition", :rotation="[0, Math.PI, 0]")
          Earth3D(name="earth", ref="earth", :rotation="earthRotation")
          v3-dom(:position="[0, 1.5, 0]")
            .has-text-right
              .scene-label Mean Solar Day: {{ meanSolarDay }}
              .scene-label True Solar Day: {{ trueSolarDay }}
              .scene-label Sidereal Day: {{ siderealDay }}
          v3-light(type="spot", :intensity="0.4", :position="lightPos")

          //- Day arcs
          v3-line(:from="[1.2, 0, 0]", :to="[1.8, 0, 0]", :color="red")
          v3-ring(
            :innerRadius="1.2"
            , :outerRadius="1.4"
            , :segments="40"
            , :thetaEnd="meanSolarDayArcAngle"
            , :color="red"
            , :opacity="0.8"
            , :rotation="[-90 * deg, 0, 0]"
            , :position="[0, 0.001, 0]"
          )
          v3-group(:rotation="[0, -eot, 0]")
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
          v3-group(:rotation="[0, -yearAngle, 0]")
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
            template(v-if="timeDiffWedgeProps")
              Wedge(v-bind="timeDiffWedgeProps", :opacity="0.5", :rotation="[Math.PI/2, 0, 0]")
              v3-line(:to="[ timeDiffWedgeProps.x1, 0, timeDiffWedgeProps.y1 ]", :color="red")
              v3-line(:to="[ timeDiffWedgeProps.x2, 0, timeDiffWedgeProps.y2 ]", :color="yellow")
            //- mean sun path on earth
            Orbit(
              :radius="1.01"
              , :segments="100"
              , :rotation="[Math.PI/2, 0, 0]"
              , :color="red"
            )
            //- mean sun orbit
            Orbit(
              :visible="showSunOrbits"
              , :radius="sunDistance"
              , :segments="50"
              , :rotation="[Math.PI/2, 0, 0]"
              , :dash-size="0.25"
              , :gap-size="0"
              , :color="red"
            )
            Orbit(
              :visible="showSunOrbits"
              , :radius="sunDistance"
              , :segments="50"
              , :rotation="[Math.PI/2, 0, 0]"
              , :dash-size="0.25"
              , :gap-size="0.15"
              , :color="0x333333"
            )

            v3-group(:rotation="[tiltAngle, 0, 0]")
              Orbit(
                :radius="1.01"
                , :segments="100"
                , :rotation="[Math.PI/2, 0, 0]"
                , :color="yellow"
              )
              Orbit(
                :visible="showSunOrbits"
                , :radius="[majorAxis, semiMajorAxis]"
                , :segments="50"
                , :rotation="[Math.PI/2, Math.PI, 0]"
                , :dash-size="0.25"
                , :gap-size="0"
                , :color="yellow"
              )
              Orbit(
                :visible="showSunOrbits"
                , :radius="[majorAxis, semiMajorAxis]"
                , :segments="50"
                , :rotation="[Math.PI/2, Math.PI, 0]"
                , :dash-size="0.25"
                , :gap-size="0.15"
                , :color="0x333333"
              )

      //- mean sun (origin)
      v3-group
        Sun3D(ref="meanSun", :isMean="true")
        v3-line(:from="sunPosProjection", :to="sunPosition", :color="yellow")
        v3-line(:position="sunPosition"
          , :from="origin"
          , :to="[(1-eccentricity) * majorAxis, 0, 0]"
          , :color="0xeeeeee"
          , :opacity="0.3"
        )
        Orbit(
          :visible="showEarthOrbits"
          , :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, Math.PI, 0]"
          , :dash-size="0.25"
          , :gap-size="0"
          , :color="red"
        )
        Orbit(
          :visible="showEarthOrbits"
          , :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, Math.PI, 0]"
          , :dash-size="0.25"
          , :gap-size="0.15"
          , :color="0x333333"
        )

        //- true sun
      v3-group(:position="sunPosition")
        Sun3D(ref="sun", name="sun")

        Orbit(
          :visible="showEarthOrbits"
          , :radius="[majorAxis, semiMajorAxis]"
          , :segments="50"
          , :rotation="[Math.PI/2 - tiltAngle, Math.PI, 0]"
          , :dash-size="0.25"
          , :gap-size="0"
          , :color="yellow"
        )
        Orbit(
          :visible="showEarthOrbits"
          , :radius="[majorAxis, semiMajorAxis]"
          , :segments="50"
          , :rotation="[Math.PI/2 - tiltAngle, Math.PI, 0]"
          , :dash-size="0.25"
          , :gap-size="0.15"
          , :color="0x333333"
        )
</template>

<script>
import Copilot from 'copilot'
import _find from 'lodash/find'
import * as THREE from 'three'
import { calcEOT, trueAnomaly, meanAnomalyFromTrue } from '@/lib/stellar-mechanics'
import TransitionSetter from '@/lib/transition-setter'
import v3Renderer from '@/components/three-vue/v3-renderer'
import v3Scene from '@/components/three-vue/v3-scene'
import v3Camera from '@/components/three-vue/v3-camera'
import v3Light from '@/components/three-vue/v3-light'
import v3Group from '@/components/three-vue/v3-group'
import v3Dom from '@/components/three-vue/v3-dom'
import v3PolarGrid from '@/components/three-vue/v3-polar-grid'
import v3Circle from '@/components/three-vue/v3-circle'
import Gestures from '@/components/entities/gestures'
import Earth3D from '@/components/entities/earth-3d'
import Sun3D from '@/components/entities/sun-3d'
import SkyBackground from '@/components/entities/sky-background'
import Orbit from '@/components/entities/orbit'
import Wedge from '@/components/entities/wedge'
import v3Ring from '@/components/entities/v3-ring'
import v3Line from '@/components/entities/line'
const OrbitControls = require('three-orbit-controls')(THREE)

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

const Pi2 = Math.PI * 2
const deg = Math.PI / 180
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
  })
  , created(){
    this.$watch(() => {
      return this.viewWidth + this.viewHeight
    }, () => {
      this.onResize()
    })
    this.$watch(() => {
      return this.tiltAngle + this.day + this.eccentricity
    }, () => {
      this.solarPlane.constant = 0
      this.solarPlane.normal.set(0, 1, 0).applyAxisAngle(axis.x, -this.tiltAngle)
      this.getSunPosition( tmpV2 )
      this.solarPlane.translate( tmpV2 )
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

    let camera = this.$refs.camera.v3object
    let renderer = this.$refs.renderer.renderer

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
    // end controls

    this.cameraOrbitSetter = TransitionSetter({
      current: this.yearAngle
      , getCurrent: () => {
        return this.cameraFollow ? shortestAngle(this.yearAngle) : 0
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
          return current.set( sunDistance, 0, 0 ).applyAxisAngle( axis.y, this.yearAngle )
        }
        if ( this.cameraTarget === 'sun' ){
          return current.fromArray( this.sunPosition )
        }

        return current.set( 0, 0, 0 )
      }
      , onUpdate: ( from, to, alpha ) => {
        this.referenceFramePosition.lerpVectors( from, to, alpha )
        this.controls.target.copy( this.referenceFramePosition )
      }
    })

    this.referenceFrameAngleSetter = TransitionSetter({
      current: this.referenceFrameAngle
      , getCurrent: () => {
        return this.cameraTarget === 'earth' ? this.yearAngle : 0
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

    this.yearAngleDrag = false

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
    , day: {
      handler(){
        this.setTimeDiffWedgeProps()
      }
      , immediate: true
    }
    , tiltAngle(){
      this.setTimeDiffWedgeProps()
    }
    , eccentricity(){
      this.setTimeDiffWedgeProps()
    }
  }
  , computed: {
    day(){
      return THREE.Math.euclideanModulo(this.days, this.daysPerYear)
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
      let M = this.yearAngle
      let e = this.eccentricity
      let y = this.tiltAngle
      let p = 0
      return calcEOT( M, e, y, p )
    }
    , trueAnomaly(){
      return trueAnomaly( this.yearAngle, this.eccentricity )
    }
    , sunPosition(){
      return this.getSunPosition( tmpV1 ).toArray()
    }
    , sunPosProjection(){
      tmpV2.fromArray( this.sunPosition )

      return tmpV2.projectOnPlane( axis.y ).toArray()
    }
    , radsPerYear(){
      return (2 * Math.PI / this.daysPerYear)
    }
    , yearAngle(){
      return this.day * this.radsPerYear
    }
    , dayAngle(){
      return this.daysPerYear > 1 ? (this.day % 1) * Pi2 : 0
    }
    , dayArcAngle(){
      return (this.day % 1) * Pi2
    }
    , meanSolarDayArcAngle(){
      return (this.dayArcAngle - this.yearAngle + Pi2) % Pi2
    }
    , solarDayArcAngle(){
      return (this.dayArcAngle + this.eot - this.yearAngle + Pi2) % Pi2
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
  }
  , methods: {
    draw( delta ){
      this.yearRotation.splice(1, 1, this.yearAngle)
      this.invYearRotation.splice(1, 1, -this.yearAngle)
      this.earthRotation.splice(1, 1, this.dayAngle)
      this.transitionCameraTarget( delta )
      this.cameraOrbitSetter.update( delta )

      this.controls.update()

      this.$refs.renderer.draw()
    }
    , transitionCameraTarget( delta ){
      if ( !this.oldTarget ){
        this.oldTarget = this.cameraTarget
      }
      if ( this.cameraTarget !== this.oldTarget ){
        if ( this.oldTarget === 'earth' ){
          this.referenceFramePositionSetter.start( new THREE.Vector3( sunDistance, 0, 0 ).applyAxisAngle( axis.y, this.yearAngle ) )
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
    , setTimeDiffWedgeProps(){
      this.getEarthPosition( tmpV1 )
      let x1 = tmpV1.x
      let y1 = tmpV1.z

      let eot = this.eot

      tmpV1.applyAxisAngle( axis.y, -eot )
        .projectOnPlane( axis.y )
        .setLength(this.earthDistance)

      let x2 = tmpV1.x
      let y2 = tmpV1.z
      tmpV1.y = 0

      // this.getWorldPosition( 'sun', tmpV2 ).sub( tmpV1 ).negate()
      // tmpV2.y = 0
      // tmpV2.setLength( len )
      //
      // let x2 = tmpV2.x
      // let y2 = tmpV2.z

      let sign = tmpV1.x * tmpV2.z - tmpV1.z * tmpV2.x
      let color = sign > 0 ? this.red : this.yellow

      this.timeDiffWedgeProps = {
        x1, y1, x2, y2
        , color
      }
    }
    , getEarthPosition( result ){
      return result.copy( axis.x )
        .applyAxisAngle( axis.y, this.yearAngle )
        .setLength( sunDistance )
    }
    , getSunPosition: (function(){
        const v = new THREE.Vector3()
        return function( result ){
          let sunPos = result.copy( axis.x ).setLength( sunDistance )
          this.getEarthPosition( v )

          return sunPos.applyAxisAngle( axis.y, this.trueAnomaly )
            .applyAxisAngle( axis.x, -this.tiltAngle )
            .setLength( this.earthDistance )
            .sub( v )
            .negate()
        }
      })()
    , getWorldPosition( ref, result ){
      return this.$refs[ref].v3object.getWorldPosition( result )
    }
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
        angle = axis.x.angleTo( tmpV1.sub(tmpV2).applyAxisAngle( axis.x, this.tiltAngle ) )
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

      this.$emit('drag', angle - this.yearAngle)
    }
    , dragEnd(){
      this.dragTarget = false
      this.controls.enabled = true
      this.$emit('dragend')
    }
    , mouseHover({ intersects }){
      this.canGrab = intersects.length
    }
  }
}
</script>

<style scoped lang="sass">
.day-sim
  cursor: crosshair

.scene-label
  font-family: $family-monospace
  text-shadow: 0 0 3px rgba(0, 0, 0, 1)
</style>
