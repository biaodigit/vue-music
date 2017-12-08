<template>
  <transition name="slide">
    <div class="user-center" @click="back">
      <div class="back">
        <i class="icon-back"></i>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "user-center.styl"
</style>
