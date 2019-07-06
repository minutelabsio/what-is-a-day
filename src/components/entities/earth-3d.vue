<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

const TextureLoader = new THREE.TextureLoader()
TextureLoader.crossOrigin = 'anonymous'

const textures = {
  mercury: require('@/assets/planets/mercury.png')
  , venus: require('@/assets/planets/venus.png')
  , earth: require('@/assets/planets/earth.png')
  , mars: require('@/assets/planets/mars.png')
  , jupiter: require('@/assets/planets/jupiter.png')
  , saturn: require('@/assets/planets/saturn.png')
  , neptune: require('@/assets/planets/neptune.png')
  , uranus: require('@/assets/planets/uranus.png')
}

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
    , planet: {
      type: String
      , default: 'earth'
    }
  }
  , components: {
  }
  , data: () => ({
  })
  , computed: {
    texture(){
      return TextureLoader.load( textures[this.planet] )
    }
  }
  , methods: {
    createObject(){
      let geometry = new THREE.SphereGeometry( 1, 32, 32 )
      let material = new THREE.MeshToonMaterial({
        transparent: false
        , map: this.texture
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
      this.v3object.material.map = this.texture
      this.assignProps( this.v3object, threeProps )
      this.pm.visible = this.showPM
    }
  }
}
</script>
