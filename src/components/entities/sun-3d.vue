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
uniform float opacity;
varying float intensity;
void main() {
  vec3 glow = color * intensity;
  gl_FragColor = vec4( glow, opacity );
}`

const textureUrl = require('@/assets/sol.png')
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
      // material.depthTest = false
      material.depthWrite = false
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
    this.registerDisposables([ material, geometry ])

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
        , opacity: {
          type: 'float'
          , value: 1.0
        }
      }
      , vertexShader: glowVertexShader
      , fragmentShader: glowFragmentShader
      , side: THREE.FrontSide
      , blending: THREE.AdditiveBlending
      , transparent: true
    })
    glowMaterial.depthWrite = false

    let glowGeometry = new THREE.SphereGeometry( 1.5, 32, 32 )
    let glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    this.glowMesh = glowMesh
    sun.add( glowMesh )
    this.registerDisposables([ glowMaterial, glowGeometry ])
    //

    let viewVector = new THREE.Vector3()
    let camDir = new THREE.Vector3()

    this.beforeDraw(() => {
      // glow
      const camera = this.threeVue.camera

      this.glowMesh.getWorldPosition(viewVector)
        .sub( camera.position )
        // for orthographic cam
        .projectOnVector( camera.getWorldDirection(camDir) )
      this.glowMesh.material.uniforms.viewVector.value = viewVector
      this.glowMesh.material.uniforms.opacity.value = material.opacity
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
