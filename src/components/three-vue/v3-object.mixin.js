import {
  Color
  , Vector3
  , Euler
} from 'three'

export default {
  inject: [ 'threeVue' ]
  , beforeMount(){
    if ( !this.v3object ){
      throw new Error('Please set component v3object property')
    }

    const parent = this.$parent.v3object

    if ( !parent ){ return }

    parent.add( this.v3object )
    this.$on('hook:beforeDestroy', () => {
      parent.remove( this.v3object )
    })
  }
  , render(h){
    this.updateObjects()
    return h(
      'div'
      , this.$slots.default
    )
  }
  , methods: {

    updateObjects(){
      // abstract
    }

    // add frame listner
    , beforeDraw( fn ){
      this.threeVue.$on( 'beforeDraw', fn )

      this.$on('hook:beforeDestroy', () => {
        this.threeVue.$off( 'beforeDraw', fn )
      })
    }

    , assignProps( dest, props ){
      for ( let prop of Object.keys(props) ){
        if ( prop in dest ){
          let val = this[prop]
          let cur = dest[prop]

          if (
            cur instanceof Color ||
            cur instanceof Vector3 ||
            cur instanceof Euler
          ){
            if ( Array.isArray(val) ){
              cur.fromArray( val )
              this.$emit(`update:${prop}`, cur)
            } else if ( typeof val === 'object' ){
              cur.copy( val )
              this.$emit(`update:${prop}`, cur)
            } else {
              cur.set( val )
              this.$emit(`update:${prop}`, cur)
            }
          } else {
            dest[ prop ] = val
            this.$emit(`update:${prop}`, val)
          }
        }
      }
    }
  }
}
