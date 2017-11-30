<template>
  <div class="search-box">
    <div class="box-wrapper">
      <i class="icon-search"></i>
      <input v-model="query" @focus="onFocus" :placeholder="placeholder" class="box"/>
      <i class="icon-dismiss" @click="clearQuery" v-show="query"></i>
    </div>
    <div class="cancel" v-show="isFocus" @click="onBlur">取消</div>
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
        isFocus: false
      }
    },
    methods: {
      onFocus() {
        this.isFocus = true
      },
      clearQuery() {
        this.query = ''
      },
      onBlur() {
        this.isFocus = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "search-box.styl"
</style>
