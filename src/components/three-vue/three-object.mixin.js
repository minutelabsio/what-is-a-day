import { Color } from 'three'

export default {
  methods: {
    addTHREEObjectWatchers( dest, props ){
      for ( let prop of Object.keys(props) ){
        // numbers
        if ( prop in dest ){
          this.$watch( prop, ( val ) => {
            let cur = dest[prop]

            if ( cur instanceof Color ){
              if ( typeof val === 'object' ){
                cur.copy( val )
                return
              }

              cur.set( val )
              return
            }

            dest[ prop ] = val

          }, { immediate: true })
        }
      }
    }
  }
}
