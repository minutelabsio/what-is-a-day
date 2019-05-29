import Copilot from 'copilot'
import { PERHELION, VERNAL, euclideanModulo, calcEOT } from '@/lib/stellar-mechanics'

const Pi2 = Math.PI * 2
const deg = Math.PI / 180

function shortestDistance( a0, a1, modulo ){
  let moduloBy2 = 0.5 * modulo
  let da = (a1 - a0) % modulo

  return (da - moduloBy2) % modulo + moduloBy2
}

// input minutes
function clockFromMinutes( n ){
  let hours   = Math.floor(n / 60)
  let minutes = Math.floor(n - (hours * 60))
  let ampm = hours >= 12 ? 'pm' : 'am'
  if ( ampm === 'pm' ){ hours -= 12 }

  hours = (hours + 11) % 12 + 1

  if ( hours < 10 ) { hours = '0' + hours }
  if ( minutes < 10 ) { minutes = '0' + minutes }

  return `${hours}:${minutes}${ampm}`
}

function meddleProps( props = [], meddleOptions = {} ){
  return props.reduce(( result, key ) => {
    result[key] = {
      get: function(){
        return this.copilotState[key]
      }
      , set: function( val ){
        if ( val === this.copilotState[key] ){ return }
        let opts = meddleOptions
        if ( val.$meddleOptions ){
          opts = val.$meddleOptions
          val = val.$value
        }
        this.frames.meddle({ [key]: val }, opts)
      }
    }
    return result
  }, {})
}

const meddleEasing = Copilot.Easing.Elastic.Out

