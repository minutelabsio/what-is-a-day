<script>
import * as THREE from 'three'

const textureUrl = 'https://labs.minutelabs.io/Equation-of-Time/library/images/me-34-world-map.png'
const TextureLoader = new THREE.TextureLoader()
TextureLoader.crossOrigin = 'anonymous'

export default {
  name: 'Earth3D'
  , inject: [ 'threeVue' ]
  , props: {
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    const scene = this.threeVue.scene
    let geometry = new THREE.SphereGeometry( 1, 32, 32 )
    let texture = TextureLoader.load( textureUrl )
    let material = new THREE.MeshPhongMaterial({ transparent: false, map: texture })
    let earth = new THREE.Mesh( geometry, material )
    scene.add( earth )

    function animate(){
      // earth.rotation.x += 0.01
      earth.rotation.y += 0.01
    }

    this.threeVue.onFrame( animate )

    this.$on('hook:beforeDestroy', () => {
      this.threeVue.removeFrameListener( animate )
      scene.remove( earth )
    })
  }
  , computed: {
  }
  , methods: {
  }
  , render(){
    return null
  }
}
</script>
