import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'
import { RenderPass } from 'three/examples/js/postprocessing/RenderPass'

const spaceBackgroundTexture = new THREE.CubeTextureLoader().load([
  require('@/assets/stars/px.png')
  , require('@/assets/stars/nx.png')
  , require('@/assets/stars/py.png')
  , require('@/assets/stars/ny.png')
  , require('@/assets/stars/pz.png')
  , require('@/assets/stars/nz.png')
])
// spaceBackgroundTexture.minFilter = THREE.LinearFilter
// spaceBackgroundTexture.minFilter = THREE.NearestFilter

export default {
  name: 'SkyBackground'
  , mixins: [ THREEObjectMixin ]
  , props: {
    layer: {
      type: Number
      , default: 2
    }
    , aspect: Number
  }
  , data: () => ({
  })
  , watch: {
    aspect: {
      handler(){
        this.spaceCam.aspect = this.aspect
        this.spaceCam.updateProjectionMatrix()
      }
      , immediate: true
    }
  }
  , beforeCreate(){
    this.spaceCam = new THREE.PerspectiveCamera( 45, 1, 1, 100 )
  }
  , created(){
    this.spaceCam.layers.set(this.layer)

    let skyGeometry = new THREE.BoxBufferGeometry(50, 50, 50)
    // let skyMaterial = new THREE.MeshBasicMaterial({ envMap: this.spaceBackgroundTexture, side: THREE.BackSide })
    let skyMaterial = new THREE.ShaderMaterial( {
      type: 'BackgroundCubeMaterial'
      , uniforms: THREE.UniformsUtils.clone( THREE.ShaderLib.cube.uniforms )
      , vertexShader: THREE.ShaderLib.cube.vertexShader
      , fragmentShader: THREE.ShaderLib.cube.fragmentShader
      , side: THREE.BackSide
      , depthTest: true
      , depthWrite: false
      , fog: false
    } )

    let skyBox = this.skyBox = new THREE.Mesh( skyGeometry, skyMaterial )
    skyBox.geometry.removeAttribute( 'normal' )
    skyBox.geometry.removeAttribute( 'uv' )
    skyBox.material.uniforms.tCube.value = spaceBackgroundTexture
    skyBox.material.uniforms.tFlip.value = ( spaceBackgroundTexture.isWebGLRenderTargetCube ) ? 1 : - 1
    skyBox.onBeforeRender = function ( renderer, scene, camera ) {
      this.matrixWorld.copyPosition( camera.matrixWorld )
    }
    this.registerDisposables([ skyGeometry, skyMaterial ])

    // enable code injection for non-built-in material
    Object.defineProperty( skyBox.material, 'map', {
      get: function () {
        return this.uniforms.tCube.value
      }
    } )

    skyBox.layers.set(this.layer)

    // stop autoclear
    // this.threeVue.renderer.autoClear = false

    let renderPass = this.renderPass = new THREE.RenderPass( this.threeVue.scene, this.spaceCam )
    this.threeVue.insertRenderPass( renderPass, 0 )

    this.$on('hook:beforeDestroy', () => {
      this.threeVue.removeRenderPass( renderPass )
    })

    this.beforeDraw(() => {
      // let renderer = this.threeVue.renderer
      let camera = this.threeVue.camera
      // renderer.clear()
      this.spaceCam.position.copy(camera.position)
      this.spaceCam.rotation.copy(camera.rotation)
      // renderer.render( this.threeVue.scene, this.spaceCam )
    })

    this.v3object = this.spaceCam
  }
  , beforeMount(){
    this.threeVue.scene.add(this.skyBox)
    this.$on('hook:beforeDestroy', () => {
      this.threeVue.scene.remove(this.skyBox)
    })
  }
}
