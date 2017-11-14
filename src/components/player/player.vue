<template>
  <div class="player" v-show="playing">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <div class="title">
            <h1 class="song" v-html="currentSong.name"></h1>
            <p class="singer" v-html="currentSong.singer"></p>
          </div>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd">
                <img class="cd-img" :src="currentSong.image">
              </div>
            </div>
            <div class="lyric-wrapper"></div>
          </div>
          <div class="middle-r"></div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper"></div>
          <div class="progress-wrapper"></div>
          <div class="handle-wrapper">
            <div class="icon left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon center">
              <i class="icon-play"></i>
            </div>
            <div class="icon right">
              <i class="icon-next"></i>
            </div>
            <div class="icon right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player border-1px-top" @click="open" v-show="fullScreen">
        <div class="icon">
          <img class="mini-img" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h1 class="name" v-html="currentSong.name"></h1>
          <p class="singer" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i class="icon-mini icon-play-mini"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      _getPosAndScale() {},
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      })
    },
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
