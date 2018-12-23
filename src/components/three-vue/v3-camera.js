import {
  OrthographicCamera
  , PerspectiveCamera
} from 'three'
import THREEObjectMixin from './v3-object.mixin'

const Types = {
  orthographiccamera: ({ left, right, top, bottom, near, far }) => new OrthographicCamera( left, right, top, bottom, near, far )
  , perspectivecamera: ({ fov, aspect, near, far }) => new PerspectiveCamera( fov, aspect, near, far )
}

const watchableProps = {
  fov: {
    type: Number
    , default: 45
  }
  , aspect: {
    type: Number
    , default: 1
  }
  , near: {
    type: Number
    , default: 1
  }
  , far: {
    type: Number
    , default: 1000
  }
  , left: Number
  , right: Number
  , top: Number
  , bottom: Number

  , zoom: {
    type: Number
    , default: 1
  }

  , position: {
    default: () => [ 0, 0, 0 ]
  }
  , rotation: {
    default: () => [ 0, 0, 0 ]
  }
}

export default {
  name: 'v3-camera'
  , mixins: [ THREEObjectMixin ]
  , props: {
    type: {
      type: String
      , default: 'perspective'
    }

    , ...watchableProps
  }
  , components: {
  }
  , data: () => ({
  })
  , created(){
    const camera = this.camera = this.cameraConstructor( this )
    camera.position.z = 1

    this.v3object = camera
  }
  , mounted(){
    this.threeVue.camera = this.v3object
  }
  , computed: {
    cameraConstructor(){
      let name = this.type.toLowerCase()
      return Types[ name + 'camera' ] || Types[ name ]
    }
  }
  , render(){
    this.assignProps( this.v3object, watchableProps )
    // TODO not optimal
    this.v3object.updateProjectionMatrix()
    return null
  }
  , methods: {
  }
}
