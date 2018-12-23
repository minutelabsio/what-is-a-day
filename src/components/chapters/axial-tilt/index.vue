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

    Group
      Earth3D(:rotation.sync="earthRotation")

    //- mean sun
    Group
      Group(:position.sync="meanSunPos")
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
    Group(:rotation="[23.4 * deg, 0, 0]")
      Group(:position.sync="sunPos")
        Light(type="spot", :intensity="0.1", :position="[1, 0, 0]")
        Light(type="spot", :intensity="0.1", :position="[-1, 0, 0]")
        Light(type="spot", :intensity="0.1", :position="[0, 1, 0]")
        Light(type="spot", :intensity="0.1", :position="[0, -1, 0]")
        Light(type="spot", :intensity="0.1", :position="[0, 0, 1]")
        Light(type="spot", :intensity="0.1", :position="[0, 0, -1]")
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
import ThreeScene from '@/components/three-vue/three-scene'
import Light from '@/components/three-vue/light'
import Group from '@/components/three-vue/group'
import Earth3D from './earth-3d'
import Sun3D from './sun-3d'
import Orbit from './orbit'

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
    ThreeScene
    , Light
    , Group

    , Earth3D
    , Sun3D
    , Orbit
  }
  , data: () => ({
    deg: Math.PI / 180 // helper constant
    , spaceBackgroundTexture
    , camera: {
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
  , created(){
  }
  , computed: {
  }
  , methods: {
    frame(){
      this.orbit( this.sunPos, 0.001 )
      this.orbit( this.meanSunPos, 0.001 )
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
