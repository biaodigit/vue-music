<template>
  <transition name="fade">
    <div class="play-list" @click="hide" v-show="showFlag">
      <div class="play-list-wrapper border-1px-top">
        <div class="top"></div>
        <div class="list"></div>
        <div class="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "play-list.styl"
</style>
