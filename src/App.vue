<template>
  <div id="app">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import VHeader from 'components/v-header/v-header'
  export default {
    components: {
      VHeader
    }
  }
</script>

<style>

</style>
