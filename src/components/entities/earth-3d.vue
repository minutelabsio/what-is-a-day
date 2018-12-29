<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

const textureUrl = require('@/assets/earth.png')
const TextureLoader = new THREE.TextureLoader()
TextureLoader.crossOrigin = 'anonymous'

const threeProps = {
  position: {
    default: () => [0, 0, 0]
  }
  , rotation: {
    default: () => [0, 0, 0]
  }
}

export default {
  name: 'Earth3D'
  , mixins: [ THREEObjectMixin ]
  , props: {
    ...threeProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){

    let geometry = new THREE.SphereGeometry( 1, 32, 32 )
    let texture = TextureLoader.load( textureUrl )
    let material = new THREE.MeshToonMaterial({
      transparent: false
      , map: texture
      , shininess: 2
      , specular: 0x000000
    })
    let earth = new THREE.Mesh( geometry, material )
    this.v3object = earth
  }
  , computed: {
  }
  , methods: {
    updateObjects(){
      this.assignProps( this.v3object, threeProps )
    }
  }
}
</script>
