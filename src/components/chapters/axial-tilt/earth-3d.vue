<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

const textureUrl = require('@/assets/me-34-world-map.png')
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
      , shininess: 0
    })
    let earth = new THREE.Mesh( geometry, material )
    this.v3object = earth

    this.beforeDraw(() => {
      // earth.rotation.x += 0.01
      this.v3object.rotation.y += 0.01
    })
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
