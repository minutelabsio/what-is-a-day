import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'
// const origin = new THREE.Vector2( 0, 0 )

const threeProps = {
  position: {
    default: () => [0, 0, 0]
  }
  , rotation: {
    default: () => [0, 0, 0]
  }
}

const materialProps = {
  color: {
    default: 0xffffff
  }
  , opacity: {
    default: 1
  }
}

export default {
  name: 'Wedge'
  , mixins: [ THREEObjectMixin ]
  , props: {
    x1: {
      default: 0
    }
    , y1: {
      default: 1
    }
    , x2: {
      default: 1
    }
    , y2: {
      default: 1
    }
    , segments: {
      default: 20
    }
    , ...threeProps
    , ...materialProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    let material = new THREE.MeshBasicMaterial({ transparent: true })
    material.side = THREE.DoubleSide
    let geometry = new THREE.ShapeGeometry( this.shape, this.segments )

    this.v3object = new THREE.Mesh( geometry, material )
    this.v3object.visible = (this.v3object.geometry.faces.length > 0)
  }
  , watch: {
    shape(){
      this.v3object.geometry = new THREE.ShapeGeometry( this.shape, this.segments )
      this.v3object.visible = (this.v3object.geometry.faces.length > 0)
    }
  }
  , computed: {
    shape(){
      let first = new THREE.Vector2( this.x1, this.y1 )
      let second = new THREE.Vector2( this.x2, this.y2 )

      return new THREE.Shape([
        new THREE.Vector2( 0, 0 )
        , first
        , second
        , new THREE.Vector2( 0, 0 )
      ])
    }
  }
  , methods: {
    updateObjects(){
      this.assignProps( this.v3object, threeProps )
      this.assignProps( this.v3object.material, materialProps )
    }
  }
}
