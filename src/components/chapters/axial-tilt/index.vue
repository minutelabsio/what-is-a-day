<template lang="pug">
.chapter
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
    v3-scene
      v3-group(ref="cameraGroup", :rotation="cameraPivot")
        //- v3-camera(ref="camera", type="perspective", :aspect="viewWidth / viewHeight", v-bind="cameraSettings")
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
      v3-light(type="ambient", :intensity="0.2")

      v3-group
        Earth3D(ref="earth", :rotation.sync="earthRotation")

      Wedge(v-bind="timeDiffWedgeProps", :opacity="0.5", :rotation="[Math.PI/2, 0, 0]")
      v3-line(:to="[ timeDiffWedgeProps.x1, 0, timeDiffWedgeProps.y1 ]", :color="red")
      v3-line(:to="[ timeDiffWedgeProps.x2, 0, timeDiffWedgeProps.y2 ]", :color="yellow")
      v3-line(:from="sunPosProjection", :to="sunWorldPos", :color="yellow")

      //- mean sun
      v3-group
        v3-group(:rotation="yearRotation")
          Sun3D(ref="meanSun", :isMean="true", :position="sunPos")
        Orbit(
          :radius="1.01"
          , :segments="100"
          , :rotation="[Math.PI/2, 0, 0]"
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
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, 0, 0]"
          , :color="red"
        )
      //- true sun
      v3-group(:rotation="[23.4 * deg, 0, 0]")
        v3-group(:rotation="yearRotation")
          v3-light(type="spot", :intensity="0.4", :position="lightPos")
          Sun3D(ref="sun", :position="sunPos")
        Orbit(
          :radius="1.01"
          , :segments="100"
          , :rotation="[Math.PI/2, 0, 0]"
          , :color="yellow"
        )
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, 0, 0]"
          , :dash-size="0.25"
          , :gap-size="0.15"
          , :color="0x333333"
        )
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, 0, 0]"
          , :color="yellow"
        )
</template>

<script>
// import Copilot from 'copilot'
import * as THREE from 'three'
import v3Renderer from '@/components/three-vue/v3-renderer'
import v3Scene from '@/components/three-vue/v3-scene'
import v3Camera from '@/components/three-vue/v3-camera'
import v3Light from '@/components/three-vue/v3-light'
import v3Group from '@/components/three-vue/v3-group'
import Earth3D from './earth-3d'
import Sun3D from './sun-3d'
import Orbit from './orbit'
import Wedge from './wedge'
import v3Line from './line'
const OrbitControls = require('three-orbit-controls')(THREE)

const spaceBackgroundTexture = new THREE.CubeTextureLoader().load([
  require('@/assets/sky/px.png')
  , require('@/assets/sky/nx.png')
  , require('@/assets/sky/py.png')
  , require('@/assets/sky/ny.png')
  , require('@/assets/sky/pz.png')
  , require('@/assets/sky/nz.png')
])
// const spaceBackgroundTexture = new THREE.CubeTextureLoader().setPath('https://threejs.org/examples/textures/cube/Park3Med/').setCrossOrigin('anonymous').load([
//   'px.jpg'
//   , 'nx.jpg'
//   , 'py.jpg'
//   , 'ny.jpg'
//   , 'pz.jpg'
//   , 'nz.jpg'
// ])
// const spaceBackgroundTexture = new THREE.TextureLoader().load( require('@/assets/test.jpg') )

const sunDistance = 10
const tmpSph = new THREE.Spherical()
const tmpV1 = new THREE.Vector3()
const tmpV2 = new THREE.Vector3()

const vOrigin = new THREE.Vector3()
const axis = {
  x: new THREE.Vector3(1, 0, 0)
  , y: new THREE.Vector3(0, 1, 0)
  , z: new THREE.Vector3(0, 0, 1)
}

