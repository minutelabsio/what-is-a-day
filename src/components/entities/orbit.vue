<script>
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
    type: Number
    , default: 1
  }
  , dashSize: Number
  , gapSize: Number
}

export default {
  name: 'Orbit'
  , mixins: [ THREEObjectMixin ]
  , props: {
    radius: {
      // can be Array for ellipse
      default: 10
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
  , updated(){
    this.v3object.computeLineDistances()
  }
  , computed: {
    geometry(){
      let xr = this.radius
      let yr = xr

      if ( Array.isArray(this.radius) ){
        xr = this.radius[0]
        yr = this.radius[1]
      }

      let focus = xr * xr - yr * yr
      if ( focus < 0 ){
        yr = xr
        xr = this.radius[1]
        focus = -focus
      }

      focus = Math.sqrt( focus )
      let path = new THREE.Path()
      path.ellipse( focus, 0, xr, yr )
      return new THREE.Geometry().setFromPoints( path.getPoints(this.segments) )
    }
  }
  , methods: {
    createObject(){
      let material
      if ( this.gapSize || this.dashSize ){
        material = new THREE.LineDashedMaterial({ gapSize: this.gapSize, dashSize: this.dashSize })
      } else {
        material = new THREE.LineBasicMaterial({})
      }

      this.v3object = new THREE.LineLoop( this.geometry, material )
      this.v3object.computeLineDistances()
    }
    , updateObjects(){
      if ( this.v3object.geometry !== this.geometry ){
        this.v3object.geometry.dispose()
      }
      this.v3object.geometry = this.geometry
      this.assignProps( this.v3object, threeProps )
      this.assignProps( this.v3object.material, materialProps )
      this.v3object.computeLineDistances()
    }
  }
}
</script>
