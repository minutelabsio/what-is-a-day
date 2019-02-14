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
    , showPM: Boolean
  }
  , components: {
  }
  , data: () => ({
  })
  , computed: {
  }
  , methods: {
    createObject(){
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

      // prime meridian
      let circleGeometry = new THREE.CircleGeometry( 1.001, 64, -Math.PI/2, Math.PI )
      circleGeometry.vertices.shift()
      let lineMaterial = new THREE.LineBasicMaterial({ color: 0xdd0000 })
      this.pm = new THREE.LineLoop( circleGeometry, lineMaterial )
      this.registerDisposables([ lineMaterial, circleGeometry ])

      earth.add(this.pm)
    }
    , updateObjects(){
      this.assignProps( this.v3object, threeProps )
      this.pm.visible = this.showPM
    }
  }
}
</script>
