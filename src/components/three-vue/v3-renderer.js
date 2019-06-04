import * as THREE from 'three'
import { CSS2DRenderer } from 'three/examples/js/renderers/CSS2DRenderer'

export default {
  name: 'v3-renderer'
  , props: {
    width: Number
    , height: Number
  }
  , components: {
  }
  , data: () => ({
  })
  , provide(){
    const threeVue = this

    return { threeVue }
  }
  , created(){

    this.afterReady(() => { this.isReady = true })

    this.renderer = new THREE.WebGLRenderer({
      alpha: true
      , antialias: true
      // , canvas: this.$el
    })
    // this.renderer.toneMapping = THREE.ReinhardToneMapping

    this.cssRenderer = new CSS2DRenderer({})

    this.$watch(() => this.width + ~this.height, () => {
      this.renderer.setSize( this.width, this.height )
      this.cssRenderer.setSize( this.width, this.height )
      this.$emit('resize')
    }, { immediate: true })
  }
  , beforeDestroy(){
    this.renderer.dispose()
  }
  , mounted(){
    // append renderers
    this.cssRenderer.domElement.style.position = 'absolute'
    this.cssRenderer.domElement.style.top = '0'
    this.cssRenderer.domElement.style.left = '0'
    this.cssRenderer.domElement.style.zIndex = '1'
    this.cssRenderer.domElement.className = 'no-events'
    this.$el.appendChild( this.renderer.domElement )
    this.$el.appendChild( this.cssRenderer.domElement )
  }
  , computed: {
  }
  , methods: {
    draw(){
      if ( !this.scene ){
        this.draw = () => {}
        throw new Error('No scene added to the renderer')
      }

      if ( !this.camera ){
        this.draw = () => {}
        throw new Error('No camera added to the renderer')
      }

      this.$emit('beforeDraw')

      this.renderer.render( this.scene, this.camera )
      this.cssRenderer.render( this.scene, this.camera )
    }
    , getObjectByName( name ){
      return this.scene.getObjectByName( name )
    }
    , afterReady( fn ){
      if ( this.isReady ){
        fn()
        return this
      }

      this.$once('hook:mounted', fn)
    }
  }
  , render(h){
    return h('div'
      , {
        style: {
          position: 'relative'
          , overflow: 'hidden'
        }
      }
      , this.$slots.default
    )
  }
}
