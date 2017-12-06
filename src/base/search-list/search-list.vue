<template>
  <scroll :data="searches" class="search-list" ref="scroll">
    <transition-group name="list" class="list" tag="ul">
      <li :key="item" @click="selectItem(item)" v-for="item in searches" class="search-item">
        <span class="text">{{item}}</span>
        <span @click.stop="deleteItem(item)" class="delete">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'

  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteItem(item) {
        this.$emit('delete', item)
      },
      refresh() {
        this.$refs.scroll.refresh()
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "search-list"
</style>
