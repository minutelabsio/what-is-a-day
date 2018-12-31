import * as THREE from 'three'

export default {
  name: 'Gestures'
  , inject: [ 'threeVue' ]
  , props: {
    names: Array
  }
  , components: {
  }
  , data: () => ({
    dragging: false
    , monitored: []
  })
  , created(){
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
  }
  , mounted(){

    const updateMonitored = () => {
      if (!this.names){
        this.monitored = []
        return
      }

      let names = this.names

      function collectNamedChildren( result, obj ){
        if ( !obj ){ return result }

        if ( names.indexOf(obj.name) > -1 ){
          result.push( obj )
        }

        return obj.children.reduce( collectNamedChildren, result )
      }

      this.monitored = this.threeVue.scene.children.reduce( collectNamedChildren, [] )
    }

    this.threeVue.$on('scene:changed', updateMonitored)
    this.$on('beforeDestroy', () => {
      this.threeVue.$off('scene:changed', updateMonitored)
    })

    updateMonitored()

    this.listen('mousemove', e => this.onMouseMove( e ))
    this.listen('mousedown', e => this.onMouseDown( e ))
    this.listen('mouseup', e => this.onMouseUp( e ))
  }
  , render(){
    return null
  }
  , methods: {
    listen( name, fn ){
      let el = this.threeVue.renderer.domElement

      el.addEventListener(name, fn, { passive: true })
      this.$on('hook:beforeDestroy', () => {
        el.removeEventListener(name, fn)
      })
    }
    , getMousePos( e ){
      let mouse = this.mouse
      let elOffset = this.threeVue.renderer.domElement.getBoundingClientRect()
      let x = e.clientX - elOffset.left
      let y = e.clientY - elOffset.top

      mouse.x = ( x / elOffset.width ) * 2 - 1
      mouse.y = - ( y / elOffset.height ) * 2 + 1

      return mouse
    }
    , raycast( pos ){
      const camera = this.threeVue.camera
      const raycaster = this.raycaster

      if ( !camera ){ return [] }

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera( pos, camera )

      // calculate objects intersecting the picking ray
      return raycaster.intersectObjects( this.monitored )
    }
    , onMouseDown( e ){
      let pos = this.getMousePos( e )
      let intersects = this.raycast( pos )

      if ( !intersects.length ){ return }

      let ray = this.raycaster.ray.clone()

      this.dragging = true

      this.$emit('dragstart', { intersects, ray })
    }
    , onMouseUp( e ){
      let pos = this.getMousePos( e )
      let intersects = this.raycast( pos )

      if ( !this.dragging && !intersects.length ){ return }

      let ray = this.raycaster.ray.clone()

      this.dragging = false

      this.$emit('dragend', { intersects, ray })
    }
    , onMouseMove( e ){
      let pos = this.getMousePos( e )
      let intersects = this.raycast( pos )

      let ray = this.raycaster.ray.clone()

      if ( this.dragging ){
        this.$emit('drag', { intersects, ray })
      } else {
        this.$emit('hover', { intersects, ray })
      }
    }
  }
}