export default {
  inject: [ 'player' ]
  , props: {
    viewWidth: Number
    , viewHeight: Number
    , playerLoading: Boolean
  }
  , data: () => ({
    deg
    , showEarthOptionsModal: false

    , cameraDragging: false
    , controlsOpen: false
    , graphOpen: false

    , paused: true
    , yearAngleDrag: false

    , playRate: 0.1

    , copilotState: {}
  })
  , computed: {
    daysPerYear(){
      return this.solarDaysPerYear + 1
    }
    , eot(){
      return this.getEOT()
    }
    , radsPerYear(){
      return (Pi2 / this.daysPerYear)
    }
    , meanAnomaly(){
      return this.day * this.radsPerYear - PERHELION
    }
    , day(){
      return this.orbitalPosition * this.daysPerYear
    }
    , dayAngle(){
      return (this.day * 360) % 360
    }
    , siderealClock(){
      const minutesPerDay = 24 * 60
      let dayFrac = (this.day + 0.5) % 1
      let minutes = minutesPerDay * dayFrac
      return clockFromMinutes( minutes )
    }
    , meanClock(){
      const minutesPerDay = 24 * 60
      // perhelion should not matter for realistic days per year
      // but need this to correct for weird days per year
      let dayFrac = (this.day * (1 - 1/this.daysPerYear) + PERHELION/Pi2 + 0.5) % 1
      let minutes = minutesPerDay * dayFrac
      return clockFromMinutes( minutes )
    }
    , solarClock(){
      const minutesPerDay = 24 * 60
      let dayFrac = (this.day * (1 - 1/this.daysPerYear) + PERHELION/Pi2 + 0.5 + this.getEOT() / Pi2) % 1
      let minutes = minutesPerDay * dayFrac
      return clockFromMinutes( minutes )
    }
    , handsOff(){
      return this.player.paused || this.copilotState.handsOff
    }
    , enableDragging(){
      return this.showSun || this.showEarthOrbits
    }
    , solarLabelAbove(){
      let camAdjust = this.cameraTheta / Pi2
      let earthIsRight = euclideanModulo(this.orbitalPosition + camAdjust, 1) < 0.5
      let topDown = this.cameraTopDown
      return (this.eot > 0) ^ earthIsRight ^ topDown
    }
    , cameraTheta(){
      let x = this.copilotState.cameraPosition.x
      let z = this.copilotState.cameraPosition.z

      return euclideanModulo(Math.atan2( z, x ), Pi2)
    }
    , cameraTopDown(){
      let y = this.copilotState.cameraPosition.y

      return y >= 0
    }
    // copilot managed
    , ...meddleProps([
      'orbitalPosition'
      , 'eccentricity'
      , 'tiltAngle'
      , 'cameraTarget'
      , 'cameraFollow'
      , 'solarDaysPerYear'
      , 'showEarthOrbits'
      , 'showSunOrbits'
      , 'showEOTWedge'
      , 'showSun'
      , 'showMeanSun'
      , 'showMonthLabels'
      , 'showSiderialDayArc'
      , 'showMeanDayArc'
      , 'showSolarDayArc'
      , 'showPM'
      , 'showGrid'

      , 'showStellarClock'
      , 'showSolarClock'
      , 'showMeanClock'
      , 'showDegrees'
    ], { relaxDelay: 1000, relaxDuration: 1000, easing: meddleEasing })
  }
  , watch: {
    handsOff(){
      this.frames.freeze( false, true )
    }
  }
  , created(){
    this.queues = []

    this.initCopilot()
    const frames = this.frames

    this.setState({ ...this.frames._defaultState })

    let smoother = Copilot.Animation.Smoothener( frames, { duration: 80 } )

    const onFrameUpdate = () => {
      var state = frames.state

      smoother.setState( state )
    }

    let lastTime = 0
    const onFrame = ( now ) => {

      this.beforeFrame()
      let state = frames.state //smoother.update()

      let dt = lastTime ? 1000/60 : lastTime - now
      lastTime = now
      this.onFrame( state, dt )
    }

    const unwatch = this.player.$watch('time', ( time ) => {
      frames.seek( time )
      this.execQueues( time )
    })

    frames.on('update', onFrameUpdate)

    this.$on('hook:mounted', () => {
      this.player.$on('frame', onFrame)
    })

    this.$on('hook:beforeDestroy', () => {
      unwatch()
      frames.off()
      this.player.$off('frame', onFrame)
    })

    // end copilot

    const stopOrbitOnPlay = () => { this.paused = true }
    this.player.$on('play', stopOrbitOnPlay)
    this.$on('hook:beforeDestroy', () => {
      this.player.$off('play', stopOrbitOnPlay)
    })
  }
  , mounted(){

  }
  , methods: {
    beforeFrame(){
      let orbitalPosition = this.orbitalPosition
      if ( this.handsOff && !this.paused ){

        orbitalPosition = orbitalPosition + this.playRate / 100
        orbitalPosition = euclideanModulo(orbitalPosition, 1)
        // ensure that the shortest path is taken to get to target
        let playerPosition = this.frames.getStateAt( this.frames.time ).orbitalPosition
        orbitalPosition = playerPosition + shortestDistance( playerPosition, orbitalPosition, 1 )
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { freeze: this.handsOff, relaxDelay: 0, relaxDuration: 1, easing: Copilot.Easing.Quadratic.InOut } }

      } else if ( this.paused && this.yearAngleDrag ){

        let targetPosition = (this.yearAngleDrag) / Pi2
        let halfYear = 0.5
        let delta = (targetPosition - orbitalPosition)
        if ( Math.abs(delta) > halfYear ){
          if ( delta > 0 ){
            delta -= 1
          } else {
            delta += 1
          }
        }
        orbitalPosition = orbitalPosition + delta * 0.05
        orbitalPosition = euclideanModulo(orbitalPosition, this.daysPerYear)
        let playerPosition = this.frames.getStateAt( this.frames.time ).orbitalPosition
        orbitalPosition = playerPosition + shortestDistance( playerPosition, orbitalPosition, 1 )
        this.orbitalPosition = { $value: orbitalPosition, $meddleOptions: { freeze: this.handsOff, relaxDelay: 1000, relaxDuration: 1000, easing: meddleEasing } }
      }
    }
    , onFrame( state ){
      this.setState( state )
    }
    , setState( state ){
      // camera
      if ( this.$refs.sim ){
        this.$refs.sim.setCameraProperties({
          position: state.cameraPosition
          // , rotation: state.cameraRotation
          , zoom: state.cameraZoom
        })
      }

      // component data
      this.copilotState = state
    }
    , dragStart(){
      this.dragging = true
      this.prevPauseState = this.paused
      this.paused = true
    }
    , drag( amount ){
      this.yearAngleDrag = this.meanAnomaly + amount
    }
    , dragEnd(){
      this.dragging = false
      this.yearAngleDrag = false
      this.paused = this.prevPauseState
    }
    , meddleCamera(params){
      let state = {}
      if ( params ){
        state.cameraPosition = params.position.clone()
        // state.cameraRotation = params.rotation.clone()
        state.cameraZoom = params.zoom
      }

      this.frames.meddle('camera', state, { relaxDelay: 1000, relaxDuration: 1000, freeze: this.handsOff || this.cameraDragging, easing: Copilot.Easing.Cubic.InOut })
    }
    , setQueue(ts, fn){
      let time = Copilot.Parsers.timeParser( ts )

      this.queues.push({
        time
        , fn
      })
    }
    , execQueues( time ){
      let lastTime = this.lastQueueTime || 0

      this.lastQueueTime = time

      if ( lastTime >= time ){
        return
      }

      this.queues.forEach( q => {
        if ( time < q.time || q.time <= lastTime ){ return }

        q.fn()
      })
    }
    , getEOT(){
      let M = this.meanAnomaly % Pi2
      let e = this.eccentricity
      let y = this.tiltAngle
      let p = PERHELION - VERNAL
      return calcEOT( M, e, y, p )
    }
  }
}
