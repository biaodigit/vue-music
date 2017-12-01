<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input v-model="query" @focus="onFocus" :placeholder="placeholder" class="box"/>
    <i class="icon-dismiss" @click="clearQuery" v-show="query"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌手、歌曲'
      }
    },
    data() {
      return {
        query: '',
        isFocus: null
      }
    },
    methods: {
      onFocus() {
        this.$emit('onFocus')
      },
      clearQuery() {
        this.query = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "search-box.styl"
</style>
