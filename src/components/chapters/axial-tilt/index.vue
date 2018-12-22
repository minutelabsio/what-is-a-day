<template lang="pug">
.chapter
  ThreeScene(
    :width="viewWidth"
    , :height="viewHeight"
    , :background="spaceBackgroundTexture"
    , :camera.sync="camera"
    , @frame="frame"
  )
    Light(type="ambient", :intensity="0.2")

    Earth3D(:position.sync="earthPos", :rotation.sync="earthRotation")
    Group(:position.sync="sunPos", :rotation.sync="sunRotation")
      Light(type="spot", :intensity="0.8")
      Sun3D()
</template>

<script>
// import Copilot from 'copilot'
import * as THREE from 'three'
import ThreeScene from '@/components/three-vue/three-scene'
import Light from '@/components/three-vue/light'
import Group from '@/components/three-vue/group'
import Earth3D from './earth-3d'
import Sun3D from './sun-3d'

const spaceBackgroundTexture = new THREE.CubeTextureLoader().load([
  require('./space-skybox-px.png')
  , require('./space-skybox-nx.png')
  , require('./space-skybox-py.png')
  , require('./space-skybox-ny.png')
  , require('./space-skybox-pz.png')
  , require('./space-skybox-nz.png')
])

const tmpSph = new THREE.Spherical()

export default {
  name: 'AxialTilt'
  , props: {
    viewWidth: Number
    , viewHeight: Number
  }
  , components: {
    ThreeScene
    , Light
    , Group

    , Earth3D
    , Sun3D
  }
  , data: () => ({
    spaceBackgroundTexture
    , camera: {
      fov: 35
      , near: 1
      , far: 1000
      , position: [ 0, 30, 0 ]
    } // set by three scene

    , earthPos: [0, 0, 0]
    , earthRotation: [0, 0, 0]
    , sunPos: [5, 0, 0]
    , sunRotation: [0, 0, 0]
  })
  , created(){
  }
  , computed: {

  }
  , methods: {
    frame(){
      tmpSph.setFromVector3( this.sunPos )
      tmpSph.theta += 0.001
      this.sunPos.setFromSpherical( tmpSph )
    }
  }
}
</script>

<style scoped lang="sass">

.chapter
  background: $black

</style>
