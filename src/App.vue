<template>
  <div id="app">
    <v-header></v-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import VHeader from 'components/v-header/v-header'
  import Tab from 'components/tab/tab'
  export default {
    components: {
      VHeader,
      Tab
    }
  }
</script>

<style>

</style>
