<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/three-object.mixin'

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
  , inject: [ 'threeVue' ]
  , mixins: [ THREEObjectMixin ]
  , props: {
    ...threeProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){

    this.addTHREEObjectWatchers( this.object, threeProps )

    this.onFrame(() => {
      // earth.rotation.x += 0.01
      this.object.rotation.y += 0.01
    })
  }
  , computed: {
  }
  , methods: {
    createObject(){
      let geometry = new THREE.SphereGeometry( 1, 32, 32 )
      let texture = TextureLoader.load( textureUrl )
      let material = new THREE.MeshLambertMaterial({ transparent: false, map: texture })
      let earth = new THREE.Mesh( geometry, material )
      this.object = earth
    }
  }
}
</script>
