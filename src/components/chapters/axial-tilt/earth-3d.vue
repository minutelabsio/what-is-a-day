<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

const textureUrl = 'https://labs.minutelabs.io/Equation-of-Time/library/images/me-34-world-map.png'
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
    let material = new THREE.MeshLambertMaterial({ transparent: false, map: texture })
    let earth = new THREE.Mesh( geometry, material )
    this.v3object = earth

    this.addTHREEObjectWatchers( this.v3object, threeProps )

    this.beforeDraw(() => {
      // earth.rotation.x += 0.01
      this.v3object.rotation.y += 0.01
    })
  }
  , computed: {
  }
  , methods: {
  }
}
</script>
