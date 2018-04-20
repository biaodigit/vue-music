<template>
  <div class="singer">
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
                <li @click.stop="selectItem(item,index)" class="item" v-for="(item,index) in data">
                  <span class="text" :class="{'active': currentIndex === index}">{{item}}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <singer-list @select="selectSinger" :type="type" :singers="singers"></singer-list>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import SingerList from 'components/singer-list/singer-list'
  import {tabsData} from 'common/js/config'
  import {prefixStyle} from 'common/js/dom'
  import {getSingerList} from 'api/singer'
  import Singer from 'common/js/singer'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  const MAX_LEFT_MOVE = -1050
  const DEFAULT_TYPE = '热门'
  const TIME = 300
  const charCodeC = 67
  const distance = -50
  const HOT = '热门'

  export default {
    data() {
      return {
        prevIndex: null,
        currentIndex: 0,
        scrollX: 0,
        singers: [],
        showEntry: false,
        type: true
      }
    },
    created() {
      this._getSingerList(DEFAULT_TYPE)
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
      // region 初始化模块
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
      _getSingerList(type) {
        if (type === HOT) {
          type = 'all'
          this.type = true
        } else {
          this.type = false
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
      // endregion

      // region 横向滚动导航入口
      selectItem(item, index) {
        let move
        if (item === HOT) {
          move = 0
        } else {
          move = Math.min(0, Math.max(MAX_LEFT_MOVE, (item.charCodeAt() - charCodeC) * distance))
        }
        this._wrapperMove(item, index, move)
      },
      // endregion

      // region 快速入口模块
      open() {
        this.showEntry = !this.showEntry
      },
      close() {
        this.showEntry = false
      },
      // endregion

      // region 抽象函数模块
      _wrapperMove(item, index, move) {
        this.$refs.tabWrapper.style[transform] = `translate3d(${move}px,0,0)`
        this.$refs.tabWrapper.style[transitionDuration] = `${TIME}ms`
        this.scroll.x = move
        this.currentIndex = index
        this._getSingerList(item)
      },
      // endregion

      // region 跳转详情页
      selectSinger(item, index) {
        this.$router.push({
          path: `/singer/${item.id}`
        })
        this.setSinger(item)
      },
      // endregion
      /**
       * 原生JS滑动实现版
       * @param e
       */
      // tabTouchStart(e) {
      //   this.touch.startX = e.touches[0].pageX
      //   this.touch.left = this.$refs.tabWrapper.getBoundingClientRect().left - LEFT
      // },
      // tabTouchMove(e) {
      //   this.touch.moveX = e.touches[0].pageX - this.touch.startX
      //   let width = Math.min(0, Math.max(MAX_LEFT_MOVE, this.touch.moveX + this.touch.left))
      //   this.$refs.tabWrapper.style[transform] = `translate3d(${width}px,0,0)`
      //   this.$refs.tabWrapper.style.left = `${width}px`
      // },
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
  @import "singer.styl"
</style>
