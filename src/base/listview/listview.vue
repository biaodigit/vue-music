<template>
  <scroll :data="data"
          :listen-scroll="listenScroll"
          :probeType="probeType"
          class="list-view"
          @scroll="scroll"
          ref="listview">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchmove.stop>
      <ul>
        <li class="list-shortcut-item"
            :class="{'active': currentIndex === index}"
            v-for="(item,index) in shortList"
            @click="scrollTo(index)">{{item}}
        </li>
      </ul>
    </div>
    <div class="top-title" ref="fixed" v-show="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'

  const TITLE_HEIGHT = 30
  export default {
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -1
      }
    },
    created() {
      this.listenScroll = true
      this.probeType = 3
      this.touch = {}
      this.listHeight = []
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      },
      scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 400)
        this.scrollY = this.$refs.listview.scroll.y
      },
      selectItem(item) {
        this.$emit('select', item)
      },
      _calculateHeight() {
        const list = this.$refs.listGroup

        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    computed: {
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      },
      shortList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      }
    },
    activated() {
      this.$refs.listview && this.$refs.listview.refresh()
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
          }
        }
      },
      diff(newDiff) {
        let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "listview.styl"
</style>
