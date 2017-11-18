<template>
  <div class="progress-bar">
    <div class="bar-inner" ref="progressBar">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           @touchstart="touchStart"
           @touchmove="touchMove"
           @touchend="touchEnd"
           ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform')
  const progressBtnWidth = 16

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      setProgressOffset(percent) {
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let progressWidth = percent * barWidth
        this.$_offset(progressWidth)
      },
      $_offset(width) {
        this.$refs.progress.style.width = `${width}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${width}px,0,0)`
      },
      touchStart() {},
      touchMove() {},
      touchEnd() {}
    },
    watch: {
      percent(newPercent) {
        this.setProgressOffset(newPercent)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "progress-bar.styl"
</style>
