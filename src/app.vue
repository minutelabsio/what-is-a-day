<template lang="pug">
#app
  slot
  router-view
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
#app
  min-height: 100vh
</style>
