<template>
  <transition name="fade">
    <div class="toast" v-show="showFlag" @click.stop @touchmove.stop.prevent>
      <div class="toast-wrapper">
        <div class="toast-content">
          <p class="text">{{text}}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      delay: {
        type: Number,
        default: 1000
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.timer = setTimeout(() => {
          this.showFlag = false
        }, this.delay)
      }
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "toast.styl"
</style>
