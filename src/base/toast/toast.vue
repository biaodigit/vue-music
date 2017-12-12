<template>
  <div class="toast">
    <div class="mask" v-show="showFlag" @click.stop @touchmove.stop.prevent></div>
    <transition :name="currentTransition">
      <div class="toast-content" v-show="showFlag">
        <p class="text">{{text}}</p>
      </div>
    </transition>
  </div>
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
      },
      transitionPos: {
        type: String,
        default: 'middle'
      },
      value: Boolean
    },
    data() {
      return {
        showFlag: false
      }
    },
    computed: {
      currentTransition() {
        if (this.transitionPos === 'middle') {
          return 'vud-toast-middle'
        }
      }
    },
    watch: {
      showFlag(val) {
        if (val) {
          this.$emit('input', true)

          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$emit('input', false)
            this.showFlag = false
          }, this.delay)
        }
      },
      value(val) {
        this.showFlag = val
        console.log(val)
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
