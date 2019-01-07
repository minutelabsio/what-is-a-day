<template lang="pug">
.chapter(:style="{ 'cursor': cursorStyle }")
  .controls
    b-field(grouped)
      b-select(v-model="cameraTarget")
        option(value="earth") Focus on Earth
        option(value="sun") Focus on Sun
        option(value="meanSun") Focus on Mean Sun
      b-switch(v-model="cameraFollow")
        | Follow Orbit
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
      v3-group(:visible="showGrid")
        v3-polar-grid(
          :radius="50"
          , :color1="0x001e44"
          , :color2="0x102b61"
        )
        v3-circle(
          :rotation="[Math.PI/2, 0, 0]"
          , :position="[0, -0.01, 0]"
          , :radius="50"
          , :transparent="true"
          , :opacity="0.7"
          , :color="0x000022"
        )

      v3-group(:rotation="[0, referenceFrameAngle + cameraPivot, 0]")
        v3-group(:position="referenceFramePosition", :rotation="[0, -referenceFrameAngle, 0]")
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

      v3-group(:rotation="yearRotation")
        v3-group(:position="earthPosition", :rotation="[0, Math.PI, 0]")
          Earth3D(name="earth", ref="earth", :rotation="earthRotation")
          v3-dom(:position="[0, 1.5, 0]")
            .has-text-right
              .scene-label Solar Day: {{ solarDay }}
              .scene-label Sidereal Day: {{ siderealDay }}
          v3-light(type="spot", :intensity="0.4", :position="lightPos")

          v3-line(:from="[1.2, 0, 0]", :to="[1.8, 0, 0]", :color="red")
          v3-ring(
            :innerRadius="1.2"
            , :outerRadius="1.4"
            , :segments="40"
            , :thetaEnd="solarDayArcAngle"
            , :color="red"
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
              , :thetaEnd="dayAngle"
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
              :radius="sunDistance"
              , :segments="50"
              , :rotation="[Math.PI/2, 0, 0]"
              , :dash-size="0.25"
              , :gap-size="0"
              , :color="red"
            )
            Orbit(
              :radius="sunDistance"
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
                :radius="[majorAxis, semiMajorAxis]"
                , :segments="50"
                , :rotation="[Math.PI/2, Math.PI, 0]"
                , :dash-size="0.25"
                , :gap-size="0"
                , :color="yellow"
              )
              Orbit(
                :radius="[majorAxis, semiMajorAxis]"
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
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, Math.PI, 0]"
          , :dash-size="0.25"
          , :gap-size="0.15"
          , :color="0xaaaaaa"
        )

        //- true sun
      v3-group(:position="sunPosition")
        Sun3D(ref="sun", name="sun")

        v3-group
          Orbit(
            :radius="[majorAxis, semiMajorAxis]"
            , :segments="50"
            , :rotation="[Math.PI/2 - tiltAngle, Math.PI, 0]"
            , :dash-size="0.25"
            , :gap-size="0.15"
            , :color="0xaaaaaa"
          )
</template>

<script>
import Copilot from 'copilot'
import _find from 'lodash/find'
import * as THREE from 'three'
import { calcEOT } from '@/lib/stellar-mechanics'
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

const OrbitalPlane = new THREE.Plane( axis.y )

