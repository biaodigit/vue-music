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
      },
      value: Boolean
    },
    data() {
      return {
        showFlag: false
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
