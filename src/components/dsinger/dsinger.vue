<template>
  <div class="singer">
    <div class="navigator border-1px-bottom">
      <div class="navigator-wrapper">
        <div class="icon">
          <i class="icon-search"></i>
        </div>
        <div class="tab" ref="tab">
          <ul class="tab-wrapper" ref="tabWrapper">
            <li @click="selectItem(tab,index)" class="tab-item" v-for="(tab,index) in data"
                :class="{'active': currentIndex === index}">
              <span>{{tab}}</span>
            </li>
          </ul>
        </div>
        <div class="button"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {tabsData} from 'common/js/config'
  import {prefixStyle} from 'common/js/dom'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  const MIN_LEFT_MOVE = -555
  const LEFT = 44
  const RECT_LEFT = 194
  export default {
    data() {
      return {
        prevIndex: null,
        currentIndex: 0
      }
    },
    created() {
      this.touch = {}
      this.data = tabsData.data
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
        this.touch.move = 0
        this.scroll.on('scroll', (pos) => {
        })
      },
      selectItem(item, index) {
        this.prevIndex = this.currentIndex
        this.currentIndex = index
        let children = this.$refs.tabWrapper.children[index]
        let rect = this.$refs.tabWrapper.getBoundingClientRect()
        let move
        console.log(rect)
        let time = 300
        if (rect.left <= 44 && this.currentIndex < 3) {
          move = 0
        } else {
          move = rect.left - LEFT + RECT_LEFT - children.getBoundingClientRect().left
        }
        if (rect.right >= 337 && this.currentIndex > 24) {
          move = -1055
        }
        this.$refs.tabWrapper.style[transform] = `translate3d(${move}px,0,0)`
        this.$refs.tabWrapper.style[transitionDuration] = `${time}ms`

        if (item === '热门') {
          item = 'all'
        }
        this._getSingerList(item)
      },
      _getSingerList(type) {
        getSingerList(type).then((res) => {
          if (res.code === ERR_OK) {
//            this.singers = this._formatSingerList(res.data.list)
//            console.log(this.singers)
            console.log(res.data)
          }
        })
      },
      /**
       * 原生JS滑动实现版
       * @param e
       */
      tabTouchStart(e) {
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.tabWrapper.getBoundingClientRect().left - LEFT
      },
      tabTouchMove(e) {
        this.touch.moveX = e.touches[0].pageX - this.touch.startX
        let width = Math.min(0, Math.max(MIN_LEFT_MOVE, this.touch.moveX + this.touch.left))
        this.$refs.tabWrapper.style[transform] = `translate3d(${width}px,0,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "dsinger.styl"
</style>
