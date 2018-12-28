import * as THREE from 'three'
import THREEObjectMixin from './v3-object.mixin'

const sceneProps = {
  background: Object
}

export default {
  name: 'v3-scene'
  , mixins: [ THREEObjectMixin ]
  , props: {
    ...sceneProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    this.scene = this.v3object = new THREE.Scene()
    this.threeVue.scene = this.scene
  }
  , methods: {
    updateObjects(){
      this.assignProps( this.scene, sceneProps )
    }
  }
}
