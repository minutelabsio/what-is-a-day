<template lang="pug">
.chapter
  v3-renderer(
    ref="renderer"
    , :width="viewWidth"
    , :height="viewHeight"
  )
    v3-camera(ref="camera", type="perspective", :aspect="viewWidth / viewHeight", v-bind="cameraSettings")
    v3-scene(
      :background="spaceBackgroundTexture"
    )
      v3-light(type="ambient", :intensity="0.2")

      v3-group
        Earth3D(:rotation.sync="earthRotation")

      //- mean sun
      v3-group
        v3-group(:position.sync="meanSunPos")
          Sun3D(:isMean="true")
        Orbit(
          :radius="1.01"
          , :segments="100"
          , :rotation="[Math.PI/2, 0, 0]"
          , :color="0xcc0000"
        )
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, 0, 0]"
          , :dash-size="0.25"
          , :gap-size="0.15"
          , :color="0x666666"
        )
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, 0, 0]"
          , :color="0xcc0000"
        )
      //- true sun
      v3-group(:rotation="[23.4 * deg, 0, 0]")
        v3-group(:position.sync="sunPos")
          v3-light(type="spot", :intensity="0.1", :position="[1, 0, 0]")
          v3-light(type="spot", :intensity="0.1", :position="[-1, 0, 0]")
          v3-light(type="spot", :intensity="0.1", :position="[0, 1, 0]")
          v3-light(type="spot", :intensity="0.1", :position="[0, -1, 0]")
          v3-light(type="spot", :intensity="0.1", :position="[0, 0, 1]")
          v3-light(type="spot", :intensity="0.1", :position="[0, 0, -1]")
          Sun3D()
        Orbit(
          :radius="1.01"
          , :segments="100"
          , :rotation="[Math.PI/2, 0, 0]"
          , :color="0xeedd00"
        )
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, 0, 0]"
          , :dash-size="0.25"
          , :gap-size="0.15"
          , :color="0x666666"
        )
        Orbit(
          :radius="sunDistance"
          , :segments="50"
          , :rotation="[Math.PI/2, 0, 0]"
          , :color="0xeedd00"
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
const OrbitControls = require('three-orbit-controls')(THREE)

const spaceBackgroundTexture = new THREE.CubeTextureLoader().load([
  require('./space-skybox-px.png')
  , require('./space-skybox-nx.png')
  , require('./space-skybox-py.png')
  , require('./space-skybox-ny.png')
  , require('./space-skybox-pz.png')
  , require('./space-skybox-nz.png')
])

const sunDistance = 10
const tmpSph = new THREE.Spherical()

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
  }
  , data: () => ({
    deg: Math.PI / 180 // helper constant
    , spaceBackgroundTexture
    , cameraSettings: {
      fov: 35
      , near: 1
      , far: 1000
      , position: [ 0, 30, 0 ]
    } // set by three scene

    , earthPos: [0, 0, 0]
    , earthRotation: [0, 0, 0]

    , sunDistance
    , sunPos: [sunDistance, 0, 0]

    , meanSunPos: [sunDistance, 0, 0]
  })
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

    // controls
    let controls = this.controls = new OrbitControls( this.$refs.camera.v3object )

		controls.rotateSpeed = 0.2
		controls.zoomSpeed = 1.2
		controls.panSpeed = 0.8

		controls.enableZoom = true
		controls.enablePan = false

		// controls.staticMoving = true
    controls.enableDamping = true
		controls.dampingFactor = 0.1
    // end controls

    draw()
  }
  , computed: {
  }
  , methods: {
    draw(){
      this.orbit( this.sunPos, 0.001 )
      this.orbit( this.meanSunPos, 0.001 )
      this.controls.update()
      this.$refs.renderer.draw()
    }
    , orbit( pos ){
      tmpSph.setFromVector3( pos )
      tmpSph.theta += 0.001
      pos.setFromSpherical( tmpSph )
    }
  }
}
</script>

<style scoped lang="sass">

.chapter
  background: $black

</style>
