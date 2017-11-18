<template>
  <div class="player" v-show="playlist.length">
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
              <div class="cd" :class="cdPlayCls">
                <img class="cd-img" :src="currentSong.image">
              </div>
            </div>
            <div class="lyric-wrapper"></div>
          </div>
          <div class="middle-r"></div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper"></div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="handle-wrapper">
            <div class="icon left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
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
          <div class="imgWrapper" ref="miniWrapper">
            <img ref="miniImage" class="mini-img" :class="cdPlayCls" width="40" height="40" :src="currentSong.image">
          </div>
        </div>
        <div class="text">
          <h1 class="name" v-html="currentSong.name"></h1>
          <p class="singer" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url"
           @play="ready"
           @error="error"
           @timeupdate="updateTime"
           ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import ProgressBar from 'components/progress-bar/progress-bar'
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0
      }
    },
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      enter(el, done) {
        let {x, y, scale} = this.$_getPosAndScale()

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
        let {x, y, scale} = this.$_getPosAndScale()
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
      $_getPosAndScale() {
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
      togglePlaying() {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
      },
      next() {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playlist.length - 1) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying(true)
        }
        this.songReady = false
      },
      prev() {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying(true)
        }
        this.songReady = false
      },
      ready() {
        this.songReady = true
      },
      error() {
        this.songReady = true
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      format(time) {
        time = time | 0
        let minute = time / 60 | 0
        let second = this.$_formatTime(time % 60)
        return `${minute}:${second}`
      },
      $_formatTime(time) {
        let len = time.toString().length
        while (len < 2) {
          time = `0${time}`
          len++
        }
        return time
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      })
    },
    watch: {
      currentSong: {
        handler() {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$refs.audio.play()
          }, 800)
        },
        sync: true
      },
      playing(newPlay) {
        if (!this.songReady) {
          return
        }
        let audio = this.$refs.audio
        this.$nextTick(() => {
          newPlay ? audio.play() : audio.pause()
        })
      }
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdPlayCls() {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'playing',
        'fullScreen',
        'currentSong',
        'playlist',
        'currentIndex'
      ])
    },
    components: {
      ProgressBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "player.styl"
</style>
