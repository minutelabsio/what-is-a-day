<template lang="pug">
.controls.scrollbars
  .columns
    .column
      b-field(grouped)
        b-field
          .control
            b-checkbox-button.checkbox-btn-dark(v-model="pausedVal", :disabled="!handsOff")
              b-icon.icon-only(:icon="pausedVal ? 'orbit' : 'cancel'")

          .control
            b-dropdown(:mobile-modal="false", :hoverable="true")
              .button.btn-dark(slot="trigger")
                b-icon(icon="clock-fast")

              b-dropdown-item(custom)
                label Orbit Speed
                vue-slider.slider(
                  v-model="playRateVal"
                  , tooltip-dir="left"
                  , tooltip="none"
                  , :max="1"
                  , :min="0.01"
                  , :interval="0.01"
                )

        b-field
          .control(v-if="graphOpen !== undefined")
            .button.btn-dark(@click="graphOpenVal = !graphOpenVal", :class="{ 'is-primary': graphOpenVal }")
              b-icon.icon-only(icon="chart-bell-curve")

          .control
            .button.btn-dark(@click="showEarthOptionsModal = !showEarthOptionsModal")
              b-icon.icon-only(icon="settings")

    .column
      b-field(grouped)
        b-select(v-model="cameraTargetVal", icon="camera-control")
          option(value="earth") Focus Earth
          option(value="sun") Focus Sun
          option(v-if="showMeanSun !== undefined", value="meanSun") Focus Mean Sun
        b-switch(v-model="cameraFollowVal")
          | Follow Orbit

  slot

  b-modal(:active.sync="showEarthOptionsModal", scroll="keep")
    .modal-options
      .columns
        .column
          label(v-if="useStellarDays") Stellar days per Year: {{ solarDaysPerYearVal + 1 }}
          label(v-if="!useStellarDays") Standard days per Year: {{ solarDaysPerYearVal }}
          vue-slider.slider(
            v-model="solarDaysPerYearVal"
            , tooltip-dir="left"
            , tooltip="none"
            , :max="365"
            , :min="0"
            , :interval="1"
            , :formatter="tooltipPrecisionFormatter(0)"
            , :speed="0"
          )

          template(v-if="eccentricity !== undefined")
            label Eccentricity: {{ eccentricityVal }}
            vue-slider.slider(
              v-model="eccentricityVal"
              , tooltip-dir="left"
              , tooltip="none"
              , :max="0.5"
              , :interval="0.01"
              , :formatter="tooltipPrecisionFormatter(2)"
              , :speed="0"
            )

          template(v-if="tiltAngle !== undefined")
            label Axial Tilt: {{ tiltAngleVal }}&deg;
            vue-slider.slider(
              v-model="tiltAngleVal"
              , tooltip-dir="left"
              , tooltip="none"
              , :max="90"
              , :interval="1"
              , :formatter="tooltipPrecisionFormatter(0)"
              , :speed="0"
            )

          br/

          b-field(grouped)
            b-checkbox(v-if="showGrid !== undefined", v-model="showGridVal")
              span Grid
            b-checkbox(v-if="showEarthOrbits !== undefined", v-model="showEarthOrbitsVal")
              span Earth Orbits
            b-checkbox(v-if="showSunOrbits !== undefined", v-model="showSunOrbitsVal")
              span Solar Orbits

          b-field(grouped)
            b-checkbox(v-if="showSun !== undefined", v-model="showSunVal")
              span Sun
            b-checkbox(v-if="showMeanSun !== undefined", v-model="showMeanSunVal")
              span Mean Sun
            b-checkbox(v-if="showEOTWedge !== undefined", v-model="showEOTWedgeVal")
              span Punctuality Wedge

        slot(name="modal")
</template>

<script>
import vueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

function tooltipPrecisionFormatter( p ){
  return function( v ){
    return v && v.toFixed(p)
  }
}

export default {
  name: 'SimControls'
  , props: [
    'paused'
    , 'handsOff'
    , 'playRate'
    , 'graphOpen'
    , 'cameraTarget'
    , 'cameraFollow'
    , 'solarDaysPerYear'
    , 'eccentricity'
    , 'tiltAngle'
    , 'showGrid'
    , 'showEarthOrbits'
    , 'showSunOrbits'
    , 'showSun'
    , 'showMeanSun'
    , 'showEOTWedge'

    , 'useStellarDays'
  ]
  , components: {
    vueSlider
  }
  , data(){ return {
      pausedVal: this.paused
      , playRateVal: this.playRate
      , graphOpenVal: this.graphOpen
      , cameraTargetVal: this.cameraTarget
      , cameraFollowVal: this.cameraFollow
      , solarDaysPerYearVal: this.solarDaysPerYear
      , eccentricityVal: this.eccentricity
      , tiltAngleVal: this.tiltAngle
      , showGridVal: this.showGrid
      , showEarthOrbitsVal: this.showEarthOrbits
      , showSunOrbitsVal: this.showSunOrbits
      , showSunVal: this.showSun
      , showMeanSunVal: this.showMeanSun
      , showEOTWedgeVal: this.showEOTWedge

      , showEarthOptionsModal: false
    }
  }
  , watch: {
    pausedVal( v ){
      this.$emit('update:paused', v)
    }
    , playRateVal( v ){
      this.$emit('update:playRate', v)
    }
    , graphOpenVal( v ){
      this.$emit('update:graphOpen', v)
    }
    , cameraTargetVal( v ){
      this.$emit('update:cameraTarget', v)
    }
    , cameraFollowVal( v ){
      this.$emit('update:cameraFollow', v)
    }
    , solarDaysPerYearVal( v ){
      this.$emit('update:solarDaysPerYear', v)
    }
    , eccentricityVal( v ){
      this.$emit('update:eccentricity', v)
    }
    , tiltAngleVal( v ){
      this.$emit('update:tiltAngle', v)
    }
    , showGridVal( v ){
      this.$emit('update:showGrid', v)
    }
    , showEarthOrbitsVal( v ){
      this.$emit('update:showEarthOrbits', v)
    }
    , showSunOrbitsVal( v ){
      this.$emit('update:showSunOrbits', v)
    }
    , showSunVal( v ){
      this.$emit('update:showSun', v)
    }
    , showMeanSunVal( v ){
      this.$emit('update:showMeanSun', v)
    }
    , showEOTWedgeVal( v ){
      this.$emit('update:showEOTWedge', v)
    }
  }
  , methods: {
    tooltipPrecisionFormatter
  }
}
</script>

<style scoped lang="sass">
.controls
  position: absolute
  z-index: 15
  max-height: 100%
  width: 100%
  top: 0
  right: 0
  padding: 0.75rem
  background: transparentize($background, 0.4)
  border-radius: 0 0 0 3px
  border: 1px solid $background
  border-top-width: 0
  border-right-width: 0

  & > .columns
    margin-bottom: -0.75em

  .eot-graph
    position: absolute
    right: 0
    margin-top: 0.75em
    max-width: 480px
    background: transparentize($background, 0.2)

  .level
    margin-bottom: 0

  .extra-fields
    padding-top: 1rem

  .extra-fields + .eot-graph
    margin-top: 2rem

  .slider
    margin-bottom: 0.5rem

  .checkbox:hover
    color: $text
.modal-options
  z-index: 100
  padding: 1em

  .mini-graph
    max-width: 400px
</style>
