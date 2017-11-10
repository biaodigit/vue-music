<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{'active': currentPageIndex === index}" v-for="(item,index) in dots"></span>
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

      window.addEventListener('resize', () => {
        if (!this.slider || !this.slider.enabled) {
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slider.isInTransition) {
            this._changePageIndex()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refreshSlider()
        }, 60)
      })
    },
    activated() {
      this.slider.enable()
      let pageIndex = this.slider.getCurrentPage().pageX
      if (pageIndex > this.dots.length) {
        pageIndex = pageIndex % this.dots.length
      }
      this.slider.goToPage(pageIndex, 0, 0)
      this.currentPageIndex = pageIndex - 1
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
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex - 1
        if (this.autoPlay) {
          this._play()
        }
      },
      _play() {
        let pageIndex = this.slider.getCurrentPage().pageX + 1
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
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
