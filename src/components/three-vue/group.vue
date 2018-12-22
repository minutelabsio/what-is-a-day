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

export default {
  name: 'Group'
  , inject: [ 'threeVue' ]
  , mixins: [ THREEObjectMixin ]
  , props: {
    ...threeProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    this.addTHREEObjectWatchers( this.object, threeProps )
  }
  , computed: {
  }
  , methods: {
    createObject(){
      this.object = new THREE.Group()
    }
  }
}
</script>
