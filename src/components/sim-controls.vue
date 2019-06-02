<template lang="pug">
.controls.scrollbars
  .columns.is-gapless
    .column
      b-field(grouped)
        b-field
          .control
          b-dropdown
            .button.btn-dark(slot="trigger")
              b-icon.settings.icon-only(icon="cogs", pack="fa")

            b-dropdown-item.settings-content(custom)
              .sliders
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

              h6.subtitle.is-6(v-if="hasGuides") Guides
              .columns(v-if="hasGuides")
                .column.is-one-third
                  b-checkbox(v-if="showGrid !== undefined", v-model="showGridVal")
                    span Grid
                .column.is-one-third
                  b-checkbox(v-if="showEarthOrbits !== undefined", v-model="showEarthOrbitsVal")
                    span Earth Orbits
                .column.is-one-third
                  b-checkbox(v-if="showSunOrbits !== undefined", v-model="showSunOrbitsVal")
                    span Solar Orbits

              h6.subtitle.is-6(v-if="hasElements") Elements
              .columns(v-if="hasElements")
                .column.is-one-third
                  b-checkbox(v-if="showSun !== undefined", v-model="showSunVal")
                    span Sun
                .column.is-one-third
                  b-checkbox(v-if="showMeanSun !== undefined", v-model="showMeanSunVal")
                    span Mean Sun
                .column.is-one-third
                  b-checkbox(v-if="showEOTWedge !== undefined", v-model="showEOTWedgeVal")
                    span Punctuality Wedge

        b-field
          .control
            b-checkbox-button.checkbox-btn-dark(v-model="pausedVal", :disabled="!handsOff")
              b-icon.icon-only(icon="orbit")

          .control
            b-dropdown(:mobile-modal="false", :hoverable="true")
              .button.btn-dark(slot="trigger")
                b-icon(icon="clock-fast")

              b-dropdown-item.no-outline(custom)
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
    .column
      b-field(grouped)
        b-select(v-model="cameraTargetVal", icon="camera-control")
          option(value="earth") Focus Earth
          option(value="sun") Focus Sun
          option(v-if="showMeanSun !== undefined", value="meanSun") Focus Mean Sun
        b-switch(v-model="cameraFollowVal")
          | Follow Orbit

  slot
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
  , computed: {
    hasGuides(){
      return this.showGrid !== undefined ||
        this.showEarthOrbits !== undefined ||
        this.showSunOrbits !== undefined
    }
    , hasElements(){
      return this.showSun !== undefined ||
        this.showMeanSun !== undefined ||
        this.showEOTWedge !== undefined
    }
  }
  , watch: {
    paused( v ){
      this.pausedVal = v
    }
    , pausedVal( v ){
      this.$emit('update:paused', v)
    }
    , playRate( v ){
      this.playRateVal = v
    }
    , playRateVal( v ){
      this.$emit('update:playRate', v)
    }
    , graphOpen( v ){
      this.graphOpenVal = v
    }
    , graphOpenVal( v ){
      this.$emit('update:graphOpen', v)
    }
    , cameraTarget( v ){
      this.cameraTargetVal = v
    }
    , cameraTargetVal( v ){
      this.$emit('update:cameraTarget', v)
    }
    , cameraFollow( v ){
      this.cameraFollowVal = v
    }
    , cameraFollowVal( v ){
      this.$emit('update:cameraFollow', v)
    }
    , solarDaysPerYear( v ){
      this.solarDaysPerYearVal = v
    }
    , solarDaysPerYearVal( v ){
      this.$emit('update:solarDaysPerYear', v)
    }
    , eccentricity( v ){
      this.eccentricityVal = v
    }
    , eccentricityVal( v ){
      this.$emit('update:eccentricity', v)
    }
    , tiltAngle( v ){
      this.tiltAngleVal = v
    }
    , tiltAngleVal( v ){
      this.$emit('update:tiltAngle', v)
    }
    , showGrid( v ){
      this.showGridVal = v
    }
    , showGridVal( v ){
      this.$emit('update:showGrid', v)
    }
    , showEarthOrbits( v ){
      this.showEarthOrbitsVal = v
    }
    , showEarthOrbitsVal( v ){
      this.$emit('update:showEarthOrbits', v)
    }
    , showSunOrbits( v ){
      this.showSunOrbitsVal = v
    }
    , showSunOrbitsVal( v ){
      this.$emit('update:showSunOrbits', v)
    }
    , showSun( v ){
      this.showSunVal = v
    }
    , showSunVal( v ){
      this.$emit('update:showSun', v)
    }
    , showMeanSun( v ){
      this.showMeanSunVal = v
    }
    , showMeanSunVal( v ){
      this.$emit('update:showMeanSun', v)
    }
    , showEOTWedge( v ){
      this.showEOTWedgeVal = v
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
  z-index: 9
  max-height: 100%
  width: 100%
  top: 0
  right: 0
  padding: 0.25rem
  background: transparentize($background, 0.4)
  border-radius: 0 0 0 3px
  border: 1px solid $background
  border-top-width: 0
  border-right-width: 0

  .no-outline
    outline: none

  .subtitle
    text-transform: uppercase
    margin-bottom: 0.75em

  .sliders
    margin-bottom: 1.5em

  .settings
    color: lighten($yellow, 30)

  .settings-content
    @extend .no-outline

    @media screen and (min-width: 720px)
      &
        min-width: 400px

  & > .columns
    margin-bottom: -0.25rem

  .eot-graph
    position: absolute
    right: 0
    margin-top: 0.35em
    max-width: 480px
    width: 100%
    background: transparentize($background, 0.2)

  .is-grouped > .field
    margin-bottom: 0

  .field
    margin-bottom: 0.25rem

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
