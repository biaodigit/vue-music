<template>
  <transition name="fade">
    <div class="play-list" @click="hide" v-show="showFlag">
      <div class="play-list-wrapper border-1px-top" @click.stop>
        <div class="top">
          <i class="icon" :class="iconMode"></i>
          <span class="text">{{modeText}}</span>
          <span class="clear" @click="clearPlaylist">
            <i class="icon-clear"></i>
          </span>
        </div>
        <scroll :data="sequenceList" class="list" ref="scroll">
          <transition-group name="list" tag="ul" ref="list">
            <li :key="item.id" @click="selectItem(item)" class="item" v-for="item in sequenceList">
              <i class="current" :class="getCurrentCls(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span class="favourite">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="close" @click="hide">
          <span class="text">关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {playMode} from 'common/js/config'
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
          this.scrollToCurrentSong(this.currentSong)
        })
      },
      hide() {
        this.showFlag = false
      },
      getCurrentCls(item) {
        if (item.id === this.currentSong.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem(item) {
        let index = this.sequenceList.findIndex((song) => {
          return song.id === item.id
        })
        this.setCurrentIndex(index)
      },
      deleteItem(item) {
        if (this.isDeleting) {
          return
        }
        this.isDeleting = true
        this.deleteSong(item)
        setTimeout(() => {
          this.isDeleting = false
        }, 300)
      },
      scrollToCurrentSong(song) {
        let index = this.sequenceList.findIndex((item) => {
          return song.id === item.id
        })
        this.$refs.scroll.scrollToElement(this.$refs.list.$el.children[index], 300)
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      ...mapActions([
        'deleteSong',
        'clearPlaylist'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrentSong(newSong)
        }, 30)
      }
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
      },
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'mode'
      ])
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "play-list.styl"
</style>
