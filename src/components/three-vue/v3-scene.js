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
    this.addTHREEObjectWatchers( this.scene, sceneProps )
  }
  , mounted(){
    this.threeVue.scene = this.scene
  }
  , computed: {
  }
  , methods: {
  }
}
