<template>
  <transition name="fade">
    <div class="toast" v-show="showFlag">
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
        setTimeout(() => {
          this.showFlag = false
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "toast.styl"
</style>
