<template>
  <div id="app">
    <slot/>
    <router-view/>
  </div>
</template>

<script>
// import PubSub from '@/lib/pubsub'

export default {
  name: 'App'
  , data: () => ({
  })
}
</script>

<style lang="sass" scoped>
@import '@/styles/_variables.scss'
</style>
