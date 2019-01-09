import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

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
  , dashSize: Number
  , gapSize: Number
}

export default {
  name: 'v3-line'
  , mixins: [ THREEObjectMixin ]
  , props: {
    from: {
      default: () => [0, 0, 0]
    }
    , to: {
      default: () => [1, 1, 1]
    }

    , ...threeProps
    , ...materialProps
  }
  , components: {
  }
  , data: () => ({
    geometry: null
  })
  , watch: {
    vertices(){
      if ( !this.v3object ){ return }
      this.v3object.geometry.verticesNeedUpdate = true
      this.v3object.computeLineDistances()
    }
  }
  , computed: {
    vertices(){
      if ( !this.geometry ){ return [] }
      let from = this.geometry.vertices[0]
      let to = this.geometry.vertices[1]

      from.fromArray(this.from)
      to.fromArray(this.to)

      if ( from.equals(to) ){
        to.x += 0.01
      }
      return this.geometry.vertices
    }
  }
  , methods: {
    createObject(){
      let material
      if ( this.gapSize || this.dashSize ){
        material = new THREE.LineDashedMaterial({ gapSize: this.gapSize, dashSize: this.dashSize })
      } else {
        material = new THREE.LineBasicMaterial({ transparent: true })
      }
      let geometry = this.geometry = new THREE.Geometry()
      geometry.vertices = [
        new THREE.Vector3()
        , new THREE.Vector3()
      ]

      this.v3object = new THREE.Line( geometry, material )
      this.v3object.frustumCulled = false
      this.v3object.computeLineDistances()
    }
    , updateObjects(){
      this.assignProps( this.v3object, threeProps )
      this.assignProps( this.v3object.material, materialProps )
    }
  }
}