export default {
  name: 'elliptic-orbit'
  , props: {
    viewWidth: Number
    , viewHeight: Number
    , playerLoading: Boolean

    , showGrid: Boolean
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

    , paused: false
    , dragTarget: false
    , canGrab: false

    , daysPerYear: 10
    , day: 0
    , rate: 1 / 100
    , tiltAngle: 23.4 * deg

    // for sunlight...
    , lightPos: [-0.01, 0, 0]

    , eccentricity: 0.3
    , cameraFollow: false
    , cameraTarget: 'meanSun'
    , cameraPivot: 0
    , orthCameraPos: [ 0, 50, 50 ]

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
    , timeDiffWedgeProps: null
  })
  , created(){
    this.$watch(() => {
      return this.viewWidth + this.viewHeight
    }, () => {
      this.onResize()
    })
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

    this.cameraTargetSetter = TransitionSetter({
      hasSetter: true
      , current: controls.target.clone()
      , getCurrent: ( current ) => {
        return this.getWorldPosition(this.cameraTarget, current)
      }
      , onUpdate: ( from, to, alpha ) => {
        this.controls.target.lerpVectors( from, to, alpha )
      }
    })

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
          return current.set( sunDistance, 0, 0 )
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
        return this.cameraTarget === 'earth' ? this.yearAngle : 0
      }
      , onUpdate: ( from, to, alpha ) => {
        this.referenceFrameAngle = Copilot.Interpolators.Linear( from, to, alpha )
      }
    })

    this.yearAngleDrag = false

    // setInterval(() => {
    //   this.setTimeDiffWedgeProps()
    //   let td = this.timeDiffWedgeProps
    //   let v1 = new THREE.Vector2( td.x1, td.y1 )
    //   let v2 = new THREE.Vector2( td.x2, td.y2 )
    //
    //   let e = 0
    //   let y = this.tiltAngle
    //   let M = this.day * (2 * Math.PI / this.daysPerYear)
    //   let p = 0
    //
    //   console.log( (v2.angle() - v1.angle()) - calcEOT( M, e, y, p ) )
    // }, 500)

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
    , day(){
      this.setTimeDiffWedgeProps()
    }
    , tiltAngle: {
      handler(){
        this.solarPlane.normal.set(0, 1, 0).applyAxisAngle(axis.x, -this.tiltAngle)
      }
      , immediate: true
    }
  }
  , computed: {
    semiMajorAxis(){
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
      let theta = this.yearAngle - this.eot
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
    , sunPosition(){
      this.day
      if ( !this.$refs.sun ){ return [0, 0, 0] }
      let sunPos = this.getWorldPosition( 'earth', tmpV1 )
      tmpV2.copy( tmpV1 )

      return sunPos.applyAxisAngle( axis.y, -this.eot )
        .applyAxisAngle( axis.x, -this.tiltAngle )
        .setLength( this.earthDistance )
        .sub( tmpV2 )
        .negate()
        .toArray()
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
      return (this.day % 1) * Pi2
    }
    , solarDayArcAngle(){
      return (this.dayAngle - this.yearAngle + Pi2) % Pi2
    }
    , siderealDay(){
      return this.day | 0
    }
    , solarDay(){
      return (this.day * (1 - 1/this.daysPerYear)) | 0
    }
    , cursorStyle(){
      return this.dragTarget ?
        'grabbing' :
        this.canGrab ? 'grab' : ''
    }
  }
  , methods: {
    draw( delta ){
      let day = this.day
      if ( !this.paused ){
        day = day + this.rate
      } else if ( this.yearAngleDrag ) {
        let targetDay = (this.yearAngle + this.yearAngleDrag) / this.radsPerYear
        let halfYear = this.daysPerYear / 2
        let dayDelta = (targetDay - day)
        if ( Math.abs(dayDelta) > halfYear ){
          if ( dayDelta > 0 ){
            dayDelta -= this.daysPerYear
          } else {
            dayDelta += this.daysPerYear
          }
        }
        day = day + dayDelta * 0.05
      }

      this.day = THREE.Math.euclideanModulo(day, this.daysPerYear)

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
        this.cameraTargetSetter.start( this.getWorldPosition(this.oldTarget, tmpV1) )

        if ( this.oldTarget === 'earth' ){
          this.referenceFramePositionSetter.start( new THREE.Vector3( sunDistance, 0, 0 ) )
        } else if ( this.oldTarget === 'sun' ){
          this.referenceFramePositionSetter.start( new THREE.Vector3().fromArray(this.sunPosition) )
        } else {
          this.referenceFramePositionSetter.start( vOrigin )
        }

        this.referenceFrameAngleSetter.start( this.referenceFrameAngle )

        this.oldTarget = this.cameraTarget
      }
      this.cameraTargetSetter.update( delta )
      this.referenceFrameAngleSetter.update( delta )
      this.referenceFramePositionSetter.update( delta )
    }
    , setTimeDiffWedgeProps(){
      if ( !this.$refs.earth || !this.$refs.sun ){ return }

      this.getWorldPosition( 'earth', tmpV1 )
      let x1 = tmpV1.x
      let y1 = tmpV1.z
      let len = tmpV1.length()

      let eot = this.eot

      tmpV1.applyAxisAngle( axis.y, -eot )
        .applyAxisAngle( axis.x, this.tiltAngle )
        .setLength(this.earthDistance)
        .projectOnPlane( axis.y )

      let x2 = tmpV1.x
      let y2 = tmpV1.z

      // this.getWorldPosition( 'sun', tmpV2 ).sub( tmpV1 ).negate()
      // tmpV2.y = 0
      // tmpV2.setLength( len )
      //
      // let x2 = tmpV2.x
      // let y2 = tmpV2.z

      let color = tmpV1.dot( axis.x ) > tmpV2.dot( axis.x ) ? this.red : this.yellow

      this.timeDiffWedgeProps = {
        x1, y1, x2, y2
        , color
      }
    }
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
        this.dragTarget = this.$refs['earth'].v3object
        this.paused = true
        this.controls.enabled = false
      }
    }
    , drag({ ray }){
      if ( !this.dragTarget ){ return }

      ray.intersectPlane( OrbitalPlane, tmpV1 )
      let angle = axis.x.angleTo( tmpV1 )

      if ( tmpV1.z > 0 ){
        angle = Pi2 - angle
      }
      // earth
      this.yearAngleDrag = angle - this.yearAngle
    }
    , dragEnd(){
      this.yearAngleDrag = false
      this.dragTarget = false
      this.paused = false
      this.controls.enabled = true
    }
    , mouseHover({ intersects }){
      this.canGrab = intersects.length
    }
  }
}
</script>

<style scoped lang="sass">
.chapter
  background: $background
  cursor: crosshair

.controls
  position: absolute
  z-index: 1
  top: 0
  right: 0
  padding: 1rem
  background: transparentize($background, 0.4)
  border-radius: 0 0 0 3px
  border: 1px solid $background
  border-top-width: 0
  border-right-width: 0

.scene-label
  font-family: $family-monospace
  text-shadow: 0 0 3px rgba(0, 0, 0, 1)
</style>
