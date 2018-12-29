import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/js/renderers/CSS2DRenderer'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

const dummyEl = document.createElement('div')

const threeProps = {
  position: {
    default: () => [0, 0, 0]
  }
  , rotation: {
    default: () => [0, 0, 0]
  }
}

export default {
  name: 'v3-dom'
  , mixins: [ THREEObjectMixin ]
  , props: {
    ...threeProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    this.v3object = new THREE.CSS2DObject( dummyEl )
  }
  , mounted(){
    this.$el.style.position = 'absolute'
    this.v3object.element = this.$el
    this.threeVue.$el.appendChild( this.$el )
  }
  , methods: {
    updateObjects(){
      this.assignProps( this.v3object, threeProps )
    }
  }
}
