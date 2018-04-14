<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{'active': currentPageIndex === index}" v-for="(dot,index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20)
    },
    activated() {
      this.slider.enable()
      let index = this.slider.getCurrentPage().pageX
      if (index > this.dots.length) {
        index = index % this.dots.length
      }
      this.slider.goToPage(index, 0, 0)
      this.currentPageIndex = index - 1
      if (this.autoPlay) {
        this._play()
      }
    },
    methods: {
      refreshSlider() {
        this._setSliderWidth(true)
        this.slider.refresh()
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let children = this.children[i]
          addClass(children, 'slider-item')

          width += sliderWidth
          children.style.width = `${sliderWidth}px`
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = `${width}px`
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })

        this.slider.on('scrollEnd', this._changePageIndex)
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _changePageIndex() {
        this.currentPageIndex = this.slider.getCurrentPage().pageX - 1
        if (this.autoPlay) {
          this._play()
        }
      },
      _play() {
        let index = this.slider.getCurrentPage().pageX + 1
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.goToPage(index, 0, 400)
        }, this.interval)
      }
    },
    deactivated() {
      this.slider.disable()
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      this.slider.disable()
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "slider.styl"
</style>