export default {
  name: 'AxialTilt'
  , props: {
    viewWidth: Number
    , viewHeight: Number
  }
  , components: {
    v3Renderer
    , v3Scene
    , v3Camera
    , v3Light
    , v3Group

    , Earth3D
    , Sun3D
    , Orbit
    , Wedge
    , v3Line
  }
  , data: () => ({
    deg: Math.PI / 180 // helper constant
    , spaceBackgroundTexture
    , origin: [0, 0, 0]
    , cameraSettings: {
      fov: 35
      , near: 1
      , far: 1000
      , position: [ 0, 30, 0 ]
    }
    , yellow: 0xdddd00
    , red: 0xdd0000
    , daysPerYear: 365
    , day: 0
    , rate: 1 / 10

    , cameraFollow: false
    , cameraTarget: 'earth'
    , cameraPivot: new THREE.Euler(0, 0, 0)
    , orthCameraPos: [ 0, 50, 50 ]

    , lightPos: [-0.01, 0, 0]
    , earthPos: [0, 0, 0]
    , earthRotation: [0, 0, 0]

    , sunDistance
    , sunPos: [sunDistance, 0, 0]

    , meanSunPos: [sunDistance, 0, 0]
    , yearRotation: [ 0, 0, 0 ]
  })
  , created(){
    this.$watch(() => {
      return this.viewWidth && this.viewHeight
    }, () => {
      this.onResize()
    })
  }
  , mounted(){
    let stop = false
    const draw = () => {
      if ( stop ) { return }
      requestAnimationFrame( draw )

      this.draw()
    }

    this.$on('hook:beforeDestroy', () => {
      stop = true
    })

    this.camera = this.$refs.camera.v3object
    this.renderer = this.$refs.renderer.renderer
    this.renderer.autoClear = false

    // controls
    let controls = this.controls = new OrbitControls( this.camera, this.renderer.domElement )

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

    this.addSkybox( 2 )

    this.spaceCam = new THREE.PerspectiveCamera( 45, this.viewWidth/this.viewHeight, 1, 100 )
    this.spaceCam.layers.set(2)
    this.$refs.cameraGroup.v3object.add(this.spaceCam)
    this.$on('hook:beforeDestroy', () => {
      this.$refs.cameraGroup.v3object.remove(this.spaceCam)
    })

    draw()
  }
  , computed: {
    timeDiffWedgeProps(){
      this.day
      if ( !this.$refs.meanSun || !this.$refs.sun ){ return {} }

      this.getWorldPosition( 'meanSun', tmpV1 )
      let x1 = tmpV1.x
      let y1 = tmpV1.z
      let len = tmpV1.length()

      this.getWorldPosition( 'sun', tmpV2 )
      tmpV2.y = 0
      tmpV2.setLength( len )

      let x2 = tmpV2.x
      let y2 = tmpV2.z

      let color = tmpV1.dot( axis.x ) > tmpV2.dot( axis.x ) ? this.red : this.yellow

      return {
        x1, y1, x2, y2
        , color
      }
    }
    , sunWorldPos(){
      this.day
      if ( !this.$refs.sun ){ return [] }
      return this.getWorldPosition( 'sun', tmpV2 ).toArray()
    }
    , sunPosProjection(){
      this.day
      if ( !this.$refs.sun ){ return [] }
      let sunPos = this.getWorldPosition( 'sun', tmpV1 )

      return sunPos.projectOnPlane( axis.y ).toArray()
    }
    , radsPerYear(){
      return (2 * Math.PI / this.daysPerYear)
    }
    , yearAngle(){
      return this.day * this.radsPerYear
    }
    , background(){
      return this.spaceBackgroundTexture
      // if (!this.renderer){ return }
      //
      // let texture = this.spaceBackgroundTexture
      // var options = {
      //  resolution: 1024
      //  , generateMipmaps: true
      //  , minFilter: THREE.LinearMipMapLinearFilter
      //  , magFilter: THREE.LinearFilter
      // }
      // texture.mapping = THREE.UVMapping
      // return new THREE.CubemapGenerator( this.$refs.renderer.renderer ).fromEquirectangular( texture, options )
    }
  }
  , methods: {
    draw(){
      // this.sunPos = this.orbit( this.sunPos, 0.001 )
      // this.meanSunPos = this.orbit( this.meanSunPos, 0.001 )
      this.day = (this.day + this.rate) % this.daysPerYear
      this.yearRotation.splice(1, 1, this.yearAngle)
      this.getWorldPosition(this.cameraTarget, this.controls.target)
      this.cameraPivot.y = this.cameraFollow ? this.yearAngle : 0
      this.controls.update()

      let renderer = this.$refs.renderer.renderer
      renderer.clear()
      this.drawBackground()
      this.$refs.renderer.draw()
    }
    , drawBackground(){
      let renderer = this.renderer
      this.spaceCam.position.copy(this.camera.position)
      this.spaceCam.rotation.copy(this.camera.rotation)
      renderer.render( this.$refs.renderer.scene, this.spaceCam )
    }
    , getWorldPosition( ref, result ){
      return this.$refs[ref].v3object.getWorldPosition( result )
    }
    , addSkybox( layer ){
      let skyGeometry = new THREE.BoxBufferGeometry(50, 50, 50)
      // let skyMaterial = new THREE.MeshBasicMaterial({ envMap: this.spaceBackgroundTexture, side: THREE.BackSide })
      let skyMaterial = new THREE.ShaderMaterial( {
        type: 'BackgroundCubeMaterial'
        , uniforms: THREE.UniformsUtils.clone( THREE.ShaderLib.cube.uniforms )
        , vertexShader: THREE.ShaderLib.cube.vertexShader
        , fragmentShader: THREE.ShaderLib.cube.fragmentShader
        , side: THREE.BackSide
        , depthTest: true
        , depthWrite: false
        , fog: false
      } )

      let skyBox = new THREE.Mesh( skyGeometry, skyMaterial )
      skyBox.geometry.removeAttribute( 'normal' )
  		skyBox.geometry.removeAttribute( 'uv' )
      skyBox.material.uniforms.tCube.value = this.background
  		skyBox.material.uniforms.tFlip.value = ( this.background.isWebGLRenderTargetCube ) ? 1 : - 1
      skyBox.onBeforeRender = function ( renderer, scene, camera ) {
        this.matrixWorld.copyPosition( camera.matrixWorld )
      }

      // enable code injection for non-built-in material
      Object.defineProperty( skyBox.material, 'map', {
        get: function () {
          return this.uniforms.tCube.value
        }
      } )

      skyBox.layers.set(layer)
      this.$refs.renderer.scene.add( skyBox )
      this.$on('hook:beforeDestroy', () => {
        this.$refs.renderer.scene.remove( skyBox )
      })
    }
    , orbit( pos ){
      tmpV1.fromArray( pos )
      tmpSph.setFromVector3( tmpV1 )
      tmpSph.theta += 0.001
      tmpV1.setFromSpherical( tmpSph )
      return tmpV1.toArray()
    }
    , onResize(){
      this.spaceCam.aspect = this.viewWidth / this.viewHeight
      this.spaceCam.updateProjectionMatrix()
    }
  }
}
</script>

<style scoped lang="sass">

.chapter
  background: $black

.controls
  position: absolute
  z-index: 1
  top: 0
  right: 0
  padding: 1rem
  background: $white
</style>
