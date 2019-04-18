<script>
import { calcEOT, VERNAL, PERHELION, euclideanModulo } from '@/lib/stellar-mechanics'
import { Line } from 'vue-chartjs'
import 'chartjs-plugin-annotation'

const Pi2 = Math.PI * 2
const startOfYear = new Date(2020, 0).getTime()
const yearLength = new Date(2021, 0).getTime() - startOfYear

// mean anomaly is measured from perhelion, so we want to go from jan - jan
const minAngle = -PERHELION
const maxAngle = Pi2 - PERHELION

function getDate( M ){
  return new Date(Math.round((M + PERHELION) / Pi2 * yearLength + startOfYear))
}

function getZero( x1, y1, x2, y2 ){
  let a = (y2-y1)/(x2-x1)
  let b = y1 - a * x1
  let x = -b/a

  return x
}

// input seconds
function formatDuration( n ){
  let sign = n < 0 ? '-' : ''
  n = Math.abs(n)
  let hours   = Math.floor(n / 3600)
  let minutes = Math.floor((n - (hours * 3600)) / 60)
  let seconds = n - (hours * 3600) - (minutes * 60)
  var fmt = ''

  if ( hours !== 0 ){
    fmt = hours + 'h'
  }

  if ( minutes !== 0 ){
    fmt += `${minutes}m`
  } else if ( minutes === 0 && hours === 0 ) {
    fmt = `${seconds}s`
  }

  return sign + fmt
}

export default {
  name: 'LinePlot'
  , extends: Line
  , props: {
    eccentricity: Number
    , tilt: Number
    , meanAnomaly: Number
  }
  , components: {
  }
  , data: () => ({
    chartData: {
      plugins: []
      , labels: []
      , datasets: [
        {
          label: 'Now'
          , backgroundColor: '#2888e4'
          , data: [{ x: 0, y: 0 }]
          , type: 'scatter'
          , pointRadius: 8
          , animation: {
            duration: 0
          }
        }
        , {
          label: 'Sundial Late'
          , backgroundColor: 'hsla(3, 80%, 55%, 0.5)'
          , data: [{ x: 1, y: 1 }]
          , type: 'line'
          , pointRadius: 0
          , fill: 'origin'
        }
        , {
          label: 'Sundial Early'
          , backgroundColor: 'hsla(60, 100%, 43%, 0.5)'
          , data: [{ x: 1, y: 1 }]
          , type: 'line'
          , pointRadius: 0
          , fill: 'origin'
        }
      ]
    }
    , options: {
      responsive: true
      , maintainAspectRatio: false
      // , legend: {
      //   display: false
      // }
      , animation: {
        duration: 0 // general animation time
      }
      , elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      }
      , scales: {
        xAxes: [{
          type: 'linear'
          , position: 'bottom'
          , ticks: {
            fontFamily: 'latin-modern-mono, monospace'
            , callback( v ){
              return formatDuration( v )
            }
          }
          , gridLines: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        }]
        , yAxes: [{
          type: 'time'
          , time: {
            unit: 'month'
            , stepSize: 1
            , displayFormats: {
              month: 'MMM'
            }
            , min: getDate(minAngle)
            , max: getDate(maxAngle)
          }
          , ticks: {
            fontFamily: 'latin-modern-mono, monospace'
          }
          , gridLines: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        }]
      }
      , annotation: {
        annotations: [{
          type: 'line'
          , mode: 'horizontal'
          , scaleID: 'y-axis-0'
          , value: 0
          , borderColor: 'rgba(255,255,255,0.4)'
          , borderWidth: 1
        }]
      }
    }
    , nibStyle: {}
  })
  , watch: {
    meanAnomaly(){
      this.setMarker()
      this.$data._chart.update()
    }
  }
  , created(){
    this.$watch(() => {
      return this.tilt + this.eccentricity
    }, () => {
      this.setMarker()
      this.updateData()
    })
  }
  , mounted () {
    this.renderChart(this.chartData, this.options)
    this.setMarker()
    this.updateData()
  }
  , methods: {
    setMarker(){
      let x = this.getEOT(this.meanAnomaly)
      let y = this.getDate(euclideanModulo(this.meanAnomaly, Pi2))
      this.chartData.datasets[0].data[0].x = x
      this.chartData.datasets[0].data[0].y = y
      this.$data._chart.options.annotation.annotations[0].value = y
    }

    , getEOT( M ){
      let eot = calcEOT(euclideanModulo(M, Pi2), this.eccentricity, this.tilt, PERHELION - VERNAL)
      let seconds = eot * (24 * 60 * 60) / Pi2
      return seconds
    }

    , getDate( M ){
      return getDate(M)
    }

    , updateData(){
      let ahead = []
      let behind = []
      let l = 100
      let rad = 2 * Math.PI / l
      let lastEot
      let lastM
      for ( let i = 0; i < l + 1; i++ ){
        let M = i * rad - PERHELION
        let time = this.getDate(M)
        let eot = this.getEOT(M)

        // check sign to add zero point to crispen
        if ( i !== 0 && lastEot * eot < 0 ){
          let x = getZero(lastM, lastEot, M, eot)
          let t = this.getDate(x)
          behind.push({
            x: 0
            , y: t
          })
          ahead.push({
            x: 0
            , y: t
          })
        }

        if ( eot > 0 ){
          ahead.push({
            x: eot
            , y: time
          })
          behind.push({
            x: 0
            , y: time
          })
        } else {
          behind.push({
            x: eot
            , y: time
          })
          ahead.push({
            x: 0
            , y: time
          })
        }

        lastEot = eot
        lastM = M
      }

      ahead.push({ x: 0, y: getDate(maxAngle) })
      behind.push({ x: 0, y: getDate(maxAngle) })
      this.chartData.datasets[1].data = behind
      this.chartData.datasets[2].data = ahead
      this.$data._chart.update()
    }
  }
}
</script>
