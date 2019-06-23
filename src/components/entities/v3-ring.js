import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/v3-object.mixin'

const Pi2 = Math.PI * 2

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

const geometryProps = {
  innerRadius: Number
  , outerRadius: Number
  , segments: {
    type: Number
    , default: 10
  }
  , radialSegments: {
    type: Number
    , default: 1
  }
  , thetaStart: {
    type: Number
    , default: 0
  }
  , thetaEnd: {
    type: Number
    , default: Math.PI * 2
  }
}

export default {
  name: 'v3-ring'
  , mixins: [ THREEObjectMixin ]
  , props: {
    ... geometryProps
    , ...threeProps
    , ...materialProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    this.dummyGeometry = new THREE.Geometry()
    let geometry = this.geometry;
    let material = new THREE.MeshBasicMaterial( { transparent: true, side: THREE.DoubleSide } );
    let mesh = new THREE.Mesh( geometry, material );

    this.v3object = mesh
    this.registerDisposables( this.dummyGeometry )
  }
  , watch: {
    geometry( geometry, oldGeometry ){
      // cleanup
      oldGeometry.dispose()

      if ( !this.v3object || !this.visible ){ return }
      this.v3object.geometry = geometry

      let start = this.thetaStart % Pi2
      let end = this.thetaEnd % Pi2

      if ( Math.abs(end - start) < 0.0001 ){
        this.v3object.visible = false
      } else {
        this.v3object.visible = true
      }
    }
  }
  , computed: {
    geometry(){
      if ( !this.visible ){ return this.dummyGeometry }
      let start = this.thetaStart % Pi2
      let end = this.thetaEnd % Pi2

      end = Math.max(start + 0.01, end)

      return new THREE.RingGeometry(
        this.innerRadius
        , this.outerRadius
        , this.segments
        , this.radialSegments
        , start
        , end
      )
    }
  }
  , methods: {
    updateObjects(){
      this.assignProps( this.v3object, threeProps )
      this.assignProps( this.v3object.material, materialProps )
    }
  }
}
