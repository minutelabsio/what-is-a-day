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
          , data: [{ x: 1, y: 5 }]
          , type: 'scatter'
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
          , label: {
            enabled: false
            , content: 'Test label'
          }
        }]
      }
    }
    , nibStyle: {}
  })
  , created(){
    this.interval = setInterval(() => {
      this.updateData()
    }, 5000)
  }
  , beforeDestroy(){
    clearInterval(this.interval)
  }
  , mounted () {
    this.renderChart(this.chartData, this.options)
  }
  , methods: {
    updateData(){
      let data = []
      let l = 100
      let rad = 2 * Math.PI / l
      for ( let i = 0; i < l; i++ ){
        let M = i * rad
        data.push({
          x: calcEOT(M, this.eccentricity)
          , y: i
        })
      }
      data.push({ x: 0, y: 100 })
      let over = _filter(data, p => p.x >= 0)
      let under = _filter(data, p => p.x < 0)
      this.chartData.datasets[1].data = data
      this.$data._chart.update()
    }
  }
}
