<template>
  <div id="app">
    <v-header></v-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import VHeader from 'components/v-header/v-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'
  export default {
    components: {
      VHeader,
      Tab,
      Player
    }
  }
</script>

<style>

</style>
