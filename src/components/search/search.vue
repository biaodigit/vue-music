<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @onFocus="onFocus" class="box"></search-box>
      <div class="cancel" v-show="isFocus" @click="onBlur">取消</div>
    </div>
    <div class="hot-key-wrapper"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  export default {
    data() {
      return {
        isFocus: false
      }
    },
    methods: {
      onFocus() {
        this.isFocus = true
      },
      onBlur() {
        this.isFocus = false
      }
    },
    components: {
      SearchBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "search.styl"
</style>
