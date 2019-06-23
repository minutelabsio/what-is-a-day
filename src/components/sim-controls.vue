<template lang="pug">
.controls.scrollbars
  .columns.is-gapless
    .column.is-narrow
      b-field(grouped)
        b-field
          .control
            b-dropdown
              .button.btn-dark(slot="trigger", :class="{ pulse: highlight === 'settings' }")
                b-icon.settings.icon-only(icon="tune")

              b-dropdown-item.close.is-hidden-tablet
                b-icon(icon="close")

              b-dropdown-item.settings-content(custom)
                .presets(v-if="showPresets")
                  b-field(grouped, position="is-right")
                    b-dropdown
                      .button.btn-dark.preset-btn(slot="trigger")
                        b-icon(icon="earth")
                        span Preset
                        b-icon(icon="menu-down")

                      b-dropdown-item.no-outline(v-for="(item,name) in presets", :key="name", @click="preset = item")
                        label {{ name }}
                      hr.dropdown-divider
                      b-dropdown-item.no-outline(@click="presetCaveatsModal = true")
                        b-icon(icon="alert", size="is-small")
                        span &nbsp;Read caveats...
                .sliders
                  b-field(v-if="useStellarDays", grouped)
                    .control
                      .button.is-static.is-small Stellar days per Year
                    b-input.small-input(type="number", :value="solarDaysPerYearVal + 1", @input="updateStellarDays" size="is-small", step="1", min="1", max="366")
                  b-field(v-if="!useStellarDays", grouped)
                    .control
                      .button.is-static.is-small Standard days per Year
                    b-input.small-input(type="number", v-model="solarDaysPerYearVal", size="is-small", step="1", min="0", max="365")
                  vue-slider.slider(
                    v-model="solarDaysPerYearVal"
                    , :dotSize="19"
                    , :height="8"
                    , tooltip-dir="left"
                    , tooltip="none"
                    , :max="365"
                    , :min="0"
                    , :interval="1"
                    , :formatter="tooltipPrecisionFormatter(0)"
                    , :speed="0"
                  )

                  template(v-if="eccentricity !== undefined")
                    b-field(grouped)
                      .control
                        .button.is-static.is-small Eccentricity
                      b-input.small-input(type="number", v-model="eccentricityVal", size="is-small", step="any", min="0", max="0.5")
                    vue-slider.slider(
                      v-model="eccentricityVal"
                      , :dotSize="19"
                      , :height="8"
                      , tooltip-dir="left"
                      , tooltip="none"
                      , :max="0.5"
                      , :interval="0.01"
                      , :formatter="tooltipPrecisionFormatter(2)"
                      , :speed="0"
                    )

                  template(v-if="tiltAngle !== undefined")
                    b-field(grouped)
                      .control
                        .button.is-static.is-small Axial Tilt &deg;
                      b-input.small-input(type="number", v-model="tiltAngleVal", size="is-small", step="any", min="0", max="180")
                    vue-slider.slider(
                      v-model="tiltAngleVal"
                      , :dotSize="19"
                      , :height="8"
                      , tooltip-dir="left"
                      , tooltip="none"
                      , :max="180"
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

                h6.subtitle.is-6(v-if="hasClocks") Clocks
                .columns(v-if="hasClocks")
                  .column.is-one-third
                    b-checkbox(v-if="showStellarClock !== undefined", v-model="showStellarClockVal")
                      span Stellar Clock
                  .column.is-one-third
                    b-checkbox(v-if="showSolarClock !== undefined", v-model="showSolarClockVal")
                      span Solar Clock
                  .column.is-one-third
                    b-checkbox(v-if="showMeanClock !== undefined", v-model="showMeanClockVal")
                      span Mean Time Clock

        b-field
          .control
            b-checkbox-button.checkbox-btn-dark(v-model="pausedVal", :disabled="!handsOff", :class="{ pulse: highlight === 'auto-orbit' }")
              b-icon.icon-only(icon="orbit")

          .control
            b-dropdown(:mobile-modal="false", :hoverable="false")
              .button.btn-dark(slot="trigger", :class="{ pulse: highlight === 'orbit-speed' }")
                b-icon(icon="clock-fast")

              b-dropdown-item.no-outline(custom)
                label Orbit Speed
                vue-slider.slider(
                  v-model="playRateVal"
                  , :dotSize="19"
                  , :height="8"
                  , tooltip-dir="left"
                  , tooltip="none"
                  , :max="1"
                  , :min="0.01"
                  , :interval="0.01"
                )

        b-field
          .control(v-if="graphOpen !== undefined")
            .button.btn-dark(@click="graphOpenVal = !graphOpenVal", :class="{ 'is-primary': graphOpenVal, pulse: highlight === 'graph' }")
              b-icon.icon-only(icon="chart-bell-curve")

        b-field.is-hidden-tablet(expanded, position="is-right", grouped)
          b-dropdown(:mobile-modal="false", position="is-bottom-left", ref="mobileControls")
            .button.btn-dark(slot="trigger")
              b-icon(icon="dots-vertical")

            b-dropdown-item.no-outline(custom)
              b-select(v-model="cameraTargetVal", icon="camera-control", :class="{ pulse: highlight === 'camera-target' }")
                option(value="earth") Focus Earth
                option(value="sun") Focus Sun
                option(v-if="showMeanSun !== undefined", value="meanSun") Focus Mean Sun
            b-dropdown-item.no-outline(custom)
              b-switch(v-model="cameraFollowVal", :class="{ pulse: highlight === 'follow-orbit' }")
                | Follow Orbit
            b-dropdown-item.no-outline(custom)
              slot(name="nav")
              router-link.button.btn-dark(:to="{ name: 'about' }")
                b-icon(icon="information")
                span About

    .column.is-hidden-mobile
      b-field(grouped)
        b-select(v-model="cameraTargetVal", icon="camera-control", :class="{ pulse: highlight === 'camera-target' }")
          option(value="earth") Focus Earth
          option(value="sun") Focus Sun
          option(v-if="showMeanSun !== undefined", value="meanSun") Focus Mean Sun
        b-switch(v-model="cameraFollowVal", :class="{ pulse: highlight === 'follow-orbit' }")
          | Follow Orbit

    .column.has-text-right.is-hidden-mobile
      slot(name="nav")
      router-link.button.btn-dark(:to="{ name: 'about' }")
        b-icon(icon="information")
        span About

  slot

  b-modal(:active.sync="presetCaveatsModal")
    .preset-caveats.content
      h4.title.is-4 A note about other planets... (and dwarf planets)
      p.
        The planet presets set their eccentricity and axial tilt. But
        reality is even more complicated than we let on! You might have been
        suspicious about the fact that we use round numbers for the "days per year".
        Turns out, the earth is very close to 365 days per year, so we can round it off
        for simplicity. But other planets, especially, don't have nice round numbers
        like this... bummer &mdash; I mean, how interesting....
      p.
        Also, Venus, Uranus, and Pluto have axial tilts that are more than 90 degrees!
        What does this mean? It means they actually spin in the <em>opposite</em> direction.
        This makes things more complicated for the simulation, which wasn't designed
        with retrograde rotation in mind... but I'm not going to stop you playing around.

</template>

<script>
import vueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

function tooltipPrecisionFormatter( p ){
  return function( v ){
    return v && v.toFixed(p)
  }
}

const year = 365.256

const presets = {
  Mercury: {
    name: 'Mercury'
    , dpy: 87.969 * 24 / 4222.6
    , eccentricity: 0.2056
    , tilt: 0.01
  }
  , Venus: {
    name: 'Venus'
    , dpy: 224.701 * 24 / 2802.0
    , eccentricity: 0.0068
    , tilt: 177.4
  }
  , Earth: {
    name: 'Earth'
    , dpy: year
    , eccentricity: 0.0167
    , tilt: 23.439
  }
  , Mars: {
    name: 'Mars'
    , dpy: 686.98 * 24 / 24.7
    , eccentricity: 0.0934
    , tilt: 25.19
  }
  , Jupiter: {
    name: 'Jupiter'
    , dpy: 11.862 * year * 24 / 9.9
    , eccentricity: 0.0484
    , tilt: 3.13
  }
  , Saturn: {
    name: 'Saturn'
    , dpy: 29.457 * year * 24 / 10.7
    , eccentricity: 0.0542
    , tilt: 26.73
  }
  , Uranus: {
    name: 'Uranus'
    , dpy: 84.011 * year * 24 / 17.2
    , eccentricity: 0.0472
    , tilt: 97.77
  }
  , Neptune: {
    name: 'Neptune'
    , dpy: 164.79 * year * 24 / 16.1
    , eccentricity: 0.0086
    , tilt: 28.32
  }
  , Pluto: {
    name: 'Pluto'
    , dpy: 247.68 * year * 24 / 153.3
    , eccentricity: 0.2488
    , tilt: 119.61
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

    , 'showStellarClock'
    , 'showSolarClock'
    , 'showMeanClock'

    , 'useStellarDays'
    , 'showPresets'
    , 'highlight'
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

      , showStellarClockVal: this.showStellarClock
      , showSolarClockVal: this.showSolarClock
      , showMeanClockVal: this.showMeanClock

      , showEarthOptionsModal: false

      , presetCaveatsModal: false
      , preset: presets.Earth
      , presets
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
    , hasClocks(){
      return this.showStellarClock !== undefined ||
        this.showSolarClock !== undefined ||
        this.showMeanClock !== undefined
    }
  }
  , watch: {
    preset( p ){
      this.eccentricityVal = p.eccentricity
      this.tiltAngleVal = p.tilt
      // this.solarDaysPerYearVal = p.dpy
    }
    , highlight( name ){
      if ( name === 'camera-target' || name === 'follow-orbit' ){
        this.$refs.mobileControls.toggle()
      }
    }
    , paused( v ){
      this.pausedVal = v
    }
    , pausedVal( v ){
      this.$emit('update:paused', v)
    }
    , playRate( v ){
      this.playRateVal = v
    }
    , playRateVal( v ){
      this.$emit('update:playRate', +v)
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
      this.$emit('update:solarDaysPerYear', +v)
    }
    , eccentricity( v ){
      this.eccentricityVal = v
    }
    , eccentricityVal( v ){
      this.$emit('update:eccentricity', +v)
    }
    , tiltAngle( v ){
      this.tiltAngleVal = v
    }
    , tiltAngleVal( v ){
      this.$emit('update:tiltAngle', +v)
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
    , showStellarClock( v ){
      this.showStellarClockVal = v
    }
    , showStellarClockVal( v ){
      this.$emit('update:showStellarClock', v)
    }
    , showSolarClock( v ){
      this.showSolarClockVal = v
    }
    , showSolarClockVal( v ){
      this.$emit('update:showSolarClock', v)
    }
    , showMeanClock( v ){
      this.showMeanClockVal = v
    }
    , showMeanClockVal( v ){
      this.$emit('update:showMeanClock', v)
    }
  }
  , methods: {
    tooltipPrecisionFormatter
    , updateStellarDays(value){
      this.solarDaysPerYearVal = Math.max(value - 1, 0)
    }
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

  & > .columns.is-gapless
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

  .dropdown.is-active .preset-btn
    color: $text

  .button.is-static
    background: $background
    color: $text
    border-color: transparent
    padding-left: 0

  .small-input
    width: 5em

  .presets
    margin-bottom: 1em

.modal-options
  z-index: 100
  padding: 1em

  .mini-graph
    max-width: 400px

.preset-caveats
  background: $background
  padding: 3rem
  border: 1px solid black
</style>
