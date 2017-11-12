<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle">
      <div class="play-wrapper">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      bgImage: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: -1
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "music-list.styl"
</style>
