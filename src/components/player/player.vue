<template>
  <div class="player" v-show="playing">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back"></i>
          </div>
          <div class="title">
            <h1 class="song" v-html="currentSong.name"></h1>
            <p class="singer" v-html="currentSong.singer"></p>
          </div>
        </div>
        <div class="middle">
          <div class="middle-l"></div>
          <div class="middle-r"></div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'playing',
        'fullScreen',
        'currentSong'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "player.styl"
</style>
