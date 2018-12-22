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
    , camera: {
      type: Object // intended for modification by parent
      , default: () => ({ fov: 35, near: 1, far: 1000 })
    }

    , ...sceneProps
  }
  , provide(){
    this.scene = new THREE.Scene()
    this.addTHREEObjectWatchers( this.scene, sceneProps )

    this.$watch('camera', ( val ) => {
      this._camera = new THREE.PerspectiveCamera( 0, 0, 0, 0 )
      if ( val instanceof THREE.Camera ){
        this._camera.copy( val )
      } else {
        this._camera.fov = val.fov || 35
        this._camera.near = val.near || 1
        this._camera.far = val.far || 1000
        this._camera.position.fromArray( val.position || [0, 0, 20] )
      }
      this.$emit('update:camera', this.camera)
    }, { immediate: true })

    this.renderer = new THREE.WebGLRenderer( { alpha: true } )
    // this.renderer.toneMapping = THREE.ReinhardToneMapping

    let axesHelper = new THREE.AxesHelper( 5 )
    this.scene.add( axesHelper )

    // controls
    let controls = this.controls = new TrackballControls( this._camera )

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
        , camera: this._camera
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

    const animate = () => {
      if ( this._isDestroyed ) { return }
      requestAnimationFrame( animate )

      this.$emit('frame')

      for ( let fn of listeners ){
        fn()
      }

      this.controls.update()
      this.renderer.render( this.scene, this._camera )
    }

    this.$on('hook:mounted', animate)

    this.$watch(() => this.width + this.height, () => {
      this._camera.aspect = this.width / this.height
      this._camera.updateProjectionMatrix()
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
