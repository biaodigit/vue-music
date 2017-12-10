<template>
  <transition name="fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmText}}</div>
          </div>
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
      confirmText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      value: Boolean
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm')
        this.$emit('input', false)
        this.showFlag = false
      },
      cancel() {
        this.$emit('input', false)
        this.showFlag = false
      }
    },
    watch: {
      value(val) {
        this.showFlag = val
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "confirm.styl"
</style>
