<template>
  <scroll :data="singers" class="singer-type" ref="scroll">
    <ul class="list">
      <li @click="selectItem(item,index)" class="item" v-for="(item,index) in singers">
        <img class="avatar" v-show="type || index < 8" v-lazy="item.avatar">
        <span class="name" :class="noImage(index)">{{item.name}}</span>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    props: {
      singers: {
        type: Array,
        default: []
      },
      type: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      let list = document.querySelectorAll('.item')
      console.log(list)
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
      noImage(index) {
        if (this.type || index < 8) {
          return
        }
        return 'no-Image'
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "singer-list.styl"
</style>
