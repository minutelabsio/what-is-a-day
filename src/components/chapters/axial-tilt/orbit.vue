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
  , dashSize: Number
  , gapSize: Number
}

export default {
  name: 'Orbit'
  , mixins: [ THREEObjectMixin ]
  , props: {
    radius: {
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
  , created(){
    let material
    if ( this.gapSize || this.dashSize ){
      material = new THREE.LineDashedMaterial({ gapSize: this.gapSize, dashSize: this.dashSize })
    } else {
      material = new THREE.LineBasicMaterial({})
    }
    let geometry = new THREE.CircleGeometry( this.radius, this.segments )

    geometry.vertices.shift()
    geometry.vertices.push(geometry.vertices[0])

    this.v3object = new THREE.LineLoop( geometry, material )
    this.v3object.computeLineDistances()

    this.addTHREEObjectWatchers( this.v3object, threeProps )
    this.addTHREEObjectWatchers( this.v3object.material, materialProps )
  }
  , updated(){
    this.object.computeLineDistances()
  }
  , computed: {
  }
  , methods: {
  }
}
</script>
