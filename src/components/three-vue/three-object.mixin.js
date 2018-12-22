import {
  Color
  , Vector3
  , Euler
} from 'three'

export default {
  created(){
    if ( this.$options.name === 'ThreeScene' ){
      return
    }
    if ( !this.threeVue ){
      throw new Error('Can not find injected dependencies. Did you forget to inject?')
    }

    const parent = this.$parent.object ? this.$parent.object : this.threeVue.scene
    this.createObject()
    parent.add( this.object )
    this.$on('hook:beforeDestroy', () => {
      parent.remove( this.object )
    })
  }
  , render(h){
    return h(
      'div'
      , this.$slots.default
    )
  }
  , methods: {
    createObject(){
      throw new Error('Please implement createObject() method')
    }

    , addTHREEObjectWatchers( dest, props ){
      for ( let prop of Object.keys(props) ){
        // numbers
        if ( prop in dest ){
          this.$watch( prop, ( val ) => {
            let cur = dest[prop]

            if (
              cur instanceof Color ||
              cur instanceof Vector3 ||
              cur instanceof Euler
            ){
              if ( Array.isArray(val) ){
                cur.fromArray( val )
                this.$emit(`update:${prop}`, cur)
                return
              }

              if ( typeof val === 'object' ){
                cur.copy( val )
                this.$emit(`update:${prop}`, cur)
                return
              }

              cur.set( val )
              this.$emit(`update:${prop}`, cur)
              return
            }

            dest[ prop ] = val
            this.$emit(`update:${prop}`, val)

          }, { immediate: true })
        }
      }
    }
  }
}
