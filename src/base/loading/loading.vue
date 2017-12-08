<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="title">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: null
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "loading.styl"
</style>
