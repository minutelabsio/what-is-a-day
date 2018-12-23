<script>
import * as THREE from 'three'
import THREEObjectMixin from '@/components/three-vue/three-object.mixin'

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
  , inject: [ 'threeVue' ]
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
    this.addTHREEObjectWatchers( this.object, threeProps )
    this.addTHREEObjectWatchers( this.object.material, materialProps )
  }
  , updated(){
    this.object.computeLineDistances()
  }
  , computed: {
  }
  , methods: {
    createObject(){
      let material
      if ( this.gapSize || this.dashSize ){
        material = new THREE.LineDashedMaterial({ gapSize: this.gapSize, dashSize: this.dashSize })
      } else {
        material = new THREE.LineBasicMaterial({})
      }
			let geometry = new THREE.CircleGeometry( this.radius, this.segments )

      geometry.vertices.shift()
      geometry.vertices.push(geometry.vertices[0])

      this.object = new THREE.LineLoop( geometry, material )
      this.object.computeLineDistances()
    }
  }
}
</script>
