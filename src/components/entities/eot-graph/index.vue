<script>
import { calcEOT } from '@/lib/stellar-mechanics'
import { Line } from 'vue-chartjs'
import 'chartjs-plugin-annotation'
import _filter from 'lodash/filter'

function getRandomInt () {
  return Math.floor(Math.random() * (50 - 5 + 1)) + 5
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
      , labels: [getRandomInt()]
      , datasets: [
        {
          label: 'Data two'
          , backgroundColor: '#bada55'
          , data: [{ x: 0, y: 0 }]
          , type: 'scatter'
          , animation: {
            duration: 0
          }
        }
        , {
          label: 'Data One'
          , backgroundColor: 'hsla(3, 80%, 55%, 0.5)'
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
      , legend: {
        display: false
      }
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
        }]
      }
      , annotation: {
        annotations: [{
          type: 'line'
          , mode: 'horizontal'
          , scaleID: 'y-axis-0'
          , value: 5
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
      let y = this.meanAnomaly
      let x = calcEOT(y, this.eccentricity, this.tilt, 0)
      this.chartData.datasets[0].data[0].x = x
      this.chartData.datasets[0].data[0].y = y
      this.options.annotation.annotations[0].value = this.meanAnomaly
    }

    , updateData(){
      let data = []
      let l = 100
      let rad = 2 * Math.PI / l
      for ( let i = 0; i < l; i++ ){
        let M = i * rad
        data.push({
          x: calcEOT(M, this.eccentricity, this.tilt, 0)
          , y: M
        })
      }
      data.push({ x: 0, y: l * rad })
      this.chartData.datasets[1].data = data
      this.$data._chart.update()
    }
  }
}
</script>
