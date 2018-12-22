<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/three-object.mixin'

// glow effect from http://kadekeith.me/stuff/three/glow/
const glowVertexShader = `
uniform vec3 viewVector;
varying float intensity;
void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
    intensity = pow( dot(normalize(viewVector), actual_normal), 6.0 );
}`

const glowFragmentShader = `
varying float intensity;
void main() {
 vec3 glow = vec3(0.8, 0.6, 0) * intensity;
   gl_FragColor = vec4( glow, 1.0 );
}`

const textureUrl = 'https://fblupi.github.io/threejs-sun-earth-and-moon/res/sol.jpg'
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
  name: 'Sun3D'
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
    const scene = this.threeVue.scene
    const camera = this.threeVue.camera

    this.addTHREEObjectWatchers( this.object, threeProps )

    let viewVector= new THREE.Vector3()

    const animate = () => {
      // glow
      this.glowMesh.getWorldPosition(viewVector).sub( camera.position )
      this.glowMesh.material.uniforms.viewVector.value = viewVector

      this.object.rotation.y += 0.001
    }

    this.threeVue.onFrame( animate )

    this.$on('hook:beforeDestroy', () => {
      this.threeVue.removeFrameListener( animate )
    })
  }
  , computed: {
  }
  , methods: {
    createObject(){
      const scene = this.threeVue.scene
      const camera = this.threeVue.camera

      let geometry = new THREE.SphereGeometry( 1, 32, 32 )
      let texture = TextureLoader.load( textureUrl )
      let material = new THREE.MeshBasicMaterial({ transparent: false, map: texture, color: 0x888888 })
      let sun = new THREE.Mesh( geometry, material )

      // glow effect
      let glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          viewVector: {
            type: 'v3'
            , value: camera.position
          }
        }
        , vertexShader: glowVertexShader
        , fragmentShader: glowFragmentShader
        , side: THREE.FrontSide
        , blending: THREE.AdditiveBlending
        , transparent: true
      })

      let glowGeometry = new THREE.SphereGeometry( 1.5, 32, 32 )
      let glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
      this.glowMesh = glowMesh
      sun.add( glowMesh )
      //

      this.object = sun
    }
  }
}
</script>
