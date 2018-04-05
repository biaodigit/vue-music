<template>
  <div class="two-level-tab">
    <div class="navigator border-1px-bottom">
      <div class="navigator-wrapper">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="tab" ref="tab">
          <ul class="tab-wrapper" ref="tabWrapper">
            <li @click="selectItem(tab,index)" class="tab-item" v-for="(tab,index) in data"
                :class="{'active': currentIndex === index}">
              <span>{{tab}}</span>
            </li>
          </ul>
        </div>
        <div @click="open" class="button">
          <div class="icon"></div>
        </div>
        <transition name="fade">
          <div class="quick-entry-wrapper" @click="close" v-show="showEntry">
            <div class="quick-entry">
              <ul class="item-list">
                <li @click.stop="quickSelect(item,index)" class="item" v-for="(item,index) in data">
                  <span class="text" :class="{'active': currentIndex === index}">{{item}}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {prefixStyle} from 'common/js/dom'
  import {getSingerList} from 'api/singer'
  import Singer from 'common/js/singer'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  const MIN_LEFT_MOVE = -1050
  const LEFT = 44
  const RECT_LEFT = 194
  const DEFAULT_TYPE = 'all'
  const TIME = 300

  export default {
    data() {
      return {
        prevIndex: null,
        currentIndex: 0,
        scrollX: 0,
        singers: [],
        showEntry: false
      }
    },
    created() {
      this._getSingerList(DEFAULT_TYPE)
      this.touch = {}
    },
    mounted() {
      setTimeout(() => {
        this._initTabWidth()
        this._initScroll()
      }, 20)
    },
    methods: {
      _initTabWidth() {
        let tabs = this.$refs.tabWrapper.children
        let width = 0
        for (let tab of tabs) {
          width += tab.clientWidth
        }
        this.$refs.tabWrapper.style.width = `${width}px`
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.tab, {
          scrollX: true,
          scrollY: false
        })
      },
      selectItem(item, index) {
        this.touch.initiated = true
        this.prevIndex = this.currentIndex
        this.currentIndex = index
        let children = this.$refs.tabWrapper.children[index]
        let rect = this.$refs.tabWrapper.getBoundingClientRect()
        let move
        if (rect.left <= LEFT && this.currentIndex < 3) {
          move = 0
        } else {
          move = rect.left - LEFT + RECT_LEFT - children.getBoundingClientRect().left
        }
        if (this.currentIndex > 24) {
          move = MIN_LEFT_MOVE
        }
        this._wrapperMove(item, index, move)
      },
      open() {
        this.showEntry = !this.showEntry
      },
      close() {
        this.showEntry = false
      },
      quickSelect(item, index) {
        let rect = this.$refs.tabWrapper.getBoundingClientRect()
        let childRect = this.$refs.tabWrapper.children[index].getBoundingClientRect()
        let left = RECT_LEFT - childRect.left
        let move = Math.min(0, Math.max(MIN_LEFT_MOVE, rect.left - LEFT + left))
        this._wrapperMove(item, index, move)
      },
      _wrapperMove(item, index, move) {
        this.$refs.tabWrapper.style[transform] = `translate3d(${move}px,0,0)`
        this.$refs.tabWrapper.style[transitionDuration] = `${TIME}ms`
        this.scroll.x = move
        this.currentIndex = index
        this._getSingerList(item)
      },
      _getSingerList(type) {
        if (type === '热门') {
          type = 'all'
        }
        getSingerList(type).then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._formatSingerList(res.data.list)
          }
        })
      },
      _formatSingerList(list) {
        let ret = []
        list.forEach((singer) => {
          ret.push(new Singer({
            id: singer.Fsinger_mid,
            name: singer.Fsinger_name
          }))
        })
        return ret
      },
      selectSinger(item, index) {
        this.$router.push({
          path: `/singer/${item.id}`
        })
        this.setSinger(item)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      SingerList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "two-level-tab.styl"
</style>
