<template>
  <div class="no-result">
    <p class="text">{{text}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "no-result.styl"
</style>
