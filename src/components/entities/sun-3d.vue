<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

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
uniform vec3 color;
varying float intensity;
void main() {
  vec3 glow = color * intensity;
  gl_FragColor = vec4( glow, 1.0 );
}`

const textureUrl = require('@/assets/sol.jpg')
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
  , mixins: [ THREEObjectMixin ]
  , props: {
    isMean: Boolean

    , ...threeProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    let material
    let bloomColor
    let radius = 1

    if ( this.isMean ){
      radius = 0.99
      bloomColor = 0xbb0000
      material = new THREE.MeshBasicMaterial({
        transparent: true
        , color: 0xaa2222
      })
      material.opacity = 0.3
      material.depthTest = false
    } else {
      bloomColor = 0xbbaa00
      material = new THREE.MeshBasicMaterial({
        transparent: false
        , map: TextureLoader.load( textureUrl )
        , color: 0xeeeeee
      })
    }

    let geometry = new THREE.SphereGeometry( radius, 32, 32 )
    let sun = new THREE.Mesh( geometry, material )
    this.v3object = sun

    if ( true || this.isMean ){
      return
    }

    // glow effect
    let glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewVector: {
          type: 'v3'
          , value: 1.0
        }
        , color: {
          type: 'v3'
          , value: new THREE.Color( bloomColor )
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

    let viewVector= new THREE.Vector3()

    this.beforeDraw(() => {
      // glow
      const camera = this.threeVue.camera

      this.glowMesh.getWorldPosition(viewVector).sub( camera.position )
      this.glowMesh.material.uniforms.viewVector.value = viewVector

      this.v3object.rotation.y += 0.001
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
