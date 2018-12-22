<template lang="pug">
.three-scene()
  slot
</template>

<script>
import _pull from 'lodash/pull'
import * as THREE from 'three'
import THREEObjectMixin from './three-object.mixin'
import TrackballControls from 'three-trackballcontrols'

const listeners = []

function onFrame( fn ){
  listeners.push(fn)
}

function removeFrameListener( fn ){
  _pull(listeners, fn)
}

const sceneProps = {
  background: Object
}

export default {
  name: 'ThreeScene'
  , mixins: [ THREEObjectMixin ]
  , props: {
    width: Number
    , height: Number

    , ...sceneProps
  }
  , provide(){
    this.scene = new THREE.Scene()
    this.addTHREEObjectWatchers( this.scene, sceneProps )
    this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 20000 )
    this.renderer = new THREE.WebGLRenderer( { alpha: true } )

    // controls
    let controls = this.controls = new TrackballControls( this.camera )

		controls.rotateSpeed = 1.0
		controls.zoomSpeed = 1.2
		controls.panSpeed = 0.8

		controls.noZoom = false
		controls.noPan = false

		controls.staticMoving = true
		controls.dynamicDampingFactor = 0.3

		controls.keys = [ 65, 83, 68 ]
    // end controls

    return {
      threeVue: {
        scene: this.scene
        , camera: this.camera
        , renderer: this.renderer
        , onFrame
        , removeFrameListener
      }
    }
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){

    this.camera.position.z = 5

    const animate = () => {
      if ( this._isDestroyed ) { return }
      requestAnimationFrame( animate )

      for ( let fn of listeners ){
        fn()
      }

      this.controls.update()

      this.renderer.render( this.scene, this.camera )
    }

    animate()

    this.$watch(() => this.width + this.height, () => {
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize( this.width, this.height )
      this.controls.handleResize()
    }, { immediate: true })
  }
  , mounted(){
    this.$el.appendChild( this.renderer.domElement )
  }
  , computed: {
  }
  , methods: {

  }
}
</script>


<style scoped lang="sass">

</style>
