<template lang="pug">
.chapter
  ThreeScene(:width="viewWidth", :height="viewHeight", :background="spaceBackgroundTexture")
    Light(type="ambient", :intensity="0.2")
    Light(type="spot", :intensity="0.8", :position="[ 50, 0, 0 ]")
    Earth3D
</template>

<script>
// import Copilot from 'copilot'
import * as THREE from 'three'
import ThreeScene from '@/components/three-vue/three-scene'
import Light from '@/components/three-vue/light'
import Earth3D from './earth-3d'

const spaceBackgroundTexture = new THREE.CubeTextureLoader().load([
  require('./space-skybox-px.png')
  , require('./space-skybox-nx.png')
  , require('./space-skybox-py.png')
  , require('./space-skybox-ny.png')
  , require('./space-skybox-pz.png')
  , require('./space-skybox-nz.png')
])

export default {
  name: 'AxialTilt'
  , props: {
    viewWidth: Number
    , viewHeight: Number
  }
  , components: {
    ThreeScene
    , Light

    , Earth3D
  }
  , data: () => ({
    spaceBackgroundTexture
  })
  , created(){
  }
  , computed: {

  }
  , methods: {
  }
}
</script>

<style scoped lang="sass">

.chapter
  background: $black

</style>
