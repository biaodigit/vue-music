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
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
             ref="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdPlayCls">
                <img class="cd-img" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll :data="currentLyric && currentLyric.lines" class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <ul v-if="currentLyric">
                <li class="lyric" :class="{'current': currentLineNum === index}"
                    v-for="(line,index) in currentLyric.lines" ref="lyricLine">{{line.txt}}
                </li>
              </ul>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                @percentChanging="changingPercent"
                @percentChange="changePercent" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="handle-wrapper">
            <div class="icon left" @click="changeMode">
              <i :class="iconMode"></i>
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
    <audio @play="ready"
           @error="error"
           @ended="end"
           @pause="paused"
           @timeupdate="updateTime"
           ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Lyric from 'lyric-parser'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        isPureMusic: false
      }
    },
    created() {
      this.touch = {}
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
        let paddingLeft = 40
        let paddingTop = 80
        let paddingBottom = 30
        let width = window.innerWidth * 0.8
        let x = -(window.innerWidth / 2 - paddingLeft)
        let y = window.innerHeight - paddingTop - paddingBottom - width / 2
        let scale = targetWidth / width
        return {
          x, y, scale
        }
      },
      togglePlaying() {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
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
        setTimeout(() => {
          this.songReady = true
        }, 500)
        this.canPlayLyric = true
        if (this.currentLyric && !this.isPureMusic) {
          this.currentLyric.seek(this.currentTime * 1000)
        }
      },
      error() {
        this.songReady = true
      },
      paused() {
        this.setPlayingState(false)
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
      },
      end() {
        this.currentTime = 0
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.$_next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      $_next() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex++
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
        }
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
      changingPercent(percent) {
        this.currentTime = this.currentSong.duration * percent
        if (this.currentLyric) {
          this.currentLyric.seek(this.currentTime * 1000)
        }
      },
      changePercent(percent) {
        let currentTime = this.currentSong.duration * percent
        this.currentTime = this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(this.currentTime * 1000)
        }
      },
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          this.isPureMusic = !this.currentLyric.lines.length
          if (this.playing && this.canPlayLyric && !this.isPureMusic) {
            this.currentLyric.seek(this.currentTime * 1000)
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e) {
        this.touch.moved = false
        let touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        let touch = e.touches[0]
        let moveX = touch.pageX - this.touch.startX
        let moveY = touch.pageY - this.touch.startY
        if (Math.abs(moveY) > Math.abs(moveX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + moveX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd() {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.8) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 400
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
      },
      changeMode() {
        let mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlaylist(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlaylist: 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        // 切换到随机播放模式防止歌曲暂停仍然播放
        if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
          return
        }
        this.songReady = false
        this.canPlayLyric = false
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentLyric = null
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        this.$refs.audio.src = newSong.url
        this.$refs.audio.play()
        this.getLyric()
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
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      ...mapGetters([
        'playing',
        'fullScreen',
        'currentSong',
        'playlist',
        'sequenceList',
        'currentIndex',
        'mode'
      ])
    },
    components: {
      ProgressBar,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "player.styl"
</style>
