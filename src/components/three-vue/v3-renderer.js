import * as THREE from 'three'

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

    this.renderer = new THREE.WebGLRenderer({
      alpha: true
      , antialias: true
      // , canvas: this.$el
    })
    // this.renderer.toneMapping = THREE.ReinhardToneMapping

    this.$watch(() => this.width + this.height, () => {
      this.renderer.setSize( this.width, this.height )
      this.$emit('resize')
    }, { immediate: true })
  }
  , mounted(){
    // append renderer and cleanup
    this.$el.parentNode.appendChild( this.renderer.domElement )
    this.$el.parentNode.removeChild( this.$el )
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
    }
  }
  , render(h){
    return h('div', this.$slots.default)
  }
}
