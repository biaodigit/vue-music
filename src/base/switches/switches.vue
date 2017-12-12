<template>
  <ul class="switches">
    <li class="item" v-for="(item,index) in switches" :class="{'active': currentIndex === index}"
       @click="selectItem(index)">
      <span class="text">{{item.text}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "switches.styl"
</style>
