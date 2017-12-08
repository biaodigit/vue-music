<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          threshold: 100
        })

        if (this.listenScroll) {
          this.$_scroll()
        }

        if (this.pullup) {
          this.$_initPullUpLoad()
        }

        if (this.beforeScroll) {
          this.$_beforeScroll()
        }
      },
      $_scroll() {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      },
      $_initPullUpLoad() {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('pullUp')
          }
        })
      },
      $_beforeScroll() {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
