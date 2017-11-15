<template>
  <div class="player" v-show="playing">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
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
            <div class="cd-wrapper" ref="cdWrapper">
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
      <div class="mini-player border-1px-top" @click="open" v-show="!fullScreen">
        <div class="icon">
          <img ref="miniImage" class="mini-img" width="40" height="40" :src="currentSong.image">
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
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform')

  export default {
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      enter(el, done) {
        let {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        let {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        const timer = setTimeout(done, 400)
        this.$refs.cdWrapper.addEventListener('transitionend', () => {
          clearTimeout(timer)
          done()
        })
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        let targetWidth = 40
        let paddingTop = 80
        let paddingLeft = 40
        let bottom = 30
        let width = window.innerWidth * 0.8
        let x = -(window.innerWidth / 2 - paddingLeft)
        let y = window.innerHeight - width / 2 - bottom - paddingTop
        let scale = targetWidth / width
        return {
          x,
          y,
          scale
        }
      },
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
